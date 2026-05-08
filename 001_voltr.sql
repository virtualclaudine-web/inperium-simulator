-- ============================================================
-- Voltr: Call Intelligence Schema
-- ============================================================

-- Raw call records from VAPI webhooks
CREATE TABLE IF NOT EXISTS voltr_calls (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  vapi_call_id        TEXT UNIQUE NOT NULL,
  phone_number        TEXT,
  caller_name         TEXT,
  started_at          TIMESTAMPTZ,
  ended_at            TIMESTAMPTZ,
  duration_seconds    INTEGER,
  recording_url       TEXT,
  status              TEXT DEFAULT 'pending', -- pending | processing | complete | failed
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Full transcript stored as JSONB array of turns
-- Each turn: { role: 'agent'|'user', text: string, timestamp_ms: number }
CREATE TABLE IF NOT EXISTS voltr_transcripts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id     UUID REFERENCES voltr_calls(id) ON DELETE CASCADE,
  turns       JSONB NOT NULL DEFAULT '[]',
  raw_text    TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Per-turn sentiment scores
CREATE TABLE IF NOT EXISTS voltr_sentiment (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id         UUID REFERENCES voltr_calls(id) ON DELETE CASCADE,
  turn_index      INTEGER NOT NULL,
  role            TEXT NOT NULL, -- 'agent' | 'user'
  score           NUMERIC(4,2),  -- 0.0 to 10.0
  emotion         TEXT,          -- positive | neutral | negative | frustrated | excited
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Detected objections with AI-suggested responses
CREATE TABLE IF NOT EXISTS voltr_objections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id             UUID REFERENCES voltr_calls(id) ON DELETE CASCADE,
  turn_index          INTEGER,
  phrase              TEXT NOT NULL,
  category            TEXT,       -- price | timing | competitor | interest | other
  suggested_response  TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- Script coaching alerts per call
CREATE TABLE IF NOT EXISTS voltr_coaching_alerts (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id     UUID REFERENCES voltr_calls(id) ON DELETE CASCADE,
  severity    TEXT NOT NULL,   -- warning | critical | positive
  category    TEXT NOT NULL,   -- pacing | pricing_disclosure | objection_missed | rapport | close
  timestamp_s INTEGER,         -- second in the call this occurred
  message     TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Full AI analysis result per call
CREATE TABLE IF NOT EXISTS voltr_analysis (
  id                        UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  call_id                   UUID REFERENCES voltr_calls(id) ON DELETE CASCADE UNIQUE,
  overall_sentiment_score   NUMERIC(4,2),
  goal_completion           BOOLEAN,
  goal_completion_likelihood NUMERIC(4,2), -- 0.0 to 1.0
  outcome_tag               TEXT,          -- booked | follow_up | not_interested | callback | referred
  summary                   TEXT,
  tags                      TEXT[],
  strengths                 JSONB,         -- array of { point: string }
  improvements              JSONB,         -- array of { point: string, suggestion: string }
  script_suggestions        JSONB,         -- array of { original: string, suggested: string, reason: string }
  analyzed_at               TIMESTAMPTZ DEFAULT NOW()
);

-- Aggregate objection frequency (materialized via trigger or cron)
CREATE TABLE IF NOT EXISTS voltr_objection_stats (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phrase      TEXT UNIQUE NOT NULL,
  count       INTEGER DEFAULT 1,
  category    TEXT,
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Indexes
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_voltr_calls_status     ON voltr_calls(status);
CREATE INDEX IF NOT EXISTS idx_voltr_calls_started_at ON voltr_calls(started_at DESC);
CREATE INDEX IF NOT EXISTS idx_voltr_sentiment_call   ON voltr_sentiment(call_id);
CREATE INDEX IF NOT EXISTS idx_voltr_objections_call  ON voltr_objections(call_id);
CREATE INDEX IF NOT EXISTS idx_voltr_analysis_call    ON voltr_analysis(call_id);

-- ============================================================
-- Enable realtime on key tables
-- ============================================================
ALTER PUBLICATION supabase_realtime ADD TABLE voltr_calls;
ALTER PUBLICATION supabase_realtime ADD TABLE voltr_analysis;
ALTER PUBLICATION supabase_realtime ADD TABLE voltr_coaching_alerts;
