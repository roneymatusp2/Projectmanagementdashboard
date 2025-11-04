import { useEffect, useRef, useState } from 'react';
import { ProjectPhase } from '../utils/phaseCalculator';

interface PhaseBackgroundProps {
  phase: ProjectPhase;
}

export function PhaseBackground({ phase }: PhaseBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || prefersReducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);

    // Particle system
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      opacity: number;
    }> = [];

    // Initialize particles based on phase
    for (let i = 0; i < phase.particleEffect.density; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * phase.particleEffect.velocity,
        vy: (Math.random() - 0.5) * phase.particleEffect.velocity,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.3
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw particles based on effect type
      particles.forEach((particle, index) => {
        switch (phase.particleEffect.type) {
          case 'matrix':
            // Matrix rain effect
            ctx.fillStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.font = `${particle.size * 8}px monospace`;
            ctx.fillText(
              String.fromCharCode(0x30A0 + Math.random() * 96),
              particle.x,
              particle.y
            );
            particle.y += phase.particleEffect.velocity * 2;
            if (particle.y > canvas.height) {
              particle.y = -10;
              particle.x = Math.random() * canvas.width;
            }
            break;

          case 'particles':
            // Coalescing particles
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            break;

          case 'blueprints':
            // Blueprint grid lines
            ctx.strokeStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(particle.x, 0);
            ctx.lineTo(particle.x, canvas.height);
            ctx.stroke();
            
            particle.x += particle.vx;
            if (particle.x < -50 || particle.x > canvas.width + 50) {
              particle.x = Math.random() * canvas.width;
            }
            break;

          case 'splash':
            // Paint splash effect
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
            const gradient = ctx.createRadialGradient(
              particle.x, particle.y, 0,
              particle.x, particle.y, particle.size * 2
            );
            gradient.addColorStop(0, `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${phase.particleEffect.color}00`);
            ctx.fillStyle = gradient;
            ctx.fill();
            
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.size *= 0.99;
            
            if (particle.size < 0.5) {
              particle.x = Math.random() * canvas.width;
              particle.y = Math.random() * canvas.height;
              particle.size = Math.random() * 3 + 1;
            }
            break;

          case 'waves':
            // Pulse waves
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size * 10, 0, Math.PI * 2);
            ctx.strokeStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = 2;
            ctx.stroke();
            
            particle.size += 0.5;
            particle.opacity *= 0.98;
            
            if (particle.opacity < 0.1) {
              particle.x = Math.random() * canvas.width;
              particle.y = Math.random() * canvas.height;
              particle.size = 1;
              particle.opacity = 0.5;
            }
            break;

          case 'launch':
            // Ascending particles (rocket launch)
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            ctx.fillStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 255).toString(16).padStart(2, '0')}`;
            ctx.fill();
            
            // Trail effect
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(particle.x, particle.y + particle.size * 3);
            ctx.strokeStyle = `${phase.particleEffect.color}${Math.floor(particle.opacity * 128).toString(16).padStart(2, '0')}`;
            ctx.lineWidth = particle.size;
            ctx.stroke();
            
            particle.y -= phase.particleEffect.velocity * 2;
            particle.x += particle.vx * 0.5;
            
            if (particle.y < -10) {
              particle.y = canvas.height + 10;
              particle.x = Math.random() * canvas.width;
            }
            break;

          case 'confetti':
            // Celebration confetti
            ctx.save();
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.vx);
            ctx.fillStyle = `hsl(${index * 360 / particles.length}, 80%, 60%)`;
            ctx.fillRect(-particle.size, -particle.size, particle.size * 2, particle.size * 4);
            ctx.restore();
            
            particle.y += phase.particleEffect.velocity;
            particle.x += particle.vx;
            particle.vx += (Math.random() - 0.5) * 0.2;
            
            if (particle.y > canvas.height) {
              particle.y = -10;
              particle.x = Math.random() * canvas.width;
            }
            break;
        }
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      window.removeEventListener('resize', setCanvasSize);
    };
  }, [phase, prefersReducedMotion]);

  return (
    <div className="fixed inset-0 -z-10">
      {/* Animated Gradient Background */}
      <div
        className="absolute inset-0 transition-all duration-[5000ms] ease-in-out"
        style={{
          background: `linear-gradient(${phase.backgroundGradient.angle}deg, ${phase.backgroundGradient.primary}, ${phase.backgroundGradient.secondary})`,
          backgroundSize: '400% 400%',
          animation: 'gradient-shift 15s ease infinite'
        }}
      />
      
      {/* Radial gradient overlay for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.3) 100%)'
        }}
      />
      
      {/* Canvas for particle effects */}
      {!prefersReducedMotion && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0 opacity-50"
          style={{ mixBlendMode: 'screen' }}
        />
      )}
      
      {/* Animated mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          background: `
            radial-gradient(at 20% 30%, rgba(59, 130, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
            radial-gradient(at 50% 50%, rgba(236, 72, 153, 0.2) 0px, transparent 50%)
          `,
          animation: 'gradient-shift 20s ease infinite'
        }}
      />
      
      {/* Subtle noise texture for premium feel */}
      <div className="absolute inset-0 opacity-5" style={{ 
        backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' /%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' /%3E%3C/svg%3E")',
      }} />
    </div>
  );
}
