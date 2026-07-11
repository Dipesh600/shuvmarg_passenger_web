"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

const getShortName = (name: string) => {
  const map: Record<string, string> = {
    "Kathmandu": "KTM",
    "Pokhara": "PKR",
    "Chitwan": "CTW",
    "Butwal": "BTL",
    "Biratnagar": "BIR",
    "Lumbini": "LUM",
    "Dharan": "DHR",
    "Janakpur": "JNK",
    "Birgunj": "BRG"
  };
  return map[name] || name.substring(0, 3).toUpperCase();
};

const getDestinationImage = (destination: string) => {
  const lowercaseDest = destination.toLowerCase();
  if (lowercaseDest === "pokhara") {
    return "/images/destination_images/pokhara.webp";
  }
  const availableImages = ["kathmandu", "birgunj", "janakpur"];
  if (availableImages.includes(lowercaseDest)) {
    return `/images/destination_images/${lowercaseDest}.webp`;
  }
  return "/images/image.png";
};

const popularRoutes = [
  {
    id: 1,
    origin: "Kathmandu",
    destination: "Pokhara",
    duration: "7h 30m",
    price: 1200,
    operatorsCount: 15,
  },
  {
    id: 2,
    origin: "Kathmandu",
    destination: "Chitwan",
    duration: "5h 15m",
    price: 800,
    operatorsCount: 12,
  },
  {
    id: 3,
    origin: "Pokhara",
    destination: "Butwal",
    duration: "6h 0m",
    price: 1000,
    operatorsCount: 8,
  },
  {
    id: 4,
    origin: "Kathmandu",
    destination: "Biratnagar",
    duration: "12h 45m",
    price: 2500,
    operatorsCount: 5,
  },
  {
    id: 5,
    origin: "Kathmandu",
    destination: "Lumbini",
    duration: "8h 30m",
    price: 1500,
    operatorsCount: 6,
  },
  {
    id: 6,
    origin: "Pokhara",
    destination: "Chitwan",
    duration: "4h 45m",
    price: 700,
    operatorsCount: 10,
  },
  {
    id: 7,
    origin: "Kathmandu",
    destination: "Dharan",
    duration: "10h 15m",
    price: 2200,
    operatorsCount: 4,
  },
  {
    id: 8,
    origin: "Pokhara",
    destination: "Kathmandu",
    duration: "7h 30m",
    price: 1200,
    operatorsCount: 15,
  },
  {
    id: 9,
    origin: "Kathmandu",
    destination: "Janakpur",
    duration: "10h 0m",
    price: 1800,
    operatorsCount: 7,
  },
  {
    id: 10,
    origin: "Kathmandu",
    destination: "Birgunj",
    duration: "8h 45m",
    price: 1400,
    operatorsCount: 10,
  }
];

