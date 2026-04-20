import type { ProjectV2 } from "@/types";

export const dreamMatchSeed: ProjectV2 = {
  _id: "seed-dream-match",
  title: "Dream-Match",
  slug: { current: "dream-match" },
  tagline: "Reimagining career exploration for high school students through values-based matching.",
  year: 2025,
  client: "SVA Thesis",
  tags: ["#ACADEMIC", "#UX", "#RESEARCH"],
  order: 1,
  hook: {
    headline: "The dream gap",
    body: "There's a disconnect between what students dream of becoming and the careers they actually end up in — not from lack of ambition, but from lack of exposure.",
  },
  context: {
    headline: "Individual project, 10 weeks",
    body: "SVA MFA program, 2025. Role: end-to-end — research, synthesis, product design, brand identity.",
  },
  challenge: {
    headline: "Career decisions made in the dark",
    body: "High school students make career decisions based on subject familiarity, not self-knowledge. No existing tool helped them understand which environments, people, and day-to-day realities matched who they actually are.",
    pullQuote:
      "What if I pick the wrong career and get stuck doing something I hate? I feel like I'm supposed to know what I want to do, but I honestly have no clue.",
    pullQuoteAttribution: "— High School Junior, concept testing",
  },
  keyDecisions: [
    {
      _key: "d1",
      decisionNumber: "Decision 01",
      headline: "Trait-based search over subject-based search",
      body: "Careers indexed by working environment and personality fit, not field. This reframes the entire mental model from 'what subject am I good at' to 'what kind of work life do I want.'",
    },
    {
      _key: "d2",
      decisionNumber: "Decision 02",
      headline: "Mentor-led exploration over algorithmic matching",
      body: "Students choose their own mentors after exploring, preserving agency. Testing showed students wanted to feel in control of who they connected with.",
    },
    {
      _key: "d3",
      decisionNumber: "Decision 03",
      headline: "Quiz as entry point, not gate",
      body: "The Dream-Match quiz lowers the barrier for students who don't know where to start, but isn't required — students can also browse freely.",
    },
  ],
  outcome: {
    headline: "A platform that speaks student",
    body: "A trait-based career exploration platform connecting high school students with mentors. Validated through concept testing with NYC school teachers and students. Partnership model designed for public school integration.",
  },
  selectedScreens: [
    { _key: "s1", caption: "Onboarding Flow" },
    { _key: "s2", caption: "Career Search" },
    { _key: "s3", caption: "Trait Matching Quiz" },
    { _key: "s4", caption: "Mentor Profiles" },
    { _key: "s5", caption: "Dream-Labs Extension" },
  ],
};
