import { guides as localGuides } from "@/data/guides";
import cmsGuides from "@/data/synced/guides";
import GuideDetailClient from "./GuideDetailClient";

export function generateStaticParams() {
  const slugs = (cmsGuides as unknown as any[])
    .filter((g: any) => g.slug)
    .map((g: any) => ({ slug: g.slug }));
  if (slugs.length > 0) return slugs;
  return localGuides.map((g) => ({ slug: g.slug }));
}

export default function GuideDetailPage() {
  return <GuideDetailClient />;
}
