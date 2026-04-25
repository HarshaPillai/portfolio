import { client } from "@/lib/sanity";
import BSideClient, { type LabItem } from "@/components/BSideClient";

const QUERY = `*[_type == "labItem"] | order(_createdAt desc) {
  _id,
  title,
  slug,
  year,
  about,
  type,
  externalUrl,
  contentType,
  status,
  tags,
  "thumbnailUrl": thumbnail.asset->url
}`;

export default async function BSidePage() {
  const labs = await client.fetch<LabItem[]>(QUERY);
  return <BSideClient labs={labs} />;
}