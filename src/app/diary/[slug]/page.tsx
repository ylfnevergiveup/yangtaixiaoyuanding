import { diaryEntries as localDiary } from "@/data/diary";
import cmsDiary from "@/data/synced/diary";
import DiaryDetailClient from "./DiaryDetailClient";

export function generateStaticParams() {
  const slugs = (cmsDiary as unknown as any[])
    .filter((d: any) => d.slug)
    .map((d: any) => ({ slug: d.slug }));
  if (slugs.length > 0) return slugs;
  return localDiary.map((d) => ({ slug: d.slug }));
}

export default function DiaryDetailPage() {
  return <DiaryDetailClient />;
}
