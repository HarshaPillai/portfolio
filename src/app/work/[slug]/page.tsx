import { notFound } from "next/navigation";
import { projects } from "@/lib/projects";
import CaseStudyClient from "@/components/CaseStudyClient";

type Props = {
  params: { slug: string };
};

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export default function CaseStudyPage({ params }: Props) {
  const project = projects.find((p) => p.slug === params.slug);

  if (!project) notFound();

  return (
    <div className="w-full h-full overflow-auto">
      <CaseStudyClient project={project} />
    </div>
  );
}
