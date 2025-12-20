import { useState } from 'react';
import type { NoiseMode } from '../hooks/useAudioEngineExtended';

interface ModoCalmaProps {
  noiseMode: NoiseMode;
  onSelectMode: (mode: NoiseMode) => void;
}

const NOISE_DESCRIPTIONS = {
  white: '🌬 Ideal si sientes un pitido agudo o si el silencio te incomoda. Te ayuda a cubrir ese sonido y sentir el entorno más equilibrado.',
  pink: '🌿 Perfecto para relajarte sin desconectarte. Es suave, natural y ayuda a calmar tu mente mientras sigues presente.',
  brown: '🌙 Más cálido y profundo. Úsalo cuando necesites descansar o soltar el día. Te envuelve como un abrazo sonoro.',
};

export function ModoCalma({ noiseMode, onSelectMode }: ModoCalmaProps) {
  const [hoveredMode, setHoveredMode] = useState<NoiseMode | null>(null);

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-moon-ash mb-3">
        Modo calma
      </label>
      
      <div className="flex gap-3 relative">
        {/* White Noise */}
        <div className="flex-1 relative group">
          <button
            onClick={() => onSelectMode(noiseMode === 'white' ? null : 'white')}
            onMouseEnter={() => setHoveredMode('white')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`w-full px-4 py-3 rounded-full font-medium text-sm transition-all duration-moon ease-in-out
                       touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                       ${
                         noiseMode === 'white'
                           ? 'bg-moon-lavender/20 border-2 border-moon-lavender/50 text-moon-white moon-glow'
                           : 'bg-moon-navy-2/30 border border-moon-ash/20 text-moon-ash hover:bg-moon-navy-2/50 hover:text-moon-white'
                       }`}
          >
            Ruido blanco
          </button>
          
          {/* Tooltip */}
          {hoveredMode === 'white' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
              <div className="bg-moon-navy-2/95 backdrop-blur-sm text-moon-white text-xs px-3 py-2 rounded-lg border border-moon-lavender/30 shadow-lg max-w-[200px] text-center leading-relaxed">
                {NOISE_DESCRIPTIONS.white}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-moon-lavender/30"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Pink Noise */}
        <div className="flex-1 relative group">
          <button
            onClick={() => onSelectMode(noiseMode === 'pink' ? null : 'pink')}
            onMouseEnter={() => setHoveredMode('pink')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`w-full px-4 py-3 rounded-full font-medium text-sm transition-all duration-moon ease-in-out
                       touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                       ${
                         noiseMode === 'pink'
                           ? 'bg-moon-lavender/20 border-2 border-moon-lavender/50 text-moon-white moon-glow'
                           : 'bg-moon-navy-2/30 border border-moon-ash/20 text-moon-ash hover:bg-moon-navy-2/50 hover:text-moon-white'
                       }`}
          >
            Ruido rosa
          </button>
          
          {/* Tooltip */}
          {hoveredMode === 'pink' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
              <div className="bg-moon-navy-2/95 backdrop-blur-sm text-moon-white text-xs px-3 py-2 rounded-lg border border-moon-lavender/30 shadow-lg max-w-[200px] text-center leading-relaxed">
                {NOISE_DESCRIPTIONS.pink}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-moon-lavender/30"></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Brown Noise */}
        <div className="flex-1 relative group">
          <button
            onClick={() => onSelectMode(noiseMode === 'brown' ? null : 'brown')}
            onMouseEnter={() => setHoveredMode('brown')}
            onMouseLeave={() => setHoveredMode(null)}
            className={`w-full px-4 py-3 rounded-full font-medium text-sm transition-all duration-moon ease-in-out
                       touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                       ${
                         noiseMode === 'brown'
                           ? 'bg-moon-lavender/20 border-2 border-moon-lavender/50 text-moon-white moon-glow'
                           : 'bg-moon-navy-2/30 border border-moon-ash/20 text-moon-ash hover:bg-moon-navy-2/50 hover:text-moon-white'
                       }`}
          >
            Ruido marrón
          </button>
          
          {/* Tooltip */}
          {hoveredMode === 'brown' && (
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-20">
              <div className="bg-moon-navy-2/95 backdrop-blur-sm text-moon-white text-xs px-3 py-2 rounded-lg border border-moon-lavender/30 shadow-lg max-w-[200px] text-center leading-relaxed">
                {NOISE_DESCRIPTIONS.brown}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-px">
                  <div className="border-4 border-transparent border-t-moon-lavender/30"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

