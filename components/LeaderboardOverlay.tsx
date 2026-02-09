
import React, { useState, useMemo } from 'react';
import { ChevronRight, Crown, TrendingUp, User, Trophy, ChevronUp, Medal, Shield, Award, Sparkles, BadgeCheck } from 'lucide-react';
import { LEADERBOARD_USERS, MOCK_USER } from '../constants';

interface LeaderboardOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

const TIME_FILTERS = [
    { id: 'day', label: 'آخر 24 ساعة' },
    { id: 'week', label: 'آخر 7 أيام' },
    { id: 'month', label: 'آخر 30 يوم' },
    { id: 'all', label: 'جميع الأوقات' },
];

export const LeaderboardOverlay: React.FC<LeaderboardOverlayProps> = ({ isOpen, onClose }) => {
  // Filter State (Default: Last 24 Hours)
  const [activeTime, setActiveTime] = useState<string>('day');

  // Multiplier logic (Shared)
  const multiplier = useMemo(() => {
        const timeMultipliers: Record<string, number> = {
            'day': 0.05,
            'week': 0.15,
            'month': 0.45,
            'all': 1.0
        };
        return timeMultipliers[activeTime] || 1;
  }, [activeTime]);

  // Filter and Sort Users
  const filteredUsers = useMemo(() => {
    // 1. No filtering by role - include everyone (users and stores)
    let users = [...LEADERBOARD_USERS];
    
    const processedUsers = users.map(user => {
        const variance = 0.9 + Math.random() * 0.2; 
        const timeBasedReputation = Math.floor((user.reputation || 0) * multiplier * variance);
        
        return {
            ...user,
            reputation: timeBasedReputation
        };
    });

    return processedUsers.sort((a, b) => (b.reputation || 0) - (a.reputation || 0));
  }, [multiplier]);

  const topThree = filteredUsers.slice(0, 3);
  const restOfList = filteredUsers.slice(3);

  // Helper to determine Tier based on reputation
  const getTierInfo = (points: number = 0) => {
      if (points >= 10000) return { label: 'ماسي', color: 'bg-cyan-50 text-cyan-700 border-cyan-100', icon: Sparkles, iconColor: 'text-cyan-500' };
      if (points >= 5000) return { label: 'بلاتيني', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: Shield, iconColor: 'text-slate-500' };
      if (points >= 2000) return { label: 'ذهبي', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Crown, iconColor: 'text-amber-500' };
      if (points >= 500) return { label: 'فضي', color: 'bg-gray-100 text-gray-600 border-gray-200', icon: Medal, iconColor: 'text-gray-400' };
      return { label: 'برونزي', color: 'bg-orange-50 text-orange-700 border-orange-100', icon: Award, iconColor: 'text-orange-500' };
  };

  const getRoleBadge = (role: string | undefined) => {
      if (role === 'store') {
          return { label: 'بائع مميز', color: 'bg-blue-50 text-blue-600 border-blue-100', icon: BadgeCheck };
      }
      return { label: 'عضو', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: User };
  };

  // Dynamic Current User Stats
  const myPoints = Math.floor(MOCK_USER.walletBalance * multiplier);
  const myTier = getTierInfo(myPoints);
  
  // Calculate My Rank
  let myRank = filteredUsers.findIndex(u => (u.reputation || 0) < myPoints);
  
  if (myRank === -1) {
      myRank = filteredUsers.length + 1;
  } else {
      myRank = myRank + 1;
  }

  // Determine points needed for next rank
  // The person directly above me is at index (myRank - 2) because rank is 1-based.
  const prevUser = filteredUsers[myRank - 2];
  const pointsToNextRank = prevUser ? ((prevUser.reputation || 0) - myPoints + 50) : 0; 

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fd] flex flex-col animate-in slide-in-from-right duration-300 font-sans h-full">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-2 flex flex-col shadow-sm z-20 sticky top-0">
           <div className="flex items-center justify-between mb-4">
                <button 
                    onClick={onClose}
                    className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors"
                >
                    <ChevronRight size={24} />
                </button>
                <div className="text-center">
                    <h2 className="text-lg font-black text-gray-900">أفضل الأعضاء</h2>
                    <p className="text-[10px] text-gray-400 font-bold">الأكثر تفاعلاً ونشاطاً</p>
                </div>
                <div className="w-10"></div>
           </div>

           {/* Time Filters - Moved to Top with horizontal scroll for more items */}
           <div className="flex overflow-x-auto no-scrollbar gap-2 pb-3 px-1">
                {TIME_FILTERS.map((filter) => (
                    <button 
                        key={filter.id}
                        onClick={() => setActiveTime(filter.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border whitespace-nowrap ${
                            activeTime === filter.id
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                            : 'bg-gray-50 text-gray-500 border-transparent hover:bg-gray-100'
                        }`}
                    >
                        {filter.label}
                    </button>
                ))}
           </div>
      </div>

      {/* Main Content (Scrollable) */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24">
          
          {/* TOP 3 PODIUM */}
          {topThree.length > 0 && (
              <div className="px-4 mb-8 mt-8 relative">
                  <div className="flex items-end justify-center gap-2 sm:gap-4">
                      
                      {/* Rank 2 (Silver) */}
                      {topThree[1] && (() => {
                          const roleInfo = getRoleBadge(topThree[1].role);
                          return (
                            <div className="flex flex-col items-center mb-4 w-1/3">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-gray-200 p-0.5 shadow-lg bg-white relative z-10">
                                        <img src={topThree[1].avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-black text-xs shadow-md border-2 border-white z-20">
                                        2
                                    </div>
                                </div>
                                <div className="text-center mt-4 flex flex-col items-center w-full">
                                    <h3 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1 w-full">{topThree[1].name}</h3>
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] font-bold mb-1 ${roleInfo.color}`}>
                                        <roleInfo.icon size={8} />
                                        <span>{roleInfo.label}</span>
                                    </div>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="text-[#6463C7] font-black text-xs dir-ltr">{topThree[1].reputation?.toLocaleString()}</span>
                                        <span className="text-[9px] text-gray-400 font-bold mt-0.5">نقطة</span>
                                    </div>
                                </div>
                            </div>
                          );
                      })()}

                      {/* Rank 1 (Gold) */}
                      {topThree[0] && (() => {
                          const roleInfo = getRoleBadge(topThree[0].role);
                          return (
                            <div className="flex flex-col items-center w-1/3 relative -top-6">
                                <div className="absolute -top-12 animate-bounce">
                                    <Trophy size={36} className="fill-yellow-400 text-yellow-500 drop-shadow-sm" />
                                </div>
                                <div className="relative">
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-yellow-400 p-1 shadow-xl shadow-yellow-100 bg-white relative z-10">
                                        <img src={topThree[0].avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                    <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-9 h-9 bg-yellow-400 rounded-full flex items-center justify-center text-white font-black text-sm shadow-md border-2 border-white z-20">
                                        1
                                    </div>
                                </div>
                                <div className="text-center mt-5 flex flex-col items-center w-full">
                                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1 mb-1 w-full">{topThree[0].name}</h3>
                                    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold mb-1 ${roleInfo.color}`}>
                                        <roleInfo.icon size={10} />
                                        <span>{roleInfo.label}</span>
                                    </div>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="text-gray-900 font-black text-sm dir-ltr">{topThree[0].reputation?.toLocaleString()}</span>
                                        <span className="text-[10px] text-yellow-600 font-bold mt-0.5">نقطة</span>
                                    </div>
                                </div>
                            </div>
                          );
                      })()}

                      {/* Rank 3 (Bronze) */}
                      {topThree[2] && (() => {
                          const roleInfo = getRoleBadge(topThree[2].role);
                          return (
                            <div className="flex flex-col items-center mb-2 w-1/3">
                                <div className="relative">
                                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-orange-200 p-0.5 shadow-lg bg-white relative z-10">
                                        <img src={topThree[2].avatar} className="w-full h-full rounded-full object-cover" alt="" />
                                    </div>
                                    <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-7 h-7 bg-orange-300 rounded-full flex items-center justify-center text-white font-black text-xs shadow-md border-2 border-white z-20">
                                        3
                                    </div>
                                </div>
                                <div className="text-center mt-4 flex flex-col items-center w-full">
                                    <h3 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1 w-full">{topThree[2].name}</h3>
                                    <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-md border text-[8px] font-bold mb-1 ${roleInfo.color}`}>
                                        <roleInfo.icon size={8} />
                                        <span>{roleInfo.label}</span>
                                    </div>
                                    <div className="flex flex-col items-center leading-none">
                                        <span className="text-[#6463C7] font-black text-xs dir-ltr">{topThree[2].reputation?.toLocaleString()}</span>
                                        <span className="text-[9px] text-gray-400 font-bold mt-0.5">نقطة</span>
                                    </div>
                                </div>
                            </div>
                          );
                      })()}
                  </div>
              </div>
          )}

          {/* List Header */}
          <div className="bg-white rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.02)] border-t border-gray-50 min-h-[500px]">
              <div className="px-6 py-4 flex justify-between items-center border-b border-gray-50">
                  <span className="text-sm font-bold text-gray-900">باقي الترتيب</span>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded">
                      <TrendingUp size={12} />
                      <span>يتم التحديث كل دقيقة</span>
                  </div>
              </div>

              <div className="px-4 py-2">
                  {restOfList.map((user, idx) => {
                      const rank = idx + 4;
                      const roleInfo = getRoleBadge(user.role);

                      return (
                          <div key={user.id} className="group relative">
                              <div className="flex items-center p-3 hover:bg-gray-50 rounded-2xl transition-colors">
                                  {/* Rank */}
                                  <span className="w-8 text-center font-bold text-gray-400 text-sm">{rank}</span>
                                  
                                  {/* Avatar */}
                                  <div className="w-10 h-10 rounded-full bg-gray-100 mx-3 shrink-0 overflow-hidden border border-gray-100">
                                      <img src={user.avatar} className="w-full h-full object-cover" alt="" />
                                  </div>
                                  
                                  {/* Info */}
                                  <div className="flex-1 text-right">
                                      <h4 className="font-bold text-sm text-gray-900 line-clamp-1 mb-1">{user.name}</h4>
                                      <div className="flex items-center gap-2">
                                          <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded border text-[9px] font-bold ${roleInfo.color}`}>
                                              <roleInfo.icon size={9} />
                                              <span>{roleInfo.label}</span>
                                          </div>
                                      </div>
                                  </div>

                                  {/* Points */}
                                  <div className="text-left flex flex-col items-end">
                                      <span className="font-black text-gray-900 text-sm dir-ltr">{user.reputation?.toLocaleString()}</span>
                                      <span className="text-[9px] text-gray-400 font-bold">نقطة</span>
                                  </div>
                              </div>
                              {/* Separator Line (Hidden for last item) */}
                              {idx < restOfList.length - 1 && (
                                  <div className="absolute bottom-0 left-4 right-4 h-[1px] bg-gray-50"></div>
                              )}
                          </div>
                      );
                  })}
              </div>
          </div>
      </div>

      {/* STICKY FOOTER: MY RANK */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 shadow-[0_-5px_25px_rgba(0,0,0,0.08)] z-30">
          <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-gray-400">ترتيبي الحالي</span>
              {pointsToNextRank > 0 && (
                  <span className="text-[10px] text-[#6463C7] font-bold bg-[#6463C7]/10 px-2 py-0.5 rounded flex items-center gap-1">
                      <ChevronUp size={10} />
                      باقي {pointsToNextRank.toLocaleString()} نقطة للمركز التالي
                  </span>
              )}
          </div>
          
          <div className="flex items-center bg-[#f8f9fd] p-3 rounded-2xl border border-[#6463C7]/20 relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#6463C7]"></div>
              
              <span className="w-8 text-center font-black text-xl text-[#6463C7]">{myRank}</span>
              
              <div className="w-10 h-10 rounded-full bg-white mx-3 shrink-0 overflow-hidden border border-gray-200 p-0.5">
                  <img src={MOCK_USER.avatar} className="w-full h-full object-cover rounded-full" alt="Me" />
              </div>
              
              <div className="flex-1 text-right">
                  <h4 className="font-black text-sm text-gray-900 mb-1">أنت</h4>
                  <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[9px] font-bold w-fit ${myTier.color}`}>
                      <myTier.icon size={10} />
                      <span>{myTier.label}</span>
                  </div>
              </div>

              <div className="text-left">
                  <span className="font-black text-[#6463C7] text-lg dir-ltr block">{myPoints.toLocaleString()}</span>
                  <span className="text-[9px] text-gray-400 font-bold block text-center">نقطة</span>
              </div>
          </div>
      </div>

    </div>
  );
};
