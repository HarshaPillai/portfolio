import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/lib/projects";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { slug, password } = body as { slug: string; password: string };

  if (!slug || !password) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const project = projects.find((p) => p.slug === slug);

  if (!project || !project.password) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const envKey = project.password;
  const expected = process.env[envKey];

  if (!expected) {
    // Env var not set — fail closed
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true }, { status: 200 });
}
