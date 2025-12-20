import React, { useState, useEffect } from 'react';

interface FrequencySliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function FrequencySlider({ value, onChange }: FrequencySliderProps) {
  const [inputValue, setInputValue] = useState<string>(value.toString());

  // Sync input value when prop value changes (from slider)
  useEffect(() => {
    setInputValue(value.toString());
  }, [value]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = parseFloat(e.target.value);
    if (!isNaN(newValue)) {
      onChange(newValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputVal = e.target.value;
    setInputValue(inputVal);
    
    const numValue = parseFloat(inputVal);
    if (!isNaN(numValue) && inputVal !== '' && inputVal !== '-') {
      // Clamp value to valid range
      const clamped = Math.max(200, Math.min(20000, numValue));
      onChange(clamped);
    }
  };

  const handleInputBlur = () => {
    // On blur, ensure the input shows a valid value
    const numValue = parseFloat(inputValue);
    if (isNaN(numValue) || numValue < 200 || numValue > 20000) {
      // Reset to current value if invalid
      setInputValue(value.toString());
    } else {
      // Ensure it's clamped
      const clamped = Math.max(200, Math.min(20000, numValue));
      if (clamped !== numValue) {
        setInputValue(clamped.toString());
        onChange(clamped);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <label
          htmlFor="frequency-slider"
          className="block text-sm font-medium text-moon-ash"
        >
          Frecuencia
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="200"
            max="20000"
            step="1"
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            className="w-20 px-2 py-1 text-sm text-moon-white bg-moon-navy-2/40 
                       border border-moon-lavender/30 rounded-lg
                       focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 
                       focus:border-moon-lavender/50
                       [&::-webkit-inner-spin-button]:appearance-none
                       [&::-webkit-outer-spin-button]:appearance-none
                       [-moz-appearance:textfield]"
            aria-label="Frecuencia en Hz"
          />
          <span className="text-sm text-moon-ash">Hz</span>
        </div>
      </div>
      <div className="relative py-2">
        <input
          id="frequency-slider"
          type="range"
          min="200"
          max="20000"
          step="50"
          value={value}
          onChange={handleSliderChange}
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
            background: `linear-gradient(to right, #D6C4F0 0%, #D6C4F0 ${Math.max(0, Math.min(100, ((value - 200) / (20000 - 200)) * 100))}%, rgba(45, 47, 80, 0.5) ${Math.max(0, Math.min(100, ((value - 200) / (20000 - 200)) * 100))}%, rgba(45, 47, 80, 0.5) 100%)`
          }}
          aria-label={`Frecuencia ajustada a ${Math.round(value)} Hz`}
          aria-valuemin={200}
          aria-valuemax={20000}
          aria-valuenow={value}
        />
      </div>
    </div>
  );
}

