import { useState, useEffect, useRef, useCallback } from 'react';
import {
  getStoredFrequency,
  getStoredVolume,
  setStoredFrequency,
  setStoredVolume,
  getStoredNoiseMode,
  setStoredNoiseMode,
} from '../lib/storage';

// Maximum gain value to protect hearing
const MAX_GAIN = 0.4;
// Ramp duration in seconds for smooth transitions
const RAMP_DURATION = 0.08;

export type NoiseMode = 'white' | 'pink' | 'brown' | null;
export type AudioMode = 'tone' | 'noise';

export type AudioEngineExtended = {
  isReady: boolean;
  isPlaying: boolean;
  frequency: number;
  volume: number;
  noiseMode: NoiseMode;
  audioMode: AudioMode;
  enable(): Promise<void>;
  playTone(): void;
  playNoise(mode: NoiseMode): void;
  stop(): void;
  sweep(): void;
  setFrequency(hz: number): void;
  setVolume(v: number): void;
  setNoiseMode(mode: NoiseMode): void;
};

export function useAudioEngineExtended(): AudioEngineExtended {
  const [isReady, setIsReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [frequency, setFrequency] = useState(getStoredFrequency());
  const [volume, setVolume] = useState(getStoredVolume());
  const [noiseMode, setNoiseMode] = useState<NoiseMode>(getStoredNoiseMode());
  const [audioMode, setAudioMode] = useState<AudioMode>('tone');

  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);
  const noiseSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const filterNodeRef = useRef<BiquadFilterNode | null>(null);
  const pinkNoiseFilterRef = useRef<BiquadFilterNode | null>(null);
  const brownNoiseFilterRef = useRef<BiquadFilterNode | null>(null);
  const sweepTimeoutRef = useRef<number | null>(null);

  // Load stored values on mount
  useEffect(() => {
    setFrequency(getStoredFrequency());
    setVolume(getStoredVolume());
    setNoiseMode(getStoredNoiseMode());
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

  // Create noise buffer based on type
  const createNoiseBuffer = useCallback((length: number, type: NoiseMode): AudioBuffer => {
    const context = audioContextRef.current;
    if (!context) throw new Error('Audio context not initialized');

    const buffer = context.createBuffer(1, length, context.sampleRate);
    const data = buffer.getChannelData(0);
    const random = new Float32Array(length);

    // Generate white noise
    for (let i = 0; i < length; i++) {
      random[i] = Math.random() * 2 - 1;
    }

    if (type === 'white') {
      // White noise: flat spectrum
      for (let i = 0; i < length; i++) {
        data[i] = random[i] * 0.1; // Scale down
      }
    } else if (type === 'pink') {
      // Pink noise: -3dB per octave
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < length; i++) {
        const white = random[i];
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      // Brown noise: -6dB per octave (integrated white noise)
      let lastOut = 0;
      for (let i = 0; i < length; i++) {
        const white = random[i];
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      }
    }

    return buffer;
  }, []);

  // Immediate cleanup (for when starting new audio)
  const cleanupImmediate = useCallback(() => {
    if (sweepTimeoutRef.current) {
      clearTimeout(sweepTimeoutRef.current);
      sweepTimeoutRef.current = null;
    }

    const osc = oscillatorRef.current;
    const noise = noiseSourceRef.current;
    const gain = gainNodeRef.current;
    const filter = filterNodeRef.current;
    const pinkFilter = pinkNoiseFilterRef.current;
    const brownFilter = brownNoiseFilterRef.current;

    if (osc) {
      try {
        osc.stop();
        osc.disconnect();
      } catch (e) {
        // Already stopped
      }
      oscillatorRef.current = null;
    }

    if (noise) {
      try {
        noise.stop();
        noise.disconnect();
      } catch (e) {
        // Already stopped
      }
      noiseSourceRef.current = null;
    }

    if (gain) {
      try {
        gain.disconnect();
      } catch (e) {
        // Already stopped
      }
      gainNodeRef.current = null;
    }

    if (filter) {
      try {
        filter.disconnect();
      } catch (e) {
        // Already stopped
      }
      filterNodeRef.current = null;
    }

    if (pinkFilter) {
      try {
        pinkFilter.disconnect();
      } catch (e) {
        // Already stopped
      }
      pinkNoiseFilterRef.current = null;
    }

    if (brownFilter) {
      try {
        brownFilter.disconnect();
      } catch (e) {
        // Already stopped
      }
      brownNoiseFilterRef.current = null;
    }
  }, []);

  // Cleanup with smooth ramp down (for stop button)
  const cleanup = useCallback(() => {
    if (sweepTimeoutRef.current) {
      clearTimeout(sweepTimeoutRef.current);
      sweepTimeoutRef.current = null;
    }

    const osc = oscillatorRef.current;
    const noise = noiseSourceRef.current;
    const gain = gainNodeRef.current;

    if ((osc || noise) && gain && audioContextRef.current) {
      const currentTime = audioContextRef.current.currentTime;
      // Smooth ramp down
      gain.gain.cancelScheduledValues(currentTime);
      gain.gain.setValueAtTime(gain.gain.value, currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, currentTime + RAMP_DURATION);

      setTimeout(() => {
        cleanupImmediate();
        setIsPlaying(false);
        setAudioMode('tone');
      }, RAMP_DURATION * 1000 + 10);
    } else {
      cleanupImmediate();
      setIsPlaying(false);
      setAudioMode('tone');
    }
  }, [cleanupImmediate]);

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
    setAudioMode('tone');
  }, [frequency, volume, isPlaying, cleanupImmediate]);

  // Play noise
  const playNoise = useCallback((mode: NoiseMode) => {
    const context = audioContextRef.current;
    if (!context || !mode) return;

    // Cleanup any existing sources immediately
    cleanupImmediate();

    // Resume context if suspended
    if (context.state === 'suspended') {
      context.resume();
    }

    // Create noise buffer
    const bufferLength = context.sampleRate * 2; // 2 seconds of noise
    const noiseBuffer = createNoiseBuffer(bufferLength, mode);

    const noiseSource = context.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Create band-pass filter centered around user's frequency (±2 kHz)
    const filter = context.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = frequency;
    filter.Q.value = 1; // Quality factor

    const gainNode = context.createGain();

    // Set initial gain very low, then ramp up
    gainNode.gain.setValueAtTime(0.0001, context.currentTime);
    const targetGain = Math.min(volume, MAX_GAIN);
    gainNode.gain.exponentialRampToValueAtTime(targetGain, context.currentTime + RAMP_DURATION);

    // Connect: noise -> filter -> gain -> destination
    noiseSource.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(context.destination);

    noiseSource.start();

    noiseSourceRef.current = noiseSource;
    filterNodeRef.current = filter;
    gainNodeRef.current = gainNode;
    setIsPlaying(true);
    setAudioMode('noise');
    setNoiseMode(mode);
    setStoredNoiseMode(mode);
  }, [frequency, volume, createNoiseBuffer, cleanupImmediate]);

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
    setAudioMode('tone');

    // Auto-stop after sweep completes
    sweepTimeoutRef.current = window.setTimeout(() => {
      cleanup();
    }, duration * 1000);
  }, [volume, isPlaying, cleanupImmediate, cleanup]);

  // Update frequency
  const updateFrequency = useCallback((hz: number) => {
    const clamped = Math.max(200, Math.min(20000, hz));
    setFrequency(clamped);
    setStoredFrequency(clamped);

    // Update oscillator if playing tone
    if (oscillatorRef.current && audioContextRef.current && audioMode === 'tone') {
      const currentTime = audioContextRef.current.currentTime;
      oscillatorRef.current.frequency.setValueAtTime(clamped, currentTime);
    }

    // Update filter if playing noise
    if (filterNodeRef.current && audioContextRef.current && audioMode === 'noise') {
      const currentTime = audioContextRef.current.currentTime;
      filterNodeRef.current.frequency.setValueAtTime(clamped, currentTime);
    }
  }, [audioMode]);

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

  // Set noise mode
  const setNoiseModeValue = useCallback((mode: NoiseMode) => {
    setNoiseMode(mode);
    setStoredNoiseMode(mode);
    
    // If currently playing noise, switch to new mode
    if (isPlaying && audioMode === 'noise' && mode) {
      playNoise(mode);
    }
  }, [isPlaying, audioMode, playNoise]);

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
    noiseMode,
    audioMode,
    enable,
    playTone,
    playNoise,
    stop,
    sweep,
    setFrequency: updateFrequency,
    setVolume: updateVolume,
    setNoiseMode: setNoiseModeValue,
  };
}

