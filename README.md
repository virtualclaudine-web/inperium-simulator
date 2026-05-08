# Voltr — Call Intelligence for Forge

AI-powered post-call analysis for your VAPI voice agent.  
Runs on your existing Vercel + GitHub + Supabase stack.

---

## Architecture

```
VAPI call ends
     │
     ▼
POST /api/webhooks/vapi          ← Next.js API route
     │  (responds 200 immediately)
     │
     ├─► Upsert voltr_calls       ← Supabase (status: processing)
     ├─► Store voltr_transcripts
     │
     └─► analyzeCall()            ← Fires async, non-blocking
              │
              ├─► Claude: per-turn sentiment
              ├─► Claude: full call analysis
              │     ├─ overall sentiment score
              │     ├─ goal completion + likelihood
              │     ├─ outcome tag
              │     ├─ summary
              │     ├─ objections + suggested responses
              │     ├─ coaching alerts
              │     ├─ strengths / improvements
              │     └─ script suggestions
              │
              ├─► Store voltr_sentiment
              ├─► Store voltr_analysis
              ├─► Store voltr_objections
              ├─► Store voltr_coaching_alerts
              └─► Update voltr_calls (status: complete)
                       │
                       ▼
              Supabase Realtime fires
                       │
                       ▼
              Dashboard updates live
```

---

## Setup

### 1. Supabase migrations

```bash
supabase db push
# or run manually:
# migrations/001_voltr.sql
# migrations/002_voltr_functions.sql
```

### 2. Environment variables

Copy `.env.example` to `.env.local` and fill in values.  
Add the same vars to your Vercel project settings.

### 3. VAPI webhook

In your VAPI dashboard:
- Go to **Settings → Webhooks**
- Add endpoint: `https://your-forge-domain.com/api/webhooks/vapi`
- Set the secret to match `VAPI_WEBHOOK_SECRET`
- Enable event: `end-of-call-report`

### 4. Add Voltr to your nav

```tsx
// In your Forge sidebar/nav
{ href: '/voltr', label: 'Voltr', icon: PhoneIcon }
```

### 5. Deploy

```bash
git add .
git commit -m "feat: add Voltr call intelligence"
git push
```

Vercel auto-deploys. Done.

---

## Files added

```
app/
  api/
    webhooks/
      vapi/
        route.ts          ← VAPI webhook receiver
  voltr/
    page.tsx              ← Dashboard UI

lib/
  voltr/
    analyzer.ts           ← Claude analysis pipeline
    useVoltrRealtime.ts   ← Supabase realtime hooks + data fetchers

supabase/
  migrations/
    001_voltr.sql         ← Tables + indexes + realtime
    002_voltr_functions.sql ← RLS, view, helper functions
```

---

## Analysis outputs per call

| Output | Description |
|--------|-------------|
| Sentiment per turn | 0–10 score + emotion label for every transcript turn |
| Overall sentiment | Aggregated score for the full call |
| Goal completion | Boolean + likelihood (0–1) |
| Outcome tag | booked / follow_up / not_interested / callback / referred |
| Summary | 2–3 sentence human-readable summary |
| Tags | Auto-extracted labels |
| Objections | Detected phrases + category + suggested response |
| Coaching alerts | Timestamped, severity-rated script coaching |
| Strengths | What the agent did well |
| Improvements | Specific issues with concrete fixes |
| Script suggestions | Line-level rewrites with reasoning |

---

## Cost estimate

Each call runs 2 Claude API calls:
- Per-turn sentiment: ~500–1000 tokens
- Full analysis: ~1000–2000 tokens

At Sonnet pricing, roughly **$0.003–0.008 per call**.  
For 300 calls/month ≈ **~$1–2/month**.

---

## Extending

**Weekly digest**: Add a Supabase `pg_cron` job that calls your `/api/voltr/digest` route every Monday, runs a Claude analysis across the week's transcripts, and inserts a summary row.

**A/B script testing**: Add a `script_version` column to `voltr_calls`. VAPI can pass this via metadata. Filter the dashboard by version to compare performance.

**Slack alerts**: In `analyzeCall()`, after storing coaching alerts, post critical alerts to a Slack webhook.
