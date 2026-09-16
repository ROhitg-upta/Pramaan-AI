import { useState, useEffect, useRef, useCallback } from "react";

export interface AudioAnalyserState {
  isListening: boolean;
  hasPermission: boolean | null;
  volume: number; // Normalized 0 - 1
  frequencies: number[]; // Array of 32 normalized frequency bins (0 - 1)
  rawFrequencies: Uint8Array;
  errorMessage: string | null;
  startListening: () => Promise<void>;
  stopListening: () => void;
  toggleListening: () => Promise<void>;
}

/**
 * Web Audio API hook for real-time microphone capture and dynamic SVG waveform rendering.
 * Safely handles SSR and microphone permission denial.
 */
export function useAudioAnalyser(fftSize = 64): AudioAnalyserState {
  const [isListening, setIsListening] = useState<boolean>(false);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [volume, setVolume] = useState<number>(0);
  const [frequencies, setFrequencies] = useState<number[]>(new Array(fftSize / 2).fill(0));
  const [rawFrequencies, setRawFrequencies] = useState<Uint8Array>(new Uint8Array(fftSize / 2));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  const stopListening = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }

    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }

    setIsListening(false);
    setVolume(0);
    setFrequencies(new Array(fftSize / 2).fill(0));
  }, [fftSize]);

  const startListening = useCallback(async () => {
    if (typeof window === "undefined" || !navigator.mediaDevices?.getUserMedia) {
      setErrorMessage("Audio capture is not supported in this browser environment.");
      return;
    }

    setErrorMessage(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });

      streamRef.current = stream;
      setHasPermission(true);

      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;

      const audioCtx = new AudioContextClass();
      audioContextRef.current = audioCtx;

      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = fftSize;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);
      sourceRef.current = source;

      setIsListening(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastUpdate = 0;
      const updateAnalysis = (timestamp: number) => {
        if (!analyserRef.current) return;

        animationFrameRef.current = requestAnimationFrame(updateAnalysis);

        // Throttle updates to ~25 FPS (every 40ms) to eliminate React state thrashing and high CPU load
        if (timestamp - lastUpdate < 40) return;
        lastUpdate = timestamp;

        analyserRef.current.getByteFrequencyData(dataArray);

        // Calculate average volume
        let sum = 0;
        const normalizedArray: number[] = [];

        for (let i = 0; i < bufferLength; i++) {
          const val = dataArray[i] / 255;
          sum += val;
          normalizedArray.push(val);
        }

        const avgVolume = sum / bufferLength;
        setVolume(avgVolume);
        setFrequencies(normalizedArray);
      };

      animationFrameRef.current = requestAnimationFrame(updateAnalysis);
    } catch (err: unknown) {
      const error = err as Error;
      setHasPermission(false);
      setIsListening(false);
      if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
        setErrorMessage("Microphone access denied. Please allow microphone permissions for oral defense.");
      } else {
        setErrorMessage(`Audio capture error: ${error.message}`);
      }
    }
  }, [fftSize]);

  const toggleListening = useCallback(async () => {
    if (isListening) {
      stopListening();
    } else {
      await startListening();
    }
  }, [isListening, startListening, stopListening]);

  // Clean up resources on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return {
    isListening,
    hasPermission,
    volume,
    frequencies,
    rawFrequencies,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
  };
}
