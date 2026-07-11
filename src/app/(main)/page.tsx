import HeroSection from "@/components/home/HeroSection";
import OffersSection from "@/components/home/OffersSection";
import PopularRoutesSection from "@/components/home/PopularRoutesSection";
import BlogSection from "@/components/home/BlogSection";
import FAQSection from "@/components/home/FAQSection";
import AboutSection from "@/components/home/AboutSection";

export default function Home() {
  return (
    <>
      <HeroSection />
      <div className="w-full relative z-20 -mt-32 md:-mt-56">
        <OffersSection />
      </div>
      <PopularRoutesSection />
      <BlogSection />
      <FAQSection />
      <AboutSection />
    </>
  );
}
