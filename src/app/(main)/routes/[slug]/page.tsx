import React from "react";
import RouteDetailHero from "@/components/routes/RouteDetailHero";
import RouteSearchResults from "@/components/routes/RouteSearchResults";
import { notFound } from "next/navigation";
interface RouteDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RouteDetailPage({ params }: RouteDetailPageProps) {
  // Parse slug like "kathmandu-to-pokhara"
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  const parts = slug.split("-to-");
  
  if (parts.length !== 2) {
    notFound();
  }

  // Basic formatting for presentation
  const origin = parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  const destination = parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();

  return (
    <main className="min-h-screen bg-[#EAD8BE]">
      <RouteDetailHero origin={origin} destination={destination} />
      
      <RouteSearchResults origin={origin} destination={destination} />
    </main>
  );
}
