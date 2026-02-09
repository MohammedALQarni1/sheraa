
import React, { useState, useRef, useEffect } from 'react';
import { X, ChevronRight, Store, Upload, Check, FileText, Building2, User, Briefcase, FileCheck, ArrowLeft, Loader2, ChevronDown, Layers, Hash, FileDigit, Camera, Image as ImageIcon } from 'lucide-react';

interface StoreRegistrationOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onRegistrationSuccess?: (data: any) => void; // New prop
}

type EntityType = 'individual' | 'establishment' | 'company';

// Mapping Main Activities to Sub Activities
const ACTIVITY_SUB_CATEGORIES: Record<string, string[]> = {
  electronics: ['جوالات واكسسواراتها', 'حاسب آلي وصيانة', 'أجهزة منزلية', 'كاميرات وأنظمة مراقبة', 'ألعاب فيديو'],
  fashion: ['ملابس رجالية', 'ملابس نسائية', 'ملابس أطفال', 'أحذية وحقائب', 'عبايات وطرح', 'عطور وتجميل'],
  home: ['أثاث ومفروشات', 'ديكور منزلي', 'أدوات مطبخ', 'إضاءة وكهرباء', 'سجاد وموكيت'],
  food: ['مطعم ومقهى', 'حلويات ومخابز', 'أغذية ومشروبات', 'تمور وعسل', 'خضار وفواكه'],
  services: ['خدمات عامة', 'نقل عفش', 'نظافة وصيانة', 'دعاية وإعلان', 'خدمات عقارية', 'تنظيم حفلات']
};

// Activity Options for Custom Select
const ACTIVITY_OPTIONS = [
    { value: 'electronics', label: 'إلكترونيات' },
    { value: 'fashion', label: 'أزياء وموضة' },
    { value: 'home', label: 'منزل وديكور' },
    { value: 'food', label: 'أغذية ومشروبات' },
    { value: 'services', label: 'خدمات عامة' }
];

