'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';

const NUM_PARTICLES = 100;
const PARTICLE_SIZE = 2; // px
const MAX_SPEED = 0.8; // px/frame (Adjusted to medium speed)
const MOUSE_ATTRACTION_RADIUS = 150; // px
const ATTRACTION_FORCE = 0.03; // (Adjusted to medium speed)
const FRICTION = 0.95;
const PARTICLE_COLOR = '255, 255, 255'; // RGB for white
const PARTICLE_ALPHA = 1.0; // Initial transparency (Increased for brighter particles)

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
}

const CustomStarfieldBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Initialize off-screen
  const particles = useRef<Particle[]>([]);
  const animationFrameId = useRef<number>(0);

  const generateParticles = useCallback((width: number, height: number) => {
    const newParticles: Particle[] = [];
    for (let i = 0; i < NUM_PARTICLES; i++) {
      newParticles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * MAX_SPEED,
        vy: (Math.random() - 0.5) * MAX_SPEED,
        size: PARTICLE_SIZE * Math.random() + 1,
        alpha: PARTICLE_ALPHA * Math.random() + 0.1,
      });
    }
    particles.current = newParticles;
  }, []);

  const animate = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.current.forEach(p => {
      // Attraction to mouse
      const dx = mousePos.x - p.x;
      const dy = mousePos.y - p.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < MOUSE_ATTRACTION_RADIUS) {
        const forceDirectionX = dx / distance;
        const forceDirectionY = dy / distance;
        p.vx += forceDirectionX * ATTRACTION_FORCE;
        p.vy += forceDirectionY * ATTRACTION_FORCE;
      }

      // Apply friction
      p.vx *= FRICTION;
      p.vy *= FRICTION;

      // Limit speed
      const speed = Math.sqrt(p.vx * p.vx + p.vy * p.vy);
      if (speed > MAX_SPEED) {
        p.vx = (p.vx / speed) * MAX_SPEED;
        p.vy = (p.vy / speed) * MAX_SPEED;
      }

      p.x += p.vx;
      p.y += p.vy;

      // Wrap particles around screen
      if (p.x < 0) p.x = canvas.width;
      if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height;
      if (p.y > canvas.height) p.y = 0;

      // Draw particle
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${PARTICLE_COLOR}, ${p.alpha})`;
      ctx.fill();
    });

    animationFrameId.current = requestAnimationFrame(animate);
  }, [mousePos]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      generateParticles(canvas.width, canvas.height);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    // Initial setup
    handleResize();

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    // Start animation loop
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [animate, generateParticles]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ background: 'transparent' }}
    />
  );
};

export default CustomStarfieldBackground;
