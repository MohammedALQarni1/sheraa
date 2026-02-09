
import React, { useState, useEffect } from 'react';
import { Plus, Check, MapPin, Image as ImageIcon, ChevronLeft, ChevronRight, LayoutGrid, Phone, AlertCircle, X, Share2, Copy } from 'lucide-react';
import { CATEGORIES, MOCK_USER } from '../constants';
import { AdItem } from '../types';

// Mock Sub-categories for demonstration
const SUB_CATEGORIES_MAP: Record<string, string[]> = {
  'cars': ['تويوتا', 'هيونداي', 'فورد', 'نيسان', 'مرسيدس', 'بي ام دبليو', 'لكزس', 'مازدا'],
  'mobiles': ['ايفون', 'سامسونج', 'هواوي', 'شاومي', 'نوكيا', 'سوني', 'اوبو', 'فيفو'],
  'electronics': ['تلفزيونات', 'أجهزة صوتية', 'سماعات', 'أجهزة ألعاب', 'طابعات'],
  'furniture': ['كنب', 'طاولات', 'غرف نوم', 'مطابخ', 'ديكور', 'سجاد', 'إضاءة'],
  'default': ['قسم فرعي 1', 'قسم فرعي 2', 'قسم فرعي 3', 'قسم فرعي 4', 'قسم فرعي 5']
};

interface AddAdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onPublish?: (ad: AdItem) => void;
  initialAd?: AdItem | null; // Added for Edit Mode
}

type ViewState = 'form' | 'main-categories' | 'sub-categories';

