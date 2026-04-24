import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import { client } from "@/lib/sanity";
import { getProjectBySlugFull } from "@/lib/queries";
import CaseStudyTemplate from "@/components/CaseStudyTemplate";
import NDAGate from "@/components/NDAGate";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;

  const project = await client.fetch(getProjectBySlugFull, { slug });
  console.log(`[ProjectPage] slug="${slug}" result:`, project ? `found (title: ${project.title})` : "null");

  if (!project) {
    console.warn(`[ProjectPage] notFound() called for slug="${slug}" — check Sanity for this document`);
    notFound();
  }

  if (project.nda) {
    const cookieStore = await cookies();
    if (cookieStore.get("nda_access")?.value !== "true") {
      return <NDAGate projectTitle={project.ndaTitle || project.title} />;
    }
  }

  return <CaseStudyTemplate project={project} />;
}
