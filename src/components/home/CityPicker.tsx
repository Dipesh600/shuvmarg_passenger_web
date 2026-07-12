import React, { useRef, useEffect } from "react";

const CITIES = [
  "Kathmandu", "Pokhara", "Chitwan", "Lumbini", 
  "Biratnagar", "Dharan", "Butwal", "Nepalgunj", 
  "Janakpur", "Dhangadhi"
];

interface CityPickerProps {
  label: string;
  selectedCity: string;
  onSelect: (city: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  children: React.ReactNode;
}

export function CityPicker({ label, selectedCity, onSelect, isOpen, onClose, onOpen, children }: CityPickerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [isOpen, onClose]);
  
  return (
    <div className="relative" ref={containerRef}>
      <div onClick={onOpen} className="w-full h-full">
        {children}
      </div>
      
      {isOpen && (
        <>
          {/* Desktop Popover */}
          <div className="hidden md:block absolute top-[110%] left-0 z-[150] shadow-[0_12px_32px_rgba(0,0,0,0.12)] rounded-2xl border border-gray-100 bg-white w-[340px] p-4 max-h-[360px] overflow-y-auto">
             <div className="font-bold text-[16px] text-[#0B3150] font-display mb-4">Select {label} City</div>
             <div className="grid grid-cols-2 gap-2">
               {CITIES.map(city => (
                 <button
                   key={city}
                   onClick={(e) => { e.stopPropagation(); onSelect(city); onClose(); }}
                   className={`px-3 py-2 text-left rounded-xl text-[14px] font-medium transition-colors ${city === selectedCity ? 'bg-[#D94328] text-white' : 'bg-white text-[#0B3150] hover:bg-[#E8D2B0] border border-gray-100'}`}
                 >
                   {city}
                 </button>
               ))}
             </div>
          </div>
          
          {/* Mobile Bottom Sheet */}
          <div className="md:hidden fixed inset-0 z-[999] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={(e) => { e.stopPropagation(); onClose(); }} />
            <div className="relative bg-[#EED9BD] rounded-t-3xl p-6 transform transition-transform shadow-[0_-8px_30px_rgba(0,0,0,0.12)] max-h-[80vh] flex flex-col">
               <img
                  src="/images/image.png"
                  alt=""
                  aria-hidden="true"
                  className="absolute inset-0 w-full h-full object-cover pointer-events-none z-0 rounded-t-3xl"
                  style={{ mixBlendMode: 'multiply', opacity: 0.18 }}
                />
               <div className="relative z-10 flex flex-col h-full">
                 <div className="flex justify-between items-center mb-6 shrink-0">
                   <h3 className="text-xl font-bold text-[#0B3150] font-display">Select {label} City</h3>
                   <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="p-2 rounded-full hover:bg-[#E8D2B0] text-[#0B3150] transition-colors">
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                   </button>
                 </div>
                 <div className="flex-1 overflow-y-auto scrollbar-hide pb-6">
                   <div className="grid grid-cols-2 gap-3">
                     {CITIES.map(city => (
                       <button
                         key={city}
                         onClick={(e) => { e.stopPropagation(); onSelect(city); onClose(); }}
                         className={`p-4 text-left rounded-xl text-[16px] font-bold transition-colors shadow-sm ${city === selectedCity ? 'bg-[#D94328] text-white' : 'bg-white text-[#0B3150] hover:bg-[#E8D2B0]'}`}
                       >
                         {city}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
