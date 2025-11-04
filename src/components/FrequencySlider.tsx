import React from 'react';

interface FrequencySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function FrequencySlider({ value, onChange }: FrequencySliderProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor="frequency-slider"
        className="block text-sm font-medium text-moon-ash mb-4"
      >
        Frecuencia: <span className="font-semibold text-moon-white">{Math.round(value)} Hz</span>
      </label>
      <div className="relative py-2">
        <input
          id="frequency-slider"
          type="range"
          min="500"
          max="20000"
          step="50"
          value={value}
          onChange={handleChange}
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
            background: `linear-gradient(to right, #D6C4F0 0%, #D6C4F0 ${Math.max(0, Math.min(100, ((value - 500) / (20000 - 500)) * 100))}%, rgba(45, 47, 80, 0.5) ${Math.max(0, Math.min(100, ((value - 500) / (20000 - 500)) * 100))}%, rgba(45, 47, 80, 0.5) 100%)`
          }}
          aria-label={`Frecuencia ajustada a ${Math.round(value)} Hz`}
          aria-valuemin={500}
          aria-valuemax={20000}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
}

