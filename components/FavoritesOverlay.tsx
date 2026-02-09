
import React, { useState, useMemo } from 'react';
import { ChevronRight, Heart, ShoppingBag, LayoutGrid, Search, AlertCircle } from 'lucide-react';
import { AdItem, RewardItem } from '../types';
import { FEED_ITEMS, OFFER_ITEMS } from '../constants';
import { AdCard } from './AdCard';
import { OfferCard } from './OfferCard';

interface FavoritesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAdClick?: (ad: AdItem) => void;
  onOfferClick?: (offer: RewardItem) => void;
}

export const FavoritesOverlay: React.FC<FavoritesOverlayProps> = ({ 
    isOpen, 
    onClose, 
    onAdClick,
    onOfferClick 
}) => {
  const [activeTab, setActiveTab] = useState<'ads' | 'offers'>('ads');

  // Mock Favorites Data (Simulating a subset of existing items)
  const favoriteAds = useMemo(() => {
      // Pick first 4 ads as mock favorites
      return FEED_ITEMS.filter(i => i.type === 'ad').slice(0, 4) as AdItem[];
  }, []);

  const favoriteOffers = useMemo(() => {
      // Pick first 4 offers as mock favorites
      return OFFER_ITEMS.slice(0, 4);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-right duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
              <ChevronRight size={24} />
          </button>
          <h2 className="text-lg font-black text-gray-900">المفضلة</h2>
          <div className="w-10"></div>
      </div>

      {/* Tabs */}
      <div className="px-6 mt-6 mb-4">
          <div className="bg-white p-1.5 rounded-2xl flex shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveTab('ads')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'ads' 
                    ? 'bg-[#6463C7] text-white shadow-md shadow-purple-200' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  <LayoutGrid size={16} />
                  <span>الإعلانات ({favoriteAds.length})</span>
              </button>
              <button 
                onClick={() => setActiveTab('offers')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'offers' 
                    ? 'bg-[#6463C7] text-white shadow-md shadow-purple-200' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  <ShoppingBag size={16} />
                  <span>العروض ({favoriteOffers.length})</span>
              </button>
          </div>
      </div>

      {/* Content List */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-24">
          
          {/* ADS TAB */}
          {activeTab === 'ads' && (
              <div className="grid grid-cols-2 gap-3">
                  {favoriteAds.length > 0 ? (
                      favoriteAds.map((ad) => (
                          <div key={ad.id} className="relative group">
                              <AdCard 
                                  item={ad} 
                                  viewMode="grid" 
                                  onClick={onAdClick} 
                              />
                              <button className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform z-20">
                                  <Heart size={14} fill="currentColor" />
                              </button>
                          </div>
                      ))
                  ) : (
                      <EmptyState label="لا توجد إعلانات في المفضلة" />
                  )}
              </div>
          )}

          {/* OFFERS TAB */}
          {activeTab === 'offers' && (
              <div className="grid grid-cols-2 gap-3">
                  {favoriteOffers.length > 0 ? (
                      favoriteOffers.map((offer) => (
                          <div key={offer.id} className="relative group">
                              <OfferCard 
                                  item={offer} 
                                  viewMode="grid" 
                                  onClick={onOfferClick} 
                              />
                              <button className="absolute top-2 left-2 w-7 h-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-red-500 shadow-sm active:scale-90 transition-transform z-20">
                                  <Heart size={14} fill="currentColor" />
                              </button>
                          </div>
                      ))
                  ) : (
                      <EmptyState label="لا توجد عروض في المفضلة" />
                  )}
              </div>
          )}

      </div>
    </div>
  );
};

const EmptyState = ({ label }: { label: string }) => (
    <div className="col-span-2 flex flex-col items-center justify-center py-20 text-gray-400">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Heart size={24} className="opacity-40" />
        </div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-xs mt-2 opacity-60">اضغط على زر القلب لحفظ العناصر هنا</p>
    </div>
);
