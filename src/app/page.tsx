import { client } from "@/lib/sanity";
import { getLandingProjects } from "@/lib/queries";
import HomeCanvas from "@/components/HomeCanvas";
import type { LandingProject } from "@/types";

export default async function Home() {
  let projects: LandingProject[] = [];
  try {
    projects = await client.fetch<LandingProject[]>(getLandingProjects);
  } catch (err) {
    console.error("[home] failed to fetch projects:", err);
  }
  return <HomeCanvas projects={projects} />;
}
