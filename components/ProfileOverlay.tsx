
import React, { useState } from 'react';
import { 
    X, ChevronLeft, Wallet, Heart, Crown, FileText, Globe, MapPin, 
    Headphones, Info, LogOut, Check, Star, Settings, Edit3, Shield, 
    TrendingUp, Eye, Package, Gift, Store, ArrowLeft, Zap, ShieldCheck, FileWarning,
    Lock, Smartphone, Mail, Calendar, User, Trash2, XCircle, Camera, Users, UserCheck,
    AtSign, Hash, AlertTriangle, FileCheck, MessageCircle, ChevronDown, LayoutDashboard
} from 'lucide-react';
import { MOCK_USER } from '../constants';
import { BottomNav } from './BottomNav';
import { MyAdsOverlay } from './MyAdsOverlay';
import { FavoritesOverlay } from './FavoritesOverlay';
import { PremiumSellerOverlay } from './PremiumSellerOverlay'; // Import New Overlay
import { AdItem, RewardItem } from '../types';

interface ProfileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onWalletClick: () => void;
  onHomeClick?: () => void;
  onOffersClick?: () => void;
  onScanClick?: () => void;
  onMessagesClick?: () => void;
  onAdClick?: (ad: AdItem) => void;
  onOfferClick?: (offer: RewardItem) => void; 
  onEditAd?: (ad: AdItem) => void;
  onPromoteSuccess?: (adTitle: string, plan: string) => void;
  onSubscriptionSuccess?: (plan: string, points: number, vipCount: number, featuredCount: number) => void;
  vipAdsBalance?: number;
  featuredAdsBalance?: number;
  onConsumeBalance?: (type: 'vip' | 'featured') => void;
  onOpenStoreRegistration?: () => void;
  // New Props
  hasStore?: boolean;
  onOpenStoreManager?: () => void;
}

type ProfileView = 'main' | 'settings' | 'language' | 'privacy' | 'terms' | 'help-center';

