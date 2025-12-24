import React, { useState } from 'react';
import { useAudioEngineExtended } from './hooks/useAudioEngineExtended';
import { FrequencySlider } from './components/FrequencySlider';
import { Controls } from './components/Controls';
import { Logo } from './components/Logo';
import { LunarWaves } from './components/LunarWaves';
import { GuidedFrequencyFinder } from './components/GuidedFrequencyFinder';
import { ModoCalma } from './components/ModoCalma';
import { SessionReflection } from './components/SessionReflection';

function App() {
  const audioEngine = useAudioEngineExtended();
  const [showGuidedMode, setShowGuidedMode] = useState(false);
  const [showReflection, setShowReflection] = useState(false);
  const [wasPlaying, setWasPlaying] = useState(false);

  const handleEnable = async () => {
    await audioEngine.enable();
  };

  const handlePlay = () => {
    if (audioEngine.noiseMode) {
      audioEngine.playNoise(audioEngine.noiseMode);
    } else {
      audioEngine.playTone();
    }
    setWasPlaying(true);
  };

  const handleStop = () => {
    audioEngine.stop();
    if (wasPlaying) {
      setShowReflection(true);
      setWasPlaying(false);
    }
  };

  const handleStartGuidedMode = () => {
    setShowGuidedMode(true);
    audioEngine.sweep();
  };

  const handleNoiseModeSelect = (mode: typeof audioEngine.noiseMode) => {
    audioEngine.setNoiseMode(mode);
    if (audioEngine.isPlaying) {
      if (mode) {
        audioEngine.playNoise(mode);
      } else {
        audioEngine.playTone();
      }
    }
  };

  return (
    <div className="min-h-screen moon-bg flex flex-col relative overflow-hidden">
      {/* Subtle lavender gradient overlay */}
      <div className="absolute inset-0 moon-bg-overlay pointer-events-none" />
      
      {/* Lunar Waves Visualization */}
      {audioEngine.isReady && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <LunarWaves
            frequency={audioEngine.frequency}
            isPlaying={audioEngine.isPlaying}
            volume={audioEngine.volume}
          />
        </div>
      )}
      
      <main className="flex-1 px-6 py-12 max-w-md mx-auto w-full relative z-10">
        {/* Logo */}
        <div className="mb-8 flex justify-center">
          <Logo size="md" />
        </div>

        {/* Header Section */}
        <header className="mb-12 text-center">
          <h1 className="text-3xl sm:text-4xl font-light text-moon-white mb-4 tracking-tight">
            ¿A qué suena tu pitido?
          </h1>
          <p className="text-sm text-moon-ash leading-relaxed max-w-xs mx-auto">
            Mueve el control hasta que coincida. Evita volúmenes altos.
          </p>
        </header>

        {/* Enable Audio Button (shown before context is unlocked) */}
        {!audioEngine.isReady && (
          <div className="mb-8">
            <button
              onClick={handleEnable}
              className="w-full px-8 py-4 bg-moon-lavender/20 backdrop-blur-sm 
                         text-moon-white rounded-full font-medium border border-moon-lavender/30
                         moon-glow-hover transition-all duration-moon ease-in-out
                         touch-target focus:outline-none focus:ring-2 focus:ring-moon-lavender/50 focus:ring-offset-2 focus:ring-offset-moon-navy
                         hover:bg-moon-lavender/30 hover:border-moon-lavender/50"
              aria-label="Activar audio para comenzar"
            >
              Activar audio
            </button>
          </div>
        )}

        {/* Controls Section (shown after audio is enabled) */}
        {audioEngine.isReady && (
          <div className="space-y-10">
            {/* Frequency Slider */}
            <FrequencySlider
              value={audioEngine.frequency}
              onChange={audioEngine.setFrequency}
            />

            {/* Controls (Volume, Play, Stop, Guided Mode) */}
            <Controls
              isReady={audioEngine.isReady}
              isPlaying={audioEngine.isPlaying}
              volume={audioEngine.volume}
              onVolumeChange={audioEngine.setVolume}
              onPlay={handlePlay}
              onStop={handleStop}
              onStartGuidedMode={handleStartGuidedMode}
            />

            {/* Modo Calma - Noise Modes */}
            <ModoCalma
              noiseMode={audioEngine.noiseMode}
              onSelectMode={handleNoiseModeSelect}
              isPlaying={audioEngine.isPlaying}
            />
          </div>
        )}

        {/* Footer Helper Text */}
        <footer className="mt-16 pt-8 border-t border-moon-navy-2/50">
          <p className="text-xs text-moon-ash/70 leading-relaxed text-center">
            Si el sonido te resulta incómodo, detén la reproducción. Cuida tus oídos.
          </p>
        </footer>
      </main>

      {/* Guided Frequency Finder Modal */}
      {showGuidedMode && (
        <GuidedFrequencyFinder
          isReady={audioEngine.isReady}
          isPlaying={audioEngine.isPlaying}
          frequency={audioEngine.frequency}
          onSweep={audioEngine.sweep}
          onSetFrequency={audioEngine.setFrequency}
          onPlayTone={audioEngine.playTone}
          onStop={audioEngine.stop}
          onClose={() => {
            setShowGuidedMode(false);
            audioEngine.stop();
          }}
        />
      )}

      {/* Session Reflection Message */}
      <SessionReflection
        show={showReflection}
        onComplete={() => setShowReflection(false)}
      />
    </div>
  );
}

export default App;


