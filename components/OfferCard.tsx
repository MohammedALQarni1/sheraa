
import React from 'react';
import { RewardItem } from '../types';
import { Clock, Ticket, ChevronLeft } from 'lucide-react';

interface OfferCardProps {
  item: RewardItem;
  viewMode?: 'large' | 'list' | 'grid';
  onClick?: (item: RewardItem) => void;
  onScanClick?: () => void;
}

// Helper for Brand Row - Displays Logo and Name together
const BrandRow = ({ logo, name, color = "text-gray-900" }: { logo: string, name: string, color?: string }) => (
  <div className="flex items-center gap-2 mb-2">
    <div className="w-6 h-6 rounded-full border border-gray-100 p-0.5 bg-white shadow-sm shrink-0 overflow-hidden">
      <img src={logo} alt={name} className="w-full h-full object-contain rounded-full" />
    </div>
    <span className={`text-[10px] font-bold ${color} truncate`}>{name}</span>
  </div>
);

export const OfferCard: React.FC<OfferCardProps> = ({ item, viewMode = 'large', onClick, onScanClick }) => {
  
  // --- GRID VIEW (Compact 2-Column) ---
  if (viewMode === 'grid') {
      return (
        <div 
            onClick={() => onClick?.(item)}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all active:scale-[0.98] flex flex-col h-full"
        >
            {/* Image (Square-ish) */}
            <div className="aspect-[1.1/1] relative bg-gray-100 overflow-hidden">
                <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col flex-1">
                {/* Brand Row - Visible Next to Title */}
                <BrandRow logo={item.brandLogo} name={item.brandName} />

                <h3 className="text-gray-900 font-extrabold text-xs leading-tight mb-2 line-clamp-2 h-8">
                    {item.title}
                </h3>
                
                <div className="mt-auto pt-2 border-t border-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-1 bg-[#6463C7]/10 px-1.5 py-0.5 rounded text-[#6463C7]">
                        <span className="text-xs font-black dir-ltr">{item.pointsCost}</span>
                        <span className="text-[8px] font-bold">نقطة</span>
                    </div>
                    {item.discountPercentage > 0 && (
                        <span className="text-[9px] font-bold text-red-500 bg-red-50 px-1.5 py-0.5 rounded dir-ltr">
                            {item.discountPercentage}% OFF
                        </span>
                    )}
                </div>
            </div>
        </div>
      );
  }

  // --- LIST VIEW (Horizontal) ---
  if (viewMode === 'list') {
    return (
      <div 
        onClick={() => onClick?.(item)}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-md transition-all active:scale-[0.99] flex h-28"
      >
        {/* Image Section (Small on Right) */}
        <div className="w-28 h-full relative bg-gray-200 shrink-0">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        {/* Content Section */}
        <div className="flex-1 p-3 flex flex-col justify-between relative">
            <div>
              <div className="pl-6">
                  {/* Brand Row at Top */}
                  <BrandRow logo={item.brandLogo} name={item.brandName} />
                  
                  <h3 className="text-gray-900 font-extrabold text-xs leading-snug line-clamp-2 ml-1 mt-1">
                      {item.title}
                  </h3>
              </div>
            </div>

            <div className="flex items-end justify-between w-full">
                {/* Points Highlighted */}
                <div className="flex items-center gap-1 bg-[#6463C7] text-white px-2.5 py-1 rounded-lg shadow-sm shadow-[#6463C7]/20">
                    <span className="font-black text-xs dir-ltr">{item.pointsCost}</span>
                    <span className="text-[9px] font-medium opacity-90">نقطة</span>
                    <Ticket size={10} className="text-white/80" />
                </div>
                
                {/* Arrow */}
                <div className="bg-gray-50 rounded-full p-1 text-gray-300 group-hover:bg-[#6463C7] group-hover:text-white transition-colors absolute left-3 top-1/2 -translate-y-1/2">
                    <ChevronLeft size={16} />
                </div>
            </div>
        </div>
      </div>
    );
  }

  // --- LARGE CARD VIEW (Default) ---
  return (
    <div 
        onClick={() => onClick?.(item)}
        className="bg-white rounded-[1.5rem] overflow-hidden shadow-sm border border-gray-100 group cursor-pointer hover:shadow-lg transition-all active:scale-[0.99] relative"
    >
      
      {/* Image Section */}
      <div className="h-44 relative overflow-hidden bg-gray-200">
        <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
        
        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90"></div>

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
             {/* Brand Row - White Text */}
             <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full border-2 border-white/20 p-0.5 bg-white shadow-md shrink-0 overflow-hidden">
                  <img src={item.brandLogo} alt={item.brandName} className="w-full h-full object-contain rounded-full" />
                </div>
                <span className="text-xs font-bold text-white shadow-black/50 drop-shadow-md">{item.brandName}</span>
                
                {item.programName && (
                    <span className="text-[9px] font-bold text-white/80 bg-white/10 backdrop-blur-md px-2 py-0.5 rounded-md border border-white/20 mr-auto">
                        {item.programName}
                    </span>
                )}
             </div>

             <h3 className="text-white font-black text-lg leading-tight shadow-black/50 drop-shadow-sm mb-1">
                {item.title}
             </h3>
        </div>
      </div>

      {/* Footer Details */}
      <div className="p-3 flex items-center justify-between bg-white">
         
         <div className="flex items-center gap-1.5">
             <div className="flex items-center gap-1 text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">
                 <Clock size={12} className="text-red-400" />
                 <span>ينتهي {item.expiryDate}</span>
             </div>
         </div>

         {/* Points Button - Very Prominent */}
         <button className="bg-[#6463C7] text-white px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-[#6463C7]/20 group-hover:bg-[#5352a3] transition-colors">
             <span className="font-black text-sm dir-ltr">{item.pointsCost}</span>
             <span className="text-[10px] font-medium opacity-90">نقطة</span>
             <Ticket size={12} className="fill-white/20" />
         </button>

      </div>
    </div>
  );
};
