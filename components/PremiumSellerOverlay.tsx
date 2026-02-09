
import React, { useState } from 'react';
import { X, Check, Crown, ShieldCheck, Zap, BarChart3, Star, CreditCard, ChevronRight, TrendingUp, Sparkles, BadgeCheck, Gift, Lock, ArrowRight } from 'lucide-react';

interface PremiumSellerOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onSubscribe?: (plan: 'monthly' | 'yearly', points: number, vipCount: number, featuredCount: number) => void;
}

type ViewState = 'intro' | 'payment' | 'success';

export const PremiumSellerOverlay: React.FC<PremiumSellerOverlayProps> = ({ isOpen, onClose, onSubscribe }) => {
  const [currentView, setCurrentView] = useState<ViewState>('intro');
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'apple_pay' | 'card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  // Configuration
  const EARNED_POINTS = selectedPlan === 'monthly' ? 150 : 2000;
  const PRICE = selectedPlan === 'monthly' ? 99 : 999;
  
  // Dynamic Ad Counts based on Plan
  const VIP_ADS_COUNT = selectedPlan === 'monthly' ? 2 : 30;
  const FEATURED_ADS_COUNT = selectedPlan === 'monthly' ? 5 : 60;

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
      // Trigger the actual upgrade in the app state
      if (onSubscribe) {
          onSubscribe(selectedPlan, EARNED_POINTS, VIP_ADS_COUNT, FEATURED_ADS_COUNT);
      }
      onClose();
  };

  // --- VIEWS ---

  // 3. SUCCESS VIEW
  if (currentView === 'success') {
      return (
        <div className="absolute inset-0 z-[250] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300 font-sans">
            
            {/* Background Decoration */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(100,99,199,0.05),transparent_70%)]"></div>
            </div>

            <div className="w-24 h-24 bg-gradient-to-tr from-[#6463C7] to-[#8382d6] rounded-full flex items-center justify-center mb-6 shadow-xl shadow-purple-200 relative animate-in zoom-in duration-500">
                <Crown size={48} className="text-white fill-white" />
                <div className="absolute -bottom-2 -right-2 bg-yellow-400 p-2 rounded-full border-4 border-white shadow-sm">
                    <Check size={20} className="text-white" strokeWidth={4} />
                </div>
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2 text-center">مبروك الترقية! 🎉</h2>
            <p className="text-gray-500 text-center text-sm mb-10 max-w-xs leading-relaxed">
                أنت الآن <span className="text-[#6463C7] font-bold">بائع مميز</span>. استمتع بمميزات حصرية وضاعف مبيعاتك.
            </p>

            {/* Points Reward Card */}
            <div className="w-full bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-100 rounded-3xl p-6 mb-8 relative overflow-hidden transform hover:scale-105 transition-transform">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-300 to-orange-400"></div>
                <div className="flex flex-col items-center text-center relative z-10">
                    <span className="text-amber-600/80 text-[10px] font-bold uppercase tracking-wider mb-2">مكافأة فورية</span>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-5xl font-black text-gray-900 dir-ltr">{EARNED_POINTS}</span>
                    </div>
                    <span className="text-sm font-bold text-amber-600 bg-white/50 px-3 py-1 rounded-full border border-amber-200/50">نقطة ولاء</span>
                </div>
            </div>

            <button 
                onClick={handleFinalize}
                className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-purple-200 active:scale-[0.98] transition-all"
            >
                ابدأ البيع الآن
            </button>
        </div>
      );
  }

  // 2. PAYMENT VIEW
  if (currentView === 'payment') {
      return (
        <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            
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
                    <h3 className="text-sm font-bold text-gray-900 mb-4">ملخص الطلب</h3>
                    
                    <div className="flex items-center gap-4 mb-4 pb-4 border-b border-gray-50">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center shrink-0 border border-amber-200">
                            <Crown size={24} className="text-amber-600 fill-amber-600" />
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-gray-900 text-sm">باقة البائع المميز</h4>
                            <p className="text-[10px] text-gray-500 font-medium mt-0.5">
                                {selectedPlan === 'yearly' ? 'اشتراك سنوي (الأكثر توفيراً)' : 'اشتراك شهري'}
                            </p>
                        </div>
                        <div className="font-black text-gray-900 text-lg dir-ltr">
                            {PRICE} <span className="text-xs font-medium text-gray-400">ر.س</span>
                        </div>
                    </div>

                    <div className="flex justify-between items-center bg-green-50 p-3 rounded-xl border border-green-100">
                        <div className="flex items-center gap-2">
                            <Gift size={16} className="text-green-600" />
                            <span className="text-xs font-bold text-green-700">ستحصل على</span>
                        </div>
                        <span className="text-xs font-black text-green-700 dir-ltr">{EARNED_POINTS} نقطة</span>
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
                    className="w-full bg-[#6463C7] text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-purple-200 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
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

  // 1. INTRO VIEW (Existing Logic)
  return (
    <div className="absolute inset-0 z-[250] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10 sticky top-0">
          <button onClick={onClose} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
              <X size={24} />
          </button>
          <h2 className="text-lg font-black text-gray-900">باقة البائع المميز</h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          
          {/* Hero Card */}
          <div className="px-6 pt-6 pb-2">
              <div className="w-full aspect-[1.8/1] rounded-3xl relative overflow-hidden shadow-xl shadow-amber-500/20 group">
                  {/* Gold Gradient Background */}
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-300 via-amber-500 to-orange-600"></div>
                  <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                  
                  {/* Shine Effect */}
                  <div className="absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 animate-shine" />

                  <div className="absolute inset-0 p-6 flex flex-col justify-between text-white">
                      <div className="flex justify-between items-start">
                          <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-lg px-3 py-1 flex items-center gap-2">
                              <Crown size={14} className="text-white fill-white" />
                              <span className="text-xs font-bold tracking-wider">PREMIUM</span>
                          </div>
                          <SparkleIcon className="text-white/60 w-8 h-8" />
                      </div>

                      <div>
                          <h3 className="text-2xl font-black mb-1 drop-shadow-md">عضوية البائع المميز</h3>
                          <p className="text-amber-100 text-xs font-medium opacity-90">مفتاحك للثقة، والانتشار، وزيادة المبيعات</p>
                      </div>
                  </div>
              </div>
          </div>

          {/* Value Proposition */}
          <div className="px-6 mt-6 text-center">
              <h3 className="text-xl font-black text-gray-900 mb-2 leading-tight">
                  كن الخيار الأول للمشترين! 🏆
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                  احصل على شارة <span className="text-blue-600 font-bold">بائع مميز</span> فوراً، وضاعف مشاهدات إعلاناتك 10 أضعاف. الباقة التي تنقل تجارتك لمستوى احترافي.
              </p>
          </div>

          {/* Features List */}
          <div className="px-4 mt-8 space-y-3">
              
              {/* Feature 1: The Badge (Visualized) */}
              <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-blue-100 shadow-sm relative overflow-hidden">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                  <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                          <BadgeCheck size={22} fill="currentColor" className="text-blue-100" />
                      </div>
                      <div className="text-right">
                          <h4 className="font-bold text-gray-900 text-sm mb-1 flex items-center gap-1">
                              شارة بائع مميز
                              <BadgeCheck size={14} className="text-blue-500 fill-blue-50" />
                          </h4>
                          <p className="text-xs text-gray-500 leading-relaxed font-medium">تميز عن الآخرين واكسب ثقة المشتري من النظرة الأولى.</p>
                      </div>
                  </div>
              </div>

              <FeatureItem 
                  icon={<TrendingUp size={20} />} 
                  title="تصدّر نتائج البحث" 
                  desc="خوارزمياتنا تعطي الأولوية لإعلاناتك للظهور أمام آلاف المشترين النشطين يومياً."
                  color="text-indigo-500"
                  bg="bg-indigo-50"
              />
              <FeatureItem 
                  icon={<Sparkles size={20} />} 
                  title={`${VIP_ADS_COUNT} اعلانات VIP مجاناً`} 
                  desc="ثبّت إعلاناتك في الصفحة الرئيسية (بقيمة 350 ريال) مجاناً ضمن الباقة."
                  color="text-purple-500"
                  bg="bg-purple-50"
              />
              <FeatureItem 
                  icon={<Crown size={20} />} 
                  title={`${FEATURED_ADS_COUNT} اعلانات مميزة`} 
                  desc="إطار ذهبي ملفت لإعلاناتك يزيد من نسبة النقر والمشاهدة."
                  color="text-amber-500"
                  bg="bg-amber-50"
              />
          </div>

          {/* Pricing Toggle */}
          <div className="px-6 mt-10">
              <div className="bg-gray-100 p-1 rounded-2xl flex relative">
                  <button 
                      onClick={() => setSelectedPlan('monthly')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold z-10 transition-colors ${selectedPlan === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}
                  >
                      شهري
                  </button>
                  <button 
                      onClick={() => setSelectedPlan('yearly')}
                      className={`flex-1 py-3 rounded-xl text-sm font-bold z-10 transition-colors ${selectedPlan === 'yearly' ? 'text-gray-900' : 'text-gray-500'} flex flex-col items-center justify-center leading-none gap-1`}
                  >
                      <span>سنوي</span>
                      <span className="text-[9px] text-[#6463C7]">وفر 20%</span>
                  </button>
                  
                  {/* Sliding Background */}
                  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${selectedPlan === 'monthly' ? 'right-1' : 'right-[50%]'}`}></div>
              </div>
          </div>

          {/* Price & Points Display */}
          <div className="mt-8 text-center">
              <div className="flex items-end justify-center gap-1 text-gray-900">
                  <span className="text-5xl font-black tracking-tighter dir-ltr">
                      {PRICE}
                  </span>
                  <span className="text-xl font-bold text-gray-400 mb-1">ر.س</span>
              </div>
              <p className="text-gray-400 text-xs font-medium mt-2 mb-4">
                  {selectedPlan === 'monthly' ? 'استثمار ذكي يجدد شهرياً' : 'دفعة واحدة سنوياً (الأكثر توفيراً)'}
              </p>

              {/* Earned Points Badge */}
              <div className="inline-flex items-center gap-2 bg-[#6463C7]/5 border border-[#6463C7]/20 px-4 py-2 rounded-xl">
                  <Gift size={16} className="text-[#6463C7]" />
                  <span className="text-xs text-gray-700 font-bold">
                      ستحصل على <span className="text-[#6463C7] font-black">{EARNED_POINTS}</span> نقطة مكافأة
                  </span>
              </div>
          </div>

      </div>

      {/* Footer Action */}
      <div className="p-4 bg-white border-t border-gray-100 sticky bottom-0 z-10 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button 
              onClick={handleProceedToPayment}
              className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
              <span>اشترك وفعّل الشارة</span>
              <ChevronRight size={18} className="rotate-180" />
          </button>
      </div>
    </div>
  );
};

const FeatureItem = ({ icon, title, desc, color, bg }: { icon: React.ReactNode, title: string, desc: string, color: string, bg: string }) => (
    <div className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bg} ${color}`}>
            {icon}
        </div>
        <div className="text-right">
            <h4 className="font-bold text-gray-900 text-sm mb-1">{title}</h4>
            <p className="text-xs text-gray-500 leading-relaxed font-medium">{desc}</p>
        </div>
    </div>
);

const SparkleIcon = ({ className }: { className?: string }) => (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M9.81 5.82L11 2L12.19 5.82C12.56 6.95 13.45 7.84 14.58 8.21L18.4 9.4L14.58 10.59C13.45 10.96 12.56 11.85 12.19 12.98L11 16.8L9.81 12.98C9.44 11.85 8.55 10.96 7.42 10.59L3.6 9.4L7.42 8.21C8.55 7.84 9.44 6.95 9.81 5.82Z" />
        <path d="M17.5 15L18.25 12.5L19 15C19.2 15.6 19.65 16.05 20.25 16.25L22.75 17L20.25 17.75C19.65 17.95 19.2 18.4 19 19L18.25 21.5L17.5 19C17.3 18.4 16.85 17.95 16.25 17.75L13.75 17L16.25 16.25C16.85 16.05 17.3 15.6 17.5 15Z" opacity="0.6" />
    </svg>
);
