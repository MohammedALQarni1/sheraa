
import React, { useState } from 'react';
import { 
    Search, ChevronRight, PenSquare, Mic, 
    Smile, Plus, MessageCircle, Check, CheckCheck, 
    Trash2, AlertCircle, Video, Store,
    Send, Image as ImageIcon, Camera, MapPin, MoreVertical, UserX,
    QrCode, Sparkles, ScanLine
} from 'lucide-react';
import { BottomNav } from './BottomNav';

interface MessagesOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onProfileClick?: () => void;
  onScanClick?: () => void;
  onSendQRRequest?: () => void;
}

// Initial Data
const INITIAL_CHATS = [
    {
        id: '1',
        name: 'عنوان القهوة المختصة',
        avatar: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'انضم إلى القناة لتصلك آخر العروض',
        time: 'الآن',
        unread: 2,
        isVerified: true,
        type: 'store', 
        isOnline: true
    },
    {
        id: '2',
        name: 'فيصل العتيبي',
        avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'الله يعافيك، تم التحويل',
        time: '٠٨:٤٩ م',
        unread: 5,
        isVerified: false,
        type: 'user', 
        isOnline: false
    },
    {
        id: '3',
        name: 'محمد عبدالله',
        avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'كم وصل السوم؟',
        time: '٠٨:٤٩ ص',
        unread: 0,
        isVerified: false,
        type: 'user',
        isOnline: true
    },
    {
        id: '4',
        name: 'متجر زوايا التقنية',
        avatar: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'المنتج متوفر حالياً في فرع العليا',
        time: 'أمس',
        unread: 0,
        isVerified: true, 
        hasBadge: true,
        type: 'store',
        isOnline: true
    },
    {
        id: '5',
        name: 'سارة الخالدي',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'ممكن صور اكثر للمنتج؟',
        time: '٢٠/١',
        unread: 0,
        isVerified: false,
        type: 'user',
        isOnline: false
    },
    {
        id: '6',
        name: 'ابو فهد العقارية',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
        lastMessage: 'ارسلي الموقع لا هنت',
        time: '١٩/١',
        unread: 0,
        isVerified: false,
        type: 'user',
        isOnline: true
    }
];

const INITIAL_MESSAGES = [
    {
        id: 6,
        text: '🎁 امسح الكود عند البيع لتوثيق الصفقة واكسب نقاط مكافآت فورية! 🚀',
        sender: 'system',
        isSystem: true
    },
    {
        id: 1,
        text: 'السلام عليكم، هل المنتج لا يزال متوفر؟',
        time: '١١:٣٠ م',
        sender: 'other',
        isSystem: false
    },
    {
        id: 2,
        text: 'وعليكم السلام، نعم موجود',
        time: '١١:٣٢ م',
        sender: 'me',
        isSystem: false,
        status: 'read'
    },
    {
        id: 3,
        text: 'هذا رابط الموقع للمعاينة',
        type: 'link',
        time: '١١:٣٤ م',
        sender: 'me',
        isSystem: false,
        status: 'read'
    },
    {
        id: 4,
        text: 'ممتاز، بمرك اليوم المساء ان شاء الله',
        time: '١١:٣٥ م',
        sender: 'other',
        isSystem: false
    },
    {
        id: 5,
        text: 'تم، حياك الله أي وقت',
        time: '١١:٣٦ م',
        sender: 'me',
        isSystem: false,
        status: 'delivered'
    }
];

const TABS = [
    { id: 'all', label: 'الكل' },
    { id: 'users', label: 'شخصي' },
    { id: 'stores', label: 'متاجر' },
];

