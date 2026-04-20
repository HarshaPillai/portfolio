import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { getProjectBySlug, getAllProjectSlugs } from "@/lib/queries";
import type { ProjectV2 } from "@/types";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import { dreamMatchSeed } from "../../../../sanity/seed/dream-match";

export async function generateStaticParams() {
  try {
    const slugs: { slug: string }[] = await sanityClient.fetch(
      getAllProjectSlugs
    );
    return slugs.map(({ slug }) => ({ slug }));
  } catch {
    return [];
  }
}

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  let project: ProjectV2 | null = null;

  try {
    project = await sanityClient.fetch(getProjectBySlug, { slug });
  } catch {
    // Sanity unavailable — fall through to seed data
  }

  // Seed data fallback for dream-match
  if (!project && slug === "dream-match") {
    project = dreamMatchSeed;
  }

  if (!project) notFound();

  return <CaseStudyTemplate project={project} />;
}
