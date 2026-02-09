import React, { useState, useMemo, useEffect } from 'react';
import { ArrowRight, Search, XCircle, Clock, MapPin, AlertCircle } from 'lucide-react';
import { FEED_ITEMS } from '../constants';
import { AdCard } from './AdCard';
import { RewardCard } from './RewardCard';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchOverlay: React.FC<SearchOverlayProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  // Handle animation for mounting/unmounting
  useEffect(() => {
    if (isOpen) setIsAnimating(true);
    else setTimeout(() => setIsAnimating(false), 300);
  }, [isOpen]);

  // Filter Logic per Spec 1.3 (Title, Brand, User Name)
  const results = useMemo(() => {
    if (query.length < 2) return [];
    
    const lowerQuery = query.toLowerCase();
    return FEED_ITEMS.filter(item => {
       const titleMatch = item.title.toLowerCase().includes(lowerQuery);
       
       let secondaryMatch = false;
       if (item.type === 'ad') {
         secondaryMatch = item.user.name.toLowerCase().includes(lowerQuery);
       } else if (item.type === 'reward') {
         secondaryMatch = item.brandName.toLowerCase().includes(lowerQuery);
       }

       return titleMatch || secondaryMatch;
    });
  }, [query]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div className={`absolute inset-0 z-[100] bg-gray-50 flex flex-col transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      
      {/* Header Area */}
      <div className="bg-white shadow-sm px-4 pt-12 pb-4 flex items-center gap-3">
        <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
            <ArrowRight size={24} />
        </button>
        
        <div className="flex-1 relative">
            <input 
                autoFocus={isOpen}
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="ابحث عن إعلانات أو عروض..." 
                className="w-full bg-gray-100 rounded-xl py-3 pr-10 pl-10 text-right text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            {query.length > 0 && (
                <button onClick={() => setQuery('')} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <XCircle size={18} className="fill-gray-200 text-gray-500" />
                </button>
            )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 no-scrollbar">
        
        {/* State: Empty / Recent Searches */}
        {query.length === 0 && (
            <div className="mt-4">
                <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">عمليات البحث السابقة</h3>
                <div className="flex flex-wrap gap-2">
                    {['سماعات ابل', 'كوبون خصم', 'سيارات'].map((tag) => (
                        <button key={tag} onClick={() => setQuery(tag)} className="flex items-center gap-2 bg-white px-4 py-2 rounded-full border border-gray-100 text-gray-600 text-sm shadow-sm">
                            <Clock size={14} className="text-gray-400" />
                            {tag}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* State: Short Input */}
        {query.length > 0 && query.length < 2 && (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                <AlertCircle size={48} className="mb-4 opacity-50" />
                <p>اكتب حرفين على الأقل للبحث</p>
            </div>
        )}

        {/* State: Results */}
        {query.length >= 2 && (
            <div className="space-y-4 pb-20">
                <div className="flex justify-between items-center px-1">
                    <span className="text-sm font-bold text-gray-900">النتائج ({results.length})</span>
                    {/* Mock Filter for spec 1.1.6 connection */}
                    <button className="text-xs text-purple-600 font-medium">تصفية النتائج</button>
                </div>

                {results.length === 0 ? (
                     // State: No Results
                    <div className="flex flex-col items-center justify-center pt-20 text-gray-500">
                        <Search size={64} className="mb-4 text-gray-200" />
                        <h3 className="font-bold text-lg text-gray-700">لا توجد نتائج مطابقة</h3>
                        <p className="text-sm mt-2 text-center max-w-xs">جرب كلمات مختلفة أو تحقق من الأخطاء الإملائية</p>
                    </div>
                ) : (
                    // List Results
                    <div className="flex flex-col gap-3">
                        {results.map(item => (
                            item.type === 'reward' ? 
                            <RewardCard key={item.id} item={item} /> : 
                            <AdCard key={item.id} item={item} />
                        ))}
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};