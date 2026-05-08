'use client'

// app/voltr/page.tsx
// Voltr — Call Intelligence Dashboard
// Realtime updates via Supabase channels. Analysis runs post-call via Claude.

import { useState, useEffect, useCallback } from 'react'
import {
  useVoltrRealtime,
  fetchRecentCalls,
  fetchCallDetail,
  fetchDashboardMetrics,
  fetchObjectionStats,
} from '@/lib/voltr/useVoltrRealtime'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Call {
  id: string
  vapi_call_id: string
  caller_name: string | null
  phone_number: string | null
  started_at: string
  ended_at: string
  duration_seconds: number | null
  recording_url: string | null
  status: 'pending' | 'processing' | 'complete' | 'failed'
  overall_sentiment_score: number | null
  goal_completion: boolean | null
  goal_completion_likelihood: number | null
  outcome_tag: string | null
  summary: string | null
  tags: string[] | null
}

interface Metrics {
  total_calls: number
  avg_sentiment: number
  avg_duration: number
  goal_completion_rate: number
  outcome_breakdown: Record<string, number>
}

interface CallDetail {
  call: Call | null
  transcript: { turns: any[]; raw_text: string } | null
  sentiment: any[] | null
  objections: any[] | null
  coaching: any[] | null
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmtDuration(s: number | null) {
  if (!s) return '—'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function fmtDate(iso: string) {
  const d = new Date(iso)
  const today = new Date()
  const diff = today.getDate() - d.getDate()
  if (diff === 0) return `Today ${fmtTime(iso)}`
  if (diff === 1) return `Yesterday ${fmtTime(iso)}`
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ` ${fmtTime(iso)}`
}

function sentimentColor(score: number | null) {
  if (score == null) return 'var(--color-text-secondary)'
  if (score >= 7) return '#3B6D11'
  if (score >= 4) return '#854F0B'
  return '#A32D2D'
}

function sentimentBg(score: number | null) {
  if (score == null) return 'var(--color-background-secondary)'
  if (score >= 7) return '#EAF3DE'
  if (score >= 4) return '#FAEEDA'
  return '#FCEBEB'
}

function outcomeLabel(tag: string | null) {
  const map: Record<string, string> = {
    booked: '🗓 Booked',
    follow_up: '📋 Follow-up',
    not_interested: '✗ Not interested',
    callback: '↩ Callback',
    referred: '→ Referred',
    voicemail: '📨 Voicemail',
    unknown: '? Unknown',
  }
  return map[tag ?? 'unknown'] ?? tag ?? '?'
}

function severityStyle(severity: string) {
  if (severity === 'critical') return { bg: '#FCEBEB', color: '#A32D2D', icon: '⚠' }
  if (severity === 'warning') return { bg: '#FAEEDA', color: '#854F0B', icon: '△' }
  return { bg: '#EAF3DE', color: '#3B6D11', icon: '✓' }
}

// ─── Subcomponents ────────────────────────────────────────────────────────────

function MetricCard({ label, value, sub, delta }: {
  label: string; value: string; sub?: string; delta?: { val: string; up: boolean }
}) {
  return (
    <div style={{
      background: 'var(--color-background-secondary)',
      borderRadius: 10,
      padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</div>
      <div style={{ fontSize: 24, fontWeight: 600, fontFamily: 'var(--font-mono)' }}>{value}</div>
      {delta && (
        <div style={{ fontSize: 11, marginTop: 4, color: delta.up ? '#3B6D11' : '#A32D2D' }}>
          {delta.up ? '↑' : '↓'} {delta.val}
        </div>
      )}
      {sub && <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 4 }}>{sub}</div>}
    </div>
  )
}

function ProcessingPill() {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      background: '#EEEDFE', color: '#534AB7',
      fontSize: 11, padding: '2px 8px', borderRadius: 20, fontWeight: 500
    }}>
      <span style={{ animation: 'spin 1s linear infinite', display: 'inline-block' }}>⟳</span> Analyzing
    </span>
  )
}

