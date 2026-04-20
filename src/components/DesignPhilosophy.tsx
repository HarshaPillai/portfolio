"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const rings = [
  {
    label: "Identity",
    desc: "Shaped by living between worlds",
    radius: 88,
    speed: 0.00035,
    nodes: [
      { n: "Ethical research", d: "Growing up as the outsider in every room taught me that people are not data points to extract. Every research interaction is a relationship. I approach it that way." },
      { n: "Cross-cultural empathy", d: "I grew up Indian in Germany, studied in America, and move between cultures, languages, and ways of seeing. That multiplicity is not background noise — it is the work." },
      { n: "The outsider lens", d: "Being the only one who looks like you sharpens your attention in ways comfort never could. You notice the gaps, the assumptions, the things everyone agrees to ignore." },
      { n: "Care as material", d: "The products I make should feel like someone was thinking about you when they built them. Not just functional. Not just shipped. Actually considered." },
    ],
  },
  {
    label: "Academic",
    desc: "Trained to think at scale",
    radius: 172,
    speed: 0.00022,
    nodes: [
      { n: "Systems thinking", d: "An architecture degree taught me to hold a door handle and a city block in mind simultaneously. The world works in layers and multiplicities. I bring that into every digital strategy framework I build." },
      { n: "Technical fluency", d: "A minor in computer science means I understand the constraints, the tradeoffs, and the craft underneath the design. I can build what I design — and that changes everything about how I think before I open Figma." },
      { n: "Research rigor", d: "My MFA thesis was a year-long study inside genuinely ambiguous territory — intergenerational communication, care across distance, what technology misses about human connection. I was trained to ask better questions, not faster ones." },
      { n: "Responsible AI", d: "I was in CS school when ML was first getting loud. I attended early seminars on environmental cost and ethical risk. I understand there is a line — and I design like crossing it has consequences." },
    ],
  },
  {
    label: "Condition",
    desc: "Reckoning with what we set in motion",
    radius: 252,
    speed: 0.00012,
    nodes: [
      { n: "Designing for consequences", d: "We are in the consequence business. Things are deployed faster than ever — but speed is not the same as solving problems. The question I return to is not what can we build, but what happens when we do. That question does not have a comfortable answer. I do not think it should." },
      { n: "Digital loneliness", d: "Technology promised connection and often accelerated distance instead. I design for the gap between what platforms measure and what people actually need." },
      { n: "AI without care", d: "Speed without humanity is noise. The most important design question right now is not what AI can do — it is what it should do, and for whom, and at what cost." },
      { n: "The pace problem", d: "Products ship faster than people change. The humans using our software are the same people they have always been — same needs, same vulnerabilities. We keep designing like they are not." },
    ],
  },
];

interface NodeHover {
  ringIdx: number;
  nodeIdx: number;
  canvasX: number;
  canvasY: number;
}

interface RingHover {
  ringIdx: number;
  x: number;
  y: number;
}

type StarDef = { angle: number; dist: number; r: number };

