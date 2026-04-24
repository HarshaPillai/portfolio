"use client";

import { useState, useEffect } from "react";

const ALL_CHAPTERS = [
  { id: "hook",      label: "Hook" },
  { id: "context",   label: "Context" },
  { id: "challenge", label: "Challenge" },
  { id: "decisions", label: "Decisions" },
  { id: "outcome",   label: "Outcome" },
  { id: "features",  label: "Features" },
];

export default function ChapterNav({ availableIds }: { availableIds: string[] }) {
  const [activeId,    setActiveId]    = useState<string>("");
  const [hoveredIdx,  setHoveredIdx]  = useState<number | null>(null);
  const [visible,     setVisible]     = useState(false);

  useEffect(() => {
    const check = () => setVisible(window.innerWidth > 1200);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const chapters = ALL_CHAPTERS.filter((c) => availableIds.includes(c.id));
    const ratioMap  = new Map<string, number>();

    const observers = chapters.map(({ id }) => {
      const el = document.getElementById(id);
      if (!el) return null;

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratioMap.set(id, entry.intersectionRatio);
          let bestId    = "";
          let bestRatio = -1;
          ratioMap.forEach((r, sid) => {
            if (r > bestRatio) { bestRatio = r; bestId = sid; }
          });
          if (bestId) setActiveId(bestId);
        },
        { threshold: 0.3 },
      );
      obs.observe(el);
      return obs;
    });

    return () => observers.forEach((obs) => obs?.disconnect());
  }, [availableIds]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!visible) return null;

  const chapters = ALL_CHAPTERS.filter((c) => availableIds.includes(c.id));

  return (
    <div style={{
      position:       "fixed",
      right:          32,
      top:            "50%",
      transform:      "translateY(-50%)",
      display:        "flex",
      flexDirection:  "column",
      gap:            20,
      zIndex:         50,
    }}>
      {chapters.map((chapter, i) => (
        <div
          key={chapter.id}
          style={{ position: "relative", display: "flex", alignItems: "center", cursor: "pointer" }}
          onMouseEnter={() => setHoveredIdx(i)}
          onMouseLeave={() => setHoveredIdx(null)}
          onClick={() => scrollTo(chapter.id)}
        >
          {/* Label — appears to the left of the dot on hover */}
          <span style={{
            position:      "absolute",
            right:         16,
            fontFamily:    "var(--font-dm-mono), monospace",
            fontSize:      9,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color:         "rgba(58,58,58,0.5)",
            whiteSpace:    "nowrap",
            opacity:       hoveredIdx === i ? 1 : 0,
            transition:    "opacity 0.15s",
            pointerEvents: "none",
          }}>
            {chapter.label}
          </span>

          {/* Dot */}
          <div style={{
            width:           6,
            height:          6,
            borderRadius:    "50%",
            backgroundColor: activeId === chapter.id ? "#F35900" : "rgba(0,0,0,0.2)",
            transition:      "background-color 0.2s",
            flexShrink:      0,
          }} />
        </div>
      ))}
    </div>
  );
}
