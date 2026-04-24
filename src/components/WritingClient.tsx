"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import NotepadWindow from "./NotepadWindow";
import type { Article } from "./types";
export type { Article };

const POSITIONS = [
  { x: 80,  y: 60   },
  { x: 520, y: 40   },
  { x: 280, y: 380  },
  { x: 740, y: 120  },
  { x: 140, y: 700  },
  { x: 600, y: 520  },
  { x: 960, y: 280  },
  { x: 420, y: 820  },
  { x: 820, y: 640  },
  { x: 200, y: 1000 },
];

function MobileArticleCard({ article }: { article: Article }) {
  return (
    <div
      style={{
        width: "100%",
        border: "1px solid #F35900",
        fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
        boxShadow: "2px 4px 12px rgba(0,0,0,0.10)",
      }}
    >
      {/* Title bar */}
      <div
        style={{
          height: 26,
          backgroundColor: "#F35900",
          color: "#FFF8F0",
          padding: "0 7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 11,
          letterSpacing: "0.01em",
          gap: 8,
        }}
      >
        <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
          {article.title} - Notepad
        </span>
      </div>

      {/* Menu bar */}
      <div
        style={{
          height: 22,
          backgroundColor: "#F5F0E8",
          borderBottom: "1px solid rgba(243,89,0,0.15)",
          padding: "0 10px",
          display: "flex",
          alignItems: "center",
          gap: 18,
          fontSize: 11,
          color: "rgba(58,58,58,0.5)",
        }}
      >
        {["File", "Edit", "Search", "Help"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      {/* Content */}
      <div
        style={{
          backgroundColor: "#FAFAF5",
          padding: "16px 16px 14px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, color: "#1a1a1a", lineHeight: 1.35, marginBottom: 5 }}>
          {article.title}
        </div>
        <div style={{ fontSize: 10, color: "rgba(58,58,58,0.4)", marginBottom: 14, letterSpacing: "0.04em" }}>
          {article.pubDate}
        </div>
        <div style={{ fontSize: 11, color: "#3A3A3A", lineHeight: 1.72, minHeight: 80 }}>
          {article.description}
        </div>
        <div style={{ marginTop: 18 }}>
          <a
            href={article.link}
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontSize: 11, color: "#F35900", textDecoration: "underline", textUnderlineOffset: 2 }}
          >
            Read full article →
          </a>
        </div>
      </div>
    </div>
  );
}

export default function WritingClient({ articles }: { articles: Article[] }) {
  const maxZRef = useRef(articles.length + 10);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const bringToFront = useCallback(() => {
    maxZRef.current += 1;
    return maxZRef.current;
  }, []);

  if (isMobile) {
    return (
      <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 20 }}>
        {articles.map((article, i) => (
          <MobileArticleCard key={article.link || String(i)} article={article} />
        ))}
      </div>
    );
  }

  return (
    <div style={{ width: "100%", height: "100vh", overflow: "auto", backgroundColor: "transparent" }}>
      <div style={{ position: "relative", width: 1600, height: 1600, backgroundColor: "#FFFFFF" }}>
        {articles.map((article, i) => {
          const pos = POSITIONS[i % POSITIONS.length];
          return (
            <NotepadWindow
              key={article.link || String(i)}
              article={article}
              initialX={pos.x}
              initialY={pos.y}
              initialZ={10 + i}
              onFocus={bringToFront}
            />
          );
        })}
      </div>
    </div>
  );
}
