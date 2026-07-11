import React from "react";
import RoutesHero from "@/components/routes/RoutesHero";
import PopularRoutesGrid from "@/components/routes/PopularRoutesGrid";

export default function RoutesPage() {
  return (
    <main className="min-h-screen bg-[#eed7ba] -mt-[80px] relative">
      {/* Global Texture overlay for the page */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-multiply pointer-events-none z-0" 
        style={{
          backgroundImage: "url(/images/image.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      />
      
      <div className="relative z-10">
        <RoutesHero />
        <PopularRoutesGrid />
      </div>
    </main>
  );
}
