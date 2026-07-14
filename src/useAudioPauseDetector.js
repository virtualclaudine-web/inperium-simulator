/**
 * useAudioPauseDetector.js
 *
 * Genuinely "listens" to the raw microphone signal to detect pauses —
 * independent of the SpeechRecognition engine, which only exposes a coarse
 * "speech happening / not happening" signal tuned for transcription, not
 * coaching. This hook uses the Web Audio API directly (AnalyserNode) to
 * sample real amplitude ~20x/second and find genuine silence gaps.
 *
 * Still 100% browser-native and free — no recording is uploaded anywhere,
 * no third-party service. Everything happens locally in the tab.
 *
 * PAUSE DEFINITION: amplitude below SILENCE_THRESHOLD for at least
 * MIN_PAUSE_MS is counted as one pause. Brief natural gaps between words
 * (the small silences inside normal speech) are deliberately ignored by
 * requiring a minimum duration — otherwise nearly every sentence would
 * register dozens of meaningless "pauses."
 *
 * USAGE:
 *   const { startMonitoring, stopMonitoring, getPauses } = useAudioPauseDetector();
 *
 *   // Call alongside voice.startListening():
 *   await startMonitoring();
 *
 *   // Call alongside voice.stopListening():
 *   const pauses = stopMonitoring(); // [{ startTime, endTime, durationMs }, ...]
 */

import { useRef, useCallback } from "react";

const SILENCE_THRESHOLD = 0.02; // RMS amplitude (0-1 scale) below this = silence
const MIN_PAUSE_MS = 600;       // ignore gaps shorter than this — normal speech has brief natural gaps
const SAMPLE_INTERVAL_MS = 50;  // ~20 samples/sec, enough resolution without heavy CPU use

export function useAudioPauseDetector() {
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const streamRef = useRef(null);
  const intervalRef = useRef(null);
  const pausesRef = useRef([]);
  const silenceStartRef = useRef(null);
  const sessionStartRef = useRef(null);

  const startMonitoring = useCallback(async () => {
    pausesRef.current = [];
    silenceStartRef.current = null;
    sessionStartRef.current = Date.now();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContext = window.AudioContext || window.webkitAudioContext;
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const dataArray = new Uint8Array(analyser.fftSize);

      intervalRef.current = setInterval(() => {
        analyser.getByteTimeDomainData(dataArray);

        // Compute RMS amplitude from the waveform (128 = silence baseline for Uint8 time-domain data).
        let sumSquares = 0;
        for (let i = 0; i < dataArray.length; i++) {
          const normalized = (dataArray[i] - 128) / 128;
          sumSquares += normalized * normalized;
        }
        const rms = Math.sqrt(sumSquares / dataArray.length);

        const now = Date.now();
        if (rms < SILENCE_THRESHOLD) {
          if (silenceStartRef.current === null) {
            silenceStartRef.current = now;
          }
        } else {
          if (silenceStartRef.current !== null) {
            const durationMs = now - silenceStartRef.current;
            if (durationMs >= MIN_PAUSE_MS) {
              pausesRef.current.push({
                startTime: silenceStartRef.current,
                endTime: now,
                durationMs,
              });
            }
            silenceStartRef.current = null;
          }
        }
      }, SAMPLE_INTERVAL_MS);

      return true;
    } catch (err) {
      console.warn("Audio pause detector: microphone access failed:", err.message);
      return false;
    }
  }, []);

  const stopMonitoring = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    // Close out a trailing pause if the person stopped talking and immediately hit Stop.
    if (silenceStartRef.current !== null) {
      const durationMs = Date.now() - silenceStartRef.current;
      if (durationMs >= MIN_PAUSE_MS) {
        pausesRef.current.push({
          startTime: silenceStartRef.current,
          endTime: Date.now(),
          durationMs,
        });
      }
      silenceStartRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    return {
      pauses: pausesRef.current,
      sessionStartTime: sessionStartRef.current,
    };
  }, []);

  return { startMonitoring, stopMonitoring };
}
