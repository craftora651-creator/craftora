// components/onboarding/animations/ParticleEffect.tsx
import React, { useEffect, useRef } from 'react';
import '../styles/onboarding.css';

const ParticleEffect: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    interface Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;
      alpha: number;
      angle: number;
    }
    
    const particles: Particle[] = [];
    const colors = [
      '#FF6B8B', '#FFD166', '#06D6A0', '#8338EC', '#3A86FF', '#FB5607'
    ];
    
    // Daha az partikül, daha performanslı
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 4 + 1,
        speedX: (Math.random() - 0.5) * 0.3,
        speedY: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.4 + 0.2,
        angle: Math.random() * Math.PI * 2
      });
    }
    
    let animationId: number;
    
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Hafif gradient background
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(255, 107, 139, 0.02)');
      gradient.addColorStop(1, 'rgba(131, 56, 236, 0.02)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((particle, i) => {
        // Hareket
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        particle.angle += 0.01;
        
        // Sınır kontrolü
        if (particle.x < 0 || particle.x > canvas.width) particle.speedX *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.speedY *= -1;
        
        // Dalga hareketi
        const waveX = Math.sin(Date.now() * 0.001 + i) * 0.5;
        const waveY = Math.cos(Date.now() * 0.001 + i) * 0.5;
        
        // Partikül çiz
        ctx.beginPath();
        ctx.arc(particle.x + waveX, particle.y + waveY, particle.size, 0, Math.PI * 2);
        
        // Gradient fill
        const particleGradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size * 2
        );
        particleGradient.addColorStop(0, particle.color);
        particleGradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = particleGradient;
        ctx.globalAlpha = particle.alpha;
        ctx.fill();
        
        // Bağlantı çizgileri - sadece yakın partiküller
        for (let j = i + 1; j < particles.length; j++) {
          const other = particles[j];
          const dx = particle.x - other.x;
          const dy = particle.y - other.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particle.x, particle.y);
            ctx.lineTo(other.x, other.y);
            ctx.strokeStyle = particle.color;
            ctx.globalAlpha = 0.05 * (1 - distance / 100);
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, []);
  
  return (
    <canvas 
      ref={canvasRef}
      className="particle-canvas"
    />
  );
};

export default ParticleEffect;