import { notFound } from "next/navigation";
import { sanityClient } from "@/lib/sanity";
import { projectBySlugQuery } from "@/lib/queries";
import type { Project } from "@/types";
import CaseStudyContent from "@/components/CaseStudyContent";

// Dynamic rendering — Sanity data fetched on demand, cached per revalidate window
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;

  const project: Project | null = await sanityClient.fetch(
    projectBySlugQuery,
    { slug }
  );

  if (!project) notFound();

  return <CaseStudyContent project={project} />;
}
