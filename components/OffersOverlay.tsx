
import React, { useState, useMemo, useEffect } from 'react';
import { 
    LayoutGrid, Utensils, ShoppingBag, Plane, Ticket, Tag, List, RectangleVertical, 
    CheckCircle2, Gift, Percent, Shirt, HeartPulse, Monitor, Car, ShoppingCart, 
    Home, Briefcase, Coffee, CreditCard, Smartphone 
} from 'lucide-react';
import { OFFER_ITEMS } from '../constants';
import { OfferCard } from './OfferCard';
import { BottomNav } from './BottomNav';
import { RewardItem } from '../types';
import { OfferDetailsOverlay } from './OfferDetailsOverlay';

interface OffersOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onProfileClick?: () => void;
  onScanClick?: () => void;
  onMessagesClick?: () => void;
  onHomeClick?: () => void;
}

// 1. Sub-tabs for "Offers" (Physical/Service based)
const OFFERS_SUB_TABS = [
    { id: 'all', label: 'الكل', icon: LayoutGrid },
    { id: 'restaurants', label: 'مطاعم', icon: Utensils },
    { id: 'entertainment', label: 'ترفيه', icon: Ticket },
    { id: 'health', label: 'صحة', icon: HeartPulse },
    { id: 'automotive', label: 'سيارات', icon: Car },
    { id: 'travel', label: 'سفر', icon: Plane },
];

// 2. Sub-tabs for "Codes" (Discount Codes)
const CODES_SUB_TABS = [
    { id: 'all', label: 'الكل', icon: LayoutGrid },
    { id: 'fashion', label: 'أزياء', icon: Shirt },
    { id: 'apps', label: 'تطبيقات', icon: Smartphone },
    { id: 'beauty', label: 'تجميل', icon: HeartPulse },
    { id: 'home', label: 'منزل', icon: Home },
    { id: 'general', label: 'عام', icon: ShoppingBag },
];

// 3. Sub-tabs for "Vouchers" (Cash Value)
const VOUCHERS_SUB_TABS = [
    { id: 'all', label: 'الكل', icon: LayoutGrid },
    { id: 'electronics', label: 'ألعاب والكترونيات', icon: Monitor },
    { id: 'groceries', label: 'سوبرماركت', icon: ShoppingCart },
    { id: 'beauty', label: 'تجميل', icon: HeartPulse },
    { id: 'general', label: 'تسوق عام', icon: ShoppingBag },
];

