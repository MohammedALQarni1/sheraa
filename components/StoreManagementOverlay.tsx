
import React, { useState, useEffect, useRef } from 'react';
import { X, Settings, Plus, BarChart3, Users, Package, Star, Edit3, MapPin, TrendingUp, DollarSign, Eye, ChevronRight, Check, Target, ShoppingBag, Clock, ChevronLeft, Calendar, Gift, Tag, CreditCard, Upload, Image as ImageIcon, ArrowRight, Coins, Sparkles, Filter, Download, Camera, Briefcase, Store, Save, Edit, Globe, Phone, MessageCircle, Map, Share2, Ghost, Music2, Youtube, Twitter, Instagram, Wifi, Truck, Car, Coffee, ShieldCheck, CheckCircle2, ChevronDown, PlusCircle, Trash2, FileText, LocateFixed, Navigation, Crown, Zap, RefreshCw, ArrowUpRight, ArrowDownRight, UserCheck, Ticket, Percent, MousePointerClick, Copy } from 'lucide-react';
import { BottomNav } from './BottomNav';
import { StoreUpgradeOverlay } from './StoreUpgradeOverlay';

// Declare Leaflet types globally since we are using CDN
declare const L: any;

interface StoreManagementOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  storeData: any;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onMessagesClick?: () => void;
  onProfileClick?: () => void;
  onScanClick?: () => void;
}

// Sub-view types for Edit Store Section
type EditStoreView = 'menu' | 'basic_info' | 'services' | 'hours' | 'branches' | 'socials' | 'add_branch_map';
type ViewMode = 'dashboard' | 'add_offer' | 'edit_store' | 'offer_details';
type OfferType = 'offer' | 'code' | 'voucher';

