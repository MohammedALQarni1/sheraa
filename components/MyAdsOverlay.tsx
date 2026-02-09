
import React, { useState, useMemo } from 'react';
import { ChevronRight, Clock, BarChart3, Edit3, Sparkles, Crown, Eye, TrendingUp, MoreVertical, Trash2, AlertCircle, Ban } from 'lucide-react';
import { AdItem } from '../types';
import { MOCK_USER } from '../constants';
import { AdStatsOverlay } from './AdStatsOverlay';
import { PromoteAdOverlay } from './PromoteAdOverlay';

interface MyAdsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAdClick?: (ad: AdItem) => void;
  onEditAd?: (ad: AdItem) => void;
  onPromoteSuccess?: (adTitle: string, plan: string) => void;
  vipAdsBalance?: number;
  featuredAdsBalance?: number;
  onConsumeBalance?: (type: 'vip' | 'featured') => void;
}

// Extended Ad Interface for internal mock
interface LocalAdItem extends AdItem {
    status: 'active' | 'expired' | 'rejected';
    daysLeft?: number;
    rejectionReason?: string;
}

const currentUser = { ...MOCK_USER, id: 'current_user' };

// Mock Data
const MY_ADS_MOCK: LocalAdItem[] = [
    {
        id: 'opel_2017',
        type: 'ad',
        title: 'اوبل استرا توب لاين 2017',
        price: 35000,
        currency: 'ر.س',
        image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=400',
        location: 'الرياض',
        category: 'سيارات',
        postedTime: 'منذ يوم',
        condition: 'مستعمل',
        description: 'سيارة اوبل استرا 2017 توب لاين، حالة ممتازة، جميع الصيانات بالتوكيل. خالية من الحوادث.',
        user: currentUser,
        views: 1420,
        isFeatured: true,
        isVIP: false,
        status: 'active',
        daysLeft: 28
    },
    {
        id: 'iphone_13',
        type: 'ad',
        title: 'ايفون 13 برو ماكس نظيف جدا',
        price: 2800,
        currency: 'ر.س',
        image: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=400',
        location: 'جدة',
        category: 'جوالات',
        postedTime: 'منذ 3 ايام',
        condition: 'مستعمل',
        description: 'ايفون 13 برو ماكس، 256 جيجا، لون ازرق، البطارية 90٪، معه الكرتون والشاحن الاصلي.',
        user: currentUser,
        views: 45,
        isFeatured: false,
        isVIP: false,
        status: 'active',
        daysLeft: 12
    },
    {
        id: 'sony_cam',
        type: 'ad',
        title: 'كاميرا سوني A7III مع عدسة',
        price: 6500,
        currency: 'ر.س',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=400',
        location: 'الدمام',
        category: 'كاميرات',
        postedTime: 'منذ شهرين',
        condition: 'مستعمل',
        description: '',
        user: currentUser,
        views: 890,
        isFeatured: false,
        isVIP: false,
        status: 'expired',
        daysLeft: 0
    },
    {
        id: 'perfume_reject',
        type: 'ad',
        title: 'عطورات تركيب درجة اولى',
        price: 150,
        currency: 'ر.س',
        image: 'https://images.unsplash.com/photo-1594035910387-fea477942698?auto=format&fit=crop&q=80&w=400',
        location: 'الرياض',
        category: 'موضة',
        postedTime: 'منذ اسبوع',
        condition: 'جديد',
        description: '',
        user: currentUser,
        views: 12,
        isFeatured: false,
        isVIP: false,
        status: 'rejected',
        rejectionReason: 'مخالفة سياسة المحتوى الاعلاني'
    }
];

