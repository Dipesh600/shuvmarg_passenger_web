import HeroSection from "@/components/home/HeroSection";
import OffersSection from "@/components/home/OffersSection";
import PopularRoutesSection from "@/components/home/PopularRoutesSection";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <>
      <div className="relative">
        <HeroSection />
      </div>
      <div className="w-full relative z-20 -mt-24 sm:-mt-32 md:-mt-40 lg:-mt-32">
        <OffersSection />
      </div>
      <PopularRoutesSection />
      <BlogSection />
      <FAQSection />
      <AboutSection />
    </>
  );
}