export const ProfileOverlay: React.FC<ProfileOverlayProps> = ({ 
  isOpen, 
  onClose, 
  onWalletClick,
  onHomeClick,
  onOffersClick,
  onScanClick,
  onMessagesClick,
  onAdClick,
  onOfferClick,
  onEditAd,
  onPromoteSuccess,
  onSubscriptionSuccess,
  vipAdsBalance = 0,
  featuredAdsBalance = 0,
  onConsumeBalance,
  onOpenStoreRegistration,
  hasStore = false,
  onOpenStoreManager
}) => {
  const [currentView, setCurrentView] = useState<ProfileView>('main');
  const [showMyAds, setShowMyAds] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showPremium, setShowPremium] = useState(false); // New State
  const [selectedLanguage, setSelectedLanguage] = useState('ar'); // 'ar' or 'en'

  if (!isOpen) return null;

  // Mock calculation for next tier
  const nextTierPoints = 5000;
  const remainingPoints = nextTierPoints - MOCK_USER.walletBalance;
  const progressPercentage = Math.min((MOCK_USER.walletBalance / nextTierPoints) * 100, 100);

  // --- PREMIUM SELLER OVERLAY ---
  if (showPremium) {
      return (
          <PremiumSellerOverlay 
            isOpen={showPremium} 
            onClose={() => setShowPremium(false)} 
            onSubscribe={onSubscriptionSuccess}
          />
      );
  }

  // --- FAVORITES OVERLAY ---
  if (showFavorites) {
      return (
          <FavoritesOverlay 
            isOpen={showFavorites} 
            onClose={() => setShowFavorites(false)}
            onAdClick={onAdClick}
            onOfferClick={onOfferClick}
          />
      );
  }

  // --- MY ADS OVERLAY ---
  if (showMyAds) {
      return (
          <MyAdsOverlay 
            isOpen={showMyAds} 
            onClose={() => setShowMyAds(false)}
            onAdClick={onAdClick} 
            onEditAd={onEditAd} 
            onPromoteSuccess={onPromoteSuccess}
            vipAdsBalance={vipAdsBalance}
            featuredAdsBalance={featuredAdsBalance}
            onConsumeBalance={onConsumeBalance}
          />
      );
  }

  // --- LANGUAGE SELECTION VIEW ---
  if (currentView === 'language') {
      return (
        <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="bg-white px-6 pt-12 pb-3 flex items-center justify-between shadow-sm shrink-0 z-20">
                <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                    <ChevronRightIcon />
                </button>
                <h2 className="text-lg font-black text-gray-900">اللغة / Language</h2>
                <div className="w-10"></div>
            </div>
            
            <div className="p-5 flex flex-col gap-3">
                <button 
                    onClick={() => setSelectedLanguage('ar')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLanguage === 'ar' ? 'bg-white border-[#6463C7] shadow-sm' : 'bg-white border-gray-100'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">🇸🇦</div>
                        <span className={`font-bold ${selectedLanguage === 'ar' ? 'text-[#6463C7]' : 'text-gray-900'}`}>العربية</span>
                    </div>
                    {selectedLanguage === 'ar' && <Check size={20} className="text-[#6463C7]" />}
                </button>

                <button 
                    onClick={() => setSelectedLanguage('en')}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${selectedLanguage === 'en' ? 'bg-white border-[#6463C7] shadow-sm' : 'bg-white border-gray-100'}`}
                >
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">🇺🇸</div>
                        <span className={`font-bold ${selectedLanguage === 'en' ? 'text-[#6463C7]' : 'text-gray-900'}`}>English</span>
                    </div>
                    {selectedLanguage === 'en' && <Check size={20} className="text-[#6463C7]" />}
                </button>
            </div>
        </div>
      );
  }

  // --- HELP CENTER VIEW ---
  if (currentView === 'help-center') {
      return (
        <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            {/* Header */}
            <div className="bg-white px-6 pt-12 pb-3 flex items-center justify-between shadow-sm shrink-0 z-20">
                <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                    <ChevronRightIcon />
                </button>
                <h2 className="text-lg font-black text-gray-900">مركز المساعدة</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                {/* Contact Support Card */}
                <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6 text-center">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4 text-[#6463C7]">
                        <Headphones size={32} />
                    </div>
                    <h3 className="font-bold text-gray-900 mb-2">كيف يمكننا مساعدتك؟</h3>
                    <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                        فريق الدعم متواجد لخدمتك على مدار الساعة. تواصل معنا مباشرة.
                    </p>
                    
                    <button className="w-full bg-[#6463C7] text-white py-4 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-purple-200 active:scale-95 transition-transform hover:bg-[#5352a3]">
                        <MessageCircle size={20} />
                        <span>مراسلة الدعم</span>
                    </button>
                </div>

                {/* FAQ Section */}
                <h3 className="font-bold text-gray-900 mb-4 px-1 text-right">الأسئلة الشائعة</h3>
                <div className="space-y-3">
                    <FaqItem 
                        question="كيف أزيد نقاطي؟" 
                        answer="يمكنك زيادة نقاطك من خلال إتمام عمليات البيع والشراء عبر التطبيق، مسح أكواد QR، ودعوة الأصدقاء." 
                    />
                    <FaqItem 
                        question="ما هي فوائد العضوية الذهبية؟" 
                        answer="تمنحك العضوية الذهبية تخفيضاً على العمولات، أولوية في الظهور، ودعم فني مخصص." 
                    />
                    <FaqItem 
                        question="طريقة استرجاع المبلغ؟" 
                        answer="في حال إلغاء العملية قبل التوثيق، يعود المبلغ تلقائياً لمحفظتك خلال 24 ساعة." 
                    />
                     <FaqItem 
                        question="نسيت كلمة المرور؟" 
                        answer="يمكنك استعادة كلمة المرور عبر رقم الجوال المسجل من صفحة تسجيل الدخول." 
                    />
                </div>
            </div>
        </div>
      );
  }

  // --- PRIVACY POLICY VIEW ---
  if (currentView === 'privacy') {
      return (
        <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="bg-white px-6 pt-12 pb-3 flex items-center justify-between shadow-sm shrink-0 z-20">
                <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                    <ChevronRightIcon />
                </button>
                <h2 className="text-lg font-black text-gray-900">سياسة الخصوصية</h2>
                <div className="w-10"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-right">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">1. مقدمة</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            نحن نأخذ خصوصيتك على محمل الجد. توضح هذه السياسة كيف نجمع ونستخدم ونحمي معلوماتك الشخصية عند استخدامك لتطبيقنا.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">2. المعلومات التي نجمعها</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            قد نجمع معلومات مثل اسمك، رقم هاتفك، عنوان بريدك الإلكتروني، وموقعك الجغرافي لتحسين تجربتك في التطبيق وتوفير العروض المناسبة لمنطقتك.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">3. مشاركة البيانات</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            نحن لا نبيع بياناتك الشخصية لأطراف ثالثة. قد نشارك بعض البيانات مع شركاء الخدمة الموثوقين فقط لغرض تقديم خدماتنا (مثل خدمات الدفع أو التوصيل).
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">4. الأمان</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            نستخدم أحدث تقنيات التشفير لحماية بياناتك ومعاملاتك المالية داخل التطبيق.
                        </p>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-gray-400">
                    آخر تحديث: 20 نوفمبر 2025
                </div>
            </div>
        </div>
      );
  }

  // --- TERMS OF USE VIEW ---
  if (currentView === 'terms') {
      return (
        <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="bg-white px-6 pt-12 pb-3 flex items-center justify-between shadow-sm shrink-0 z-20">
                <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                    <ChevronRightIcon />
                </button>
                <h2 className="text-lg font-black text-gray-900">اتفاقية الاستخدام</h2>
                <div className="w-10"></div>
            </div>
            
            <div className="flex-1 overflow-y-auto no-scrollbar p-6 text-right">
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6">
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">1. القبول بالشروط</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            باستخدامك لهذا التطبيق، فإنك توافق على الالتزام بجميع الشروط والأحكام المذكورة هنا. إذا كنت لا توافق، يرجى التوقف عن استخدام التطبيق.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">2. حساب المستخدم</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            أنت مسؤول عن الحفاظ على سرية بيانات حسابك وكلمة المرور. التطبيق غير مسؤول عن أي نشاط يحدث تحت حسابك نتيجة لإهمالك.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">3. الإعلانات والمحتوى</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            يجب أن تكون جميع الإعلانات المنشورة متوافقة مع القوانين المحلية. يمنع بيع السلع المقلدة أو الممنوعة. نحتفظ بحق حذف أي إعلان مخالف.
                        </p>
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 mb-2">4. العمولة والنقاط</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            يلتزم البائع بدفع العمولة المقررة عند إتمام البيع عن طريق التطبيق. يتم منح نقاط الولاء وفقاً لسياسة النقاط الحالية.
                        </p>
                    </div>
                </div>
                <div className="mt-6 text-center text-xs text-gray-400">
                    آخر تحديث: 15 أكتوبر 2025
                </div>
            </div>
        </div>
      );
  }

  // --- SETTINGS VIEW (Account Information) ---
  if (currentView === 'settings') {
      return (
        <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-left duration-300 font-sans overflow-hidden">
            <div className="bg-white px-6 pt-12 pb-3 flex items-center justify-between shadow-sm shrink-0 z-20">
                <button onClick={() => setCurrentView('main')} className="p-2 -mr-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors text-gray-800">
                    <ChevronRightIcon />
                </button>
                <h2 className="text-lg font-black text-gray-900">معلومات الحساب</h2>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 p-5 flex flex-col gap-4 overflow-hidden">
                <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 relative overflow-hidden shrink-0">
                    <div className="absolute top-0 left-0 w-1 h-full bg-[#6463C7]"></div>
                    <div className="relative shrink-0">
                        <div className="w-20 h-20 rounded-2xl p-0.5 bg-gradient-to-tr from-[#6463C7] to-[#9f99e6]">
                            <img src={MOCK_USER.avatar} alt="Profile" className="w-full h-full rounded-[14px] object-cover border-2 border-white" />
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-sm border border-gray-100 text-[#6463C7]">
                            <Camera size={12} />
                        </div>
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-black text-lg text-gray-900 leading-tight mb-1 truncate">{MOCK_USER.name}</h3>
                        <div className="flex flex-wrap gap-2 mb-2">
                            <span className="bg-gray-100 text-gray-500 text-[9px] font-bold px-2 py-0.5 rounded-md border border-gray-200 dir-ltr flex items-center gap-1">
                                <Hash size={8} /> ID: 849021
                            </span>
                            <span className="bg-amber-50 text-amber-700 border border-amber-100 text-[9px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                <Crown size={9} fill="currentColor" /> عضو ذهبي
                            </span>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] text-gray-400 font-medium">
                            <span><b>6</b> متابعين</span>
                            <span className="w-px h-2 bg-gray-300"></span>
                            <span><b>5</b> متابع</span>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex flex-col gap-2.5 overflow-y-auto no-scrollbar pr-1">
                    <SettingsButton icon={<User size={18} />} label="الاسم" color="bg-blue-50" iconColor="text-blue-600" onClick={() => {}} />
                    <SettingsButton icon={<Smartphone size={18} />} label="رقم الجوال" color="bg-green-50" iconColor="text-green-600" onClick={() => {}} />
                    <SettingsButton icon={<Mail size={18} />} label="البريد الإلكتروني" color="bg-purple-50" iconColor="text-purple-600" onClick={() => {}} />
                    <SettingsButton icon={<Lock size={18} />} label="كلمة المرور" color="bg-red-50" iconColor="text-red-600" onClick={() => {}} />
                    <SettingsButton icon={<Calendar size={18} />} label="تاريخ الميلاد" color="bg-orange-50" iconColor="text-orange-600" onClick={() => {}} />
                    <SettingsButton icon={<UserCheck size={18} />} label="الجنس" color="bg-teal-50" iconColor="text-teal-600" onClick={() => {}} />
                </div>

                <div className="mt-auto shrink-0 pt-2 pb-1">
                    <div className="bg-red-50/60 rounded-2xl p-4 border border-red-100">
                        <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-red-800 text-xs flex items-center gap-2">
                                <AlertTriangle size={14} className="text-red-500" />
                                حذف الحساب نهائياً
                            </h4>
                        </div>
                        <p className="text-[10px] text-gray-500 leading-relaxed mb-3 text-right font-medium">
                            سيتم حذف بياناتك الشخصية، الإعلانات، والنقاط. <br/> هذا الإجراء نهائي ولا يمكن التراجع عنه.
                        </p>
                        <button className="w-full bg-white border border-red-200 text-red-500 rounded-xl p-2.5 flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all shadow-sm group">
                            <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
                            <span className="font-bold text-xs">تأكيد الحذف</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
      );
  }

  // --- MAIN PROFILE VIEW ---
  return (
    <div className="absolute inset-0 z-[200] bg-gray-50 flex flex-col animate-in slide-in-from-bottom duration-300 font-sans overflow-hidden">
      
      <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-center sticky top-0 z-20 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border-b border-gray-50">
          <h2 className="text-xl font-black text-gray-900 tracking-wide">الملف الشخصي</h2>
      </div>

      <div className="flex-1 overflow-y-auto no-scrollbar pb-32">
          
          <div className="px-6 mt-4 mb-6">
              <button 
                onClick={() => setCurrentView('settings')}
                className="w-full flex items-center justify-between bg-white p-4 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all group"
              >
                  <div className="flex items-center gap-4">
                      <div className="relative">
                          <div className="w-16 h-16 rounded-full p-[2px] bg-gradient-to-tr from-[#6463C7] to-[#9f99e6]">
                              <img 
                                src={MOCK_USER.avatar} 
                                alt={MOCK_USER.name} 
                                className="w-full h-full rounded-full object-cover border-2 border-white"
                              />
                          </div>
                          <div className="absolute bottom-0 right-0 bg-white text-[#6463C7] p-1 rounded-full shadow-md border border-gray-100">
                              <Settings size={10} />
                          </div>
                      </div>
                      <div className="text-right">
                          <h3 className="text-lg font-black text-gray-900 leading-tight mb-1 group-hover:text-[#6463C7] transition-colors">{MOCK_USER.name}</h3>
                          <div className="flex items-center gap-1.5">
                              <span className="bg-gray-100 text-gray-500 text-[10px] font-bold px-2 py-0.5 rounded-md border border-gray-200 dir-ltr flex items-center gap-1">
                                  <Hash size={8} /> ID: 849021
                              </span>
                              <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-[10px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                                  <Crown size={10} fill="currentColor" />
                                  عضو ذهبي
                              </span>
                          </div>
                      </div>
                  </div>
                  <div className="w-8 h-8 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 group-hover:bg-[#6463C7] group-hover:text-white transition-all">
                      <ChevronLeft size={18} />
                  </div>
              </button>
          </div>

          <div className="px-4 mb-6">
              <div 
                onClick={onWalletClick}
                className="w-full bg-gradient-to-br from-[#7e78d6] via-[#6463C7] to-[#4b459b] rounded-[2rem] p-5 text-white shadow-xl shadow-[#6463C7]/30 relative overflow-hidden group cursor-pointer"
              >
                  <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                  <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2"></div>

                  <div className="relative z-10">
                      <div className="flex justify-between items-start mb-4">
                          <div>
                              <p className="text-white/80 text-xs font-medium mb-1">رصيد النقاط</p>
                              <div className="flex items-baseline gap-1">
                                  <h2 className="text-3xl font-black tracking-tight dir-ltr">{MOCK_USER.walletBalance.toLocaleString()}</h2>
                                  <span className="text-sm font-bold text-white/90">نقطة</span>
                              </div>
                          </div>
                          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-colors">
                              <Wallet size={20} className="text-white" />
                          </div>
                      </div>

                      <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-bold text-white/80">
                              <span>المستوى الحالي: ذهبي</span>
                              <span>البلاتيني (5,000)</span>
                          </div>
                          <div className="h-2 w-full bg-black/20 rounded-full overflow-hidden">
                              <div 
                                style={{ width: `${progressPercentage}%` }}
                                className="h-full bg-white/90 rounded-full shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                              ></div>
                          </div>
                          <div className="flex items-center justify-between mt-1">
                              <p className="text-[10px] text-white/90 font-medium">
                                  باقي <span className="font-bold text-white text-xs">{remainingPoints}</span> نقطة للوصول للمستوى التالي 🚀
                              </p>
                              <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-[9px] font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1 animate-pulse">
                                  <Gift size={10} fill="currentColor" />
                                  <span>مكافأة: توثيق مجاني</span>
                              </div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="px-4 mb-4 flex gap-3">
              <button 
                onClick={() => setShowMyAds(true)}
                className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors group active:scale-[0.98]"
              >
                  <div className="w-10 h-10 bg-[#6463C7]/10 rounded-full flex items-center justify-center text-[#6463C7] group-hover:scale-110 transition-transform">
                      <FileText size={20} />
                  </div>
                  <div className="text-right">
                      <span className="text-gray-900 font-bold text-sm block">إعلاناتي</span>
                      <span className="text-[10px] text-gray-400 font-medium">12 إعلان</span>
                  </div>
              </button>

              <button 
                onClick={() => setShowFavorites(true)}
                className="flex-1 bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 hover:bg-gray-50 transition-colors group active:scale-[0.98]"
              >
                  <div className="w-10 h-10 bg-pink-50 rounded-full flex items-center justify-center text-pink-500 group-hover:scale-110 transition-transform">
                      <Heart size={20} />
                  </div>
                  <div className="text-right">
                      <span className="text-gray-900 font-bold text-sm block">المفضلة</span>
                      <span className="text-[10px] text-gray-400 font-medium">8 محفوظات</span>
                  </div>
              </button>
          </div>

          <div className="px-4 mb-4">
              <button 
                onClick={() => setShowPremium(true)}
                className="w-full bg-gradient-to-r from-amber-50 to-white rounded-3xl p-4 flex items-center justify-between border border-amber-100 shadow-sm group active:scale-[0.99] transition-transform"
              >
                  <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center text-amber-600 shadow-sm shrink-0 group-hover:scale-110 transition-transform">
                          <Crown size={18} className="fill-current" />
                      </div>
                      <div className="text-right">
                          <h3 className="font-bold text-sm text-gray-900">باقة البائع المميز</h3>
                          <p className="text-[10px] text-amber-600 font-medium leading-none mt-0.5">مميزات حصرية لزيادة مبيعاتك ⚡️</p>
                      </div>
                  </div>
                  <div className="bg-white p-1 rounded-full shadow-sm text-gray-300 group-hover:text-amber-500 transition-colors">
                       <ChevronLeft size={16} />
                  </div>
              </button>
          </div>

          {/* STORE CTA BUTTON - TOGGLES BASED ON STATE */}
          <div className="px-4 mb-6">
              {hasStore ? (
                  <button 
                    onClick={onOpenStoreManager}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-emerald-100 group active:scale-[0.99] transition-transform border border-emerald-500/20"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                              <LayoutDashboard size={24} className="text-white" />
                          </div>
                          <div className="text-right">
                              <h3 className="font-black text-sm mb-1 text-white">إدارة عروض متجرك</h3>
                              <p className="text-[10px] text-emerald-100 font-medium">
                                  التحكم في العروض، الإحصائيات، والإعلانات
                              </p>
                          </div>
                      </div>
                      <div className="bg-white text-emerald-600 p-2 rounded-full shadow-sm">
                          <ArrowLeft size={16} />
                      </div>
                  </button>
              ) : (
                  <button 
                    onClick={onOpenStoreRegistration} 
                    className="w-full bg-gradient-to-r from-[#3730a3] to-[#6463C7] rounded-2xl p-4 flex items-center justify-between text-white shadow-lg shadow-indigo-200 group active:scale-[0.99] transition-transform border border-indigo-500/20"
                  >
                      <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/20 group-hover:bg-white/30 transition-colors backdrop-blur-sm">
                              <Store size={24} className="text-white" />
                          </div>
                          <div className="text-right">
                              <h3 className="font-black text-sm mb-1 text-white">سجل متجرك الآن</h3>
                              <p className="text-[10px] text-indigo-100 font-medium">
                                  انضم لنظام الولاء وضاعف مبيعاتك
                              </p>
                          </div>
                      </div>
                      <div className="bg-white text-[#3730a3] p-2 rounded-full shadow-sm">
                          <ArrowLeft size={16} />
                      </div>
                  </button>
              )}
          </div>

          <div className="px-4 space-y-3">
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <MenuItem icon={<Globe size={20} />} label="اللغة / Language" value={selectedLanguage === 'ar' ? "العربية" : "English"} color="text-gray-500" onClick={() => setCurrentView('language')} />
                  <div className="border-t border-gray-50 mx-4"></div>
                  <MenuItem icon={<Headphones size={20} />} label="مركز المساعدة" color="text-gray-500" onClick={() => setCurrentView('help-center')} />
              </div>

              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                  <MenuItem icon={<ShieldCheck size={20} />} label="سياسة الخصوصية" color="text-gray-500" onClick={() => setCurrentView('privacy')} />
                  <div className="border-t border-gray-50 mx-4"></div>
                  <MenuItem icon={<FileWarning size={20} />} label="اتفاقية الاستخدام" color="text-gray-500" onClick={() => setCurrentView('terms')} />
              </div>

              <button className="w-full bg-red-50 rounded-2xl p-4 flex items-center justify-center gap-2 text-red-500 font-bold hover:bg-red-100 transition-colors mt-4">
                  <LogOut size={20} />
                  <span>تسجيل الخروج</span>
              </button>

              <p className="text-center text-[10px] text-gray-400 font-medium pt-4 pb-2">
                  إصدار التطبيق 1.0.4 (Beta)
              </p>
          </div>

      </div>

      <BottomNav 
        onProfileClick={() => {}} 
        onOffersClick={onOffersClick}
        onHomeClick={onHomeClick}
        onMessagesClick={onMessagesClick}
        onScanClick={onScanClick}
        activeTab="profile"
      />
    </div>
  );
};

const MenuItem = ({ icon, label, value, badge, color = "text-gray-500", onClick }: { icon: React.ReactNode, label: string, value?: string, badge?: string, color?: string, onClick?: () => void }) => (
    <button onClick={onClick} className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group">
        <div className="flex items-center gap-4">
             <div className={`${color} group-hover:scale-110 transition-transform`}>
                {icon}
             </div>
             <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">{label}</span>
        </div>
        <div className="flex items-center gap-3">
             {value && <span className="text-xs font-medium text-gray-400">{value}</span>}
             {badge && <span className="bg-[#6463C7]/10 text-[#6463C7] text-[10px] font-bold px-2 py-0.5 rounded-full">{badge}</span>}
             <ChevronLeft size={18} className="text-gray-300 group-hover:text-gray-500" />
        </div>
    </button>
);

const SettingsButton = ({ icon, label, color, iconColor, onClick, colSpan = '' }: { icon: React.ReactNode, label: string, color: string, iconColor: string, onClick: () => void, colSpan?: string }) => (
    <button onClick={onClick} className={`bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between group hover:border-[#6463C7]/30 transition-all active:scale-[0.98] h-full ${colSpan}`}>
        <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${color} ${iconColor}`}>
                {icon}
            </div>
            <span className="font-bold text-xs sm:text-sm text-gray-900 text-right leading-tight">{label}</span>
        </div>
        <ChevronLeft size={18} className="text-gray-300 group-hover:text-[#6463C7] transition-colors shrink-0" />
    </button>
);

const ChevronRightIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m9 18 6-6-6-6"/>
    </svg>
);

const FaqItem = ({ question, answer }: { question: string, answer: string }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex items-center justify-between p-4 text-right hover:bg-gray-50 transition-colors">
                <span className="font-bold text-gray-800 text-sm">{question}</span>
                <ChevronDown size={18} className={`text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && (
                <div className="px-4 pb-4 text-right animate-in slide-in-from-top-2 duration-200">
                    <p className="text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3 font-medium">{answer}</p>
                </div>
            )}
        </div>
    );
};
