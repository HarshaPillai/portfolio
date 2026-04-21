"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

type Props = {
  direction: "enter" | "exit";
  onComplete: () => void;
};

const CD_SIZE = 140;
const DROP_DUR = 700;
const PAUSE_DUR = 180;
const FLIP_DUR = 1100;
const FLOAT_DUR = 520;
const BG_DUR = 600;

function easeOut3(t: number) { return 1 - Math.pow(1 - t, 3); }
function easeIn2(t: number)  { return t * t; }
function easeInOut3(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }

function dropEase(t: number) {
  if (t < 0.82) return easeOut3(t / 0.82) * 1.04;
  const bt = (t - 0.82) / 0.18;
  return 1.04 + (1.0 - 1.04) * easeInOut3(bt);
}

function hexToRgb(hex: string): [number, number, number] {
  return [
    parseInt(hex.slice(1, 3), 16),
    parseInt(hex.slice(3, 5), 16),
    parseInt(hex.slice(5, 7), 16),
  ];
}

function lerpRgb(
  a: [number, number, number],
  b: [number, number, number],
  t: number
): string {
  return `rgb(${Math.round(lerp(a[0], b[0], t))},${Math.round(lerp(a[1], b[1], t))},${Math.round(lerp(a[2], b[2], t))})`;
}

const LIGHT_RGB = hexToRgb("#FFFFFF");
const DARK_RGB  = hexToRgb("#0A0A0A");

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
        <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="32" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="20" fill="none" stroke="rgba(255,255,255,0.10)" strokeWidth="0.6" />
        <circle cx="70" cy="70" r="11" fill="#1a0800" />
        <circle cx="70" cy="70" r="4"  fill="#2a1000" />
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
      <circle cx="70" cy="70" r="56" fill="none" stroke="rgba(255,85,0,0.07)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="44" fill="none" stroke="rgba(255,85,0,0.07)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="32" fill="none" stroke="rgba(255,85,0,0.07)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="20" fill="none" stroke="rgba(255,85,0,0.07)" strokeWidth="0.6" />
      <circle cx="70" cy="70" r="11" fill="#050200" />
      <circle cx="70" cy="70" r="4"  fill="#0A0500" />
    </svg>
  );
}

function LoaderOverlay({ direction, onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const cdWrapRef  = useRef<HTMLDivElement>(null);
  const aSideRef   = useRef<HTMLDivElement>(null);
  const bSideRef   = useRef<HTMLDivElement>(null);
  const statusRef  = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const cdWrap  = cdWrapRef.current;
    const aSide   = aSideRef.current;
    const bSide   = bSideRef.current;
    const statusEl = statusRef.current;
    if (!overlay || !cdWrap || !aSide || !bSide) return;

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const targetY  = vh / 2 - CD_SIZE / 2;
    const startY   = -(CD_SIZE + 30);
    const bgFrom   = direction === "enter" ? LIGHT_RGB : DARK_RGB;
    const bgTo     = direction === "enter" ? DARK_RGB  : LIGHT_RGB;

    // Initial face visibility: entering=A-Side first, exiting=B-Side first
    if (direction === "enter") {
      aSide.style.display = "block";
      bSide.style.display = "none";
    } else {
      aSide.style.display = "none";
      bSide.style.display = "block";
    }

    const setStatus = (msg: string) => {
      if (statusEl) statusEl.textContent = msg;
    };

    const setCdTransform = (y: number, scaleX = 1, opacity = 1) => {
      const cdHalf = CD_SIZE / 2;
      cdWrap.style.transform  = `translateX(${vw / 2 - cdHalf}px) translateY(${y}px) scaleX(${scaleX})`;
      cdWrap.style.opacity    = String(opacity);
    };

    type Phase = "drop" | "pause" | "flip" | "float" | "done";
    let phase: Phase = "drop";
    let phaseStart = 0;
    let bgStart = 0;
    let faceSwapped = false;
    let rafId: number;

    const tick = (now: number) => {
      if (!phaseStart) phaseStart = now;

      const elapsed = now - phaseStart;

      if (phase === "drop") {
        setStatus("dropping in...");
        const t = Math.min(elapsed / DROP_DUR, 1);
        setCdTransform(lerp(startY, targetY, dropEase(t)));
        if (t >= 1) { phase = "pause"; phaseStart = now; }

      } else if (phase === "pause") {
        if (elapsed >= PAUSE_DUR) { phase = "flip"; phaseStart = now; setStatus(direction === "enter" ? "flipping b-side..." : "flipping a-side..."); }

      } else if (phase === "flip") {
        const t  = Math.min(elapsed / FLIP_DUR, 1);
        let scaleX: number;
        if (t < 0.5) {
          scaleX = 1 - easeInOut3(t * 2);
        } else {
          scaleX = easeInOut3((t - 0.5) * 2);
        }
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

        if (t >= 0.72 && !bgStart) bgStart = now;
        if (bgStart) {
          const bgT = Math.min((now - bgStart) / BG_DUR, 1);
          overlay.style.backgroundColor = lerpRgb(bgFrom, bgTo, easeInOut3(bgT));
          const textT = easeInOut3(bgT);
          const textAlpha = direction === "enter"
            ? lerp(0.45, 0.25, textT)
            : lerp(0.25, 0.45, textT);
          if (statusEl) statusEl.style.color = `rgba(128,128,128,${textAlpha})`;
        }

        if (t >= 1) { phase = "float"; phaseStart = now; setStatus("loading..."); }

      } else if (phase === "float") {
        setStatus("loading...");
        const t = Math.min(elapsed / FLOAT_DUR, 1);
        const y = lerp(targetY, startY, easeIn2(t));
        setCdTransform(y, 1, 1 - easeIn2(t));

        if (bgStart) {
          const bgT = Math.min((now - bgStart) / BG_DUR, 1);
          overlay.style.backgroundColor = lerpRgb(bgFrom, bgTo, easeInOut3(bgT));
        }

        if (t >= 1) {
          phase = "done";
          onComplete();
          return;
        }
      }

      if (phase !== "done") rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [direction, onComplete]);

  const isEnter = direction === "enter";

  return (
    <div
      ref={overlayRef}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9000,
        backgroundColor: isEnter ? "#FFFFFF" : "#0A0A0A",
        overflow: "hidden",
      }}
    >
      {/* CD wrapper — positioned via transform in RAF */}
      <div
        ref={cdWrapRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: CD_SIZE,
          height: CD_SIZE,
          transformOrigin: "center center",
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
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: 10,
          letterSpacing: "0.12em",
          color: isEnter ? "rgba(58,58,58,0.4)" : "rgba(255,255,255,0.28)",
          whiteSpace: "nowrap",
          userSelect: "none",
        }}
      >
        dropping in...
      </div>
    </div>
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
