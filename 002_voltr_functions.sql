-- 002_voltr_functions.sql

-- Upsert objection stats atomically
CREATE OR REPLACE FUNCTION increment_objection_stat(p_phrase TEXT, p_category TEXT)
RETURNS void AS $$
BEGIN
  INSERT INTO voltr_objection_stats (phrase, category, count)
  VALUES (p_phrase, p_category, 1)
  ON CONFLICT (phrase)
  DO UPDATE SET
    count = voltr_objection_stats.count + 1,
    updated_at = NOW();
END;
$$ LANGUAGE plpgsql;

-- Helper view: calls with analysis joined
CREATE OR REPLACE VIEW voltr_calls_with_analysis AS
SELECT
  c.id,
  c.vapi_call_id,
  c.phone_number,
  c.caller_name,
  c.started_at,
  c.ended_at,
  c.duration_seconds,
  c.recording_url,
  c.status,
  a.overall_sentiment_score,
  a.goal_completion,
  a.goal_completion_likelihood,
  a.outcome_tag,
  a.summary,
  a.tags,
  a.strengths,
  a.improvements,
  a.script_suggestions,
  a.analyzed_at
FROM voltr_calls c
LEFT JOIN voltr_analysis a ON a.call_id = c.id
ORDER BY c.started_at DESC;

-- RLS: restrict to authenticated users (adjust for your auth setup)
ALTER TABLE voltr_calls            ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_transcripts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_sentiment        ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_objections       ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_coaching_alerts  ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_analysis         ENABLE ROW LEVEL SECURITY;
ALTER TABLE voltr_objection_stats  ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read all (adjust for multi-tenant if needed)
CREATE POLICY "Auth read voltr_calls"           ON voltr_calls           FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_transcripts"     ON voltr_transcripts     FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_sentiment"       ON voltr_sentiment       FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_objections"      ON voltr_objections      FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_coaching_alerts" ON voltr_coaching_alerts FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_analysis"        ON voltr_analysis        FOR SELECT TO authenticated USING (true);
CREATE POLICY "Auth read voltr_objection_stats" ON voltr_objection_stats FOR SELECT TO authenticated USING (true);

-- Service role can write everything (used by webhook + analyzer)
CREATE POLICY "Service write voltr_calls"           ON voltr_calls           FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_transcripts"     ON voltr_transcripts     FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_sentiment"       ON voltr_sentiment       FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_objections"      ON voltr_objections      FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_coaching_alerts" ON voltr_coaching_alerts FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_analysis"        ON voltr_analysis        FOR ALL TO service_role USING (true);
CREATE POLICY "Service write voltr_objection_stats" ON voltr_objection_stats FOR ALL TO service_role USING (true);
