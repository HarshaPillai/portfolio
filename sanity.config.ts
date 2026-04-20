import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { schemaTypes } from "./sanity/schemaTypes";

export default defineConfig({
  name: "default",
  title: "Harsha Pillai Portfolio",
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "5t3s0ncb",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
  plugins: [structureTool()],
  schema: { types: schemaTypes },
});
