"use client";

import React from "react";
import HelpHero from "@/components/help/HelpHero";
import FAQSection from "@/components/home/FAQSection";
import StillNeedHelp from "@/components/help/StillNeedHelp";

export default function HelpSupportPage() {
  return (
    <div className="min-h-screen bg-[#F8F1E3]/20 -mt-[80px] relative">
      <HelpHero />

      {/* FAQ Section */}
      <div id="faq" className="bg-white border-t border-neutral-200">
        <FAQSection />
      </div>

      {/* Still Need Help Section */}
      <StillNeedHelp />
    </div>
  );
}
