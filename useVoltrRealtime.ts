// lib/voltr/useVoltrRealtime.ts
// Subscribes to Supabase realtime on voltr_calls + voltr_analysis
// so the dashboard updates the moment a call is processed

import { useEffect, useCallback } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

interface UseVoltrRealtimeOptions {
  onCallStatusChange?: (callId: string, status: string) => void
  onAnalysisReady?: (callId: string) => void
  onNewCall?: (callId: string) => void
}

export function useVoltrRealtime({
  onCallStatusChange,
  onAnalysisReady,
  onNewCall,
}: UseVoltrRealtimeOptions) {
  useEffect(() => {
    const channel = supabase
      .channel('voltr-live')
      // New call arrives (status: pending → processing)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'voltr_calls' },
        (payload) => {
          onNewCall?.(payload.new.id)
        }
      )
      // Call status updates (processing → complete | failed)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'voltr_calls' },
        (payload) => {
          onCallStatusChange?.(payload.new.id, payload.new.status)
        }
      )
      // Analysis row inserted = analysis is ready
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'voltr_analysis' },
        (payload) => {
          onAnalysisReady?.(payload.new.call_id)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [onCallStatusChange, onAnalysisReady, onNewCall])
}

// ─── Data fetching helpers ────────────────────────────────────────────────────

export async function fetchRecentCalls(limit = 50) {
  const { data, error } = await supabase
    .from('voltr_calls_with_analysis')
    .select('*')
    .order('started_at', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}

export async function fetchCallDetail(callId: string) {
  const [call, transcript, sentiment, objections, coaching] = await Promise.all([
    supabase
      .from('voltr_calls_with_analysis')
      .select('*')
      .eq('id', callId)
      .single(),
    supabase
      .from('voltr_transcripts')
      .select('turns, raw_text')
      .eq('call_id', callId)
      .single(),
    supabase
      .from('voltr_sentiment')
      .select('*')
      .eq('call_id', callId)
      .order('turn_index'),
    supabase
      .from('voltr_objections')
      .select('*')
      .eq('call_id', callId)
      .order('turn_index'),
    supabase
      .from('voltr_coaching_alerts')
      .select('*')
      .eq('call_id', callId)
      .order('timestamp_s'),
  ])

  return {
    call: call.data,
    transcript: transcript.data,
    sentiment: sentiment.data,
    objections: objections.data,
    coaching: coaching.data,
  }
}

export async function fetchDashboardMetrics(days = 7) {
  const since = new Date(Date.now() - days * 86400000).toISOString()

  const { data, error } = await supabase
    .from('voltr_calls_with_analysis')
    .select('duration_seconds, overall_sentiment_score, goal_completion, outcome_tag, started_at')
    .gte('started_at', since)
    .not('status', 'eq', 'pending')

  if (error) throw error

  const calls = data ?? []
  const completed = calls.filter(c => c.overall_sentiment_score != null)

  return {
    total_calls: calls.length,
    avg_sentiment: completed.length
      ? completed.reduce((s, c) => s + (c.overall_sentiment_score ?? 0), 0) / completed.length
      : 0,
    avg_duration: calls.filter(c => c.duration_seconds).length
      ? calls.reduce((s, c) => s + (c.duration_seconds ?? 0), 0) / calls.filter(c => c.duration_seconds).length
      : 0,
    goal_completion_rate: completed.length
      ? completed.filter(c => c.goal_completion).length / completed.length
      : 0,
    outcome_breakdown: calls.reduce((acc: Record<string, number>, c) => {
      const tag = c.outcome_tag ?? 'unknown'
      acc[tag] = (acc[tag] ?? 0) + 1
      return acc
    }, {}),
  }
}

export async function fetchObjectionStats(limit = 10) {
  const { data, error } = await supabase
    .from('voltr_objection_stats')
    .select('*')
    .order('count', { ascending: false })
    .limit(limit)
  if (error) throw error
  return data
}
