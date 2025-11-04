// LocalStorage helpers for persisting frequency and volume

const STORAGE_KEYS = {
  FREQUENCY: 'moon_freq',
  VOLUME: 'moon_vol',
  NOISE_MODE: 'moon_noise_mode',
  FOUND_FREQUENCY: 'moon_found_freq',
} as const;

/**
 * Get stored frequency from localStorage
 * @returns frequency in Hz, or default 3000 if not found
 */
export function getStoredFrequency(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.FREQUENCY);
  if (stored === null) return 3000;
  const parsed = parseFloat(stored);
  return isNaN(parsed) ? 3000 : Math.max(500, Math.min(20000, parsed));
}

/**
 * Get stored volume from localStorage
 * @returns volume in range 0..1, or default 0.3 if not found
 */
export function getStoredVolume(): number {
  const stored = localStorage.getItem(STORAGE_KEYS.VOLUME);
  if (stored === null) return 0.3;
  const parsed = parseFloat(stored);
  return isNaN(parsed) ? 0.3 : Math.max(0, Math.min(1, parsed));
}

/**
 * Store frequency to localStorage
 */
export function setStoredFrequency(frequency: number): void {
  localStorage.setItem(STORAGE_KEYS.FREQUENCY, frequency.toString());
}

/**
 * Store volume to localStorage
 */
export function setStoredVolume(volume: number): void {
  localStorage.setItem(STORAGE_KEYS.VOLUME, volume.toString());
}

/**
 * Get stored noise mode
 */
export function getStoredNoiseMode(): 'white' | 'pink' | 'brown' | null {
  const stored = localStorage.getItem(STORAGE_KEYS.NOISE_MODE);
  if (stored === null) return null;
  if (stored === 'white' || stored === 'pink' || stored === 'brown') {
    return stored;
  }
  return null;
}

/**
 * Store noise mode to localStorage
 */
export function setStoredNoiseMode(mode: 'white' | 'pink' | 'brown' | null): void {
  if (mode === null) {
    localStorage.removeItem(STORAGE_KEYS.NOISE_MODE);
  } else {
    localStorage.setItem(STORAGE_KEYS.NOISE_MODE, mode);
  }
}

/**
 * Get stored found frequency (from guided mode)
 */
export function getStoredFoundFrequency(): number | null {
  const stored = localStorage.getItem(STORAGE_KEYS.FOUND_FREQUENCY);
  if (stored === null) return null;
  const parsed = parseFloat(stored);
  return isNaN(parsed) ? null : Math.max(500, Math.min(20000, parsed));
}

/**
 * Store found frequency to localStorage
 */
export function setStoredFoundFrequency(frequency: number): void {
  localStorage.setItem(STORAGE_KEYS.FOUND_FREQUENCY, frequency.toString());
}


