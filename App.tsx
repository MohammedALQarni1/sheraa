
import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { BottomNav } from './components/BottomNav';
import { AdCard } from './components/AdCard';
import { RewardCard } from './components/RewardCard';
import { SearchOverlay } from './components/SearchOverlay';
import { LeaderboardOverlay } from './components/LeaderboardOverlay';
import { NotificationsOverlay } from './components/NotificationsOverlay';
import { CategoryOverlay } from './components/CategoryOverlay';
import { LocationOverlay } from './components/LocationOverlay';
import { FilterOverlay } from './components/FilterOverlay';
import { WalletOverlay } from './components/WalletOverlay';
import { ProfileOverlay } from './components/ProfileOverlay';
import { AdDetailsOverlay } from './components/AdDetailsOverlay';
import { OffersOverlay } from './components/OffersOverlay';
import { MessagesOverlay } from './components/MessagesOverlay'; 
import { ScannerOverlay } from './components/ScannerOverlay';
import { ShowQROverlay } from './components/ShowQROverlay';
import { PurchaseFlowOverlay, PurchaseStep } from './components/PurchaseFlowOverlay'; 
import { OfferDetailsOverlay } from './components/OfferDetailsOverlay';
import { AddAdOverlay } from './components/AddAdOverlay';
import { MyAdsOverlay } from './components/MyAdsOverlay';
import { StoreRegistrationOverlay } from './components/StoreRegistrationOverlay';
import { StoreManagementOverlay } from './components/StoreManagementOverlay'; // New Import
import { FEED_ITEMS, CATEGORIES, OFFER_ITEMS, NOTIFICATIONS as INITIAL_NOTIFICATIONS, MOCK_USER } from './constants';
import { AdItem, FeedItem, RewardItem, NotificationItem } from './types';
import { LayoutGrid, LayoutList, Search, Plus, ScanLine } from 'lucide-react';

