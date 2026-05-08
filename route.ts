// app/api/webhooks/vapi/route.ts
// Receives VAPI call-end webhook, stores call data, triggers analysis

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { analyzeCall } from '@/lib/voltr/analyzer'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

// VAPI sends this payload on call end
interface VAPICallEndPayload {
  message: {
    type: 'end-of-call-report'
    call: {
      id: string
      phoneNumber?: { number: string }
      customer?: { name?: string; number?: string }
      startedAt: string
      endedAt: string
      artifact?: {
        recordingUrl?: string
        transcript?: string
        messages?: Array<{
          role: 'bot' | 'user' | 'system'
          message: string
          time: number        // ms from call start
          endTime: number
          secondsFromStart: number
        }>
      }
    }
  }
}

export async function POST(req: NextRequest) {
  // Verify VAPI webhook secret
  const secret = req.headers.get('x-vapi-secret')
  if (secret !== process.env.VAPI_WEBHOOK_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let payload: VAPICallEndPayload
  try {
    payload = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 })
  }

  if (payload.message?.type !== 'end-of-call-report') {
    return NextResponse.json({ received: true }) // Ignore non-end events
  }

  const call = payload.message.call

  try {
    // 1. Upsert call record
    const { data: callRecord, error: callError } = await supabase
      .from('voltr_calls')
      .upsert({
        vapi_call_id: call.id,
        phone_number: call.customer?.number ?? call.phoneNumber?.number,
        caller_name: call.customer?.name ?? null,
        started_at: call.startedAt,
        ended_at: call.endedAt,
        duration_seconds: call.endedAt && call.startedAt
          ? Math.round((new Date(call.endedAt).getTime() - new Date(call.startedAt).getTime()) / 1000)
          : null,
        recording_url: call.artifact?.recordingUrl ?? null,
        status: 'processing',
      }, { onConflict: 'vapi_call_id' })
      .select()
      .single()

    if (callError || !callRecord) {
      console.error('[Voltr] Failed to upsert call:', callError)
      return NextResponse.json({ error: 'DB error' }, { status: 500 })
    }

    // 2. Store transcript turns
    const messages = call.artifact?.messages ?? []
    const turns = messages
      .filter(m => m.role === 'bot' || m.role === 'user')
      .map((m, i) => ({
        index: i,
        role: m.role === 'bot' ? 'agent' : 'user',
        text: m.message,
        timestamp_ms: m.time,
        seconds_from_start: m.secondsFromStart,
      }))

    const rawText = turns.map(t => `${t.role.toUpperCase()}: ${t.text}`).join('\n')

    await supabase.from('voltr_transcripts').upsert({
      call_id: callRecord.id,
      turns,
      raw_text: rawText,
    }, { onConflict: 'call_id' })

    // 3. Trigger async analysis (non-blocking — respond to VAPI immediately)
    analyzeCall({
      callId: callRecord.id,
      turns,
      rawText,
      durationSeconds: callRecord.duration_seconds,
    }).catch(err => console.error('[Voltr] Analysis failed for', callRecord.id, err))

    return NextResponse.json({ received: true, callId: callRecord.id })
  } catch (err) {
    console.error('[Voltr] Webhook error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}
