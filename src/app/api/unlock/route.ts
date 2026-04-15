import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { password } = body as { slug?: string; password?: string };

  if (!password) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const expected = process.env.NDA_PASSWORD;

  if (!expected) {
    // Env var not set — fail closed
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (password !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ ok: true });
}
