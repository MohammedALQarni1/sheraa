
import React from 'react';
import { Home, MessageSquare, User, Store, ScanLine } from 'lucide-react';

interface BottomNavProps {
  onProfileClick?: () => void;
  onOffersClick?: () => void;
  onHomeClick?: () => void;
  onScanClick?: () => void;
  onMapClick?: () => void;
  onMessagesClick?: () => void;
  activeTab?: 'home' | 'offers' | 'messages' | 'profile';
}

export const BottomNav: React.FC<BottomNavProps> = ({ 
  onProfileClick, 
  onOffersClick, 
  onHomeClick,
  onScanClick,
  onMessagesClick,
  activeTab = 'home'
}) => {
  
  // Helper to determine active state styling
  const getIconColor = (isActive: boolean) => isActive ? "text-[#665FCE]" : "text-gray-400 hover:text-[#665FCE]";
  const getStrokeWidth = (isActive: boolean) => isActive ? 2.5 : 2;

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-none">
      <div className="h-[20px]"></div> {/* Spacing for the floating button */}
      
      {/* Main Bar Container */}
      <div className="bg-white h-[80px] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] border-t border-gray-50 flex justify-between items-start px-2 relative pointer-events-auto">
        
        {/* Right Group (RTL: Appears on Right) */}
        <div className="flex flex-1 justify-around pt-3.5 pr-1">
          {/* HOME */}
          <button 
            onClick={onHomeClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors group ${getIconColor(activeTab === 'home')}`}
          >
            <Home size={22} strokeWidth={getStrokeWidth(activeTab === 'home')} className="group-hover:-translate-y-1 transition-transform" />
            <span className={`text-[10px] mt-0.5 ${activeTab === 'home' ? 'font-black' : 'font-bold'}`}>الرئيسية</span>
          </button>
          
          {/* OFFERS / MARKET */}
          <button 
            onClick={onOffersClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors group ${getIconColor(activeTab === 'offers')}`}
          >
            <Store size={22} strokeWidth={getStrokeWidth(activeTab === 'offers')} className="group-hover:-translate-y-1 transition-transform" />
            <span className={`text-[10px] mt-0.5 ${activeTab === 'offers' ? 'font-black' : 'font-bold'}`}>العروض</span>
          </button>
        </div>

        {/* Center Button Space */}
        <div className="w-16 flex justify-center relative -top-6">
            <button 
                onClick={onScanClick}
                className="w-[64px] h-[64px] bg-[#665FCE] rounded-full flex items-center justify-center text-white shadow-xl shadow-purple-200 border-[5px] border-[#f3f4f6] transform transition-transform active:scale-95 hover:scale-105 group"
            >
                <ScanLine size={32} strokeWidth={2.5} className="group-hover:scale-110 transition-transform duration-300" />
            </button>
        </div>

        {/* Left Group (RTL: Appears on Left) */}
        <div className="flex flex-1 justify-around pt-3.5 pl-1">
           {/* MESSAGES */}
          <button 
            onClick={onMessagesClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors group ${getIconColor(activeTab === 'messages')}`}
          >
            <MessageSquare size={22} strokeWidth={getStrokeWidth(activeTab === 'messages')} className="group-hover:-translate-y-1 transition-transform" />
            <span className={`text-[10px] mt-0.5 ${activeTab === 'messages' ? 'font-black' : 'font-bold'}`}>الرسائل</span>
          </button>

          {/* PROFILE */}
          <button 
            onClick={onProfileClick}
            className={`flex flex-col items-center justify-center gap-1 transition-colors group ${getIconColor(activeTab === 'profile')}`}
          >
            <User size={22} strokeWidth={getStrokeWidth(activeTab === 'profile')} className="group-hover:-translate-y-1 transition-transform" />
            <span className={`text-[10px] mt-0.5 ${activeTab === 'profile' ? 'font-black' : 'font-bold'}`}>حسابي</span>
          </button>
        </div>

      </div>
    </div>
  );
};
