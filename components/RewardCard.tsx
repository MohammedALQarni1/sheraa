
import React from 'react';
import { RewardItem } from '../types';
import { Ticket, Sparkles, Gift } from 'lucide-react';

interface RewardCardProps {
  item: RewardItem;
  onClick?: (item: RewardItem) => void;
}

export const RewardCard: React.FC<RewardCardProps> = ({ item, onClick }) => {
  return (
    <div 
        onClick={() => onClick?.(item)}
        className="relative group overflow-hidden rounded-2xl bg-white transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer border border-purple-100"
    >
      
      {/* Background Pattern (Subtle Dots) */}
      <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(#6d28d9_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none"></div>
      
      {/* Gradient Stroke Effect on Left Side */}
      <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-400 via-pink-400 to-orange-400"></div>

      <div className="relative flex p-3 gap-3">
        
        {/* Right: Image Section (Thumbnail) */}
        <div className="w-28 h-28 shrink-0 rounded-xl overflow-hidden relative shadow-sm border border-gray-100">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          
          {/* Discount Tag Overlay */}
          <div className="absolute top-0 right-0 bg-red-500/90 backdrop-blur-sm text-white rounded-bl-xl px-2 py-0.5 shadow-sm z-10">
               <span className="text-[10px] font-bold dir-ltr">
                  {item.discountPercentage > 0 ? `${item.discountPercentage}% OFF` : 'GIFT'}
               </span>
          </div>

           {/* Brand Logo floating at bottom */}
           <div className="absolute -bottom-1 -left-1 w-8 h-8 bg-white rounded-lg p-0.5 shadow-md flex items-center justify-center border border-gray-50">
               <img src={item.brandLogo} alt={item.brandName} className="w-full h-full object-contain rounded-md" />
           </div>
        </div>

        {/* Left: Content Section */}
        <div className="flex-1 flex flex-col justify-between py-0.5 pl-1">
            
            {/* Header: Loyalty Badge & Brand Name */}
            <div>
                <div className="flex justify-between items-start mb-1.5">
                     <span className="text-[10px] font-bold text-gray-500 flex items-center gap-1">
                        {item.brandName}
                     </span>
                     
                     {/* Distinct Loyalty Badge */}
                     <div className="flex items-center gap-1 bg-gradient-to-r from-purple-100 to-pink-50 border border-purple-100 text-purple-700 px-2 py-0.5 rounded-full shadow-sm">
                         <Sparkles size={10} className="fill-purple-300" />
                         <span className="text-[9px] font-bold tracking-tight">مكافأة ولاء</span>
                     </div>
                </div>

                <h3 className="text-gray-900 font-extrabold text-sm leading-tight line-clamp-2 mb-1">
                    {item.title}
                </h3>
            </div>

            {/* Footer: Points Action Button */}
            <div className="flex items-end justify-between mt-2">
                 {/* Category Label */}
                 <div className="bg-gray-50 text-gray-400 text-[9px] px-2 py-1 rounded-md border border-gray-100 font-medium">
                    {item.category === 'restaurants' ? 'مطاعم' : item.category === 'shopping' ? 'تسوق' : item.category}
                 </div>

                 {/* Points Button - Color Updated to #6463C7 */}
                 <button className="flex items-center gap-1.5 bg-[#6463C7] text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md shadow-purple-200 active:scale-95 transition-transform group-hover:bg-[#5352a3]">
                    <span>{item.pointsCost}</span>
                    <span className="text-[10px] opacity-80 font-normal">نقطة</span>
                    <Ticket size={12} className="rotate-[-10deg]" />
                 </button>
            </div>
        </div>
      </div>
      
      {/* Decorative Circles (Ticket Cutout Effect) */}
      <div className="absolute top-1/2 -left-1.5 w-3 h-3 bg-[#f3f4f6] rounded-full"></div>
      <div className="absolute top-1/2 -right-1.5 w-3 h-3 bg-[#f3f4f6] rounded-full z-20"></div>

    </div>
  );
};