function SentimentBar({ turns, sentiment }: { turns: any[]; sentiment: any[] | null }) {
  if (!turns?.length || !sentiment?.length) return null
  return (
    <div style={{ display: 'flex', gap: 2, margin: '8px 0', height: 6 }}>
      {turns.map((_, i) => {
        const s = sentiment?.find(x => x.turn_index === i)
        const score = s?.score ?? 5
        const bg = score >= 7 ? '#639922' : score >= 4 ? '#EF9F27' : '#E24B4A'
        return (
          <div key={i} title={`Turn ${i}: ${score?.toFixed(1)}`}
            style={{ flex: 1, background: bg, borderRadius: 2 }} />
        )
      })}
    </div>
  )
}

// ─── Call Detail Panel ────────────────────────────────────────────────────────

function CallDetailPanel({ callId, onClose }: { callId: string; onClose: () => void }) {
  const [detail, setDetail] = useState<CallDetail | null>(null)
  const [tab, setTab] = useState<'transcript' | 'coaching' | 'objections' | 'suggestions'>('transcript')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchCallDetail(callId).then(d => {
      setDetail(d as CallDetail)
      setLoading(false)
    })
  }, [callId])

  if (loading) return (
    <div style={panelStyle}>
      <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
        Loading call detail…
      </div>
    </div>
  )

  const { call, transcript, sentiment, objections, coaching } = detail ?? {}
  const analysis = call

  return (
    <div style={panelStyle}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 14 }}>{call?.caller_name ?? call?.phone_number ?? 'Unknown caller'}</div>
          <div style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{call?.started_at ? fmtDate(call.started_at) : ''} · {fmtDuration(call?.duration_seconds ?? null)}</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {call?.outcome_tag && (
            <span style={{ fontSize: 11, padding: '2px 8px', borderRadius: 20, background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
              {outcomeLabel(call.outcome_tag)}
            </span>
          )}
          {call?.overall_sentiment_score != null && (
            <span style={{ fontSize: 13, fontWeight: 600, color: sentimentColor(call.overall_sentiment_score) }}>
              {call.overall_sentiment_score.toFixed(1)}
            </span>
          )}
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 18, color: 'var(--color-text-secondary)', lineHeight: 1 }}>×</button>
        </div>
      </div>

      {/* Summary */}
      {analysis?.summary && (
        <div style={{ padding: '10px 16px', background: 'var(--color-background-secondary)', fontSize: 12, lineHeight: 1.6, color: 'var(--color-text-secondary)', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          {analysis.summary}
        </div>
      )}

      {/* Sentiment sparkline */}
      {transcript?.turns && (
        <div style={{ padding: '8px 16px', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
          <div style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Sentiment across call</div>
          <SentimentBar turns={transcript.turns} sentiment={sentiment ?? []} />
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '0 16px' }}>
        {(['transcript', 'coaching', 'objections', 'suggestions'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            background: 'none', border: 'none', borderBottom: `2px solid ${tab === t ? '#7F77DD' : 'transparent'}`,
            color: tab === t ? '#7F77DD' : 'var(--color-text-secondary)',
            fontSize: 12, padding: '8px 12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize'
          }}>
            {t === 'suggestions' ? 'Script fixes' : t}
            {t === 'coaching' && coaching?.length ? <span style={{ marginLeft: 4, background: '#FAEEDA', color: '#854F0B', borderRadius: 20, fontSize: 10, padding: '1px 5px' }}>{coaching.length}</span> : null}
            {t === 'objections' && objections?.length ? <span style={{ marginLeft: 4, background: '#FCEBEB', color: '#A32D2D', borderRadius: 20, fontSize: 10, padding: '1px 5px' }}>{objections.length}</span> : null}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '12px 16px' }}>

        {tab === 'transcript' && transcript?.turns?.map((turn: any, i: number) => {
          const s = sentiment?.find(x => x.turn_index === i)
          return (
            <div key={i} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <div style={{ width: 7, height: 7, borderRadius: '50%', background: turn.role === 'agent' ? '#7F77DD' : '#1D9E75', flexShrink: 0 }} />
                <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  {turn.role === 'agent' ? 'VAPI Agent' : 'Caller'}
                </span>
                {turn.seconds_from_start != null && (
                  <span style={{ fontSize: 10, color: 'var(--color-text-secondary)', marginLeft: 'auto' }}>{fmtDuration(turn.seconds_from_start)}</span>
                )}
                {s?.score != null && (
                  <span style={{ fontSize: 10, fontWeight: 600, color: sentimentColor(s.score), background: sentimentBg(s.score), borderRadius: 20, padding: '1px 6px', marginLeft: 4 }}>{s.score.toFixed(1)}</span>
                )}
              </div>
              <div style={{ background: 'var(--color-background-secondary)', borderRadius: 8, padding: '8px 10px', fontSize: 12, lineHeight: 1.6 }}>
                {turn.text}
              </div>
            </div>
          )
        })}

        {tab === 'coaching' && (
          <>
            {!coaching?.length && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>No coaching alerts for this call.</div>}
            {coaching?.map((alert: any, i: number) => {
              const style = severityStyle(alert.severity)
              return (
                <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
                  <div style={{ width: 26, height: 26, borderRadius: 8, background: style.bg, color: style.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, flexShrink: 0 }}>{style.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 500, color: style.color, textTransform: 'capitalize', marginBottom: 2 }}>{alert.category.replace(/_/g, ' ')}{alert.timestamp_s != null ? ` · ${fmtDuration(alert.timestamp_s)}` : ''}</div>
                    <div style={{ fontSize: 12, lineHeight: 1.6 }}>{alert.message}</div>
                  </div>
                </div>
              )
            })}
          </>
        )}

        {tab === 'objections' && (
          <>
            {!objections?.length && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>No objections detected.</div>}
            {objections?.map((obj: any, i: number) => (
              <div key={i} style={{ marginBottom: 12, borderRadius: 8, border: '0.5px solid var(--color-border-tertiary)', overflow: 'hidden' }}>
                <div style={{ background: '#FCEBEB', padding: '7px 10px', fontSize: 11, fontWeight: 500, color: '#A32D2D', display: 'flex', justifyContent: 'space-between' }}>
                  <span>"{obj.phrase}"</span>
                  <span style={{ textTransform: 'capitalize', opacity: 0.8 }}>{obj.category}</span>
                </div>
                <div style={{ padding: '8px 10px', fontSize: 12, lineHeight: 1.6, background: 'var(--color-background-primary)' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-text-secondary)', marginBottom: 4 }}>Suggested response</div>
                  {obj.suggested_response}
                </div>
              </div>
            ))}
          </>
        )}

        {tab === 'suggestions' && (() => {
          const suggestions = (analysis as any)?.script_suggestions
          return (
            <>
              {!suggestions?.length && <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>No script suggestions for this call.</div>}
              {suggestions?.map((s: any, i: number) => (
                <div key={i} style={{ marginBottom: 12, borderLeft: '3px solid #7F77DD', background: 'var(--color-background-secondary)', borderRadius: '0 8px 8px 0', padding: '10px 12px' }}>
                  <div style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#534AB7', marginBottom: 4 }}>Script fix #{i + 1}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginBottom: 4, textDecoration: 'line-through' }}>{s.original}</div>
                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 6 }}>{s.suggested}</div>
                  <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontStyle: 'italic' }}>{s.reason}</div>
                </div>
              ))}
            </>
          )
        })()}
      </div>
    </div>
  )
}

const panelStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  right: 0,
  bottom: 0,
  width: 420,
  background: 'var(--color-background-primary)',
  borderLeft: '0.5px solid var(--color-border-secondary)',
  zIndex: 100,
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'hidden',
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function VoltrPage() {
  const [calls, setCalls] = useState<Call[]>([])
  const [metrics, setMetrics] = useState<Metrics | null>(null)
  const [objectionStats, setObjectionStats] = useState<any[]>([])
  const [selectedCallId, setSelectedCallId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'flagged' | 'complete' | 'processing'>('all')
  const [newCallIds, setNewCallIds] = useState<Set<string>>(new Set())

  const refresh = useCallback(async () => {
    const [c, m, o] = await Promise.all([
      fetchRecentCalls(100),
      fetchDashboardMetrics(7),
      fetchObjectionStats(8),
    ])
    setCalls((c ?? []) as Call[])
    setMetrics(m)
    setObjectionStats(o ?? [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  useVoltrRealtime({
    onNewCall: (id) => {
      setNewCallIds(prev => new Set([...prev, id]))
      refresh()
    },
    onCallStatusChange: (id, status) => {
      setCalls(prev => prev.map(c => c.id === id ? { ...c, status: status as any } : c))
      if (status === 'complete') refresh()
    },
    onAnalysisReady: (callId) => {
      setCalls(prev => prev.map(c => c.id === callId ? { ...c, status: 'complete' } : c))
      refresh()
    },
  })

  const filteredCalls = calls.filter(c => {
    if (filter === 'all') return true
    if (filter === 'flagged') return c.overall_sentiment_score != null && c.overall_sentiment_score < 4
    if (filter === 'processing') return c.status === 'pending' || c.status === 'processing'
    if (filter === 'complete') return c.status === 'complete'
    return true
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh', color: 'var(--color-text-secondary)', fontSize: 13 }}>
        Loading Voltr…
      </div>
    )
  }

  const processingCount = calls.filter(c => c.status === 'pending' || c.status === 'processing').length

  return (
    <>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }
        @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .call-row-item:hover { background: var(--color-background-secondary) !important; cursor: pointer; }
        .tab-btn { transition: color 0.15s, border-color 0.15s; }
        .filter-btn { transition: background 0.15s, color 0.15s; }
        .filter-btn:hover { background: var(--color-background-secondary) !important; }
      `}</style>

      <div style={{ padding: '1.5rem', maxWidth: 1100, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h1 style={{ fontSize: 22, fontWeight: 600, letterSpacing: '-0.5px' }}>
              <span style={{ color: '#7F77DD' }}>Voltr</span>
            </h1>
            <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>Call Intelligence</span>
            {processingCount > 0 && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, background: '#EEEDFE', color: '#534AB7', fontSize: 11, padding: '3px 10px', borderRadius: 20, fontWeight: 500, animation: 'pulse 1.5s ease-in-out infinite' }}>
                ⟳ {processingCount} analyzing
              </span>
            )}
          </div>
          <button
            onClick={refresh}
            style={{ background: 'var(--color-background-secondary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 8, padding: '6px 14px', fontSize: 12, cursor: 'pointer', color: 'var(--color-text-secondary)' }}
          >
            ↻ Refresh
          </button>
        </div>

        {/* Metrics */}
        {metrics && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: '1.25rem' }}>
            <MetricCard label="Total calls (7d)" value={String(metrics.total_calls)} />
            <MetricCard label="Avg sentiment" value={metrics.avg_sentiment ? `${metrics.avg_sentiment.toFixed(1)}/10` : '—'} />
            <MetricCard label="Avg duration" value={fmtDuration(Math.round(metrics.avg_duration))} />
            <MetricCard label="Goal completion" value={metrics.goal_completion_rate ? `${Math.round(metrics.goal_completion_rate * 100)}%` : '—'} />
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 12 }}>

          {/* Call list */}
          <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12 }}>
            {/* Filters */}
            <div style={{ display: 'flex', gap: 0, borderBottom: '0.5px solid var(--color-border-tertiary)', padding: '0 12px' }}>
              {(['all', 'complete', 'processing', 'flagged'] as const).map(f => (
                <button key={f} className="filter-btn tab-btn" onClick={() => setFilter(f)} style={{
                  background: 'none', border: 'none', borderBottom: `2px solid ${filter === f ? '#7F77DD' : 'transparent'}`,
                  color: filter === f ? '#7F77DD' : 'var(--color-text-secondary)',
                  fontSize: 12, padding: '10px 12px', cursor: 'pointer', fontFamily: 'var(--font-sans)', textTransform: 'capitalize'
                }}>
                  {f === 'flagged' ? '⚠ Low sentiment' : f === 'processing' ? '⟳ Processing' : f}
                </button>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', paddingRight: 4 }}>
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)' }}>{filteredCalls.length} calls</span>
              </div>
            </div>

            {/* Rows */}
            <div style={{ maxHeight: 520, overflow: 'auto' }}>
              {!filteredCalls.length && (
                <div style={{ padding: 32, textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: 13 }}>
                  No calls found.
                </div>
              )}
              {filteredCalls.map(call => (
                <div
                  key={call.id}
                  className="call-row-item"
                  onClick={() => setSelectedCallId(call.id)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '10px 14px',
                    borderBottom: '0.5px solid var(--color-border-tertiary)',
                    background: selectedCallId === call.id ? 'var(--color-background-secondary)' : 'transparent',
                    transition: 'background 0.12s',
                  }}
                >
                  {/* Avatar */}
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                    background: call.overall_sentiment_score != null ? sentimentBg(call.overall_sentiment_score) : 'var(--color-background-secondary)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 11, fontWeight: 600,
                    color: call.overall_sentiment_score != null ? sentimentColor(call.overall_sentiment_score) : 'var(--color-text-secondary)',
                  }}>
                    {call.caller_name
                      ? call.caller_name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()
                      : '?'}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                      {call.caller_name ?? call.phone_number ?? 'Unknown'}
                      {newCallIds.has(call.id) && <span style={{ fontSize: 9, background: '#534AB7', color: '#fff', borderRadius: 20, padding: '1px 5px', fontWeight: 600 }}>NEW</span>}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--color-text-secondary)', marginTop: 1, display: 'flex', gap: 8 }}>
                      <span>{call.started_at ? fmtDate(call.started_at) : '—'}</span>
                      <span>·</span>
                      <span>{fmtDuration(call.duration_seconds)}</span>
                    </div>
                  </div>

                  {/* Tags */}
                  <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', maxWidth: 140, justifyContent: 'flex-end' }}>
                    {call.status === 'processing' || call.status === 'pending' ? (
                      <ProcessingPill />
                    ) : call.outcome_tag ? (
                      <span style={{ fontSize: 10, padding: '2px 7px', borderRadius: 20, background: 'var(--color-background-secondary)', color: 'var(--color-text-secondary)' }}>
                        {outcomeLabel(call.outcome_tag)}
                      </span>
                    ) : null}
                  </div>

                  {/* Score */}
                  <div style={{ fontSize: 14, fontWeight: 600, minWidth: 32, textAlign: 'right', color: sentimentColor(call.overall_sentiment_score) }}>
                    {call.overall_sentiment_score != null ? call.overall_sentiment_score.toFixed(1) : '—'}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar: objection stats */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: '14px' }}>
              <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
                Top objections
                <span style={{ fontSize: 11, color: 'var(--color-text-secondary)', fontWeight: 400 }}>all time</span>
              </div>
              {objectionStats.length === 0 && (
                <div style={{ fontSize: 12, color: 'var(--color-text-secondary)' }}>No data yet.</div>
              )}
              {objectionStats.map((obj: any, i: number) => {
                const max = objectionStats[0]?.count ?? 1
                const pct = Math.round((obj.count / max) * 100)
                return (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, marginBottom: 3 }}>
                      <span style={{ color: 'var(--color-text-primary)', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>"{obj.phrase}"</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{obj.count}×</span>
                    </div>
                    <div style={{ height: 5, background: 'var(--color-background-secondary)', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#E24B4A', borderRadius: 3 }} />
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Outcome breakdown */}
            {metrics?.outcome_breakdown && (
              <div style={{ background: 'var(--color-background-primary)', border: '0.5px solid var(--color-border-tertiary)', borderRadius: 12, padding: '14px' }}>
                <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 12 }}>Outcomes (7d)</div>
                {Object.entries(metrics.outcome_breakdown)
                  .sort(([, a], [, b]) => (b as number) - (a as number))
                  .map(([tag, count]) => (
                    <div key={tag} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, padding: '4px 0', borderBottom: '0.5px solid var(--color-border-tertiary)' }}>
                      <span>{outcomeLabel(tag)}</span>
                      <span style={{ color: 'var(--color-text-secondary)' }}>{count as number}</span>
                    </div>
                  ))}
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Slide-in detail panel */}
      {selectedCallId && (
        <CallDetailPanel
          callId={selectedCallId}
          onClose={() => setSelectedCallId(null)}
        />
      )}
    </>
  )
}
