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

  const recognitionRef = useRef(null);
  // Committed final text lives in a ref (not state) so each onresult event
  // can read-and-append synchronously without racing React's state batching.
  const finalTextRef = useRef("");

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


    recognition.onerror = (event) => {
      setMicError(event.error);
      setIsListening(false);
    };

    recognition.onend = () => {
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
    recognitionRef.current.stop();
    setIsListening(false);
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
  };
}
