"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  direction: "enter" | "exit";
  onComplete: () => void;
};

const CD_SIZE  = 140;
const DROP_DUR = 700;
const PAUSE_DUR = 180;
const FLIP_DUR  = 1100;
const FLOAT_DUR = 520;
const BG_DUR    = 600;

function easeOut3(t: number)   { return 1 - Math.pow(1 - t, 3); }
function easeIn2(t: number)    { return t * t; }
function easeInOut3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function dropEase(t: number) {
  if (t < 0.82) return easeOut3(t / 0.82) * 1.04;
  const bt = (t - 0.82) / 0.18;
  return 1.04 + (1.0 - 1.04) * easeInOut3(bt);
}

function CDFace({ side }: { side: "a" | "b" }) {
  const gradId = side === "a" ? "cdGradA" : "cdGradB";
  if (side === "a") {
    return (
      <svg viewBox="0 0 140 140" width={140} height={140} style={{ display: "block" }}>
        <defs>
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#FFD580" />
            <stop offset="40%"  stopColor="#FF7A00" />
            <stop offset="100%" stopColor="#8A1A00" />
          </radialGradient>
        </defs>
        <circle cx="70" cy="70" r="68" fill={`url(#${gradId})`} />
        <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="32" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="20" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="0.6" />
        {/* Nearly-transparent label zone — gradient shows through like a real CD */}
        <circle cx="70" cy="70" r="22" fill="rgba(255,255,255,0.04)" />
        {/* Spindle hole */}
        <circle cx="70" cy="70" r="6"  fill="rgba(0,0,0,0.2)" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 140 140" width={140} height={140} style={{ display: "block" }}>
      <defs>
        <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
          <stop offset="0%"   stopColor="#2A1A0A" />
          <stop offset="55%"  stopColor="#0F0800" />
          <stop offset="100%" stopColor="#000000" />
        </radialGradient>
      </defs>
      <circle cx="70" cy="70" r="68" fill={`url(#${gradId})`} />
      <circle cx="70" cy="70" r="68" fill="none" stroke="rgba(255,85,0,0.18)" strokeWidth="1.5" />
      <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,85,0,0.08)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(255,85,0,0.08)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="32" fill="none" stroke="rgba(255,85,0,0.08)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="20" fill="none" stroke="rgba(255,85,0,0.08)" strokeWidth="0.6" />
      {/* Nearly-transparent label zone */}
      <circle cx="70" cy="70" r="22" fill="rgba(255,255,255,0.04)" />
      {/* Spindle hole */}
      <circle cx="70" cy="70" r="6"  fill="rgba(0,0,0,0.2)" />
    </svg>
  );
}

