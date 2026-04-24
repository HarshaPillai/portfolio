import { client } from "@/lib/sanity";
import BSideClient, { type LabItem } from "@/components/BSideClient";
import StarCursor from "@/components/StarCursor";

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
  return (
    <>
      <StarCursor />
      <BSideClient labs={labs} />
    </>
  );
}