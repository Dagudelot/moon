import { useEffect, useRef } from 'react';

interface LunarWavesProps {
  frequency: number;
  isPlaying: boolean;
  volume: number;
}

export function LunarWaves({ frequency, isPlaying, volume }: LunarWavesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const timeRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resizeCanvas();
    const resizeObserver = new ResizeObserver(resizeCanvas);
    resizeObserver.observe(canvas);
    window.addEventListener('resize', resizeCanvas);

    // Animation parameters based on frequency
    // Lower frequencies (200-5000 Hz) = slower, wider pulses
    // Higher frequencies (5000-20000 Hz) = faster, thinner pulses
    const normalizeFreq = Math.max(200, Math.min(20000, frequency));
    const freqRatio = (normalizeFreq - 200) / (20000 - 200); // 0 to 1
    
    // Pulse speed: slower at low freq, faster at high freq
    const baseSpeed = 0.5; // base animation speed
    const speedMultiplier = 0.5 + freqRatio * 1.5; // 0.5 to 2.0
    
    // Wave width: wider at low freq, thinner at high freq
    const baseWidth = 8; // base wave width
    const widthMultiplier = 2 - freqRatio; // 2.0 to 1.0
    
    // Number of waves: fewer at low freq, more at high freq
    const numWaves = Math.floor(2 + freqRatio * 3); // 2 to 5 waves

    const animate = (currentTime: number) => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) {
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      const width = rect.width;
      const height = rect.height;

      if (!isPlaying) {
        timeRef.current = 0;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        animationFrameRef.current = requestAnimationFrame(animate);
        return;
      }

      timeRef.current = currentTime;
      
      const elapsed = timeRef.current * 0.001 * baseSpeed * speedMultiplier;

      // Clear with slight fade for trailing effect
      // Use transparent fill instead of semi-transparent to avoid color issues
      ctx.fillStyle = 'rgba(27, 31, 59, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = width / 2;
      const centerY = height / 2;
      const maxRadius = Math.min(width, height) / 2;

      // Volume affects opacity
      const opacity = Math.min(volume, 0.4) * 0.6; // Max 0.24 opacity

      // Draw multiple waves
      for (let i = 0; i < numWaves; i++) {
        const waveOffset = (elapsed + i * 0.5) % 2;
        const radius = (waveOffset * maxRadius * 0.6);
        
        if (radius > 0 && radius < maxRadius) {
          const gradient = ctx.createRadialGradient(
            centerX, centerY, radius * 0.8,
            centerX, centerY, radius * widthMultiplier
          );
          
          gradient.addColorStop(0, `rgba(214, 196, 240, ${opacity * 0.8})`);
          gradient.addColorStop(0.5, `rgba(214, 196, 240, ${opacity * 0.4})`);
          gradient.addColorStop(1, 'rgba(214, 196, 240, 0)');

          ctx.beginPath();
          ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
          ctx.strokeStyle = gradient;
          ctx.lineWidth = baseWidth * widthMultiplier;
          ctx.stroke();
        }
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      resizeObserver.disconnect();
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [frequency, isPlaying, volume]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 w-full h-full"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}

