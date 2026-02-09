
import React from 'react';
import { Grid2X2, MapPinned, ListFilter } from 'lucide-react';
import { CATEGORIES } from '../constants';

interface FilterBarProps {
    selectedCategoryId: string | null;
    onCategoryClick: () => void;
    selectedCity: string | null;
    onLocationClick: () => void;
    onFilterClick: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  selectedCategoryId, 
  onCategoryClick,
  selectedCity,
  onLocationClick,
  onFilterClick
}) => {
  
  const selectedCategoryName = selectedCategoryId 
    ? CATEGORIES.find(c => c.id === selectedCategoryId)?.name 
    : 'جميع الأقسام';

  const selectedCityName = selectedCity || 'جميع المدن';

  return (
    <div className="bg-white py-3.5 px-3 flex items-center justify-between text-[11px] font-bold text-gray-500 border-b border-gray-100 shadow-sm tracking-wide">
      
      {/* Category - Flex 1 for equal width */}
      <div 
        onClick={onCategoryClick}
        className={`flex-1 flex items-center justify-center gap-1.5 cursor-pointer transition-colors border-l border-gray-100 ${selectedCategoryId ? 'text-purple-600' : 'hover:text-purple-600'}`}
      >
        <Grid2X2 size={16} strokeWidth={2.5} />
        <span className="truncate max-w-[80px] text-center pt-0.5">{selectedCategoryName}</span>
      </div>

      {/* Location - Flex 1 for equal width */}
      <div 
        onClick={onLocationClick}
        className={`flex-1 flex items-center justify-center gap-1.5 cursor-pointer transition-colors border-l border-gray-100 ${selectedCity ? 'text-purple-600' : 'hover:text-purple-600'}`}
      >
        <MapPinned size={16} strokeWidth={2.5} />
        <span className="truncate max-w-[80px] text-center pt-0.5">{selectedCityName}</span>
      </div>

      {/* Filter - Flex 1 for equal width */}
      <div 
        onClick={onFilterClick}
        className="flex-1 flex items-center justify-center gap-1.5 cursor-pointer hover:text-purple-600 transition-colors"
      >
        <ListFilter size={16} strokeWidth={2.5} />
        <span className="pt-0.5">فلترة</span>
      </div>

    </div>
  );
};
