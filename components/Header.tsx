
import React from 'react';
import { Bell, Search, Signal, Wifi, Battery, Wallet, Trophy, MapPin, User as UserIcon } from 'lucide-react';
import { MOCK_USER } from '../constants';
import { NotificationItem } from '../types';

interface HeaderProps {
    onSearchClick?: () => void;
    onLeaderboardClick?: () => void;
    onNotificationsClick?: () => void;
    onWalletClick?: () => void;
    onProfileClick?: () => void;
    notifications?: NotificationItem[];
}

export const Header: React.FC<HeaderProps> = ({ 
    onSearchClick, 
    onLeaderboardClick, 
    onNotificationsClick,
    onWalletClick,
    onProfileClick,
    notifications = []
}) => {
  const handleProfileClick = () => {
    if (MOCK_USER.isGuest) {
        console.log("Redirect to Login");
    } else {
        if (onProfileClick) {
            onProfileClick();
        }
    }
  };

  const handleWalletClick = () => {
    if (MOCK_USER.status === 'suspended') {
        alert("حسابك موقوف، يرجى التواصل مع الدعم الفني"); 
        return;
    }
    if (MOCK_USER.isGuest) {
        console.log("Redirect to Login for points");
        return;
    }
    
    if (onWalletClick) {
        onWalletClick();
    }
  };

  const getWalletContent = () => {
      if (MOCK_USER.status === 'suspended') {
          return { label: "الحساب موقوف", value: "---", color: "text-red-500" };
      }
      if (MOCK_USER.isGuest) {
          return { label: "سجل الآن", value: "تجميع النقاط", color: "text-gray-500" };
      }
      return { 
          label: "رصيد المحفظة", 
          value: MOCK_USER.walletBalance.toLocaleString(), 
          color: "text-gray-900" 
      };
  };

  const walletContent = getWalletContent();
  
  // Calculate Unread (filtering out messages, assuming message tab handles its own count)
  const unreadCount = notifications.filter(n => !n.isRead && n.type !== 'message').length;

  return (
    <header className="bg-[#ede9fe] pt-2 pb-4 px-4 rounded-b-[2rem] shadow-sm relative overflow-hidden">
      
      {/* Dynamic Island */}
      <div className="absolute top-2 left-1/2 transform -translate-x-1/2 w-[120px] h-[35px] bg-black rounded-[20px] z-10 hidden sm:flex items-center justify-center pointer-events-none">
          <div className="w-[80px] h-[80px] bg-purple-900/30 rounded-full blur-xl absolute -top-4"></div>
          <div className="w-[10px] h-[10px] rounded-full bg-[#10101a] border border-gray-800 opacity-50 ml-16 shadow-inner"></div>
      </div>

      {/* Status Bar */}
      <div className="flex justify-between items-center mb-2 text-black opacity-90 px-3 pt-2">
        {/* Time (Right/Start in RTL) */}
        <div className="flex items-center gap-1.5">
             <div className="text-[13px] font-bold tracking-widest font-[sans-serif]">1:44</div>
             <MapPin size={10} className="text-black fill-black -mt-0.5 rotate-12" />
        </div>
        
        {/* Icons (Left/End in RTL) */}
        <div className="flex gap-1.5 items-center flex-row-reverse">
            <div className="relative">
                <Battery size={22} className="text-black opacity-40" strokeWidth={1.5} />
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-[14px] h-[8px] bg-black rounded-[1px] ml-0.5"></div>
                </div>
            </div>
            <Wifi size={16} className="text-black" strokeWidth={2.5} />
            <Signal size={16} className="fill-black text-black" />
        </div>
      </div>

      {/* Row 2: Profile & Wallet */}
      <div className="flex justify-between items-center mb-4 px-1 mt-2">
        
        {/* Profile (Right Side) */}
        <button 
            onClick={handleProfileClick}
            className="flex items-center gap-2 group focus:outline-none"
            aria-label="حسابي"
        >
          <div className="w-[40px] h-[40px] rounded-full bg-[#d8d4f4] flex items-center justify-center overflow-hidden border-2 border-white shadow-sm shrink-0">
             {MOCK_USER.avatar && !MOCK_USER.isGuest ? (
                 <img 
                    src={MOCK_USER.avatar} 
                    alt={MOCK_USER.name} 
                    className="w-full h-full object-cover"
                 />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-purple-600 font-bold text-lg">
                    {MOCK_USER.name.charAt(0)}
                </div>
             )}
          </div>
          <div className="flex flex-col items-start text-right">
             <span className="text-[10px] text-gray-800 font-medium leading-none mb-1 opacity-80">اهلا</span>
             <span className="text-sm font-bold text-gray-900 leading-none">{MOCK_USER.name}</span>
          </div>
        </button>

        {/* Wallet (Left Side) - Updated Alignment */}
        <button 
             onClick={handleWalletClick}
             className="flex items-center gap-2.5 group focus:outline-none pl-1"
             aria-label="المحفظة"
        >
             {/* Icon */}
             <div className="w-[40px] h-[40px] rounded-xl bg-gradient-to-br from-[#a5b4fc] to-[#8b5cf6] flex items-center justify-center text-white shadow-md shadow-purple-200/50 shrink-0 relative overflow-hidden">
                  <div className="absolute inset-0 bg-white/10 rounded-full w-full h-full scale-150 translate-x-1/2 translate-y-1/2"></div>
                  <Wallet size={20} className="text-white fill-white/20 relative z-10" />
             </div>

             {/* Text - Centered alignment */}
             <div className="flex flex-col items-center">
                <p className="text-[10px] text-gray-800 font-medium mb-0.5 opacity-80 whitespace-nowrap">{walletContent.label}</p>
                <p className={`text-sm font-black leading-none ${walletContent.color}`} dir="ltr">{walletContent.value}</p>
             </div>
        </button>
      </div>

      {/* Row 3: Search & Actions */}
      <div className="flex gap-2 h-[42px]">
         
         {/* Search Input (Right / Start) */}
         <div className="flex-1 relative h-full">
            <div 
                onClick={onSearchClick}
                className="w-full h-full bg-white rounded-xl pr-4 pl-10 flex items-center shadow-sm cursor-text hover:ring-2 hover:ring-purple-100 transition-shadow"
            >
                <span className="text-gray-400 text-xs font-medium truncate opacity-70">ابحث عن الاعلانات...</span>
            </div>
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none opacity-70" size={18} />
         </div>

         {/* Leaderboard Button (Middle) - Changed Icon to Trophy */}
         <button 
            onClick={onLeaderboardClick}
            className="bg-white w-[42px] h-full rounded-xl flex items-center justify-center text-gray-400 shadow-sm hover:bg-gray-50 hover:text-yellow-500 transition-colors shrink-0"
            aria-label="أفضل الأعضاء"
         >
             <Trophy size={20} strokeWidth={2} className="fill-gray-50 hover:fill-yellow-100" />
         </button>

         {/* Notifications Button (Left / End) */}
         <button 
            onClick={onNotificationsClick}
            className="bg-white w-[42px] h-full rounded-xl flex items-center justify-center text-gray-400 shadow-sm relative hover:bg-gray-50 transition-colors shrink-0"
         >
             <Bell size={20} strokeWidth={2.5} />
             {unreadCount > 0 && (
                 <div className="absolute top-2.5 right-2.5 bg-[#ef4444] text-white text-[9px] font-bold w-[12px] h-[12px] flex items-center justify-center rounded-full ring-[1.5px] ring-white">
                    {unreadCount}
                 </div>
             )}
         </button>

      </div>
    </header>
  );
};
