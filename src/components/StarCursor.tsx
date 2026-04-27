"use client";

import { useEffect, useRef } from "react";

type TrailPoint = { x: number; y: number };

type ShootingStar = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  length: number;
  opacity: number;
  maxOpacity: number;
  life: number;       // 0→1
  speed: number;
};

function newShootingStar(w: number, h: number): ShootingStar {
  const fromRight = Math.random() > 0.5;
  const angle = (Math.PI / 4) + (Math.random() - 0.5) * 0.4;
  const speed = 1.2 + Math.random() * 1.8;
  const vx = fromRight ? -Math.cos(angle) * speed : Math.cos(angle) * speed;
  const vy = Math.sin(angle) * speed;
  const x = fromRight ? w + 20 : -20;
  const y = Math.random() * h * 0.6;
  return {
    x, y, vx, vy,
    length: 80 + Math.random() * 70,
    opacity: 0,
    maxOpacity: 0.15 + Math.random() * 0.15,
    life: 0,
    speed,
  };
}

export default function StarCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const trailRef  = useRef<TrailPoint[]>([]);
  const starsRef  = useRef<ShootingStar[]>([]);
  const rafRef    = useRef<number | null>(null);
  const mouseRef  = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Seed initial shooting stars
    for (let i = 0; i < 4; i++) {
      const s = newShootingStar(canvas.width, canvas.height);
      s.life = Math.random(); // stagger
      starsRef.current.push(s);
    }

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
      trailRef.current.push({ x: e.clientX, y: e.clientY });
      if (trailRef.current.length > 50) trailRef.current.shift();
    };
    window.addEventListener("mousemove", onMouseMove);

    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // ── Shooting stars ────────────────────────────────────────────────────
      const updated: ShootingStar[] = [];
      for (const s of starsRef.current) {
        s.life += s.speed * 0.0015;
        s.x += s.vx;
        s.y += s.vy;

        // Fade in/out over the lifetime
        const fade = s.life < 0.2
          ? s.life / 0.2
          : s.life > 0.8
          ? 1 - (s.life - 0.8) / 0.2
          : 1;
        s.opacity = s.maxOpacity * fade;

        if (s.opacity > 0) {
          ctx.save();
          ctx.globalAlpha = s.opacity;
          ctx.strokeStyle = "rgba(255, 240, 180, 1)";
          ctx.lineWidth = 1;
          ctx.shadowBlur = 6;
          ctx.shadowColor = "rgba(255, 220, 120, 0.6)";
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * s.length, s.y - s.vy * s.length);
          ctx.stroke();
          ctx.restore();
        }

        if (s.life < 1) {
          updated.push(s);
        } else {
          updated.push(newShootingStar(w, h));
        }
      }
      starsRef.current = updated;

      // ── Cursor trail ──────────────────────────────────────────────────────
      const trail = trailRef.current;
      if (trail.length > 1) {
        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = "rgba(255, 220, 120, 0.8)";

        for (let i = 0; i < trail.length; i++) {
          const t = i / (trail.length - 1);              // 0 = oldest, 1 = newest
          const eased = t * t;
          const opacity = eased;
          const radius  = 0.5 + eased * 2.5;            // 0.5px → 3px

          ctx.globalAlpha = opacity;
          ctx.fillStyle = `rgba(255, 240, 180, 1)`;
          ctx.beginPath();
          ctx.arc(trail[i].x, trail[i].y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
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
