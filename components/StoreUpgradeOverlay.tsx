
import React, { useState } from 'react';
import { X, Check, Crown, Zap, BarChart3, CreditCard, ChevronRight, TrendingUp, Sparkles, LayoutList, Megaphone, Lock, ArrowRight, MousePointerClick, Calendar, ShieldCheck } from 'lucide-react';

interface StoreUpgradeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: 'monthly' | 'yearly') => void;
}

type ViewState = 'intro' | 'payment' | 'success';

export const StoreUpgradeOverlay: React.FC<StoreUpgradeOverlayProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [currentView, setCurrentView] = useState<ViewState>('intro');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'apple_pay' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Configuration for Store Pricing
  const PRICE = selectedPlan === 'monthly' ? 299 : 2499;
  const SAVINGS = selectedPlan === 'yearly' ? '20%' : '';

  // --- Handlers ---

  const handleProceedToPayment = () => {
      setCurrentView('payment');
  };

  const handleConfirmPayment = () => {
      setIsProcessing(true);
      // Simulate Payment Processing
      setTimeout(() => {
          setIsProcessing(false);
          setCurrentView('success');
      }, 2000);
  };

  const handleFinalize = () => {
      if (onSubscribe) {
          onSubscribe(selectedPlan);
      }
      onClose();
  };

  // --- VIEWS ---

  // 3. SUCCESS VIEW
  if (currentView === 'success') {
      return (
        <div className="absolute inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 font-sans">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_70%)]"></div>
            </div>

            <div className="w-28 h-28 bg-gradient-to-tr from-amber-400 to-yellow-300 rounded-full flex items-center justify-center mb-6 shadow-xl shadow-amber-100 relative animate-in zoom-in duration-500">
                <Crown size={56} className="text-white fill-white" />
                <div className="absolute -bottom-2 -right-2 bg-green-500 p-2 rounded-full border-4 border-white shadow-sm">
                    <Check size={24} className="text-white" strokeWidth={4} />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">تم ترقية المتجر بنجاح! 🎉</h2>
            <p className="text-gray-500 text-center text-sm mb-10 max-w-xs leading-relaxed font-medium">
                أصبح متجرك الآن <span className="text-amber-500 font-black">متجر مميز (Premium)</span>. يمكنك الآن إطلاق الحملات الإعلانية ومضاعفة مبيعاتك.
            </p>

            {/* Features Unlocked Summary */}
            <div className="w-full bg-gray-50 border border-gray-100 rounded-3xl p-6 mb-8">
                <h3 className="text-xs font-bold text-gray-400 mb-4 text-center uppercase tracking-wider">المميزات المفعلة</h3>
                <div className="space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-gray-800">الظهور بين كل 6 إعلانات</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-gray-800">لوحة تحكم الحملات الإعلانية</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check size={12} strokeWidth={3} /></div>
                        <span className="text-sm font-bold text-gray-800">رفع العروض وتثبيتها</span>
                    </div>
                </div>
            </div>

            <button 
                onClick={handleFinalize}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all"
            >
                العودة للوحة التحكم
            </button>
        </div>
      );
  }

  // 2. PAYMENT VIEW
  if (currentView === 'payment') {
      return (
        <div className="absolute inset-0 z-[300] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <button onClick={() => setCurrentView('intro')} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                    <ChevronRight size={24} />
                </button>
                <h2 className="text-lg font-black text-gray-900">إتمام الدفع</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
                
                {/* Order Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">ملخص الاشتراك</h3>
                    
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-yellow-100 flex items-center justify-center shrink-0 border border-amber-200">
                            <Crown size={24} className="text-amber-600 fill-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">ترقية متجر مميز</h4>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                                {selectedPlan === 'yearly' ? 'اشتراك سنوي (توفير 30%)' : 'اشتراك شهري مرن'}
                            </p>
                        </div>
                        <div className="font-black text-gray-900 text-lg dir-ltr">
                            {PRICE} <span className="text-xs font-medium text-gray-400">ر.س</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-blue-50 p-3 rounded-xl border border-blue-100">
                        <div className="flex items-center gap-2">
                            <Zap size={16} className="text-blue-600" />
                            <span className="text-xs font-bold text-blue-700">التفعيل فوري</span>
                        </div>
                        <span className="text-[10px] font-bold text-blue-600">يبدأ من اليوم</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <h3 className="text-sm font-bold text-gray-900 mb-4 px-1">اختر طريقة الدفع</h3>
                <div className="space-y-3">
                    {/* Apple Pay */}
                    <div 
                        onClick={() => setSelectedPaymentMethod('apple_pay')}
                        className={`w-full border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            selectedPaymentMethod === 'apple_pay' 
                            ? 'bg-black text-white border-black shadow-lg transform scale-[1.02]' 
                            : 'bg-white border-gray-100 hover:border-gray-300 text-gray-900'
                        }`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'apple_pay' ? 'bg-white/20' : 'bg-black text-white'}`}>
                                <span className="font-bold text-[10px] tracking-tight">Pay</span>
                            </div>
                            <div>
                                <span className="font-bold block text-sm">Apple Pay</span>
                            </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${
                            selectedPaymentMethod === 'apple_pay' ? 'border-white bg-white text-black' : 'border-gray-200'
                        }`}>
                            {selectedPaymentMethod === 'apple_pay' && <Check size={12} strokeWidth={4} />}
                        </div>
                    </div>

                    {/* Credit Card */}
                    <div 
                        onClick={() => setSelectedPaymentMethod('card')}
                        className={`w-full border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${
                            selectedPaymentMethod === 'card' 
                            ? 'bg-[#6463C7] text-white border-[#6463C7] shadow-lg shadow-purple-200 transform scale-[1.02]' 
                            : 'bg-white border-gray-100 hover:border-gray-300 text-gray-900'
                        }`}
                    >
                        <div className="flex items-center gap-4 relative z-10">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'card' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                                <CreditCard size={18} />
                            </div>
                            <div>
                                <span className="font-bold block text-sm">بطاقة بنكية</span>
                            </div>
                        </div>
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center relative z-10 ${
                            selectedPaymentMethod === 'card' ? 'border-white bg-white text-[#6463C7]' : 'border-gray-200'
                        }`}>
                            {selectedPaymentMethod === 'card' && <Check size={12} strokeWidth={4} />}
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-medium mt-8 bg-gray-100/50 p-2 rounded-lg">
                    <Lock size={12} />
                    <span>جميع العمليات مشفرة ومحمية</span>
                </div>

            </div>

            {/* Footer Pay Button */}
            <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={handleConfirmPayment}
                    disabled={isProcessing}
                    className="w-full bg-gray-900 text-white font-bold py-3.5 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>دفع {PRICE} ر.س</span>
                            <Lock size={16} className="opacity-80" />
                        </>
                    )}
                </button>
            </div>
        </div>
      );
  }

  // 1. INTRO VIEW (RE-DESIGNED to fit one screen)
  return (
    <div className="absolute inset-0 z-[250] bg-white flex flex-col animate-in slide-in-from-bottom duration-300 font-sans h-full overflow-hidden">
      
      {/* Header */}
      <div className="px-6 pt-12 pb-2 flex justify-between items-center z-10">
          <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
              <X size={24} />
          </button>
          <h2 className="text-lg font-black text-gray-900">ترقية المتجر</h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 flex flex-col justify-between px-4 pb-6 pt-2">
          
          {/* 1. Compact Hero Card */}
          <div className="w-full h-40 rounded-[2rem] relative overflow-hidden shadow-lg shadow-gray-200 group shrink-0 mb-4">
              {/* Premium Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#1e1e2e] via-[#2a2a40] to-black"></div>
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
              
              {/* Glow Effects */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/20 rounded-full blur-[50px]"></div>
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/20 rounded-full blur-[40px]"></div>

              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                  <div className="flex justify-end">
                      <div className="bg-[#fbbf24] text-black border border-amber-300 rounded-lg px-2.5 py-1 flex items-center gap-1.5 shadow-lg shadow-amber-400/20">
                          <span className="text-[9px] font-black tracking-wider">PREMIUM STORE</span>
                          <Crown size={12} fill="currentColor" />
                      </div>
                  </div>

                  <div className="text-center">
                      <h3 className="text-xl font-black mb-1 drop-shadow-md leading-tight">انطلق بتجارتك <br/>إلى القمة 🚀</h3>
                      <p className="text-gray-400 text-[10px] font-medium">مزايا حصرية لزيادة الظهور والمبيعات</p>
                  </div>
                  <div className="h-4"></div> 
              </div>
          </div>

          {/* 2. Features Grid (2x2) - Compact */}
          <div className="grid grid-cols-2 gap-3 mb-auto">
              <CompactFeature 
                  icon={<Megaphone size={18} />} 
                  title="حملات إعلانية" 
                  desc="أطلق حملات مخصصة واستهدف عملائك."
                  color="text-amber-500"
                  bg="bg-amber-50"
              />
              <CompactFeature 
                  icon={<LayoutList size={18} />} 
                  title="الظهور المتكرر" 
                  desc="تظهر عروضك بين كل 6 إعلانات."
                  color="text-purple-500"
                  bg="bg-purple-50"
              />
              <CompactFeature 
                  icon={<TrendingUp size={18} />} 
                  title="رفع العروض" 
                  desc="رفع عروضك لتظهر في أعلى النتائج."
                  color="text-blue-500"
                  bg="bg-blue-50"
              />
              <CompactFeature 
                  icon={<MousePointerClick size={18} />} 
                  title="مضاعفة المشاهدات" 
                  desc="زيادة مضمونة في عدد النقرات."
                  color="text-green-500"
                  bg="bg-green-50"
              />
          </div>

          {/* 3. Pricing & Action - Fixed at Bottom */}
          <div className="bg-gray-50 rounded-[1.5rem] p-4 border border-gray-100">
              
              {/* Toggle */}
              <div className="flex bg-white p-1 rounded-xl shadow-sm border border-gray-100 mb-4">
                  <button 
                      onClick={() => setSelectedPlan('monthly')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors ${selectedPlan === 'monthly' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500'}`}
                  >
                      شهري
                  </button>
                  <button 
                      onClick={() => setSelectedPlan('yearly')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold transition-colors flex items-center justify-center gap-1 ${selectedPlan === 'yearly' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-500'}`}
                  >
                      <span>سنوي</span>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded ${selectedPlan === 'yearly' ? 'bg-amber-400 text-black' : 'bg-green-100 text-green-700'}`}>
                          توفير 20%
                      </span>
                  </button>
              </div>

              {/* Action Button with Price */}
              <button 
                  onClick={handleProceedToPayment}
                  className="w-full bg-[#1e1e2e] text-white py-4 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-between px-6 group"
              >
                  <span className="text-sm font-bold flex items-center gap-2">
                      ترقية المتجر الآن
                      <ArrowRight size={16} className="group-hover:-translate-x-1 transition-transform" />
                  </span>
                  <div className="flex items-end gap-1">
                      <span className="text-2xl font-black tracking-tight">{PRICE}</span>
                      <span className="text-[10px] font-bold opacity-70 mb-1">ر.س</span>
                  </div>
              </button>
              <p className="text-center text-[9px] text-gray-400 mt-2 font-medium">يتم التجديد تلقائياً • يمكنك الإلغاء في أي وقت</p>
          </div>

      </div>
    </div>
  );
};

const CompactFeature = ({ icon, title, desc, color, bg }: { icon: React.ReactNode, title: string, desc: string, color: string, bg: string }) => (
    <div className="flex flex-col items-start p-3 bg-white rounded-2xl border border-gray-100 shadow-sm h-full">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mb-2 ${bg} ${color}`}>
            {icon}
        </div>
        <h4 className="font-bold text-gray-900 text-xs mb-1">{title}</h4>
        <p className="text-[9px] text-gray-500 leading-relaxed font-medium line-clamp-2">{desc}</p>
    </div>
);
