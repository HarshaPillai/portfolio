"use client";

import { useEffect, useRef } from "react";

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  maxSize: number;
  opacity: number;
  age: number;
  lifetime: number;
  twinkleOffset: number;
};

export default function StarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const lastTime = useRef<number>(0);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const onMouseMove = (e: MouseEvent) => {
      const count = 3 + Math.floor(Math.random() * 3);
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 0.4 + Math.random() * 1.2;
        const maxSize = 2 + Math.random() * 6;
        particles.current.push({
          x: e.clientX + (Math.random() - 0.5) * 6,
          y: e.clientY + (Math.random() - 0.5) * 6,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.6,
          size: maxSize,
          maxSize,
          opacity: 1,
          age: 0,
          lifetime: 600 + Math.random() * 400,
          twinkleOffset: Math.random() * Math.PI * 2,
        });
      }
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = (timestamp: number) => {
      const delta = timestamp - lastTime.current;
      lastTime.current = timestamp;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current = particles.current.filter(p => p.age < p.lifetime);

      for (const p of particles.current) {
        p.age += delta;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.015;

        const progress = p.age / p.lifetime;
        p.opacity = 1 - progress;
        const twinkle = 0.85 + 0.15 * Math.sin(p.age * 0.015 + p.twinkleOffset);
        p.size = p.maxSize * (1 - progress) * twinkle;

        if (p.size <= 0 || p.opacity <= 0) continue;

        ctx.save();
        ctx.globalAlpha = p.opacity;
        ctx.fillStyle = "#AA8558";
        ctx.translate(p.x, p.y);

        const r = p.size / 2;
        const inner = r * 0.4;
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i * Math.PI) / 4;
          const radius = i % 2 === 0 ? r : inner;
          if (i === 0) {
            ctx.moveTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          } else {
            ctx.lineTo(Math.cos(angle) * radius, Math.sin(angle) * radius);
          }
        }
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />
  );
}