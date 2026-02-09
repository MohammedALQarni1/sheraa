
import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';

interface FilterOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategoryName?: string;
  selectedCityName?: string;
  onOpenCategory: () => void;
  onOpenCity: () => void;
}

export const FilterOverlay: React.FC<FilterOverlayProps> = ({ 
  isOpen, 
  onClose,
  selectedCategoryName,
  selectedCityName,
  onOpenCategory,
  onOpenCity
}) => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'lowest' | 'highest'>('newest');
  
  // Toggle States
  const [favorites, setFavorites] = useState(false);
  const [hasImages, setHasImages] = useState(false);
  const [isVIP, setIsVIP] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);

  if (!isOpen) return null;

  const handleReset = () => {
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
    setFavorites(false);
    setHasImages(false);
    setIsVIP(false);
    setIsFeatured(false);
  };

  const ToggleRow = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: (v: boolean) => void }) => (
    <div className="flex items-center justify-between py-4 border-b border-gray-50 last:border-0 cursor-pointer" onClick={() => onChange(!checked)}>
      <span className="text-gray-900 font-bold text-sm">{label}</span>
      <div 
        className={`w-12 h-7 flex items-center rounded-full p-1 transition-colors duration-300 ${checked ? 'bg-purple-600' : 'bg-gray-200'}`}
      >
        <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${checked ? '-translate-x-5' : 'translate-x-0'}`}></div>
      </div>
    </div>
  );

  return (
    <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-12 bg-white mb-2">
        <button onClick={onClose} className="p-2 -mr-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
           <ChevronRight size={24} strokeWidth={2} />
        </button>
        <h2 className="text-sm font-black text-gray-900">فلترة</h2>
        <div className="w-8"></div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-5 pb-24">
        
        {/* Selectors Section */}
        <div className="space-y-1 mb-6">
            {/* Category */}
            <div onClick={onOpenCategory} className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group">
                <div className="flex items-center justify-between flex-1 pl-4">
                    <span className="text-gray-900 font-bold text-sm">الفئة</span>
                    <span className="text-purple-600 font-medium text-sm">{selectedCategoryName || 'جميع الأقسام'}</span>
                </div>
                <div className="text-gray-300 group-hover:text-purple-600 transition-colors">
                    <ChevronLeft size={20} />
                </div>
            </div>

            {/* City */}
            <div onClick={onOpenCity} className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group">
                <div className="flex items-center justify-between flex-1 pl-4">
                    <span className="text-gray-900 font-bold text-sm">المدينة</span>
                    <span className="text-purple-600 font-medium text-sm">{selectedCityName || 'جميع المدن'}</span>
                </div>
                <div className="text-gray-300 group-hover:text-purple-600 transition-colors">
                    <ChevronLeft size={20} />
                </div>
            </div>

            {/* Region (Static) */}
            <div className="flex items-center justify-between py-4 border-b border-gray-100 cursor-pointer group">
                <div className="flex items-center justify-between flex-1 pl-4">
                    <span className="text-gray-900 font-bold text-sm">المنطقة / الحي</span>
                    <span className="text-gray-400 text-sm">جميع المناطق</span>
                </div>
                <div className="text-gray-300 group-hover:text-purple-600 transition-colors">
                    <ChevronLeft size={20} />
                </div>
            </div>
        </div>

        {/* Price Range Section */}
        <div className="mb-8">
            <div className="flex justify-between mb-2 px-1">
                <span className="text-sm font-bold text-gray-900">نطاق السعر</span>
            </div>
            <div className="flex gap-4 items-center">
                <div className="flex-1 relative">
                    <input 
                        type="number" 
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                        placeholder="من"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-center text-gray-900 font-bold focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                    />
                </div>
                <div className="flex-1 relative">
                    <input 
                        type="number" 
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                        placeholder="إلى"
                        className="w-full bg-gray-50 border border-gray-100 rounded-xl py-3 px-4 text-center text-gray-900 font-bold focus:outline-none focus:border-purple-400 focus:bg-white transition-colors"
                    />
                </div>
                <span className="text-gray-800 font-bold text-sm shrink-0">ريال</span>
            </div>
        </div>

        {/* Sorting Section */}
        <div className="mb-8">
            <h3 className="text-right font-bold text-gray-900 mb-3">ترتيب حسب</h3>
            <div className="bg-gray-50 rounded-xl p-1 flex">
                 <button 
                    onClick={() => setSortBy('lowest')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${sortBy === 'lowest' ? 'bg-white shadow-sm text-purple-700 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    الأقل سعرا
                 </button>
                 <button 
                    onClick={() => setSortBy('highest')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${sortBy === 'highest' ? 'bg-white shadow-sm text-purple-700 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    الأكثر سعرا
                 </button>
                 <button 
                    onClick={() => setSortBy('newest')}
                    className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${sortBy === 'newest' ? 'bg-white shadow-sm text-purple-700 ring-1 ring-black/5' : 'text-gray-400 hover:text-gray-600'}`}
                 >
                    الاحدث
                 </button>
            </div>
        </div>

        {/* Other Options Toggles */}
        <div className="mb-4">
            <h3 className="text-right font-bold text-gray-900 mb-2">خيارات أخرى</h3>
            <div className="flex flex-col">
                <ToggleRow label="الاعلانات المفضلة" checked={favorites} onChange={setFavorites} />
                <ToggleRow label="الاعلانات المرفق معها صور" checked={hasImages} onChange={setHasImages} />
                <ToggleRow label="الاعلانات VIP" checked={isVIP} onChange={setIsVIP} />
                <ToggleRow label="الاعلانات المميزة" checked={isFeatured} onChange={setIsFeatured} />
            </div>
        </div>

      </div>

      {/* Footer Buttons */}
      <div className="absolute bottom-0 left-0 right-0 p-5 bg-white border-t border-gray-100 flex gap-4 z-10">
         <button 
            onClick={handleReset}
            className="flex-1 py-3.5 rounded-xl border border-purple-200 text-purple-600 font-bold text-sm hover:bg-purple-50 transition-colors"
         >
            تفريغ الحقول
         </button>
         <button 
            onClick={onClose}
            className="flex-[2] py-3.5 rounded-xl bg-purple-600 text-white font-bold text-sm hover:bg-purple-700 transition-colors shadow-lg shadow-purple-200"
         >
            عرض النتائج
         </button>
      </div>

    </div>
  );
};
