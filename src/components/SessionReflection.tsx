import { useState, useEffect } from 'react';

const REFLECTION_MESSAGES = [
  'Hoy te conectaste con el silencio. 🌙',
  'Vuelve cuando necesites respirar.',
  'El silencio también es parte de la música.',
];

interface SessionReflectionProps {
  show: boolean;
  onComplete: () => void;
}

export function SessionReflection({ show, onComplete }: SessionReflectionProps) {
  const [message, setMessage] = useState<string>('');
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    if (show) {
      // Randomly select a message
      const randomMessage = REFLECTION_MESSAGES[Math.floor(Math.random() * REFLECTION_MESSAGES.length)];
      setMessage(randomMessage);
      
      // Fade in
      setTimeout(() => setOpacity(1), 50);
      
      // Fade out after 5 seconds
      const fadeOutTimer = setTimeout(() => {
        setOpacity(0);
        setTimeout(onComplete, 400); // Wait for fade out animation
      }, 5000);

      return () => {
        clearTimeout(fadeOutTimer);
      };
    } else {
      setOpacity(0);
      setMessage('');
    }
  }, [show, onComplete]);

  if (!show || !message) return null;

  return (
    <div
      className="fixed bottom-8 left-0 right-0 px-6 z-40 pointer-events-none"
      style={{
        opacity,
        transition: 'opacity 400ms ease-in-out',
      }}
    >
      <div className="max-w-md mx-auto">
        <p className="text-center text-moon-white text-sm leading-relaxed bg-moon-navy-2/60 backdrop-blur-sm px-4 py-3 rounded-full border border-moon-lavender/20">
          {message}
        </p>
      </div>
    </div>
  );
}

