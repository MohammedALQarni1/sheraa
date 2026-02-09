
import React, { useState } from 'react';
import { ChevronRight, Search, CheckCircle2, ChevronLeft, MapPin } from 'lucide-react';
import { CITIES } from '../constants';

interface LocationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCity: string | null;
  onSelectCity: (city: string | null) => void;
}

export const LocationOverlay: React.FC<LocationOverlayProps> = ({ 
  isOpen, 
  onClose, 
  selectedCity, 
  onSelectCity 
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const filteredCities = CITIES.filter(c => 
    c.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (city: string | null) => {
    onSelectCity(city);
    onClose();
  };

  return (
    <div className="absolute inset-0 z-[100] bg-white flex flex-col animate-in slide-in-from-right duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-4 pt-12 bg-white">
        <button onClick={onClose} className="p-2 -mr-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
           <ChevronRight size={24} strokeWidth={2} />
        </button>
        <h2 className="text-sm font-black text-gray-900">اختر المدينة</h2>
        <div className="w-8"></div> 
      </div>

      {/* Search */}
      <div className="px-4 mb-2">
        <div className="bg-gray-50 border border-gray-100 rounded-2xl h-12 flex items-center px-4 gap-2 focus-within:border-purple-200 focus-within:ring-2 focus-within:ring-purple-50 transition-all">
            <Search size={20} className="text-gray-400 stroke-[2.5]" />
            <input 
                type="text"
                placeholder="ابحث في المدن"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent w-full text-right text-sm font-medium focus:outline-none placeholder:text-gray-400 text-gray-900"
            />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-2 px-2">
        
        {/* All Cities Option */}
        <div 
            onClick={() => handleSelect(null)}
            className={`flex items-center justify-between px-4 py-4 mb-2 rounded-2xl cursor-pointer transition-colors border border-transparent ${selectedCity === null ? 'bg-purple-50 border-purple-100' : 'hover:bg-gray-50'}`}
        >
            <div className="flex items-center gap-4 flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedCity === null ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-500'}`}>
                    <MapPin size={20} />
                </div>
                <span className={`text-sm font-bold ${selectedCity === null ? 'text-purple-900' : 'text-gray-900'}`}>جميع المدن</span>
            </div>
            
            <div className="flex items-center gap-3">
                {selectedCity === null ? (
                    <div className="text-purple-600">
                        <CheckCircle2 size={22} fill="currentColor" className="text-white" />
                    </div>
                ) : (
                    <div className="text-gray-300">
                       <ChevronLeft size={20} />
                    </div>
                )}
            </div>
        </div>

        {/* Cities List */}
        {filteredCities.map((city) => {
             const isSelected = selectedCity === city;
             return (
                 <div 
                    key={city}
                    onClick={() => handleSelect(city)}
                    className={`flex items-center justify-between px-4 py-4 mb-2 rounded-2xl cursor-pointer transition-colors border border-transparent ${isSelected ? 'bg-purple-50 border-purple-100' : 'hover:bg-gray-50'}`}
                 >
                    <div className="flex items-center gap-4 flex-1">
                         {/* Simple bullet or icon for city */}
                         <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isSelected ? 'bg-purple-200 text-purple-700' : 'bg-gray-100 text-gray-400'}`}>
                            <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-purple-600' : 'bg-gray-400'}`}></div>
                         </div>
                         <span className={`text-sm font-bold ${isSelected ? 'text-purple-900' : 'text-gray-800'}`}>{city}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        {isSelected ? (
                            <div className="text-purple-600">
                                <CheckCircle2 size={22} fill="currentColor" className="text-white" />
                            </div>
                        ) : (
                            <div className="text-gray-300">
                                <ChevronLeft size={20} />
                            </div>
                        )}
                    </div>
                 </div>
             );
        })}

        {filteredCities.length === 0 && (
            <div className="text-center py-10 text-gray-400">
                لا توجد مدن مطابقة للبحث
            </div>
        )}
      </div>
    </div>
  );
};
