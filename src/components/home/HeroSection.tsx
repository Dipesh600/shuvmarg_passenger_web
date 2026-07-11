import Image from "next/image";
import SearchCard from "./SearchCard";
import RecentSearches from "./RecentSearches";

import heroBg from "../../../public/images/hero_background.png";

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-stretch justify-start pt-[100px] md:pt-[130px] pb-32 sm:pb-40 md:pb-64 px-4 overflow-hidden">

      {/* Papercut Background Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroBg}
          alt="Shuv Marg Journey Background"
          fill
          className="object-cover object-center"
          priority
        />
      </div>

      <div className="relative text-center lg:text-left max-w-6xl w-full mx-auto flex flex-col items-center lg:items-start">
        {/* Headline */}
        <h1 className="text-[36px] sm:text-5xl md:text-[64px] font-display font-bold leading-[1.15] md:leading-[1.1] mb-3 md:mb-4 text-[#1a365d] order-1 tracking-tight">
          Your journey, <br className="hidden sm:block" />
          <span className="text-[#e14f3c]">at the right time.</span>
        </h1>

        {/* Subheadline */}
        <p className="text-[#2c3e50] text-base sm:text-lg md:text-[20px] max-w-2xl mb-5 md:mb-6 font-medium order-2">
          Trusted by thousands. Travel with peace of mind.
        </p>

        {/* Search System */}
        <div className="order-3 md:order-4 w-full">
          <SearchCard />
          <RecentSearches />
        </div>


      </div>
    </section>
  );
}
