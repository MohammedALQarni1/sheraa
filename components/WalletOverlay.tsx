
import React, { useState, useMemo } from 'react';
import { 
    ArrowRight, Plus, ArrowRightLeft, ShoppingBag, ArrowUpRight, ArrowDownLeft, X, 
    Mail, Dumbbell, AlertCircle, Bell, ChevronDown, Eye, Info, CreditCard, ScanLine, 
    History, Sparkles, Wifi, Zap, Users, Coffee, Briefcase, RefreshCw, Sun, CheckCircle2,
    Crown, Rocket, Check, Coins, Gift, Lock, QrCode, Copy, Share2, Plane, Heart, ArrowLeftRight, TrendingUp, Wallet, ArrowDown, ChevronLeft
} from 'lucide-react';
import { MOCK_USER, WALLET_TRANSACTIONS } from '../constants';
import { Transaction } from '../types';

interface WalletOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'main' | 'recharge'; // Added Prop
}

// Packages Data
const RECHARGE_PACKAGES = [
    { id: 'starter', points: 100, price: 10, bonus: 0, label: 'بداية', color: 'bg-gray-50 border-gray-200' },
    { id: 'plus', points: 550, price: 50, bonus: 50, label: 'الأكثر طلباً', color: 'bg-[#6463C7]/5 border-[#6463C7] ring-1 ring-[#6463C7]', popular: true },
    { id: 'pro', points: 1200, price: 100, bonus: 200, label: 'توفير 20%', color: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200' },
    { id: 'elite', points: 6500, price: 500, bonus: 1500, label: 'توفير 30%', color: 'bg-gradient-to-br from-purple-900 to-indigo-900 text-white border-transparent' },
];

// Transfer Partners Data - Enhanced with Visual Themes
const TRANSFER_PARTNERS = [
    { 
        id: 'alfursan', 
        name: 'الفرسان', 
        description: 'سافر بذكاء مع أميال الفرسان',
        icon: Plane, 
        color: 'bg-[#00305e] text-white', 
        bgGradient: 'from-[#1e3c72] to-[#2a5298]',
        accentColor: 'text-[#1e3c72]',
        rate: 5, // 5 App Points = 1 Mile
        minPoints: 1000,
        logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/9/93/Saudia_Logo_2023.svg/1200px-Saudia_Logo_2023.svg.png',
        badge: 'خيار المسافرين'
    },
    { 
        id: 'nasmiles', 
        name: 'ناسمايلز', 
        description: 'نقاطك تطير بك لأبعد مكان',
        icon: Plane, 
        color: 'bg-[#682c91] text-white', 
        bgGradient: 'from-[#673AB7] to-[#512DA8]',
        accentColor: 'text-[#673AB7]',
        rate: 4, // 4 App Points = 1 Smile
        minPoints: 500,
        logo: 'https://seeklogo.com/images/F/flynas-logo-2460267433-seeklogo.com.png',
        badge: 'أفضل معدل'
    },
    { 
        id: 'nahdi', 
        name: 'صيدلية النهدي', 
        description: 'شركة النهدي الطبية هي اكبر سلسلة صيدليات للبيع بالتجزئة.',
        icon: Heart, 
        color: 'bg-white border border-cyan-100 text-cyan-600', 
        bgGradient: 'from-[#00c6ff] to-[#0072ff]',
        accentColor: 'text-[#0072ff]',
        rate: 10, // 10 App Points = 1 Riyal
        minPoints: 100,
        logo: 'https://upload.wikimedia.org/wikipedia/ar/d/d4/Nahdi_Pharmacy_Logo.png',
        badge: 'الأكثر طلباً'
    }
];

// Comprehensive Icon Mapping for Loyalty System
const ICON_MAP: Record<string, any> = {
    'Zap': Zap, // General Energy
    'Rocket': Rocket, // Boosting/Promo
    'Crown': Crown, // Subscription/VIP
    'Users': Users, // Referral
    'Coffee': Coffee, // Rewards/Food
    'Briefcase': Briefcase, // Commission/Business
    'AlertCircle': AlertCircle, // Warning/Expiry
    'ArrowRight': ArrowRight, // Transfer
    'RefreshCw': RefreshCw, // Refund
    'Sun': Sun, // Daily/Check-in
    'Plus': Plus, // Deposit
    'ShoppingBag': ShoppingBag,
    'ScanLine': ScanLine, // QR Sales
    'Dumbbell': Dumbbell,
    'Mail': Mail
};

type WalletView = 'main' | 'recharge' | 'payment' | 'transaction-detail' | 'success' | 'show-qr' | 'transfer';

export const WalletOverlay: React.FC<WalletOverlayProps> = ({ isOpen, onClose, initialView = 'main' }) => {
  const [activeTab, setActiveTab] = useState<'earned' | 'redeemed'>('earned');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [currentView, setCurrentView] = useState<WalletView>('main');
  
  // State for Recharge Flow
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Reset view when opening/closing or when initialView changes
  React.useEffect(() => {
      if (isOpen) {
          setCurrentView(initialView === 'recharge' ? 'recharge' : 'main');
          setSelectedPackageId(null);
      }
  }, [isOpen, initialView]);

  // 1. Filter Transactions based on Tabs
  const filteredTransactions = useMemo(() => {
      if (!WALLET_TRANSACTIONS || !Array.isArray(WALLET_TRANSACTIONS)) return [];

      return WALLET_TRANSACTIONS.filter(t => {
          if (activeTab === 'earned') return t.amount > 0;
          if (activeTab === 'redeemed') return t.amount < 0;
          return true;
      }).sort((a, b) => {
          const dateA = new Date(`${a.date} ${a.time}`).getTime();
          const dateB = new Date(`${b.date} ${b.time}`).getTime();
          return dateB - dateA;
      });
  }, [activeTab]);

  // 2. Group Transactions by Date
  const groupedTransactions = useMemo(() => {
      const groups: Record<string, Transaction[]> = {};
      
      filteredTransactions.forEach(tx => {
          if (!groups[tx.displayDate]) {
              groups[tx.displayDate] = [];
          }
          groups[tx.displayDate].push(tx);
      });

      return groups;
  }, [filteredTransactions]);

  const handleRechargeSelect = (id: string) => {
      setSelectedPackageId(id);
      setCurrentView('payment');
  };

  const handlePaymentSuccess = () => {
      // Logic to update user balance (Mock)
      const pkg = RECHARGE_PACKAGES.find(p => p.id === selectedPackageId);
      if (pkg) {
          MOCK_USER.walletBalance += pkg.points;
          // Add transaction record mock
          WALLET_TRANSACTIONS.unshift({
              id: `chg_${Date.now()}`,
              type: 'deposit_bonus',
              title: 'شحن رصيد',
              subtitle: 'بطاقة بنكية',
              amount: pkg.points,
              currency: 'نقطة',
              date: new Date().toISOString().split('T')[0],
              displayDate: 'اليوم',
              time: 'الآن',
              iconName: 'Plus',
              status: 'completed'
          });
      }
      setCurrentView('success');
  };

  if (!isOpen) return null;

  // Render Views based on state
  if (currentView === 'success') {
      const pkg = RECHARGE_PACKAGES.find(p => p.id === selectedPackageId);
      return (
          <SuccessView 
            points={pkg?.points || 0} 
            onClose={() => {
                setCurrentView('main');
                setSelectedPackageId(null);
            }} 
          />
      );
  }

  if (currentView === 'payment') {
      const pkg = RECHARGE_PACKAGES.find(p => p.id === selectedPackageId);
      if (!pkg) { setCurrentView('recharge'); return null; }

      return (
        <PaymentMethodsView 
            packageData={pkg}
            onBack={() => setCurrentView('recharge')} 
            onSuccess={handlePaymentSuccess}
        />
      );
  }

  if (currentView === 'recharge') {
      return (
        <RechargeView 
            onBack={() => setCurrentView('main')} 
            onSelect={handleRechargeSelect}
        />
      );
  }

  if (currentView === 'show-qr') {
      return (
          <ShowQRView 
            onBack={() => setCurrentView('main')} 
          />
      );
  }

  if (currentView === 'transfer') {
      return (
          <TransferPointsView 
            onBack={() => setCurrentView('main')}
          />
      );
  }

  if (selectedTransaction) {
      return (
          <TransactionDetail 
            transaction={selectedTransaction} 
            onBack={() => setSelectedTransaction(null)} 
          />
      );
  }

  // --- Main Premium Wallet View ---
  return (
    <div className="absolute inset-0 z-[200] bg-[#fbf9ff] flex flex-col animate-in fade-in duration-300 overflow-hidden font-sans text-right">
      
      {/* Background Ambient Glows (Light Mode Adjusted) */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] h-[300px] bg-[#6463C7]/20 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute top-[20%] right-[-10%] w-[200px] h-[200px] bg-blue-100/40 rounded-full blur-[60px] pointer-events-none"></div>

      {/* Header */}
      <div className="relative z-10 px-6 pt-6 pb-1 flex justify-between items-center text-gray-900">
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center hover:bg-gray-50 transition-all border border-gray-100">
              <ArrowRight size={20} className="text-gray-800" />
          </button>
          <span className="text-lg font-bold tracking-wide">المحفظة</span>
          <div className="w-10 h-10"></div> {/* Spacer */}
      </div>

      {/* Hero Section: The Digital Card */}
      <div className="relative z-10 px-6 mb-4 perspective-1000">
          <div className="w-full aspect-[1.8/1] rounded-3xl relative overflow-hidden shadow-xl shadow-[#6463C7]/40 transition-transform hover:scale-[1.02] duration-500 group">
              
              {/* Card Background Gradient */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#5352a3] via-[#6463C7] to-[#8382d6]"></div>
              
              {/* Glass Effect Overlay */}
              <div className="absolute inset-0 bg-white/5 backdrop-blur-[1px]"></div>
              
              {/* Decorative Mesh/Circles on Card */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-[#8382d6]/30 rounded-full blur-2xl"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_70%)]"></div>

              {/* Card Content */}
              <div className="absolute inset-0 p-5 flex flex-col justify-between text-white">
                  
                  {/* Top Row: Chip & Wifi */}
                  <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2">
                           {/* Chip Simulation */}
                           <div className="w-9 h-7 rounded-md bg-gradient-to-br from-yellow-200 to-yellow-600 border border-yellow-400/50 shadow-sm relative overflow-hidden">
                                <div className="absolute inset-0 border-[0.5px] border-black/20 rounded-md"></div>
                                <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/20"></div>
                                <div className="absolute top-0 left-1/2 h-full w-[1px] bg-black/20"></div>
                           </div>
                           <Wifi size={18} className="rotate-90 opacity-60" />
                      </div>
                      <span className="text-[10px] font-bold tracking-widest opacity-80 uppercase bg-white/10 px-2 py-0.5 rounded-full">Platinum</span>
                  </div>

                  {/* Middle: Balance (Centered) */}
                  <div className="flex flex-col items-center justify-center mt-1">
                      <span className="text-[10px] text-purple-100 font-medium mb-1">الرصيد الحالي</span>
                      <div className="flex items-end gap-1.5" dir="rtl">
                          <span className="text-4xl font-black tracking-tight text-white drop-shadow-sm">
                              {MOCK_USER.walletBalance.toLocaleString()}
                          </span>
                          <span className="text-sm font-bold opacity-90 pb-1.5">نقطة</span>
                      </div>
                  </div>

                  {/* Bottom Row: Brand Right, Name Left */}
                  <div className="flex justify-between items-end">
                      
                      {/* Brand (Right in RTL) */}
                      <div className="flex items-center gap-1.5 opacity-90">
                          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-md">
                              <Sparkles size={14} className="text-white" />
                          </div>
                          <span className="font-black text-base tracking-wide">شراء</span>
                      </div>

                      {/* Name (Left in RTL) */}
                      <div className="flex flex-col items-end">
                          <span className="text-[9px] text-purple-200 font-medium mb-0.5 opacity-90">المستخدم</span>
                          <span className="text-sm font-bold tracking-wide">{MOCK_USER.name}</span>
                      </div>
                      
                  </div>
              </div>
          </div>
      </div>

      {/* Action Buttons Row */}
      <div className="relative z-10 px-6 mb-4">
          <div className="flex justify-between gap-3">
              <ActionButton 
                  icon={<Plus size={22} />} 
                  label="شحن" 
                  onClick={() => setCurrentView('recharge')} 
                  highlight
              />
              <ActionButton 
                  icon={<ArrowLeftRight size={22} />} 
                  label="تحويل النقاط" 
                  onClick={() => setCurrentView('transfer')} 
              />
              <ActionButton 
                  icon={<QrCode size={22} />} 
                  label="عرض الكود" 
                  onClick={() => setCurrentView('show-qr')} 
              />
          </div>
      </div>

      {/* Bottom Sheet: Transactions */}
      <div className="flex-1 bg-white rounded-t-[2rem] relative z-10 shadow-[0_-5px_30px_rgba(0,0,0,0.05)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-500 border-t border-gray-50">
          
          {/* Drag Handle */}
          <div className="w-full flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
          </div>

          {/* Title - Records of Operations */}
          <div className="px-6 pb-2 pt-1 text-right">
              <h3 className="text-base font-black text-gray-900">سجل العمليات</h3>
          </div>

          {/* Toggle Tabs */}
          <div className="px-6 py-2 pb-2">
              <div className="bg-gray-50 p-1 rounded-xl flex relative border border-gray-100">
                  <button 
                      onClick={() => setActiveTab('earned')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold z-10 transition-colors ${activeTab === 'earned' ? 'text-white' : 'text-gray-500'}`}
                  >
                      مكتسبة (إيداع)
                  </button>
                  <button 
                      onClick={() => setActiveTab('redeemed')}
                      className={`flex-1 py-2.5 rounded-lg text-xs font-bold z-10 transition-colors ${activeTab === 'redeemed' ? 'text-white' : 'text-gray-500'}`}
                  >
                      مستخدمة (خصم)
                  </button>
                  
                  {/* Sliding Background */}
                  <div className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-[#6463C7] rounded-lg shadow-sm transition-all duration-300 ${activeTab === 'earned' ? 'right-1' : 'right-[50%]'}`}></div>
              </div>
          </div>

          {/* List with Groups */}
          <div className="flex-1 overflow-y-auto px-6 pb-6 space-y-5 no-scrollbar">
              {Object.keys(groupedTransactions).length > 0 ? (
                  Object.keys(groupedTransactions).map((dateKey) => (
                      <div key={dateKey}>
                          {/* Date Header */}
                          <h4 className="text-[11px] font-bold text-gray-400 mb-3 text-right bg-white sticky top-0 py-1 z-10 opacity-90 backdrop-blur-sm">
                              {dateKey}
                          </h4>
                          
                          {/* Items in this group */}
                          <div className="space-y-3">
                              {groupedTransactions[dateKey].map((tx) => (
                                  <TransactionItem 
                                    key={tx.id} 
                                    transaction={tx}
                                    onClick={() => setSelectedTransaction(tx)}
                                  />
                              ))}
                          </div>
                      </div>
                  ))
              ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-gray-300 gap-2">
                      <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100">
                          <History size={26} className="opacity-40" />
                      </div>
                      <p className="text-sm font-medium">لا توجد عمليات</p>
                  </div>
              )}
          </div>
      </div>

    </div>
  );
};

// ... (Sub Components remain same) ...
const ActionButton: React.FC<{ icon: React.ReactNode, label: string, onClick?: () => void, highlight?: boolean }> = ({ icon, label, onClick, highlight }) => (
    <button onClick={onClick} className="flex flex-col items-center gap-2 group flex-1">
        <div className={`w-[56px] h-[56px] rounded-2xl flex items-center justify-center backdrop-blur-md border shadow-sm transition-transform group-active:scale-95 ${
            highlight 
            ? 'bg-[#6463C7] border-[#6463C7] text-white shadow-lg shadow-[#6463C7]/40' 
            : 'bg-white border-white text-gray-600 hover:bg-gray-50 hover:border-gray-100'
        }`}>
            {icon}
        </div>
        <span className="text-gray-600 text-[11px] font-bold">{label}</span>
    </button>
);

const TransactionItem: React.FC<{ transaction: Transaction, onClick: () => void }> = ({ transaction, onClick }) => {
    const isPositive = transaction.amount > 0;
    const IconComponent = transaction.iconName ? ICON_MAP[transaction.iconName] : null;

    const getTheme = () => {
        // Earnings
        if (transaction.type === 'subscription_bonus') return 'bg-amber-50 text-amber-600 border-amber-100'; // Gold for VIP/Sub
        if (transaction.type === 'ad_promo_bonus') return 'bg-[#6463C7]/10 text-[#6463C7] border-[#6463C7]/20'; // Purple for Promo
        if (transaction.type === 'referral_bonus') return 'bg-blue-50 text-blue-600 border-blue-100';
        if (transaction.type === 'commission_reward') return 'bg-indigo-50 text-indigo-600 border-indigo-100';
        if (transaction.type === 'sale_reward') return 'bg-teal-50 text-teal-600 border-teal-100';
        if (transaction.type === 'daily_reward') return 'bg-yellow-50 text-yellow-600 border-yellow-100';
        
        // Spendings
        if (transaction.type === 'expired') return 'bg-red-50 text-red-500 border-red-100';
        if (transaction.type === 'buy_reward') return 'bg-pink-50 text-pink-500 border-pink-100';
        if (transaction.type === 'transfer_sent') return 'bg-orange-50 text-orange-500 border-orange-100';
        
        // Default
        if (isPositive) return 'bg-green-50 text-green-600 border-green-100';
        return 'bg-gray-50 text-gray-500 border-gray-100';
    };

    const themeClass = getTheme();

    return (
        <div onClick={onClick} className="flex items-center justify-between p-3 py-3.5 rounded-2xl bg-white hover:bg-[#fbf9ff] cursor-pointer active:scale-[0.99] transition-all border border-gray-50 hover:border-[#6463C7]/20 group shadow-sm">
            <div className="flex items-center gap-4">
                {/* Icon Box */}
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${themeClass} transition-transform group-hover:scale-105 shadow-sm`}>
                    {IconComponent ? <IconComponent size={18} /> : <ArrowRightLeft size={18} />}
                </div>
                
                {/* Text Content */}
                <div className="text-right">
                    <h3 className="font-bold text-gray-900 text-[13px] mb-1">{transaction.title}</h3>
                    <p className="text-[10px] text-gray-400 font-medium tracking-wide flex items-center gap-1">
                        <span dir="ltr">{transaction.time}</span>
                         • {transaction.subtitle}
                    </p>
                </div>
            </div>
            
            {/* Amount */}
            <div className="text-left flex flex-col items-end">
                <span className={`block font-black text-sm mb-0.5 dir-ltr ${
                    isPositive ? 'text-green-600' : 'text-red-500'
                }`}>
                    {isPositive ? '+' : ''}{transaction.amount}
                </span>
                <span className="block text-[9px] text-gray-300 font-bold tracking-wide">PTS</span>
            </div>
        </div>
    );
};

const TransactionDetail: React.FC<{ transaction: Transaction, onBack: () => void }> = ({ transaction, onBack }) => {
    if (!transaction) return null;
    const IconComponent = transaction.iconName ? ICON_MAP[transaction.iconName] : null;

    return (
        <div className="absolute inset-0 z-[210] bg-[#fbf9ff] flex flex-col animate-in slide-in-from-right duration-300">
            <div className="px-4 py-4 pt-10">
                <button onClick={onBack} className="p-2 -mr-2 text-gray-900 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={24} strokeWidth={2.5} />
                </button>
            </div>
            <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar">
                {/* Receipt Card */}
                <div className="bg-white rounded-3xl p-8 shadow-sm mb-6 relative overflow-hidden text-center border border-gray-100">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#6463C7] via-[#8382d6] to-[#a3a2e6]"></div>
                    
                    <div className="w-20 h-20 rounded-full bg-[#6463C7]/10 flex items-center justify-center mx-auto mb-4 text-[#6463C7] border-4 border-white shadow-sm">
                         {IconComponent ? <IconComponent size={32} /> : <CreditCard size={32} />}
                    </div>

                    <h2 className="text-xl font-black text-gray-900 mb-2">{transaction.title}</h2>
                    <p className="text-sm text-gray-400 font-medium mb-6" dir="ltr">
                        {transaction.displayDate}, {transaction.time}
                    </p>

                    <div className="inline-block bg-gray-50 rounded-2xl px-8 py-4 border border-gray-100 min-w-[200px]">
                         <span className={`text-4xl font-black dir-ltr block ${transaction.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                             {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                         </span>
                         <span className="block text-xs text-gray-400 font-bold mt-1 tracking-widest">POINTS</span>
                    </div>

                    {transaction.status === 'completed' && (
                        <div className="mt-6 flex items-center justify-center gap-2 text-green-600 text-sm font-bold bg-green-50 py-2 rounded-xl border border-green-100">
                            <CheckCircle2 size={16} />
                            <span>مكتملة بنجاح</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// ... (Other components like RechargeView, PaymentMethodsView etc. stay the same, they are part of the file) ...
// Simplified placeholders for brevity in this delta, in real file keep full content.
const RechargeView: React.FC<{ onBack: () => void, onSelect: (id: string) => void }> = ({ onBack, onSelect }) => {
    return (
        <div className="absolute inset-0 z-[220] bg-white flex flex-col animate-in slide-in-from-right duration-300 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-12 pb-4 border-b border-gray-50 shadow-sm z-10 sticky top-0 bg-white">
                 <button onClick={onBack} className="p-2 -mr-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowRight size={24} />
                 </button>
                 <h2 className="text-lg font-black text-gray-900">شحن الرصيد</h2>
                 <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24 bg-gray-50">
               <p className="text-gray-500 text-sm font-bold mb-6 text-center">
                   اختر الباقة المناسبة لشحن نقاطك فوراً
               </p>

               <div className="space-y-4">
                   {RECHARGE_PACKAGES.map((pkg) => (
                       <div 
                           key={pkg.id} 
                           onClick={() => onSelect(pkg.id)}
                           className={`relative rounded-3xl p-5 cursor-pointer transition-all active:scale-[0.98] border shadow-sm group overflow-hidden ${pkg.color} ${pkg.id === 'elite' ? 'hover:shadow-xl' : 'hover:border-[#6463C7]/30 hover:shadow-md bg-white'}`}
                       >
                           {/* Decorative Background for Elite */}
                           {pkg.id === 'elite' && (
                               <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                           )}

                           <div className="flex justify-between items-center relative z-10">
                               <div className="flex items-center gap-4">
                                   <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${pkg.id === 'elite' ? 'bg-white/20 backdrop-blur-md' : 'bg-gray-100'}`}>
                                       {pkg.id === 'elite' ? <Crown size={24} className="text-white" /> : <Coins size={24} className={pkg.id === 'plus' ? 'text-[#6463C7]' : 'text-gray-500'} />}
                                   </div>
                                   <div>
                                       <h3 className={`font-black text-lg ${pkg.id === 'elite' ? 'text-white' : 'text-gray-900'}`}>{pkg.points} نقطة</h3>
                                       {pkg.bonus > 0 && (
                                           <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pkg.id === 'elite' ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700'}`}>
                                               +{pkg.bonus} مجاناً
                                           </span>
                                       )}
                                   </div>
                               </div>
                               
                               <div className="text-center">
                                   <span className={`block text-xl font-black dir-ltr ${pkg.id === 'elite' ? 'text-white' : 'text-[#6463C7]'}`}>{pkg.price}</span>
                                   <span className={`text-[10px] font-bold ${pkg.id === 'elite' ? 'text-white/70' : 'text-gray-400'}`}>ر.س</span>
                               </div>
                           </div>

                           {pkg.label && (
                               <div className={`absolute top-0 left-0 px-3 py-1 text-[10px] font-bold rounded-br-2xl ${
                                   pkg.id === 'elite' ? 'bg-yellow-400 text-black' : 
                                   pkg.id === 'plus' ? 'bg-[#6463C7] text-white' : 
                                   'bg-gray-200 text-gray-600'
                               }`}>
                                   {pkg.label}
                               </div>
                           )}
                       </div>
                   ))}
               </div>
            </div>
        </div>
    );
};

const PaymentMethodsView: React.FC<{ packageData: any, onBack: () => void, onSuccess: () => void }> = ({ packageData, onBack, onSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState<'apple_pay' | 'card'>('apple_pay');
    const [isProcessing, setIsProcessing] = useState(false);

    const handlePay = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            onSuccess();
        }, 2000);
    };

    return (
        <div className="absolute inset-0 z-[230] bg-white flex flex-col animate-in slide-in-from-left duration-300 font-sans">
            <div className="flex justify-between items-center px-6 pt-12 pb-4 border-b border-gray-50">
                 <button onClick={onBack} className="p-2 -mr-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowRight size={24} />
                 </button>
                 <h2 className="text-lg font-black text-gray-900">الدفع</h2>
                 <div className="w-8"></div>
            </div>

            <div className="flex-1 px-6 py-6">
                
                {/* Summary Card */}
                <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 mb-8">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-bold text-sm">الباقة المختارة</span>
                        <span className="font-black text-gray-900">{packageData.points} نقطة</span>
                    </div>
                    <div className="flex justify-between items-center border-t border-gray-200 pt-4">
                        <span className="text-gray-900 font-bold">الإجمالي</span>
                        <span className="text-2xl font-black text-[#6463C7] dir-ltr">{packageData.price} ر.س</span>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 mb-4 px-1">طريقة الدفع</h3>
                
                <div className="space-y-3">
                    <div 
                        onClick={() => setSelectedMethod('apple_pay')}
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${selectedMethod === 'apple_pay' ? 'border-black bg-black text-white shadow-lg' : 'border-gray-200 bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <span className="font-bold">Apple Pay</span>
                        </div>
                        {selectedMethod === 'apple_pay' && <Check size={18} />}
                    </div>

                    <div 
                        onClick={() => setSelectedMethod('card')}
                        className={`border rounded-2xl p-4 flex items-center justify-between cursor-pointer transition-all ${selectedMethod === 'card' ? 'border-[#6463C7] bg-[#6463C7] text-white shadow-lg' : 'border-gray-200 bg-white'}`}
                    >
                        <div className="flex items-center gap-3">
                            <CreditCard size={20} />
                            <span className="font-bold">بطاقة بنكية</span>
                        </div>
                        {selectedMethod === 'card' && <Check size={18} />}
                    </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-400 text-[10px] font-medium mt-8 bg-gray-50 p-2 rounded-lg">
                    <Lock size={12} />
                    <span>عملية دفع آمنة ومشفرة 100%</span>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100">
                <button 
                    onClick={handlePay}
                    disabled={isProcessing}
                    className="w-full bg-[#6463C7] text-white font-bold py-4 rounded-2xl shadow-lg shadow-[#6463C7]/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    ) : (
                        `دفع ${packageData.price} ر.س`
                    )}
                </button>
            </div>
        </div>
    );
};

const SuccessView: React.FC<{ points: number, onClose: () => void }> = ({ points, onClose }) => {
    return (
        <div className="absolute inset-0 z-[250] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
            <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative animate-in zoom-in duration-500">
                <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
                <Check size={48} className="text-green-500" strokeWidth={3} />
            </div>
            
            <h2 className="text-2xl font-black text-gray-900 mb-2">تم الشحن بنجاح! 🎉</h2>
            <p className="text-gray-500 text-sm mb-8">تم إضافة الرصيد إلى محفظتك</p>

            <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-center border border-gray-100 min-w-[200px]">
                <span className="text-5xl font-black text-[#6463C7] dir-ltr block mb-1">{points}</span>
                <span className="text-gray-400 font-bold text-xs uppercase tracking-widest">Points Added</span>
            </div>

            <button 
                onClick={onClose}
                className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
            >
                العودة للمحفظة
            </button>
        </div>
    );
};

const ShowQRView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    return (
        <div className="absolute inset-0 z-[220] bg-white flex flex-col animate-in slide-in-from-right duration-300 font-sans items-center pt-12 px-6">
             <div className="w-full flex justify-start mb-6">
                 <button onClick={onBack} className="p-2 -mr-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowRight size={24} />
                 </button>
             </div>
             
             <h2 className="text-xl font-black text-gray-900 mb-2">QR الخاص بي</h2>
             <p className="text-sm text-gray-500 mb-8 text-center">اسمح للبائع بمسح الكود لتوثيق العملية</p>

             <div className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-[#6463C7]/20 border border-gray-100 mb-8 relative">
                 <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1.5 bg-gray-100 rounded-b-xl"></div>
                 <QrCode size={220} className="text-gray-900" />
                 <div className="mt-6 flex flex-col items-center gap-1">
                     <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">User ID</span>
                     <span className="text-lg font-black text-[#6463C7] dir-ltr">849021</span>
                 </div>
             </div>

             <div className="flex gap-4 w-full max-w-xs">
                <button className="flex-1 flex items-center justify-center gap-2 bg-gray-50 py-3 rounded-2xl font-bold text-gray-700 hover:bg-gray-100 transition-colors">
                    <Copy size={18} />
                    <span>نسخ</span>
                </button>
                <button className="flex-1 flex items-center justify-center gap-2 bg-[#6463C7] py-3 rounded-2xl font-bold text-white hover:bg-[#5352a3] transition-colors shadow-lg shadow-[#6463C7]/20">
                    <Share2 size={18} />
                    <span>مشاركة</span>
                </button>
            </div>
        </div>
    );
};

const TransferPointsView: React.FC<{ onBack: () => void }> = ({ onBack }) => {
    const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
    const [step, setStep] = useState<'partners' | 'details' | 'success'>('partners');
    const [membershipId, setMembershipId] = useState('');
    const [pointsAmount, setPointsAmount] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);

    const partner = TRANSFER_PARTNERS.find(p => p.id === selectedPartner);

    const handlePartnerSelect = (id: string) => {
        setSelectedPartner(id);
        setStep('details');
        setPointsAmount('');
        setMembershipId('');
    };

    const handleTransfer = () => {
        if (!pointsAmount) return;
        setIsProcessing(true);
        
        // Mock API Call
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            // Mock deducting points logic here if needed
        }, 2000);
    };

    const setMaxPoints = () => {
        setPointsAmount(MOCK_USER.walletBalance.toString());
    };

    // --- SUCCESS VIEW ---
    if (step === 'success' && partner) {
        return (
            <div className="absolute inset-0 z-[250] bg-white flex flex-col items-center justify-center p-6 animate-in fade-in duration-300">
                <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-6 relative animate-in zoom-in duration-500">
                    <div className="absolute inset-0 border-4 border-green-100 rounded-full animate-ping opacity-20"></div>
                    <Check size={48} className="text-green-500" strokeWidth={3} />
                </div>
                
                <h2 className="text-2xl font-black text-gray-900 mb-2">تم التحويل بنجاح! 🎉</h2>
                <p className="text-gray-500 text-sm mb-8 text-center max-w-xs">
                    تم تحويل {pointsAmount} نقطة إلى حسابك في {partner.name}.
                </p>

                <div className="bg-gray-50 rounded-3xl p-6 mb-10 w-full border border-gray-100">
                    <div className="flex justify-between items-center mb-4">
                        <span className="text-gray-500 font-medium text-xs">إلى حساب</span>
                        <span className="font-bold text-gray-900 text-sm dir-ltr">{membershipId || '---'}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-500 font-medium text-xs">الرصيد المحول</span>
                        <span className={`font-black dir-ltr text-lg ${partner.accentColor}`}>{Math.floor(Number(pointsAmount) / partner.rate)} {partner.id === 'nahdi' ? 'ريال' : 'ميل'}</span>
                    </div>
                </div>

                <button 
                    onClick={onBack}
                    className="w-full bg-gray-900 text-white font-bold py-4 rounded-2xl shadow-lg active:scale-95 transition-transform"
                >
                    العودة للمحفظة
                </button>
            </div>
        );
    }

    // --- DETAILS INPUT VIEW ---
    if (step === 'details' && partner) {
        const convertedValue = pointsAmount ? Math.floor(Number(pointsAmount) / partner.rate) : 0;
        const unit = partner.id === 'nahdi' ? 'ريال' : 'ميل';
        // Updated large quick amounts similar to reference
        const quickAmounts = [500000, 250000, 50000, 25000, 1000, 500];

        return (
            <div className="absolute inset-0 z-[230] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-left duration-300 font-sans">
                
                {/* Header */}
                <div className="bg-white px-6 pt-12 pb-4 flex items-center justify-between shadow-sm z-10 sticky top-0">
                    <button onClick={() => setStep('partners')} className="p-2 -mr-2 bg-gray-50 hover:bg-gray-100 rounded-full transition-colors text-gray-800">
                        <ArrowRight size={24} />
                    </button>
                    <h2 className="text-lg font-black text-gray-900">تحويل النقاط</h2>
                    <div className="w-10"></div>
                </div>

                <div className="flex-1 px-6 pt-6 overflow-y-auto no-scrollbar relative z-0 pb-32">
                    
                    {/* Partner Card */}
                    <div className="w-full bg-[#E3E1F6] rounded-[2rem] p-5 relative overflow-hidden mb-8 shadow-sm">
                        
                        {/* Content Row */}
                        <div className="flex items-center gap-4 relative z-10">
                            {/* Illustration (Left Side) */}
                            <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center shrink-0 border border-white/30">
                                {/* Using placeholder illustration to mimic the 3D shop */}
                                <img 
                                    src="https://cdn-icons-png.flaticon.com/512/9414/9414323.png" 
                                    alt="Shop Illustration" 
                                    className="w-20 h-20 object-contain drop-shadow-md"
                                />
                            </div>

                            {/* Partner Info (Right Side) */}
                            <div className="flex-1 text-right">
                                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm mb-2 p-1.5">
                                    <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                                </div>
                                <h3 className="text-lg font-black text-gray-900 mb-1">{partner.name}</h3>
                                <p className="text-[10px] text-gray-600 font-medium leading-tight opacity-80 line-clamp-2">
                                    {partner.description}
                                </p>
                            </div>
                        </div>

                        {/* Rate Bar (Bottom of Card) */}
                        <div className="mt-4 bg-white/90 backdrop-blur-sm rounded-xl p-3 flex justify-between items-center shadow-sm">
                             <div className="flex items-center gap-2">
                                 <span className="text-sm font-bold text-gray-800">{partner.rate} نقاط</span>
                             </div>
                             <ArrowLeftRight size={16} className="text-gray-400" />
                             <div className="flex items-center gap-2">
                                 <div className="w-5 h-5 rounded-full bg-[#6463C7] flex items-center justify-center text-white text-[10px]">
                                     {partner.id === 'nahdi' ? 'SR' : 'M'}
                                 </div>
                                 <span className="text-sm font-bold text-gray-800">1 {unit}</span>
                             </div>
                        </div>
                    </div>

                    {/* Input Section */}
                    <div>
                        <h3 className="text-right font-bold text-gray-900 mb-4 text-sm px-1">كم ودك تحول؟</h3>
                        
                        {/* Input Box */}
                        <div className="bg-white border-2 border-gray-100 rounded-2xl p-2 mb-6 flex items-center focus-within:border-[#6463C7] transition-colors relative shadow-sm">
                            <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 shrink-0">
                                <Coins size={20} />
                            </div>
                            <input 
                                type="number"
                                value={pointsAmount}
                                onChange={(e) => setPointsAmount(e.target.value)}
                                placeholder="0"
                                className="w-full h-12 text-right px-4 text-xl font-bold text-gray-900 outline-none bg-transparent placeholder:text-gray-300 dir-ltr"
                            />
                            {/* Clear button if value exists */}
                            {pointsAmount && (
                                <button onClick={() => setPointsAmount('')} className="p-2 text-gray-300 hover:text-gray-500">
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        {/* Quick Amounts Grid */}
                        <div className="grid grid-cols-3 gap-3">
                            {quickAmounts.map((amt) => (
                                <button 
                                    key={amt}
                                    onClick={() => setPointsAmount(amt.toString())}
                                    className="bg-white border border-gray-200 rounded-xl py-2.5 px-1 flex flex-col items-center justify-center gap-1 hover:border-[#6463C7] hover:bg-[#6463C7]/5 transition-all shadow-sm group active:scale-95"
                                >
                                    <div className="bg-[#6463C7]/10 w-6 h-6 rounded-full flex items-center justify-center text-[#6463C7] group-hover:bg-[#6463C7] group-hover:text-white transition-colors">
                                        <Coins size={12} />
                                    </div>
                                    <span className="text-[10px] font-bold text-gray-600 dir-ltr">{amt.toLocaleString()}</span>
                                </button>
                            ))}
                        </div>
                        
                        {/* Use All Balance Option */}
                        <div className="flex justify-end mt-3">
                            <button 
                                onClick={setMaxPoints}
                                className="text-xs font-bold text-[#6463C7] hover:underline"
                            >
                                استخدام كامل الرصيد ({MOCK_USER.walletBalance.toLocaleString()})
                            </button>
                        </div>
                    </div>

                </div>

                {/* Footer Action */}
                <div className="p-5 bg-white border-t border-gray-100 sticky bottom-0 z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] rounded-t-3xl">
                    {/* Result Row */}
                    <div className="bg-gray-50 rounded-xl p-3 flex justify-between items-center mb-4 border border-gray-100">
                        <span className="text-gray-500 font-bold text-xs">{pointsAmount || 0} نقطة تساوي</span>
                        <div className="flex items-baseline gap-1">
                            <span className="text-xl font-black text-[#6463C7] dir-ltr">{convertedValue}</span>
                            <span className="text-xs font-bold text-gray-400">{unit}</span>
                        </div>
                    </div>

                    <button 
                        onClick={handleTransfer}
                        disabled={!pointsAmount || isProcessing}
                        className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all active:scale-[0.98] ${
                            pointsAmount && !isProcessing
                            ? 'bg-[#6463C7] text-white hover:bg-[#5352a3] shadow-[#6463C7]/20'
                            : 'bg-gray-200 text-gray-400 cursor-not-allowed shadow-none'
                        }`}
                    >
                        {isProcessing ? (
                            <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mx-auto block"></span>
                        ) : (
                            'اللي بعده'
                        )}
                    </button>
                </div>
            </div>
        );
    }

    // --- PARTNERS LIST VIEW ---
    return (
        <div className="absolute inset-0 z-[220] bg-[#f8f9fb] flex flex-col animate-in slide-in-from-right duration-300 font-sans">
            {/* Header */}
            <div className="flex justify-between items-center px-6 pt-12 pb-4 bg-white shadow-sm z-10 sticky top-0">
                 <button onClick={onBack} className="p-2 -mr-2 text-gray-900 hover:bg-gray-50 rounded-full transition-colors">
                    <ArrowRight size={24} />
                 </button>
                 <h2 className="text-lg font-black text-gray-900">تحويل النقاط</h2>
                 <div className="w-8"></div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-6 pb-24">
               {/* Hero Section */}
               <div className="bg-[#6463C7] rounded-[2rem] p-6 text-white mb-8 relative overflow-hidden shadow-xl shadow-[#6463C7]/20">
                   <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                   <div className="relative z-10">
                       <h3 className="text-xl font-black mb-2">استبدل نقاطك الآن ✨</h3>
                       <p className="text-white/80 text-sm font-medium leading-relaxed max-w-[250px]">
                           حول نقاطك لأميال سفر أو رصيد مشتريات واستفد من شراكاتنا المميزة.
                       </p>
                       <div className="mt-4 flex items-center gap-2">
                           <div className="bg-white/20 backdrop-blur-md rounded-lg px-3 py-1.5 flex items-center gap-2 border border-white/20">
                               <Wallet size={14} className="text-white" />
                               <span className="text-xs font-bold dir-ltr">{MOCK_USER.walletBalance.toLocaleString()}</span>
                               <span className="text-[10px] font-medium opacity-80">نقطة متاحة</span>
                           </div>
                       </div>
                   </div>
               </div>

               <h3 className="font-bold text-gray-900 text-sm mb-4 px-1">شركاء النجاح</h3>

               <div className="space-y-4">
                   {TRANSFER_PARTNERS.map((partner) => (
                       <div 
                           key={partner.id} 
                           onClick={() => handlePartnerSelect(partner.id)}
                           className="bg-white rounded-[1.8rem] p-5 border border-gray-100 shadow-sm hover:shadow-lg transition-all cursor-pointer active:scale-[0.98] group relative overflow-hidden"
                       >
                           {/* Gradient Border Effect on Hover */}
                           <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border-2 rounded-[1.8rem] border-${partner.color.split(' ')[0].replace('bg-', '')}`}></div>

                           <div className="flex items-center gap-4 relative z-10">
                               {/* Logo Container - Enhanced Visibility */}
                               <div className="w-20 h-20 rounded-2xl bg-white border border-gray-100 p-2 flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform duration-300 relative z-10">
                                   <img src={partner.logo} alt={partner.name} className="w-full h-full object-contain" />
                               </div>
                               
                               <div className="flex-1 min-w-0">
                                   <div className="flex items-center gap-2 mb-1">
                                       <h3 className="font-black text-gray-900 text-base">{partner.name}</h3>
                                       {partner.badge && (
                                           <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full border ${partner.id === 'nasmiles' ? 'bg-purple-50 text-purple-600 border-purple-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                                               {partner.badge}
                                           </span>
                                       )}
                                   </div>
                                   <p className="text-xs text-gray-500 font-medium mb-2 line-clamp-1">{partner.description}</p>
                                   
                                   {/* Rate Pill */}
                                   <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-bold bg-gray-50 text-gray-600 group-hover:bg-gray-100 transition-colors`}>
                                       <TrendingUp size={12} className="text-gray-400" />
                                       <span>معدل التحويل: {partner.rate} نقطة = 1</span>
                                   </div>
                               </div>

                               <div className="text-gray-300 group-hover:text-[#6463C7] transition-colors bg-gray-50 rounded-full p-2 group-hover:bg-[#6463C7]/10">
                                   <ArrowLeftRight size={20} />
                               </div>
                           </div>
                       </div>
                   ))}
               </div>
            </div>
        </div>
    );
};
