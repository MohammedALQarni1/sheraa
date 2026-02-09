
import React from 'react';
import { AdItem } from '../types';
import { MapPin, Crown } from 'lucide-react';

interface FeaturedAdCardProps {
  item: AdItem;
  onClick?: (item: AdItem) => void;
}

export const FeaturedAdCard: React.FC<FeaturedAdCardProps> = ({ item, onClick }) => {
  return (
    <div 
        onClick={() => onClick?.(item)}
        className="min-w-[180px] w-[180px] bg-white rounded-2xl shadow-sm border border-yellow-100 overflow-hidden relative cursor-pointer group active:scale-[0.98] transition-all hover:shadow-md"
    >
      {/* Featured Badge */}
      <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
         <Crown size={12} fill="currentColor" />
         <span>مميز</span>
      </div>

      {/* Image */}
      <div className="h-32 bg-gray-100 relative">
         <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
         <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-3 text-right">
         <h3 className="text-gray-900 font-bold text-sm leading-tight mb-2 line-clamp-1">{item.title}</h3>
         
         <div className="flex justify-between items-end">
             {/* Location */}
             <div className="flex items-center gap-1 text-gray-400 text-[10px]">
                 <MapPin size={10} />
                 <span className="truncate max-w-[60px]">{item.location}</span>
             </div>

             {/* Price */}
             <div className="font-black text-[#6d28d9] text-sm dir-ltr flex items-end gap-1">
                 <span>{item.price}</span>
                 <span className="text-[9px] font-medium pb-0.5">{item.currency}</span>
             </div>
         </div>
      </div>
    </div>
  );
};
