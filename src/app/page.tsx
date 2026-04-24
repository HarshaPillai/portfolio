import { client } from "@/lib/sanity";
import { getLandingProjects } from "@/lib/queries";
import HomeCanvas from "@/components/HomeCanvas";
import type { LandingProject } from "@/types";

export default async function Home() {
  let projects: LandingProject[] = [];
  try {
    projects = await client.fetch<LandingProject[]>(getLandingProjects);
    console.log("[home] projects order:", projects.map((p, i) => `${i}: order=${p.order} slug=${p.slug}`));
  } catch (err) {
    console.error("[home] failed to fetch projects:", err);
  }
  return <HomeCanvas projects={projects} />;
}
