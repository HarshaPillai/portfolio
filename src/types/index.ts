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