export default function PopularRoutesSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    // Set initial scroll position to middle set
    if (container.scrollLeft === 0) {
      container.scrollLeft = container.scrollWidth / 3;
    }

    let animationId: number;
    let lastTime = performance.now();

    const scroll = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;
      
      if (!isHovered) {
        container.scrollLeft += delta * 0.05; // Auto scroll speed
        
        const setWidth = container.scrollWidth / 3;
        // Loop back
        if (container.scrollLeft >= setWidth * 2) {
          container.scrollLeft -= setWidth;
        } else if (container.scrollLeft <= 0) {
          container.scrollLeft += setWidth;
        }
      }

      // Mobile/Tablet scroll-based animation: active center card
      if (window.innerWidth < 1024) {
        const containerCenter = container.getBoundingClientRect().left + container.clientWidth / 2;
        let closestIndex = -1;
        let minDistance = Infinity;

        const children = Array.from(container.children) as HTMLElement[];
        children.forEach((child, index) => {
          const rect = child.getBoundingClientRect();
          const childCenter = rect.left + rect.width / 2;
          const distance = Math.abs(containerCenter - childCenter);
          if (distance < minDistance) {
            minDistance = distance;
            closestIndex = index;
          }
        });

        children.forEach((child, index) => {
          // The child itself is the element with the 'group' class
          if (index === closestIndex) {
            if (child.getAttribute('data-active') !== 'true') {
              child.setAttribute('data-active', 'true');
            }
          } else {
            if (child.getAttribute('data-active') === 'true') {
              child.setAttribute('data-active', 'false');
            }
          }
        });
      } else {
        // Clean up on desktop
        const children = Array.from(container.children) as HTMLElement[];
        children.forEach((child) => {
          if (child.getAttribute('data-active') === 'true') {
            child.setAttribute('data-active', 'false');
          }
        });
      }

      animationId = requestAnimationFrame(scroll);
    };

    animationId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationId);
  }, [isHovered]);

  const scrollLeftBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -320, behavior: 'smooth' });
    }
  };

  const scrollRightBtn = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 320, behavior: 'smooth' });
    }
  };

  return (
    <section 
      className="relative w-full pt-20 md:pt-28 pb-16 md:pb-24 bg-[#e2e2e3] overflow-hidden z-30 -mt-[24px]"
      style={{
        WebkitMaskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 24' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z' fill='black'/%3E%3C/svg%3E"), linear-gradient(black, black)`,
        WebkitMaskSize: '100% 24px, 100% calc(100% - 24px)',
        WebkitMaskPosition: 'top left, bottom left',
        WebkitMaskRepeat: 'no-repeat',
        maskImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 1200 24' preserveAspectRatio='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z' fill='black'/%3E%3C/svg%3E"), linear-gradient(black, black)`,
      maskSize: '100% 24px, 100% calc(100% - 24px)',
      maskPosition: 'top left, bottom left',
      maskRepeat: 'no-repeat',
    }}
  >
      {/* Texture Background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Image 
          src="/images/image.png" 
          alt="Section Texture" 
          fill 
          className="object-cover opacity-25 mix-blend-multiply"
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="flex flex-col mb-8 md:mb-12 gap-2 md:gap-3">
          <div className="flex flex-row items-center justify-between gap-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-[#0B3150]">
              Popular Routes
            </h2>
            <Link href="/routes" className="flex items-center gap-2 text-[#D94328] font-semibold hover:text-[#b83820] transition-colors group shrink-0">
              <span className="hidden md:inline whitespace-nowrap">View All Routes</span>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 md:w-5 md:h-5 shrink-0 group-hover:translate-x-1 transition-transform">
                <path d="M3 12h18"/><path d="m14 5 7 7-7 7"/>
              </svg>
            </Link>
          </div>
          <p className="text-[#475569] text-base md:text-lg max-w-2xl">
            Travel across Nepal with our most booked journeys.
          </p>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {/* Horizontal Infinite Scroll layout */}
      <div 
        className="relative w-full overflow-hidden pb-8 z-10 group/slider"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left/Right scroll buttons */}
        <button 
          onClick={scrollLeftBtn}
          className="absolute left-4 md:left-8 top-[135px] md:top-[145px] z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-[#0B3150] hover:bg-[#0B3150] hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 -translate-y-1/2"
          aria-label="Scroll Left"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <button 
          onClick={scrollRightBtn}
          className="absolute right-4 md:right-8 top-[135px] md:top-[145px] z-30 w-12 h-12 flex items-center justify-center bg-white rounded-full shadow-lg text-[#0B3150] hover:bg-[#0B3150] hover:text-white transition-all opacity-0 group-hover/slider:opacity-100 -translate-y-1/2"
          aria-label="Scroll Right"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </button>

        <div 
          ref={scrollRef}
          className="flex overflow-x-auto no-scrollbar w-full"
        >
          {[...popularRoutes, ...popularRoutes, ...popularRoutes].map((route, index) => (
            <Link 
              href={`/routes/${route.origin.toLowerCase()}-to-${route.destination.toLowerCase()}`}
              key={`${route.id}-${index}`}
              className="w-[280px] md:w-[320px] shrink-0 group flex flex-col bg-white rounded-[24px] overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-[#E8D2B0]/30 mr-4 md:mr-6 block"
            >
              {/* Image Section */}
                <div className="relative h-[200px] md:h-[220px] w-full bg-[#4db4ee]">
                  {/* Base texture layer */}
                  <Image 
                    src="/images/image.png" 
                    alt="Texture" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 320px"
                    className="object-cover opacity-60 mix-blend-multiply z-0"
                  />
                  
                  {/* Background Text (Default State) */}
                  <div className="absolute inset-0 z-[5] flex items-start justify-center overflow-hidden pointer-events-none opacity-40 group-hover:opacity-0 group-data-[active=true]:opacity-0 mix-blend-overlay px-4 pt-4 md:pt-6 transition-opacity duration-500">
                    <span 
                      style={{ fontFamily: "var(--font-gummy)" }} 
                      className="text-[36px] md:text-[48px] text-white/80 leading-none whitespace-nowrap tracking-wide select-none"
                    >
                      {route.destination}
                    </span>
                  </div>

                  {/* Destination image layer */}
                  {getDestinationImage(route.destination) !== "/images/image.png" && (
                    <Image 
                      src={getDestinationImage(route.destination)} 
                      alt={route.destination} 
                      fill 
                      sizes="(max-width: 768px) 100vw, 320px"
                      className="object-cover scale-100 translate-y-0 group-hover:scale-95 group-data-[active=true]:scale-95 group-hover:translate-y-6 group-data-[active=true]:translate-y-6 group-hover:opacity-70 group-data-[active=true]:opacity-70 transition-all duration-500 z-10"
                    />
                  )}

                  {/* Foreground Text (Hover State) */}
                  <div className="absolute inset-0 z-20 flex items-start justify-center overflow-hidden pointer-events-none opacity-0 group-hover:opacity-100 group-data-[active=true]:opacity-100 px-4 pt-4 md:pt-6 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0 group-data-[active=true]:translate-y-0">
                    <span 
                      style={{ fontFamily: "var(--font-gummy)" }} 
                      className="text-[36px] md:text-[48px] text-white drop-shadow-md leading-none whitespace-nowrap tracking-wide select-none"
                    >
                      {route.destination}
                    </span>
                  </div>

                  <div className="absolute bottom-[-6px] left-0 w-full z-20">
                    <svg viewBox="0 0 1200 24" preserveAspectRatio="none" className="w-full h-[12px] md:h-[16px] text-white fill-current block">
                      <path d="M0,24 L0,12 C 6.2,12.7 14.5,13.5 20.8,13.1 C 27.1,9.2 35.5,16.4 41.8,12.4 C 49.1,16.8 58.8,14.8 66.1,10.1 C 73.6,11.1 83.7,13.0 91.2,7.3 C 94.7,2.2 99.4,1.9 103.0,6.0 C 108.3,3.7 115.5,7.3 120.8,8.5 C 128.3,3.6 138.3,14.9 145.8,12.0 C 153.7,8.1 164.2,16.7 172.0,14.1 C 175.8,9.0 180.9,17.3 184.7,17.7 C 193.5,17.2 205.1,11.6 213.8,16.7 C 220.2,18.3 228.7,16.1 235.0,15.2 C 239.5,15.1 245.4,13.0 249.9,11.3 C 256.3,7.2 264.9,10.5 271.3,9.5 C 275.0,13.8 279.8,7.3 283.5,7.1 C 292.2,11.6 303.8,10.6 312.6,6.0 C 317.2,12.0 323.3,5.0 328.0,6.5 C 334.7,3.2 343.7,8.2 350.5,6.0 C 359.0,11.5 370.4,10.3 378.9,6.0 C 387.7,7.8 399.4,8.1 408.2,6.0 C 411.6,2.3 416.2,11.1 419.6,6.0 C 425.4,6.9 433.1,6.8 438.9,6.0 C 445.2,11.5 453.6,11.5 459.9,6.4 C 466.8,5.7 476.0,3.0 482.9,6.0 C 489.9,2.2 499.3,6.5 506.3,9.3 C 514.5,8.7 525.6,13.5 533.8,12.4 C 538.0,7.4 543.6,14.7 547.7,13.0 C 555.9,12.7 566.8,6.9 575.0,11.6 C 582.5,12.4 592.5,18.1 600.0,14.5 C 608.1,18.0 619.0,13.1 627.2,11.6 C 632.9,7.9 640.4,16.3 646.0,12.4 C 652.0,12.0 660.0,13.5 666.0,8.4 C 669.2,13.5 673.4,5.1 676.6,7.4 C 680.4,7.8 685.5,16.9 689.3,11.2 C 694.1,7.1 700.4,11.9 705.2,15.0 C 713.3,14.8 724.1,18.4 732.2,12.5 C 740.3,11.1 751.2,16.5 759.3,14.4 C 764.6,17.8 771.6,13.1 776.9,15.0 C 783.0,17.3 791.2,16.1 797.3,13.0 C 803.7,16.2 812.3,15.7 818.7,11.5 C 823.8,7.0 830.7,13.1 835.8,8.2 C 843.8,11.4 854.6,8.6 862.7,6.0 C 867.7,6.0 874.3,10.7 879.2,9.6 C 887.3,5.2 898.1,7.2 906.3,12.1 C 910.5,7.0 916.1,9.2 920.3,14.5 C 923.4,10.3 927.6,18.3 930.6,14.9 C 933.8,10.6 938.0,11.9 941.2,15.6 C 949.7,19.6 961.0,21.2 969.5,16.5 C 976.4,10.8 985.5,14.9 992.4,13.1 C 999.3,17.6 1008.6,16.7 1015.5,14.9 C 1022.3,15.5 1031.3,14.2 1038.0,17.8 C 1044.9,20.9 1054.1,19.8 1061.0,18.0 C 1067.4,19.6 1076.0,13.6 1082.4,16.6 C 1090.8,17.0 1101.9,18.0 1110.2,17.5 C 1118.7,20.6 1129.9,18.5 1138.3,18.0 C 1141.8,16.0 1146.3,16.7 1149.8,18.0 C 1154.2,22.9 1160.0,20.2 1164.4,14.5 C 1172.2,12.8 1182.5,10.9 1190.2,13.9 C 1194.2,18.7 1199.6,14.6 1200.0,12.0 L1200,24 Z" />
                    </svg>
                  </div>
                </div>

                {/* Card Content mimicking the poster's typographic footer */}
                <div className="px-5 py-6 md:py-8 flex flex-col flex-grow relative z-10 bg-white overflow-hidden">
                  <div className="relative w-full h-full min-h-[40px] md:min-h-[50px] flex items-center justify-center">
                    
                    {/* Default State: Origin (TO) Destination */}
                    <div className="flex items-center justify-between w-full h-full text-[#4DA6E8] font-black font-display uppercase tracking-tight absolute inset-0 pt-2 md:pt-4 transition-all duration-500 group-hover:-translate-y-8 group-data-[active=true]:-translate-y-8 group-hover:opacity-0 group-data-[active=true]:opacity-0">
                      <span className="text-[28px] md:text-[32px] leading-none">{getShortName(route.origin)}</span>
                      <span className="text-[12px] md:text-[14px] text-[#D94328] leading-none mx-2 tracking-widest translate-y-[-2px]">(TO)</span>
                      <span className="text-[28px] md:text-[32px] leading-none">{getShortName(route.destination)}</span>
                    </div>

                    {/* Hover State: Price, Duration, Operators */}
                    <div className="flex justify-between items-center w-full h-full text-[#0B3150] font-black uppercase tracking-wider leading-[1.2] absolute inset-0 pt-2 md:pt-4 translate-y-8 group-data-[active=true]:translate-y-0 opacity-0 group-data-[active=true]:opacity-100 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <div className="flex flex-col text-left text-[11px] md:text-[12px]">
                        <span className="text-[#475569]">STARTING FROM,</span>
                        <span className="text-[16px] md:text-[18px] text-[#D94328]">NPR {route.price.toLocaleString()}</span>
                      </div>
                      <div className="flex flex-col text-right text-[11px] md:text-[12px]">
                        <span className="text-[#475569]">{route.duration}</span>
                        <span className="text-[14px] md:text-[16px]">{route.operatorsCount} OPERATORS</span>
                      </div>
                    </div>

                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
    </section>
  );
}
