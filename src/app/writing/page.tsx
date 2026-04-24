import { XMLParser } from "fast-xml-parser";
import WritingClient, { type Article } from "@/components/WritingClient";

function stripHtml(html: string): string {
  return html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#\d+;/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function resolveString(val: unknown): string {
  if (typeof val === "string") return val;
  if (typeof val === "number") return String(val);
  if (val && typeof val === "object") {
    // Atom-style <link href="..."> — fast-xml-parser gives { "@_href": "..." }
    const asRec = val as Record<string, unknown>;
    if (typeof asRec["@_href"] === "string") return asRec["@_href"];
    // CDATA wrapped by parser into { "#text": "..." }
    if (typeof asRec["#text"] === "string") return asRec["#text"];
  }
  return "";
}

async function fetchArticles(): Promise<Article[]> {
  try {
    const res = await fetch("https://medium.com/feed/@harshapillai", {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];

    const xml = await res.text();
    const parser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: "@_" });
    const result = parser.parse(xml);

    const rawItems: unknown = result?.rss?.channel?.item;
    const items = Array.isArray(rawItems)
      ? rawItems
      : rawItems
      ? [rawItems]
      : [];

    return (items as Record<string, unknown>[]).map((item) => {
      const rawDesc = resolveString(item.description);
      const stripped = stripHtml(rawDesc);
      const description =
        stripped.length > 180 ? stripped.slice(0, 177) + "..." : stripped;

      return {
        title: resolveString(item.title).trim(),
        pubDate: formatDate(resolveString(item.pubDate)),
        description,
        link: resolveString(item.link) || resolveString(item.guid) || "#",
      };
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