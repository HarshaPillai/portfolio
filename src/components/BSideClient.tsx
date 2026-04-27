"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import BsideLoader from "@/components/BsideLoader";


// ─── Types ────────────────────────────────────────────────────────────────────

export type LabItem = {
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
  thumbnailUrl?: string;
};

// ─── Star field ───────────────────────────────────────────────────────────────

const STARS = Array.from({ length: 52 }, (_, i) => {
  // Deterministic pseudo-random using index so it's stable across renders
  const seed = (i * 2654435761) >>> 0;
  const x = ((seed ^ (seed >> 16)) % 10000) / 100;
  const y = (((seed * 1664525 + 1013904223) >>> 0) % 10000) / 100;
  const opacity = 0.3 + (((seed * 22695477 + 1) >>> 0) % 1000) / 2000;
  const size = 1 + (((seed * 1664525 + 22695477) >>> 0) % 2);
  return { x, y, opacity, size: size || 1 };
});

function StarField() {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {STARS.map((star, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size === 1 ? 1 : 2,
            height: star.size === 1 ? 1 : 2,
            borderRadius: "50%",
            backgroundColor: "#ffffff",
            opacity: star.opacity,
          }}
        />
      ))}
    </div>
  );
}

// ─── Tag pill ─────────────────────────────────────────────────────────────────

function TagPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
        fontSize: 10,
        letterSpacing: "0.05em",
        textTransform: "uppercase",
        background: active ? "#F35900" : "transparent",
        color: active ? "#ffffff" : "#F35900",
        border: "1px solid #F35900",
        borderRadius: 2,
        padding: "5px 10px",
        cursor: "pointer",
        transition: "background 0.15s ease, color 0.15s ease",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

// ─── Status pip ───────────────────────────────────────────────────────────────

function StatusPip({ status }: { status?: string }) {
  const color =
    status === "live"     ? "#3D9142" :
    status === "wip"      ? "#FF6B00" :
    status === "archived" ? "rgba(255,255,255,0.2)" :
    "rgba(255,255,255,0.15)";

  if (!status) return null;

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8 }}>
      <div style={{ width: 5, height: 5, borderRadius: "50%", backgroundColor: color, flexShrink: 0 }} />
      <span
        style={{
          fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
          fontSize: 10,
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
        }}
      >
        {status}
      </span>
    </div>
  );
}

// ─── Lab card ─────────────────────────────────────────────────────────────────

