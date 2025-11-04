import React, { useState, useEffect } from 'react';
import { setStoredFoundFrequency } from '../lib/storage';

interface GuidedFrequencyFinderProps {
  isReady: boolean;
  isPlaying: boolean;
  frequency: number;
  onSweep: () => void;
  onSetFrequency: (hz: number) => void;
  onPlayTone: () => void;
  onStop: () => void;
  onClose: () => void;
}

type Step = 'sweep' | 'question' | 'result';

export function GuidedFrequencyFinder({
  isReady,
  isPlaying,
  frequency,
  onSweep,
  onSetFrequency,
  onPlayTone,
  onStop,
  onClose,
}: GuidedFrequencyFinderProps) {
  const [step, setStep] = useState<Step>('sweep');
  const [foundFrequency, setFoundFrequency] = useState<number>(frequency);
  const [isPlayingTest, setIsPlayingTest] = useState(false);

  const FREQ_STEP = 500; // Hz adjustment step

  // When sweep completes, move to question step
  useEffect(() => {
    if (step === 'sweep') {
      if (!isPlaying) {
        // Wait a moment after sweep completes
        const timer = setTimeout(() => {
          setStep('question');
          setFoundFrequency(frequency);
        }, 500);
        return () => clearTimeout(timer);
      }
    }
  }, [step, isPlaying, frequency]);

  const handleSweep = () => {
    setStep('sweep');
    onSweep();
  };

  const handleAdjustDown = () => {
    const newFreq = Math.max(500, foundFrequency - FREQ_STEP);
    setFoundFrequency(newFreq);
    onSetFrequency(newFreq);
    if (isPlayingTest) {
      onStop();
      setTimeout(() => {
        onPlayTone();
        setIsPlayingTest(true);
      }, 100);
    } else {
      onPlayTone();
      setIsPlayingTest(true);
    }
  };

  const handleAdjustUp = () => {
    const newFreq = Math.min(20000, foundFrequency + FREQ_STEP);
    setFoundFrequency(newFreq);
    onSetFrequency(newFreq);
    if (isPlayingTest) {
      onStop();
      setTimeout(() => {
        onPlayTone();
        setIsPlayingTest(true);
      }, 100);
    } else {
      onPlayTone();
      setIsPlayingTest(true);
    }
  };

  const handleConfirm = () => {
    setStoredFoundFrequency(foundFrequency);
    setStep('result');
    onStop();
    setIsPlayingTest(false);
  };

  const handlePlayFoundFrequency = () => {
    onSetFrequency(foundFrequency);
    onPlayTone();
  };

  const getFrequencyMessage = (freq: number): string => {
    if (freq < 2000) {
      return 'Este rango es común en tinnitus leve. Respira profundo.';
    } else if (freq < 6000) {
      return 'Este rango es común en tinnitus moderado. Tómate tu tiempo.';
    } else {
      return 'Este rango es común en tinnitus agudo. Descansa cuando lo necesites.';
    }
  };

  if (step === 'sweep') {
    return (
      <div className="fixed inset-0 bg-moon-navy/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center space-y-6">
          <p className="text-moon-white text-lg">
            Escuchando el barrido...
          </p>
          <p className="text-moon-ash text-sm">
            Cuando escuches una frecuencia similar a tu pitido, el barrido se detendrá automáticamente.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'question') {
    return (
      <div className="fixed inset-0 bg-moon-navy/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6">
          <div className="text-center">
            <h2 className="text-xl text-moon-white mb-2">
              ¿Se parece a tu pitido?
            </h2>
            <p className="text-sm text-moon-ash mb-4">
              Frecuencia actual: <span className="text-moon-white font-semibold">{Math.round(foundFrequency)} Hz</span>
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={handleAdjustDown}
              className="px-6 py-3 bg-moon-navy-2/40 border border-moon-lavender/30 
                         text-moon-white rounded-full font-medium
                         transition-all duration-moon ease-in-out
                         hover:bg-moon-navy-2/60 hover:border-moon-lavender/50
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50"
            >
              Más grave 🔽
            </button>

            <button
              onClick={handleAdjustUp}
              className="px-6 py-3 bg-moon-navy-2/40 border border-moon-lavender/30 
                         text-moon-white rounded-full font-medium
                         transition-all duration-moon ease-in-out
                         hover:bg-moon-navy-2/60 hover:border-moon-lavender/50
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50"
            >
              Más agudo 🔼
            </button>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handleConfirm}
              className="flex-1 px-6 py-3 bg-moon-lavender/20 border border-moon-lavender/30 
                         text-moon-white rounded-full font-medium
                         moon-glow-hover transition-all duration-moon ease-in-out
                         hover:bg-moon-lavender/30 hover:border-moon-lavender/50
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50"
            >
              Confirmar
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-moon-navy-2/40 border border-moon-ash/20 
                         text-moon-ash rounded-full font-medium
                         transition-all duration-moon ease-in-out
                         hover:bg-moon-navy-2/60 hover:text-moon-white
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-ash/30"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="fixed inset-0 bg-moon-navy/95 backdrop-blur-sm z-50 flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-6 text-center">
          <div>
            <h2 className="text-2xl text-moon-white mb-3">
              Tu frecuencia está alrededor de {Math.round(foundFrequency)} Hz
            </h2>
            <p className="text-moon-ash leading-relaxed">
              {getFrequencyMessage(foundFrequency)}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={handlePlayFoundFrequency}
              className="flex-1 px-6 py-3 bg-moon-lavender/20 border border-moon-lavender/30 
                         text-moon-white rounded-full font-medium
                         moon-glow-hover transition-all duration-moon ease-in-out
                         hover:bg-moon-lavender/30 hover:border-moon-lavender/50
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50"
            >
              Escuchar tu frecuencia
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3 bg-moon-navy-2/40 border border-moon-ash/20 
                         text-moon-white rounded-full font-medium
                         transition-all duration-moon ease-in-out
                         hover:bg-moon-navy-2/60
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-ash/30"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

