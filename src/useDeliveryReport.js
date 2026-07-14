/**
 * useDeliveryReport.js
 *
 * Phase 1 of the voice-mode delivery coaching (Yoodli-style feedback on HOW
 * something was said, not just what was said). This is the "Easy tier":
 * pace, filler words, and response length — all computed from the transcript
 * and timestamps voice mode already produces. No third-party service, no
 * additional cost, purely client-side text/timing math.
 *
 * USAGE:
 *   const { recordUtterance, sessionReport, resetSession } = useDeliveryReport();
 *
 *   // Each time the user finishes a spoken turn (e.g. in stopListening handler):
 *   recordUtterance(transcriptText, speakingDurationSeconds);
 *
 *   // At session end, render sessionReport alongside the existing content debrief.
 */

import { useState, useCallback } from "react";

// Common filler words/phrases to flag. Checked as whole-word matches so
// "like" doesn't false-positive inside "unlike" or "likely".
const FILLER_PATTERNS = [
  { term: "um", regex: /\bum+\b/gi },
  { term: "uh", regex: /\buh+\b/gi },
  { term: "like", regex: /\blike\b/gi },
  { term: "you know", regex: /\byou know\b/gi },
  { term: "i mean", regex: /\bi mean\b/gi },
  { term: "sort of", regex: /\bsort of\b/gi },
  { term: "kind of", regex: /\bkind of\b/gi },
  { term: "basically", regex: /\bbasically\b/gi },
];

// Natural conversational pace is roughly 120-160 wpm. Outside this range
// gets flagged as an observation, not a hard error.
const PACE_TARGET_MIN = 120;
const PACE_TARGET_MAX = 160;

// Response length guidance: the Toolkit favors concise, Stat-Then-Meaning
// answers over rambling ones. These are soft thresholds, not hard rules.
const LENGTH_CONCISE_MAX_WORDS = 60;
const LENGTH_RAMBLING_MIN_WORDS = 130;

function countWords(text) {
  return (text.trim().match(/\S+/g) || []).length;
}

function analyzeUtterance(text, durationSeconds) {
  const wordCount = countWords(text);
  const minutes = Math.max(durationSeconds / 60, 0.05); // avoid divide-by-zero on very short clips
  const wpm = Math.round(wordCount / minutes);

  const fillers = FILLER_PATTERNS
    .map(({ term, regex }) => ({ term, count: (text.match(regex) || []).length }))
    .filter(f => f.count > 0);
  const fillerTotal = fillers.reduce((sum, f) => sum + f.count, 0);

  let paceNote = null;
  if (wpm > PACE_TARGET_MAX) {
    paceNote = `Fast pace (${wpm} wpm) — consider slowing down, especially before key proof points.`;
  } else if (wpm < PACE_TARGET_MIN && wordCount > 8) {
    paceNote = `Slower pace (${wpm} wpm) — fine for gravity, but check it isn't hesitation.`;
  }

  let lengthNote = null;
  if (wordCount >= LENGTH_RAMBLING_MIN_WORDS) {
    lengthNote = `Long response (${wordCount} words) — could this be tightened into one clear Stat-Then-Meaning statement?`;
  } else if (wordCount <= LENGTH_CONCISE_MAX_WORDS && wordCount > 0) {
    lengthNote = `Concise response (${wordCount} words) — good discipline.`;
  }

  return { wordCount, durationSeconds, wpm, fillers, fillerTotal, paceNote, lengthNote };
}

export function useDeliveryReport() {
  const [utterances, setUtterances] = useState([]);

  const recordUtterance = useCallback((text, durationSeconds) => {
    if (!text || !text.trim()) return;
    const analysis = analyzeUtterance(text, durationSeconds);
    setUtterances(prev => [...prev, analysis]);
  }, []);

  const resetSession = useCallback(() => setUtterances([]), []);

  // Roll individual utterances up into a session-level report.
  const sessionReport = (() => {
    if (utterances.length === 0) return null;

    const totalWords = utterances.reduce((s, u) => s + u.wordCount, 0);
    const totalSeconds = utterances.reduce((s, u) => s + u.durationSeconds, 0);
    const avgWpm = Math.round(totalWords / Math.max(totalSeconds / 60, 0.05));

    const fillerCounts = {};
    utterances.forEach(u => u.fillers.forEach(f => {
      fillerCounts[f.term] = (fillerCounts[f.term] || 0) + f.count;
    }));
    const totalFillers = Object.values(fillerCounts).reduce((s, c) => s + c, 0);
    const topFillers = Object.entries(fillerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([term, count]) => ({ term, count }));

    const ramblingCount = utterances.filter(u => u.wordCount >= LENGTH_RAMBLING_MIN_WORDS).length;
    const conciseCount = utterances.filter(u => u.wordCount > 0 && u.wordCount <= LENGTH_CONCISE_MAX_WORDS).length;

    return {
      turnCount: utterances.length,
      avgWpm,
      paceFlag: avgWpm > PACE_TARGET_MAX ? "fast" : avgWpm < PACE_TARGET_MIN ? "slow" : "natural",
      totalFillers,
      fillersPerTurn: Math.round((totalFillers / utterances.length) * 10) / 10,
      topFillers,
      ramblingCount,
      conciseCount,
      utterances,
    };
  })();

  return { recordUtterance, resetSession, sessionReport };
}
