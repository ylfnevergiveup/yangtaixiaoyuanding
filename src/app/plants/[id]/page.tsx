import { plants as localPlants } from "@/data/plants";
import cmsPlants from "@/data/synced/plants";
import PlantDetailClient from "./PlantDetailClient";

export function generateStaticParams() {
  const ids = (cmsPlants as unknown as any[])
    .filter((p: any) => p.id)
    .map((p: any) => ({ id: p.id }));
  if (ids.length > 0) return ids;
  return localPlants.map((p) => ({ id: p.id }));
}

export default function PlantDetailPage() {
  return <PlantDetailClient />;
}
