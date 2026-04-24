import WritingClient from "@/components/WritingClient";
import type { Article } from "@/components/WritingClient";

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch("https://medium.com/feed/@harshapillai", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();

    // Simple regex-based RSS parser — no external deps
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/g)];

    return items.map((match) => {
      const item = match[1];

      const title = item.match(/<title><!\[CDATA\[(.*?)\]\]><\/title>/)?.[1]
        ?? item.match(/<title>(.*?)<\/title>/)?.[1]
        ?? "Untitled";

      const pubDate = item.match(/<pubDate>(.*?)<\/pubDate>/)?.[1] ?? "";

      const rawDesc = item.match(/<content:encoded><!\[CDATA\[([\s\S]*?)\]\]><\/content:encoded>/)?.[1]
        ?? item.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/)?.[1]
        ?? "";

      const stripped = rawDesc
        .replace(/<[^>]*>/g, " ")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#\d+;/g, "")
        .replace(/\s+/g, " ")
        .trim();

      const description = stripped.length > 180
        ? stripped.slice(0, 177) + "..."
        : stripped;

      const link = item.match(/<link>(.*?)<\/link>/)?.[1]
        ?? item.match(/<guid>(.*?)<\/guid>/)?.[1]
        ?? "#";

      const formatted = (() => {
        try {
          const d = new Date(pubDate);
          if (isNaN(d.getTime())) return pubDate;
          return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
        } catch {
          return pubDate;
        }
      })();

      return { title: title.trim(), pubDate: formatted, description, link };
    });
  } catch (err) {
    console.error("[writing] RSS fetch failed:", err);
    return [];
  }
}

export default async function WritingPage() {
  const articles = await fetchArticles();
  return <WritingClient articles={articles} />;
}