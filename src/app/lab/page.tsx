"use client";

import { useState, useEffect } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
type ContentType = "image" | "gallery" | "embed";

type LabItem = {
  id: number;
  name: string;
  year: string;
  about: string;
  type: "lightbox" | "external";
  url?: string;
  contentType: ContentType;
};

// ─── Placeholder data ─────────────────────────────────────────────────────────
const LABS: LabItem[] = [
  { id: 1,  name: "Living Archives",           year: "2024", about: "Architectural model in collaboration with Alyssa Herbst — exploring archival memory through physical form", type: "lightbox", contentType: "image"   },
  { id: 2,  name: "Cumulus Zine 02",           year: "2024", about: "Editorial spreads and layout for Cumulus 02 in collaboration with the Cumulus team",                        type: "lightbox", contentType: "gallery" },
  { id: 3,  name: "Hand Assembling Cumulus",   year: "2024", about: "Documentation of hand assembly process for the Cumulus Zine print run",                                     type: "lightbox", contentType: "image"   },
  { id: 4,  name: "Refuge on the Bay of Fundy",year: "2023", about: "Hand-drafted architectural precedent drawing",                                                              type: "lightbox", contentType: "image"   },
  { id: 5,  name: "Gen Z Shower Chair",        year: "2023", about: "Branding campaign for a Gen Z shower chair in collaboration with Elaine Gao",                               type: "lightbox", contentType: "gallery" },
  { id: 6,  name: "Envelope Pavilion",         year: "2023", about: "Architectural model in collaboration with Cecilia Charney, Alexis Rodriguez, Zeiad Sherif",                 type: "lightbox", contentType: "gallery" },
  { id: 7,  name: "Ox-Bow Chair",              year: "2022", about: "Furniture fabrication — handmade chair from the Ox-Bow residency",                                          type: "lightbox", contentType: "image"   },
  { id: 8,  name: "Site Collage — 31st Beach", year: "2023", about: "Site collage study at 31st Beach Chicago",                                                                  type: "lightbox", contentType: "image"   },
  { id: 9,  name: "Materiality Collage",       year: "2023", about: "Materiality collage study at Federal Plaza Chicago",                                                        type: "lightbox", contentType: "image"   },
  { id: 10, name: "Atlas & Luna Soft Goods",   year: "2023", about: "Soft goods and textile work from the Atlas & Luna collection",                                              type: "lightbox", contentType: "gallery" },
  { id: 11, name: "Architectural Hand Drafts", year: "2023", about: "Hand-drafted architectural concept drawings",                                                               type: "lightbox", contentType: "gallery" },
  { id: 12, name: "Site Collage — Bridgeport", year: "2023", about: "Site collage study at Bridgeport Chicago",                                                                  type: "lightbox", contentType: "image"   },
  { id: 13, name: "Architecture Portfolio",    year: "2023", about: "Full architecture portfolio — previous life before product design",                                          type: "external", url: "https://indd.adobe.com/view/88593dc8-5e93-4680-a7f5-c8e3247cf356", contentType: "image"   },
  { id: 14, name: "AI Inbox Prototype",        year: "2025", about: "Conversational AI interface for field operations triage",                                                    type: "lightbox", contentType: "embed"   },
  { id: 15, name: "Design System Tokens",      year: "2025", about: "Automated token pipeline for multi-brand SaaS products",                                                    type: "lightbox", contentType: "image"   },
  { id: 16, name: "Framer Calculator",         year: "2025", about: "Embedded calculator component built natively in Framer",                                                    type: "external", url: "https://framer.com", contentType: "embed"   },
  { id: 17, name: "SVA Thesis 2025",           year: "2025", about: "MFA thesis on responsible AI in product design systems",                                                    type: "external", url: "https://harshapillai.com/thesis2025", contentType: "image"   },
  { id: 18, name: "Cumulus Zine Events",       year: "2024", about: "Events layout spread from Cumulus Zine in collaboration with the Cumulus team",                             type: "lightbox", contentType: "image"   },
];

// ─── Hover card row ───────────────────────────────────────────────────────────
function CardRow({
  label,
  children,
  border = true,
}: {
  label: string;
  children: React.ReactNode;
  border?: boolean;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "56px 1fr",
        gap: "0 10px",
        alignItems: "start",
        paddingBottom: border ? 10 : 0,
        marginBottom: border ? 10 : 0,
        borderBottom: border ? "1px solid #E5E5E5" : "none",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-dm-mono), monospace",
          fontSize: 10,
          letterSpacing: "-0.09em",
          color: "rgba(58,58,58,0.5)",
          textTransform: "uppercase",
          paddingTop: 3,
        }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

