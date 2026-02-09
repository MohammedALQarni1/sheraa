
import React, { useState } from 'react';
import { AdItem } from '../types';
import { Crown, Sparkles, MapPin, Clock, BadgeCheck } from 'lucide-react';

interface AdCardProps {
  item: AdItem;
  onClick?: (item: AdItem) => void;
  viewMode?: 'list' | 'grid';
}

// Custom Gray Logo Placeholder (Matches App Logo Structure)
const PlaceholderLogo = () => (
  <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50">
    <svg viewBox="0 0 110 85" className="w-[40%] h-[40%] text-gray-300" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        {/* Three Dots */}
        <circle cx="25" cy="15" r="10" />
        <circle cx="55" cy="15" r="10" />
        <circle cx="85" cy="15" r="10" />
        {/* M Shape / Zigzag */}
        <path d="M15 50 L 35 80 L 55 55 L 75 80 L 95 50" stroke="currentColor" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  </div>
);

// Custom Saudi Riyal Icon from provided SVG
const SaudiRiyalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 54 60" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M25.333,60 C18.663,59.398 12.013,58.531 5.378,57.375 C1.777,56.748 0.054,54.812 0.007,51.152 C-0.035,47.881 1.637,45.896 4.904,45.326 C11.332,44.205 17.778,43.167 24.223,42.128 C24.577,42.071 24.945,42.074 25.590,42.074 C25.405,40.730 25.263,39.569 25.086,38.414 C23.943,38.563 22.929,38.749 21.926,38.803 C18.236,38.999 14.542,39.183 10.849,39.317 C7.043,39.454 4.354,37.388 3.524,33.670 C2.686,29.919 4.757,26.968 8.441,26.113 C12.834,25.093 17.291,24.341 21.724,23.490 C22.697,23.303 23.684,23.176 24.896,22.985 C25.035,21.848 25.148,20.848 25.308,19.862 C26.749,10.970 28.219,2.086 29.610,0.063 C29.742,0.046 29.873,0.029 30.005,0.012 C30.686,1.968 31.439,3.906 32.023,5.875 C32.747,8.312 33.310,10.793 34.004,13.238 C34.505,15.006 34.453,15.228 32.748,15.711 C28.983,16.779 28.566,17.200 29.626,20.941 C29.761,21.419 29.874,21.905 30.015,22.483 C30.938,22.257 31.737,21.992 32.502,21.854 C38.649,20.738 44.786,19.578 50.938,18.498 C53.961,17.968 54.407,19.380 54.671,21.758 C54.915,23.962 53.606,25.564 50.418,26.111 C44.502,27.126 38.583,28.125 32.658,29.096 C31.841,29.229 31.009,29.284 29.972,29.390 C29.818,30.342 29.680,31.111 29.563,31.884 C29.400,32.964 29.248,34.047 29.053,35.120 C28.847,36.262 29.351,36.720 30.402,36.568 C35.794,35.789 41.178,34.966 46.574,34.218 C49.888,33.759 52.339,34.980 53.488,38.163 C54.664,41.423 52.880,44.204 49.349,44.766 C43.765,45.655 38.176,46.527 32.576,47.339 C31.705,47.465 30.812,47.469 29.740,47.538 C29.553,48.747 29.392,49.882 29.256,51.021 C28.834,54.551 28.468,58.093 28.003,61.619 C27.970,61.870 27.755,62.091 27.534,62.331 C26.740,61.597 25.932,60.878 25.333,60 Z" />
    <path d="M37.364,0 C43.376,0.301 44.576,3.649 42.639,9.456 C41.027,14.288 39.385,19.112 37.747,23.937 C37.662,23.921 37.576,23.906 37.490,23.890 C37.910,21.050 38.330,18.210 38.755,15.340 C38.328,15.405 37.957,15.426 37.595,15.517 C35.437,16.059 34.697,15.308 35.197,13.159 C35.918,10.054 36.602,6.940 37.364,0 Z" />
    <path d="M19.141,60 C17.378,57.065 19.336,53.425 22.843,53.229 C24.167,53.155 25.101,53.791 25.263,55.034 C25.688,58.303 26.155,61.564 26.655,65 L19.141,60 Z" />
    <path d="M32.062,94.975 C32.965,92.203 33.743,89.508 34.646,86.852 C37.951,87.051 40.540,88.423 42.122,91.314 C38.749,92.569 35.425,93.731 32.062,94.975 Z" />
  </svg>
);