export default function DesignPhilosophy() {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef       = useRef<number>(0);
  const anglesRef    = useRef([0, 0, 0]);
  const lastTimeRef  = useRef<number>(0);
  const mouseRef     = useRef({ x: -9999, y: -9999 });
  const seenRef      = useRef<Set<string>>(new Set());
  const nodePositionsRef = useRef<{ x: number; y: number }[][]>([[], [], []]);
  const starsRef     = useRef<StarDef[]>([]);

  const [nodeHover, setNodeHover] = useState<NodeHover | null>(null);
  const [ringHover, setRingHover] = useState<RingHover | null>(null);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W  = canvas.width;
    const H  = canvas.height;
    const cx = W / 2;
    const cy = H / 2;

    const dt = lastTimeRef.current ? timestamp - lastTimeRef.current : 16;
    lastTimeRef.current = timestamp;

    const mx = mouseRef.current.x;
    const my = mouseRef.current.y;

    // Hit-test using last frame's positions
    let hoveredNodeRing = -1;
    let hoveredNodeIdx  = -1;
    for (let ri = 0; ri < rings.length; ri++) {
      const positions = nodePositionsRef.current[ri];
      for (let ni = 0; ni < positions.length; ni++) {
        if (Math.hypot(mx - positions[ni].x, my - positions[ni].y) < 14) {
          hoveredNodeRing = ri;
          hoveredNodeIdx  = ni;
          break;
        }
      }
      if (hoveredNodeRing !== -1) break;
    }

    let hoveredRingIdx = -1;
    if (hoveredNodeRing === -1) {
      const distC = Math.hypot(mx - cx, my - cy);
      for (let ri = 0; ri < rings.length; ri++) {
        if (Math.abs(distC - rings[ri].radius) < 18) {
          hoveredRingIdx = ri;
          break;
        }
      }
    }

    // Advance angles
    for (let ri = 0; ri < rings.length; ri++) {
      if (ri !== hoveredRingIdx && ri !== hoveredNodeRing) {
        anglesRef.current[ri] += rings[ri].speed * dt;
      }
    }

    ctx.clearRect(0, 0, W, H);

    // Stars
    ctx.fillStyle = "rgba(0,0,0,0.3)";
    for (const s of starsRef.current) {
      const sx = cx + Math.cos(s.angle) * s.dist;
      const sy = cy + Math.sin(s.angle) * s.dist;
      if (sx < 0 || sx > W || sy < 0 || sy > H) continue;
      ctx.beginPath();
      ctx.arc(sx, sy, s.r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Rings + nodes
    for (let ri = 0; ri < rings.length; ri++) {
      const ring          = rings[ri];
      const isRingHovered = ri === hoveredRingIdx;
      const isNodeRing    = ri === hoveredNodeRing;
      const ringAlpha     = [0.18, 0.14, 0.10][ri];

      ctx.beginPath();
      ctx.arc(cx, cy, ring.radius, 0, Math.PI * 2);
      ctx.strokeStyle = (isRingHovered || isNodeRing)
        ? "rgba(243,89,0,0.3)"
        : `rgba(0,0,0,${ringAlpha})`;
      ctx.lineWidth = (isRingHovered || isNodeRing) ? 1 : 0.8;
      ctx.stroke();

      const baseAngle = anglesRef.current[ri];
      const newPositions: { x: number; y: number }[] = [];

      for (let ni = 0; ni < ring.nodes.length; ni++) {
        const ang  = baseAngle + (ni / ring.nodes.length) * Math.PI * 2;
        const nx   = cx + Math.cos(ang) * ring.radius;
        const ny   = cy + Math.sin(ang) * ring.radius;
        newPositions.push({ x: nx, y: ny });

        const key      = `${ri}-${ni}`;
        const isSeen   = seenRef.current.has(key);
        const isActive = ri === hoveredNodeRing && ni === hoveredNodeIdx;

        if (isActive) {
          ctx.beginPath();
          ctx.arc(nx, ny, 9, 0, Math.PI * 2);
          ctx.strokeStyle = "rgba(243,89,0,0.2)";
          ctx.lineWidth   = 1;
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(nx, ny, 5, 0, Math.PI * 2);
          ctx.fillStyle = "#F35900";
          ctx.fill();
        } else if (isSeen) {
          ctx.beginPath();
          ctx.arc(nx, ny, 3, 0, Math.PI * 2);
          ctx.fillStyle = "rgba(243,89,0,0.45)";
          ctx.fill();
        } else {
          ctx.beginPath();
          ctx.arc(nx, ny, 3, 0, Math.PI * 2);
          ctx.fillStyle = "#aaaaaa";
          ctx.fill();
        }

        // Node labels when ring is hovered
        if (isRingHovered) {
          const cosA = Math.cos(ang);
          const sinA = Math.sin(ang);
          const lx   = cx + cosA * (ring.radius + 20);
          const ly   = cy + sinA * (ring.radius + 20);
          ctx.font        = "10px 'DM Mono', monospace";
          ctx.fillStyle   = "#3A3A3A";
          ctx.textAlign   = Math.abs(cosA) < 0.3 ? "center" : (cosA > 0 ? "left" : "right");
          ctx.textBaseline = sinA > 0.3 ? "top" : (sinA < -0.3 ? "bottom" : "middle");
          ctx.fillText(ring.nodes[ni].n, lx, ly);
        }
      }
      nodePositionsRef.current[ri] = newPositions;
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 22, 0, Math.PI * 2);
    ctx.fillStyle   = "#FFFFFF";
    ctx.fill();
    ctx.strokeStyle = "rgba(0,0,0,0.12)";
    ctx.lineWidth   = 0.8;
    ctx.stroke();
    ctx.font         = "8px 'DM Mono', monospace";
    ctx.fillStyle    = "#999999";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("DESIGN",      cx, cy - 4);
    ctx.fillText("PHILOSOPHY",  cx, cy + 5);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    // Node hover check
    let foundNode = false;
    for (let ri = 0; ri < rings.length; ri++) {
      const positions = nodePositionsRef.current[ri];
      for (let ni = 0; ni < positions.length; ni++) {
        if (Math.hypot(mx - positions[ni].x, my - positions[ni].y) < 14) {
          const key = `${ri}-${ni}`;
          if (!seenRef.current.has(key)) {
            seenRef.current = new Set([...seenRef.current, key]);
          }
          setNodeHover({ ringIdx: ri, nodeIdx: ni, canvasX: positions[ni].x, canvasY: positions[ni].y });
          setRingHover(null);
          foundNode = true;
          break;
        }
      }
      if (foundNode) break;
    }

    if (!foundNode) {
      setNodeHover(null);
      const cx    = canvas.width / 2;
      const cy    = canvas.height / 2;
      const distC = Math.hypot(mx - cx, my - cy);
      let foundRing = false;
      for (let ri = 0; ri < rings.length; ri++) {
        if (Math.abs(distC - rings[ri].radius) < 18) {
          setRingHover({ ringIdx: ri, x: mx, y: my });
          foundRing = true;
          break;
        }
      }
      if (!foundRing) setRingHover(null);
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    setNodeHover(null);
    setRingHover(null);
  }, []);

  // Canvas sizing
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const W = container.clientWidth;
      const H = container.clientHeight;
      canvas.width  = W;
      canvas.height = H;

      // Generate stars outside outermost ring
      const cx = W / 2;
      const cy = H / 2;
      const stars: StarDef[] = [];
      let attempts = 0;
      while (stars.length < 10 && attempts < 400) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 270 + Math.random() * 100;
        const sx    = cx + Math.cos(angle) * dist;
        const sy    = cy + Math.sin(angle) * dist;
        if (sx > 4 && sx < W - 4 && sy > 4 && sy < H - 4) {
          stars.push({ angle, dist, r: Math.random() * 1 + 0.5 });
        }
        attempts++;
      }
      starsRef.current = stars;
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // Animation loop
  useEffect(() => {
    rafRef.current = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(rafRef.current);
  }, [draw]);

  // Popup position with edge-flip
  const getPopupStyle = (canvasX: number, canvasY: number): React.CSSProperties => {
    const canvas = canvasRef.current;
    if (!canvas) return {};
    const W = canvas.width;
    const H = canvas.height;
    const POPUP_W = 248;
    const POPUP_H = 160;
    const GAP     = 16;

    const result: React.CSSProperties = { width: POPUP_W };
    if (canvasX + GAP + POPUP_W > W - 8) {
      result.right = W - canvasX + GAP;
    } else {
      result.left = canvasX + GAP;
    }
    if (canvasY + POPUP_H > H - 8) {
      result.bottom = H - canvasY + GAP;
    } else {
      result.top = canvasY - 20;
    }
    return result;
  };

  const activeRing = ringHover !== null ? rings[ringHover.ringIdx] : null;
  const activeNode = nodeHover !== null
    ? { ring: rings[nodeHover.ringIdx], node: rings[nodeHover.ringIdx].nodes[nodeHover.nodeIdx] }
    : null;

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: nodeHover ? "pointer" : "default",
        }}
      />

      {/* Ring hover pill */}
      {ringHover && activeRing && (
        <div
          style={{
            position: "absolute",
            left: ringHover.x + 14,
            top: ringHover.y - 14,
            pointerEvents: "none",
            backgroundColor: "#FFFFFF",
            border: "0.5px solid rgba(0,0,0,0.15)",
            borderRadius: 20,
            padding: "5px 11px",
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            color: "#3A3A3A",
            whiteSpace: "nowrap",
            zIndex: 10,
          }}
        >
          {activeRing.label} — {activeRing.desc}
        </div>
      )}

      {/* Node hover popup */}
      {nodeHover && activeNode && (
        <div
          style={{
            position: "absolute",
            ...getPopupStyle(nodeHover.canvasX, nodeHover.canvasY),
            backgroundColor: "#FFFFFF",
            border: "0.5px solid rgba(0,0,0,0.15)",
            borderRadius: 8,
            padding: "14px 16px",
            zIndex: 20,
            pointerEvents: "none",
          }}
        >
          <div style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 9,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            color: "#F35900",
            marginBottom: 6,
          }}>
            {activeNode.ring.label}
          </div>
          <div style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 13,
            fontWeight: 500,
            color: "#1a1a1a",
            marginBottom: 8,
            letterSpacing: "-0.03em",
          }}>
            {activeNode.node.n}
          </div>
          <div style={{
            height: "0.5px",
            backgroundColor: "rgba(0,0,0,0.1)",
            marginBottom: 8,
          }} />
          <div style={{
            fontFamily: "var(--font-dm-mono), monospace",
            fontSize: 10,
            color: "#666666",
            lineHeight: 1.75,
          }}>
            {activeNode.node.d}
          </div>
        </div>
      )}
    </div>
  );
}
