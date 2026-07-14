/**
 * useDeliveryReport.js (v2)
 *
 * Scope, deliberately narrowed for accuracy over breadth:
 *   - Filler words: transcript text matching — already accurate, unchanged.
 *   - Pauses: real audio-based detection (from useAudioPauseDetector), not
 *     a transcript/timing proxy. Localized against finalized phrases using
 *     timestamps from useVoiceMode's getTranscriptChunks().
 *   - Content analysis (Aspiration Clarity, etc.) is handled entirely by the
 *     existing rubric/debrief system — intentionally not duplicated here.
 *   - Pace (wpm) removed — not part of the requested scope.
 *
 * USAGE:
 *   const { recordUtterance, sessionReport, resetSession } = useDeliveryReport();
 *
 *   // After stopMonitoring() returns { pauses, sessionStartTime }, and you have
 *   // the finalized transcript + chunk timestamps for that same utterance:
 *   recordUtterance({ transcript, pauses, chunks });
 */

import { useState, useCallback } from "react";

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

function analyzeFillers(text) {
  const fillers = FILLER_PATTERNS
    .map(({ term, regex }) => ({ term, count: (text.match(regex) || []).length }))
    .filter(f => f.count > 0);
  return { fillers, fillerTotal: fillers.reduce((sum, f) => sum + f.count, 0) };
}

// Places each detected pause between the two transcript phrases it fell between,
// using timestamps — this is what makes "where" meaningful without needing
// per-word timestamps (which the Web Speech API doesn't expose).
function localizePauses(pauses, chunks) {
  return pauses.map(pause => {
    const before = [...chunks].reverse().find(c => c.timestamp <= pause.startTime);
    const after = chunks.find(c => c.timestamp >= pause.endTime);
    return {
      ...pause,
      afterPhrase: before ? before.text : null,
      beforePhrase: after ? after.text : null,
    };
  });
}

function analyzeUtterance({ transcript, pauses = [], chunks = [] }) {
  const { fillers, fillerTotal } = analyzeFillers(transcript);
  const localizedPauses = localizePauses(pauses, chunks);
  const totalPauseMs = pauses.reduce((s, p) => s + p.durationMs, 0);
  const longestPause = pauses.length
    ? localizedPauses.reduce((max, p) => (p.durationMs > max.durationMs ? p : max), localizedPauses[0])
    : null;

  return {
    transcript,
    fillers,
    fillerTotal,
    pauseCount: pauses.length,
    totalPauseMs,
    longestPause,
    pauses: localizedPauses,
  };
}

export function useDeliveryReport() {
  const [utterances, setUtterances] = useState([]);

  const recordUtterance = useCallback(({ transcript, pauses, chunks }) => {
    if (!transcript || !transcript.trim()) return;
    setUtterances(prev => [...prev, analyzeUtterance({ transcript, pauses, chunks })]);
  }, []);

  const resetSession = useCallback(() => setUtterances([]), []);

  const sessionReport = (() => {
    if (utterances.length === 0) return null;

    const fillerCounts = {};
    utterances.forEach(u => u.fillers.forEach(f => {
      fillerCounts[f.term] = (fillerCounts[f.term] || 0) + f.count;
    }));
    const totalFillers = Object.values(fillerCounts).reduce((s, c) => s + c, 0);
    const topFillers = Object.entries(fillerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([term, count]) => ({ term, count }));

    const totalPauses = utterances.reduce((s, u) => s + u.pauseCount, 0);
    const totalPauseMs = utterances.reduce((s, u) => s + u.totalPauseMs, 0);
    const allPauses = utterances.flatMap(u => u.pauses);
    const longestPauseOverall = allPauses.length
      ? allPauses.reduce((max, p) => (p.durationMs > max.durationMs ? p : max), allPauses[0])
      : null;

    return {
      turnCount: utterances.length,
      totalFillers,
      fillersPerTurn: Math.round((totalFillers / utterances.length) * 10) / 10,
      topFillers,
      totalPauses,
      pausesPerTurn: Math.round((totalPauses / utterances.length) * 10) / 10,
      avgPauseMs: totalPauses > 0 ? Math.round(totalPauseMs / totalPauses) : 0,
      longestPauseOverall,
      utterances,
    };
  })();

  return { recordUtterance, resetSession, sessionReport };
}
