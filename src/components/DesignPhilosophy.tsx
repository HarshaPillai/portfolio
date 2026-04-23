"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";

const rings = [
  {
    label: "Identity",
    desc: "Shaped by living between worlds",
    radius: 80,
    speed: 0.00035,
    nodes: [
      {
        n: "Competitive dancer",
        d: "She trained as a competitive dancer for years. That taught her something no classroom did — that talent is just the starting point. The people who get better are the ones who show up anyway, especially when it is not going well. She brings that to everything.",
      },
      {
        n: "Pattern recognition",
        d: "She has solved puzzles every day since she learned the rules of sudoku when she was 8 years old. Her brain finds patterns before she consciously looks for them — in data, in behavior, in systems. If you think that is not a real skill, challenge her to a game of Pipes.",
      },
      {
        n: "Care as material",
        d: "She wants the things she makes to feel like someone was actually thinking about you when they built them. Not just functional. Not just shipped. Considered.",
      },
      {
        n: "Communication as superpower",
        d: "She speaks multiple languages, trained in Bharatanatyam, and grew up moving between cultures. Communication has never been just words — it is visual, physical, relational. She takes real pride in her ability to find a genuine connection with almost anyone.",
      },
    ],
  },
  {
    label: "Academic",
    desc: "Trained to think at scale",
    radius: 160,
    speed: 0.00022,
    nodes: [
      {
        n: "Systems thinking",
        d: "Architecture school teaches you to hold a door handle and a city block in your head at the same time. She has never been able to look at a single screen without seeing the system around it.",
      },
      {
        n: "Technical fluency",
        d: "She can build what she designs. That changes everything about how she thinks before she ever opens Figma — she knows what the constraint actually is, not just what it looks like from the outside.",
      },
      {
        n: "Research rigor",
        d: "Her thesis was a year inside genuinely ambiguous territory — intergenerational care, what technology misses about human connection. She was trained to ask better questions, not faster ones.",
      },
      {
        n: "Responsible AI",
        d: "She was in CS school when ML first got loud. She sat in the early seminars about environmental cost and ethical risk. She understood then that there was a line. She still designs like crossing it has consequences.",
      },
    ],
  },
  {
    label: "Condition",
    desc: "Reckoning with what we set in motion",
    radius: 240,
    speed: 0.00012,
    nodes: [
      {
        n: "Designing for consequences",
        d: "When pursuing her MFA, Professor Allan Chochinov taught her that designers are in the consequence business. The question she keeps returning to is not what can we build — it is what happens after we do. That question does not have a comfortable answer. She does not think it should.",
      },
      {
        n: "Digital loneliness",
        d: "We built platforms optimized for engagement and got isolation instead. The gap between what technology measures and what people actually need is where most of the real design work lives.",
      },
      {
        n: "AI without care",
        d: "Speed without humanity is just noise at scale. The most important question right now is not what AI can do. It is what it should do, and for whom, and who is paying the cost when we get it wrong.",
      },
      {
        n: "The pace problem",
        d: "Products ship faster than people change. The humans using our software are the same people they have always been — same needs, same fears, same need to feel like someone thought about them. We keep designing like they are not.",
      },
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
  const nodePositionsRef  = useRef<{ x: number; y: number }[][]>([[], [], []]);
  const starsRef          = useRef<StarDef[]>([]);
  const logicalSizeRef    = useRef({ w: 0, h: 0 });

  const [nodeHover, setNodeHover]       = useState<NodeHover | null>(null);
  const [ringHover, setRingHover]       = useState<RingHover | null>(null);
  const [centerHovered, setCenterHovered] = useState(false);
  const [canvasSize, setCanvasSize]     = useState({ w: 0, h: 0 });
  const [ringLabelData, setRingLabelData] = useState<{ x: number; y: number; label: string }[] | null>(null);

  // Track currently hovered ring index to avoid redundant state updates on mousemove
  const ringHoverIdxRef = useRef(-1);

  const draw = useCallback((timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W  = logicalSizeRef.current.w;
    const H  = logicalSizeRef.current.h;
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

        // Ring node labels are now rendered as HTML (see below) to avoid canvas clipping
      }
      nodePositionsRef.current[ri] = newPositions;
    }

    // Center circle
    ctx.beginPath();
    ctx.arc(cx, cy, 44, 0, Math.PI * 2);
    ctx.fillStyle = "#000000";
    ctx.fill();
    ctx.fillStyle    = "#ffffff";
    ctx.font         = "8px 'DM Mono', monospace";
    ctx.textAlign    = "center";
    ctx.textBaseline = "alphabetic";
    ctx.fillText("DESIGN",     cx, cy - 4);
    ctx.fillText("PHILOSOPHY", cx, cy + 7);

    rafRef.current = requestAnimationFrame(draw);
  }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx   = e.clientX - rect.left;
    const my   = e.clientY - rect.top;
    mouseRef.current = { x: mx, y: my };

    // Center circle hover
    const ccx = logicalSizeRef.current.w / 2;
    const ccy = logicalSizeRef.current.h / 2;
    setCenterHovered(Math.hypot(mx - ccx, my - ccy) <= 44);

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
      const cx    = logicalSizeRef.current.w / 2;
      const cy    = logicalSizeRef.current.h / 2;
      const distC = Math.hypot(mx - cx, my - cy);
      let foundRing = false;
      for (let ri = 0; ri < rings.length; ri++) {
        if (Math.abs(distC - rings[ri].radius) < 18) {
          setRingHover({ ringIdx: ri, x: mx, y: my });
          // Snapshot positions once when ring hover changes (rotation stops, so positions are stable)
          if (ringHoverIdxRef.current !== ri) {
            ringHoverIdxRef.current = ri;
            const positions = nodePositionsRef.current[ri];
            setRingLabelData(
              positions.map((pos, ni) => ({ x: pos.x, y: pos.y, label: rings[ri].nodes[ni].n }))
            );
          }
          foundRing = true;
          break;
        }
      }
      if (!foundRing) {
        setRingHover(null);
        if (ringHoverIdxRef.current !== -1) {
          ringHoverIdxRef.current = -1;
          setRingLabelData(null);
        }
      }
    } else {
      if (ringHoverIdxRef.current !== -1) {
        ringHoverIdxRef.current = -1;
        setRingLabelData(null);
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -9999, y: -9999 };
    setNodeHover(null);
    setRingHover(null);
    setRingLabelData(null);
    ringHoverIdxRef.current = -1;
    setCenterHovered(false);
  }, []);

  // Canvas sizing
  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const W   = container.clientWidth;
      const H   = container.clientHeight;
      logicalSizeRef.current = { w: W, h: H };
      setCanvasSize({ w: W, h: H });
      canvas.width        = W * dpr;
      canvas.height       = H * dpr;
      canvas.style.width  = W + "px";
      canvas.style.height = H + "px";
      const ctx2 = canvas.getContext("2d");
      if (ctx2) ctx2.scale(dpr, dpr);

      // Generate stars outside outermost ring (in logical coords)
      const cx = W / 2;
      const cy = H / 2;
      const stars: StarDef[] = [];
      let attempts = 0;
      while (stars.length < 10 && attempts < 400) {
        const angle = Math.random() * Math.PI * 2;
        const dist  = 190 + Math.random() * 80;
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
    if (!logicalSizeRef.current.w) return {};
    const W = logicalSizeRef.current.w;
    const H = logicalSizeRef.current.h;
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
      style={{ position: "relative", width: "100%", height: "100%", overflow: "visible" }}
    >
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          display: "block",
          width: "100%",
          height: "100%",
          cursor: (nodeHover || centerHovered) ? "pointer" : "default",
        }}
      />

      {/* Center circle childhood photo overlay */}
      {canvasSize.w > 0 && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/harsha-child.jpg"
          alt=""
          style={{
            position: "absolute",
            left: canvasSize.w / 2 - 44,
            top: canvasSize.h / 2 - 44,
            width: 88,
            height: 88,
            borderRadius: "50%",
            objectFit: "cover",
            objectPosition: "center top",
            opacity: centerHovered ? 1 : 0,
            transition: "opacity 0.3s ease",
            pointerEvents: "none",
            zIndex: 5,
          }}
        />
      )}

      {/* Ring node labels — HTML so they never clip at canvas edge */}
      {ringLabelData && canvasSize.w > 0 && ringLabelData.map((item, i) => {
        const W = canvasSize.w;
        const H = canvasSize.h;
        const isBottomFifth = item.y > H * 0.80;
        const isRightHalf   = item.x > W * 0.50;
        return (
          <div
            key={i}
            style={{
              position: "absolute",
              pointerEvents: "none",
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontSize: 9,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              color: "#3A3A3A",
              whiteSpace: "nowrap",
              zIndex: 8,
              // Vertical: below by default, above if in bottom 20%
              ...(isBottomFifth
                ? { top: item.y - 18 }
                : { top: item.y + 10 }
              ),
              // Horizontal: right-edge of label aligns to node if right half,
              // otherwise centered on node
              ...(isRightHalf
                ? { right: W - item.x + 4, textAlign: "right" as const }
                : { left: item.x, transform: "translateX(-50%)" }
              ),
            }}
          >
            {item.label}
          </div>
        );
      })}

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