// ─── Card position state ──────────────────────────────────────────────────────
type CardPos = {
  cellTop: number;
  cellBottom: number;
  left: number;
  width: number;
  above: boolean;
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function LabPage() {
  const [hoveredId, setHoveredId]       = useState<number | null>(null);
  const [cardPos, setCardPos]           = useState<CardPos | null>(null);
  const [lightboxItem, setLightboxItem] = useState<LabItem | null>(null);

  // ESC closes lightbox
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setLightboxItem(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const handleEnter = (e: React.MouseEvent<HTMLDivElement>, item: LabItem, index: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const totalRows     = Math.ceil(LABS.length / 3);
    const currentRow    = Math.floor(index / 3);
    const isLastRow     = currentRow === totalRows - 1;
    const isSecondLast  = currentRow === totalRows - 2;

    // Default: below. Last or second-to-last row: above (card would overlap last row).
    const above = isLastRow || isSecondLast;

    setHoveredId(item.id);
    setCardPos({
      cellTop:    rect.top,
      cellBottom: rect.bottom,
      left:       rect.left,   // col 0,1,2: left-align; col 2 right-aligns naturally since card width = cell width
      width:      rect.width,
      above,
    });
  };

  const clearHover = () => {
    setHoveredId(null);
    setCardPos(null);
  };

  const handleClick = (item: LabItem) => {
    if (item.type === "lightbox") {
      setLightboxItem(item);
    } else if (item.url) {
      window.open(item.url, "_blank", "noopener,noreferrer");
    }
  };

  const hoveredItem = LABS.find((l) => l.id === hoveredId) ?? null;

  return (
    <>
      {/* ── Grid ─────────────────────────────────────────────────────────────── */}
      <div
        style={{ paddingTop: 80 }}
        onMouseLeave={clearHover}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 0,
          }}
        >
          {LABS.map((lab, index) => (
            <div
              key={lab.id}
              onMouseEnter={(e) => handleEnter(e, lab, index)}
              onClick={() => handleClick(lab)}
              style={{
                aspectRatio: "3/2",
                backgroundColor: "#C4C4C4",
                cursor: "pointer",
                boxSizing: "border-box",
                boxShadow:
                  hoveredId === lab.id ? "inset 0 0 0 1.5px #F35900" : "none",
              }}
            />
          ))}
        </div>
      </div>

      {/* ── Hover card ── fixed, pointer-events none so grid cells stay hot ─── */}
      {cardPos && hoveredItem && (
        <div
          style={{
            position:       "fixed",
            top:            cardPos.above ? cardPos.cellTop : cardPos.cellBottom,
            transform:      cardPos.above ? "translateY(-100%)" : "none",
            left:           cardPos.left,
            width:          cardPos.width,
            zIndex:         50,
            backgroundColor: "#FFFFFF",
            border:         "1.5px solid #F35900",
            padding:        16,
            boxSizing:      "border-box",
            pointerEvents:  "none",
          }}
        >
          {/* PROJECT */}
          <CardRow label="PROJECT">
            <span
              style={{
                fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                fontSize:      20,
                fontWeight:    500,
                letterSpacing: "-0.05em",
                color:         "#3A3A3A",
                lineHeight:    1.3,
                display:       "flex",
                alignItems:    "center",
                gap:           5,
                flexWrap:      "wrap",
              }}
            >
              {hoveredItem.name}
              <span style={{ color: "#F35900", fontSize: 16 }}>↗</span>
            </span>
          </CardRow>

          {/* YEAR */}
          <CardRow label="YEAR">
            <span
              style={{
                fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                fontSize:      15,
                fontWeight:    500,
                letterSpacing: "-0.05em",
                color:         "#3A3A3A",
              }}
            >
              {hoveredItem.year}
            </span>
          </CardRow>

          {/* ABOUT — no bottom border */}
          <CardRow label="ABOUT" border={false}>
            <span
              style={{
                fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                fontSize:      14,
                fontWeight:    500,
                letterSpacing: "-0.05em",
                color:         "#3A3A3A",
                lineHeight:    1.45,
              }}
            >
              {hoveredItem.about}
            </span>
          </CardRow>
        </div>
      )}

      {/* ── Lightbox ─────────────────────────────────────────────────────────── */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          style={{
            position:        "fixed",
            inset:           0,
            backgroundColor: "rgba(0,0,0,0.45)",
            zIndex:          100,
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position:        "fixed",
              inset:           16,
              backgroundColor: "#FFFFFF",
              border:          "1.5px solid #F35900",
              display:         "flex",
              flexDirection:   "column",
              overflow:        "hidden",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding:        "14px 20px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "space-between",
                flexShrink:     0,
                borderBottom:   "1px solid #E5E5E5",
              }}
            >
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <span
                  style={{
                    fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                    fontSize:      20,
                    fontWeight:    500,
                    letterSpacing: "-0.05em",
                    color:         "#3A3A3A",
                  }}
                >
                  {lightboxItem.name}
                </span>
                <span
                  style={{
                    fontFamily:    "var(--font-jakarta), system-ui, sans-serif",
                    fontSize:      15,
                    letterSpacing: "-0.05em",
                    color:         "#B5B5B5",
                  }}
                >
                  ({lightboxItem.year})
                </span>
              </div>

              <button
                onClick={() => setLightboxItem(null)}
                aria-label="Close"
                style={{
                  width:          32,
                  height:         32,
                  display:        "flex",
                  alignItems:     "center",
                  justifyContent: "center",
                  fontSize:       20,
                  cursor:         "pointer",
                  background:     "none",
                  border:         "1px solid #E5E5E5",
                  color:          "#3A3A3A",
                  lineHeight:     1,
                  flexShrink:     0,
                }}
              >
                ×
              </button>
            </div>

            {/* Content area — 16:9 placeholder, expands to fill remaining space */}
            <div
              style={{
                flex:           1,
                overflow:       "hidden",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                padding:        16,
                minHeight:      0,
              }}
            >
              {/* contentType: 'image' | 'gallery' | 'embed' — all render placeholder for now */}
              <div
                style={{
                  width:           "100%",
                  aspectRatio:     "16/9",
                  backgroundColor: "#C4C4C4",
                  maxHeight:       "100%",
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
