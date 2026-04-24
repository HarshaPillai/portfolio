"use client";

import { useState } from "react";
import type { Article } from "./WritingClient";

type Props = {
  article: Article;
  initialX: number;
  initialY: number;
  initialZ: number;
  onFocus: () => number;
};

function WinBtn({
  onClick,
  label,
}: {
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      style={{
        background: "rgba(255,255,255,0.18)",
        border: "1px solid rgba(255,255,255,0.28)",
        color: "#FFF8F0",
        width: 17,
        height: 17,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: 11,
        padding: 0,
        lineHeight: 1,
        fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
        flexShrink: 0,
      }}
    >
      {label}
    </button>
  );
}

export default function NotepadWindow({
  article,
  initialX,
  initialY,
  initialZ,
  onFocus,
}: Props) {
  const [x, setX] = useState(initialX);
  const [y, setY] = useState(initialY);
  const [z, setZ] = useState(initialZ);
  const [hidden, setHidden] = useState(false);
  const [minimized, setMinimized] = useState(false);

  if (hidden) return null;

  const handleContainerMouseDown = () => {
    setZ(onFocus());
  };

  const handleTitleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    setZ(onFocus());

    const startX = e.clientX - x;
    const startY = e.clientY - y;

    const onMove = (ev: MouseEvent) => {
      setX(ev.clientX - startX);
      setY(ev.clientY - startY);
    };
    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  return (
    <div
      onMouseDown={handleContainerMouseDown}
      style={{
        position: "absolute",
        left: x,
        top: y,
        width: 380,
        zIndex: z,
        border: "1px solid #F35900",
        userSelect: "none",
        fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
        cursor: "default",
        boxShadow: "2px 4px 12px rgba(0,0,0,0.10)",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={handleTitleMouseDown}
        style={{
          height: 26,
          backgroundColor: "#F35900",
          color: "#FFF8F0",
          padding: "0 7px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "grab",
          fontSize: 11,
          letterSpacing: "0.01em",
          gap: 8,
        }}
      >
        <span
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            flex: 1,
          }}
        >
          {article.title} - Notepad
        </span>
        <div style={{ display: "flex", gap: 3, flexShrink: 0 }}>
          <WinBtn label="—" onClick={() => setMinimized((m) => !m)} />
          <WinBtn label="×" onClick={() => setHidden(true)} />
        </div>
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
          letterSpacing: "0.01em",
        }}
      >
        {["File", "Edit", "Search", "Help"].map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      {/* Content */}
      {!minimized && (
        <div
          style={{
            backgroundColor: "#FAFAF5",
            padding: "16px 16px 14px",
            display: "flex",
            flexDirection: "column",
            minHeight: 272,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#1a1a1a",
              lineHeight: 1.35,
              marginBottom: 5,
            }}
          >
            {article.title}
          </div>

          <div
            style={{
              fontSize: 10,
              color: "rgba(58,58,58,0.4)",
              marginBottom: 14,
              letterSpacing: "0.04em",
            }}
          >
            {article.pubDate}
          </div>

          <div
            style={{
              fontSize: 11,
              color: "#3A3A3A",
              lineHeight: 1.72,
              minHeight: 160,
            }}
          >
            {article.description}
          </div>

          <div style={{ marginTop: 18 }}>
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              onMouseDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              style={{
                fontSize: 11,
                color: "#F35900",
                textDecoration: "underline",
                textUnderlineOffset: 2,
                cursor: "pointer",
              }}
            >
              Read full article →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}