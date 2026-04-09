export type LabItem = {
  id: string;
  title: string;
  description: string;
  type: "prototype" | "artifact" | "experiment" | "tool";
  date: string;
  liveUrl?: string;
  tags: string[];
  rotation?: number;
};

export const labItems: LabItem[] = [
  {
    id: "spatial-canvas",
    title: "Spatial Canvas",
    description:
      "Infinite canvas with physics-based card snapping. Built to explore spatial interfaces beyond grids.",
    type: "prototype",
    date: "Mar 2025",
    liveUrl: "#",
    tags: ["Interaction", "Canvas", "React"],
    rotation: -1,
  },
  {
    id: "token-diff",
    title: "Token Diff Viewer",
    description:
      "Side-by-side visual diff for design token changes. Paste two JSON token files, see exactly what changed.",
    type: "tool",
    date: "Feb 2025",
    liveUrl: "#",
    tags: ["Design Systems", "Tooling"],
    rotation: 2,
  },
  {
    id: "llm-annotation",
    title: "LLM Annotation Layer",
    description:
      "Claude artifact — paste any UI screenshot and get back structured design feedback as inline annotations.",
    type: "artifact",
    date: "Jan 2025",
    liveUrl: "#",
    tags: ["AI", "Claude", "Design Review"],
    rotation: -2,
  },
  {
    id: "type-scale-explorer",
    title: "Type Scale Explorer",
    description:
      "Interactive type scale builder with live preview across modular scale ratios and viewport sizes.",
    type: "tool",
    date: "Dec 2024",
    liveUrl: "#",
    tags: ["Typography", "Design Systems"],
    rotation: 1,
  },
  {
    id: "motion-easing",
    title: "Motion Easing Lab",
    description:
      "Vibe-coded easing curve editor. Drag control points, preview on real UI patterns, export as CSS or Framer tokens.",
    type: "experiment",
    date: "Nov 2024",
    liveUrl: "#",
    tags: ["Motion", "Animation", "CSS"],
    rotation: 3,
  },
  {
    id: "cursor-presence",
    title: "Multiplayer Cursor Presence",
    description:
      "Lightweight presence layer experiment — real-time cursors, no infra. Pure WebRTC signalling.",
    type: "experiment",
    date: "Oct 2024",
    liveUrl: "#",
    tags: ["Realtime", "WebRTC", "Collaboration"],
    rotation: -3,
  },
  {
    id: "color-palette-gen",
    title: "Palette from Screenshot",
    description:
      "Drop a screenshot, get a harmonious color palette extracted and formatted as design tokens.",
    type: "tool",
    date: "Sep 2024",
    liveUrl: "#",
    tags: ["Color", "Tooling", "Claude"],
    rotation: 2,
  },
  {
    id: "reading-ui",
    title: "Reading Mode UI",
    description:
      "Explorations in distraction-free reading interfaces. Variable fonts, adaptive line length, ambient color.",
    type: "prototype",
    date: "Aug 2024",
    liveUrl: "#",
    tags: ["Typography", "Reading", "CSS"],
    rotation: -1,
  },
];