export const StoreManagementOverlay: React.FC<StoreManagementOverlayProps> = ({ 
    isOpen, 
    onClose, 
    storeData,
    onHomeClick,
    onOffersClick,
    onMessagesClick,
    onProfileClick,
    onScanClick
}) => {
  const [currentView, setCurrentView] = useState<ViewMode>('dashboard');
  const [editSubView, setEditSubView] = useState<EditStoreView>('menu'); 
  const [activeTab, setActiveTab] = useState<'stats' | 'offers' | 'sales'>('stats');
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  
  // Offer Detail State
  const [selectedOffer, setSelectedOffer] = useState<any>(null);
  const [detailTab, setDetailTab] = useState<'stats' | 'edit'>('stats');

  // Map Refs & State for Branch Location
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [newBranchStep, setNewBranchStep] = useState<'map' | 'details'>('map');
  const [newBranchData, setNewBranchData] = useState({
      name: '',
      city: 'الرياض',
      district: '',
      lat: 24.7136,
      lng: 46.6753
  });

  // --- ADD/EDIT OFFER STATE ---
  const [offerType, setOfferType] = useState<OfferType>('offer');
  const [offerFormData, setOfferFormData] = useState({
      title: '',
      pointsCost: '',
      expiryDate: '',
      image: null as File | null,
      description: '',
      // Specific fields
      discountPercent: '',
      codeText: '',
      voucherValue: ''
  });
  
  // --- STORE DATA STATE ---
  const [storeProfile, setStoreProfile] = useState({
      // Basic
      storeName: '',
      activity: '',
      subActivity: '',
      bio: '',
      storeImage: '',
      storeBanner: '', 
      
      // Services (Array of strings)
      services: [] as string[],
      
      // Hours
      hoursType: 'single' as 'single' | 'split', 
      workDays: {
          sun: { open: true, from: '09:00', to: '23:00', from2: '16:00', to2: '23:00' },
          mon: { open: true, from: '09:00', to: '23:00', from2: '', to2: '' },
          tue: { open: true, from: '09:00', to: '23:00', from2: '', to2: '' },
          wed: { open: true, from: '09:00', to: '23:00', from2: '', to2: '' },
          thu: { open: true, from: '09:00', to: '23:00', from2: '', to2: '' },
          fri: { open: true, from: '16:00', to: '01:00', from2: '', to2: '' },
          sat: { open: true, from: '09:00', to: '23:00', from2: '', to2: '' },
      },

      // Branches
      branches: [
          { id: 1, name: 'الفرع الرئيسي', city: 'الرياض', district: 'العليا', lat: 24.7136, lng: 46.6753 }
      ],

      // Socials
      socials: {
          website: '',
          tiktok: '',
          snapchat: '',
          phone: '',
          whatsapp: '',
          instagram: '',
          twitter: ''
      }
  });

  // Mock available services based on activity
  const AVAILABLE_SERVICES = [
      { id: 'wifi', label: 'انترنت مجاني', icon: Wifi },
      { id: 'delivery', label: 'توصيل للمنازل', icon: Truck },
      { id: 'drive_thru', label: 'طلب من السيارة', icon: Car },
      { id: 'booking', label: 'خدمة الحجز', icon: Calendar },
      { id: 'parking', label: 'مواقف سيارات', icon: MapPin },
      { id: 'family_section', label: 'قسم عائلات', icon: Users },
      { id: 'payment_card', label: 'دفع بالبطاقة', icon: CreditCard },
      { id: 'warranty', label: 'ضمان ذهبي', icon: ShieldCheck },
      { id: 'installation', label: 'تركيب مجاني', icon: Settings },
  ];

  // Initialize Edit Form when storeData changes
  useEffect(() => {
      if (storeData) {
          setStoreProfile(prev => ({
              ...prev,
              storeName: storeData.storeName || '',
              activity: storeData.activity || '',
              storeImage: storeData.storeImage || '',
              storeBanner: storeData.storeBanner || '', 
          }));
      }
  }, [storeData]);

  // Initialize Map for Adding Branch
  useEffect(() => {
      if (editSubView === 'add_branch_map' && mapContainerRef.current && !mapInstanceRef.current && typeof L !== 'undefined') {
          const map = L.map(mapContainerRef.current, {
              zoomControl: false,
              attributionControl: false
          }).setView([24.7136, 46.6753], 13);

          L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
              maxZoom: 19,
          }).addTo(map);

          mapInstanceRef.current = map;
      }
      
      return () => {
          if (editSubView !== 'add_branch_map' && mapInstanceRef.current) {
              mapInstanceRef.current.remove();
              mapInstanceRef.current = null;
          }
      };
  }, [editSubView]);

  if (!isOpen) return null;

  // --- MOCK OFFERS (Updated Structure) ---
  const myOffers = [
      { 
          id: 1, 
          type: 'offer',
          title: 'خصم 20% على جميع المنتجات', 
          discountPercent: '20',
          pointsCost: '200',
          expiryDate: '2025-05-01',
          status: 'active', 
          stats: { views: 1200, sales: 45, clicks: 320 }
      },
      { 
          id: 2, 
          type: 'code',
          title: 'كود خصم خاص', 
          codeText: 'SUMMER50',
          discountPercent: '50',
          pointsCost: '500',
          expiryDate: '2025-06-15',
          status: 'review', 
          stats: { views: 340, sales: 0, clicks: 12 }
      },
      { 
          id: 3, 
          type: 'voucher',
          title: 'قسيمة شرائية', 
          voucherValue: '100',
          pointsCost: '1000',
          expiryDate: '2024-12-30',
          status: 'expired', 
          stats: { views: 2100, sales: 89, clicks: 950 }
      },
  ];

  // Mock Orders for Sales Tab
  const latestOrders = [
      { id: '#88291', customer: 'محمد العتيبي', amount: '240 ر.س', status: 'new', time: 'منذ 10 د', items: 3 },
      { id: '#88290', customer: 'سارة خالد', amount: '120 ر.س', status: 'completed', time: 'منذ ساعة', items: 1 },
      { id: '#88289', customer: 'فهد السالم', amount: '450 ر.س', status: 'completed', time: 'منذ 3 ساعات', items: 2 },
      { id: '#88288', customer: 'نورة التميمي', amount: '95 ر.س', status: 'cancelled', time: 'أمس', items: 1 },
      { id: '#88287', customer: 'خالد العنزي', amount: '1200 ر.س', status: 'completed', time: 'أمس', items: 5 },
  ];

  const handlePublishOffer = () => {
      // Basic Validation
      if (!offerFormData.title || !offerFormData.pointsCost) {
          alert('يرجى تعبئة الحقول الأساسية');
          return;
      }
      
      alert(currentView === 'offer_details' ? 'تم تحديث العرض بنجاح' : 'تم إضافة العرض بنجاح! سيظهر للعملاء بعد المراجعة.');
      
      setOfferFormData({
          title: '',
          pointsCost: '',
          expiryDate: '',
          image: null,
          description: '',
          discountPercent: '',
          codeText: '',
          voucherValue: ''
      });
      setCurrentView('dashboard');
      setActiveTab('offers');
  };

  const handleOpenOfferDetails = (offer: any) => {
      setSelectedOffer(offer);
      setDetailTab('stats');
      // Populate Form for Edit Tab
      setOfferType(offer.type);
      setOfferFormData({
          title: offer.title,
          pointsCost: offer.pointsCost,
          expiryDate: offer.expiryDate,
          image: null,
          description: offer.description || '',
          discountPercent: offer.discountPercent || '',
          codeText: offer.codeText || '',
          voucherValue: offer.voucherValue || ''
      });
      setCurrentView('offer_details');
  };

  const handleSaveStoreInfo = () => {
      alert('تم حفظ معلومات المتجر بنجاح');
      setEditSubView('menu'); 
  };

  const handleDeleteBranch = (id: number) => {
      if (confirm('هل أنت متأكد من حذف هذا الفرع؟')) {
          setStoreProfile(prev => ({
              ...prev,
              branches: prev.branches.filter(b => b.id !== id)
          }));
      }
  };

  const handleConfirmLocation = () => {
      if (mapInstanceRef.current) {
          const center = mapInstanceRef.current.getCenter();
          setNewBranchData(prev => ({ ...prev, lat: center.lat, lng: center.lng }));
          setNewBranchStep('details');
      }
  };

  const handleSaveNewBranch = () => {
      if (!newBranchData.name) {
          alert('يرجى إدخال اسم الفرع');
          return;
      }
      const newBranch = {
          id: Date.now(),
          name: newBranchData.name,
          city: newBranchData.city,
          district: newBranchData.district || 'حي جديد',
          lat: newBranchData.lat,
          lng: newBranchData.lng
      };
      
      setStoreProfile(prev => ({
          ...prev,
          branches: [...prev.branches, newBranch]
      }));
      
      setNewBranchData({ name: '', city: 'الرياض', district: '', lat: 0, lng: 0 });
      setNewBranchStep('map');
      setEditSubView('branches'); 
  };

  const toggleService = (serviceId: string) => {
      setStoreProfile(prev => {
          const services = prev.services.includes(serviceId)
              ? prev.services.filter(s => s !== serviceId)
              : [...prev.services, serviceId];
          return { ...prev, services };
      });
  };

  // --- RENDER VIEW: OFFER DETAILS & EDIT ---
  if (currentView === 'offer_details' && selectedOffer) {
      return (
        <div className="absolute inset-0 z-[260] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <button onClick={() => setCurrentView('dashboard')} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                    <ArrowRight size={24} />
                </button>
                <h2 className="text-lg font-black text-gray-900 truncate max-w-[200px]">{selectedOffer.title}</h2>
                <div className="w-8"></div>
            </div>

            {/* Toggle Tabs */}
            <div className="px-6 mt-4">
                <div className="bg-white p-1.5 rounded-xl flex shadow-sm border border-gray-100">
                    <button 
                        onClick={() => setDetailTab('stats')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            detailTab === 'stats' 
                            ? 'bg-[#6463C7] text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        الإحصائيات
                    </button>
                    <button 
                        onClick={() => setDetailTab('edit')}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                            detailTab === 'edit' 
                            ? 'bg-[#6463C7] text-white shadow-md' 
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                    >
                        تعديل العرض
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-6 pb-24 no-scrollbar">
                
                {/* STATS TAB */}
                {detailTab === 'stats' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        
                        {/* Status Card */}
                        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
                            <span className="text-sm font-bold text-gray-700">حالة العرض</span>
                            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                                selectedOffer.status === 'active' ? 'bg-green-50 text-green-600 border-green-100' :
                                selectedOffer.status === 'review' ? 'bg-orange-50 text-orange-600 border-orange-100' :
                                'bg-red-50 text-red-600 border-red-100'
                            }`}>
                                {selectedOffer.status === 'active' ? 'نشط حالياً' : selectedOffer.status === 'review' ? 'قيد المراجعة' : 'منتهي الصلاحية'}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Views */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
                                    <Eye size={20} />
                                </div>
                                <span className="text-2xl font-black text-gray-900 dir-ltr">{selectedOffer.stats.views}</span>
                                <span className="text-[10px] text-gray-400 font-bold">مشاهدة</span>
                            </div>

                            {/* Sales/Redemptions */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="text-2xl font-black text-gray-900 dir-ltr">{selectedOffer.stats.sales}</span>
                                <span className="text-[10px] text-gray-400 font-bold">شراء / استبدال</span>
                            </div>

                            {/* Clicks */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2">
                                    <MousePointerClick size={20} />
                                </div>
                                <span className="text-2xl font-black text-gray-900 dir-ltr">{selectedOffer.stats.clicks}</span>
                                <span className="text-[10px] text-gray-400 font-bold">نقرة</span>
                            </div>

                            {/* Conversion Rate */}
                            <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center mb-2">
                                    <TrendingUp size={20} />
                                </div>
                                <span className="text-2xl font-black text-gray-900 dir-ltr">
                                    {selectedOffer.stats.views > 0 ? ((selectedOffer.stats.sales / selectedOffer.stats.views) * 100).toFixed(1) : 0}%
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">نسبة التحويل</span>
                            </div>
                        </div>

                    </div>
                )}

                {/* EDIT TAB */}
                {detailTab === 'edit' && (
                    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                        {/* Dynamic Form Reuse */}
                        <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                            
                            {/* Type Indicator (Read Only) */}
                            <div className="flex items-center gap-2 mb-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                                {offerType === 'offer' && <Gift size={18} className="text-purple-600" />}
                                {offerType === 'code' && <Tag size={18} className="text-blue-600" />}
                                {offerType === 'voucher' && <CreditCard size={18} className="text-green-600" />}
                                <span className="text-xs font-bold text-gray-700">
                                    نوع العرض: {offerType === 'offer' ? 'عرض خصم' : offerType === 'code' ? 'كود خصم' : 'قسيمة شرائية'}
                                </span>
                            </div>

                            {/* Specific Fields */}
                            {offerType === 'offer' && (
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نسبة الخصم</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={offerFormData.discountPercent}
                                            onChange={(e) => setOfferFormData({...offerFormData, discountPercent: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm dir-ltr pl-8"
                                        />
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            )}

                            {offerType === 'code' && (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نص الكود</label>
                                        <input 
                                            type="text" 
                                            value={offerFormData.codeText}
                                            onChange={(e) => setOfferFormData({...offerFormData, codeText: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-center font-black text-gray-900 focus:border-blue-500 outline-none text-base uppercase dir-ltr tracking-wider"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نسبة الخصم</label>
                                        <div className="relative">
                                            <input 
                                                type="number" 
                                                value={offerFormData.discountPercent}
                                                onChange={(e) => setOfferFormData({...offerFormData, discountPercent: e.target.value})}
                                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-blue-500 outline-none text-sm dir-ltr pl-8"
                                            />
                                            <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {offerType === 'voucher' && (
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">قيمة القسيمة</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            value={offerFormData.voucherValue}
                                            onChange={(e) => setOfferFormData({...offerFormData, voucherValue: e.target.value})}
                                            className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-green-500 outline-none text-sm dir-ltr pl-12"
                                        />
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">ر.س</span>
                                    </div>
                                </div>
                            )}

                            {/* Generic Fields */}
                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">عنوان العرض</label>
                                <input 
                                    type="text" 
                                    value={offerFormData.title}
                                    onChange={(e) => setOfferFormData({...offerFormData, title: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">تكلفة النقاط</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        value={offerFormData.pointsCost}
                                        onChange={(e) => setOfferFormData({...offerFormData, pointsCost: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm dir-ltr pl-12"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6463C7]">نقطة</span>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-gray-700 block mb-2">تاريخ الانتهاء</label>
                                <input 
                                    type="date" 
                                    value={offerFormData.expiryDate}
                                    onChange={(e) => setOfferFormData({...offerFormData, expiryDate: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm"
                                />
                            </div>

                            {(offerType === 'offer') && (
                                <div>
                                    <label className="text-xs font-bold text-gray-700 block mb-2">وصف العرض</label>
                                    <textarea 
                                        value={offerFormData.description}
                                        onChange={(e) => setOfferFormData({...offerFormData, description: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right font-medium text-gray-900 focus:border-[#6463C7] outline-none text-sm h-24 resize-none"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Save Button */}
                        <button 
                            onClick={handlePublishOffer}
                            className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-4"
                        >
                            <Save size={20} />
                            <span>حفظ التعديلات</span>
                        </button>
                    </div>
                )}

            </div>
        </div>
      );
  }

  // --- RENDER VIEW: ADD OFFER (NEW) ---
  if (currentView === 'add_offer') {
      return (
        <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
            
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <button onClick={() => setCurrentView('dashboard')} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                    <X size={24} />
                </button>
                <h2 className="text-lg font-black text-gray-900">إضافة عرض جديد</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-6">
                
                {/* 1. Offer Type Selection */}
                <div className="mb-6">
                    <label className="text-xs font-bold text-gray-700 mb-3 block px-1">نوع العرض</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button 
                            onClick={() => setOfferType('offer')}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                offerType === 'offer' 
                                ? 'bg-[#6463C7] border-[#6463C7] text-white shadow-md' 
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                        >
                            <Gift size={20} className="mb-1.5" />
                            <span className="text-[10px] font-bold">عروض</span>
                        </button>
                        <button 
                            onClick={() => setOfferType('code')}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                offerType === 'code' 
                                ? 'bg-[#6463C7] border-[#6463C7] text-white shadow-md' 
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                        >
                            <Tag size={20} className="mb-1.5" />
                            <span className="text-[10px] font-bold">أكواد خصم</span>
                        </button>
                        <button 
                            onClick={() => setOfferType('voucher')}
                            className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                                offerType === 'voucher' 
                                ? 'bg-[#6463C7] border-[#6463C7] text-white shadow-md' 
                                : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                            }`}
                        >
                            <CreditCard size={20} className="mb-1.5" />
                            <span className="text-[10px] font-bold">قسائم شرائية</span>
                        </button>
                    </div>
                </div>

                {/* 2. Basic Info Form */}
                <div className="bg-white p-5 rounded-3xl shadow-sm border border-gray-100 space-y-4">
                    
                    {/* Dynamic Fields based on Type */}
                    {offerType === 'offer' && (
                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 mb-4 animate-in fade-in">
                            <h4 className="text-xs font-bold text-purple-700 mb-3 flex items-center gap-1"><Gift size={14}/> تفاصيل العرض</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نسبة الخصم</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            placeholder="50"
                                            value={offerFormData.discountPercent}
                                            onChange={(e) => setOfferFormData({...offerFormData, discountPercent: e.target.value})}
                                            className="w-full bg-white border border-purple-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm dir-ltr pl-8"
                                        />
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {offerType === 'code' && (
                        <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100 mb-4 animate-in fade-in">
                            <h4 className="text-xs font-bold text-blue-700 mb-3 flex items-center gap-1"><Tag size={14}/> تفاصيل الكود</h4>
                            <div className="space-y-3">
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نص الكود</label>
                                    <input 
                                        type="text" 
                                        placeholder="SALE20"
                                        value={offerFormData.codeText}
                                        onChange={(e) => setOfferFormData({...offerFormData, codeText: e.target.value})}
                                        className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-center font-black text-gray-900 focus:border-blue-500 outline-none text-base uppercase dir-ltr tracking-wider"
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">نسبة الخصم</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            placeholder="20"
                                            value={offerFormData.discountPercent}
                                            onChange={(e) => setOfferFormData({...offerFormData, discountPercent: e.target.value})}
                                            className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-blue-500 outline-none text-sm dir-ltr pl-8"
                                        />
                                        <Percent size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {offerType === 'voucher' && (
                        <div className="bg-green-50 p-4 rounded-2xl border border-green-100 mb-4 animate-in fade-in">
                            <h4 className="text-xs font-bold text-green-700 mb-3 flex items-center gap-1"><CreditCard size={14}/> تفاصيل القسيمة</h4>
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">قيمة القسيمة</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        placeholder="100"
                                        value={offerFormData.voucherValue}
                                        onChange={(e) => setOfferFormData({...offerFormData, voucherValue: e.target.value})}
                                        className="w-full bg-white border border-green-200 rounded-xl px-4 py-3 text-right font-bold text-gray-900 focus:border-green-500 outline-none text-sm dir-ltr pl-12"
                                    />
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-400">ر.س</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Generic Fields */}
                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">عنوان العرض</label>
                        <input 
                            type="text" 
                            placeholder={offerType === 'code' ? 'كود خصم خاص 20%' : 'وجبة مجانية ...'}
                            value={offerFormData.title}
                            onChange={(e) => setOfferFormData({...offerFormData, title: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">تكلفة النقاط (للمشتري)</label>
                        <div className="relative">
                            <input 
                                type="number" 
                                placeholder="500"
                                value={offerFormData.pointsCost}
                                onChange={(e) => setOfferFormData({...offerFormData, pointsCost: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm dir-ltr pl-12"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#6463C7]">نقطة</span>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">تاريخ الانتهاء</label>
                        <input 
                            type="date" 
                            value={offerFormData.expiryDate}
                            onChange={(e) => setOfferFormData({...offerFormData, expiryDate: e.target.value})}
                            className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-sm"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-gray-700 block mb-2">صورة العرض</label>
                        <div className="w-full h-32 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-[#6463C7] transition-colors group">
                            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2 group-hover:scale-110 transition-transform">
                                <Upload size={18} className="text-gray-400 group-hover:text-[#6463C7]" />
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">اضغط لرفع صورة</span>
                        </div>
                    </div>

                    {/* Description for Offers */}
                    {(offerType === 'offer') && (
                        <div>
                            <label className="text-xs font-bold text-gray-700 block mb-2">وصف العرض</label>
                            <textarea 
                                placeholder="اكتب تفاصيل العرض والشروط..."
                                value={offerFormData.description}
                                onChange={(e) => setOfferFormData({...offerFormData, description: e.target.value})}
                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right font-medium text-gray-900 focus:border-[#6463C7] outline-none text-sm h-24 resize-none"
                            />
                        </div>
                    )}

                </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handlePublishOffer}
                    className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    <Check size={20} />
                    <span>نشر العرض</span>
                </button>
            </div>
        </div>
      );
  }

  // --- RENDER EDIT STORE SUB-VIEWS ---
  if (currentView === 'edit_store') {
      
      // 1. MAIN MENU
      if (editSubView === 'menu') {
          return (
            <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
                {/* Header */}
                <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 border-b border-gray-50">
                    <button onClick={() => setCurrentView('dashboard')} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                        <ArrowRight size={24} />
                    </button>
                    <h2 className="text-lg font-black text-gray-900">تعديل معلومات المتجر</h2>
                    <div className="w-8"></div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
                    {/* Store Card Preview */}
                    <div className="bg-white p-4 rounded-[1.5rem] shadow-sm border border-gray-100 mb-6 flex items-center gap-4">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
                            {storeProfile.storeImage ? (
                                <img src={storeProfile.storeImage} alt="Logo" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300"><Store /></div>
                            )}
                        </div>
                        <div>
                            <h3 className="font-black text-gray-900 text-sm mb-1">{storeProfile.storeName || 'اسم المتجر'}</h3>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500 font-medium">ID: 3434</span>
                                <span className="bg-green-50 text-green-600 text-[9px] px-2 py-0.5 rounded-full font-bold border border-green-100">نشط</span>
                            </div>
                        </div>
                    </div>

                    <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">القائمة</h3>
                    <div className="space-y-3">
                        <EditMenuItem 
                            icon={FileText} label="البيانات الأساسية" desc="الاسم، الشعار، البنر، النبذة" 
                            onClick={() => setEditSubView('basic_info')} 
                        />
                        <EditMenuItem 
                            icon={Sparkles} label="الخدمات المقدمة" desc="المرافق والمميزات الإضافية" 
                            onClick={() => setEditSubView('services')} 
                        />
                        <EditMenuItem 
                            icon={Clock} label="مواعيد العمل" desc="ساعات الدوام والأيام" 
                            onClick={() => setEditSubView('hours')} 
                        />
                        <EditMenuItem 
                            icon={Map} label="مواقع الفروع" desc="إدارة الفروع على الخريطة" 
                            onClick={() => setEditSubView('branches')} 
                        />
                        <EditMenuItem 
                            icon={Share2} label="وسائل التواصل" desc="الروابط والحسابات الاجتماعية" 
                            onClick={() => setEditSubView('socials')} 
                        />
                    </div>
                </div>
            </div>
          );
      }

      // 2. BASIC INFO FORM (REDESIGNED)
      if (editSubView === 'basic_info') {
          return (
            <EditSubPageLayout title="البيانات الأساسية" onBack={() => setEditSubView('menu')} onSave={handleSaveStoreInfo}>
                <div className="space-y-6">
                    
                    {/* Visual Header Section (Banner + Logo) */}
                    <div className="relative mb-12 mt-2">
                        {/* Banner Upload */}
                        <div className="h-40 w-full bg-gray-100 rounded-3xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer hover:border-[#6463C7] transition-colors">
                             {storeProfile.storeBanner ? (
                                <img src={storeProfile.storeBanner} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" alt="Store Banner" />
                             ) : (
                                <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-[#6463C7] transition-colors">
                                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                                        <ImageIcon size={20} />
                                    </div>
                                    <span className="text-[10px] font-bold">إضافة بنر (غلاف) للمتجر</span>
                                </div>
                             )}
                             <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                 <Camera size={32} className="text-white drop-shadow-md" />
                             </div>
                        </div>

                        {/* Logo Upload (Overlapping) */}
                        <div className="absolute -bottom-10 right-6 w-24 h-24 rounded-3xl bg-white p-1.5 shadow-xl border border-gray-50 cursor-pointer group hover:scale-105 transition-transform duration-300">
                             <div className="w-full h-full rounded-2xl bg-gray-50 overflow-hidden relative border border-gray-100">
                                 {storeProfile.storeImage ? (
                                     <img src={storeProfile.storeImage} className="w-full h-full object-cover" alt="Store Logo" />
                                 ) : (
                                     <div className="flex flex-col items-center justify-center h-full text-gray-300 gap-1">
                                         <Store size={24} />
                                         <span className="text-[8px] font-bold">الشعار</span>
                                     </div>
                                 )}
                                 <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[1px]">
                                     <Camera size={20} className="text-white" />
                                 </div>
                             </div>
                             <div className="absolute -bottom-2 -left-2 bg-[#6463C7] text-white p-1.5 rounded-full border-4 border-white shadow-sm">
                                 <Edit3 size={12} />
                             </div>
                        </div>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-5 px-1 pt-2">
                        {/* Store Name */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                <Store size={14} className="text-[#6463C7]" /> اسم المتجر
                            </label>
                            <input 
                                type="text" 
                                value={storeProfile.storeName}
                                onChange={(e) => setStoreProfile({...storeProfile, storeName: e.target.value})}
                                placeholder="مثال: متجر الأناقة"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] focus:ring-1 focus:ring-[#6463C7] outline-none text-sm transition-all placeholder:text-gray-300"
                            />
                        </div>
                        
                        {/* Activity */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                <Briefcase size={14} className="text-[#6463C7]" /> النشاط التجاري
                            </label>
                            <input 
                                type="text" 
                                value={storeProfile.activity}
                                onChange={(e) => setStoreProfile({...storeProfile, activity: e.target.value})}
                                placeholder="مثال: مطعم، أزياء، إلكترونيات"
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-right font-bold text-gray-900 focus:border-[#6463C7] focus:ring-1 focus:ring-[#6463C7] outline-none text-sm transition-all placeholder:text-gray-300"
                            />
                        </div>
                        
                        {/* Bio */}
                        <div>
                            <label className="text-xs font-bold text-gray-700 mb-2 flex items-center gap-1.5">
                                <FileText size={14} className="text-[#6463C7]" /> نبذة عن المتجر
                            </label>
                            <textarea 
                                value={storeProfile.bio}
                                onChange={(e) => setStoreProfile({...storeProfile, bio: e.target.value})}
                                placeholder="اكتب وصفاً مختصراً وجذاباً لمتجرك..."
                                className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3.5 text-right font-medium text-gray-900 focus:border-[#6463C7] focus:ring-1 focus:ring-[#6463C7] outline-none text-sm h-32 resize-none transition-all placeholder:text-gray-300 leading-relaxed"
                            />
                        </div>
                    </div>
                </div>
            </EditSubPageLayout>
          );
      }

      // 3. SERVICES FORM
      if (editSubView === 'services') {
          return (
            <EditSubPageLayout title="الخدمات المقدمة" onBack={() => setEditSubView('menu')} onSave={handleSaveStoreInfo}>
                <div className="grid grid-cols-2 gap-3">
                    {AVAILABLE_SERVICES.map((service) => {
                        const isSelected = storeProfile.services.includes(service.id);
                        return (
                            <button
                                key={service.id}
                                onClick={() => toggleService(service.id)}
                                className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all ${
                                    isSelected 
                                    ? 'bg-[#6463C7] border-[#6463C7] text-white shadow-md' 
                                    : 'bg-white border-gray-100 text-gray-500 hover:border-gray-200'
                                }`}
                            >
                                <service.icon size={24} strokeWidth={1.5} className="mb-2" />
                                <span className="text-xs font-bold">{service.label}</span>
                                {isSelected && <div className="absolute top-2 right-2"><CheckCircle2 size={14} fill="white" className="text-[#6463C7]" /></div>}
                            </button>
                        );
                    })}
                </div>
            </EditSubPageLayout>
          );
      }

      // 4. WORKING HOURS FORM
      if (editSubView === 'hours') {
          return (
            <EditSubPageLayout title="مواعيد العمل" onBack={() => setEditSubView('menu')} onSave={handleSaveStoreInfo}>
                
                {/* Shift Type Toggle */}
                <div className="bg-gray-100 p-1 rounded-xl flex mb-6">
                    <button 
                        onClick={() => setStoreProfile({...storeProfile, hoursType: 'single'})}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${storeProfile.hoursType === 'single' ? 'bg-white shadow text-[#6463C7]' : 'text-gray-500'}`}
                    >
                        فترة واحدة
                    </button>
                    <button 
                        onClick={() => setStoreProfile({...storeProfile, hoursType: 'split'})}
                        className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${storeProfile.hoursType === 'split' ? 'bg-white shadow text-[#6463C7]' : 'text-gray-500'}`}
                    >
                        فترتين
                    </button>
                </div>

                {/* Days List */}
                <div className="space-y-3">
                    {Object.entries(storeProfile.workDays).map(([dayKey, hours]: any) => {
                        const dayLabel = { sun: 'الأحد', mon: 'الاثنين', tue: 'الثلاثاء', wed: 'الأربعاء', thu: 'الخميس', fri: 'الجمعة', sat: 'السبت' }[dayKey];
                        
                        return (
                            <div key={dayKey} className={`bg-white border rounded-2xl p-3 transition-colors ${hours.open ? 'border-gray-200' : 'border-gray-100 opacity-60'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="font-bold text-sm text-gray-900">{dayLabel}</span>
                                    <div 
                                        onClick={() => {
                                            const newDays = { ...storeProfile.workDays };
                                            // @ts-ignore
                                            newDays[dayKey].open = !hours.open;
                                            setStoreProfile({ ...storeProfile, workDays: newDays });
                                        }}
                                        className={`w-10 h-6 rounded-full flex items-center p-1 cursor-pointer transition-colors ${hours.open ? 'bg-[#6463C7] justify-start' : 'bg-gray-200 justify-end'}`}
                                    >
                                        <div className="w-4 h-4 bg-white rounded-full shadow-sm"></div>
                                    </div>
                                </div>
                                
                                {hours.open && (
                                    <div className="grid grid-cols-2 gap-2 text-xs">
                                        <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                            <span className="text-gray-400">من</span>
                                            <span className="font-bold dir-ltr">{hours.from}</span>
                                        </div>
                                        <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                            <span className="text-gray-400">إلى</span>
                                            <span className="font-bold dir-ltr">{hours.to}</span>
                                        </div>
                                        
                                        {storeProfile.hoursType === 'split' && (
                                            <>
                                                <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-gray-400">من 2</span>
                                                    <span className="font-bold dir-ltr">{hours.from2 || '--:--'}</span>
                                                </div>
                                                <div className="bg-gray-50 p-2 rounded-lg flex items-center justify-between">
                                                    <span className="text-gray-400">إلى 2</span>
                                                    <span className="font-bold dir-ltr">{hours.to2 || '--:--'}</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </EditSubPageLayout>
          );
      }

      // 5. BRANCHES FORM
      if (editSubView === 'branches') {
          return (
            <EditSubPageLayout title="مواقع الفروع" onBack={() => setEditSubView('menu')} onSave={handleSaveStoreInfo} hideSave>
                <div className="space-y-4">
                    {/* Add New Button */}
                    <button 
                        onClick={() => {
                            setNewBranchStep('map');
                            setEditSubView('add_branch_map');
                        }}
                        className="w-full h-14 border-2 border-dashed border-[#6463C7]/30 rounded-2xl flex items-center justify-center gap-2 text-[#6463C7] font-bold bg-[#6463C7]/5 hover:bg-[#6463C7]/10 transition-colors"
                    >
                        <PlusCircle size={20} />
                        <span>إضافة فرع جديد</span>
                    </button>

                    {/* Branches List */}
                    {storeProfile.branches.map((branch) => (
                        <div key={branch.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-gray-900 text-sm">{branch.name}</h4>
                                    <p className="text-xs text-gray-500">{branch.city} - {branch.district}</p>
                                </div>
                            </div>
                            <button 
                                onClick={() => handleDeleteBranch(branch.id)}
                                className="w-8 h-8 rounded-full bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-100 transition-colors opacity-0 group-hover:opacity-100"
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </EditSubPageLayout>
          );
      }

      // 5.1 ADD BRANCH MAP VIEW
      if (editSubView === 'add_branch_map') {
          return (
            <div className="absolute inset-0 z-[270] bg-white flex flex-col animate-in slide-in-from-right duration-300 font-sans">
                
                {/* Map Header */}
                <div className="absolute top-0 left-0 right-0 z-20 px-6 pt-12 pb-4 bg-gradient-to-b from-white to-transparent pointer-events-none">
                    <div className="flex items-center justify-between pointer-events-auto">
                        <button 
                            onClick={() => setEditSubView('branches')} 
                            className="w-10 h-10 bg-white shadow-md rounded-full flex items-center justify-center text-gray-800 hover:bg-gray-50 transition-colors"
                        >
                            <ArrowRight size={22} />
                        </button>
                        <h2 className="text-lg font-black text-gray-900 bg-white/80 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm">تحديد موقع الفرع</h2>
                        <div className="w-10"></div>
                    </div>
                </div>

                {/* Map Container */}
                <div className="flex-1 relative bg-gray-200">
                    <div ref={mapContainerRef} className="w-full h-full z-0"></div>
                    
                    {/* Center Pin */}
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none -mt-4">
                        <div className="relative flex flex-col items-center">
                            <div className="w-10 h-10 bg-[#6463C7] rounded-full flex items-center justify-center text-white shadow-xl border-4 border-white animate-bounce">
                                <MapPin size={24} fill="currentColor" />
                            </div>
                            <div className="w-1 h-4 bg-black/20 rounded-full mt-1"></div>
                            <div className="w-8 h-2 bg-black/20 rounded-[100%] blur-[2px] mt-[-2px]"></div>
                        </div>
                    </div>

                    {/* Hint */}
                    <div className="absolute top-28 left-0 right-0 flex justify-center pointer-events-none">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-gray-100 flex items-center gap-2">
                            <LocateFixed size={14} className="text-[#6463C7]" />
                            <span className="text-xs font-bold text-gray-700">حرك الخريطة لتحديد الموقع بدقة</span>
                        </div>
                    </div>
                </div>

                {/* Confirmation Sheet */}
                <div className="bg-white rounded-t-[2rem] p-6 shadow-[0_-5px_30px_rgba(0,0,0,0.1)] relative z-20 -mt-6">
                    {newBranchStep === 'map' ? (
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#6463C7]">
                                    <Navigation size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 text-sm">الموقع المحدد</h3>
                                    <p className="text-xs text-gray-500">الرياض، المملكة العربية السعودية</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleConfirmLocation}
                                className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                            >
                                <Check size={20} />
                                <span>تأكيد هذا الموقع</span>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom duration-300">
                            <h3 className="font-bold text-gray-900 text-sm mb-2">تفاصيل الفرع</h3>
                            
                            <div>
                                <label className="text-[10px] font-bold text-gray-500 block mb-1.5">اسم الفرع</label>
                                <input 
                                    type="text" 
                                    placeholder="مثال: فرع العليا" 
                                    value={newBranchData.name}
                                    onChange={(e) => setNewBranchData({...newBranchData, name: e.target.value})}
                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right text-sm font-bold text-gray-900 focus:border-[#6463C7] outline-none"
                                />
                            </div>

                            <div className="flex gap-3">
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">المدينة</label>
                                    <input 
                                        type="text" 
                                        value={newBranchData.city}
                                        onChange={(e) => setNewBranchData({...newBranchData, city: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right text-sm font-bold text-gray-900 focus:border-[#6463C7] outline-none"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label className="text-[10px] font-bold text-gray-500 block mb-1.5">الحي</label>
                                    <input 
                                        type="text" 
                                        placeholder="اختياري" 
                                        value={newBranchData.district}
                                        onChange={(e) => setNewBranchData({...newBranchData, district: e.target.value})}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-right text-sm font-bold text-gray-900 focus:border-[#6463C7] outline-none"
                                    />
                                </div>
                            </div>

                            <button 
                                onClick={handleSaveNewBranch}
                                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
                            >
                                <Save size={20} />
                                <span>حفظ الفرع</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
          );
      }

      // 6. SOCIAL MEDIA FORM
      if (editSubView === 'socials') {
          return (
            <EditSubPageLayout title="وسائل التواصل" onBack={() => setEditSubView('menu')} onSave={handleSaveStoreInfo}>
                <div className="space-y-4">
                    <SocialInput 
                        icon={<Globe size={18} />} 
                        label="الموقع الإلكتروني" 
                        placeholder="www.example.com" 
                        value={storeProfile.socials.website} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, website: v}})} 
                    />
                    <SocialInput 
                        icon={<Phone size={18} />} 
                        label="رقم الاتصال الموحد" 
                        placeholder="9200xxxxx" 
                        value={storeProfile.socials.phone} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, phone: v}})} 
                    />
                    <SocialInput 
                        icon={<MessageCircle size={18} />} 
                        label="واتساب" 
                        placeholder="05xxxxxxxx" 
                        value={storeProfile.socials.whatsapp} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, whatsapp: v}})} 
                        color="text-green-500"
                    />
                    <SocialInput 
                        icon={<Instagram size={18} />} 
                        label="انستقرام" 
                        placeholder="@username" 
                        value={storeProfile.socials.instagram} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, instagram: v}})} 
                        color="text-pink-600"
                    />
                    <SocialInput 
                        icon={<Twitter size={18} />} 
                        label="منصة X" 
                        placeholder="@username" 
                        value={storeProfile.socials.twitter} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, twitter: v}})} 
                        color="text-gray-800"
                    />
                    <SocialInput 
                        icon={<Ghost size={18} />} 
                        label="سناب شات" 
                        placeholder="@username" 
                        value={storeProfile.socials.snapchat} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, snapchat: v}})} 
                        color="text-yellow-500"
                    />
                    <SocialInput 
                        icon={<Music2 size={18} />} 
                        label="تيك توك" 
                        placeholder="@username" 
                        value={storeProfile.socials.tiktok} 
                        onChange={(v) => setStoreProfile({...storeProfile, socials: {...storeProfile.socials, tiktok: v}})} 
                        color="text-black"
                    />
                </div>
            </EditSubPageLayout>
          );
      }
  }

  // --- DASHBOARD VIEW (Default) ---
  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-right duration-300 font-sans">
      
      {/* Store Upgrade Overlay */}
      <StoreUpgradeOverlay 
          isOpen={isUpgradeOpen} 
          onClose={() => setIsUpgradeOpen(false)} 
      />

      {/* Header */}
      <div className="bg-white relative z-10 shadow-sm border-b border-gray-50 pb-4">
          {/* Top Bar */}
          <div className="px-6 pt-12 pb-2 flex justify-between items-center">
              <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                  <ChevronRight size={24} />
              </button>
              <h2 className="text-lg font-black text-gray-900">إدارة المتجر</h2>
              {/* Edit Store Info Button */}
              <button 
                onClick={() => setCurrentView('edit_store')}
                className="p-2 -ml-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-600"
              >
                  <Edit size={20} />
              </button>
          </div>
      </div>

      {/* UPGRADE BANNER (New Addition) */}
      <div className="px-4 mt-4">
          <div 
            onClick={() => setIsUpgradeOpen(true)}
            className="w-full bg-gradient-to-r from-amber-400 to-yellow-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-amber-200 cursor-pointer active:scale-[0.99] transition-transform relative overflow-hidden group"
          >
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              <div className="relative z-10 flex items-center gap-4">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/30 group-hover:scale-110 transition-transform">
                      <Crown size={24} className="text-white fill-white" />
                  </div>
                  <div>
                      <h3 className="font-black text-sm mb-0.5">ترقية المتجر للمميز</h3>
                      <p className="text-[10px] font-medium opacity-90 leading-tight">
                          أطلق حملات إعلانية وضاعف مبيعاتك 🚀
                          <br/>
                          <span className="opacity-80">ظهور بين الإعلانات + مشاهدات أكثر</span>
                      </p>
                  </div>
              </div>
              <div className="relative z-10 bg-white text-amber-600 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm group-hover:bg-amber-50 transition-colors">
                  ترقية
              </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
          <div className="bg-white p-1.5 rounded-xl flex shadow-sm border border-gray-100">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'stats' 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  الإحصائيات والأداء
              </button>
              <button 
                onClick={() => setActiveTab('offers')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'offers' 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  عروض المتجر
              </button>
              <button 
                onClick={() => setActiveTab('sales')}
                className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-all ${
                    activeTab === 'sales' 
                    ? 'bg-gray-900 text-white shadow-md' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                  المبيعات
              </button>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-24">
          
          {/* 1. STATS VIEW (UPDATED FOR LOYALTY) */}
          {activeTab === 'stats' && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Summary Cards */}
                  <div className="grid grid-cols-2 gap-3">
                      {/* Points Issued */}
                      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">النقاط الممنوحة</span>
                              <div className="w-8 h-8 rounded-full bg-orange-50 flex items-center justify-center text-orange-500">
                                  <Coins size={16} />
                              </div>
                          </div>
                          <span className="text-xl font-black text-gray-900 dir-ltr block">15,450</span>
                          <span className="text-[9px] text-gray-400">تكلفة الاستثمار</span>
                      </div>

                      {/* Redemption Rate (Engagement) */}
                      <div className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">معدل الاستبدال</span>
                              <div className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                                  <RefreshCw size={16} />
                              </div>
                          </div>
                          <span className="text-xl font-black text-gray-900 dir-ltr block">53%</span>
                          <span className="text-[9px] text-green-600 font-bold">+5% عن الشهر الماضي</span>
                      </div>
                  </div>

                  {/* Loyalty Performance Chart */}
                  <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 relative overflow-hidden">
                      <div className="flex justify-between items-center mb-6">
                          <div>
                              <h3 className="font-black text-gray-900 text-sm">حركة النقاط</h3>
                              <p className="text-[10px] text-gray-400">الممنوحة vs المستبدلة</p>
                          </div>
                          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <Calendar size={12} className="text-gray-400" />
                              <span className="text-[10px] font-bold text-gray-500">يناير 2026</span>
                          </div>
                      </div>
                      
                      {/* Simplified Chart Bars */}
                      <div className="h-40 flex items-end justify-between gap-2 px-2">
                          {[60, 40, 75, 50, 90, 30, 80].map((h, i) => (
                              <div key={i} className="flex-1 flex flex-col justify-end gap-1 group relative">
                                  {/* Issued Bar */}
                                  <div className="w-full bg-orange-400 rounded-t-sm opacity-80" style={{ height: `${h}%` }}></div>
                                  {/* Redeemed Bar (Overlaid or Stacked simulation) */}
                                  <div className="w-full bg-green-500 rounded-t-sm absolute bottom-0 opacity-90" style={{ height: `${h * 0.6}%` }}></div>
                              </div>
                          ))}
                      </div>
                      <div className="flex justify-center gap-4 mt-3">
                          <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-orange-400"></div>
                              <span className="text-[9px] text-gray-500 font-bold">نقاط ممنوحة</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-[9px] text-gray-500 font-bold">نقاط مستبدلة</span>
                          </div>
                      </div>
                  </div>

                  {/* Detailed KPIs Grid */}
                  <div className="grid grid-cols-2 gap-3">
                      
                      {/* Active Members */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">العملاء النشطين</span>
                              <Users size={16} className="text-blue-500" />
                          </div>
                          <div className="flex items-end justify-between">
                              <span className="text-lg font-black text-gray-900 dir-ltr">842</span>
                              <span className="text-[9px] text-blue-500 font-bold flex items-center gap-0.5 bg-blue-50 px-1.5 py-0.5 rounded">
                                  <ArrowUpRight size={10} />
                                  12
                              </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="w-[70%] h-full bg-blue-500 rounded-full"></div>
                          </div>
                      </div>

                      {/* ROI */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">العائد من البرنامج</span>
                              <TrendingUp size={16} className="text-purple-600" />
                          </div>
                          <div className="flex items-end justify-between">
                              <span className="text-lg font-black text-gray-900 dir-ltr">x3.5</span>
                              <span className="text-[9px] text-purple-600 font-bold flex items-center gap-0.5 bg-purple-50 px-1.5 py-0.5 rounded">
                                  ROI
                              </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="w-[85%] h-full bg-purple-600 rounded-full"></div>
                          </div>
                      </div>

                      {/* Returning Customers */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">العملاء المتكررين</span>
                              <UserCheck size={16} className="text-teal-600" />
                          </div>
                          <div className="flex items-end justify-between">
                              <span className="text-lg font-black text-gray-900 dir-ltr">45%</span>
                              <span className="text-[9px] text-teal-600 font-bold flex items-center gap-0.5 bg-teal-50 px-1.5 py-0.5 rounded">
                                  <ArrowUpRight size={10} />
                                  2%
                              </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="w-[45%] h-full bg-teal-500 rounded-full"></div>
                          </div>
                      </div>

                      {/* Loyalty Sales */}
                      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                          <div className="flex justify-between items-start mb-2">
                              <span className="text-gray-500 text-[10px] font-bold">مبيعات عبر الولاء</span>
                              <ShoppingBag size={16} className="text-amber-500" />
                          </div>
                          <div className="flex items-end justify-between">
                              <span className="text-lg font-black text-gray-900 dir-ltr">45.2K</span>
                              <span className="text-[9px] text-amber-500 font-bold flex items-center gap-0.5 bg-amber-50 px-1.5 py-0.5 rounded">
                                  SAR
                              </span>
                          </div>
                          <div className="w-full bg-gray-100 h-1 mt-2 rounded-full overflow-hidden">
                              <div className="w-[60%] h-full bg-amber-500 rounded-full"></div>
                          </div>
                      </div>

                  </div>

              </div>
          )}

          {/* 2. OFFERS VIEW */}
          {activeTab === 'offers' && (
              <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Add Offer Button (Moved Here) */}
                  <button 
                    onClick={() => setCurrentView('add_offer')}
                    className="w-full bg-[#6463C7] text-white py-3.5 rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 flex items-center justify-center gap-2 active:scale-[0.99] transition-transform hover:bg-[#5352a3] mb-4"
                  >
                      <Plus size={20} />
                      <span>إضافة عرض جديد</span>
                  </button>

                  {myOffers.map((offer) => (
                      <div 
                        key={offer.id} 
                        onClick={() => handleOpenOfferDetails(offer)}
                        className="bg-white p-4 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-4 group active:scale-[0.99] transition-transform cursor-pointer"
                      >
                          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 border border-gray-100 
                              ${offer.type === 'offer' ? 'bg-purple-50 text-purple-500' : 
                                offer.type === 'code' ? 'bg-blue-50 text-blue-500' : 
                                'bg-green-50 text-green-500'}`
                          }>
                              {offer.type === 'offer' ? <Gift size={24} /> : offer.type === 'code' ? <Tag size={24} /> : <CreditCard size={24} />}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                  <h4 className="font-bold text-gray-900 text-sm truncate ml-2">{offer.title}</h4>
                                  <button className="text-gray-400 hover:text-[#6463C7] p-1 -mr-1">
                                      <Edit3 size={16} />
                                  </button>
                              </div>
                              
                              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-medium mb-2">
                                  {/* Type Specific Badge */}
                                  {offer.type === 'offer' && <span className="bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded dir-ltr">{offer.discountPercent}% OFF</span>}
                                  {offer.type === 'code' && <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded font-mono uppercase tracking-wider">{offer.codeText}</span>}
                                  {offer.type === 'voucher' && <span className="bg-green-50 text-green-700 px-1.5 py-0.5 rounded dir-ltr">{offer.voucherValue} SAR</span>}
                                  
                                  <span className="flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                      <Eye size={12} /> {offer.stats.views}
                                  </span>
                              </div>

                              <div className="flex items-center justify-between">
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${
                                      offer.status === 'active' ? 'bg-green-50 text-green-600 border border-green-100' :
                                      offer.status === 'review' ? 'bg-orange-50 text-orange-600 border border-orange-100' :
                                      'bg-red-50 text-red-600 border border-red-100'
                                  }`}>
                                      {offer.status === 'active' ? 'نشط' : offer.status === 'review' ? 'مراجعة' : 'منتهي'}
                                  </span>
                                  <span className="text-xs font-bold text-[#6463C7] dir-ltr">{offer.pointsCost} PTS</span>
                              </div>
                          </div>
                      </div>
                  ))}
                  
                  {myOffers.length === 0 && (
                      <div className="text-center py-20 text-gray-400">
                          <Package size={48} className="mx-auto mb-3 opacity-20" />
                          <p className="text-sm font-bold">لا توجد عروض حالياً</p>
                      </div>
                  )}
              </div>
          )}

          {/* 3. SALES VIEW */}
          {activeTab === 'sales' && (
              <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  
                  {/* Summary Bar */}
                  <div className="flex gap-3 mb-2">
                      <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">إجمالي اليوم</span>
                          <span className="text-lg font-black text-gray-900 dir-ltr">1,240 ر.س</span>
                      </div>
                      <div className="flex-1 bg-white p-3 rounded-2xl border border-gray-100 shadow-sm text-center">
                          <span className="text-[10px] text-gray-400 font-bold block mb-1">عدد الطلبات</span>
                          <span className="text-lg font-black text-gray-900">12 طلب</span>
                      </div>
                  </div>

                  {/* Filter Row */}
                  <div className="flex items-center justify-between px-1">
                      <h3 className="font-black text-gray-900 text-sm">سجل الطلبات</h3>
                      <div className="flex gap-2">
                          <button className="p-2 bg-white rounded-lg border border-gray-100 text-gray-500 shadow-sm">
                              <Filter size={14} />
                          </button>
                          <button className="p-2 bg-white rounded-lg border border-gray-100 text-gray-500 shadow-sm">
                              <Download size={14} />
                          </button>
                      </div>
                  </div>

                  {/* Orders List */}
                  <div className="bg-white rounded-3xl p-2 shadow-sm border border-gray-100">
                      {latestOrders.map((order, idx) => (
                          <div key={idx} className="flex items-center justify-between p-3 border-b border-gray-50 last:border-0 last:pb-1 group hover:bg-gray-50 rounded-2xl transition-colors">
                              <div className="flex items-center gap-3">
                                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                                      order.status === 'new' ? 'bg-green-50 text-green-600' : 
                                      order.status === 'cancelled' ? 'bg-red-50 text-red-600' :
                                      'bg-gray-50 text-gray-400'
                                  }`}>
                                      <ShoppingBag size={20} />
                                  </div>
                                  <div>
                                      <div className="flex items-center gap-2">
                                          <span className="text-sm font-bold text-gray-900">{order.customer}</span>
                                          {order.status === 'new' && (
                                              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                                          )}
                                      </div>
                                      <div className="flex items-center gap-2 mt-1">
                                          <span className="text-[10px] text-gray-400 font-medium dir-ltr">{order.id}</span>
                                          <span className="w-px h-2 bg-gray-200"></span>
                                          <div className="flex items-center gap-0.5 text-[9px] text-gray-400">
                                              <Clock size={8} />
                                              <span>{order.time}</span>
                                          </div>
                                          <span className="w-px h-2 bg-gray-200"></span>
                                          <span className="text-[9px] text-gray-500 font-medium">{order.items} منتجات</span>
                                      </div>
                                  </div>
                              </div>
                              <div className="text-left">
                                  <span className="block text-sm font-black text-[#6463C7] dir-ltr">{order.amount}</span>
                                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md inline-block mt-1 ${
                                      order.status === 'new' ? 'bg-green-100 text-green-700' : 
                                      order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                      'bg-gray-100 text-gray-500'
                                  }`}>
                                      {order.status === 'new' ? 'طلب جديد' : order.status === 'cancelled' ? 'ملغي' : 'مكتمل'}
                                  </span>
                              </div>
                          </div>
                      ))}
                      
                      {latestOrders.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                              <ShoppingBag size={32} className="mx-auto mb-2 opacity-20" />
                              <p className="text-xs font-medium">لا توجد طلبات في هذا القسم</p>
                          </div>
                      )}
                  </div>
              </div>
          )}

      </div>

      <BottomNav 
        activeTab='profile'
        onHomeClick={onHomeClick}
        onOffersClick={onOffersClick}
        onMessagesClick={onMessagesClick}
        onProfileClick={onProfileClick}
        onScanClick={onScanClick}
      />
    </div>
  );
};

// Helper Sub Components for Edit Store
const EditMenuItem = ({ icon: Icon, label, desc, onClick }: { icon: any, label: string, desc: string, onClick: () => void }) => (
    <div onClick={onClick} className="bg-white p-4 rounded-2xl border border-gray-100 flex items-center justify-between cursor-pointer hover:border-[#6463C7]/30 transition-all active:scale-[0.99] group">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-gray-50 flex items-center justify-center text-[#6463C7] group-hover:bg-[#6463C7] group-hover:text-white transition-colors">
                <Icon size={20} />
            </div>
            <div>
                <h4 className="font-bold text-gray-900 text-sm mb-0.5">{label}</h4>
                <p className="text-xs text-gray-400 font-medium">{desc}</p>
            </div>
        </div>
        <div className="text-gray-300 group-hover:text-[#6463C7] transition-colors">
            <ChevronLeft size={20} />
        </div>
    </div>
);

// Generic Layout Wrapper for Sub-pages
const EditSubPageLayout = ({ title, onBack, onSave, children, hideSave }: { title: string, onBack: () => void, onSave: () => void, children?: React.ReactNode, hideSave?: boolean }) => (
    <div className="absolute inset-0 z-[260] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
        <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 border-b border-gray-50">
            <button onClick={onBack} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                <ArrowRight size={24} />
            </button>
            <h2 className="text-lg font-black text-gray-900">{title}</h2>
            <div className="w-8"></div>
        </div>
        <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
            {children}
        </div>
        {!hideSave && (
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button onClick={onSave} className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
                    <Save size={20} />
                    <span>حفظ التعديلات</span>
                </button>
            </div>
        )}
    </div>
);

// Social Input Helper
const SocialInput = ({ icon, label, placeholder, value, onChange, color }: any) => (
    <div className="bg-white p-2 rounded-2xl border border-gray-100 flex items-center gap-3 focus-within:border-[#6463C7] transition-colors">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-gray-50 ${color || 'text-gray-500'}`}>
            {icon}
        </div>
        <div className="flex-1">
            <label className="text-[9px] font-bold text-gray-400 block mb-0.5">{label}</label>
            <input 
                type="text" 
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full text-sm font-bold text-gray-900 outline-none bg-transparent placeholder:text-gray-300 text-right dir-ltr"
            />
        </div>
    </div>
);

// Icons
const StoreIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7"/>
        <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/>
        <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4"/>
        <path d="M2 7h20"/>
        <path d="M22 7v3a2 2 0 0 1-2 2v0a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 16 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 12 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 8 12a2.7 2.7 0 0 1-1.59-.63.7.7 0 0 0-.82 0A2.7 2.7 0 0 1 4 12v0a2 2 0 0 1-2-2V7"/>
    </svg>
);
