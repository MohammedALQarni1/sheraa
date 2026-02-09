
import React, { useState, useEffect } from 'react';
import { X, Check, ArrowRight, Wallet, CreditCard, ShieldCheck, AlertCircle, Coins, Handshake, ArrowDown, User, BadgeCheck, Ban, Lock, ChevronLeft, CheckCircle2, Copy, Sparkles, Star, Zap, Gift, Store, TrendingUp } from 'lucide-react';

export type PurchaseStep = 'buyer_input' | 'seller_review' | 'payment' | 'success';

interface PurchaseFlowOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  step: PurchaseStep;
  initialPrice?: number;
  buyerName?: string; 
  buyerId?: string;   
  onSendRequest?: (price: number) => void; 
  onPayCommission?: (commission: number) => void;
  onReject?: () => void; 
}

export const PurchaseFlowOverlay: React.FC<PurchaseFlowOverlayProps> = ({ 
    isOpen, 
    onClose, 
    step, 
    initialPrice = 0,
    buyerName = "مستخدم غير معروف",
    buyerId = "---",
    onSendRequest,
    onPayCommission,
    onReject
}) => {
  const [price, setPrice] = useState<string>(initialPrice > 0 ? initialPrice.toString() : '');
  const [currentStep, setCurrentStep] = useState<PurchaseStep>(step);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'apple_pay' | 'card' | null>(null);

  // Sync internal step with prop step
  useEffect(() => {
      setCurrentStep(step);
      if(initialPrice > 0) setPrice(initialPrice.toString());
  }, [step, initialPrice]);

  if (!isOpen) return null;

  const commissionRate = 0.01; // 1% commission
  const calculatedCommission = price ? (parseFloat(price) * commissionRate) : 0;
  // Minimum commission cap (e.g. 1 SAR)
  const finalCommission = Math.max(1, calculatedCommission); 

  // Helper to normalize input (Arabic to English digits)
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value;
      val = val.replace(/[٠-٩]/g, d => "0123456789"["٠١٢٣٤٥٦٧٨٩".indexOf(d)]);
      val = val.replace(/[^0-9.]/g, '');
      setPrice(val);
  };

  const handleBuyerSubmit = () => {
      if (!price || parseFloat(price) <= 0) return;
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          if (onSendRequest) onSendRequest(parseFloat(price));
      }, 1500);
  };

  const handlePayClick = () => {
      if (!selectedPaymentMethod) return;
      
      setIsProcessing(true);
      setTimeout(() => {
          setIsProcessing(false);
          if (onPayCommission) onPayCommission(finalCommission);
      }, 2000);
  };

  const handleReject = () => {
      if (confirm('هل أنت متأكد من رفض طلب الشراء؟')) {
          // Simulation of sending notification
          alert('تم رفض الطلب وإرسال إشعار للمشتري بذلك.');
          
          if (onReject) onReject();
          else onClose();
      }
  };

  return (
    <div className="absolute inset-0 z-[400] bg-gray-50/95 backdrop-blur-sm flex flex-col animate-in slide-in-from-bottom duration-300 font-sans">
      
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 flex justify-between items-center shadow-sm z-10">
          {currentStep === 'payment' ? (
              <button onClick={() => setCurrentStep('seller_review')} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <ArrowRight size={24} />
              </button>
          ) : (
              <button onClick={onClose} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-full">
                  <X size={24} />
              </button>
          )}
          <h2 className="text-lg font-black text-gray-900">
              {currentStep === 'buyer_input' && 'إتمام الصفقة'}
              {currentStep === 'seller_review' && 'معلومات طلب الشراء'}
              {currentStep === 'payment' && 'دفع العمولة'}
              {currentStep === 'success' && 'تمت العملية'}
          </h2>
          <div className="w-10"></div>
      </div>

      <div className="flex-1 overflow-y-auto flex flex-col relative">
          
          {/* --- STEP 1: BUYER INPUT --- */}
          {currentStep === 'buyer_input' && (
              <div className="flex flex-col flex-1 pb-6 bg-white">
                  
                  {/* Visual Header */}
                  <div className="bg-gradient-to-b from-gray-50 to-white pt-8 pb-4 px-6 text-center">
                      <div className="w-20 h-20 bg-[#6463C7]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#6463C7]/20 shadow-sm">
                          <Handshake size={36} className="text-[#6463C7]" strokeWidth={1.5} />
                      </div>
                      <h3 className="text-xl font-black text-gray-900 mb-2">كم المبلغ المتفق عليه؟</h3>
                      <p className="text-sm text-gray-500 font-medium">أدخل قيمة الصفقة لإرسال الطلب للبائع</p>
                  </div>

                  <div className="flex-1 px-6 flex flex-col items-center">
                      
                      {/* Price Input */}
                      <div className="w-full max-w-[280px] relative mb-8 mt-4">
                          <div className="flex items-center justify-center border-b-2 border-gray-100 focus-within:border-[#6463C7] transition-colors pb-2">
                              <input 
                                  type="tel" 
                                  value={price}
                                  onChange={handlePriceChange}
                                  placeholder="0"
                                  className="w-full text-center text-6xl font-black bg-transparent outline-none text-gray-900 placeholder:text-gray-200 dir-ltr"
                                  autoFocus
                              />
                              <span className="text-xl font-bold text-gray-400 mt-4 mr-2">ر.س</span>
                          </div>
                      </div>

                      {/* Value Proposition Box (Points & Offers Focused) */}
                      <div className="w-full bg-gradient-to-br from-[#6463C7] to-[#5352a3] rounded-2xl p-4 text-white shadow-lg shadow-purple-200 mb-6 relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                          <div className="flex gap-3 relative z-10">
                              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
                                  <Gift size={20} className="text-white" />
                              </div>
                              <div className="text-right">
                                  <h4 className="font-bold text-sm mb-1">نقاطك بانتظارك! 🎁</h4>
                                  <p className="text-[11px] text-purple-100 leading-relaxed font-medium">
                                      بمجرد قبول البائع للطلب، سيتم إضافة نقاط ولاء لمحفظتك فوراً. استخدم نقاطك في شراء <span className="text-white font-bold underline">كوبونات وعروض المتاجر</span>.
                                  </p>
                              </div>
                          </div>
                      </div>

                      {/* Timeline (Simplified Flow) */}
                      <div className="w-full bg-gray-50 rounded-2xl p-5 border border-gray-100">
                          <h4 className="text-right font-bold text-gray-900 mb-4 text-sm">كيف تحصل على النقاط؟</h4>
                          <div className="space-y-5 relative pr-1">
                              <div className="absolute top-3 bottom-6 right-[15px] w-0.5 bg-gray-200"></div>
                              
                              {/* Step 1 */}
                              <div className="flex gap-4 relative z-10">
                                  <div className="w-8 h-8 rounded-full bg-white text-[#6463C7] flex items-center justify-center font-black text-sm shrink-0 border border-gray-200 shadow-sm relative">
                                      1
                                      <span className="absolute inset-0 rounded-full animate-ping bg-[#6463C7]/20"></span>
                                  </div>
                                  <div className="text-right">
                                      <h5 className="font-bold text-xs text-gray-900">أرسل المبلغ للبائع</h5>
                                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                                          حدد المبلغ المتفق عليه وأرسل الطلب ليظهر عند البائع.
                                      </p>
                                  </div>
                              </div>

                              {/* Step 2 */}
                              <div className="flex gap-4 relative z-10">
                                  <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">2</div>
                                  <div className="text-right">
                                      <h5 className="font-bold text-xs text-gray-900">البائع يدفع العمولة</h5>
                                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                                          يقوم البائع بقبول الطلب ودفع عمولة الموقع البسيطة.
                                      </p>
                                  </div>
                              </div>

                              {/* Step 3 */}
                              <div className="flex gap-4 relative z-10">
                                  <div className="w-8 h-8 rounded-full bg-white text-gray-400 flex items-center justify-center font-bold text-sm shrink-0 border border-gray-200">3</div>
                                  <div className="text-right">
                                      <h5 className="font-bold text-xs text-gray-900">استلم نقاطك فوراً</h5>
                                      <p className="text-[10px] text-gray-500 mt-1 leading-relaxed">
                                          تضاف النقاط لمحفظتك لتستبدلها بقهوة، وجبات، أو خصومات.
                                      </p>
                                  </div>
                              </div>
                          </div>
                      </div>

                  </div>

                  <div className="px-6 pt-4">
                      <button 
                          onClick={handleBuyerSubmit}
                          disabled={!price || isProcessing}
                          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2 ${
                              price && !isProcessing
                              ? 'bg-[#6463C7] text-white shadow-[#6463C7]/30 hover:bg-[#5352a3] active:scale-[0.98]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                          {isProcessing ? (
                              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          ) : (
                              <>
                                  <span>إرسال طلب الشراء</span>
                                  <ArrowRight size={20} className="rotate-180" />
                              </>
                          )}
                      </button>
                  </div>
              </div>
          )}

          {/* --- STEP 2: SELLER REVIEW (UPDATED) --- */}
          {currentStep === 'seller_review' && (
              <div className="flex flex-col flex-1 px-6 py-6 overflow-y-auto no-scrollbar">
                  
                  {/* Buyer Profile Card */}
                  <div className="bg-gradient-to-r from-gray-50 to-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-6 flex flex-col gap-4 relative overflow-hidden">
                      <div className="flex items-center gap-4 relative z-10">
                          <div className="relative">
                              <div className="w-16 h-16 rounded-full bg-gray-200 border-4 border-white shadow-sm shrink-0 overflow-hidden">
                                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 text-blue-500">
                                      <User size={30} />
                                  </div>
                              </div>
                              <div className="absolute -bottom-1 -right-1 bg-yellow-400 border-2 border-white rounded-full p-1 shadow-sm">
                                  <Star size={10} className="text-white fill-white" />
                              </div>
                          </div>
                          
                          <div className="flex-1">
                              <div className="flex justify-between items-start">
                                  <div>
                                      <h3 className="text-base font-black text-gray-900 mb-1 leading-none">{buyerName}</h3>
                                      <span className="text-[10px] text-gray-400 font-bold dir-ltr">#{buyerId}</span>
                                  </div>
                                  <div className="flex flex-col items-end">
                                      <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[9px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                                          <BadgeCheck size={10} />
                                          عضو موثق
                                      </span>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      {/* Divider */}
                      <div className="h-px bg-gray-100 w-full"></div>

                      <div className="flex justify-between items-center text-xs">
                          <span className="text-gray-400 font-medium">تاريخ الانضمام</span>
                          <span className="font-bold text-gray-700">مارس 2023</span>
                      </div>
                  </div>

                  {/* Financial Details Card */}
                  <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-[#6463C7]"></div>
                      
                      <div className="flex justify-between items-center mb-6">
                          <span className="text-gray-500 font-medium text-sm">قيمة الصفقة المتفق عليها</span>
                          <span className="text-2xl font-black text-gray-900 dir-ltr">{parseFloat(price).toLocaleString()} <span className="text-xs text-gray-400">R.S</span></span>
                      </div>

                      <div className="border-t border-dashed border-gray-200 my-4"></div>

                      <div className="bg-[#6463C7]/5 rounded-xl p-4 flex justify-between items-center border border-[#6463C7]/10">
                          <div>
                              <span className="block text-[#6463C7] font-black text-sm mb-1">العمولة المستحقة</span>
                              <span className="text-[10px] text-gray-400 font-bold">(1% من قيمة البيع)</span>
                          </div>
                          <div className="text-3xl font-black text-[#6463C7] dir-ltr">
                              {finalCommission.toFixed(2)} <span className="text-sm">R.S</span>
                          </div>
                      </div>
                  </div>

                  {/* Persuasive Message (Seller View - Updated for Account Growth) */}
                  <div className="bg-gradient-to-r from-purple-50 via-white to-purple-50 border border-purple-100 rounded-2xl p-4 flex gap-3 mb-6 relative overflow-hidden">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-purple-600 shrink-0 shadow-sm border border-purple-100 z-10">
                          <TrendingUp size={20} className="text-purple-600" />
                      </div>
                      <div className="relative z-10">
                          <h4 className="font-black text-sm text-gray-900 mb-1">ارفع مستوى حسابك وضاعف مشاهداتك! 🚀</h4>
                          <p className="text-[11px] text-gray-600 font-medium leading-relaxed">
                              دفع العمولة يمنحك نقاط ولاء ترفع مستوى حسابك، مما يضمن <span className="text-[#6463C7] font-bold">ظهور إعلاناتك القادمة بشكل أكبر</span> ووصول أسرع للمشترين.
                          </p>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-auto flex flex-col gap-3">
                      
                      <button 
                          onClick={handleReject}
                          className="w-full py-3 bg-white text-red-500 border border-red-100 rounded-2xl font-bold text-sm hover:bg-red-50 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                          <Ban size={16} />
                          <span>رفض الطلب / مبلغ خاطئ</span>
                      </button>

                      <button 
                          onClick={() => setCurrentStep('payment')}
                          className="w-full py-4 bg-[#6463C7] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#6463C7]/20 hover:bg-[#5352a3] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                      >
                          <span>دفع العمولة ( {finalCommission.toFixed(2)} ر.س )</span>
                          <CheckCircle2 size={20} />
                      </button>

                  </div>
              </div>
          )}

          {/* --- STEP 3: PAYMENT --- */}
          {currentStep === 'payment' && (
              <div className="flex flex-col flex-1 bg-gray-50/50">
                  <div className="flex-1 overflow-y-auto px-6 py-6 pb-32">
                      
                      {/* Amount Summary Card */}
                      <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-8 text-center relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-50/50 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2"></div>
                          <span className="text-gray-400 text-xs font-bold block mb-2 relative z-10">المبلغ الإجمالي للدفع</span>
                          <div className="flex items-center justify-center gap-2 relative z-10">
                              <span className="text-5xl font-black text-[#6463C7] dir-ltr tracking-tight">{finalCommission.toFixed(2)}</span>
                              <div className="flex flex-col items-start">
                                  <span className="text-sm font-bold text-gray-400">ريال</span>
                                  <span className="text-[10px] font-bold text-green-500 bg-green-50 px-1.5 rounded">شامل الضريبة</span>
                              </div>
                          </div>
                      </div>

                      <h3 className="text-gray-900 font-bold mb-4 text-right px-2 flex items-center gap-2">
                          <ShieldCheck size={18} className="text-[#6463C7]" />
                          اختر وسيلة الدفع
                      </h3>
                      
                      <div className="space-y-4">
                          {/* Apple Pay Selection */}
                          <div 
                              onClick={() => setSelectedPaymentMethod('apple_pay')}
                              className={`w-full border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                  selectedPaymentMethod === 'apple_pay' 
                                  ? 'bg-black text-white border-black shadow-lg transform scale-[1.02]' 
                                  : 'bg-white border-gray-100 hover:border-gray-300 text-gray-900'
                              }`}
                          >
                              <div className="flex items-center gap-4 relative z-10">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'apple_pay' ? 'bg-white/20' : 'bg-black text-white'}`}>
                                      <span className="font-bold text-[12px] tracking-tight">Pay</span>
                                  </div>
                                  <div>
                                      <span className="font-bold block text-sm">Apple Pay</span>
                                      <span className={`text-[10px] ${selectedPaymentMethod === 'apple_pay' ? 'text-gray-400' : 'text-gray-400'}`}>أسرع وأكثر أماناً</span>
                                  </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center relative z-10 ${
                                  selectedPaymentMethod === 'apple_pay' ? 'border-white bg-white text-black' : 'border-gray-200'
                              }`}>
                                  {selectedPaymentMethod === 'apple_pay' && <Check size={14} strokeWidth={4} />}
                              </div>
                          </div>

                          {/* Card Selection */}
                          <div 
                              onClick={() => setSelectedPaymentMethod('card')}
                              className={`w-full border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all duration-300 relative overflow-hidden ${
                                  selectedPaymentMethod === 'card' 
                                  ? 'bg-[#6463C7] text-white border-[#6463C7] shadow-lg shadow-purple-200 transform scale-[1.02]' 
                                  : 'bg-white border-gray-100 hover:border-gray-300 text-gray-900'
                              }`}
                          >
                              <div className="flex items-center gap-4 relative z-10">
                                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'card' ? 'bg-white/20' : 'bg-blue-50 text-blue-600'}`}>
                                      <CreditCard size={20} />
                                  </div>
                                  <div>
                                      <span className="font-bold block text-sm">بطاقة مدى / فيزا</span>
                                      <span className={`text-[10px] ${selectedPaymentMethod === 'card' ? 'text-purple-200' : 'text-gray-400'}`}>دفع آمن ومشفر</span>
                                  </div>
                              </div>
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center relative z-10 ${
                                  selectedPaymentMethod === 'card' ? 'border-white bg-white text-[#6463C7]' : 'border-gray-200'
                              }`}>
                                  {selectedPaymentMethod === 'card' && <Check size={14} strokeWidth={4} />}
                              </div>
                          </div>
                      </div>

                      <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-medium mt-8 bg-gray-100/50 p-2 rounded-lg">
                          <Lock size={12} />
                          <span>جميع العمليات مشفرة ومحمية بنسبة 100%</span>
                      </div>
                  </div>

                  {/* Fixed Bottom Action Bar */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 p-4 pb-6 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-20">
                      <button 
                          onClick={handlePayClick}
                          disabled={!selectedPaymentMethod || isProcessing}
                          className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 ${
                              selectedPaymentMethod && !isProcessing
                              ? 'bg-[#6463C7] text-white shadow-[#6463C7]/30 hover:bg-[#5352a3] active:scale-[0.98]'
                              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                      >
                          {isProcessing ? (
                              <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                          ) : (
                              <>
                                  <span>دفع {finalCommission.toFixed(2)} ر.س</span>
                                  <div className="w-px h-4 bg-white/20"></div>
                                  <Lock size={18} />
                              </>
                          )}
                      </button>
                  </div>
              </div>
          )}

          {/* --- STEP 4: SUCCESS (REDESIGNED V2) --- */}
          {currentStep === 'success' && (
              <div className="flex flex-col items-center flex-1 justify-center px-6 bg-white relative overflow-hidden">
                  
                  {/* Background Gradients/Decorations */}
                  <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#6463C7]/10 rounded-full blur-[80px]"></div>
                      <div className="absolute bottom-[-10%] right-[-10%] w-[200px] h-[200px] bg-[#8382d6]/10 rounded-full blur-[60px]"></div>
                  </div>

                  {/* Animated Icon Container */}
                  <div className="relative mb-8">
                      <div className="w-32 h-32 bg-gradient-to-tr from-[#6463C7] to-[#8382d6] rounded-full flex items-center justify-center text-white shadow-2xl shadow-[#6463C7]/40 ring-8 ring-[#6463C7]/5 animate-in zoom-in duration-500">
                          <Check size={64} strokeWidth={4} />
                      </div>
                      {/* Floating Sparkles */}
                      <div className="absolute -top-2 -right-2 bg-white p-2 rounded-full shadow-md animate-bounce delay-100">
                          <Sparkles size={20} className="text-yellow-400 fill-yellow-400" />
                      </div>
                      <div className="absolute bottom-2 -left-2 bg-white p-2 rounded-full shadow-md animate-bounce delay-300">
                          <Coins size={20} className="text-[#6463C7]" />
                      </div>
                  </div>
                  
                  <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">تم الدفع بنجاح!</h2>
                  <p className="text-gray-500 font-medium text-sm mb-10 max-w-[280px] text-center leading-relaxed">
                      شكراً لك، تم توثيق البيع بنجاح. لقد حصلت على نقاط ولاء إضافية تقديراً لصدقك.
                  </p>

                  {/* Reward Receipt Card */}
                  <div className="w-full bg-gradient-to-br from-[#6463C7] to-[#504ebd] rounded-3xl p-1 shadow-xl shadow-[#6463C7]/20 mb-8 transform hover:scale-[1.02] transition-transform duration-300">
                      <div className="bg-white/10 backdrop-blur-md rounded-[1.3rem] p-6 text-center border border-white/20 relative overflow-hidden">
                          {/* Decorative Pattern */}
                          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_1px,transparent_1px)] [background-size:16px_16px]"></div>
                          
                          <span className="text-white/80 text-[10px] font-bold uppercase tracking-widest block mb-2">المكافأة المكتسبة</span>
                          
                          <div className="flex items-center justify-center gap-2 text-white mb-4">
                              <span className="text-6xl font-black dir-ltr tracking-tighter drop-shadow-sm">200</span>
                          </div>
                          <span className="text-sm font-bold text-white/90 bg-white/20 px-3 py-1 rounded-full">نقطة ولاء</span>
                          
                          <div className="mt-6 pt-4 border-t border-white/10 flex justify-between items-center text-xs text-white/70">
                              <span>رقم المرجع</span>
                              <div className="flex items-center gap-1 font-mono bg-black/20 px-2 py-1 rounded">
                                  <span className="font-bold text-white">#TRX-8829</span>
                                  <Copy size={10} className="opacity-70" />
                              </div>
                          </div>
                      </div>
                  </div>

                  <button 
                      onClick={onClose}
                      className="w-full py-4 bg-gray-50 text-gray-900 hover:bg-gray-100 rounded-2xl font-bold text-lg transition-colors border border-gray-100"
                  >
                      العودة للرئيسية
                  </button>
              </div>
          )}

      </div>
    </div>
  );
};
