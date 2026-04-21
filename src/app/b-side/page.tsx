"use client";

import { useState, useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import { sanityClient } from "@/lib/sanity";
import BsideLoader from "@/components/BsideLoader";

const BsideGradient = dynamic(() => import("@/components/BsideGradient"), {
  ssr: false,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type ThumbnailAsset = {
  url: string;
  metadata: {
    dimensions: { width: number; height: number };
  };
};

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
  thumbnail?: ThumbnailAsset;
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
  "thumbnail": thumbnail.asset->{
    url,
    metadata { dimensions { width, height } }
  }
}`;

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
      <div
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          backgroundColor: color,
          flexShrink: 0,
        }}
      />
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
}: {
  item: LabItem;
  onClick: (item: LabItem) => void;
}) {
  const [hovered, setHovered] = useState(false);

  const dims = item.thumbnail?.metadata?.dimensions;
  const aspectRatio = dims ? dims.width / dims.height : undefined;

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
        transition: "border-color 0.2s ease",
        breakInside: "avoid",
        marginBottom: 12,
        display: "block",
      }}
    >
      {/* Thumbnail or placeholder */}
      {item.thumbnail?.url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.thumbnail.url}
          alt={item.title}
          style={{
            display: "block",
            width: "100%",
            aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
            objectFit: "cover",
          }}
        />
      ) : (
        <div
          style={{
            width: "100%",
            minHeight: 180,
            background: "rgba(255,255,255,0.04)",
          }}
        />
      )}

      {/* Hover metadata panel */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          background: "rgba(0,0,0,0.88)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          padding: "14px 16px",
          transform: hovered ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.25s ease",
        }}
      >
        {/* Project row */}
        <div style={{ marginBottom: 6 }}>
          <div
            style={{
              fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Project
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 16,
                fontWeight: 500,
                color: "#FFFFFF",
                letterSpacing: "-0.03em",
                lineHeight: 1.2,
              }}
            >
              {item.title}
            </span>
            {item.type === "external" && (
              <span style={{ color: "#FF5500", fontSize: 14, lineHeight: 1 }}>↗</span>
            )}
          </div>
        </div>

        {/* Year row */}
        {item.year && (
          <div style={{ marginBottom: 6 }}>
            <div
              style={{
                fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              Year
            </div>
            <div
              style={{
                fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
                fontSize: 11,
                color: "rgba(255,255,255,0.6)",
              }}
            >
              {item.year}
            </div>
          </div>
        )}

        {/* About row */}
        {item.about && (
          <div style={{ marginBottom: 4 }}>
            <div
              style={{
                fontFamily: "var(--font-dm-mono), 'DM Mono', monospace",
                fontSize: 9,
                color: "rgba(255,255,255,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                marginBottom: 2,
              }}
            >
              About
            </div>
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 12,
                color: "rgba(255,255,255,0.7)",
                lineHeight: 1.45,
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

function SkeletonCard({ height }: { height: number }) {
  return (
    <div
      className="bside-skeleton"
      style={{
        width: "100%",
        height,
        borderRadius: 4,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        breakInside: "avoid",
        marginBottom: 12,
        display: "block",
      }}
    />
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
        backgroundColor: "rgba(0,0,0,0.92)",
        zIndex: 8000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 20,
          maxWidth: "80vw",
        }}
      >
        {item.thumbnail?.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.thumbnail.url}
            alt={item.title}
            style={{
              maxWidth: "80vw",
              maxHeight: "80vh",
              objectFit: "contain",
              borderRadius: 6,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "60vw",
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

        <div style={{ textAlign: "center" }}>
          <div
            style={{
              fontFamily: "var(--font-jakarta), system-ui, sans-serif",
              fontSize: 18,
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              letterSpacing: "-0.04em",
              marginBottom: 6,
            }}
          >
            {item.title}
          </div>
          {item.about && (
            <div
              style={{
                fontFamily: "var(--font-jakarta), system-ui, sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.4)",
                lineHeight: 1.5,
                maxWidth: 480,
              }}
            >
              {item.about}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Masonry grid ─────────────────────────────────────────────────────────────

const SKELETON_HEIGHTS = [220, 300, 180, 260, 200, 340];

function MasonryGrid({
  items,
  onCardClick,
}: {
  items: LabItem[] | null;
  onCardClick: (item: LabItem) => void;
}) {
  return (
    <div
      style={{
        columns: "3 280px",
        gap: 12,
      }}
    >
      {items === null
        ? SKELETON_HEIGHTS.map((h, i) => <SkeletonCard key={i} height={h} />)
        : items.length === 0
        ? SKELETON_HEIGHTS.map((h, i) => <SkeletonCard key={i} height={h} />)
        : items.map((item) => (
            <LabCard key={item._id} item={item} onClick={onCardClick} />
          ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function BSidePage() {
  const [loaded, setLoaded]             = useState(false);
  const [labItems, setLabItems]         = useState<LabItem[] | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LabItem | null>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    sanityClient
      .fetch<LabItem[]>(QUERY)
      .then(setLabItems)
      .catch(() => setLabItems([]));
  }, []);

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

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A0A0A",
        position: "relative",
        overflowY: "auto",
      }}
    >
      {/* CD loader */}
      {!loaded && (
        <BsideLoader direction="enter" onComplete={() => setLoaded(true)} />
      )}

      {/* ShaderGradient */}
      <div style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.5s ease" }}>
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

        {/* Masonry grid */}
        <MasonryGrid items={loaded ? labItems : null} onCardClick={handleCardClick} />
      </div>

      {/* Lightbox */}
      {lightboxItem && (
        <Lightbox item={lightboxItem} onClose={() => setLightboxItem(null)} />
      )}
    </div>
  );
}