export const AddAdOverlay: React.FC<AddAdOverlayProps> = ({ isOpen, onClose, onPublish, initialAd }) => {
  const [step, setStep] = useState(1);
  const [currentView, setCurrentView] = useState<ViewState>('form');
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Track selected main category to show correct sub-categories
  const [selectedMainCatId, setSelectedMainCatId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', 
    category: '', 
    mainCategoryName: '',
    subCategoryName: '',
    description: '',
    price: '',
    phoneNumber: '0530242696', // Default registered number
    location: 'منطقة الرياض، مدينة الرياض، الرمال',
    showPhone: true
  });

  // Effect to Populate Form on Open (Edit Mode vs New Mode)
  useEffect(() => {
      if (isOpen) {
          if (initialAd) {
              // Edit Mode: Pre-fill data
              setFormData({
                  title: initialAd.title,
                  category: initialAd.category || '',
                  mainCategoryName: initialAd.category ? CATEGORIES.find(c => c.id === initialAd.category)?.name || '' : '',
                  subCategoryName: '', // Simplified for mock
                  description: initialAd.description || '',
                  price: initialAd.price.toString(),
                  phoneNumber: '0530242696',
                  location: initialAd.location,
                  showPhone: true
              });
              setStep(1); // Start at step 1
          } else {
              // New Mode: Reset form
              setFormData({
                  title: '',
                  category: '',
                  mainCategoryName: '',
                  subCategoryName: '',
                  description: '',
                  price: '',
                  phoneNumber: '0530242696',
                  location: 'منطقة الرياض، مدينة الرياض، الرمال',
                  showPhone: true
              });
              setStep(1);
          }
          setCurrentView('form');
          setShowSuccess(false);
      }
  }, [isOpen, initialAd]);

  const MAX_DESC_CHARS = 500;
  const MIN_DESC_CHARS = 20;

  if (!isOpen) return null;

  const handleNext = () => setStep(2);
  // const handleBackStep = () => setStep(1); // Unused

  // Helper to force English digits
  const normalizePhoneNumber = (val: string) => {
    return val.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
  };

  // Category Navigation Handlers
  const openCategories = () => {
    setCurrentView('main-categories');
  };

  const selectMainCategory = (catId: string, catName: string) => {
    setSelectedMainCatId(catId);
    setFormData(prev => ({ ...prev, mainCategoryName: catName }));
    setCurrentView('sub-categories');
  };

  const selectSubCategory = (subName: string) => {
    setFormData(prev => ({ 
        ...prev, 
        subCategoryName: subName,
        category: `${prev.mainCategoryName} - ${subName}`
    }));
    setCurrentView('form');
  };

  const handleBackToForm = () => {
    setCurrentView('form');
  };

  const handleBackToMainCats = () => {
    setCurrentView('main-categories');
  };

  const handleSubmit = () => {
    // Show Success Popup instead of alert
    setShowSuccess(true);
  };

  const handleFinalClose = () => {
    // Construct new Ad Item
    const newAd: AdItem = {
        id: initialAd ? initialAd.id : `new_${Date.now()}`,
        type: 'ad',
        title: formData.title || 'إعلان جديد',
        image: initialAd?.image || 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800', // Mock Image or keep existing
        images: initialAd?.images || ['https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800'],
        price: Number(formData.price) || 0,
        currency: 'ر.س',
        location: formData.location, 
        user: { ...MOCK_USER, id: 'current_user' },
        postedTime: 'الآن',
        condition: initialAd?.condition || 'جديد',
        description: formData.description || formData.title,
        category: initialAd?.category || 'cars', // Simplified
        views: initialAd?.views || 0,
        isFeatured: initialAd?.isFeatured || false,
        isVIP: initialAd?.isVIP || false
    };

    setShowSuccess(false);

    if (onPublish) {
        onPublish(newAd);
    } else {
        onClose();
    }
  };

  const ToggleSwitch = ({ checked, onChange }: { checked: boolean, onChange: (v: boolean) => void }) => (
    <div 
      onClick={() => onChange(!checked)}
      className={`w-12 h-7 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-300 ${checked ? 'bg-[#6463C7]' : 'bg-gray-300'}`}
    >
      <div className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${checked ? '-translate-x-5' : 'translate-x-0'}`}></div>
    </div>
  );

  const isEditMode = !!initialAd;

  // --- RENDER CONTENT BASED ON VIEW ---

  // 1. Success Popup View
  if (showSuccess) {
      return (
        <div className="absolute inset-0 z-[300] flex items-center justify-center px-6 font-sans">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={handleFinalClose}></div>
            
            {/* Popup Card */}
            <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 relative z-10 animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 flex flex-col items-center text-center shadow-2xl">
                
                {/* Close Button */}
                <button 
                    onClick={handleFinalClose}
                    className="absolute top-6 left-6 text-gray-400 hover:text-gray-800 transition-colors"
                >
                    <X size={24} />
                </button>

                {/* Success Icon */}
                <div className="w-24 h-24 rounded-full bg-[#6463C7] flex items-center justify-center mb-6 shadow-xl shadow-indigo-200 ring-8 ring-indigo-50">
                    <Check size={48} className="text-white" strokeWidth={3} />
                </div>

                {/* Success Text */}
                <h3 className="text-gray-900 font-bold text-lg mb-1">تم إستلام طلبك</h3>
                
                <h2 className="text-3xl font-black text-[#6463C7] mb-2 drop-shadow-sm">
                    {isEditMode ? 'تم التعديل بنجاح' : 'تم النشر بنجاح'}
                </h2>
                
                <p className="text-gray-400 font-bold text-sm mb-8">
                    {isEditMode ? 'تم تحديث بيانات الإعلان' : 'إعلانك يظهر الآن للمستخدمين'}
                </p>

                {/* Ad Reference Box */}
                <div className="w-full bg-[#F4F3FF] border-[2px] border-dashed border-[#6463C7]/40 rounded-3xl py-5 mb-6 relative flex flex-col items-center justify-center gap-1">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wider">رقم الإعلان المرجعي</span>
                    <div className="flex items-center gap-2">
                         <span className="text-[#6463C7] font-black text-xl tracking-widest dir-ltr font-mono drop-shadow-sm">
                            #{Math.floor(Math.random() * 90000) + 10000}
                         </span>
                         <button className="text-gray-400 hover:text-[#6463C7]">
                             <Copy size={14} />
                         </button>
                    </div>
                    
                    {/* Cutout circles decoration */}
                    <div className="absolute top-1/2 -left-3 w-6 h-6 bg-white rounded-full transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full transform -translate-y-1/2"></div>
                </div>

                <div className="flex gap-3 w-full">
                    <button 
                        onClick={handleFinalClose}
                        className="flex-1 bg-[#6463C7] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-transform"
                    >
                        عرض الإعلان
                    </button>
                    <button className="w-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center border border-gray-100 hover:bg-gray-100 active:scale-[0.98] transition-colors">
                        <Share2 size={20} />
                    </button>
                </div>
            </div>
        </div>
      );
  }

  // 2. Main Categories List View
  if (currentView === 'main-categories') {
      return (
        <div className="absolute inset-0 z-[250] bg-white flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="px-4 pt-12 pb-4 flex items-center justify-between shadow-sm border-b border-gray-100">
                <button onClick={handleBackToForm} className="p-2 -mr-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                    <ChevronRight size={24} />
                </button>
                <h2 className="text-gray-900 text-lg font-black">القسم الرئيسي</h2>
                <div className="w-10"></div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
                {CATEGORIES.map((cat) => (
                    <div 
                        key={cat.id}
                        onClick={() => selectMainCategory(cat.id, cat.name)}
                        className="bg-white p-4 mb-2 rounded-2xl flex items-center justify-between border border-transparent hover:border-[#6463C7]/30 cursor-pointer transition-all active:scale-[0.99]"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-[#6463C7]/10 flex items-center justify-center text-[#6463C7]">
                                <cat.icon size={20} />
                            </div>
                            <span className="font-bold text-gray-900">{cat.name}</span>
                        </div>
                        <ChevronLeft size={20} className="text-gray-300" />
                    </div>
                ))}
            </div>
        </div>
      );
  }

  // 3. Sub Categories List View
  if (currentView === 'sub-categories') {
      const subCats = (selectedMainCatId && SUB_CATEGORIES_MAP[selectedMainCatId]) 
        ? SUB_CATEGORIES_MAP[selectedMainCatId] 
        : SUB_CATEGORIES_MAP['default'];

      return (
        <div className="absolute inset-0 z-[250] bg-white flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="px-4 pt-12 pb-4 flex items-center justify-between shadow-sm border-b border-gray-100">
                <button onClick={handleBackToMainCats} className="p-2 -mr-2 text-gray-800 hover:bg-gray-50 rounded-full transition-colors">
                    <ChevronRight size={24} />
                </button>
                <h2 className="text-gray-900 text-lg font-black">{formData.mainCategoryName || 'القسم الفرعي'}</h2>
                <div className="w-10"></div>
            </div>
            <div className="flex-1 overflow-y-auto bg-gray-50 p-2">
                {subCats.map((subName, idx) => (
                    <div 
                        key={idx}
                        onClick={() => selectSubCategory(subName)}
                        className="bg-white p-4 mb-2 rounded-2xl flex items-center justify-between border border-transparent hover:border-[#6463C7]/30 cursor-pointer transition-all active:scale-[0.99]"
                    >
                        <span className="font-bold text-gray-900 px-2">{subName}</span>
                        <ChevronLeft size={20} className="text-gray-300" />
                    </div>
                ))}
            </div>
        </div>
      );
  }

  // 4. Main Form View (Step 1 & 2)
  return (
    <div className="absolute inset-0 z-[250] bg-[#f3f4f6] flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Form Header */}
      <div className="bg-white px-4 pt-12 pb-4 flex items-center justify-between shadow-sm border-b border-gray-100">
        <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-red-500 px-2 py-1 text-sm font-bold transition-colors"
        >
            إلغاء
        </button>
        <h2 className="text-gray-900 text-lg font-black">
            {isEditMode ? 'تعديل الإعلان' : 'إضافة إعلان'}
        </h2>
        <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto bg-[#f3f4f6]">
        
        {/* --- STEP 1 --- */}
        {step === 1 && (
            <div className="p-4 space-y-6">
                
                {/* Images Section */}
                <div className="space-y-4">
                    <div className="flex justify-between items-center px-1">
                        <span className="text-gray-900 font-bold text-sm">صور الاعلان</span>
                        <span className="text-gray-400 text-xs font-medium">الحد الأقصى 10 صور</span>
                    </div>

                    {/* Main Image (Large) */}
                    <div className="w-full h-56 bg-white rounded-3xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center relative cursor-pointer hover:border-[#6463C7] hover:bg-[#6463C7]/5 transition-all group overflow-hidden">
                            {initialAd?.image ? (
                                <img src={initialAd.image} className="absolute inset-0 w-full h-full object-cover" alt="Main" />
                            ) : (
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md text-[#6463C7] border border-[#6463C7]/20 text-[10px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm z-10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-[#6463C7] animate-pulse"></div>
                                    الصورة الرئيسية
                                </div>
                            )}
                            
                            <div className="flex flex-col items-center gap-4 text-gray-300 group-hover:text-[#6463C7] transition-colors scale-100 group-hover:scale-105 duration-300 relative z-20">
                                <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-white group-hover:shadow-md transition-all">
                                    <ImageIcon size={40} strokeWidth={1.5} />
                                </div>
                                <div className="text-center space-y-1">
                                    <p className="text-sm font-bold text-gray-500 group-hover:text-[#6463C7] bg-white/80 px-2 rounded">
                                        {isEditMode ? 'اضغط لتغيير الصورة' : 'اضغط لإرفاق الصورة الرئيسية'}
                                    </p>
                                </div>
                            </div>
                    </div>

                    {/* Gallery Grid (Smaller) */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar px-1">
                            <button className="min-w-[88px] h-[88px] bg-white border border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:text-[#6463C7] hover:border-[#6463C7] transition-all shadow-sm shrink-0">
                                <Plus size={24} />
                                <span className="text-[10px] font-bold">إضافة المزيد</span>
                            </button>
                            
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="min-w-[88px] h-[88px] bg-gray-50 rounded-2xl border border-gray-100 flex items-center justify-center relative shrink-0">
                                    <ImageIcon size={24} className="text-gray-300" strokeWidth={1.5} />
                                </div>
                            ))}
                    </div>
                </div>

                {/* Form Fields Step 1 */}
                <div className="bg-white px-4 py-2 rounded-3xl shadow-sm border border-gray-100 divide-y divide-gray-50">
                    
                    {/* Location */}
                    <div className="py-5">
                        <div className="flex justify-between items-center mb-1">
                            <span className="text-gray-900 font-bold text-sm">الموقع</span>
                            <div className="bg-green-50 text-green-600 p-1 rounded-full">
                                <Check size={14} strokeWidth={3} />
                            </div>
                        </div>
                        <div className="text-[#6463C7] text-sm font-bold text-right cursor-pointer flex items-center justify-end gap-1 hover:text-[#5352a3] transition-colors">
                            <MapPin size={14} />
                            {formData.location}
                        </div>
                    </div>

                    {/* Section (Replaces Category & Title) */}
                    <div className="py-5" onClick={openCategories}>
                        <div className="flex justify-between items-center mb-2">
                             <label className="text-gray-900 font-bold text-sm">القسم</label>
                             <span className="text-gray-400 text-xs font-medium">(تغيير)</span>
                        </div>
                        <div className={`text-sm font-medium text-right cursor-pointer flex items-center justify-end gap-2 ${formData.category ? 'text-[#6463C7] font-bold' : 'text-gray-400'}`}>
                            {formData.category ? (
                                <>
                                   <span>{formData.category}</span>
                                   <LayoutGrid size={16} />
                                </>
                            ) : 'حدد القسم المناسب'}
                        </div>
                    </div>

                </div>

                {/* Continue Button */}
                <div className="pt-8 pb-10">
                    <button 
                        onClick={handleNext}
                        disabled={!formData.category}
                        className={`w-full text-white font-bold text-lg py-4 rounded-2xl shadow-lg transition-all ${
                            formData.category 
                            ? 'bg-[#6463C7] shadow-[#6463C7]/20 hover:bg-[#5352a3] active:scale-[0.98]' 
                            : 'bg-gray-300 cursor-not-allowed shadow-none'
                        }`}
                    >
                        استمرار
                    </button>
                </div>
            </div>
        )}

        {/* --- STEP 2 --- */}
        {step === 2 && (
             <div className="p-4 space-y-4">
                
                {/* Title Input (Back button removed) */}
                <div className="bg-white px-4 py-4 rounded-3xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                         <span className="text-gray-900 font-bold text-sm">عنوان الاعلان</span>
                    </div>
                    <input 
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({...formData, title: e.target.value})}
                        placeholder="مثال: كامري 2019 فل كامل للبيع"
                        className="w-full text-right text-gray-900 placeholder:text-gray-300 outline-none text-sm font-medium"
                    />
                </div>

                {/* Description (Character Counter Added) */}
                <div className="bg-white px-4 py-4 rounded-3xl shadow-sm border border-gray-100">
                     <div className="flex justify-between items-center mb-2">
                         <span className="text-gray-900 font-bold text-sm">معلومات الاعلان</span>
                     </div>
                     <textarea 
                        value={formData.description}
                        onChange={(e) => {
                            if (e.target.value.length <= MAX_DESC_CHARS) {
                                setFormData({...formData, description: e.target.value});
                            }
                        }}
                        placeholder="اكتب وصف كامل للعرض (المواصفات، الحالة، الملحقات...)"
                        className="w-full h-32 text-right text-gray-900 placeholder:text-gray-300 outline-none text-sm font-medium resize-none bg-transparent leading-relaxed"
                     />
                     {/* Character Counter */}
                     <div className="flex justify-end mt-2">
                        <span className={`text-[10px] font-bold ${
                            formData.description.length < MIN_DESC_CHARS ? 'text-red-400' : 
                            formData.description.length === MAX_DESC_CHARS ? 'text-orange-500' : 'text-gray-400'
                        }`}>
                            {formData.description.length} / {MAX_DESC_CHARS}
                        </span>
                     </div>
                     {formData.description.length > 0 && formData.description.length < MIN_DESC_CHARS && (
                        <p className="text-[10px] text-red-400 text-right mt-1">يجب كتابة {MIN_DESC_CHARS} حرف على الأقل</p>
                     )}
                </div>

                {/* Price Input (Separated, New Design) */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-gray-900 font-bold text-sm">السعر المطلوب</span>
                        <div className="h-px flex-1 bg-gray-100"></div>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 focus-within:border-[#6463C7]/50 focus-within:bg-white focus-within:ring-4 focus-within:ring-[#6463C7]/5 transition-all">
                        <input 
                            type="number"
                            value={formData.price}
                            onChange={(e) => setFormData({...formData, price: e.target.value})}
                            placeholder="0"
                            className="flex-1 bg-transparent text-center text-xl font-black text-[#6463C7] outline-none placeholder:text-gray-300"
                        />
                        <span className="text-gray-400 text-xs font-bold pl-1">ريال سعودي</span>
                    </div>
                </div>

                {/* Phone Input (Separated, Editable) */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                             <span className="text-gray-900 font-bold text-sm">رقم التواصل</span>
                        </div>
                        <ToggleSwitch checked={formData.showPhone} onChange={(v) => setFormData({...formData, showPhone: v})} />
                    </div>

                    {formData.showPhone && (
                        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                             <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-[#6463C7] focus-within:ring-1 focus-within:ring-[#6463C7] transition-all">
                                <div className="bg-gray-50 p-2 rounded-lg text-gray-500">
                                    <Phone size={18} />
                                </div>
                                <input 
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({...formData, phoneNumber: normalizePhoneNumber(e.target.value)})}
                                    placeholder="05xxxxxxxx"
                                    className="flex-1 bg-transparent text-right text-base font-bold text-gray-900 outline-none dir-ltr"
                                />
                             </div>
                             <p className="text-[10px] text-gray-400 mt-2 text-right">
                                يمكنك تعديل الرقم لهذا الإعلان فقط، لن يتم تغيير رقمك الأساسي في الملف الشخصي.
                             </p>
                        </div>
                    )}
                </div>

                {/* Submit Buttons */}
                <div className="pt-4 pb-10">
                    <button 
                        onClick={handleSubmit}
                        className="w-full bg-[#6463C7] text-white font-bold text-lg h-14 rounded-2xl shadow-lg shadow-[#6463C7]/20 hover:bg-[#5352a3] active:scale-[0.98] transition-all"
                    >
                        {isEditMode ? 'حفظ التعديلات' : 'نشر الإعلان'}
                    </button>
                </div>

             </div>
        )}

      </div>
    </div>
  );
};
