
import React, { useState, useRef, useMemo } from 'react';
import { 
    ChevronRight, Share2, Heart, Flag, Clock, MapPin, 
    MessageCircle, Phone, Send, QrCode, Crown, ShieldCheck, User, Wifi, Reply, X, CornerDownLeft, BellRing,
    Hash, Copy, Image as ImageIcon, CircleDollarSign, LayoutList, MoreHorizontal, FileWarning, BadgeCheck
} from 'lucide-react';
import { AdItem, FeedItem } from '../types';
import { FEED_ITEMS, MOCK_USER } from '../constants';
import { BottomNav } from './BottomNav';

interface AdDetailsOverlayProps {
  ad: AdItem;
  onClose: () => void;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onMessagesClick?: () => void;
  onProfileClick?: () => void;
  onScanClick?: () => void;
}

interface Comment {
    id: number;
    user: string;
    avatar: string;
    text: string;
    time: string;
    replies?: Comment[]; // Nested replies
}

const PLACEHOLDER_IMAGE = "https://placehold.co/600x400/f3f4f6/9ca3af?text=No+Image";

// Extracted Comment Block Component
const CommentBlock: React.FC<{ 
    comment: Comment; 
    isReply?: boolean; 
    onReply: (id: number, user: string) => void 
}> = ({ comment, isReply = false, onReply }) => (
    <div className={`flex flex-col ${isReply ? 'mt-3 mr-8 relative' : 'mt-4'}`}>
        
        {/* Connecting Line for Replies */}
        {isReply && (
           <div className="absolute -right-6 top-4 w-4 h-4 border-b border-r border-gray-200 rounded-br-xl rotate-90 opacity-60 pointer-events-none"></div>
        )}

        <div className="flex gap-3 group">
            {/* Avatar */}
            <div className="shrink-0 relative z-10">
                <img 
                    src={comment.avatar} 
                    alt={comment.user} 
                    className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full border border-gray-100 object-cover bg-white`} 
                />
            </div>
            
            <div className="flex-1 min-w-0">
                {/* Bubble */}
                <div className={`border rounded-2xl rounded-tr-none px-4 py-3 relative ${isReply ? 'bg-gray-50/50 border-gray-100' : 'bg-gray-50 border-gray-100'}`}>
                    <div className="flex justify-between items-start mb-1">
                        <h4 className={`font-bold text-gray-900 truncate ${isReply ? 'text-[11px]' : 'text-xs'}`}>{comment.user}</h4>
                        <span className="text-[9px] text-gray-400 shrink-0 mr-2">{comment.time}</span>
                    </div>
                    <p className={`text-gray-600 font-medium leading-relaxed break-words ${isReply ? 'text-[11px]' : 'text-xs'}`}>
                        {comment.text}
                    </p>
                </div>

                {/* Action Row */}
                {!isReply && (
                    <div className="flex items-center gap-4 mt-1.5 mr-2">
                        <button 
                            onClick={() => onReply(comment.id, comment.user)}
                            className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            <CornerDownLeft size={12} className="" />
                            <span>رد</span>
                        </button>
                    </div>
                )}
            </div>

            {/* Report Button */}
            <div className="shrink-0 self-start mt-2">
                <button 
                    className="w-7 h-7 rounded-full bg-gray-50 hover:bg-red-50 text-gray-300 hover:text-red-500 flex items-center justify-center transition-colors"
                    title="إبلاغ عن التعليق"
                >
                    <Flag size={14} />
                </button>
            </div>
        </div>

        {/* Render Replies Recursively */}
        {comment.replies && comment.replies.length > 0 && (
            <div className="relative">
                {/* Vertical Line for threading */}
                <div className="absolute right-5 top-0 bottom-4 w-px bg-gray-100/80"></div>
                
                {comment.replies.map(reply => (
                    <CommentBlock key={reply.id} comment={reply} isReply={true} onReply={onReply} />
                ))}
            </div>
        )}
    </div>
);

export const AdDetailsOverlay: React.FC<AdDetailsOverlayProps> = ({ 
    ad, 
    onClose,
    onHomeClick,
    onOffersClick,
    onMessagesClick,
    onProfileClick,
    onScanClick
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const images = ad.images && ad.images.length > 0 ? ad.images : [ad.image];
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Track failed images to swap them
  const [failedImages, setFailedImages] = useState<Record<number, boolean>>({});
  
  // Price Alert State
  const [isPriceAlertOn, setIsPriceAlertOn] = useState(false);

  // Report Overlay State
  const [showReportOverlay, setShowReportOverlay] = useState(false);

  // Generate a consistent 6-digit reference number based on ID (or random if dynamic)
  const referenceNumber = useMemo(() => {
      // Simple hash to get 6 digits
      let hash = 0;
      for (let i = 0; i < ad.id.length; i++) {
          hash = ad.id.charCodeAt(i) + ((hash << 5) - hash);
      }
      const positiveHash = Math.abs(hash);
      return (positiveHash % 900000) + 100000; // Ensures 6 digits
  }, [ad.id]);

  const handleImageError = (index: number) => {
      setFailedImages(prev => ({ ...prev, [index]: true }));
  };

  const getImageSrc = (index: number) => {
      if (failedImages[index]) return PLACEHOLDER_IMAGE;
      return images[index];
  };

  // Comments State with Nested Structure
  const [comments, setComments] = useState<Comment[]>([
      { 
          id: 1, 
          user: 'سعد القحطاني', 
          avatar: 'https://i.pravatar.cc/150?u=saad', 
          text: 'هل السعر قابل للتفاوض للصامل؟', 
          time: 'منذ 2 ساعة',
          replies: [
              {
                  id: 101,
                  user: 'معرض النخبة',
                  avatar: ad.user.avatar, // Seller avatar
                  text: 'حياك الله اخوي سعد، تواصل معنا واتساب وما نقصر معك',
                  time: 'منذ ساعة'
              }
          ]
      },
      { 
          id: 2, 
          user: 'متجر الفخامة', 
          avatar: 'https://i.pravatar.cc/150?u=store', 
          text: 'تبدل بآيفون 13 برو نظيف؟', 
          time: 'منذ 5 ساعات' 
      }
  ]);
  
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<{ id: number; user: string } | null>(null);

  // Similar ads calculation (same category, excluding current)
  const similarAds = FEED_ITEMS.filter(
      item => item.type === 'ad' && item.category === ad.category && item.id !== ad.id
  ) as AdItem[];

  // Helper to determine Tier based on reputation
  const getTierInfo = (reputation: number = 0) => {
      if (reputation >= 5000) return { label: 'ماسي', color: 'bg-cyan-50 text-cyan-700 border-cyan-100', icon: Crown, fill: "fill-cyan-200" };
      if (reputation >= 500) return { label: 'بلاتيني', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: ShieldCheck, fill: "fill-slate-300" };
      if (reputation >= 50) return { label: 'ذهبي', color: 'bg-amber-50 text-amber-700 border-amber-100', icon: Crown, fill: "fill-amber-200" };
      return { label: 'مبتدئ', color: 'bg-gray-50 text-gray-500 border-gray-100', icon: User, fill: "fill-gray-200" };
  };

  const tier = getTierInfo(ad.user.reputation);
  const TierIcon = tier.icon;

  const handleReplyClick = (commentId: number, userName: string) => {
      setReplyingTo({ id: commentId, user: userName });
      if (inputRef.current) {
          inputRef.current.focus();
      }
  };

  const handleCancelReply = () => {
      setReplyingTo(null);
  };

  // Recursive function to add reply to the correct parent
  const addReplyToComment = (nodes: Comment[], parentId: number, reply: Comment): Comment[] => {
      return nodes.map(node => {
          if (node.id === parentId) {
              return { ...node, replies: [...(node.replies || []), reply] };
          }
          if (node.replies) {
              return { ...node, replies: addReplyToComment(node.replies, parentId, reply) };
          }
          return node;
      });
  };

  const handleSendComment = () => {
      if (!newComment.trim()) return;

      const newCommentObj: Comment = {
          id: Date.now(),
          user: MOCK_USER.name,
          avatar: MOCK_USER.avatar,
          text: newComment,
          time: 'الآن'
      };

      if (replyingTo) {
          // Add as a reply
          setComments(prevComments => addReplyToComment(prevComments, replyingTo.id, newCommentObj));
      } else {
          // Add as a root comment
          setComments([...comments, newCommentObj]);
      }

      setNewComment('');
      setReplyingTo(null);
  };

  const handleReportOptionClick = () => {
      alert("تم استلام بلاغك، شكراً لمساعدتنا في تحسين الخدمة.");
      setShowReportOverlay(false);
  };

  return (
    <div className="absolute inset-0 z-[150] bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300 overflow-hidden">
      
      {/* --- Report Overlay (Full Screen) --- */}
      {showReportOverlay && (
          <div className="absolute inset-0 z-[200] bg-white animate-in fade-in duration-200 flex flex-col">
              {/* Header */}
              <div className="pt-12 px-6 flex justify-between items-center mb-10">
                  <button onClick={() => setShowReportOverlay(false)} className="p-2 -mr-2 text-gray-800 hover:bg-gray-100 rounded-full transition-colors">
                      <X size={28} />
                  </button>
                  <h2 className="text-xl font-black text-gray-900">التبليغ عن اعلان</h2>
                  <div className="w-8"></div>
              </div>

              {/* Options Grid */}
              <div className="flex-1 px-6">
                  <div className="grid grid-cols-3 gap-y-12 gap-x-4 justify-items-center">
                        {/* 1. Sold */}
                        <button onClick={handleReportOptionClick} className="flex flex-col items-center gap-3 group w-full">
                            <div className="w-24 h-24 rounded-full border border-gray-100 flex items-center justify-center text-[#6463C7] group-hover:bg-purple-50 group-active:scale-95 transition-all shadow-sm">
                                <CircleDollarSign size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-bold text-gray-800">اعلان تم بيعه</span>
                        </button>

                        {/* 2. Inappropriate */}
                        <button onClick={handleReportOptionClick} className="flex flex-col items-center gap-3 group w-full">
                            <div className="w-24 h-24 rounded-full border border-gray-100 flex items-center justify-center text-[#6463C7] group-hover:bg-purple-50 group-active:scale-95 transition-all shadow-sm">
                                <ImageIcon size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-bold text-gray-800 whitespace-nowrap">اعلان مخل بالآداب</span>
                        </button>

                        {/* 3. Wrong Section */}
                        <button onClick={handleReportOptionClick} className="flex flex-col items-center gap-3 group w-full">
                            <div className="w-24 h-24 rounded-full border border-gray-100 flex items-center justify-center text-[#6463C7] group-hover:bg-purple-50 group-active:scale-95 transition-all shadow-sm">
                                <LayoutList size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-bold text-gray-800 text-center leading-tight">اعلان في القسم الخطأ</span>
                        </button>

                        {/* 4. Other */}
                        <button onClick={handleReportOptionClick} className="flex flex-col items-center gap-3 group w-full">
                            <div className="w-24 h-24 rounded-full border border-gray-100 flex items-center justify-center text-[#6463C7] group-hover:bg-purple-50 group-active:scale-95 transition-all shadow-sm">
                                <MoreHorizontal size={32} strokeWidth={1.5} />
                            </div>
                            <span className="text-sm font-bold text-gray-800">غير ذلك</span>
                        </button>
                  </div>
              </div>
          </div>
      )}

      {/* Top Bar (Absolute) */}
      <div className="absolute top-0 left-0 right-0 p-4 pt-12 z-20 flex justify-between items-center pointer-events-none">
          <button 
            onClick={onClose}
            className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-800 shadow-sm pointer-events-auto border border-gray-100 hover:bg-white transition-colors"
          >
              <ChevronRight size={24} />
          </button>

          <div className="flex gap-2 pointer-events-auto">
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors border border-gray-100/50 hover:bg-white">
                  <Heart size={20} strokeWidth={1.5} />
              </button>
              <button className="w-10 h-10 bg-white/90 backdrop-blur-sm rounded-xl flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors border border-gray-100/50 hover:bg-white">
                  <Share2 size={20} strokeWidth={1.5} />
              </button>
          </div>
      </div>

      {/* Main Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-24 bg-white">
        
        {/* Image Gallery Section */}
        <div className="bg-white pb-2 relative">
            <div className="w-full h-60 bg-gray-200 relative flex items-center justify-center overflow-hidden">
                <img 
                    src={getImageSrc(selectedImageIndex)} 
                    onError={() => handleImageError(selectedImageIndex)}
                    alt={ad.title} 
                    className="w-full h-full object-cover object-center" 
                />
                <div className="absolute top-0 left-0 right-0 h-28 bg-gradient-to-b from-black/40 to-transparent pointer-events-none"></div>

                {/* Featured Badge */}
                {ad.isFeatured && (
                    <div className="absolute bottom-4 right-4 z-10 bg-yellow-400 text-gray-900 px-2.5 py-1 rounded-lg shadow-sm border border-yellow-500/10 flex items-center gap-1.5 animate-in fade-in zoom-in duration-300">
                        <Crown size={12} fill="currentColor" className="text-gray-900" />
                        <span className="text-[10px] font-bold">مميز</span>
                    </div>
                )}
            </div>
            
            <div className="flex gap-3 px-4 mt-3 overflow-x-auto no-scrollbar justify-center">
                {images.map((img, idx) => (
                    <button 
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`w-12 h-12 rounded-md overflow-hidden bg-white flex-shrink-0 transition-all border border-gray-100 ${
                            idx === selectedImageIndex 
                            ? 'opacity-100' 
                            : 'opacity-60'
                        }`}
                    >
                        <img 
                            src={getImageSrc(idx)} 
                            onError={() => handleImageError(idx)}
                            className="w-full h-full object-cover" 
                            alt="thumb" 
                        />
                    </button>
                ))}
            </div>
            
            <div className="px-4 mt-3 mb-2">
                <div className="bg-[#f8f9fa] rounded-lg py-1.5 text-center text-[10px] font-medium text-gray-400 border border-gray-50">
                    عدد الأشخاص الذين شاهدوا الإعلان ( {ad.views || 4} )
                </div>
            </div>

            <div className="mx-4 mt-4 h-px bg-gray-100"></div>

            <div className="px-4 mt-4 text-center">
                <h1 className="text-sm font-black text-gray-900 leading-snug">{ad.title}</h1>
            </div>
        </div>

        {/* Info Section */}
        <div className="bg-white px-4 mt-4">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">معلومات الاعلان</h2>
                <div className="flex items-center gap-1 text-gray-400 text-[10px] font-medium bg-gray-50 px-2 py-1 rounded-full">
                    <Clock size={12} strokeWidth={1.5} />
                    <span>منذ ساعة</span>
                </div>
            </div>
            
            <div className="space-y-2.5">
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center border border-gray-50">
                     <span className="text-gray-500 font-medium text-xs">الماركة</span>
                     <span className="text-gray-900 font-bold text-sm">تويوتا</span>
                </div>
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center border border-gray-50">
                    <span className="text-gray-500 font-medium text-xs">النوع</span>
                    <span className="text-gray-900 font-bold text-sm">يارس</span>
                </div>
                {/* 6-Digit Reference Number */}
                <div className="bg-gray-50 rounded-xl px-4 py-3 flex justify-between items-center border border-gray-50">
                    <span className="text-gray-500 font-medium text-xs flex items-center gap-1">
                        رقم المرجع
                    </span>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => alert("تم نسخ الرقم")}
                            className="text-gray-400 hover:text-purple-600 transition-colors"
                        >
                            <Copy size={12} />
                        </button>
                        <span className="text-purple-600 font-black text-sm tracking-widest dir-ltr font-mono bg-purple-50 px-2 py-0.5 rounded border border-purple-100/50">
                            #{referenceNumber}
                        </span>
                    </div>
                </div>
            </div>
        </div>

        <div className="mx-4 mt-6 h-px bg-gray-100"></div>

        <div className="bg-white mt-6 px-4">
            <h2 className="text-sm font-bold text-gray-900 mb-4 text-right">الوصف</h2>
            <p className="text-gray-800 text-sm leading-7 text-right font-medium">
                {ad.description || ad.title}
            </p>
            <div className="flex justify-center mt-6">
                <button 
                    onClick={() => setShowReportOverlay(true)}
                    className="flex items-center gap-2 text-gray-400 text-[10px] hover:text-red-500 transition-colors bg-gray-50 px-3 py-1.5 rounded-full"
                >
                    <Flag size={12} />
                    <span>بلغ عن اساءة</span>
                </button>
            </div>
        </div>

        {/* Location & Price Section (Redesigned) */}
        <div className="bg-white mt-6 px-4 py-5 border-t border-b border-gray-100">
            
            {/* Location with Neighborhood */}
            <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                     <MapPin size={16} />
                </div>
                <div>
                     <span className="text-[10px] font-bold text-gray-400 block">الموقع</span>
                     <span className="text-sm font-bold text-gray-800">
                         {ad.location} <span className="text-gray-300 mx-1">-</span> <span className="text-gray-600">حي النزهة</span>
                     </span>
                </div>
            </div>

            {/* Price Box with Notify Button */}
            <div className="bg-gray-50 rounded-2xl p-4 flex items-center justify-between border border-gray-100">
                
                {/* Price Display */}
                <div>
                     <span className="text-[10px] font-bold text-gray-400 block mb-1">السعر المطلوب</span>
                     <div className="flex items-end gap-1 font-black text-[#6d28d9] text-2xl leading-none dir-ltr">
                        <span>{ad.price.toLocaleString()}</span>
                        <span className="text-xs font-bold pb-1 text-gray-500">{ad.currency}</span>
                     </div>
                </div>

                {/* Price Drop Alert Button */}
                <button 
                    onClick={() => setIsPriceAlertOn(!isPriceAlertOn)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all active:scale-95 border ${
                        isPriceAlertOn
                        ? 'bg-purple-100 text-purple-700 border-purple-200'
                        : 'bg-white text-gray-500 shadow-sm border-gray-200 hover:border-gray-300'
                    }`}
                >
                    <BellRing size={16} className={isPriceAlertOn ? "fill-purple-700" : ""} />
                    <span className="text-[10px] font-bold">
                        {isPriceAlertOn ? 'تنبيه مفعل' : 'راقب السعر'}
                    </span>
                </button>
            </div>

        </div>

        {/* Seller Card (Updated Badge Logic) */}
        <div className="mx-4 mt-8 bg-gradient-to-br from-[#fcfaff] to-white rounded-2xl p-4 border border-purple-100 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-100 via-purple-200 to-purple-100 opacity-50"></div>
            <div className="flex justify-between items-center relative z-10">
                <div className="flex flex-col items-center gap-1">
                    <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-white shadow-sm p-0.5 relative">
                        <img src={ad.user.avatar} alt={ad.user.name} className="w-full h-full rounded-xl object-cover" />
                    </div>
                </div>
                <div className="flex-1 text-right px-4">
                    <div className="flex items-center gap-1.5 mb-1.5">
                        <h3 className="font-black text-gray-900 text-sm">{ad.user.name}</h3>
                        {ad.user.role === 'store' && (
                            <BadgeCheck size={16} className="text-blue-500 fill-blue-50" />
                        )}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2">
                         <span className={`text-[9px] px-2 py-0.5 rounded-md font-bold border ${ad.user.role === 'store' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                            {ad.user.role === 'store' ? 'بائع مميز' : 'عضو'}
                         </span>
                         <div className={`flex items-center gap-1 px-2 py-0.5 rounded-md border ${tier.color}`}>
                            <TierIcon size={10} className={tier.fill ? tier.fill : "fill-current"} />
                            <span className="text-[9px] font-bold">{tier.label}</span>
                         </div>
                         <div className="flex items-center gap-1 px-2 py-0.5 rounded-md border border-green-100 bg-green-50 text-green-700">
                             <Wifi size={10} strokeWidth={2.5} />
                             <span className="text-[9px] font-bold">متصل</span>
                         </div>
                    </div>
                    <div className="flex items-center flex-wrap gap-2 text-[10px] text-gray-400 font-medium">
                        <div className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded border border-gray-100">
                            <span className="text-gray-400">ID:</span>
                            <span className="dir-ltr font-bold text-gray-600">849021</span>
                        </div>
                        <div className="flex items-center gap-1 bg-white/50 px-1.5 py-0.5 rounded border border-gray-100">
                            <span className="text-gray-400">انضم:</span>
                            <span className="dir-ltr font-bold text-gray-600">15 / 03 / 2023</span>
                        </div>
                    </div>
                </div>
                <div>
                    <button className="bg-white text-[#6d28d9] border border-purple-100 text-xs font-bold px-4 py-2 rounded-xl shadow-sm hover:bg-purple-50 transition-colors">
                        متابعة
                    </button>
                </div>
            </div>
        </div>

        {/* Contact Icons */}
        <div className="mt-3 mx-4 flex items-center gap-2.5 px-1">
            <button className="flex items-center justify-center gap-2 group bg-blue-50 border border-blue-100 rounded-xl py-2.5 shadow-sm hover:shadow-md transition-all flex-1 active:scale-95">
                <Phone size={18} className="text-blue-600 fill-blue-100" />
                <span className="text-xs font-bold text-blue-700">اتصل</span>
            </button>
            <button className="flex items-center justify-center gap-2 group bg-green-50 border border-green-100 rounded-xl py-2.5 shadow-sm hover:shadow-md transition-all flex-1 active:scale-95">
                 <MessageCircle size={18} className="text-green-600 fill-green-100" />
                 <span className="text-xs font-bold text-green-700">واتساب</span>
            </button>
            <button className="flex items-center justify-center gap-2 group bg-purple-50 border border-purple-100 rounded-xl py-2.5 shadow-sm hover:shadow-md transition-all flex-1 active:scale-95">
                <Send size={18} className="text-purple-600 fill-purple-100 rotate-180" />
                <span className="text-xs font-bold text-purple-700">راسل</span>
            </button>
        </div>

        <div className="mx-4 mt-6 h-px bg-gray-100"></div>

        {/* QR */}
        <div className="mt-6 mx-4">
            <div className="bg-gradient-to-r from-purple-50 to-white border border-purple-100 rounded-2xl p-4 flex items-center justify-between shadow-sm relative overflow-hidden group cursor-pointer">
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-purple-100/50 rounded-full blur-2xl"></div>
                <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-purple-50/50 rounded-full blur-2xl"></div>
                <div className="flex-1 text-right relative z-10 pr-2">
                    <h4 className="font-black text-sm mb-1 text-gray-900">مبروك الصفقة! 🤝 نقاطك بانتظارك</h4>
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                        استلمت طلبك؟ لا تروح عليك النقاط! اطلب رمز الـ QR من البائع وامسحه عشان تكسب نقاط ولاء فورية 🎁
                    </p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center ml-2 shrink-0 border border-purple-200 shadow-inner">
                    <QrCode size={24} className="text-purple-600" />
                </div>
            </div>
        </div>

        {/* Replies Section */}
        <div className="mt-8 mx-4 pb-4">
            <div className="flex justify-between items-end mb-4 px-1">
                <h3 className="text-right font-black text-sm text-gray-900">التعليقات ({comments.length})</h3>
                <span className="text-[10px] text-gray-400">آخر تحديث الآن</span>
            </div>
            
            {/* Input Field Area */}
            <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden mb-6 focus-within:border-purple-200 focus-within:ring-2 focus-within:ring-purple-50 transition-all sticky top-0 z-10">
                
                {/* Reply Context Banner */}
                {replyingTo && (
                    <div className="bg-purple-50 px-3 py-2 flex justify-between items-center border-b border-purple-100">
                        <div className="flex items-center gap-2">
                            <Reply size={14} className="text-purple-600" />
                            <span className="text-xs font-bold text-purple-700">
                                الرد على <span className="underline">{replyingTo.user}</span>
                            </span>
                        </div>
                        <button onClick={handleCancelReply} className="p-1 hover:bg-purple-100 rounded-full text-purple-600 transition-colors">
                            <X size={14} />
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2 p-2">
                    <input 
                    ref={inputRef}
                    type="text" 
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                    placeholder={replyingTo ? `اكتب ردك على ${replyingTo.user}...` : "أضف استفساراً للبائع..."}
                    className="bg-transparent flex-1 text-right text-sm outline-none placeholder:text-gray-400 font-medium h-10 px-2"
                    />

                    <button 
                        onClick={handleSendComment}
                        className={`w-10 h-10 rounded-xl text-white flex items-center justify-center shadow-lg transition-all shrink-0 active:scale-95 ${
                            newComment.trim() 
                            ? 'bg-[#6d28d9] shadow-purple-200 hover:bg-[#5b21b6]' 
                            : 'bg-gray-300 shadow-none cursor-default'
                        }`}
                    >
                        <Send size={16} className="rotate-180 mr-0.5" fill="currentColor" />
                    </button>
                </div>
            </div>

            {/* Comments List Tree */}
            <div className="space-y-0">
                {comments.map((comment) => (
                    <CommentBlock key={comment.id} comment={comment} onReply={handleReplyClick} />
                ))}
            </div>
        </div>

        {/* Similar Ads */}
        {similarAds.length > 0 && (
            <div className="bg-white mt-4 px-4 mb-6 border-t border-gray-50 pt-6">
                 <h3 className="text-right font-bold text-gray-900 mb-4 text-sm">قد يعجبك أيضاً</h3>
                 <div className="flex gap-3 overflow-x-auto no-scrollbar pb-4">
                     {similarAds.map(item => (
                         <div key={item.id} className="min-w-[140px] max-w-[140px] cursor-pointer group bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                             <div className="h-24 bg-gray-100 relative">
                                 <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={item.title} />
                             </div>
                             <div className="text-right p-2">
                                 <h4 className="text-xs font-bold text-gray-900 leading-snug mb-2 line-clamp-1">{item.title}</h4>
                                 <div className="text-[#6d28d9] font-black text-sm text-center" dir="rtl">
                                      {item.price.toLocaleString()} ر.س
                                 </div>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        )}

      </div>

      <BottomNav 
        activeTab='home' 
        onHomeClick={onHomeClick}
        onOffersClick={onOffersClick}
        onMessagesClick={onMessagesClick}
        onProfileClick={onProfileClick}
        onScanClick={onScanClick}
      />
    </div>
  );
};