function LoaderOverlay({ direction, onComplete }: Props) {
  const bgRef      = useRef<HTMLDivElement>(null);
  const cdWrapRef  = useRef<HTMLDivElement>(null);
  const aSideRef   = useRef<HTMLDivElement>(null);
  const bSideRef   = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const bgEl    = bgRef.current;
    const cdWrap  = cdWrapRef.current;
    const aSide   = aSideRef.current;
    const bSide   = bSideRef.current;
    const statusEl = statusRef.current;
    if (!bgEl || !cdWrap || !aSide || !bSide) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetY = vh / 2 - CD_SIZE / 2;
    const startY  = -(CD_SIZE + 30);

    // bg color components for alpha-fade (fades to transparent, not to opposite color)
    const [bgR, bgG, bgB] = direction === "enter" ? [255, 255, 255] : [10, 10, 10];

    if (direction === "enter") {
      aSide.style.display = "block";
      bSide.style.display = "none";
    } else {
      aSide.style.display = "none";
      bSide.style.display = "block";
    }

    const setCdTransform = (y: number, scaleX = 1, opacity = 1) => {
      const cdHalf = CD_SIZE / 2;
      cdWrap.style.transform = `translateX(${vw / 2 - cdHalf}px) translateY(${y}px) scaleX(${scaleX})`;
      cdWrap.style.opacity   = String(opacity);
    };

    type Phase = "drop" | "pause" | "flip" | "float" | "done";
    let phase: Phase = "drop";
    let phaseStart  = 0;
    let bgStart     = 0;
    let faceSwapped = false;
    let rafId: number;

    const tick = (now: number) => {
      if (!phaseStart) phaseStart = now;
      const elapsed = now - phaseStart;

      if (phase === "drop") {
        if (statusEl) statusEl.textContent = "dropping in...";
        const t = Math.min(elapsed / DROP_DUR, 1);
        setCdTransform(lerp(startY, targetY, dropEase(t)));
        if (t >= 1) { phase = "pause"; phaseStart = now; }

      } else if (phase === "pause") {
        if (elapsed >= PAUSE_DUR) {
          phase = "flip";
          phaseStart = now;
          if (statusEl) statusEl.textContent = direction === "enter" ? "flipping b-side..." : "flipping a-side...";
        }

      } else if (phase === "flip") {
        const t = Math.min(elapsed / FLIP_DUR, 1);
        const scaleX = t < 0.5
          ? 1 - easeInOut3(t * 2)
          : easeInOut3((t - 0.5) * 2);
        setCdTransform(targetY, scaleX);

        if (t >= 0.5 && !faceSwapped) {
          faceSwapped = true;
          if (direction === "enter") {
            aSide.style.display = "none";
            bSide.style.display = "block";
          } else {
            bSide.style.display = "none";
            aSide.style.display = "block";
          }
        }

        // Start bg fade at 72% through flip
        if (t >= 0.72 && !bgStart) bgStart = now;
        if (bgStart) {
          const bgT   = Math.min((now - bgStart) / BG_DUR, 1);
          const alpha = 1 - easeInOut3(bgT);
          bgEl.style.background = `rgba(${bgR},${bgG},${bgB},${alpha})`;
          if (statusEl) statusEl.style.opacity = String(alpha);
        }

        if (t >= 1) { phase = "float"; phaseStart = now; if (statusEl) statusEl.textContent = "loading..."; }

      } else if (phase === "float") {
        const t = Math.min(elapsed / FLOAT_DUR, 1);
        const y = lerp(targetY, startY, easeIn2(t));
        setCdTransform(y, 1, 1 - easeIn2(t));

        if (bgStart) {
          const bgT   = Math.min((now - bgStart) / BG_DUR, 1);
          const alpha = 1 - easeInOut3(bgT);
          bgEl.style.background = `rgba(${bgR},${bgG},${bgB},${alpha})`;
          if (statusEl) statusEl.style.opacity = String(alpha);
        }

        if (t >= 1) { phase = "done"; onComplete(); return; }
      }

      if (phase !== "done") rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [direction, onComplete]);

  const isEnter = direction === "enter";

  return (
    <>
      {/* White backdrop ensures no black flash when dark overlay fades on exit */}
      <div
        style={{
          position: "fixed", inset: 0,
          zIndex: 8999,
          background: "#FFFFFF",
          pointerEvents: "none",
        }}
      />

      {/* Main overlay — bg layer is separate from CD so opacity doesn't compound */}
      <div style={{ position: "fixed", inset: 0, zIndex: 9000, overflow: "hidden" }}>
        {/* Background layer — fades to transparent via rgba alpha */}
        <div
          ref={bgRef}
          style={{
            position: "absolute", inset: 0,
            background: isEnter ? "rgba(255,255,255,1)" : "rgba(10,10,10,1)",
          }}
        />

        {/* CD wrapper — positioned via transform in RAF, unaffected by bg opacity */}
        <div
          ref={cdWrapRef}
          style={{
            position: "absolute", top: 0, left: 0,
            width: CD_SIZE, height: CD_SIZE,
            transformOrigin: "center center",
            zIndex: 1,
          }}
        >
          <div ref={aSideRef} style={{ position: "absolute", inset: 0 }}>
            <CDFace side="a" />
          </div>
          <div ref={bSideRef} style={{ position: "absolute", inset: 0 }}>
            <CDFace side="b" />
          </div>
        </div>

        {/* Status line */}
        <div
          ref={statusRef}
          style={{
            position: "absolute", bottom: 32, left: "50%",
            transform: "translateX(-50%)",
            fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
            fontSize: 10, letterSpacing: "0.12em",
            color: isEnter ? "rgba(58,58,58,0.4)" : "rgba(200,200,200,0.5)",
            whiteSpace: "nowrap", userSelect: "none",
            zIndex: 1,
          }}
        >
          dropping in...
        </div>
      </div>
    </>
  );
}

export default function BsideLoader({ direction, onComplete }: Props) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;
  return createPortal(
    <LoaderOverlay direction={direction} onComplete={onComplete} />,
    document.body
  );
}
