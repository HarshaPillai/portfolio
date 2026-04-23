// TypeScript types mirroring the Sanity project schema

export type SanityImage = {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
};

export type Decision = {
  _key: string;
  decisionTitle: string;
  decisionBody: string;
};

export type ProcessImage = {
  _key: string;
  image: SanityImage;
  caption?: string;
};

export type Diagram = {
  _key: string;
  diagramTitle: string;
  diagramImage: SanityImage;
};

export type Project = {
  _id: string;
  title: string;
  slug: { current: string };
  year?: string;
  duration?: string;
  role?: string;
  type?: "Client" | "Academic";
  nda: boolean;
  thumbnail?: SanityImage;
  hook?: string;
  context?: string;
  challenge?: string;
  decisions?: Decision[];
  outcome?: string;
  screens?: Array<SanityImage & { _key: string }>;
  processImages?: ProcessImage[];
  diagrams?: Diagram[];
};

export type ProjectListItem = Pick<
  Project,
  "_id" | "title" | "slug" | "year" | "duration" | "role" | "type" | "nda" | "thumbnail" | "hook"
>;

// ─── Landing page project (new schema with toggle fields) ─────────────────────

export type LandingProject = {
  _id: string;
  title: string;
  slug: string;
  client?: string;
  year?: string;
  about?: string;
  tags?: string[];
  thumbnailUrl?: string;
  type?: string;
  nda?: boolean;
  ndaTitle?: string;
  isLive?: boolean;
  isExternal?: boolean;
  externalUrl?: string;
};

// ─── v2 types (new schema) ────────────────────────────────────────────────────

export type SanityImageWithAlt = {
  _type: "image";
  asset: { _ref: string; _type: "reference" };
  alt?: string;
  hotspot?: { x: number; y: number; height: number; width: number };
};

export type ProjectV2 = {
  _id: string;
  title: string;
  slug: { current: string };
  tagline?: string;
  year?: number;
  client?: string;
  tags?: string[];
  heroImage?: SanityImageWithAlt;
  order?: number;
  hook?: { headline: string; body: string };
  context?: { headline: string; body: string };
  challenge?: {
    headline: string;
    body: string;
    pullQuote?: string;
    pullQuoteAttribution?: string;
  };
  keyDecisions?: Array<{
    _key: string;
    decisionNumber: string;
    headline: string;
    body: string;
  }>;
  outcome?: { headline: string; body: string };
  selectedScreens?: Array<{
    _key: string;
    image?: SanityImageWithAlt;
    caption?: string;
  }>;
  nextProject?: { title: string; slug: { current: string } };
};
