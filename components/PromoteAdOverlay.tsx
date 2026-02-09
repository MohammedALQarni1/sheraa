
import React, { useState } from 'react';
import { X, Crown, Sparkles, Check, Zap, ArrowRight, ShieldCheck, Rocket, LayoutGrid, BellRing, CreditCard, ChevronRight, Lock, Gift } from 'lucide-react';
import { AdItem } from '../types';

interface PromoteAdOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  ad: AdItem;
  onPromoteSuccess?: (plan: string) => void;
  vipAdsBalance?: number;
  featuredAdsBalance?: number;
  onConsumeBalance?: (type: 'vip' | 'featured') => void;
}

type PlanType = 'featured' | 'vip';
type ViewState = 'plans' | 'payment' | 'success';

export const PromoteAdOverlay: React.FC<PromoteAdOverlayProps> = ({ 
    isOpen, 
    onClose, 
    ad, 
    onPromoteSuccess,
    vipAdsBalance = 0,
    featuredAdsBalance = 0,
    onConsumeBalance
}) => {
  const [currentView, setCurrentView] = useState<ViewState>('plans');
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('vip');
  const [duration, setDuration] = useState(3); // Days
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'apple_pay' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);
  const [usedBalance, setUsedBalance] = useState(false);

  if (!isOpen) return null;

  // Pricing Logic (Currency based now)
  const calculatePrice = () => {
      // VIP: 25 SAR/day, Featured: 10 SAR/day
      const basePrice = selectedPlan === 'vip' ? 25 : 10; 
      return basePrice * duration;
  };

  const totalPrice = calculatePrice();

  const handleContinueToPayment = () => {
      // Logic: Check if user has balance for the selected plan
      const hasBalance = (selectedPlan === 'vip' && vipAdsBalance > 0) || (selectedPlan === 'featured' && featuredAdsBalance > 0);

      if (hasBalance) {
          setIsProcessing(true);
          setTimeout(() => {
              setIsProcessing(false);
              setUsedBalance(true);
              if (onConsumeBalance) onConsumeBalance(selectedPlan); // Deduct balance
              setCurrentView('success');
              if (onPromoteSuccess) {
                  onPromoteSuccess(selectedPlan);
              }
          }, 1000);
      } else {
          setCurrentView('payment');
      }
  };

  const handleFinalPayment = () => {
      setIsProcessing(true);
      // Simulate API call / Payment Gateway processing
      setTimeout(() => {
          setIsProcessing(false);
          setUsedBalance(false);
          setCurrentView('success');
          // Trigger Notification
          if (onPromoteSuccess) {
              onPromoteSuccess(selectedPlan);
          }
      }, 1500);
  };

  // --- SUCCESS VIEW ---
  if (currentView === 'success') {
      return (
        <div className="absolute inset-0 z-[300] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative">
                <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
                <Check size={48} className="text-green-500" strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">تمت الترقية بنجاح! 🎉</h2>
            <p className="text-gray-500 text-center text-sm mb-8 max-w-xs leading-relaxed">
                {usedBalance ? (
                    <span>تم استخدام رصيد <span className="font-bold text-[#6463C7]">باقتك المميزة</span>. </span>
                ) : (
                    <span>تم دفع مبلغ <span className="font-bold text-gray-800 dir-ltr">{totalPrice} ر.س</span> بنجاح. </span>
                )}
                سيظهر إعلانك الآن كـ <span className={`font-bold ${selectedPlan === 'vip' ? 'text-purple-600' : 'text-amber-500'}`}>{selectedPlan === 'vip' ? 'VIP' : 'مميز'}</span> لمدة {duration} أيام.
            </p>

            <button 
                onClick={onClose}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
                العودة للإعلانات
            </button>
        </div>
      );
  }

  // --- PAYMENT METHOD VIEW ---
  if (currentView === 'payment') {
      return (
        <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
                <button onClick={() => setCurrentView('plans')} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                    <ChevronRight size={24} />
                </button>
                <h2 className="text-lg font-black text-gray-900">إتمام الدفع</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar px-6 py-6">
                
                {/* Order Summary */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
                    <h3 className="text-sm font-bold text-gray-900 mb-4">ملخص الطلب</h3>
                    
                    <div className="flex items-center gap-3 mb-4 pb-4 border-b border-gray-50">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${selectedPlan === 'vip' ? 'bg-purple-100 text-purple-600' : 'bg-amber-100 text-amber-600'}`}>
                            {selectedPlan === 'vip' ? <Sparkles size={24} /> : <Crown size={24} />}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">
                                {selectedPlan === 'vip' ? 'ترقية VIP' : 'ترقية مميزة'}
                            </h4>
                            <p className="text-[10px] text-gray-500">المدة: {duration} أيام</p>
                        </div>
                        <div className="font-black text-gray-900 text-lg dir-ltr">
                            {totalPrice} <span className="text-xs font-medium text-gray-400">ر.س</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center text-xs text-gray-500 font-medium">
                        <span>الإجمالي شامل الضريبة</span>
                        <span className="font-bold text-gray-900">{totalPrice} ر.س</span>
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
                    onClick={handleFinalPayment}
                    disabled={isProcessing}
                    className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
                        selectedPlan === 'vip' 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200' 
                        : 'bg-amber-400 text-gray-900 shadow-amber-200'
                    }`}
                >
                    {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        <>
                            <span>دفع {totalPrice} ر.س</span>
                            <Lock size={16} className="opacity-80" />
                        </>
                    )}
                </button>
            </div>
        </div>
      );
  }

  // --- PLANS SELECTION VIEW (Initial) ---
  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
              <X size={24} />
          </button>
          <h2 className="text-lg font-black text-gray-900">ترقية الإعلان</h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32 px-4 pt-4">
          
          {/* Ad Summary */}
          <div className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-3 mb-6">
              <div className="w-14 h-14 bg-gray-100 rounded-xl overflow-hidden shrink-0">
                  <img src={ad.image} alt={ad.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-gray-900 text-xs line-clamp-1 mb-1">{ad.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-gray-400">
                      <span className="bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100">الحالية: عادي</span>
                      <ArrowRight size={10} />
                      <span className={`font-bold ${selectedPlan === 'vip' ? 'text-purple-600' : 'text-amber-500'}`}>
                          إلى: {selectedPlan === 'vip' ? 'VIP' : 'مميز'}
                      </span>
                  </div>
              </div>
          </div>

          <h3 className="text-sm font-bold text-gray-900 mb-3 px-1">اختر نوع الترقية</h3>

          {/* PLAN 1: VIP (Top) */}
          <div 
            onClick={() => setSelectedPlan('vip')}
            className={`relative rounded-3xl p-5 mb-4 border-2 cursor-pointer transition-all duration-300 overflow-hidden group ${
                selectedPlan === 'vip' 
                ? 'bg-purple-50 border-purple-500 shadow-lg shadow-purple-100' 
                : 'bg-white border-gray-100 hover:border-purple-200'
            }`}
          >
              {/* Animated Background for VIP */}
              {selectedPlan === 'vip' && (
                  <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6d28d9_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none"></div>
              )}

              <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === 'vip' ? 'bg-gradient-to-br from-purple-500 to-indigo-600 text-white shadow-md' : 'bg-gray-100 text-gray-400'}`}>
                          <Sparkles size={20} fill={selectedPlan === 'vip' ? "currentColor" : "none"} />
                      </div>
                      <div>
                          <h4 className="font-black text-gray-900 text-sm flex items-center gap-1">
                              إعلان VIP
                              <span className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white text-[8px] px-1.5 py-0.5 rounded font-bold">الأقوى</span>
                          </h4>
                          <p className="text-[10px] text-gray-500 font-medium">وصول شامل لكل التطبيق</p>
                      </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'vip' ? 'bg-purple-600 border-purple-600 text-white' : 'border-gray-200'}`}>
                      {selectedPlan === 'vip' && <Check size={14} strokeWidth={3} />}
                  </div>
              </div>

              {/* Balance Badge */}
              {vipAdsBalance > 0 && (
                  <div className="absolute top-2 left-2 bg-[#6463C7]/10 text-[#6463C7] text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Gift size={10} />
                      <span>متوفر في رصيدك: {vipAdsBalance}</span>
                  </div>
              )}

              {/* Features List */}
              <div className="space-y-2 relative z-10">
                  <FeatureItem icon={<Rocket size={14} />} text="يظهر في الصفحة الرئيسية للجميع" active={selectedPlan === 'vip'} color="text-purple-600" />
                  <FeatureItem icon={<BellRing size={14} />} text="إشعار للمهتمين في مدينتك" active={selectedPlan === 'vip'} color="text-purple-600" />
                  <FeatureItem icon={<Zap size={14} />} text="x10 مشاهدات أكثر" active={selectedPlan === 'vip'} color="text-purple-600" />
              </div>
          </div>

          {/* PLAN 2: FEATURED (Bottom) */}
          <div 
            onClick={() => setSelectedPlan('featured')}
            className={`relative rounded-3xl p-5 mb-6 border-2 cursor-pointer transition-all duration-300 overflow-hidden ${
                selectedPlan === 'featured' 
                ? 'bg-amber-50 border-amber-400 shadow-lg shadow-amber-100' 
                : 'bg-white border-gray-100 hover:border-amber-200'
            }`}
          >
              <div className="flex justify-between items-start mb-3 relative z-10">
                  <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${selectedPlan === 'featured' ? 'bg-amber-400 text-white' : 'bg-gray-100 text-gray-400'}`}>
                          <Crown size={20} fill={selectedPlan === 'featured' ? "currentColor" : "none"} />
                      </div>
                      <div>
                          <h4 className="font-black text-gray-900 text-sm">إعلان مميز</h4>
                          <p className="text-[10px] text-gray-500 font-medium">ظهور ملفت في القسم</p>
                      </div>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedPlan === 'featured' ? 'bg-amber-400 border-amber-400 text-white' : 'border-gray-200'}`}>
                      {selectedPlan === 'featured' && <Check size={14} strokeWidth={3} />}
                  </div>
              </div>

              {/* Balance Badge */}
              {featuredAdsBalance > 0 && (
                  <div className="absolute top-2 left-2 bg-amber-100 text-amber-700 text-[9px] font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      <Gift size={10} />
                      <span>متوفر في رصيدك: {featuredAdsBalance}</span>
                  </div>
              )}

              {/* Features List */}
              <div className="space-y-2 relative z-10">
                  <FeatureItem icon={<LayoutGrid size={14} />} text="يظهر في أعلى قائمة القسم" active={selectedPlan === 'featured'} color="text-amber-600" />
                  <FeatureItem icon={<ShieldCheck size={14} />} text="إطار أصفر مميز للجذب" active={selectedPlan === 'featured'} color="text-amber-600" />
              </div>
          </div>

          {/* Duration Selector */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mb-4">
              <h3 className="text-xs font-bold text-gray-900 mb-3">مدة الترقية</h3>
              <div className="flex gap-2">
                  {[1, 3, 7, 30].map(d => (
                      <button 
                        key={d}
                        onClick={() => setDuration(d)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all border ${
                            duration === d 
                            ? 'bg-gray-900 text-white border-gray-900 shadow-md' 
                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                          {d} يوم
                      </button>
                  ))}
              </div>
          </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          {(selectedPlan === 'vip' && vipAdsBalance > 0) || (selectedPlan === 'featured' && featuredAdsBalance > 0) ? (
              <button 
                onClick={handleContinueToPayment}
                disabled={isProcessing}
                className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all active:scale-[0.98] bg-[#6463C7] text-white shadow-purple-200`}
              >
                  {isProcessing ? (
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  ) : (
                      <>
                          <Gift size={18} />
                          <span>استخدام من الرصيد (مجاناً)</span>
                      </>
                  )}
              </button>
          ) : (
              <>
                <div className="flex justify-between items-center mb-3 text-xs px-1">
                    <span className="text-gray-500 font-medium">الإجمالي المطلوب</span>
                    <span className="font-black text-gray-900 dir-ltr text-base">{totalPrice} ر.س</span>
                </div>
                <button 
                    onClick={handleContinueToPayment}
                    className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
                        selectedPlan === 'vip' 
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-purple-200' 
                        : 'bg-amber-400 text-gray-900 shadow-amber-200'
                    }`}
                >
                    <CreditCard size={18} />
                    <span>متابعة للدفع</span>
                </button>
              </>
          )}
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, text, active, color }: { icon: React.ReactNode, text: string, active: boolean, color: string }) => (
    <div className={`flex items-center gap-2 text-xs font-bold ${active ? color : 'text-gray-400'}`}>
        {icon}
        <span>{text}</span>
    </div>
);