function LabCard({
  item,
  onClick,
  priority,
  visible,
}: {
  item: LabItem;
  onClick: (item: LabItem) => void;
  priority?: boolean;
  visible: boolean;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onClick(item)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 4,
        border: `1px solid ${hovered ? "#FF5500" : "rgba(255,255,255,0.06)"}`,
        transition: "border-color 0.2s ease, opacity 0.3s ease, transform 0.3s ease",
        breakInside: "avoid",
        marginBottom: 12,
        display: "block",
        willChange: "transform, opacity",
        transform: visible ? "translateZ(0)" : "translateY(6px) translateZ(0)",
        opacity: visible ? 1 : 0,
      }}
    >
      {item.thumbnailUrl ? (
        <Image
          src={item.thumbnailUrl}
          alt={item.title}
          width={800}
          height={600}
          quality={80}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          sizes="(max-width: 768px) 100vw, 33vw"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
      ) : (
        <div style={{ width: "100%", minHeight: 180, background: "rgba(255,255,255,0.04)" }} />
      )}

      {/* Hover metadata panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0, left: 0, right: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "14px 16px",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s ease",
          willChange: "transform",
        }}
      >
        <div style={{ marginBottom: 6 }}>
          <div style={{ fontFamily: "var(--font-dm-mono), 'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
            Project
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: 16, fontWeight: 500, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.2 }}>
              {item.title}
            </span>
            {item.type === "external" && (
              <span style={{ color: "#FF5500", fontSize: 14, lineHeight: 1 }}>↗</span>
            )}
          </div>
        </div>

        {item.year && (
          <div style={{ marginBottom: 6 }}>
            <div style={{ fontFamily: "var(--font-dm-mono), 'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
              Year
            </div>
            <div style={{ fontFamily: "var(--font-dm-mono), 'DM Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
              {item.year}
            </div>
          </div>
        )}

        {item.about && (
          <div style={{ marginBottom: 4 }}>
            <div style={{ fontFamily: "var(--font-dm-mono), 'DM Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 2 }}>
              About
            </div>
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 12, color: "rgba(255,255,255,0.7)", lineHeight: 1.45,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.about}
            </div>
          </div>
        )}

        <StatusPip status={item.status} />
      </div>
    </div>
  );
}

// ─── Skeleton card ────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = [220, 300, 180, 260, 200, 340];

function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="bside-skeleton"
      style={{
        width: "100%", height, borderRadius: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        breakInside: "avoid", marginBottom: 12, display: "block",
      }}
    />
  );
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────

function Lightbox({ item, onClose }: { item: LabItem; onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.92)", zIndex: 8000, display: "flex", alignItems: "center", justifyContent: "center" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20, maxWidth: "80vw" }}
      >
        {item.thumbnailUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={`${item.thumbnailUrl}?w=1600&auto=format&q=80`}
            alt={item.title}
            style={{ maxWidth: "80vw", maxHeight: "80vh", objectFit: "contain", borderRadius: 6, display: "block" }}
          />
        ) : (
          <div style={{ width: "60vw", aspectRatio: "16/9", background: "rgba(255,255,255,0.04)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontFamily: "var(--font-dm-mono), monospace", fontSize: 11, color: "rgba(255,255,255,0.15)" }}>no preview</span>
          </div>
        )}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: 18, fontWeight: 500, color: "rgba(255,255,255,0.85)", letterSpacing: "-0.04em", marginBottom: 6 }}>
            {item.title}
          </div>
          {item.about && (
            <div style={{ fontFamily: "var(--font-jakarta), system-ui, sans-serif", fontSize: 13, color: "rgba(255,255,255,0.4)", lineHeight: 1.5, maxWidth: 480 }}>
              {item.about}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Client component ─────────────────────────────────────────────────────────

export default function BSideClient({ labs }: { labs: LabItem[] }) {
  const [loaded, setLoaded]             = useState(false);
  const [lightboxItem, setLightboxItem] = useState<LabItem | null>(null);
  const [activeTag, setActiveTag]       = useState<string>("All");

  useEffect(() => {
    document.body.classList.add("bside-page");
    return () => document.body.classList.remove("bside-page");
  }, []);

  useEffect(() => {
    const prevBg  = document.body.style.background;
    const prevAtt = document.body.style.backgroundAttachment;
    document.body.style.background           = "linear-gradient(to bottom, #050a18 0%, #0a1628 60%, #0d1f3c 100%)";
    document.body.style.backgroundAttachment = "fixed";
    return () => {
      document.body.style.background           = prevBg;
      document.body.style.backgroundAttachment = prevAtt;
    };
  }, []);

  // Collect unique tags from all items
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    labs.forEach(item => item.tags?.forEach(t => tagSet.add(t)));
    return ["All", ...Array.from(tagSet).sort()];
  }, [labs]);

  // Filter items by active tag
  const filteredLabs = useMemo(() => {
    if (activeTag === "All") return labs;
    return labs.filter(item => item.tags?.includes(activeTag));
  }, [labs, activeTag]);

  const handleCardClick = (item: LabItem) => {
    if (item.type === "external" && item.externalUrl) {
      window.open(item.externalUrl, "_blank", "noopener,noreferrer");
    } else {
      setLightboxItem(item);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* Star field */}
      <StarField />

      {/* CD loader */}
      {!loaded && (
        <BsideLoader direction="enter" onComplete={() => setLoaded(true)} />
      )}

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
        {/* Tag filter pills */}
        {allTags.length > 1 && (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              marginBottom: 36,
            }}
          >
            {allTags.map(tag => (
              <TagPill
                key={tag}
                label={tag}
                active={activeTag === tag}
                onClick={() => setActiveTag(tag)}
              />
            ))}
          </div>
        )}

        <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.06)", marginBottom: 36 }} />

        {/* Masonry grid */}
        <div style={{ columns: "3 280px", gap: 12 }}>
          {labs.length === 0
            ? SKELETON_HEIGHTS.map((h, i) => <SkeletonCard key={i} height={h} />)
            : filteredLabs.map((item, i) => (
                <LabCard
                  key={item._id}
                  item={item}
                  onClick={handleCardClick}
                  priority={i < 2}
                  visible={true}
                />
              ))}
        </div>

        {/* Empty state when tag has no items */}
        {labs.length > 0 && filteredLabs.length === 0 && (
          <div
            style={{
              textAlign: "center",
              padding: "80px 0",
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontSize: 11,
              color: "rgba(255,255,255,0.2)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            No items tagged &ldquo;{activeTag}&rdquo;
          </div>
        )}
      </div>

      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}