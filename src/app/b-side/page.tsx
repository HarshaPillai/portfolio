"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { sanityClient } from "@/lib/sanity";
import BsideLoader from "@/components/BsideLoader";

const BsideGradient = dynamic(() => import("@/components/BsideGradient"), {
  ssr: false,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type LabItem = {
  _id: string;
  title: string;
  slug: { current: string };
  year?: string;
  about?: string;
  type: "lightbox" | "external";
  externalUrl?: string;
  contentType: "image" | "gallery" | "embed";
  status?: "live" | "wip" | "archived";
  tags?: string[];
  thumbnail?: string;
};

// ─── GROQ query ───────────────────────────────────────────────────────────────

const QUERY = `*[_type == "labItem"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  year,
  about,
  type,
  externalUrl,
  contentType,
  status,
  tags,
  "thumbnail": thumbnail.asset->url
}`;

// ─── Skeleton card ────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div
      style={{
        border: "1px solid rgba(255,255,255,0.07)",
        borderRadius: 10,
        padding: "18px 20px",
        background: "rgba(255,255,255,0.03)",
        minHeight: 100,
      }}
    >
      <div
        className="bside-skeleton"
        style={{ width: 32, height: 8, borderRadius: 4, marginBottom: 14, background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="bside-skeleton"
        style={{ width: "70%", height: 12, borderRadius: 4, marginBottom: 8, background: "rgba(255,255,255,0.07)" }}
      />
      <div
        className="bside-skeleton"
        style={{ width: "45%", height: 8, borderRadius: 4, background: "rgba(255,255,255,0.07)" }}
      />
    </div>
  );
}

// ─── Lab card ─────────────────────────────────────────────────────────────────

function LabCard({
  item,
  index,
  onClick,
}: {
  item: LabItem;
  index: number;
  onClick: (item: LabItem) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const pipColor =
    item.status === "live" ? "#3D9142" :
    item.status === "wip"  ? "#FF6B00" :
    "rgba(255,255,255,0.15)";

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
      style={{
        position: "relative",
        border: `1px solid ${hovered ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.07)"}`,
        borderRadius: 10,
        padding: "18px 20px",
        background: hovered ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.03)",
        cursor: "pointer",
        transition: "border-color 0.15s, background 0.15s",
        overflow: "hidden",
      }}
    >
      {/* Orange hover glow */}
      {hovered && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 30% 0%, rgba(255,85,0,0.06) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
      )}

      {/* Index + status pip */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <span
          style={{
            fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
            fontSize: 10,
            color: "rgba(255,255,255,0.2)",
            lineHeight: 1,
          }}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <div
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            backgroundColor: pipColor,
            flexShrink: 0,
          }}
        />
      </div>

      {/* Title */}
      <div
        style={{
          fontFamily: "var(--font-jakarta), system-ui, sans-serif",
          fontSize: 13,
          fontWeight: 400,
          color: "rgba(255,255,255,0.6)",
          lineHeight: 1.45,
          marginBottom: 8,
        }}
      >
        {item.title}
      </div>

      {/* Tags */}
      {item.tags && item.tags.length > 0 && (
        <div
          style={{
            fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
            fontSize: 9,
            color: "rgba(255,255,255,0.15)",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          {item.tags.join(" · ")}
        </div>
      )}
    </div>
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({
  item,
  onClose,
}: {
  item: LabItem;
  onClose: () => void;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.75)",
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: "relative",
          width: "min(860px, 90vw)",
          maxHeight: "85vh",
          backgroundColor: "#0A0A0A",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 12,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            flexShrink: 0,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
            <span
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 18,
                fontWeight: 500,
                color: "rgba(255,255,255,0.75)",
                letterSpacing: "-0.04em",
              }}
            >
              {item.title}
            </span>
            {item.year && (
              <span
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.25)",
                }}
              >
                {item.year}
              </span>
            )}
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28,
              height: 28,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.1)",
              borderRadius: 6,
              color: "rgba(255,255,255,0.5)",
              fontSize: 16,
              cursor: "pointer",
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div
          style={{
            flex: 1,
            overflow: "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
            minHeight: 0,
          }}
        >
          {item.thumbnail ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.thumbnail}
              alt={item.title}
              style={{
                maxWidth: "100%",
                maxHeight: "60vh",
                objectFit: "contain",
                borderRadius: 6,
              }}
            />
          ) : (
            <div
              style={{
                width: "100%",
                aspectRatio: "16/9",
                background: "rgba(255,255,255,0.04)",
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-dm-mono), monospace",
                  fontSize: 11,
                  color: "rgba(255,255,255,0.15)",
                }}
              >
                no preview
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BSidePage() {
  const [loaded, setLoaded]           = useState(false);
  const [labItems, setLabItems]       = useState<LabItem[] | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LabItem | null>(null);
  const fetchedRef = useRef(false);

  // Start fetching immediately — data arrives in background while animation plays
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    sanityClient
      .fetch<LabItem[]>(QUERY)
      .then(setLabItems)
      .catch(() => setLabItems([]));
  }, []);

  // Force dark body bg while on this page
  useEffect(() => {
    const prev = document.body.style.backgroundColor;
    document.body.style.backgroundColor = "#0A0A0A";
    return () => { document.body.style.backgroundColor = prev; };
  }, []);

  const handleCardClick = (item: LabItem) => {
    if (item.type === "external" && item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setLightboxItem(item);
    }
  };

  const showSkeletons = loaded && labItems === null;
  const showCards     = loaded && labItems !== null;

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A", position: "relative" }}>
      {/* CD loader — shown until animation completes */}
      {!loaded && (
        <BsideLoader direction="enter" onComplete={() => setLoaded(true)} />
      )}

      {/* ShaderGradient — fades in after loader */}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <BsideGradient />
      </div>

      {/* Page content */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          padding: "72px 48px 80px",
          opacity: loaded ? 1 : 0,
          transition: "opacity 0.45s ease 0.1s",
        }}
      >
        {/* Eyebrow */}
        <div
          style={{
            fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
            fontSize: 10,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.2)",
            marginBottom: 10,
          }}
        >
          B-Side / Experiments
        </div>

        {/* Title */}
        <h1
          style={{
            fontFamily: "var(--font-jakarta), system-ui, sans-serif",
            fontSize: 28,
            fontWeight: 300,
            color: "rgba(255,255,255,0.85)",
            letterSpacing: "-0.04em",
            margin: "0 0 20px",
            lineHeight: 1.15,
          }}
        >
          B-Side
        </h1>

        {/* Divider */}
        <div
          style={{
            height: 1,
            backgroundColor: "rgba(255,255,255,0.06)",
            marginBottom: 36,
          }}
        />

        {/* Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
            gap: 12,
          }}
        >
          {showSkeletons &&
            Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}

          {showCards &&
            (labItems!.length > 0
              ? labItems!.map((item, i) => (
                  <LabCard
                    key={item._id}
                    item={item}
                    index={i}
                    onClick={handleCardClick}
                  />
                ))
              : Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            )}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