export const StoreRegistrationOverlay: React.FC<StoreRegistrationOverlayProps> = ({ isOpen, onClose, onRegistrationSuccess }) => {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    storeName: '',
    activity: '',
    subActivity: '',
    storeImage: '', // New field for Store Logo
    businessPlatformNumber: '', // شهادة توثيق منصة الاعمال
    entityType: 'individual' as EntityType,
    freelanceDocNumber: '', // وثيقة العمل الحر
    crNumber: '', // السجل التجاري
    // Real File Objects
    nationalIdFile: null as File | null,
    freelanceDocFile: null as File | null,
    crDocFile: null as File | null,
  });

  if (!isOpen) return null;

  const handleNext = () => {
      if (step === 1 && (!formData.storeName || !formData.activity || !formData.subActivity)) {
          alert('يرجى تعبئة جميع الحقول الأساسية');
          return;
      }
      setStep(prev => prev + 1);
  };

  const handleBack = () => {
      setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
      // Basic Validation based on Entity Type
      if (!formData.businessPlatformNumber) {
          alert('يرجى إدخال رقم توثيق المنصة');
          return;
      }

      if (formData.entityType === 'individual') {
          if (!formData.freelanceDocNumber) {
              alert('يرجى إدخال رقم وثيقة العمل الحر');
              return;
          }
          if (!formData.nationalIdFile || !formData.freelanceDocFile) {
              alert('يرجى رفع المستندات المطلوبة (الهوية ووثيقة العمل الحر)');
              return;
          }
      } else {
          // Est or Company
          if (!formData.crNumber) {
              alert('يرجى إدخال رقم السجل التجاري');
              return;
          }
          if (!formData.nationalIdFile || !formData.crDocFile) {
              alert('يرجى رفع المستندات المطلوبة (الهوية والسجل التجاري)');
              return;
          }
      }

      setIsSubmitting(true);
      
      // Simulate API Call
      setTimeout(() => {
          setIsSubmitting(false);
          setShowSuccess(true);
      }, 2000);
  };

  // Handler for file selection
  const handleFileSelect = (file: File, field: 'nationalIdFile' | 'freelanceDocFile' | 'crDocFile') => {
      setFormData(prev => ({ ...prev, [field]: file }));
  };

  const handleLogoUpload = () => {
      // Simulate Logo Upload (Keep separate or implement real upload if needed)
      setTimeout(() => {
          // Setting a mock image URL
          setFormData(prev => ({ ...prev, storeImage: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=200' }));
      }, 500);
  };

  // This function finishes the process
  const handleComplete = () => {
      if (onRegistrationSuccess) {
          onRegistrationSuccess(formData); // Pass the form data back to parent
      } else {
          onClose(); // Just close if no handler
      }
  };

  // --- RENDER SUCCESS VIEW ---
  if (showSuccess) {
      return (
        <div className="absolute inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 font-sans text-center">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative animate-in zoom-in duration-500">
                <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
                <Store size={48} className="text-green-600" strokeWidth={1.5} />
                <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 shadow-sm">
                    <Check size={20} className="text-green-600 bg-green-100 rounded-full p-0.5" />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">تم إرسال الطلب بنجاح!</h2>
            <p className="text-gray-500 text-sm mb-8 max-w-xs leading-relaxed">
                شكراً لك! طلبك لفتح متجر <span className="font-bold text-gray-900">"{formData.storeName}"</span> قيد المراجعة حالياً. سيتم إشعارك فور الموافقة.
            </p>

            <button 
                onClick={handleComplete}
                className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 active:scale-95 transition-transform"
            >
                العودة للرئيسية
            </button>
        </div>
      );
  }

  // --- MAIN FORM VIEW ---
  return (
    <div className="absolute inset-0 z-[250] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Compact Header */}
      <div className="px-6 pt-10 pb-3 bg-white z-10 border-b border-gray-50">
          <div className="flex justify-between items-center mb-2">
              <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors">
                  <X size={24} />
              </button>
              <h2 className="text-lg font-black text-gray-900">تسجيل متجر جديد</h2>
              <div className="w-8"></div>
          </div>
          
          {/* Slim Progress Bar */}
          <div className="h-1 w-full bg-gray-100 rounded-full overflow-hidden flex dir-rtl">
              <div className={`h-full bg-[#6463C7] transition-all duration-500 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
          </div>
          <div className="flex justify-between text-[10px] font-bold text-gray-400 mt-1">
              <span className={step >= 1 ? 'text-[#6463C7]' : ''}>1. بيانات المتجر</span>
              <span className={step >= 2 ? 'text-[#6463C7]' : ''}>2. التراخيص والمرفقات</span>
          </div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-4">
          
          {/* STEP 1: Basic Info (Compact Grid Layout) */}
          {step === 1 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  
                  {/* Top Section: Logo + Store Name */}
                  <div className="flex gap-4">
                      {/* Logo Upload Box (Left Side) */}
                      <div 
                          onClick={handleLogoUpload}
                          className={`w-28 h-28 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center cursor-pointer transition-all shrink-0 relative overflow-hidden group ${
                              formData.storeImage 
                              ? 'border-[#6463C7] bg-white' 
                              : 'border-gray-200 bg-gray-50 hover:border-[#6463C7]'
                          }`}
                      >
                          {formData.storeImage ? (
                              <>
                                <img src={formData.storeImage} alt="Logo" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Camera size={20} className="text-white" />
                                </div>
                              </>
                          ) : (
                              <>
                                <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#6463C7] shadow-sm mb-1">
                                    <ImageIcon size={16} />
                                </div>
                                <span className="text-[9px] font-bold text-gray-500 text-center px-1">شعار المتجر</span>
                              </>
                          )}
                      </div>

                      {/* Store Name Input (Right Side - Fills remaining space) */}
                      <div className="flex-1 flex flex-col justify-center gap-1">
                          <label className="text-xs font-bold text-gray-700">اسم المتجر</label>
                          <div className="relative h-full">
                              <input 
                                  type="text" 
                                  value={formData.storeName}
                                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                                  placeholder="مثال: متجر الأناقة"
                                  className="w-full h-[50px] bg-gray-50 border border-gray-100 rounded-xl px-4 text-right font-bold text-gray-900 focus:border-[#6463C7] focus:ring-1 focus:ring-[#6463C7] outline-none transition-all placeholder:text-gray-400 text-sm"
                              />
                          </div>
                          <p className="text-[9px] text-gray-400 pt-1">سيظهر هذا الاسم للعملاء في التطبيق</p>
                      </div>
                  </div>

                  <div className="h-px bg-gray-100"></div>

                  {/* Activity Grid (2 Cols) */}
                  <div className="grid grid-cols-2 gap-3">
                      <CustomSelect
                          label="النشاط التجاري"
                          placeholder="اختر النشاط"
                          value={formData.activity}
                          options={ACTIVITY_OPTIONS}
                          icon={Briefcase}
                          onChange={(value) => setFormData({
                              ...formData,
                              activity: value,
                              subActivity: ''
                          })}
                      />

                      <CustomSelect
                          label="النشاط الفرعي"
                          placeholder="اختر الفرعي"
                          value={formData.subActivity}
                          options={formData.activity ? ACTIVITY_SUB_CATEGORIES[formData.activity].map(s => ({ value: s, label: s })) : []}
                          icon={Layers}
                          disabled={!formData.activity}
                          onChange={(value) => setFormData({...formData, subActivity: value})}
                      />
                  </div>
                  
                  {/* Visual Hint */}
                  <div className="bg-purple-50 rounded-xl p-3 flex items-start gap-2 border border-purple-100 mt-2">
                      <Store size={16} className="text-[#6463C7] shrink-0 mt-0.5" />
                      <div>
                          <h4 className="text-[10px] font-bold text-[#6463C7] mb-0.5">معلومة مهمة</h4>
                          <p className="text-[9px] text-gray-600 leading-relaxed">
                              تأكد من اختيار النشاط الصحيح ليظهر متجرك للعملاء المهتمين بنفس المجال، مما يزيد من مبيعاتك.
                          </p>
                      </div>
                  </div>

              </div>
          )}

          {/* STEP 2: Legal Info & Docs (Compact Layout) */}
          {step === 2 && (
              <div className="space-y-4 animate-in slide-in-from-right duration-300">
                  
                  {/* Entity Type Selector (Compact Row) */}
                  <div>
                      <label className="text-xs font-bold text-gray-700 mb-2 block">نوع الكيان</label>
                      <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100">
                          {[
                              { id: 'individual', label: 'فردي / حر' },
                              { id: 'establishment', label: 'مؤسسة' },
                              { id: 'company', label: 'شركة' },
                          ].map((type) => (
                              <button
                                  key={type.id}
                                  onClick={() => setFormData({...formData, entityType: type.id as EntityType})}
                                  className={`flex-1 py-2 text-[10px] font-bold rounded-lg transition-all ${
                                      formData.entityType === type.id 
                                      ? 'bg-white text-[#6463C7] shadow-sm border border-gray-100' 
                                      : 'text-gray-400 hover:text-gray-600'
                                  }`}
                              >
                                  {type.label}
                              </button>
                          ))}
                      </div>
                  </div>

                  {/* Numbers Grid (2 Cols) */}
                  <div className="grid grid-cols-2 gap-3">
                      <div>
                          <label className="text-[10px] font-bold text-gray-700 block mb-1">رقم توثيق المنصة</label>
                          <input 
                              type="text" 
                              value={formData.businessPlatformNumber}
                              onChange={(e) => setFormData({...formData, businessPlatformNumber: e.target.value})}
                              placeholder="00000000"
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-xs dir-ltr"
                          />
                      </div>
                      <div>
                          <label className="text-[10px] font-bold text-gray-700 block mb-1">
                              {formData.entityType === 'individual' ? 'رقم وثيقة العمل الحر' : 'رقم السجل التجاري'}
                          </label>
                          <input 
                              type="text" 
                              value={formData.entityType === 'individual' ? formData.freelanceDocNumber : formData.crNumber}
                              onChange={(e) => {
                                  if (formData.entityType === 'individual') setFormData({...formData, freelanceDocNumber: e.target.value});
                                  else setFormData({...formData, crNumber: e.target.value});
                              }}
                              placeholder={formData.entityType === 'individual' ? 'FL-0000' : '1010xxxx'}
                              className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 py-3 text-right font-bold text-gray-900 focus:border-[#6463C7] outline-none text-xs dir-ltr"
                          />
                      </div>
                  </div>

                  {/* Uploads (Slim List) */}
                  <div className="pt-2">
                      <label className="text-xs font-bold text-gray-700 mb-2 block">المرفقات المطلوبة</label>
                      <div className="space-y-2">
                          <SlimFileUpload 
                              label="صورة الهوية الوطنية" 
                              selectedFile={formData.nationalIdFile} 
                              onFileSelect={(file) => handleFileSelect(file, 'nationalIdFile')} 
                          />
                          <SlimFileUpload 
                              label={formData.entityType === 'individual' ? "صورة وثيقة العمل الحر" : "صورة السجل التجاري"} 
                              selectedFile={formData.entityType === 'individual' ? formData.freelanceDocFile : formData.crDocFile} 
                              onFileSelect={(file) => handleFileSelect(file, formData.entityType === 'individual' ? 'freelanceDocFile' : 'crDocFile')} 
                          />
                      </div>
                  </div>

              </div>
          )}

      </div>

      {/* Footer Actions */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <div className="flex gap-3">
              {step === 2 && (
                  <button 
                      onClick={handleBack}
                      className="w-14 bg-gray-50 text-gray-600 rounded-2xl flex items-center justify-center border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                      <ArrowLeft size={20} />
                  </button>
              )}
              
              <button 
                  onClick={step === 1 ? handleNext : handleSubmit}
                  disabled={isSubmitting}
                  className={`flex-1 bg-[#6463C7] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 ${isSubmitting ? 'opacity-80' : ''}`}
              >
                  {isSubmitting ? (
                      <Loader2 size={20} className="animate-spin" />
                  ) : (
                      <>
                          <span>{step === 1 ? 'التالي' : 'إرسال الطلب'}</span>
                          {step === 1 ? <ChevronRight size={18} className="rotate-180" /> : <Check size={18} />}
                      </>
                  )}
              </button>
          </div>
      </div>

    </div>
  );
};

// Reusable Custom Select Component (Updated for Compactness)
interface CustomSelectProps {
    label: string;
    value: string;
    options: { value: string; label: string }[];
    onChange: (value: string) => void;
    placeholder: string;
    icon: React.ElementType;
    disabled?: boolean;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ label, value, options, onChange, placeholder, icon: Icon, disabled }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const selectedLabel = options.find(opt => opt.value === value)?.label;

    return (
        <div className="space-y-1 relative" ref={dropdownRef}>
            <label className="text-[10px] font-bold text-gray-700 block">{label}</label>
            <button
                type="button"
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`w-full rounded-xl py-3 px-3 flex items-center justify-between text-right border transition-all ${
                    disabled 
                    ? 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60' 
                    : isOpen 
                        ? 'bg-white border-[#6463C7] ring-1 ring-[#6463C7]' 
                        : 'bg-gray-50 border-gray-100 hover:border-gray-200'
                }`}
            >
                <div className="flex items-center gap-2 min-w-0">
                    <span className={`text-xs font-bold truncate ${value ? 'text-gray-900' : 'text-gray-400 font-normal'}`}>
                        {selectedLabel || placeholder}
                    </span>
                </div>
                <ChevronDown size={16} className={`text-gray-400 transition-transform flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && !disabled && (
                <div className="absolute top-[105%] left-0 right-0 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 max-h-48 overflow-y-auto no-scrollbar">
                    {options.length > 0 ? (
                        <div className="py-1">
                            {options.map((opt) => {
                                const isSelected = opt.value === value;
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        onClick={() => {
                                            onChange(opt.value);
                                            setIsOpen(false);
                                        }}
                                        className={`w-full text-right px-3 py-2.5 flex items-center justify-between transition-colors hover:bg-gray-50 group ${
                                            isSelected ? 'bg-purple-50/50' : ''
                                        }`}
                                    >
                                        <span className={`text-xs ${isSelected ? 'font-bold text-gray-900' : 'font-medium text-gray-600'}`}>
                                            {opt.label}
                                        </span>
                                        {isSelected && <Check size={14} className="text-[#6463C7]" strokeWidth={3} />}
                                    </button>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="p-3 text-center text-gray-400 text-[10px]">لا توجد خيارات</div>
                    )}
                </div>
            )}
        </div>
    );
};

// Slim File Upload Component (Updated to handle real file selection)
interface SlimFileUploadProps {
    label: string;
    selectedFile: File | null;
    onFileSelect: (file: File) => void;
}

const SlimFileUpload: React.FC<SlimFileUploadProps> = ({ label, selectedFile, onFileSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleContainerClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            onFileSelect(files[0]);
        }
    };

    return (
        <div 
            onClick={handleContainerClick}
            className={`border rounded-xl p-3 flex items-center justify-between transition-all cursor-pointer group ${
                selectedFile 
                ? 'bg-green-50 border-green-200' 
                : 'bg-white border-gray-200 hover:border-[#6463C7]'
            }`}
        >
            <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept="image/*,.pdf"
            />
            
            <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${selectedFile ? 'bg-white text-green-600 shadow-sm' : 'bg-gray-100 text-gray-400'}`}>
                    {selectedFile ? <FileCheck size={16} /> : <Upload size={16} />}
                </div>
                <span className={`text-xs font-bold ${selectedFile ? 'text-green-800' : 'text-gray-700'}`}>{label}</span>
            </div>
            
            {selectedFile ? (
                <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg shadow-sm border border-green-100 max-w-[120px]">
                    <span className="text-[10px] text-green-700 font-bold truncate dir-ltr block max-w-[80px]">{selectedFile.name}</span>
                    <Check size={12} className="text-green-600 shrink-0" strokeWidth={3} />
                </div>
            ) : (
                <span className="text-[9px] text-gray-400 bg-gray-50 px-2 py-1 rounded-md">إرفاق ملف</span>
            )}
        </div>
    );
};
