import React, { Suspense } from "react";
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
  const origin =
    parts[0].charAt(0).toUpperCase() + parts[0].slice(1).toLowerCase();
  const destination =
    parts[1].charAt(0).toUpperCase() + parts[1].slice(1).toLowerCase();

  return (
    <main className="min-h-screen bg-[#EAD8BE]">
      {/*
        RouteSearchResults and RouteDetailHero call useSearchParams() internally.
        Next.js requires Suspense boundary around any client component
        that reads search params when the page is statically rendered.
      */}
      <Suspense
        fallback={
          <div className="w-full max-w-[1280px] mx-auto px-4 md:px-12 py-8">
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-xl border border-[#E8D2B0]/40 p-5 animate-pulse"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#EAD8BE]" />
                    <div className="flex-1">
                      <div className="h-4 bg-[#EAD8BE] rounded w-1/3 mb-1" />
                      <div className="h-3 bg-[#EAD8BE] rounded w-1/5" />
                    </div>
                    <div className="h-6 bg-[#EAD8BE] rounded w-16" />
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="h-8 bg-[#EAD8BE] rounded w-20" />
                    <div className="flex-1 h-[1px] bg-[#EAD8BE]" />
                    <div className="h-8 bg-[#EAD8BE] rounded w-20" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        }
      >
        <RouteDetailHero origin={origin} destination={destination} />
        <RouteSearchResults origin={origin} destination={destination} />
      </Suspense>
    </main>
  );
}
