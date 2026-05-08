// lib/voltr/analyzer.ts
// Runs full Claude analysis after a call ends:
// - Per-turn sentiment
// - Objection detection + suggested responses
// - Script coaching alerts
// - Goal completion likelihood
// - Summary, tags, strengths, improvements, script suggestions

import Anthropic from '@anthropic-ai/sdk'
import { createClient } from '@supabase/supabase-js'

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! })
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface Turn {
  index: number
  role: 'agent' | 'user'
  text: string
  seconds_from_start: number
}

interface AnalyzeCallInput {
  callId: string
  turns: Turn[]
  rawText: string
  durationSeconds: number | null
}

// ─── Main entry ──────────────────────────────────────────────────────────────

export async function analyzeCall(input: AnalyzeCallInput) {
  const { callId, turns, rawText, durationSeconds } = input

  try {
    // Run all analyses in parallel
    const [sentimentResult, fullAnalysis] = await Promise.all([
      analyzeSentimentPerTurn(turns),
      analyzeFullCall(rawText, durationSeconds),
    ])

    // Write everything to Supabase
    await Promise.all([
      storeSentiment(callId, sentimentResult),
      storeFullAnalysis(callId, fullAnalysis),
      storeObjections(callId, fullAnalysis.objections),
      storeCoachingAlerts(callId, fullAnalysis.coaching_alerts),
      updateObjectionStats(fullAnalysis.objections),
    ])

    // Mark call as complete
    await supabase
      .from('voltr_calls')
      .update({ status: 'complete' })
      .eq('id', callId)

  } catch (err) {
    await supabase
      .from('voltr_calls')
      .update({ status: 'failed' })
      .eq('id', callId)
    throw err
  }
}

// ─── Per-turn sentiment ───────────────────────────────────────────────────────

async function analyzeSentimentPerTurn(turns: Turn[]) {
  const prompt = `You are a call sentiment analyzer. For each turn in this sales call transcript, return a JSON array with sentiment scores.

TRANSCRIPT TURNS:
${turns.map(t => `[${t.index}] ${t.role.toUpperCase()}: ${t.text}`).join('\n')}

Return ONLY a JSON array. Each item must have:
- turn_index: number
- role: "agent" | "user"  
- score: number 0.0-10.0 (0=very negative, 5=neutral, 10=very positive)
- emotion: "positive" | "neutral" | "negative" | "frustrated" | "excited" | "hesitant" | "interested"

No markdown, no explanation, only the JSON array.`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
  return JSON.parse(text.trim()) as Array<{
    turn_index: number
    role: string
    score: number
    emotion: string
  }>
}

// ─── Full call analysis ───────────────────────────────────────────────────────

async function analyzeFullCall(rawText: string, durationSeconds: number | null) {
  const prompt = `You are an expert sales call analyst reviewing a VAPI AI voice agent call. Analyze this transcript and return structured JSON.

CALL DURATION: ${durationSeconds ? `${durationSeconds}s` : 'unknown'}

TRANSCRIPT:
${rawText}

Return ONLY valid JSON with this exact structure (no markdown):
{
  "overall_sentiment_score": <0.0-10.0>,
  "goal_completion": <true|false>,
  "goal_completion_likelihood": <0.0-1.0>,
  "outcome_tag": <"booked"|"follow_up"|"not_interested"|"callback"|"referred"|"voicemail"|"unknown">,
  "summary": "<2-3 sentence summary of what happened>",
  "tags": ["<tag1>", "<tag2>"],
  
  "objections": [
    {
      "turn_index": <number>,
      "phrase": "<exact phrase from transcript>",
      "category": <"price"|"timing"|"competitor"|"interest"|"other">,
      "suggested_response": "<improved agent response to this specific objection>"
    }
  ],
  
  "coaching_alerts": [
    {
      "severity": <"warning"|"critical"|"positive">,
      "category": <"pacing"|"pricing_disclosure"|"objection_missed"|"rapport"|"close"|"opener"|"value_prop">,
      "timestamp_s": <second in call or null>,
      "message": "<specific, actionable coaching note>"
    }
  ],
  
  "strengths": [
    { "point": "<specific thing the agent did well>" }
  ],
  
  "improvements": [
    {
      "point": "<specific issue>",
      "suggestion": "<concrete fix>"
    }
  ],
  
  "script_suggestions": [
    {
      "original": "<exact phrase agent used>",
      "suggested": "<improved version>",
      "reason": "<why this change improves outcomes>"
    }
  ]
}`

  const response = await anthropic.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4000,
    messages: [{ role: 'user', content: prompt }],
  })

  const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
  return JSON.parse(text.trim())
}

// ─── Storage helpers ──────────────────────────────────────────────────────────

async function storeSentiment(callId: string, sentimentRows: any[]) {
  if (!sentimentRows?.length) return
  const rows = sentimentRows.map(s => ({
    call_id: callId,
    turn_index: s.turn_index,
    role: s.role,
    score: s.score,
    emotion: s.emotion,
  }))
  await supabase.from('voltr_sentiment').insert(rows)
}

async function storeFullAnalysis(callId: string, analysis: any) {
  await supabase.from('voltr_analysis').upsert({
    call_id: callId,
    overall_sentiment_score: analysis.overall_sentiment_score,
    goal_completion: analysis.goal_completion,
    goal_completion_likelihood: analysis.goal_completion_likelihood,
    outcome_tag: analysis.outcome_tag,
    summary: analysis.summary,
    tags: analysis.tags,
    strengths: analysis.strengths,
    improvements: analysis.improvements,
    script_suggestions: analysis.script_suggestions,
  }, { onConflict: 'call_id' })
}

async function storeObjections(callId: string, objections: any[]) {
  if (!objections?.length) return
  const rows = objections.map(o => ({
    call_id: callId,
    turn_index: o.turn_index,
    phrase: o.phrase,
    category: o.category,
    suggested_response: o.suggested_response,
  }))
  await supabase.from('voltr_objections').insert(rows)
}

async function storeCoachingAlerts(callId: string, alerts: any[]) {
  if (!alerts?.length) return
  const rows = alerts.map(a => ({
    call_id: callId,
    severity: a.severity,
    category: a.category,
    timestamp_s: a.timestamp_s,
    message: a.message,
  }))
  await supabase.from('voltr_coaching_alerts').insert(rows)
}

async function updateObjectionStats(objections: any[]) {
  if (!objections?.length) return
  for (const obj of objections) {
    await supabase.rpc('increment_objection_stat', {
      p_phrase: obj.phrase,
      p_category: obj.category,
    })
  }
}
