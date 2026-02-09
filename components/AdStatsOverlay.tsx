
import React, { useMemo } from 'react';
import { X, Eye, MousePointerClick, MessageCircle, Heart, Share2, TrendingUp, Calendar, ArrowUpRight, BarChart3, HelpCircle } from 'lucide-react';
import { AdItem } from '../types';

interface AdStatsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ad: AdItem;
}

export const AdStatsOverlay: React.FC<AdStatsOverlayProps> = ({ isOpen, onClose, ad }) => {
  if (!isOpen) return null;

  // Mock Data Generation based on Ad views
  const stats = useMemo(() => {
      const baseViews = ad.views || 0;
      const clicks = Math.floor(baseViews * 0.15); // 15% CTR
      const chats = Math.floor(clicks * 0.2); // 20% Conversion
      const favorites = Math.floor(baseViews * 0.05);
      
      // Generate last 7 days mock data
      const days = ['السبت', 'الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة'];
      const chartData = days.map((day, i) => {
          const val = Math.floor(Math.random() * (baseViews / 5)); 
          return { day, value: val };
      });
      const maxVal = Math.max(...chartData.map(d => d.value));

      return { clicks, chats, favorites, chartData, maxVal };
  }, [ad]);

  const engagementRate = Math.min(Math.round(((stats.clicks + stats.favorites) / (ad.views || 1)) * 100), 100);

  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
              <X size={24} />
          </button>
          <h2 className="text-lg font-black text-gray-900">إحصائيات الإعلان</h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-10">
          
          {/* Ad Summary Card */}
          <div className="bg-white p-4 mb-4 border-b border-gray-100">
              <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                      <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                      <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1">{ad.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="bg-gray-100 px-2 py-0.5 rounded-md dir-ltr font-bold text-gray-600">#{ad.id.substring(0, 6)}</span>
                          <span>•</span>
                          <span>{ad.postedTime}</span>
                      </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                      // @ts-ignore - checking status exists on extended type or falling back
                      ad.status === 'active' || !ad['status'] ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}>
                      {/* @ts-ignore */}
                      {ad.status === 'active' || !ad['status'] ? 'نشط' : 'غير نشط'}
                  </div>
              </div>
          </div>

          {/* Main Chart Section */}
          <div className="px-4 mb-6">
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                  <div className="flex justify-between items-start mb-6">
                      <div>
                          <p className="text-gray-400 text-xs font-bold mb-1">إجمالي المشاهدات</p>
                          <h3 className="text-3xl font-black text-[#6463C7] dir-ltr">{ad.views?.toLocaleString()}</h3>
                      </div>
                      <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-lg text-[10px] font-bold">
                          <TrendingUp size={12} />
                          <span>+12%</span>
                      </div>
                  </div>

                  {/* Custom CSS Bar Chart */}
                  <div className="flex items-end justify-between h-32 gap-2 mt-4">
                      {stats.chartData.map((item, idx) => {
                          const heightPct = (item.value / (stats.maxVal || 1)) * 100;
                          return (
                              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group cursor-pointer">
                                  <div className="w-full relative flex items-end h-full rounded-t-lg bg-gray-50 overflow-hidden">
                                      <div 
                                        className="w-full bg-[#6463C7] opacity-80 group-hover:opacity-100 transition-all rounded-t-lg relative"
                                        style={{ height: `${Math.max(heightPct, 5)}%` }}
                                      >
                                          {/* Tooltip */}
                                          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                              {item.value}
                                          </div>
                                      </div>
                                  </div>
                                  <span className="text-[9px] text-gray-400 font-medium">{item.day.charAt(0)}</span>
                              </div>
                          )
                      })}
                  </div>
              </div>
          </div>

          {/* Metrics Grid */}
          <div className="px-4 grid grid-cols-2 gap-3 mb-6">
              <StatCard icon={<MousePointerClick size={18} />} label="نقرات الظهور" value={stats.clicks} color="text-blue-500" bg="bg-blue-50" />
              <StatCard icon={<MessageCircle size={18} />} label="محادثات بدأت" value={stats.chats} color="text-green-500" bg="bg-green-50" />
              <StatCard icon={<Heart size={18} />} label="أضافوه للمفضلة" value={stats.favorites} color="text-red-500" bg="bg-red-50" />
              <StatCard icon={<Share2 size={18} />} label="مشاركات الرابط" value={Math.floor(stats.favorites / 2)} color="text-purple-500" bg="bg-purple-50" />
          </div>

          {/* Engagement Score */}
          <div className="px-4 mb-6">
              <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white flex items-center justify-between shadow-lg">
                  <div>
                      <h4 className="font-bold text-sm mb-1 flex items-center gap-2">
                          <BarChart3 size={16} className="text-yellow-400" />
                          معدل التفاعل
                      </h4>
                      <p className="text-[10px] text-gray-400">نسبة التفاعل مقارنة بالمشاهدات</p>
                  </div>
                  <div className="relative w-16 h-16 flex items-center justify-center">
                      <svg className="w-full h-full transform -rotate-90">
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-gray-700" />
                          <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className={`text-yellow-400 transition-all duration-1000`} strokeDasharray={175} strokeDashoffset={175 - (175 * engagementRate) / 100} strokeLinecap="round" />
                      </svg>
                      <span className="absolute text-sm font-black">{engagementRate}%</span>
                  </div>
              </div>
          </div>

          {/* Insights / Tips */}
          <div className="px-4">
              <h3 className="font-bold text-gray-900 mb-3 text-sm flex items-center gap-2">
                  <HelpCircle size={16} />
                  نصائح لتحسين الأداء
              </h3>
              <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4 space-y-3">
                  <div className="flex gap-3">
                      <div className="w-1.5 bg-orange-300 rounded-full shrink-0"></div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          إضافة المزيد من الصور الواضحة قد تزيد من نسبة النقر بنسبة 20%.
                      </p>
                  </div>
                  <div className="flex gap-3">
                      <div className="w-1.5 bg-orange-300 rounded-full shrink-0"></div>
                      <p className="text-xs text-gray-700 leading-relaxed font-medium">
                          تحديث الإعلان بانتظام يبقيه في النتائج الأولى ويزيد المشاهدات.
                      </p>
                  </div>
              </div>
          </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button className="w-full bg-[#6463C7] text-white font-bold py-3.5 rounded-2xl flex items-center justify-center gap-2 hover:bg-[#5352a3] transition-colors shadow-lg shadow-[#6463C7]/20">
              <ArrowUpRight size={20} />
              <span>ترقية الإعلان لزيادة المشاهدات</span>
          </button>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, bg }: any) => (
    <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center gap-2">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bg} ${color}`}>
            {icon}
        </div>
        <span className="text-2xl font-black text-gray-900 dir-ltr">{value}</span>
        <span className="text-[10px] font-bold text-gray-400">{label}</span>
    </div>
);