export const MessagesOverlay: React.FC<MessagesOverlayProps> = ({ 
    isOpen, 
    onClose,
    onHomeClick,
    onOffersClick,
    onProfileClick,
    onScanClick,
    onSendQRRequest
}) => {
    const [chats, setChats] = useState(INITIAL_CHATS);
    const [messages, setMessages] = useState<any[]>(INITIAL_MESSAGES);
    const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState('all');
    const [text, setText] = useState('');
    const [isAttachOpen, setIsAttachOpen] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    
    // Swipe States for Chat List (Main List)
    const [swipedChatId, setSwipedChatId] = useState<string | null>(null);
    
    // Common Touch States
    const [touchStart, setTouchStart] = useState<number>(0);
    const [touchEnd, setTouchEnd] = useState<number>(0);

    if (!isOpen) return null;

    const selectedChat = chats.find(c => c.id === selectedChatId);

    // --- Actions ---
    const handleDeleteChat = (chatId: string) => {
        setChats(prev => prev.filter(c => c.id !== chatId));
        setSwipedChatId(null);
    };

    const handleBlockUser = () => {
        alert("تم حظر المستخدم");
        setIsMenuOpen(false);
    };

    const handleClearChatMessages = () => {
        setMessages([]);
        alert("تم حذف جميع الرسائل");
        setIsMenuOpen(false);
    };

    const handleMarkAllRead = () => {
        setChats(prev => prev.map(c => ({ ...c, unread: 0 })));
    };

    const handleSend = () => {
        if (!text.trim()) return;
        const newMsg = {
            id: Date.now(),
            text: text,
            time: 'الآن',
            sender: 'me',
            isSystem: false,
            status: 'sent'
        };
        setMessages([...messages, newMsg]);
        setText('');
    };

    // Send QR Request Handler
    const handleSendQRRequest = () => {
        const newMsg = {
            id: Date.now(),
            type: 'qr_request',
            text: 'طلب مسح كود QR',
            time: 'الآن',
            sender: 'me',
            isSystem: false,
            status: 'sent'
        };
        setMessages([...messages, newMsg]);
        setIsAttachOpen(false);
        
        // Notify Parent (App.tsx) to add a system notification
        if (onSendQRRequest) {
            onSendQRRequest();
        }
    };

    // --- Touch Handlers for Main List Swipe ---
    const onTouchStart = (e: React.TouchEvent) => {
        setTouchEnd(0);
        setTouchStart(e.targetTouches[0].clientX);
    };

    const onTouchMove = (e: React.TouchEvent) => {
        setTouchEnd(e.targetTouches[0].clientX);
    };

    // Chat List Swipe Handler (Left to Right to delete)
    const onChatListTouchEnd = (chatId: string) => {
        if (!touchStart || !touchEnd) return;
        const distance = touchStart - touchEnd;
        const isLeftToRight = distance < -50;
        const isRightToLeft = distance > 50;

        if (isLeftToRight) setSwipedChatId(chatId);
        if (isRightToLeft && swipedChatId === chatId) setSwipedChatId(null);
    };

    // --- CHAT DETAIL VIEW ---
    if (selectedChatId && selectedChat) {
        return (
            <div className="absolute inset-0 z-[200] bg-[#f0f2f5] flex flex-col animate-in slide-in-from-right duration-300 font-sans h-full">
                
                {/* Chat Header */}
                <div className="bg-white/95 backdrop-blur-md px-4 pt-12 pb-3 shadow-sm flex items-center justify-between z-20 sticky top-0 border-b border-gray-100">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSelectedChatId(null)} className="text-gray-500 hover:text-gray-900 transition-colors p-2 -mr-2 rounded-full hover:bg-gray-100">
                            <ChevronRight size={26} strokeWidth={2.5} />
                        </button>
                        
                        <div className="flex items-center gap-3 cursor-pointer">
                            <div className="relative">
                                <img src={selectedChat.avatar} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" alt="" />
                                {selectedChat.isOnline && (
                                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-1">
                                    <h3 className="font-black text-gray-900 text-sm leading-none">{selectedChat.name}</h3>
                                    {selectedChat.isVerified && <CheckCheck size={14} className="text-blue-500" strokeWidth={3} />}
                                </div>
                                <p className="text-[10px] text-gray-500 font-medium mt-1 flex items-center gap-1">
                                    {selectedChat.isOnline ? (
                                        <><span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block"></span> متصل الآن</>
                                    ) : 'آخر ظهور قريباً'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600 relative">
                        <button 
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
                        >
                            <MoreVertical size={20} />
                        </button>

                        {isMenuOpen && (
                            <div className="absolute top-12 left-0 bg-white rounded-xl shadow-xl border border-gray-100 w-48 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                                <button 
                                    onClick={handleClearChatMessages}
                                    className="w-full text-right px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <Trash2 size={16} className="text-red-500" />
                                    حذف الرسائل
                                </button>
                                <div className="h-px bg-gray-50 w-full"></div>
                                <button 
                                    onClick={handleBlockUser}
                                    className="w-full text-right px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3"
                                >
                                    <UserX size={16} className="text-gray-500" />
                                    حظر المستخدم
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Body */}
                <div 
                    className="flex-1 overflow-y-auto px-4 py-4 space-y-3 relative no-scrollbar" 
                    onClick={() => { setIsAttachOpen(false); setIsMenuOpen(false); }}
                >
                    <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                         style={{ backgroundImage: 'radial-gradient(#665FCE 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
                    </div>

                    <div className="flex justify-center my-6 relative z-10">
                        <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-3 py-1 rounded-full shadow-sm border border-gray-200">اليوم</span>
                    </div>

                    {messages.map((msg) => {
                        if (msg.isSystem) {
                            return (
                                <div key={msg.id} className="flex justify-center my-4 relative z-10">
                                    <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 text-purple-800 text-[10px] font-bold px-4 py-3 rounded-2xl flex items-center gap-3 max-w-[90%] text-right shadow-sm">
                                        <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                            <QrCode size={16} className="text-purple-600" />
                                        </div>
                                        <span className="leading-relaxed">{msg.text}</span>
                                    </div>
                                </div>
                            );
                        }

                        const isMe = msg.sender === 'me';

                        return (
                            <div key={msg.id} className={`flex w-full relative z-10 ${isMe ? 'justify-end' : 'justify-start'}`}>
                                <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                                    
                                    {/* Message Bubble Logic */}
                                    {msg.type === 'qr_request' ? (
                                        <div className={`bg-white border border-gray-100 rounded-[1.2rem] rounded-bl-sm p-1 shadow-sm w-full min-w-[200px]`}>
                                            <div className="bg-gradient-to-br from-orange-50 to-white rounded-2xl p-3 border border-orange-100 flex items-center gap-3">
                                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-orange-100 shadow-sm shrink-0">
                                                    <ScanLine size={20} className="text-orange-500" strokeWidth={2.5} />
                                                </div>
                                                <div className="flex-1 text-right">
                                                    <h4 className="font-bold text-gray-900 text-xs mb-0.5">{msg.text}</h4>
                                                    <p className="text-[10px] text-gray-500">لإتمام وتوثيق العملية</p>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`px-4 py-3 shadow-sm text-sm font-medium leading-relaxed relative break-words
                                            ${isMe 
                                                ? 'bg-gradient-to-br from-[#665FCE] to-[#5a52c2] text-white rounded-[1.2rem] rounded-bl-sm' 
                                                : 'bg-white text-gray-800 rounded-[1.2rem] rounded-br-sm border border-gray-100'
                                            }`}
                                        >
                                            {msg.type === 'link' ? (
                                                <div>
                                                    <p className="underline opacity-90 mb-2">{msg.text}</p>
                                                    <div className="bg-black/10 rounded-lg p-2 flex items-center gap-2 text-[10px] font-bold">
                                                        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                                            <MapPin size={14} />
                                                        </div>
                                                        <span>موقع على الخريطة</span>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p>{msg.text}</p>
                                            )}
                                        </div>
                                    )}

                                    {/* Timestamp & Status */}
                                    <div className="flex items-center gap-1 mt-1 px-1">
                                        <span className="text-[9px] text-gray-400 font-bold opacity-80 dir-ltr">{msg.time}</span>
                                        {isMe && (
                                            <span className="text-gray-400">
                                                {msg.status === 'read' ? <CheckCheck size={14} className="text-blue-500" /> : <Check size={14} />}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Input Area */}
                <div className="bg-white p-3 pb-6 border-t border-gray-100 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] relative z-20">
                    
                    {isAttachOpen && (
                        <div className="absolute bottom-24 right-16 z-30 bg-white rounded-3xl shadow-2xl border border-gray-100 p-4 animate-in slide-in-from-bottom-2 fade-in duration-200 min-w-[220px]">
                            <div className="grid grid-cols-4 gap-3">
                                <AttachButton icon={<ImageIcon size={20} />} label="صور" color="text-purple-600" bg="bg-purple-50" />
                                <AttachButton icon={<Video size={20} />} label="فيديو" color="text-pink-600" bg="bg-pink-50" />
                                <AttachButton icon={<QrCode size={20} />} label="طلب مسح" color="text-orange-600" bg="bg-orange-50" onClick={handleSendQRRequest} />
                                <AttachButton icon={<MapPin size={20} />} label="موقع" color="text-green-600" bg="bg-green-50" />
                            </div>
                            <div className="absolute -bottom-2 right-6 w-4 h-4 bg-white border-b border-r border-gray-100 rotate-45"></div>
                        </div>
                    )}

                    <div className="flex items-end gap-2">
                        
                        <button className="w-12 h-12 flex items-center justify-center rounded-full bg-gray-50 text-gray-500 hover:bg-gray-100 transition-colors shrink-0">
                            <Mic size={22} strokeWidth={2} />
                        </button>

                        <button 
                            onClick={() => setIsAttachOpen(!isAttachOpen)}
                            className={`w-12 h-12 flex items-center justify-center transition-all duration-300 rounded-full shrink-0 ${
                                isAttachOpen 
                                ? 'bg-gray-100 text-gray-800 rotate-45' 
                                : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            <Plus size={24} />
                        </button>

                        <div className="flex-1 bg-gray-100 rounded-[1.8rem] flex items-center px-2 py-1.5 relative border border-transparent focus-within:border-purple-200 focus-within:bg-white focus-within:shadow-sm transition-all">
                             <input 
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                placeholder="اكتب رسالة..."
                                className="flex-1 bg-transparent border-none outline-none text-right px-3 py-2.5 text-sm font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-medium"
                             />
                             <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                 <Smile size={24} />
                             </button>
                        </div>

                        {text.trim() && (
                            <button 
                                onClick={handleSend}
                                className="w-12 h-12 flex items-center justify-center rounded-full bg-[#665FCE] text-white hover:bg-[#534cb3] shadow-sm shadow-purple-200 shrink-0 animate-in zoom-in duration-200"
                            >
                                <Send size={20} strokeWidth={2.5} className="ml-0.5 -rotate-90" /> 
                            </button>
                        )}

                    </div>
                </div>
            </div>
        );
    }

    // --- MAIN LIST VIEW ---
    return (
        <div className="absolute inset-0 z-[200] bg-white flex flex-col animate-in slide-in-from-right duration-300 font-sans h-full">
            
            {/* Header */}
            <div className="px-5 pt-12 pb-2 bg-white sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
                 <div className="flex justify-between items-center mb-4 relative">
                     <div className="w-10"></div> 

                     <h2 className="text-xl font-black text-gray-900 tracking-tight absolute left-1/2 transform -translate-x-1/2">
                        الرسائل
                     </h2>
                     
                     <div className="flex gap-2">
                        <button className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors" title="رسالة جديدة">
                            <PenSquare size={20} />
                        </button>
                     </div>
                 </div>

                 <div className="relative mb-4">
                    <Search size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="ابحث عن محادثة..." 
                        className="w-full bg-gray-50 rounded-2xl py-3.5 pr-11 pl-4 text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#665FCE]/10 focus:bg-white transition-all border border-gray-100"
                    />
                 </div>

                 <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3">
                    {TABS.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all border ${
                                activeTab === tab.id
                                ? 'bg-gray-900 text-white border-gray-900 shadow-md'
                                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                 </div>
            </div>

            {/* Chat List */}
            <div className="flex-1 overflow-y-auto no-scrollbar px-3 pb-24 pt-2">
                <div className="flex flex-col">
                    {chats.map((chat) => {
                        const isSwiped = swipedChatId === chat.id;
                        
                        return (
                            <div key={chat.id} className="relative overflow-hidden mb-1 rounded-3xl">
                                
                                {/* Delete Action Background (Revealed on Swipe - Left Side) */}
                                <div className="absolute inset-y-0 left-0 w-24 bg-red-500 flex items-center justify-center z-0 rounded-l-3xl">
                                    <button 
                                        onClick={(e) => { e.stopPropagation(); handleDeleteChat(chat.id); }} 
                                        className="text-white flex flex-col items-center gap-1 w-full h-full justify-center"
                                    >
                                        <Trash2 size={20} />
                                        <span className="text-[10px] font-bold">حذف</span>
                                    </button>
                                </div>

                                {/* Chat Item Card */}
                                <div 
                                    onClick={() => setSelectedChatId(chat.id)}
                                    onTouchStart={onTouchStart}
                                    onTouchMove={onTouchMove}
                                    onTouchEnd={() => onChatListTouchEnd(chat.id)}
                                    className={`relative z-10 bg-white p-3 flex items-center gap-4 transition-transform duration-300 ease-out border-b border-gray-50 cursor-pointer active:bg-gray-50 ${isSwiped ? 'translate-x-24' : 'translate-x-0'}`}
                                >
                                    <div className="relative shrink-0">
                                        <img src={chat.avatar} alt={chat.name} className="w-14 h-14 rounded-full object-cover border border-gray-100" />
                                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-[3px] border-white ${chat.isOnline ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                    </div>

                                    <div className="flex-1 min-w-0 py-1">
                                        <div className="flex justify-between items-center mb-1">
                                            <div className="flex items-center gap-1.5">
                                                <h3 className={`text-sm text-gray-900 truncate ${chat.unread > 0 ? 'font-black' : 'font-bold'}`}>
                                                    {chat.name}
                                                </h3>
                                                {chat.isVerified && <CheckCheck size={14} className="text-blue-500" strokeWidth={3} />}
                                                {chat.type === 'store' && <Store size={12} className="text-purple-500 opacity-80" />}
                                            </div>
                                            <span className={`text-[10px] font-bold ${chat.unread > 0 ? 'text-[#665FCE]' : 'text-gray-400'}`}>
                                                {chat.time}
                                            </span>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <p className={`text-xs truncate max-w-[200px] leading-relaxed ${chat.unread > 0 ? 'text-gray-900 font-bold' : 'text-gray-500 font-medium'}`}>
                                                {chat.lastMessage}
                                            </p>
                                            
                                            {chat.unread > 0 && (
                                                <div className="bg-[#665FCE] text-white text-[10px] font-bold min-w-[20px] h-[20px] flex items-center justify-center rounded-full px-1.5 shadow-sm shadow-purple-200">
                                                    {chat.unread}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                
                {chats.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                        <MessageCircle size={48} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold text-gray-500">صندوق الرسائل فارغ</p>
                    </div>
                )}
            </div>

            <BottomNav 
                onProfileClick={onProfileClick}
                onOffersClick={onOffersClick}
                onHomeClick={onHomeClick}
                onMessagesClick={() => {}} 
                onScanClick={onScanClick}
                activeTab="messages"
            />
            
        </div>
    );
};

// Helper Component for Attachment Items
const AttachButton = ({ icon, label, color, bg, onClick }: { icon: React.ReactNode, label: string, color: string, bg: string, onClick?: () => void }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 p-2 hover:bg-gray-50 rounded-2xl transition-all active:scale-95 group">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bg} ${color} shadow-sm group-hover:scale-110 transition-transform`}>
            {icon}
        </div>
        <span className="text-[10px] font-bold text-gray-600">{label}</span>
    </button>
);