export default function App() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [walletInitialView, setWalletInitialView] = useState<'main' | 'recharge'>('main');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isOffersOpen, setIsOffersOpen] = useState(false);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  
  // New States for Scanner, Purchase Flow and Action Menu
  const [isScannerOpen, setIsScannerOpen] = useState(false);
  const [isShowQROpen, setIsShowQROpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isAddAdOpen, setIsAddAdOpen] = useState(false);
  
  // Store Registration & Management State
  const [isStoreRegOpen, setIsStoreRegOpen] = useState(false);
  const [isStoreManagerOpen, setIsStoreManagerOpen] = useState(false); // New state for Manager
  const [userHasStore, setUserHasStore] = useState(false); // Track if user has a store
  const [storeData, setStoreData] = useState<any>(null); // Store data from registration

  // Ad Balances State
  const [vipAdsBalance, setVipAdsBalance] = useState(0);
  const [featuredAdsBalance, setFeaturedAdsBalance] = useState(0);

  // State for Editing Ad
  const [editingAd, setEditingAd] = useState<AdItem | null>(null);
  
  // Purchase Flow State
  const [isPurchaseFlowOpen, setIsPurchaseFlowOpen] = useState(false);
  const [purchaseStep, setPurchaseStep] = useState<PurchaseStep>('buyer_input');
  const [purchasePrice, setPurchasePrice] = useState<number>(0);
  
  // Current Buyer Data (For Seller Review Context)
  const [currentBuyer, setCurrentBuyer] = useState<{name: string, id: string}>({ name: 'مستخدم', id: '0000' });

  // Lifted Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const [selectedAd, setSelectedAd] = useState<AdItem | null>(null);
  const [selectedReward, setSelectedReward] = useState<RewardItem | null>(null);

  // View Mode State: 'list' is default
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Determine Active Tab for Bottom Nav
  const activeTab = useMemo(() => {
      if (isProfileOpen) return 'profile';
      if (isMessagesOpen) return 'messages';
      if (isOffersOpen) return 'offers';
      return 'home';
  }, [isProfileOpen, isMessagesOpen, isOffersOpen]);

  // Filter & Arrange Feed Items Logic (Strict 1 VIP, 1 Featured, Rest Regular)
  const filteredFeed = useMemo(() => {
    // 1. Filter out ads without images first to satisfy "not without images" requirement
    const allAds = FEED_ITEMS.filter(item => item.type === 'ad' && item.image && item.image.trim() !== '') as AdItem[];
    const allRewards = [...FEED_ITEMS.filter(item => item.type === 'reward'), ...OFFER_ITEMS] as RewardItem[];

    // 2. Filter by Category & City
    let processedAds = allAds;
    if (selectedCategory) {
        processedAds = processedAds.filter(item => item.category === selectedCategory);
    }
    if (selectedCity) {
        processedAds = processedAds.filter(item => item.location === selectedCity);
    }

    // 3. Separate into Buckets
    const vipBucket = processedAds.filter(ad => ad.isVIP);
    const featuredBucket = processedAds.filter(ad => ad.isFeatured && !ad.isVIP);
    const regularBucket = processedAds.filter(ad => !ad.isVIP && !ad.isFeatured);

    // 4. Construct the Feed
    const finalFeed: FeedItem[] = [];

    // Slot 1: Exactly One VIP Ad (if exists)
    if (vipBucket.length > 0) {
        finalFeed.push(vipBucket[0]);
    }

    // Slot 2: Exactly One Featured Ad (if exists)
    if (featuredBucket.length > 0) {
        finalFeed.push(featuredBucket[0]);
    }

    // Slot 3+: Remaining Ads treated as Regular
    // We visually demote excess VIP/Featured ads to "Regular" style by stripping their flags
    const overflowVIP = vipBucket.slice(1).map(ad => ({ ...ad, isVIP: false, isFeatured: false }));
    const overflowFeatured = featuredBucket.slice(1).map(ad => ({ ...ad, isFeatured: false }));

    const remainingAds = [
        ...overflowVIP,
        ...overflowFeatured,
        ...regularBucket
    ];

    // 5. Inject Rewards into the remaining list
    remainingAds.forEach((ad, index) => {
        finalFeed.push(ad);
        // Inject reward every 6 items
        if ((index + 1) % 6 === 0 && allRewards.length > 0) {
            const rewardIndex = (Math.floor((index + 1) / 6) - 1) % allRewards.length;
            finalFeed.push(allRewards[rewardIndex]);
        }
    });

    return finalFeed;
  }, [selectedCategory, selectedCity]);

  // Helper to get names for the Filter Overlay UI
  const selectedCategoryName = selectedCategory 
    ? CATEGORIES.find(c => c.id === selectedCategory)?.name 
    : undefined;

  const handleActionMenuToggle = () => {
      setIsActionMenuOpen(prev => !prev);
  };

  const handleScanOpen = () => {
      setIsActionMenuOpen(false);
      setIsScannerOpen(true);
  };

  const handleAddAd = () => {
      setIsActionMenuOpen(false);
      setEditingAd(null);
      setIsAddAdOpen(true);
  };

  const handleEditAd = (ad: AdItem) => {
      setEditingAd(ad);
      setIsAddAdOpen(true);
  };

  const handleQRRequestSent = () => {
      const newNotification: NotificationItem = {
          id: `qr_${Date.now()}`,
          type: 'system',
          title: 'عرض QR 📱',
          body: 'وصلك طلب إظهار الكود. اضغط هنا لعرض الـ QR الخاص بك للمشتري لإتمام العملية.',
          time: 'الآن',
          isRead: false,
          targetId: 'qr_display'
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const handlePromoteSuccess = (adTitle: string, plan: string) => {
      const planName = plan === 'vip' ? 'VIP' : 'مميز';
      const newNotification: NotificationItem = {
          id: `promote_${Date.now()}`,
          type: 'ad',
          title: 'تم ترقية إعلانك 🚀',
          body: `تم ترقية إعلانك "${adTitle}" إلى باقة ${planName} بنجاح. نتمنى لك بيعة سريعة!`,
          time: 'الآن',
          isRead: false,
          targetId: 'my_ads'
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const handleSubscriptionSuccess = (plan: string, points: number, vipCount: number, featuredCount: number) => {
      MOCK_USER.walletBalance += points;
      setVipAdsBalance(prev => prev + vipCount);
      setFeaturedAdsBalance(prev => prev + featuredCount);

      const planName = plan === 'yearly' ? 'السنوي' : 'الشهري';
      const newNotification: NotificationItem = {
          id: `sub_${Date.now()}`,
          type: 'transaction',
          title: 'ترقية الحساب بنجاح 👑',
          body: `تم تفعيل باقة البائع المميز (${planName}). رصيدك الآن: ${vipCount} إعلانات VIP و ${featuredCount} إعلانات مميزة.`,
          time: 'الآن',
          isRead: false,
          amount: points,
          targetId: 'wallet'
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  const handleConsumeBalance = (type: 'vip' | 'featured') => {
      if (type === 'vip') {
          setVipAdsBalance(prev => Math.max(0, prev - 1));
      } else {
          setFeaturedAdsBalance(prev => Math.max(0, prev - 1));
      }
  };

  // --- Store Logic ---
  const handleStoreRegistrationSuccess = (data: any) => {
      setIsStoreRegOpen(false);
      setUserHasStore(true); // User now has a store
      setStoreData(data); // Save store details
      
      // Notify
      const newNotification: NotificationItem = {
          id: `store_${Date.now()}`,
          type: 'system',
          title: 'تم تفعيل متجرك! 🏪',
          body: `تمت الموافقة على متجر "${data.storeName}". يمكنك الآن إدارة عروضك ومنتجاتك من خلال لوحة تحكم المتجر.`,
          time: 'الآن',
          isRead: false,
          targetId: 'store_manager'
      };
      setNotifications(prev => [newNotification, ...prev]);
  };

  // --- Purchase Flow Logic ---
  const handleScanSuccess = () => {
      setIsScannerOpen(false);
      setPurchaseStep('buyer_input');
      setIsPurchaseFlowOpen(true);
  };

  const handleBuyerSendRequest = (price: number) => {
      setPurchasePrice(price);
      setIsPurchaseFlowOpen(false);
      
      const reqId = `req_${Date.now()}`;
      const newNotification: NotificationItem = {
          id: reqId,
          type: 'transaction',
          title: 'طلب شراء جديد 💰',
          body: `وصلك طلب شراء بقيمة ${price} ريال من فيصل العتيبي. اضغط لإتمام عملية البيع ودفع العمولة.`,
          time: 'الآن',
          isRead: false,
          targetId: `purchase_request:${price}`
      };
      setNotifications(prev => [newNotification, ...prev]);
      
      alert('تم إرسال طلب الشراء للبائع');
  };

  const handleSellerPayCommission = (commission: number) => {
      setPurchaseStep('success');
      MOCK_USER.walletBalance += 200;
      
      setNotifications(prev => [
          {
              id: `suc_${Date.now()}`,
              type: 'transaction',
              title: 'تمت العملية بنجاح 🎉',
              body: 'تم توثيق البيع وإضافة 200 نقطة ولاء إلى رصيدك.',
              time: 'الآن',
              isRead: false,
              amount: 200,
              targetId: 'wallet'
          },
          ...prev
      ]);
  };

  const handleNotificationPurchaseRequest = (priceStr: string) => {
      const price = parseFloat(priceStr);
      setPurchasePrice(price);
      setCurrentBuyer({ name: 'فيصل العتيبي', id: '88231' });
      setPurchaseStep('seller_review');
      setIsPurchaseFlowOpen(true);
  };

  const handleRejectRequest = () => {
      setIsPurchaseFlowOpen(false);
      alert("تم رفض الطلب وارسال اشعار للمشتري.");
  };

  const resetNavigation = () => {
      setIsProfileOpen(false);
      setIsMessagesOpen(false);
      setIsOffersOpen(false);
      setIsLeaderboardOpen(false);
      setIsNotificationsOpen(false);
      setSelectedAd(null);
      setSelectedReward(null);
  };

  const handleGoHome = () => {
      resetNavigation();
  };

  const handleGoProfile = () => {
      resetNavigation();
      setIsProfileOpen(true);
  };

  const handleGoMessages = () => {
      resetNavigation();
      setIsMessagesOpen(true);
  };

  const handleGoOffers = () => {
      resetNavigation();
      setIsOffersOpen(true);
  };

  const handleOpenWallet = (view: 'main' | 'recharge' = 'main') => {
      setWalletInitialView(view);
      setIsWalletOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#f3f4f6] flex justify-center items-start sm:items-center">
      
      <div className="w-full max-w-md h-[100dvh] sm:h-[844px] bg-gray-50 relative shadow-2xl overflow-hidden flex flex-col sm:rounded-[2.5rem] sm:border-[8px] sm:border-white">
        
        <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
        <LeaderboardOverlay isOpen={isLeaderboardOpen} onClose={() => setIsLeaderboardOpen(false)} />
        
        <NotificationsOverlay 
            isOpen={isNotificationsOpen} 
            onClose={() => setIsNotificationsOpen(false)}
            notifications={notifications}
            onScanClick={() => {
                setIsNotificationsOpen(false);
                setTimeout(() => setIsScannerOpen(true), 300);
            }}
            onShowQRClick={() => {
                setIsNotificationsOpen(false);
                setTimeout(() => setIsShowQROpen(true), 300);
            }}
            onPurchaseRequestClick={(price) => {
                setIsNotificationsOpen(false);
                setTimeout(() => handleNotificationPurchaseRequest(price), 300);
            }}
        />
        
        <WalletOverlay 
            isOpen={isWalletOpen} 
            onClose={() => setIsWalletOpen(false)} 
            initialView={walletInitialView}
        />
        
        <ScannerOverlay 
            isOpen={isScannerOpen} 
            onClose={() => setIsScannerOpen(false)} 
            onScanSuccess={handleScanSuccess}
        />

        <ShowQROverlay isOpen={isShowQROpen} onClose={() => setIsShowQROpen(false)} />

        <PurchaseFlowOverlay 
            isOpen={isPurchaseFlowOpen}
            onClose={() => setIsPurchaseFlowOpen(false)}
            step={purchaseStep}
            initialPrice={purchasePrice}
            buyerName={currentBuyer.name}
            buyerId={currentBuyer.id}
            onSendRequest={handleBuyerSendRequest}
            onPayCommission={handleSellerPayCommission}
            onReject={handleRejectRequest}
        />

        {/* Store Registration Overlay */}
        <StoreRegistrationOverlay 
            isOpen={isStoreRegOpen}
            onClose={() => setIsStoreRegOpen(false)}
            onRegistrationSuccess={handleStoreRegistrationSuccess} // Passed new handler
        />

        {/* Store Management Dashboard */}
        <StoreManagementOverlay 
            isOpen={isStoreManagerOpen}
            onClose={() => setIsStoreManagerOpen(false)}
            storeData={storeData}
            onHomeClick={handleGoHome}
            onOffersClick={handleGoOffers}
            onMessagesClick={handleGoMessages}
            onProfileClick={handleGoProfile}
            onScanClick={handleActionMenuToggle}
        />

        <AddAdOverlay 
            isOpen={isAddAdOpen} 
            onClose={() => {
                setIsAddAdOpen(false);
                setEditingAd(null);
            }} 
            initialAd={editingAd}
            onPublish={(newAd) => {
                setIsAddAdOpen(false);
                setEditingAd(null);
                if (!editingAd) {
                    setTimeout(() => setSelectedAd(newAd), 300);
                    const qrNotification: NotificationItem = {
                        id: `sys_qr_${Date.now()}`,
                        type: 'system',
                        title: 'تذكير: امسح كود QR 📷',
                        body: 'لقد قمت بنشر إعلان جديد على منصة شراء. لا تنسَ عند إتمام البيع مسح رمز QR من المشتري لتوثيق الصفقة وكسب نقاط الولاء فوراً.',
                        time: 'الآن',
                        isRead: false,
                        targetId: 'qr_scanner'
                    };
                    setNotifications(prev => [qrNotification, ...prev]);
                } else {
                    setTimeout(() => setSelectedAd(newAd), 300); 
                }
            }}
        />

        <ProfileOverlay 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            onWalletClick={() => {
                setIsProfileOpen(false);
                setTimeout(() => handleOpenWallet('main'), 300);
            }}
            onHomeClick={handleGoHome}
            onMessagesClick={handleGoMessages}
            onOffersClick={handleGoOffers}
            onScanClick={handleActionMenuToggle}
            onAdClick={(ad) => setSelectedAd(ad)}
            onEditAd={handleEditAd}
            onPromoteSuccess={handlePromoteSuccess}
            onOfferClick={(offer) => setSelectedReward(offer)}
            onSubscriptionSuccess={handleSubscriptionSuccess}
            vipAdsBalance={vipAdsBalance}
            featuredAdsBalance={featuredAdsBalance}
            onConsumeBalance={handleConsumeBalance}
            onOpenStoreRegistration={() => setIsStoreRegOpen(true)}
            
            // New Props for Store Flow
            hasStore={userHasStore}
            onOpenStoreManager={() => setIsStoreManagerOpen(true)}
        />
        
        <MessagesOverlay 
            isOpen={isMessagesOpen}
            onClose={() => setIsMessagesOpen(false)}
            onHomeClick={handleGoHome}
            onProfileClick={handleGoProfile}
            onOffersClick={handleGoOffers}
            onScanClick={handleActionMenuToggle}
            onSendQRRequest={handleQRRequestSent}
        />

        <OffersOverlay 
            isOpen={isOffersOpen} 
            onClose={() => setIsOffersOpen(false)} 
            onProfileClick={handleGoProfile}
            onMessagesClick={handleGoMessages}
            onHomeClick={handleGoHome}
            onScanClick={handleScanOpen}
        />

        {selectedAd && (
            <AdDetailsOverlay 
                ad={selectedAd} 
                onClose={() => setSelectedAd(null)} 
                onHomeClick={handleGoHome}
                onOffersClick={handleGoOffers}
                onMessagesClick={handleGoMessages}
                onProfileClick={handleGoProfile}
                onScanClick={handleActionMenuToggle}
            />
        )}

        {selectedReward && (
            <OfferDetailsOverlay 
                offer={selectedReward} 
                onClose={() => setSelectedReward(null)} 
                onHomeClick={handleGoHome}
                onOffersClick={handleGoOffers}
                onMessagesClick={handleGoMessages}
                onProfileClick={handleGoProfile}
                onScanClick={handleScanOpen}
                onRechargeClick={() => handleOpenWallet('recharge')}
            />
        )}
        
        <CategoryOverlay 
            isOpen={isCategoryOpen} 
            onClose={() => setIsCategoryOpen(false)}
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
        />

        <LocationOverlay 
            isOpen={isLocationOpen} 
            onClose={() => setIsLocationOpen(false)}
            selectedCity={selectedCity}
            onSelectCity={setSelectedCity}
        />

        <FilterOverlay
            isOpen={isFilterOpen}
            onClose={() => setIsFilterOpen(false)}
            selectedCategoryName={selectedCategoryName}
            selectedCityName={selectedCity || undefined}
            onOpenCategory={() => setIsCategoryOpen(true)}
            onOpenCity={() => setIsLocationOpen(true)}
        />

        {isActionMenuOpen && (
            <div className="absolute inset-0 z-[60] bg-black/20 backdrop-blur-[1px] animate-in fade-in" onClick={() => setIsActionMenuOpen(false)}>
                <div className="absolute bottom-[90px] left-0 right-0 flex items-end justify-center gap-8 pointer-events-none">
                
                <div className="flex flex-col items-center gap-2 pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300 delay-75">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleAddAd(); }}
                        className="w-14 h-14 bg-white rounded-full text-[#665FCE] shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <Plus size={28} />
                    </button>
                    <span className="text-white font-bold text-xs shadow-black/50 drop-shadow-md">اضافة اعلان</span>
                </div>
                
                <div className="flex flex-col items-center gap-2 pointer-events-auto animate-in slide-in-from-bottom-8 fade-in duration-300">
                    <button 
                        onClick={(e) => { e.stopPropagation(); handleScanOpen(); }}
                        className="w-14 h-14 bg-white rounded-full text-[#665FCE] shadow-xl flex items-center justify-center hover:bg-gray-50 active:scale-95 transition-all"
                    >
                        <ScanLine size={24} />
                    </button>
                    <span className="text-white font-bold text-xs shadow-black/50 drop-shadow-md">مسح الكود</span>
                </div>

                </div>
            </div>
        )}

        <div className="z-20 bg-[#ede9fe]">
            <Header 
                onSearchClick={() => setIsSearchOpen(true)} 
                onLeaderboardClick={() => setIsLeaderboardOpen(true)}
                onNotificationsClick={() => setIsNotificationsOpen(true)}
                onWalletClick={() => handleOpenWallet('main')}
                onProfileClick={() => setIsProfileOpen(true)}
                notifications={notifications}
            />
        </div>
        
        <div className="flex-1 overflow-y-auto no-scrollbar bg-gray-50 pb-24">
            <div className="sticky top-0 z-10">
                <FilterBar 
                    selectedCategoryId={selectedCategory} 
                    onCategoryClick={() => setIsCategoryOpen(true)}
                    selectedCity={selectedCity}
                    onLocationClick={() => setIsLocationOpen(true)}
                    onFilterClick={() => setIsFilterOpen(true)}
                />
            </div>

            <div className="px-5 py-4 flex justify-between items-center bg-gray-50/90 backdrop-blur-sm z-0">
                <span className="text-sm font-semibold text-gray-600">
                    {filteredFeed.length > 0 ? `نتائج البحث ${filteredFeed.length}` : 'الاحدث'}
                </span>
                
                <button 
                    onClick={() => setViewMode(prev => prev === 'list' ? 'grid' : 'list')}
                    className="flex items-center gap-2 text-gray-500 bg-white p-2 rounded-xl shadow-sm border border-gray-100 hover:text-purple-600 hover:border-purple-200 transition-all active:scale-95"
                    title={viewMode === 'list' ? "عرض صور كبيرة" : "عرض قوائم"}
                >
                    {viewMode === 'list' ? (
                        <>
                            <span className="text-[10px] font-bold hidden xs:block">صور كبيرة</span>
                            <LayoutGrid size={18} strokeWidth={2} />
                        </>
                    ) : (
                        <>
                            <span className="text-[10px] font-bold hidden xs:block">قوائم</span>
                            <LayoutList size={18} strokeWidth={2} />
                        </>
                    )}
                </button>
            </div>

            <main className={`px-4 min-h-[300px] pb-4 ${viewMode === 'grid' ? 'grid grid-cols-2 gap-3 auto-rows-min' : 'flex flex-col gap-3'}`}>
                {filteredFeed.length > 0 ? (
                    filteredFeed.map((item, index) => {
                        const key = `${item.id}-${index}`;
                        if (item.type === 'reward') {
                           return (
                               <div key={key} className={viewMode === 'grid' ? 'col-span-2' : ''}>
                                   <RewardCard item={item} onClick={(i) => setSelectedReward(i)} />
                               </div>
                           );
                        }
                        return (
                            <div key={key} className={viewMode === 'grid' && item.isVIP ? 'col-span-2' : 'col-span-1'}>
                                <AdCard item={item} onClick={(i) => setSelectedAd(i)} viewMode={viewMode} />
                            </div>
                        );
                    })
                ) : (
                    <div className="flex flex-col items-center justify-center pt-20 text-gray-400 col-span-2">
                         <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <Search size={24} className="opacity-40" />
                         </div>
                         <p className="font-medium">لا توجد نتائج مطابقة للفلتر</p>
                         <button 
                            onClick={() => { setSelectedCategory(null); setSelectedCity(null); }}
                            className="mt-4 text-purple-600 text-sm font-bold hover:underline"
                         >
                            مسح الفلاتر
                         </button>
                    </div>
                )}
            </main>
        </div>

        <BottomNav 
            onProfileClick={handleGoProfile}
            onOffersClick={handleGoOffers}
            onHomeClick={handleGoHome}
            onMessagesClick={handleGoMessages}
            onScanClick={handleActionMenuToggle}
            activeTab={activeTab}
        />
      </div>

    </div>
  );
}