export const MyAdsOverlay: React.FC<MyAdsOverlayProps> = ({ 
    isOpen, 
    onClose, 
    onAdClick, 
    onEditAd, 
    onPromoteSuccess,
    vipAdsBalance = 0,
    featuredAdsBalance = 0,
    onConsumeBalance
}) => {
  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [statsAd, setStatsAd] = useState<AdItem | null>(null);
  const [promotingAd, setPromotingAd] = useState<AdItem | null>(null);

  // Filter Ads based on Tab
  const filteredAds = useMemo(() => {
      return MY_ADS_MOCK.filter(ad => {
          if (activeTab === 'active') return ad.status === 'active';
          return ad.status === 'expired' || ad.status === 'rejected';
      });
  }, [activeTab]);

  if (!isOpen) return null;

  const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      if(confirm('هل أنت متأكد من رغبتك في حذف الإعلان؟')) {
          alert('تم حذف الإعلان بنجاح');
      }
  };

  const handleActionClick = (e: React.MouseEvent, action: string, ad?: AdItem) => {
      e.stopPropagation();
      if (action === 'edit' && ad && onEditAd) {
          onEditAd(ad);
      }
      if (action === 'stats' && ad) {
          setStatsAd(ad);
      }
      if (action === 'promote' && ad) {
          setPromotingAd(ad);
      }
      console.log(`Action: ${action}`);
  };

  // Logic to determine performance based on views
  const getPerformanceStats = (views: number = 0) => {
      const maxTarget = 2000; // Target views for 100% bar
      const percentage = Math.min((views / maxTarget) * 100, 100);
      
      let label = 'يحتاج تحسين';
      let colorClass = 'text-gray-400';
      let barColor = 'from-gray-300 to-gray-400';

      if (views >= 1000) {
          label = 'مذهل 🔥';
          colorClass = 'text-[#6463C7]';
          barColor = 'from-[#6463C7] to-purple-400';
      } else if (views >= 500) {
          label = 'ممتاز 🚀';
          colorClass = 'text-emerald-600';
          barColor = 'from-emerald-500 to-green-400';
      } else if (views >= 100) {
          label = 'جيد 👍';
          colorClass = 'text-amber-500';
          barColor = 'from-amber-400 to-yellow-400';
      } else if (views > 20) {
          label = 'متوسط';
          colorClass = 'text-blue-500';
          barColor = 'from-blue-400 to-cyan-400';
      }

      return { percentage: Math.max(percentage, 5), label, colorClass, barColor };
  };

  return (
    <div className="absolute inset-0 z-[220] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-right duration-300 font-sans">
      
      {/* Stats Overlay Component */}
      {statsAd && (
          <AdStatsOverlay 
            isOpen={true} 
            ad={statsAd} 
            onClose={() => setStatsAd(null)} 
          />
      )}

      {/* Promote Overlay Component */}
      {promotingAd && (
          <PromoteAdOverlay 
            isOpen={true} 
            ad={promotingAd} 
            onClose={() => setPromotingAd(null)} 
            onPromoteSuccess={(plan) => {
                if (onPromoteSuccess) {
                    onPromoteSuccess(promotingAd.title, plan);
                }
            }}
            vipAdsBalance={vipAdsBalance}
            featuredAdsBalance={featuredAdsBalance}
            onConsumeBalance={onConsumeBalance}
          />
      )}

      {/* Header */}
      <div className="bg-white pt-12 pb-4 px-6 shadow-sm z-10 border-b border-gray-50">
          <div className="flex items-center justify-between mb-6">
              <button onClick={onClose} className="w-10 h-10 bg-gray-50 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors text-gray-800">
                  <ChevronRight size={22} />
              </button>
              <h2 className="text-xl font-black text-gray-900">إدارة إعلاناتي</h2>
              <div className="w-10"></div> {/* Spacer for alignment */}
          </div>

          {/* Balance Cards (Horizontal Scroll) */}
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
              {/* VIP Card */}
              <div className="min-w-[160px] flex-1 bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Crown size={64} className="text-amber-500 fill-amber-500" />
                  </div>
                  <div className="relative z-10">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 mb-3">
                          <Crown size={16} fill="currentColor" />
                      </div>
                      <span className="text-2xl font-black text-gray-900 block mb-1">{vipAdsBalance}</span>
                      <span className="text-[10px] font-bold text-gray-500">إعلانات VIP متبقية</span>
                  </div>
              </div>

              {/* Featured Card */}
              <div className="min-w-[160px] flex-1 bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-2xl p-4 relative overflow-hidden shadow-sm">
                  <div className="absolute top-0 right-0 p-3 opacity-10">
                      <Sparkles size={64} className="text-purple-500 fill-purple-500" />
                  </div>
                  <div className="relative z-10">
                      <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600 mb-3">
                          <Sparkles size={16} fill="currentColor" />
                      </div>
                      <span className="text-2xl font-black text-gray-900 block mb-1">{featuredAdsBalance}</span>
                      <span className="text-[10px] font-bold text-gray-500">إعلانات مميزة متبقية</span>
                  </div>
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-6">
          <div className="bg-white p-1.5 rounded-xl flex shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'active' 
                    ? 'bg-[#6463C7] text-white shadow-md shadow-purple-200' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  النشطة ({MY_ADS_MOCK.filter(a => a.status === 'active').length})
              </button>
              <button 
                onClick={() => setActiveTab('inactive')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'inactive' 
                    ? 'bg-[#6463C7] text-white shadow-md shadow-purple-200' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  المنتهية / المرفوضة ({MY_ADS_MOCK.filter(a => a.status !== 'active').length})
              </button>
          </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-24">
          <div className="space-y-4">
              {filteredAds.map((ad, index) => {
                  const stats = getPerformanceStats(ad.views);
                  const isInactive = ad.status !== 'active';
                  
                  return (
                    <div 
                        key={index} 
                        onClick={() => !isInactive && onAdClick && onAdClick(ad)}
                        className={`bg-white rounded-[1.5rem] border border-gray-100 shadow-sm overflow-hidden group transition-all duration-200 relative ${isInactive ? 'opacity-90' : 'cursor-pointer hover:shadow-md active:scale-[0.99]'}`}
                    >
                        
                        {/* Overlay for inactive items to indicate disabled state */}
                        {isInactive && (
                            <div className="absolute inset-0 bg-white/40 z-[5] pointer-events-none"></div>
                        )}

                        {/* Card Header (Image & Basic Info) */}
                        <div className="flex p-3 gap-3 relative z-10">
                            {/* Image */}
                            <div className="w-24 h-24 bg-gray-100 rounded-2xl overflow-hidden shrink-0 relative">
                                <img src={ad.image} alt={ad.title} className={`w-full h-full object-cover ${isInactive ? 'grayscale opacity-70' : ''}`} />
                                
                                {ad.isFeatured && ad.status === 'active' && (
                                    <div className="absolute top-1 right-1 bg-yellow-400 text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-sm">
                                        مميز
                                    </div>
                                )}

                                {/* Status Badge for Inactive */}
                                {ad.status === 'expired' && (
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold border border-white/50 px-2 py-1 rounded-md bg-black/20 backdrop-blur-sm">منتهي</span>
                                    </div>
                                )}
                                {ad.status === 'rejected' && (
                                    <div className="absolute inset-0 bg-red-500/40 flex items-center justify-center">
                                        <span className="text-white text-[10px] font-bold border border-white/50 px-2 py-1 rounded-md bg-black/20 backdrop-blur-sm">مرفوض</span>
                                    </div>
                                )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 flex flex-col justify-between py-1">
                                <div>
                                    <div className="flex justify-between items-start">
                                        <h3 className={`font-bold text-xs line-clamp-2 leading-relaxed ml-2 ${isInactive ? 'text-gray-500' : 'text-gray-900'}`}>{ad.title}</h3>
                                        {!isInactive && (
                                            <button onClick={(e) => handleActionClick(e, 'options')} className="text-gray-400 hover:text-gray-600 p-1 -mt-1 -ml-1">
                                                <MoreVertical size={16} />
                                            </button>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className={`font-black text-sm dir-ltr ${isInactive ? 'text-gray-400' : 'text-[#6463C7]'}`}>{ad.price.toLocaleString()} ر.س</span>
                                    </div>
                                </div>

                                {/* Status / Meta Info */}
                                {ad.status === 'rejected' ? (
                                    <div className="flex items-center gap-1.5 text-[10px] text-red-500 bg-red-50 px-2 py-1.5 rounded-lg border border-red-100 mt-2">
                                        <Ban size={12} />
                                        <span className="font-bold line-clamp-1">{ad.rejectionReason}</span>
                                    </div>
                                ) : (
                                    <div className="flex items-center gap-3 mt-2">
                                        <div className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">
                                            <Eye size={12} className="text-gray-400" />
                                            <span className="font-bold">{ad.views}</span>
                                        </div>
                                        <div className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded-lg ${isInactive ? 'bg-red-50 text-red-400' : 'bg-gray-50 text-gray-500'}`}>
                                            <Clock size={12} className={isInactive ? 'text-red-400' : 'text-gray-400'} />
                                            <span>{isInactive ? 'منتهي' : `باقي ${ad.daysLeft} يوم`}</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Performance Bar (Visible even if expired to show history) */}
                        <div className="px-4 pb-4 relative z-10">
                            <div className="flex justify-between items-end mb-1.5">
                                <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                    <TrendingUp size={12} />
                                    أداء الإعلان
                                </span>
                                <span className={`text-[10px] font-bold ${isInactive ? 'text-gray-400' : stats.colorClass}`}>{stats.label}</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden" dir="ltr">
                                <div 
                                    className={`h-full bg-gradient-to-r rounded-full transition-all duration-1000 ${isInactive ? 'from-gray-300 to-gray-400' : stats.barColor}`} 
                                    style={{ width: `${stats.percentage}%` }}
                                ></div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        {isInactive ? (
                            // INACTIVE ACTIONS (Restricted)
                            <div className="grid grid-cols-2 border-t border-gray-100 divide-x divide-x-reverse divide-gray-100 relative z-20">
                                <button onClick={(e) => handleActionClick(e, 'stats', ad)} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-500 hover:bg-gray-50 transition-colors group">
                                    <BarChart3 size={16} className="text-gray-400 group-hover:text-purple-600" />
                                    <span>الإحصائيات</span>
                                </button>
                                <button onClick={handleDelete} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors group">
                                    <Trash2 size={16} className="text-red-400 group-hover:text-red-600" />
                                    <span>حذف الإعلان</span>
                                </button>
                            </div>
                        ) : (
                            // ACTIVE ACTIONS (Full)
                            <div className="grid grid-cols-4 border-t border-gray-100 divide-x divide-x-reverse divide-gray-100 relative z-20">
                                <button onClick={(e) => handleActionClick(e, 'edit', ad)} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors group">
                                    <Edit3 size={16} className="text-gray-400 group-hover:text-blue-500" />
                                    <span className="hidden sm:inline">تعديل</span>
                                </button>
                                <button onClick={(e) => handleActionClick(e, 'stats', ad)} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors group">
                                    <BarChart3 size={16} className="text-gray-400 group-hover:text-purple-600" />
                                    <span className="hidden sm:inline">إحصائيات</span>
                                </button>
                                <button onClick={(e) => handleActionClick(e, 'promote', ad)} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-[#6463C7] bg-[#6463C7]/5 hover:bg-[#6463C7]/10 transition-colors">
                                    <Sparkles size={16} />
                                    <span className="hidden sm:inline">ترقية</span>
                                </button>
                                <button onClick={handleDelete} className="py-3 flex items-center justify-center gap-1 text-xs font-bold text-gray-600 hover:bg-red-50 hover:text-red-500 transition-colors group">
                                    <Trash2 size={16} className="text-gray-400 group-hover:text-red-500" />
                                    <span className="hidden sm:inline">حذف</span>
                                </button>
                            </div>
                        )}
                    </div>
                  );
              })}
              
              {filteredAds.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                      <AlertCircle size={48} className="mb-2 opacity-20" />
                      <p className="text-sm font-bold">لا توجد إعلانات في هذه القائمة</p>
                  </div>
              )}
          </div>
      </div>
    </div>
  );
};
