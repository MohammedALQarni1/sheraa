
import React, { useState } from 'react';
import { Bell, Wallet, MessageSquare, Tag, FileText, BellOff, QrCode, ShoppingBag, CircleDollarSign } from 'lucide-react';
import { NEWS_ITEMS } from '../constants';
import { NotificationItem, NotificationType } from '../types';

interface NotificationsOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  notifications?: NotificationItem[];
  onScanClick?: () => void;
  onShowQRClick?: () => void;
  onPurchaseRequestClick?: (price: string) => void;
}

export const NotificationsOverlay: React.FC<NotificationsOverlayProps> = ({ 
    isOpen, 
    onClose, 
    notifications = [],
    onScanClick,
    onShowQRClick,
    onPurchaseRequestClick
}) => {
  const [activeTab, setActiveTab] = useState<'news' | 'notifications'>('notifications');
  
  if (!isOpen) return null;

  const getIcon = (item: NotificationItem) => {
    // Special check for Purchase Requests
    if (item.targetId?.startsWith('purchase_request:')) {
        return <CircleDollarSign size={20} className="text-[#6463C7]" strokeWidth={2.5} />;
    }

    // Special check for QR/Scan related notifications based on content or ID
    if (item.targetId === 'qr_scanner' || item.targetId === 'qr_display' || item.title.includes('QR') || item.body.includes('QR')) {
        return <QrCode size={18} className="text-gray-800" />;
    }

    switch (item.type) {
      case 'transaction': 
        // Differentiate between purchase (spending) and selling/rewards (earning) based on amount sign or context
        // Since type is generic transaction, let's use Wallet for points
        return <Wallet size={18} className="text-green-600" />;
      case 'message': return <MessageSquare size={18} className="text-blue-600" />;
      case 'offer': return <Tag size={18} className="text-purple-600" />;
      case 'ad': return <FileText size={18} className="text-orange-600" />;
      case 'system': return <Bell size={18} className="text-gray-600" />;
      default: return <Bell size={18} className="text-gray-600" />;
    }
  };

  const getBackground = (item: NotificationItem) => {
    // Special background for Purchase Requests
    if (item.targetId?.startsWith('purchase_request:')) {
        return 'bg-[#f4f3ff] border border-[#6463C7]/20 shadow-sm';
    }

    if (item.targetId === 'qr_scanner' || item.targetId === 'qr_display' || item.title.includes('QR') || item.body.includes('QR')) {
        return 'bg-gray-200';
    }

    switch (item.type) {
      case 'transaction': return 'bg-green-100';
      case 'message': return 'bg-blue-100';
      case 'offer': return 'bg-purple-100';
      case 'ad': return 'bg-orange-100';
      default: return 'bg-gray-100';
    }
  };

  // Filter out messages strictly for this view
  const displayNotifications = notifications.filter(n => n.type !== 'message');
  
  // Calculate counts excluding messages
  const unreadNotifications = displayNotifications.filter(n => !n.isRead).length;

  const handleNotificationClick = (note: NotificationItem) => {
      // Mark as read logic would typically go here (update via callback to parent)
      
      if (note.targetId) {
          // If it's a Purchase Request (Seller receives from Buyer)
          if (note.targetId.startsWith('purchase_request:')) {
              const price = note.targetId.split(':')[1];
              if (onPurchaseRequestClick) onPurchaseRequestClick(price);
          }
          // If it's a QR Display notification (Show my QR)
          else if (note.targetId === 'qr_display' && onShowQRClick) {
              onShowQRClick();
          }
          // If it's a QR Scan notification (Open Camera)
          else if (note.targetId === 'qr_scanner' && onScanClick) {
              onScanClick();
          }
      }
  };

  return (
    <div className="absolute inset-0 z-[100] bg-[#f3f4f6] flex flex-col animate-in slide-in-from-bottom duration-300">
      
      {/* Header */}
      <div className="bg-[#f3f4f6] px-4 pt-12 pb-2 flex justify-between items-center relative z-10">
         {/* Left: Close Button */}
         <button onClick={onClose} className="text-base font-bold text-gray-800 hover:text-gray-600">
            إغلاق
         </button>

         {/* Center: Title */}
         <h2 className="text-lg font-bold text-gray-900 absolute left-1/2 transform -translate-x-1/2">
            التنبيهات
         </h2>
         
         {/* Right: Actions (Spacer to maintain layout balance if needed, though title is absolute) */}
         <div className="w-10"></div> 
      </div>

      {/* Tabs Segmented Control */}
      <div className="px-4 py-2">
        <div className="bg-[#e5e7eb] rounded-xl p-1 flex">
            <button 
                onClick={() => setActiveTab('notifications')}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all text-center ${activeTab === 'notifications' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                التنبيهات {unreadNotifications > 0 && `(${unreadNotifications})`}
            </button>
            <button 
                onClick={() => setActiveTab('news')}
                className={`flex-1 py-1.5 text-sm font-bold rounded-lg transition-all text-center ${activeTab === 'news' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
                الأخبار
            </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 py-2 no-scrollbar">
        
        {/* TAB: NOTIFICATIONS */}
        {activeTab === 'notifications' && (
             <div className="space-y-3 mt-1 pb-10">
                {displayNotifications.length > 0 ? (
                    displayNotifications.map((note) => (
                        <div 
                            key={note.id} 
                            onClick={() => handleNotificationClick(note)}
                            className={`relative flex gap-4 p-4 rounded-2xl border transition-all cursor-pointer active:scale-[0.98] ${note.isRead ? 'bg-white border-gray-100' : 'bg-purple-50/50 border-purple-100'}`}
                        >
                            {/* Status Indicator for Unread */}
                            {!note.isRead && (
                                <span className="absolute top-4 left-4 w-2 h-2 rounded-full bg-purple-500 ring-2 ring-white"></span>
                            )}

                            {/* Icon Box */}
                            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${getBackground(note)}`}>
                                {getIcon(note)}
                            </div>

                            {/* Text Content */}
                            <div className="flex-1 min-w-0 text-right">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className={`text-sm ${note.isRead ? 'font-bold text-gray-800' : 'font-black text-gray-900'}`}>{note.title}</h4>
                                    <span className="text-[10px] text-gray-400 whitespace-nowrap mr-2">{note.time}</span>
                                </div>
                                
                                <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                                    {note.body}
                                </p>

                                {note.amount && (
                                    <div className="mt-2 inline-flex items-center gap-1 bg-green-50 text-green-700 px-2 py-0.5 rounded text-[10px] font-bold">
                                        <Wallet size={10} />
                                        <span>+{note.amount} نقطة</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                         <BellOff size={64} className="mb-4 text-gray-400" fill="currentColor" />
                         <h3 className="font-bold text-gray-800 text-lg mb-2">لا توجد تنبيهات</h3>
                    </div>
                )}
             </div>
        )}

        {/* TAB: NEWS */}
        {activeTab === 'news' && (
            <div className="space-y-4 pb-10">
                {NEWS_ITEMS.length > 0 ? (
                    NEWS_ITEMS.map((item) => (
                        <div key={item.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
                             {/* Image Banner */}
                             <div className="h-40 bg-gray-200 relative">
                                <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4">
                                     <h3 className="text-white font-bold text-xl drop-shadow-md text-center px-4">
                                         {item.bannerText}
                                     </h3>
                                </div>
                             </div>
                             
                             {/* Body */}
                             <div className="p-4 text-right">
                                 <h4 className="text-gray-900 font-bold mb-2">{item.title}</h4>
                                 <p className="text-gray-500 text-xs leading-relaxed mb-3">
                                     {item.description}
                                 </p>
                                 <div className="text-left text-[10px] text-gray-400 font-medium">
                                     {item.time}
                                 </div>
                             </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center h-[50vh] text-gray-400">
                         <BellOff size={64} className="mb-4 text-gray-400" fill="currentColor" />
                         <h3 className="font-bold text-gray-800 text-lg mb-2">لا توجد تحديثات</h3>
                         <p className="text-xs text-center text-gray-500 max-w-[250px] leading-relaxed">
                            يمنحك قسم الأخبار تحديثات فورية لنشاطاتك أو نشاطات القنوات والمستخدمين الآخرين الذين تتفاعل معهم.
                         </p>
                    </div>
                )}
            </div>
        )}

      </div>
    </div>
  );
};
