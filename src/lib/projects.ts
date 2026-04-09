export type Project = {
  slug: string;
  title: string;
  year: string;
  tags: string[];
  nda: boolean;
  password?: string; // key name in env, e.g. "PROJECT_ALPHA_PASSWORD"
  excerpt: string;
  featured: boolean;
  rotation?: number; // degrees, for home canvas placement
  offsetX?: string;  // tailwind arbitrary or percentage
  offsetY?: string;
};

export const projects: Project[] = [
  {
    slug: "design-system-v3",
    title: "Design System v3",
    year: "2024",
    tags: ["SaaS", "Design Systems", "React"],
    nda: false,
    excerpt:
      "Rebuilt a fractured component library from scratch — unified token architecture, 200+ components, shipped to 12 product teams.",
    featured: true,
    rotation: -2,
  },
  {
    slug: "ai-onboarding",
    title: "AI-Assisted Onboarding",
    year: "2024",
    tags: ["AI", "SaaS", "NDA"],
    nda: true,
    password: "PROJECT_AI_ONBOARDING_PASSWORD",
    excerpt:
      "Rethought user onboarding with LLM-driven personalisation. 40% reduction in time-to-value.",
    featured: true,
    rotation: 1,
  },
  {
    slug: "data-pipeline-ui",
    title: "Data Pipeline Builder",
    year: "2023",
    tags: ["Enterprise", "Data", "Complex UI"],
    nda: false,
    excerpt:
      "Visual node-based editor for orchestrating ETL pipelines. Designed for data engineers, built with love.",
    featured: true,
    rotation: 2,
  },
  {
    slug: "mobile-checkout",
    title: "Mobile Checkout Overhaul",
    year: "2023",
    tags: ["E-Commerce", "Mobile", "NDA"],
    nda: true,
    password: "PROJECT_CHECKOUT_PASSWORD",
    excerpt:
      "End-to-end redesign of a checkout flow serving 2M+ monthly transactions.",
    featured: false,
    rotation: -1,
  },
  {
    slug: "command-palette",
    title: "Command Palette System",
    year: "2022",
    tags: ["Developer Tools", "Interaction Design"],
    nda: false,
    excerpt:
      "Designed and prototyped a universal command palette for a developer tooling platform.",
    featured: false,
    rotation: 3,
  },
  {
    slug: "analytics-dashboard",
    title: "Analytics Dashboard",
    year: "2022",
    tags: ["Data Vis", "SaaS"],
    nda: false,
    excerpt:
      "Reimagined a cluttered analytics surface into a focused, decision-making tool.",
    featured: false,
    rotation: -2,
  },
];

export const featuredProjects = projects.filter((p) => p.featured);
