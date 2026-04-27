"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type P = { x: number; y: number; age: number };
type S = { x: number; y: number; vx: number; vy: number;
           length: number; life: number; maxOpacity: number; speed: number };

function mkStar(w: number, h: number): S {
  const r = Math.random() > 0.5;
  const a = Math.PI / 4 + (Math.random() - 0.5) * 0.4;
  const sp = 1.5 + Math.random() * 2;
  return {
    x: r ? w + 20 : -20,
    y: Math.random() * h * 0.7,
    vx: r ? -Math.cos(a) * sp : Math.cos(a) * sp,
    vy: Math.sin(a) * sp,
    length: 80 + Math.random() * 70,
    life: Math.random(),
    maxOpacity: 0.12 + Math.random() * 0.15,
    speed: sp,
  };
}

export default function StarCursor() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth < 768) return;
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
      canvas.style.width  = window.innerWidth  + "px";
      canvas.style.height = window.innerHeight + "px";
    };
    resize();
    window.addEventListener("resize", resize);

    const trail: P[] = [];
    const stars: S[] = Array.from({ length: 4 }, () =>
      mkStar(canvas.width, canvas.height)
    );

    const onMove = (e: MouseEvent) => {
      trail.push({ x: e.clientX, y: e.clientY, age: 0 });
      if (trail.length > 60) trail.shift();
    };
    window.addEventListener("mousemove", onMove);

    const LIFE = 24;

    let raf: number;
    const draw = () => {
      const w = canvas.width;
      const h = canvas.height;
      ctx.clearRect(0, 0, w, h);

      // Age and cull trail points
      for (let i = trail.length - 1; i >= 0; i--) {
        trail[i].age++;
        if (trail[i].age > LIFE) trail.splice(i, 1);
      }

      // Draw sparkler trail
      for (const p of trail) {
        const t = 1 - p.age / LIFE;
        const r = 0.4 + t * 3.6;
        const a = t * t;
        ctx.save();
        ctx.globalAlpha = a;
        ctx.shadowBlur  = 6 + t * 16;
        ctx.shadowColor = "rgba(255,200,80,0.9)";
        ctx.fillStyle   = t > 0.5
          ? "rgba(255,252,210,1)"
          : "rgba(255,150,30,1)";
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.1, r), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // Shooting stars
      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        s.life += s.speed * 0.002;
        s.x += s.vx;
        s.y += s.vy;
        const fade = s.life < 0.2 ? s.life / 0.2
          : s.life > 0.8 ? 1 - (s.life - 0.8) / 0.2 : 1;
        const alpha = s.maxOpacity * fade;
        if (alpha > 0.005) {
          ctx.save();
          ctx.globalAlpha = alpha;
          ctx.strokeStyle = "rgba(255,235,150,1)";
          ctx.lineWidth   = 1;
          ctx.shadowBlur  = 6;
          ctx.shadowColor = "rgba(255,200,80,0.6)";
          ctx.beginPath();
          ctx.moveTo(s.x, s.y);
          ctx.lineTo(s.x - s.vx * s.length, s.y - s.vy * s.length);
          ctx.stroke();
          ctx.restore();
        }
        if (s.life >= 1) stars[i] = mkStar(w, h);
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(raf);
    };
  }, [mounted]);

  if (!mounted) return null;
  return createPortal(
    <canvas
      ref={ref}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        pointerEvents: "none",
        zIndex: 9999,
      }}
    />,
    document.body
  );
}
