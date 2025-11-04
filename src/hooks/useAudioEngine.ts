import { useState, useEffect, useRef, useCallback } from 'react';
import { getStoredFrequency, getStoredVolume, setStoredFrequency, setStoredVolume } from '../lib/storage';

// Maximum gain value to protect hearing
const MAX_GAIN = 0.4;
// Ramp duration in seconds for smooth transitions
const RAMP_DURATION = 0.08;

export type AudioEngine = {
  isReady: boolean;
  isPlaying: boolean;
  frequency: number;
  volume: number;
  enable(): Promise<void>;
  playTone(): void;
  stop(): void;
  sweep(): void;
  setFrequency(hz: number): void;
  setVolume(v: number): void;
};

export function useAudioEngine(): AudioEngine {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(getStoredFrequency());
  const [volume, setVolume] = useState(getStoredVolume());

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const sweepTimeoutRef = useRef<number | null>(null);

  // Load stored values on mount
  useEffect(() => {
    setFrequency(getStoredFrequency());
    setVolume(getStoredVolume());
  }, []);

  // Enable audio context (requires user gesture)
  const enable = useCallback(async () => {
    if (audioContextRef.current) return;

    try {
      const context = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioContextRef.current = context;

      // Resume context if suspended (iOS)
      if (context.state === 'suspended') {
        await context.resume();
      }

      setIsReady(true);
    } catch (error) {
      console.error('Failed to create audio context:', error);
    }
  }, []);

  // Immediate cleanup (for when starting new audio)
  const cleanupImmediate = useCallback(() => {
    if (sweepTimeoutRef.current) {
      clearTimeout(sweepTimeoutRef.current);
      sweepTimeoutRef.current = null;
    }

    const osc = oscillatorRef.current;
    const gain = gainNodeRef.current;

    if (osc && gain) {
      try {
        osc.stop();
        osc.disconnect();
        gain.disconnect();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
      gainNodeRef.current = null;
    }
  }, []);

  // Cleanup with smooth ramp down (for stop button)
  const cleanup = useCallback(() => {
    if (sweepTimeoutRef.current) {
      clearTimeout(sweepTimeoutRef.current);
      sweepTimeoutRef.current = null;
    }

    const osc = oscillatorRef.current;
    const gain = gainNodeRef.current;

    if (osc && gain && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      // Smooth ramp down
      gain.gain.cancelScheduledValues(currentTime);
      gain.gain.setValueAtTime(gain.gain.value, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + RAMP_DURATION);

      setTimeout(() => {
        try {
          osc.stop();
          osc.disconnect();
          gain.disconnect();
        } catch (e) {
          // Already stopped
        }
        oscillatorRef.current = null;
        gainNodeRef.current = null;
        setIsPlaying(false);
      }, RAMP_DURATION * 1000 + 10);
    } else {
      setIsPlaying(false);
    }
  }, []);

  // Play a tone at current frequency
  const playTone = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || isPlaying) return;

    // Cleanup any existing sources immediately
    cleanupImmediate();

    // Resume context if suspended
    if (context.state === 'suspended') {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.value = frequency;

    // Set initial gain very low, then ramp up
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    const targetGain = Math.min(volume, MAX_GAIN);
    gainNode.gain.exponentialRampToValueAtTime(targetGain, context.currentTime + RAMP_DURATION);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
  }, [frequency, volume, isPlaying, cleanupImmediate]);

  // Stop current audio
  const stop = useCallback(() => {
    cleanup();
  }, [cleanup]);

  // Sweep from 800 Hz to 10000 Hz over ~4 seconds
  const sweep = useCallback(() => {
    const context = audioContextRef.current;
    if (!context || isPlaying) return;

    // Cleanup any existing sources immediately
    cleanupImmediate();

    // Resume context if suspended
    if (context.state === 'suspended') {
      context.resume();
    }

    const oscillator = context.createOscillator();
    const gainNode = context.createGain();

    oscillator.type = 'sine';
    const startFreq = 800;
    const endFreq = 10000;
    const duration = 4.0;

    oscillator.frequency.setValueAtTime(startFreq, context.currentTime);
    oscillator.frequency.linearRampToValueAtTime(endFreq, context.currentTime + duration);

    // Set initial gain very low, then ramp up
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    const targetGain = Math.min(volume, MAX_GAIN);
    gainNode.gain.exponentialRampToValueAtTime(targetGain, context.currentTime + RAMP_DURATION);

    // Ramp down at the end
    gainNode.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + duration - RAMP_DURATION);

    oscillator.connect(gainNode);
    gainNode.connect(context.destination);

    oscillator.start();
    oscillator.stop(context.currentTime + duration);

    oscillatorRef.current = oscillator;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);

    // Auto-stop after sweep completes
    sweepTimeoutRef.current = window.setTimeout(() => {
      cleanup();
    }, duration * 1000);
  }, [volume, isPlaying, cleanupImmediate, cleanup]);

  // Update frequency
  const updateFrequency = useCallback((hz: number) => {
    const clamped = Math.max(500, Math.min(20000, hz));
    setFrequency(clamped);
    setStoredFrequency(clamped);

    // Update oscillator if playing
    if (oscillatorRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      oscillatorRef.current.frequency.setValueAtTime(clamped, currentTime);
    }
  }, []);

  // Update volume
  const updateVolume = useCallback((v: number) => {
    const clamped = Math.max(0, Math.min(1, v));
    setVolume(clamped);
    setStoredVolume(clamped);

    // Update gain if playing
    if (gainNodeRef.current && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      const targetGain = Math.min(clamped, MAX_GAIN);
      gainNodeRef.current.gain.cancelScheduledValues(currentTime);
      gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, currentTime);
      gainNodeRef.current.gain.exponentialRampToValueAtTime(targetGain, currentTime + RAMP_DURATION);
    }
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error);
      }
    };
  }, [cleanup]);

  return {
    isReady,
    isPlaying,
    frequency,
    volume,
    enable,
    playTone,
    stop,
    sweep,
    setFrequency: updateFrequency,
    setVolume: updateVolume,
  };
}

