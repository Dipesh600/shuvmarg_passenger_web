import React, { Suspense } from "react";
import RouteDetailHero from "@/components/routes/RouteDetailHero";
import RouteSearchResults from "@/components/routes/RouteSearchResults";
import RouteSearchSkeleton from "@/components/routes/RouteSearchSkeleton";
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
  const origin =
    parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  const destination =
    parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();

  return (
    <main className="min-h-screen bg-[#EAD8BE]">
      {/* Hero section renders immediately at top */}
      <Suspense fallback={null}>
        <RouteDetailHero origin={origin} destination={destination} />
      </Suspense>

      {/* Results column loads skeleton inside results container only */}
      <Suspense
        fallback={
          <div className="w-full relative bg-[#EAD8BE] border-t border-[#D9B992]">
            <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8">
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="hidden lg:block w-[320px] shrink-0">
                  <div className="w-full h-80 bg-[#E8D2B0]/40 animate-pulse rounded-2xl" />
                </div>
                <div className="flex-1">
                  <RouteSearchSkeleton count={3} />
                </div>
              </div>
            </div>
          </div>
        }
      >
        <RouteSearchResults origin={origin} destination={destination} />
      </Suspense>
    </main>
  );
}
