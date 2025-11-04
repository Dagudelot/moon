import React from 'react';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';

interface ControlsProps {
  isReady: boolean;
  isPlaying: boolean;
  volume: number;
  onVolumeChange: (volume: number) => void;
  onPlay: () => void;
  onStop: () => void;
  onStartGuidedMode: () => void;
}

export function Controls({
  isReady,
  isPlaying,
  volume,
  onVolumeChange,
  onPlay,
  onStop,
  onStartGuidedMode,
}: ControlsProps) {
  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onVolumeChange(newValue);
    }
  };

  const volumePercent = Math.round(volume * 100);

  return (
    <div className="space-y-8">
      {/* Volume Control */}
      <div className="w-full">
        <label
          htmlFor="volume-slider"
          className="block text-sm font-medium text-moon-ash mb-4"
        >
          Volumen
        </label>
        <div className="relative py-2">
          <input
            id="volume-slider"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolumeChange}
            className="w-full slider-thin-track rounded-full appearance-none cursor-pointer touch-target
                       focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                       [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 
                       [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full 
                       [&::-webkit-slider-thumb]:bg-moon-lavender [&::-webkit-slider-thumb]:cursor-pointer 
                       [&::-webkit-slider-thumb]:border-0
                       [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:moon-glow-active
                       [&::-webkit-slider-thumb]:transition-all [&::-webkit-slider-thumb]:duration-moon
                       [&::-webkit-slider-thumb]:hover:scale-125
                       [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:h-4 
                       [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-moon-lavender 
                       [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-0
                       [&::-moz-range-thumb]:shadow-sm
                       [&::-moz-range-thumb]:transition-all [&::-moz-range-thumb]:duration-moon
                       [&::-moz-range-thumb]:hover:scale-125
                       [&::-webkit-slider-runnable-track]:bg-moon-navy-2/50
                       [&::-webkit-slider-runnable-track]:rounded-full
                       [&::-moz-range-track]:bg-moon-navy-2/50
                       [&::-moz-range-track]:rounded-full"
            style={{
              background: `linear-gradient(to right, #D6C4F0 0%, #D6C4F0 ${Math.max(0, Math.min(100, volume * 100))}%, rgba(45, 47, 80, 0.5) ${Math.max(0, Math.min(100, volume * 100))}%, rgba(45, 47, 80, 0.5) 100%)`
            }}
            aria-label={`Volumen ajustado a ${volumePercent}%`}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={volumePercent}
          />
        </div>
      </div>

      {/* Control Buttons */}
      <div className="flex items-center justify-center gap-6">
        {/* Play/Pause Button - Spotify style */}
        <button
          onClick={isPlaying ? onStop : onPlay}
          disabled={!isReady}
          className="w-14 h-14 bg-moon-lavender/20 backdrop-blur-sm 
                     text-moon-white rounded-full flex items-center justify-center
                     border border-moon-lavender/30
                     moon-glow-hover transition-all duration-moon ease-in-out
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                     touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                     hover:bg-moon-lavender/30 hover:border-moon-lavender/50 hover:scale-105 active:moon-glow active:scale-95"
          aria-label={isPlaying ? 'Pausar reproducción' : 'Reproducir tono'}
        >
          {isPlaying ? (
            <PauseIcon className="w-6 h-6" />
          ) : (
            <PlayIcon className="w-6 h-6 ml-0.5" />
          )}
        </button>

        <button
          onClick={onStartGuidedMode}
          disabled={!isReady || isPlaying}
          className="px-5 py-2.5 bg-transparent border border-moon-lavender/40 
                     text-moon-white rounded-full text-sm font-medium
                     moon-glow-hover transition-all duration-moon ease-in-out
                     disabled:opacity-30 disabled:cursor-not-allowed disabled:shadow-none
                     touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                     hover:bg-moon-lavender/10 hover:border-moon-lavender/60 active:moon-glow"
          aria-label="Encuentra tu frecuencia mediante barrido de audio"
        >
          Encuentra tu frecuencia
        </button>
      </div>
    </div>
  );
}