export const OffersOverlay: React.FC<OffersOverlayProps> = ({ 
    isOpen, 
    onClose, 
    onProfileClick, 
    onScanClick,
    onMessagesClick,
    onHomeClick
}) => {
  
  // Main Tab State: 'offers' | 'codes' | 'vouchers'
  const [mainTab, setMainTab] = useState<'offers' | 'codes' | 'vouchers'>('offers');

  // Sub Category State
  const [activeSubTab, setActiveSubTab] = useState('all');
  
  // View Mode State
  const [viewMode, setViewMode] = useState<'large' | 'list' | 'grid'>('large');
  
  const [selectedOffer, setSelectedOffer] = useState<RewardItem | null>(null);

  // Reset sub-tab when main tab changes
  useEffect(() => {
      setActiveSubTab('all');
  }, [mainTab]);

  // Determine which sub-tabs to show
  const currentSubTabs = useMemo(() => {
      if (mainTab === 'offers') return OFFERS_SUB_TABS;
      if (mainTab === 'codes') return CODES_SUB_TABS;
      return VOUCHERS_SUB_TABS;
  }, [mainTab]);

  // Filter Logic
  const filteredOffers = useMemo(() => {
      // 1. First, filter by Main Tab using explicit logic derived from data
      let items = OFFER_ITEMS.filter(item => {
          const isVoucher = item.discountPercentage === 0; // Vouchers are 0% discount (Value based)
          const isCode = item.discountPercentage > 0 && ['fashion', 'apps', 'beauty', 'home', 'general'].includes(item.category);
          const isOffer = ['restaurants', 'entertainment', 'health', 'automotive'].includes(item.category);

          // Exception: Specific Brands might override category logic to force into a tab if needed
          // But based on updated constants, categories are aligned.
          
          if (mainTab === 'offers') {
              return isOffer;
          } 
          else if (mainTab === 'codes') {
              return isCode && !isVoucher;
          } 
          else if (mainTab === 'vouchers') {
              return isVoucher;
          }
          return false;
      });

      // 2. Then, filter by Sub Tab
      if (activeSubTab !== 'all') {
          items = items.filter(item => item.category === activeSubTab);
      }

      return items;
  }, [mainTab, activeSubTab]);

  if (!isOpen) return null;

  const handleMapClick = () => {
      alert("فتح خريطة العروض...");
  };
  
  // --- OFFER DETAILS VIEW ---
  if (selectedOffer) {
    return (
        <OfferDetailsOverlay 
            offer={selectedOffer} 
            onClose={() => setSelectedOffer(null)}
            onScanClick={onScanClick}
            onHomeClick={onHomeClick}
            onOffersClick={() => setSelectedOffer(null)} // Close detail, stay on offers
            onMessagesClick={onMessagesClick}
            onProfileClick={onProfileClick}
        />
    );
  }

  // --- MAIN LIST VIEW ---
  return (
    <div className="absolute inset-0 z-[60] bg-[#f8f9fb] flex flex-col font-sans animate-in slide-in-from-bottom duration-300">
      
      {/* Header Area */}
      <div className="bg-white pt-12 pb-3 shadow-sm z-10 sticky top-0 rounded-b-[2rem]">
          
          {/* Top Row: Title */}
          <div className="flex items-center justify-center px-5 mb-4">
              <h2 className="text-lg font-black text-gray-900">المتجر والمكافآت</h2>
          </div>

          {/* Main Tab Switcher (3-Way Split) */}
          <div className="px-4 mb-4">
              <div className="bg-gray-100 p-1 rounded-2xl flex relative h-12 border border-gray-200">
                  
                  {/* Sliding Background Logic */}
                  <div 
                    className={`absolute top-1 bottom-1 w-[calc(33.33%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ease-out`}
                    style={{
                        right: mainTab === 'offers' ? '4px' : mainTab === 'codes' ? 'calc(33.33% + 2px)' : 'calc(66.66%)'
                    }}
                  ></div>

                  <button 
                      onClick={() => setMainTab('offers')}
                      className={`flex-1 rounded-xl text-xs font-bold z-10 transition-all flex items-center justify-center gap-1.5 ${mainTab === 'offers' ? 'text-[#6463C7]' : 'text-gray-500'}`}
                  >
                      <Gift size={16} />
                      العروض
                  </button>
                  <button 
                      onClick={() => setMainTab('codes')}
                      className={`flex-1 rounded-xl text-xs font-bold z-10 transition-all flex items-center justify-center gap-1.5 ${mainTab === 'codes' ? 'text-[#6463C7]' : 'text-gray-500'}`}
                  >
                      <Percent size={16} />
                      أكواد خصم
                  </button>
                  <button 
                      onClick={() => setMainTab('vouchers')}
                      className={`flex-1 rounded-xl text-xs font-bold z-10 transition-all flex items-center justify-center gap-1.5 ${mainTab === 'vouchers' ? 'text-[#6463C7]' : 'text-gray-500'}`}
                  >
                      <CreditCard size={16} />
                      قسائم شرائية
                  </button>
              </div>
          </div>

          {/* Sub-Categories Scrollable Tabs */}
          <div className="overflow-x-auto no-scrollbar px-5 pb-2 flex gap-2.5">
              {currentSubTabs.map((tab) => {
                  const isActive = activeSubTab === tab.id;
                  return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveSubTab(tab.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap transition-all border ${
                            isActive 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                          {isActive && <CheckCircle2 size={14} className="text-white" />}
                          <span className={`text-xs ${isActive ? 'font-bold' : 'font-bold'}`}>{tab.label}</span>
                      </button>
                  );
              })}
          </div>
      </div>

      {/* Main Content List */}
      <div className="flex-1 overflow-y-auto no-scrollbar px-4 pt-4 pb-24">
          
          {/* Results Bar: Count + View Toggles */}
          <div className="flex justify-between items-center mb-3 px-1">
              <span className="text-xs font-bold text-gray-400">
                  {filteredOffers.length} عنصر متاح
              </span>

              {/* View Modes Toggle */}
              <div className="bg-gray-100 p-1 rounded-xl flex gap-1 border border-gray-200 scale-90 origin-left">
                  <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white text-[#6463C7] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="شبكي"
                  >
                      <LayoutGrid size={16} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white text-[#6463C7] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="قائمة"
                  >
                      <List size={16} strokeWidth={2.5} />
                  </button>
                  <button 
                    onClick={() => setViewMode('large')}
                    className={`p-1.5 rounded-lg transition-all ${viewMode === 'large' ? 'bg-white text-[#6463C7] shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                    title="صور كبيرة"
                  >
                      <RectangleVertical size={16} strokeWidth={2.5} />
                  </button>
              </div>
          </div>

          {filteredOffers.length > 0 ? (
              <div className={`
                  ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3' : 'flex flex-col'}
                  ${viewMode === 'list' ? 'gap-3' : 'gap-4'}
              `}>
                  {filteredOffers.map(item => (
                      <OfferCard 
                        key={item.id} 
                        item={item} 
                        viewMode={viewMode}
                        onClick={(i) => setSelectedOffer(i)}
                        onScanClick={onScanClick}
                      />
                  ))}
              </div>
          ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <Gift size={32} className="opacity-30" />
                  </div>
                  <p className="font-bold text-gray-500">لا توجد عناصر في هذا القسم حالياً</p>
                  <button onClick={() => setActiveSubTab('all')} className="mt-2 text-[#6463C7] text-xs font-bold">
                      عرض الكل
                  </button>
              </div>
          )}
      </div>

      {/* Bottom Nav - Active Tab: Offers */}
      <BottomNav 
        activeTab="offers"
        onHomeClick={onHomeClick} 
        onOffersClick={() => {}} 
        onProfileClick={onProfileClick} 
        onMessagesClick={onMessagesClick}
        onScanClick={onScanClick}
        onMapClick={handleMapClick}
      />
      
    </div>
  );
};