// Extracted Component
const PriceTag = ({ price, isGrid = false }: { price: number, isGrid?: boolean }) => {
    // Grid view: Larger font, original text layout
    if (isGrid) {
      return (
          <div className="flex items-center gap-1 font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 text-sm">
              <span className="text-lg leading-none mt-0.5">{price}</span>
              <span className="text-[9px] font-bold text-[#6d28d9] leading-none">ر.س</span>
          </div>
      );
    }
    
    // List view: Small font (matches user name), Icon instead of text
    return (
      <div className="flex items-center gap-1 font-black text-gray-900 bg-gray-50 px-2 py-1 rounded-lg border border-gray-100 text-[10px]">
          <span className="leading-none mt-0.5">{price}</span>
          <SaudiRiyalIcon className="w-3 h-3 text-[#6d28d9]" />
      </div>
    );
};

export const AdCard: React.FC<AdCardProps> = ({ item, onClick, viewMode = 'list' }) => {
  const [imageError, setImageError] = useState(false);

  // Determine Card Style Border
  let containerStyle = "border-gray-50";
  if (item.isVIP) {
      containerStyle = "border-transparent bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 p-[1.5px]"; 
  } else if (item.isFeatured) {
      containerStyle = "border-yellow-400 ring-1 ring-yellow-400/20";
  }

  // --- Grid View Render (Large Images) ---
  const GridViewContent = () => (
      <div className={`bg-white rounded-xl overflow-hidden shadow-sm h-full flex flex-col relative group ${!item.isVIP ? containerStyle + " border" : ""}`}>
          
          {/* Badges */}
          {item.isVIP && (
            <div className="absolute top-2 right-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm flex items-center gap-1">
                <Sparkles size={8} fill="currentColor" />
                <span>VIP</span>
            </div>
          )}
          {item.isFeatured && !item.isVIP && (
            <div className="absolute top-2 right-2 z-10 bg-yellow-400 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-sm shadow-sm flex items-center gap-1">
                <Crown size={8} fill="currentColor" />
                <span>مميز</span>
            </div>
          )}

          {/* Large Image - Square-ish with minimal rounding */}
          <div className="aspect-[1/1] bg-gray-100 relative overflow-hidden">
             {imageError || !item.image ? (
                <PlaceholderLogo />
             ) : (
                <img 
                    src={item.image} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={() => setImageError(true)}
                />
             )}
             
             {/* Price Overlay on Image for Grid View */}
             <div className="absolute bottom-2 left-2 shadow-sm">
                 <PriceTag price={item.price} isGrid={true} />
             </div>
          </div>

          {/* Content */}
          <div className="p-3 flex flex-col flex-1">
              {/* User Row (Avatar + Name + Time) */}
              <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 overflow-hidden">
                      <img src={item.user.avatar} alt={item.user.name} className="w-7 h-7 rounded-full object-cover border border-gray-100 shrink-0" />
                      <div className="flex items-center gap-1 overflow-hidden">
                          <span className="text-[10px] text-gray-500 font-bold truncate">{item.user.name}</span>
                          {/* Verified Badge Logic */}
                          {item.user.role === 'store' && (
                              <BadgeCheck size={12} className="text-blue-500 fill-blue-50 shrink-0" />
                          )}
                      </div>
                  </div>
                  <span className="text-[9px] text-gray-300 font-medium shrink-0 flex items-center gap-0.5">
                      <Clock size={8} />
                      {item.postedTime}
                  </span>
              </div>

              {/* Title */}
              <h3 className="text-gray-900 font-extrabold text-[11px] mb-2 leading-relaxed line-clamp-2 ml-1 text-right">
                  {item.title}
              </h3>
              
              {/* Location at bottom */}
              <div className="mt-auto pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                      <MapPin size={10} />
                      <span className="truncate">{item.location}</span>
                  </div>
              </div>
          </div>
      </div>
  );


  // --- List View Render (Updated Layout) ---
  const ListViewContent = () => (
    <div className={`bg-white rounded-xl p-2.5 shadow-sm flex gap-3 h-32 w-full relative group ${!item.isVIP ? containerStyle + " border" : ""}`}>
      
      {/* VIP Badge */}
      {item.isVIP && (
        <div className="absolute top-2 left-2 z-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Sparkles size={10} fill="currentColor" />
            <span>VIP</span>
        </div>
      )}

      {/* Featured Badge */}
      {item.isFeatured && !item.isVIP && (
        <div className="absolute top-2 left-2 z-10 bg-yellow-400 text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-sm flex items-center gap-1">
            <Crown size={10} fill="currentColor" />
            <span>مميز</span>
        </div>
      )}

      {/* Image Container - Square, Minimal Rounding */}
      <div className="w-28 h-full shrink-0 rounded-md overflow-hidden relative bg-gray-100 border border-gray-50">
        {imageError || !item.image ? (
            <PlaceholderLogo />
        ) : (
            <img 
                src={item.image} 
                alt={item.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                onError={() => setImageError(true)}
            />
        )}
      </div>

      {/* Content - Left Side */}
      <div className="flex-1 flex flex-col justify-between h-full py-0.5 relative text-right pl-1">
        
        {/* Top: Title */}
        <h3 className="text-gray-900 font-extrabold text-xs leading-relaxed pl-8 line-clamp-2">
            {item.title}
        </h3>
        
        {/* Middle: User & Time - Centered vertically in available space with added spacing from title */}
        <div className="flex items-center justify-between w-full my-auto pt-1">
            {/* User Info (Right) */}
            <div className="flex items-center gap-2">
                <img 
                    src={item.user.avatar} 
                    alt={item.user.name} 
                    className="w-7 h-7 rounded-full object-cover border border-gray-100" 
                />
                <div className="flex items-center gap-1 max-w-[80px]">
                    <span className="text-[10px] text-gray-600 font-bold truncate">
                        {item.user.name}
                    </span>
                    {/* Verified Badge Logic */}
                    {item.user.role === 'store' && (
                        <BadgeCheck size={12} className="text-blue-500 fill-blue-50 shrink-0" />
                    )}
                </div>
            </div>

            {/* Time (Left of user/store) */}
            <div className="flex items-center gap-1 text-[9px] text-gray-400 font-medium bg-gray-50 px-1.5 py-0.5 rounded-md">
                <Clock size={10} />
                <span>{item.postedTime}</span>
            </div>
        </div>

        {/* Footer: Location & Price - Pushed to bottom */}
        <div className="flex justify-between items-center w-full pt-2 border-t border-gray-50/50">
           
           {/* Location (New Position: Bottom Right) */}
           <div className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                <MapPin size={12} className="text-gray-300" />
                <span>{item.location}</span>
           </div>

           {/* Price (New Design - Smaller Font + Icon) */}
           <PriceTag price={item.price} isGrid={false} />

        </div>

      </div>
    </div>
  );

  // Wrapper Logic
  if (item.isVIP) {
      return (
          <div onClick={() => onClick?.(item)} className={`${containerStyle} rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] transition-transform h-full`}>
              {viewMode === 'grid' ? <GridViewContent /> : <ListViewContent />}
          </div>
      );
  }

  // Normal wrapper
  return (
    <div 
        onClick={() => onClick?.(item)}
        className={`hover:shadow-md transition-shadow cursor-pointer active:scale-[0.99] transition-transform h-full`}
    >
        {viewMode === 'grid' ? <GridViewContent /> : <ListViewContent />}
    </div>
  );
};
