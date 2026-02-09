
import React, { useState, useMemo } from 'react';
import { X, Check, Globe, Sparkles, ScanLine, Phone, Info, MapPin, ChevronRight, Heart, Share2, Ticket, ChevronLeft, Mail, Instagram, ExternalLink, Copy, AlertTriangle, ArrowDown, Coins, ArrowRight, ShoppingBag, Map, Wifi, Car, Calendar, Truck, Clock, ChevronDown, ChevronUp, MessageCircle, Ghost, Music2, Tag, Percent, Plus } from 'lucide-react';
import { RewardItem } from '../types';
import { MOCK_USER } from '../constants';
import { StoreBranchesOverlay } from './StoreBranchesOverlay';
// BottomNav import removed as it is not needed in this overlay and blocks the footer

interface OfferDetailsOverlayProps {
  offer: RewardItem;
  onClose: () => void;
  onScanClick?: () => void;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onMessagesClick?: () => void;
  onProfileClick?: () => void;
  onRechargeClick?: () => void;
}

// Helper to generate realistic sub-offers based on brand/category
const getSubOffers = (offer: RewardItem) => {
    const brand = offer.brandName;
    const category = offer.category;

    // --- 1. RESTAURANTS ---
    if (brand === 'Al Baik') return [
        { id: 1, title: 'وجبة دجاج مسحب 7 قطع', points: 300, image: 'https://images.unsplash.com/photo-1562967960-f0d7e488107c?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'وجبة بيج بيك حراق', points: 450, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'ساندوتش فيليه دجاج', points: 200, image: 'https://images.unsplash.com/photo-1619250907688-97733276aa84?auto=format&fit=crop&q=80&w=200' },
        { id: 4, title: 'آيس كريم فانيلا مع صوص', points: 50, image: 'https://images.unsplash.com/photo-1560008581-09826d1de69e?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Herfy') return [
        { id: 1, title: 'وجبة سوبر هرفي', points: 350, image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'وجبة تورتيلا دجاج', points: 300, image: 'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'آيس كريم هرفي', points: 40, image: 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Starbucks') return [
        { id: 1, title: 'قهوة لاتيه (وسط)', points: 200, image: 'https://images.unsplash.com/photo-1570968995847-cf4471f43477?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'فرابتشينو كراميل', points: 280, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'كيكة العسل', points: 250, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Dunkin\'') return [
        { id: 1, title: 'قهوة سوداء (كبير)', points: 100, image: 'https://images.unsplash.com/photo-1559305616-3a99c545eb32?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'بوكس دونات 6 قطع', points: 350, image: 'https://images.unsplash.com/photo-1551024601-5629f977c812?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'مشروب بارد', points: 150, image: 'https://images.unsplash.com/photo-1499961024600-ad094aba8762?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Domino\'s') return [
        { id: 1, title: 'بيتزا كبيرة (خضار)', points: 400, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'أجنحة دجاج (10 قطع)', points: 300, image: 'https://images.unsplash.com/photo-1527477396000-6489b5bd16f3?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'كيكة الشوكولاتة', points: 150, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=200' },
    ];

    // --- 2. SHOPPING & RETAIL ---
    if (brand === 'Jarir Bookstore') return [
        { id: 1, title: 'قسيمة شرائية 50 ريال', points: 500, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'قسيمة شرائية 100 ريال', points: 950, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'خصم 20% على الكتب', points: 150, image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Nahdi Pharmacy') return [
        { id: 1, title: 'قسيمة شرائية 50 ريال', points: 500, image: 'https://images.unsplash.com/photo-1585232064036-72cb7bf32f40?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'خصم 15% منتجات تجميل', points: 200, image: 'https://images.unsplash.com/photo-1522335789203-abd6538d8ad3?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Sephora') return [
        { id: 1, title: 'قسيمة 100 ريال', points: 1000, image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'مسكرة مجانية', points: 600, image: 'https://images.unsplash.com/photo-1512207848435-c73be4122746?auto=format&fit=crop&q=80&w=200' },
    ];

    // --- 3. ONLINE / APPS ---
    if (brand === 'Noon' || brand === 'Amazon SA' || brand === 'Namshi') return [
        { id: 1, title: 'رصيد محفظة 25 ريال', points: 250, image: 'https://images.unsplash.com/photo-1556742031-c6961e8560b0?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'شحن مجاني', points: 100, image: 'https://images.unsplash.com/photo-1629905678898-0d0c3d90a8e7?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'خصم 15%', points: 150, image: 'https://images.unsplash.com/photo-1607082349566-187342175e2f?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'HungerStation' || brand === 'Careem') return [
        { id: 1, title: 'رصيد محفظة 15 ريال', points: 150, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'توصيل مجاني', points: 100, image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=200' },
    ];

    // --- 4. ENTERTAINMENT & OTHERS ---
    if (brand === 'VOX Cinemas') return [
        { id: 1, title: 'تذكرة عادية مجانية', points: 400, image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'ترقية بوبكورن مجاناً', points: 150, image: 'https://images.unsplash.com/photo-1578849278619-e73505e9610f?auto=format&fit=crop&q=80&w=200' },
    ];

    if (brand === 'Fitness Time') return [
        { id: 1, title: 'دخول يومي مجاني', points: 300, image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'خصم 20% اشتراك 3 شهور', points: 500, image: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80&w=200' },
    ];

    // --- FALLBACKS BY CATEGORY ---
    if (category === 'restaurants') return [
        { id: 1, title: 'خصم 15% على الفاتورة', points: 150, image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'وجبة مجانية', points: 500, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'مشروب غازي مجاني', points: 50, image: 'https://images.unsplash.com/photo-1622483767028-3f66f32aef97?auto=format&fit=crop&q=80&w=200' },
    ];

    if (category === 'shopping') return [
        { id: 1, title: 'قسيمة شرائية 50 ريال', points: 500, image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'قسيمة شرائية 100 ريال', points: 950, image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=200' },
        { id: 3, title: 'خصم 10% إضافي', points: 200, image: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?auto=format&fit=crop&q=80&w=200' },
    ];

    if (category === 'travel') return [
        { id: 1, title: 'خصم 50 ريال على الحجز', points: 500, image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'ترقية درجة السفر', points: 2000, image: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&q=80&w=200' },
    ];

    // --- GENERIC DEFAULT ---
    return [
        { id: 1, title: 'خصم خاص 10%', points: 100, image: 'https://images.unsplash.com/photo-1526304640152-d4619684e484?auto=format&fit=crop&q=80&w=200' },
        { id: 2, title: 'خصم خاص 25%', points: 250, image: 'https://images.unsplash.com/photo-1516559828984-28ea7725fc2e?auto=format&fit=crop&q=80&w=200' },
    ];
};

export const OfferDetailsOverlay: React.FC<OfferDetailsOverlayProps> = ({ 
    offer, 
    onClose, 
    onScanClick,
    onHomeClick,
    onOffersClick,
    onMessagesClick,
    onProfileClick,
    onRechargeClick
}) => {
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showStoreDetails, setShowStoreDetails] = useState(false);
  
  // State for Branches Map
  const [showBranchesMap, setShowBranchesMap] = useState(false);
  
  // State for Insufficient Points Popup
  const [showInsufficientPoints, setShowInsufficientPoints] = useState(false);

  // New State for Online Redirection Screen
  const [showOnlineRedirection, setShowOnlineRedirection] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  
  // New State for Confirmation Modal
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // State for Opening Hours Accordion
  const [isHoursOpen, setIsHoursOpen] = useState(true);

  // Dynamic Options Data
  const offerOptions = useMemo(() => getSubOffers(offer), [offer]);
  const [selectedOptionId, setSelectedOptionId] = useState<number>(offerOptions[0]?.id || 1);

  const selectedOptionCost = useMemo(() => {
      const opt = offerOptions.find(o => o.id === selectedOptionId);
      return opt ? opt.points : offer.pointsCost;
  }, [offer, offerOptions, selectedOptionId]);

  // --- Determine Offer Type Logic ---
  const offerType = useMemo(() => {
      // 1. Voucher Check (0% discount or title indicator)
      if (offer.discountPercentage === 0) return 'voucher';
      
      // 2. Physical Offer Categories (Restaurants, Entertainment, etc.)
      const physicalCategories = ['restaurants', 'entertainment', 'health', 'automotive', 'travel', 'services'];
      if (physicalCategories.includes(offer.category)) return 'offer';
      
      // 3. Fallback to Code (Shopping, Fashion, Apps, etc.)
      return 'code';
  }, [offer]);

  // Helper to check balance before proceeding
  const checkBalanceAndProceed = (action: () => void) => {
      if (MOCK_USER.walletBalance < selectedOptionCost) {
          setShowInsufficientPoints(true);
      } else {
          action();
      }
  };

  const initiatePurchaseFlow = (action: () => void) => {
      setPendingAction(() => action);
      setShowConfirmation(true);
  };

  const handleConfirmPurchase = () => {
      setShowConfirmation(false);
      // Check Balance AFTER user confirms they want to buy
      if (pendingAction) {
          checkBalanceAndProceed(pendingAction);
      }
  };

  const handleGetOfferClick = () => {
      // Vouchers: Show Confirmation Dialog FIRST
      initiatePurchaseFlow(() => {
          setShowSuccessPopup(true);
      });
  };

  const handleOnlineShopClick = () => {
      // Codes: Show Confirmation Dialog FIRST
      initiatePurchaseFlow(() => {
          setShowOnlineRedirection(true);
      });
  };

  const handleScanClick = () => {
      if (onScanClick) {
          // For scan, we generally check balance first as there's no price confirmation dialog for simple scan usually
          checkBalanceAndProceed(() => {
              onScanClick();
          });
      }
  };

  const handleCopyCode = () => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
  };

  const handleFinalRedirect = () => {
      alert(`جاري نقلك إلى موقع ${offer.brandName}...`);
  };

  const handleShareStore = () => {
      if (navigator.share) {
          navigator.share({
              title: offer.brandName,
              text: `تحقق من هذا المتجر المميز: ${offer.brandName}`,
              url: window.location.href,
          }).catch(console.error);
      } else {
          alert('تم نسخ رابط المتجر');
      }
  };

  // --- RENDER BRANCHES MAP OVERLAY IF ACTIVE ---
  if (showBranchesMap) {
      return (
          <StoreBranchesOverlay 
            isOpen={showBranchesMap} 
            onClose={() => setShowBranchesMap(false)} 
            offer={offer}
            onHomeClick={onHomeClick}
            onOffersClick={onOffersClick}
            onMessagesClick={onMessagesClick}
            onProfileClick={onProfileClick}
            onScanClick={onScanClick}
          />
      );
  }

  return (
    <div className="absolute inset-0 z-[60] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 overflow-hidden font-sans">
       
       {/* --- CONFIRMATION MODAL --- */}
       {showConfirmation && (
           <div className="absolute inset-0 z-[110] flex items-center justify-center px-6">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowConfirmation(false)}></div>
                <div className="bg-white w-full max-w-sm rounded-3xl p-6 relative z-10 animate-in zoom-in-95 duration-300 text-center shadow-2xl">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-purple-100">
                        <Tag size={32} className="text-[#6463C7]" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">تأكيد العملية</h3>
                    <p className="text-gray-500 font-medium text-sm mb-6 leading-relaxed">
                        سيتم خصم <span className="text-[#6463C7] font-black">{selectedOptionCost}</span> نقطة من رصيدك مقابل الحصول على هذا العرض. هل أنت متأكد؟
                    </p>
                    <div className="flex gap-3">
                        <button 
                            onClick={handleConfirmPurchase}
                            className="flex-1 bg-[#6463C7] text-white font-bold py-3.5 rounded-xl shadow-lg shadow-purple-200 active:scale-95 transition-all"
                        >
                            تأكيد وخصم
                        </button>
                        <button 
                            onClick={() => setShowConfirmation(false)}
                            className="flex-1 bg-gray-50 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-100 active:scale-95 transition-all"
                        >
                            إلغاء
                        </button>
                    </div>
                </div>
           </div>
       )}

       {/* --- INSUFFICIENT POINTS OVERLAY --- */}
       {showInsufficientPoints && (
           <div className="absolute inset-0 z-[120] bg-white flex flex-col animate-in fade-in duration-300">
               <div className="p-6 pt-12">
                   <button 
                        onClick={() => setShowInsufficientPoints(false)}
                        className="text-black hover:bg-gray-100 p-2 rounded-full -mr-2 transition-colors"
                   >
                       <X size={24} />
                   </button>
               </div>

               <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-20">
                   <div className="relative mb-8">
                       <div className="absolute top-0 right-0 w-24 h-24 bg-purple-100/50 rounded-full blur-xl -translate-y-1/2 translate-x-1/2"></div>
                       <div className="absolute bottom-0 left-0 w-20 h-20 bg-blue-50/50 rounded-full blur-xl translate-y-1/2 -translate-x-1/2"></div>
                       <div className="relative z-10 flex flex-col items-center">
                            <div className="w-24 h-24 bg-white rounded-full shadow-xl shadow-purple-100 border border-purple-50 flex items-center justify-center">
                                <div className="flex flex-col -space-y-3 items-center">
                                    <div className="w-12 h-4 rounded-[100%] bg-[#8382d6] border-2 border-white shadow-sm z-30"></div>
                                    <div className="w-12 h-4 rounded-[100%] bg-[#7372cf] border-2 border-white shadow-sm z-20"></div>
                                    <div className="w-12 h-4 rounded-[100%] bg-[#6463C7] border-2 border-white shadow-sm z-10"></div>
                                    <div className="w-12 h-8 rounded-b-2xl bg-[#5352a3] border-2 border-t-0 border-white shadow-sm"></div>
                                </div>
                                <div className="absolute -bottom-2 -right-2 w-10 h-10 bg-[#6463C7] rounded-full border-4 border-white flex items-center justify-center text-white shadow-md">
                                    <ArrowDown size={20} strokeWidth={3} />
                                </div>
                            </div>
                       </div>
                   </div>

                   <h2 className="text-xl font-black text-gray-900 mb-3 text-center">للاسف رصيد نقاطك ما يكفي</h2>
                   <p className="text-gray-400 text-sm font-medium text-center leading-relaxed max-w-[280px] mb-10">
                       اشحن أو كسب نقاط أكثر عشان تقدر تشتري العرض
                   </p>

                   <div className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center justify-between shadow-sm mb-8">
                       <div className="flex items-center gap-3">
                           <div className="w-8 h-8 rounded-full bg-[#6463C7] flex items-center justify-center text-white shrink-0">
                               <Coins size={16} />
                           </div>
                           <span className="font-black text-xl text-gray-900 dir-ltr">{selectedOptionCost.toLocaleString()}</span>
                       </div>
                       <span className="text-gray-500 font-bold text-sm">النقاط اللي تحتاجها</span>
                   </div>

                   <div className="w-full space-y-4">
                       <button 
                           onClick={() => {
                               setShowInsufficientPoints(false);
                               if (onRechargeClick) onRechargeClick();
                           }}
                           className="w-full bg-[#6463C7] hover:bg-[#5352a3] text-white py-4 rounded-2xl font-bold text-base shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                       >
                           <Plus size={20} />
                           <span>اشحن الآن</span>
                       </button>
                       <button className="w-full bg-transparent hover:bg-gray-50 text-gray-900 py-3 rounded-2xl font-bold text-base transition-colors">
                           اكسـب نقاط
                       </button>
                   </div>
               </div>
           </div>
       )}

       {/* ... (Rest of component including Online Shop Redirection, Success Popup, Store Details, How to Use, Header, Offer Options List) ... */}
       {/* --- ONLINE SHOP REDIRECTION OVERLAY --- */}
       {showOnlineRedirection && (
           <div className="absolute inset-0 z-[90] bg-gray-50 flex flex-col animate-in slide-in-from-right duration-300">
               <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between shadow-sm">
                   <button onClick={() => setShowOnlineRedirection(false)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                       <ArrowRight size={24} />
                   </button>
                   <h2 className="text-lg font-black text-gray-900">تفعيل العرض</h2>
                   <div className="w-10"></div>
               </div>

               <div className="flex-1 overflow-y-auto px-6 py-6 flex flex-col items-center text-center">
                   <div className="w-24 h-24 bg-white rounded-2xl p-1 shadow-md border border-gray-100 mb-4 relative">
                       <img src={offer.brandLogo} alt={offer.brandName} className="w-full h-full object-contain rounded-xl" />
                       <div className="absolute -bottom-1 -right-1 bg-[#6463C7] text-white p-1.5 rounded-full border-2 border-white">
                           <ExternalLink size={16} />
                       </div>
                   </div>

                   <h3 className="text-xl font-black text-gray-900 mb-1">تسوق إلكترونياً من {offer.brandName}</h3>
                   <p className="text-gray-500 text-sm font-medium mb-8 max-w-[250px]">
                       للاستفادة من الخصم، انسخ الكود أدناه واستخدمه عند الدفع في المتجر الإلكتروني.
                   </p>

                   <div className="w-full bg-white rounded-2xl p-6 shadow-sm border border-[#6463C7]/20 mb-8 relative overflow-hidden">
                       <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#8382d6] to-[#6463C7]"></div>
                       <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">كود الخصم</span>
                       <div className="flex items-center justify-between bg-gray-50 rounded-xl border border-dashed border-gray-300 p-2 pl-3">
                           <div className="flex-1 text-center border-l border-gray-200 ml-3">
                               <span className="text-2xl font-black text-[#6463C7] tracking-widest dir-ltr font-mono">SOUQ2025</span>
                           </div>
                           <button 
                                onClick={handleCopyCode}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-bold text-sm ${
                                    isCopied 
                                    ? 'bg-green-500 text-white shadow-green-200 shadow-md' 
                                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                                }`}
                           >
                               {isCopied ? (
                                   <><span>تم النسخ</span><Check size={16} /></>
                               ) : (
                                   <><span>نسخ</span><Copy size={16} /></>
                               )}
                           </button>
                       </div>
                   </div>

                   <div className="w-full space-y-4 mb-8">
                       <div className="flex items-start gap-4 text-right">
                           <div className="w-8 h-8 rounded-full bg-[#6463C7]/10 text-[#6463C7] flex items-center justify-center font-bold text-sm shrink-0">1</div>
                           <div>
                               <h4 className="font-bold text-gray-900 text-sm">انسخ الكود</h4>
                               <p className="text-xs text-gray-500 mt-1">اضغط على زر النسخ في الأعلى لحفظ الكود.</p>
                           </div>
                       </div>
                       {/* ... other steps ... */}
                   </div>
               </div>

               <div className="p-5 bg-white border-t border-gray-100 pb-10">
                   <button 
                       onClick={handleFinalRedirect}
                       className="w-full bg-[#6463C7] hover:bg-[#5352a3] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                   >
                       <span>الذهاب للمتجر الآن</span>
                       <ExternalLink size={20} />
                   </button>
               </div>
           </div>
       )}

       {/* --- SUCCESS POPUP --- */}
       {showSuccessPopup && (
            <div className="absolute inset-0 z-[100] flex items-center justify-center px-6 font-sans">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setShowSuccessPopup(false)}></div>
                <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 flex flex-col items-center text-center shadow-2xl">
                    <button 
                        onClick={() => setShowSuccessPopup(false)}
                        className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-24 h-24 rounded-full bg-[#6463C7] flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 ring-8 ring-indigo-50">
                        <Check size={48} className="text-white" strokeWidth={3} />
                    </div>
                    <h3 className="text-gray-900 font-bold text-lg mb-1">تمت العملية بنجاح!</h3>
                    <h2 className="text-xl font-medium text-gray-500 mb-2">تم إصدار القسيمة</h2>
                    <p className="text-gray-400 font-bold text-sm mb-8">من {offer.brandName}</p>
                    <div className="w-full bg-[#F4F3FF] border-[2px] border-dashed border-[#6463C7]/40 rounded-3xl py-6 mb-6 relative flex items-center justify-center">
                        <span className="text-[#6463C7] font-black text-xl tracking-widest dir-ltr font-mono drop-shadow-sm whitespace-nowrap">
                            VCHR-8829-X
                        </span>
                    </div>
                    <p className="text-gray-400 text-xs font-bold mb-8">تم حفظ القسيمة في محفظتك</p>
                </div>
            </div>
       )}

       {/* --- STORE DETAILS SHEET (UPDATED FULL SCREEN) --- */}
       {showStoreDetails && (
           <div className="absolute inset-0 z-[80] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
                {/* Header */}
                <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 relative">
                    <button onClick={() => setShowStoreDetails(false)} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                        <X size={24} />
                    </button>
                    <h3 className="font-black text-lg text-gray-900">معلومات المتجر</h3>
                    <button onClick={handleShareStore} className="p-2 -ml-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-10 bg-white">
                    
                    {/* Store Identity */}
                    <div className="flex flex-col items-center mt-6 mb-6">
                        <div className="w-28 h-28 rounded-3xl border-2 border-gray-50 p-1 shadow-lg shadow-gray-100 mb-4 bg-white">
                            <img src={offer.brandLogo} className="w-full h-full object-contain rounded-2xl" alt={offer.brandName} />
                        </div>
                        {/* Updated Font Size to text-lg to match header */}
                        <h2 className="text-lg font-black text-gray-900 mb-1">{offer.brandName}</h2>
                        <div className="flex items-center gap-2">
                            <span className="bg-purple-50 text-[#6463C7] text-xs font-bold px-3 py-1 rounded-full">
                                {offer.category === 'restaurants' ? 'مطاعم و كافيهات' : 'تسوق ومتاجر'}
                            </span>
                        </div>
                    </div>

                    {/* Social Media & Contact Buttons */}
                    <div className="flex items-start justify-between gap-1.5 mb-8 overflow-x-auto no-scrollbar pb-2 px-1">
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-[#25D366]/10 rounded-2xl flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform shadow-sm group-active:scale-95">
                                <MessageCircle size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">واتساب</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-[#FFFC00]/20 rounded-2xl flex items-center justify-center text-[#b8b500] group-hover:scale-105 transition-transform shadow-sm group-active:scale-95">
                                <Ghost size={16} strokeWidth={2.5} className="fill-[#b8b500] text-[#b8b500]" />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">سناب</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-gray-900 rounded-2xl flex items-center justify-center text-white group-hover:scale-105 transition-transform shadow-sm group-active:scale-95">
                                <Music2 size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">تيك توك</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-pink-50 rounded-2xl flex items-center justify-center text-[#E1306C] group-hover:scale-105 transition-transform shadow-sm border border-pink-100 group-active:scale-95">
                                <Instagram size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">انستقرام</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 group-hover:scale-105 transition-transform shadow-sm border border-gray-200 group-active:scale-95">
                                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                                </svg>
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">X</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-green-50 rounded-2xl flex items-center justify-center text-green-600 group-hover:scale-105 transition-transform shadow-sm border border-green-100 group-active:scale-95">
                                <Phone size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">اتصال</span>
                        </button>
                        <button className="flex flex-col items-center gap-1.5 group min-w-[36px]">
                            <div className="w-9 h-9 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform shadow-sm border border-purple-100 group-active:scale-95">
                                <MapPin size={16} strokeWidth={2.5} />
                            </div>
                            <span className="text-[8px] font-bold text-gray-500">الموقع</span>
                        </button>
                    </div>

                    {/* 1. About Store (Description) */}
                    <div className="mb-8 text-right bg-gray-50 p-5 rounded-2xl border border-gray-100">
                        <h3 className="font-black text-gray-900 mb-2 text-sm flex items-center gap-2">
                            <Info size={18} className="text-[#6463C7]" />
                            نبذة عن المتجر
                        </h3>
                        <p className="text-sm text-gray-500 font-medium leading-relaxed">
                            هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد هذا النص من مولد النص العربي. يقدم المتجر خدمات متميزة ومنتجات عالية الجودة تناسب جميع الأذواق.
                        </p>
                    </div>

                    {/* 2. Services (Updated: Icon Right, Text Left) */}
                    <div className="mb-8">
                        <h3 className="font-black text-gray-900 mb-4 text-right text-sm">الخدمات المقدمة</h3>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="flex items-center justify-start gap-3 p-3 rounded-2xl bg-blue-50/50 border border-blue-100 group hover:bg-blue-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-blue-500 shadow-sm shrink-0">
                                    <Wifi size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-blue-800">انترنت مجاني</span>
                            </div>
                            <div className="flex items-center justify-start gap-3 p-3 rounded-2xl bg-purple-50/50 border border-purple-100 group hover:bg-purple-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-purple-500 shadow-sm shrink-0">
                                    <Car size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-purple-800">طلب من السيارة</span>
                            </div>
                            <div className="flex items-center justify-start gap-3 p-3 rounded-2xl bg-orange-50/50 border border-orange-100 group hover:bg-orange-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-orange-500 shadow-sm shrink-0">
                                    <Truck size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-orange-800">توصيل للمنازل</span>
                            </div>
                            <div className="flex items-center justify-start gap-3 p-3 rounded-2xl bg-pink-50/50 border border-pink-100 group hover:bg-pink-50 transition-colors">
                                <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center text-pink-500 shadow-sm shrink-0">
                                    <Calendar size={18} strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-bold text-pink-800">خدمة الحجز</span>
                            </div>
                        </div>
                    </div>

                    {/* 3. Opening Hours (Updated Layout: Title Right, Status Left) */}
                    <div className="mb-8">
                        <div 
                            className="bg-white border border-gray-100 shadow-sm rounded-2xl overflow-hidden"
                        >
                            <div 
                                onClick={() => setIsHoursOpen(!isHoursOpen)}
                                className="flex items-center justify-between p-4 cursor-pointer bg-gray-50/50 hover:bg-gray-50 transition-colors"
                            >
                                <h3 className="font-black text-gray-900 text-sm flex items-center gap-2">
                                    <Clock size={18} className="text-[#6463C7]" />
                                    مواعيد العمل
                                </h3>
                                
                                <div className="flex items-center gap-2">
                                    <span className="text-green-600 bg-green-100 px-2 py-0.5 rounded text-[10px] font-bold">مفتوح الآن</span>
                                    {isHoursOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </div>
                            </div>

                            {/* Collapsible Content */}
                            <div className={`transition-all duration-300 ease-in-out ${isHoursOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                                <div className="p-4 space-y-3 bg-white">
                                    {[
                                        { day: 'الاحد', hours: '7:00 AM - 11:00 PM' },
                                        { day: 'الاثنين', hours: '7:00 AM - 11:00 PM' },
                                        { day: 'الثلاثاء', hours: '7:00 AM - 11:00 PM' },
                                        { day: 'الاربعاء', hours: '7:00 AM - 11:00 PM' },
                                        { day: 'الخميس', hours: '7:00 AM - 12:00 AM' },
                                        { day: 'الجمعة', hours: '1:00 PM - 1:00 AM' },
                                    ].map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center text-xs border-b border-gray-50 last:border-0 pb-2 last:pb-0">
                                            <span className="font-bold text-gray-800">{item.day}</span>
                                            <span dir="ltr" className="font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded">{item.hours}</span>
                                        </div>
                                    ))}
                                    <div className="flex justify-between items-center text-xs pt-1">
                                        <span className="font-bold text-gray-800">السبت</span>
                                        <span className="font-bold text-red-500 bg-red-50 px-2 py-1 rounded">مغلق</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
           </div>
       )}

       {/* --- HOW TO USE OVERLAY --- */}
       {showHowToUse && (
           <div className="absolute inset-0 z-[70] bg-white flex flex-col animate-in slide-in-from-bottom duration-300">
               {/* ... same as previous ... */}
                <div className="relative bg-gradient-to-br from-[#6463C7] to-[#8382d6] pt-12 pb-8 px-6 rounded-b-[2.5rem] shadow-lg mb-6 overflow-hidden">
                   <div className="relative z-10 flex justify-between items-center mb-6">
                       <button onClick={() => setShowHowToUse(false)} className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"><X size={20} /></button>
                       <h2 className="text-xl font-black text-white">طريقة الاستخدام</h2>
                       <div className="w-10"></div>
                   </div>
                   <div className="relative z-10 text-center text-white/90"><p className="text-sm font-medium leading-relaxed max-w-xs mx-auto">اتبع الخطوات البسيطة التالية للاستفادة من العرض والحصول على نقاطك فوراً</p></div>
               </div>
               
               <div className="flex-1 px-8 pt-2 overflow-y-auto no-scrollbar pb-10">
                   <div className="relative">
                       <div className="absolute right-[27px] top-4 bottom-10 w-0.5 bg-gray-100"></div>
                       {/* ... Content based on Offer Type (Code vs Physical) - Kept same as previous ... */}
                       {(offerType === 'code' || offerType === 'voucher') ? (
                           <>
                               <div className="relative flex gap-6 mb-10"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-purple-50 shadow-lg shadow-purple-100 flex items-center justify-center text-[#6463C7] z-10 relative"><Copy size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-[#6463C7] mb-1 block">الخطوة الأولى</span><h3 className="font-black text-gray-900 text-lg mb-2">انسخ الكود</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">اضغط على زر "احصل على كود الخصم" في الأسفل لنسخ الرمز.</p></div></div>
                               <div className="relative flex gap-6 mb-10"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-blue-50 shadow-lg shadow-blue-100 flex items-center justify-center text-blue-500 z-10 relative"><ExternalLink size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-blue-500 mb-1 block">الخطوة الثانية</span><h3 className="font-black text-gray-900 text-lg mb-2">تسوق أونلاين</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">سيتم تحويلك للمتجر الإلكتروني أو التطبيق الخاص بالتاجر لإضافة مشترياتك.</p></div></div>
                               <div className="relative flex gap-6 mb-8"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-amber-50 shadow-lg shadow-amber-100 flex items-center justify-center text-amber-500 z-10 relative"><Tag size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-amber-500 mb-1 block">الخطوة الثالثة</span><h3 className="font-black text-gray-900 text-lg mb-2">لصق الكود</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">في صفحة الدفع، الصق الكود في خانة "كود الخصم" واستمتع بالتوفير.</p></div></div>
                           </>
                       ) : (
                           <>
                               <div className="relative flex gap-6 mb-10"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-purple-50 shadow-lg shadow-purple-100 flex items-center justify-center text-[#6463C7] z-10 relative"><MapPin size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-[#6463C7] mb-1 block">الخطوة الأولى</span><h3 className="font-black text-gray-900 text-lg mb-2">زر الفرع</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">توجه إلى أقرب فرع للمتجر الموضح في الخريطة.</p></div></div>
                               <div className="relative flex gap-6 mb-10"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-blue-50 shadow-lg shadow-blue-100 flex items-center justify-center text-blue-500 z-10 relative"><ScanLine size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-blue-500 mb-1 block">الخطوة الثانية</span><h3 className="font-black text-gray-900 text-lg mb-2">امسح الكود</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">عند الوصول للكاشير، افتح الماسح الضوئي في التطبيق وامسح كود QR الخاص بالمتجر.</p></div></div>
                               <div className="relative flex gap-6 mb-8"><div className="relative shrink-0"><div className="w-14 h-14 bg-white rounded-2xl border-2 border-amber-50 shadow-lg shadow-amber-100 flex items-center justify-center text-amber-500 z-10 relative"><Ticket size={24} /></div></div><div className="pt-1"><span className="text-xs font-bold text-amber-500 mb-1 block">الخطوة الثالثة</span><h3 className="font-black text-gray-900 text-lg mb-2">استلم الخصم</h3><p className="text-sm text-gray-500 leading-relaxed font-medium">أظهر الكود أو التأكيد الذي يظهر لك للكاشير للحصول على الخصم فوراً.</p></div></div>
                           </>
                       )}
                   </div>
               </div>
               <div className="p-6 border-t border-gray-100 bg-white"><button onClick={() => setShowHowToUse(false)} className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 hover:bg-[#5352a3] active:scale-[0.98] transition-all">فهمت، شكراً</button></div>
           </div>
       )}

       {/* Image Header - Reduced Height */}
       <div className="relative h-40 bg-gray-200 shrink-0">
          <img src={offer.image} className="w-full h-full object-cover" alt={offer.title} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
          {/* Header Actions */}
          <div className="absolute top-0 left-0 right-0 p-4 pt-12 flex justify-between items-center z-10">
             <button onClick={onClose} className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:bg-white"><ChevronRight size={20} /></button>
             <div className="flex gap-2">
                <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm hover:text-red-500 transition-colors"><Heart size={18} strokeWidth={2} /></button>
                <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-gray-800 shadow-sm"><Share2 size={18} strokeWidth={2} /></button>
             </div>
          </div>
       </div>

       {/* Clickable Store Header Row - Compact */}
       <button onClick={() => setShowStoreDetails(true)} className="w-full bg-white px-4 py-3 flex items-center justify-between border-b border-gray-50 hover:bg-gray-50 transition-colors group relative z-20">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-white rounded-xl p-0.5 border border-gray-100 shadow-sm overflow-hidden shrink-0"><img src={offer.brandLogo} className="w-full h-full object-contain rounded-lg" alt={offer.brandName} /></div>
             <div className="text-right">
                <h1 className="font-black text-base text-gray-900 leading-none mb-1.5">{offer.brandName}</h1>
                <span className="inline-block bg-purple-50 text-[#6463C7] text-[9px] font-bold px-2 py-0.5 rounded-md border border-purple-100">{offer.category === 'restaurants' ? 'مطاعم و كافيهات' : 'تسوق ومتاجر'}</span>
             </div>
          </div>
          <div className="text-gray-300 group-hover:text-[#6463C7] transition-colors bg-gray-50 p-1.5 rounded-full group-hover:bg-purple-50"><ChevronLeft size={20} /></div>
       </button>

       {/* Scrollable Content (Lists) */}
       <div className="flex-1 overflow-y-auto px-4 pb-2 no-scrollbar bg-white">
          {/* Offers Header */}
          <div className="flex items-center justify-between mb-3 mt-8"><h2 className="text-gray-900 font-bold text-xs">العروض المتاحة</h2></div>

          {/* Offer Options List */}
          <div className="flex flex-col gap-2 mb-6">
              {offerOptions.map((option) => {
                  const isSelected = selectedOptionId === option.id;
                  return (
                    <div key={option.id} onClick={() => setSelectedOptionId(option.id)} className={`rounded-xl border cursor-pointer transition-all relative overflow-hidden flex flex-col ${isSelected ? 'bg-white border-[#6463C7] ring-1 ring-[#6463C7] shadow-sm' : 'bg-white border-gray-200 hover:border-purple-200'}`}>
                        <div className="flex items-center justify-between p-3">
                            <div className="flex items-center gap-3">
                                <div className={`w-12 h-12 rounded-lg overflow-hidden shrink-0 border ${isSelected ? 'border-purple-200' : 'border-gray-100'}`}><img src={option.image} alt={option.title} className="w-full h-full object-cover" /></div>
                                <div><h3 className={`font-bold text-xs leading-tight ${isSelected ? 'text-[#6463C7]' : 'text-gray-900'}`}>{option.title}</h3></div>
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0 ${isSelected ? 'border-[#6463C7] bg-[#6463C7]' : 'border-gray-200 bg-transparent'}`}>{isSelected && <div className="w-2 h-2 bg-white rounded-full"></div>}</div>
                        </div>
                        <div className={`py-1.5 flex items-center justify-center gap-1 border-t ${isSelected ? 'bg-[#F4F3FF] border-[#6463C7]/20' : 'bg-[#f9fafb] border-gray-100'}`}><span className={`font-black text-xs dir-ltr tracking-wide ${isSelected ? 'text-[#6463C7]' : 'text-gray-600'}`}>{option.points.toLocaleString()}</span><span className={`text-[9px] font-bold ${isSelected ? 'text-[#6463C7]/80' : 'text-gray-400'}`}>نقطة</span></div>
                    </div>
                  );
              })}
          </div>

          {/* Info Section */}
          <div className="flex gap-2 mb-2">
             <button onClick={() => setShowHowToUse(true)} className="flex-1 bg-white border border-purple-100 rounded-xl p-1 shadow-sm group hover:shadow-md transition-all active:scale-[0.99]"><div className="bg-gradient-to-r from-purple-50 to-white rounded-lg p-2 flex items-center gap-2 justify-center h-full"><div className="w-8 h-8 bg-[#6463C7] rounded-full flex items-center justify-center text-white shadow-md shadow-purple-200 shrink-0"><Info size={16} strokeWidth={2.5} /></div><div className="text-right"><h3 className="font-black text-gray-900 text-xs">طريقة الاستخدام</h3></div></div></button>
             <button onClick={() => setShowBranchesMap(true)} className="flex-1 bg-white border border-blue-100 rounded-xl p-1 shadow-sm group hover:shadow-md transition-all active:scale-[0.99]"><div className="bg-gradient-to-r from-blue-50 to-white rounded-lg p-2 flex items-center gap-2 justify-center h-full"><div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-md shadow-blue-200 shrink-0"><Map size={16} strokeWidth={2.5} /></div><div className="text-right"><h3 className="font-black text-gray-900 text-xs">فروع المتجر</h3></div></div></button>
          </div>
       </div>

       {/* Fixed Bottom Actions Footer - Dynamic Button */}
       <div className="bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20 pb-10">
          
          {offerType === 'offer' && (
              <button 
                  onClick={handleScanClick}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6463C7] text-white shadow-lg shadow-[#6463C7]/20 hover:bg-[#5352a3] transition-all active:scale-95"
              >
                  <ScanLine size={22} strokeWidth={2.5} />
                  <span className="text-sm font-black">مسح الكود</span>
              </button>
          )}

          {offerType === 'code' && (
              <button 
                  onClick={handleOnlineShopClick}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6463C7] text-white shadow-lg shadow-[#6463C7]/20 hover:bg-[#5352a3] transition-all active:scale-95"
              >
                  <Copy size={22} strokeWidth={2.5} />
                  <span className="text-sm font-black">احصل على كود الخصم</span>
              </button>
          )}

          {offerType === 'voucher' && (
              <button 
                  onClick={handleGetOfferClick}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6463C7] text-white shadow-lg shadow-[#6463C7]/20 hover:bg-[#5352a3] transition-all active:scale-95"
              >
                  <Ticket size={22} strokeWidth={2.5} />
                  <span className="text-sm font-black">احصل على القسيمة الشرائية</span>
              </button>
          )}

       </div>
    </div>
  );
};
