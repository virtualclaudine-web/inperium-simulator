/**
 * useVoiceMode.js
 *
 * Drop-in React hook for adding voice practice to the Inperium simulator.
 *
 * Two independent capabilities, handled separately because browser support differs:
 *
 * 1. SPEECH-TO-TEXT (user speaks their response)
 *    Uses the Web Speech API's SpeechRecognition interface.
 *    Supported: Chrome, Edge (desktop + Android)
 *    NOT supported: Safari (desktop or iOS), Firefox
 *    -> Gated behind `isMicSupported`. If false, don't render the mic button at all —
 *       the existing text input remains the fallback, no extra work needed.
 *
 * 2. TEXT-TO-SPEECH (the character's line is read aloud)
 *    Uses the Web Speech API's SpeechSynthesis interface.
 *    Supported: Chrome, Edge, Safari, Firefox — broad support, no gating needed.
 *    -> Exposed as `speak(text)`. Safe to offer this everywhere.
 *
 * USAGE EXAMPLE (see VoiceModeControls.jsx for a full UI example):
 *
 *   const {
 *     isMicSupported,
 *     isListening,
 *     transcript,
 *     startListening,
 *     stopListening,
 *     resetTranscript,
 *     speak,
 *     isSpeaking,
 *   } = useVoiceMode();
 *
 *   // Feed transcript into your existing input state as the user speaks:
 *   useEffect(() => {
 *     if (transcript) setUserInput(transcript);
 *   }, [transcript]);
 *
 *   // Read the character's response aloud when a new message arrives:
 *   useEffect(() => {
 *     if (latestCharacterMessage) speak(latestCharacterMessage);
 *   }, [latestCharacterMessage]);
 */

import { useState, useEffect, useRef, useCallback } from "react";

export function useVoiceMode() {
  const [isMicSupported, setIsMicSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [micError, setMicError] = useState(null);
  // Actual voice-active seconds for the last completed listening session —
  // used for pace calculations instead of "time the mic button was held open,"
  // which wrongly counts thinking/hesitation time as speaking time.
  const [lastUtteranceDuration, setLastUtteranceDuration] = useState(0);

  const recognitionRef = useRef(null);
  // Committed final text lives in a ref (not state) so each onresult event
  // can read-and-append synchronously without racing React's state batching.
  const finalTextRef = useRef("");
  // Accumulates only the seconds where the browser detected actual speech
  // (via onspeechstart/onspeechend), excluding silence, pauses, and hesitation.
  const speakingSecondsRef = useRef(0);
  const segmentStartRef = useRef(null);
  // Fallback only: total mic-open time, used if a browser never fires
  // onspeechstart/onspeechend for some reason.
  const sessionStartRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsMicSupported(false);
      return;
    }

    setIsMicSupported(true);

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      // event.resultIndex onward is a live re-transcription of the CURRENT
      // utterance (growing confidence: "i'm" -> "i'm not" -> "i'm not sure").
      // Interim text must REPLACE last event's interim guess, never append
      // to it — appending is what caused the duplicated/garbled transcript.
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const chunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTextRef.current += chunk + " ";
        } else {
          interimTranscript += chunk;
        }
      }

      setTranscript((finalTextRef.current + interimTranscript).trim());
    };

    // Fires when the browser's voice-activity detection hears actual speech
    // begin — not when the mic was turned on.
    recognition.onspeechstart = () => {
      segmentStartRef.current = Date.now();
    };

    // Fires when the browser detects the person has stopped talking (even if
    // recognition itself keeps listening for more). Close out this segment's
    // duration so silence/pauses afterward don't count as speaking time.
    recognition.onspeechend = () => {
      if (segmentStartRef.current) {
        speakingSecondsRef.current += (Date.now() - segmentStartRef.current) / 1000;
        segmentStartRef.current = null;
      }
    };

    recognition.onerror = (event) => {
      setMicError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
      // Close out any speech segment still open when recognition stopped.
      if (segmentStartRef.current) {
        speakingSecondsRef.current += (Date.now() - segmentStartRef.current) / 1000;
        segmentStartRef.current = null;
      }
      // Fallback: if this browser never fired onspeechstart/onspeechend at
      // all, use total mic-open time rather than reporting zero.
      const fallbackSeconds = sessionStartRef.current
        ? (Date.now() - sessionStartRef.current) / 1000
        : 0;
      setLastUtteranceDuration(speakingSecondsRef.current > 0 ? speakingSecondsRef.current : fallbackSeconds);
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.stop();
    };
  }, []);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    setMicError(null);
    finalTextRef.current = "";
    setTranscript("");
    speakingSecondsRef.current = 0;
    segmentStartRef.current = null;
    sessionStartRef.current = Date.now();
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch (err) {
      // start() throws if called while already listening — safe to ignore.
      console.warn("Speech recognition start() warning:", err.message);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;
    // Don't set isListening/duration here — recognition.onend fires shortly
    // after stop() and computes the final speaking duration there, avoiding
    // a race where we'd read stale/incomplete timing data synchronously.
    recognitionRef.current.stop();
  }, []);

  const resetTranscript = useCallback(() => {
    finalTextRef.current = "";
    setTranscript("");
  }, []);

  // --- Text-to-speech (broadly supported, no gating) ---
  const speak = useCallback((text) => {
    if (!window.speechSynthesis || !text) return;

    // Cancel anything currently queued/speaking before starting new speech.
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  }, []);

  const stopSpeaking = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  return {
    isMicSupported,
    isListening,
    transcript,
    micError,
    startListening,
    stopListening,
    resetTranscript,
    speak,
    stopSpeaking,
    isSpeaking,
    lastUtteranceDuration,
  };
}
