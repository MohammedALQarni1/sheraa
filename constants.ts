
import { FeedItem, User, NotificationItem, Category, Transaction, RewardItem, AdItem } from './types';
import { Car, Smartphone, Laptop, Tv, Camera, Shirt, Armchair, Briefcase, Wrench, Utensils, Users, Store, LayoutGrid, ArrowDownLeft, ArrowUpRight, Repeat, Tag, Mail, Dumbbell, AlertCircle } from 'lucide-react';

export const MOCK_USER = {
  name: "محمد احمد",
  avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  walletBalance: 2450,
  notifications: 4,
  isGuest: false,
  status: 'active' as 'active' | 'suspended',
  role: 'user' as const
};

// ... (Notifications and News items kept same as they are contextually correct) ...
export const NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'req_live_1',
    type: 'transaction',
    title: 'طلب شراء جديد 💰',
    body: 'وصلك طلب شراء بقيمة 4,500 ريال لإعلانك "ايفون 14 برو". اضغط هنا لمراجعة الطلب وإتمام البيع.',
    time: 'الآن',
    isRead: false,
    targetId: 'purchase_request:4500'
  },
  {
    id: 'sale_success_1',
    type: 'transaction',
    title: 'تم بيع سلعتك بنجاح 🎉',
    body: 'مبروك! تم توثيق عملية البيع ودفع العمولة. تم إضافة 200 نقطة ولاء إلى رصيدك كمكافأة.',
    time: 'منذ 15 دقيقة',
    isRead: false,
    amount: 200,
    targetId: 'wallet'
  },
  {
    id: 'qr_reminder_1',
    type: 'system',
    title: 'تذكير: امسح كود QR 📷',
    body: 'لضمان حقك وتوثيق الصفقة، لا تنس مسح رمز الاستجابة السريعة (QR) من المشتري عند التسليم.',
    time: 'منذ 30 دقيقة',
    isRead: false,
    targetId: 'qr_scanner'
  },
  {
    id: 'ad_approved_1',
    type: 'ad',
    title: 'تم نشر إعلانك ✅',
    body: 'إعلانك "تويوتا كامري 2022" تمت الموافقة عليه وهو يظهر الآن في نتائج البحث للجميع.',
    time: 'منذ ساعة',
    isRead: true,
    targetId: 'ad_gen_100'
  },
  {
    id: 'ad_expiring_1',
    type: 'ad',
    title: 'إعلانك يوشك على الانتهاء ⏳',
    body: 'مر 30 يوم على إعلانك "كنبة مجلس". هل ما زال المنتج متوفراً؟ قم بتحديث الإعلان لرفعه مجاناً.',
    time: 'منذ 5 ساعات',
    isRead: true,
    targetId: 'my_ads'
  },
  {
    id: 'ad_featured_1',
    type: 'ad',
    title: 'إعلانك الآن مميز! 🚀',
    body: 'تمت ترقية إعلانك بنجاح. سيظهر في أعلى القوائم لمدة 3 أيام لضمان وصول أسرع.',
    time: 'أمس',
    isRead: true,
    targetId: 'ad_feat_1'
  },
  {
    id: 'wallet_deposit_1',
    type: 'transaction',
    title: 'إيداع بنكي',
    body: 'تم شحن محفظتك بمبلغ 500 ريال بنجاح عبر Apple Pay.',
    time: 'أمس',
    isRead: true,
    targetId: 'wallet'
  },
  {
    id: 'points_expiry_1',
    type: 'system',
    title: 'نقاطك بتنتهي! ⏰',
    body: 'عندك 150 نقطة راح تنتهي صلاحيتها بنهاية الشهر. استبدلها الحين بكوبون قهوة أو خصم.',
    time: 'أمس',
    isRead: true,
    targetId: 'offers'
  },
  {
    id: 'commission_paid_1',
    type: 'transaction',
    title: 'سداد عمولة',
    body: 'تم خصم 45 ريال (عمولة موقع) لعملية بيع #9982. شكراً لصدقك وأمانتك.',
    time: 'منذ يومين',
    isRead: true,
    targetId: 'wallet'
  },
  {
    id: 'tier_upgrade_1',
    type: 'system',
    title: 'مبروك! صرت عضو ذهبي 🌟',
    body: 'رصيد نقاطك تجاوز 2000 نقطة. استمتع الآن بخصم 50% على عمولة الموقع ومميزات حصرية أخرى.',
    time: 'منذ يومين',
    isRead: true,
    targetId: 'profile'
  },
  {
    id: 'offer_new_1',
    type: 'offer',
    title: 'عرض خاص لك من هرفي 🍔',
    body: 'بناءً على مشترياتك الأخيرة، حصلت على خصم 20% على جميع الوجبات. صالح لمدة 24 ساعة.',
    time: 'منذ 3 أيام',
    isRead: true,
    targetId: 'offer_2'
  },
  {
    id: 'flash_sale_1',
    type: 'offer',
    title: 'تخفيضات نهاية الأسبوع 🔥',
    body: 'خصومات تصل إلى 70% على الإلكترونيات والجوالات لدى المتاجر المعتمدة. لا تفوت الفرصة!',
    time: 'منذ 4 أيام',
    isRead: true,
    targetId: 'category_electronics'
  },
  {
    id: 'security_login_1',
    type: 'system',
    title: 'تسجيل دخول جديد 🛡️',
    body: 'تم تسجيل الدخول لحسابك من جهاز iPhone 14 Pro Max في الرياض. إذا لم تكن أنت، يرجى تغيير كلمة المرور فوراً.',
    time: 'منذ أسبوع',
    isRead: true,
    targetId: 'settings'
  },
  {
    id: 'social_like_1',
    type: 'system',
    title: 'إعجاب جديد ❤️',
    body: 'أعجب 5 مستخدمين بإعلانك "ماكينة قهوة بريفيل".',
    time: 'منذ أسبوع',
    isRead: true,
    targetId: 'ad_gen_113'
  }
];

export const NEWS_ITEMS = [
  {
    id: 'news1',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', 
    title: 'ضاعف فرص بيعك مع الإعلان المميز',
    description: 'هل تريد بيع أغراضك بسرعة؟ استخدم ميزة الإعلان المميز الآن واحصل على 10 أضعاف المشاهدات. إعلاناتك ستظهر في أعلى القوائم دائماً لتصل للمشتري الجاد.',
    time: 'منذ ساعتين',
    bannerText: 'بع أغراضك أسرع 🚀'
  },
  {
    id: 'news2',
    image: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?auto=format&fit=crop&q=80&w=800', 
    title: 'نقاطك رجعت لك .. وأكثر!',
    description: 'مع برنامج الولاء المحدث، كل عملية شراء أو بيع ناجحة تكسبك نقاطاً فورية. استبدل نقاطك بقهوة مجانية، خصومات مطاعم، أو رصيد مشتريات داخل التطبيق.',
    time: 'منذ 5 ساعات',
    bannerText: 'مكافآت وتوفير 💰'
  },
  {
    id: 'news3',
    image: 'https://images.unsplash.com/photo-1472851294608-4155f2118c03?auto=format&fit=crop&q=80&w=800', 
    title: 'موسم التخفيضات الكبرى بدأ',
    description: 'تخفيضات حصرية تصل إلى 50% على الإلكترونيات والجوالات من المتاجر الموثقة. تصفح قسم العروض الآن واقتنص الفرصة قبل نفاذ الكمية.',
    time: 'منذ يوم',
    bannerText: 'عروض لا تفوت 🏷️'
  }
];

// ... (User Generation Code kept same) ...
const FIRST_NAMES = ["محمد", "أحمد", "فهد", "سعد", "خالد", "عبدالله", "سلطان", "فيصل", "تركي", "عمر", "علي", "ابراهيم", "ياسر", "نايف", "سلمان", "يوسف", "ماجد", "بندر"];
const LAST_NAMES = ["العتيبي", "القحطاني", "الشمري", "الدوسري", "العنزي", "الحربي", "الزهراني", "الشهري", "المالكي", "السبيعي", "المطيري", "الغامدي", "الخالدي", "السالم"];
const STORE_NAMES_1 = ["متجر", "عالم", "مركز", "مؤسسة", "شركة", "بوتيك", "معرض", "ركن"];
const STORE_NAMES_2 = ["التقنية", "الجوالات", "الأناقة", "المنزل", "السيارات", "العطور", "الهدايا", "الرياضة", "المستقبل", "النخبة", "التميز"];

const generateLeaderboardData = () => {
  const staticUsers: User[] = [
    { id: '1', name: 'فيصل العتيبي', avatar: 'https://i.pravatar.cc/150?u=a04258114e29026702d', role: 'store', reputation: 62400, trend: 'stable', stats: { deals: 1500, responseRate: 99, badges: ['crown'] } },
    { id: '2', name: 'معرض النخبة للسيارات', avatar: 'https://cdn-icons-png.flaticon.com/512/55/55283.png', role: 'store', reputation: 61500, trend: 'down', stats: { deals: 320, responseRate: 98, badges: ['verified'] } },
    { id: '3', name: 'سارة خالد', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026024d', role: 'user', reputation: 59900, trend: 'up', stats: { deals: 890, responseRate: 95, badges: [] } },
    { id: '4', name: 'مؤسسة البناء الحديث', avatar: 'https://cdn-icons-png.flaticon.com/512/1048/1048329.png', role: 'store', reputation: 32400, trend: 'down', stats: { deals: 450, responseRate: 90, badges: [] } },
    { id: '5', name: 'سوق الجملة', avatar: 'https://cdn-icons-png.flaticon.com/512/1261/1261163.png', role: 'store', reputation: 31400, trend: 'up', stats: { deals: 2100, responseRate: 92, badges: [] } },
    { id: '6', name: 'أحمد محمد', avatar: 'https://i.pravatar.cc/150?u=a048581f4e29026701d', role: 'user', reputation: 30400, trend: 'stable', stats: { deals: 300, responseRate: 88, badges: [] } },
    { id: '7', name: 'مركز الصيانة المعتمد', avatar: 'https://cdn-icons-png.flaticon.com/512/2942/2942544.png', role: 'store', reputation: 30200, trend: 'down', stats: { deals: 250, responseRate: 95, badges: [] } },
    { id: '8', name: 'تموينات العائلة', avatar: 'https://cdn-icons-png.flaticon.com/512/3081/3081840.png', role: 'store', reputation: 29000, trend: 'up', stats: { deals: 150, responseRate: 85, badges: [] } },
    { id: '9', name: 'عقارات المملكة', avatar: 'https://cdn-icons-png.flaticon.com/512/609/609803.png', role: 'store', reputation: 28500, trend: 'stable', stats: { deals: 400, responseRate: 94, badges: [] } },
    { id: '10', name: 'الوسيط المحترف', avatar: 'https://i.pravatar.cc/150?u=9', role: 'store', reputation: 12000, trend: 'up', stats: { deals: 100, responseRate: 90, badges: [] } },
  ];

  const generated: User[] = Array.from({ length: 90 }, (_, i) => {
    const id = (i + 11).toString();
    const isStore = Math.random() > 0.7;
    let name = "";
    let avatar = "";
    
    if (isStore) {
        if (Math.random() > 0.5) {
             const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
             const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
             name = `${first} ${last}`;
             avatar = `https://i.pravatar.cc/150?u=${id}_store_person`;
        } else {
             const prefix = STORE_NAMES_1[Math.floor(Math.random() * STORE_NAMES_1.length)];
             const suffix = STORE_NAMES_2[Math.floor(Math.random() * STORE_NAMES_2.length)];
             name = `${prefix} ${suffix} ${Math.floor(Math.random() * 99) + 1}`;
             const icons = ['3062634', '55283', '3531849', '1048329', '1261163', '2590525', '2942544', '3081840', '609803'];
             const iconId = icons[Math.floor(Math.random() * icons.length)];
             avatar = `https://cdn-icons-png.flaticon.com/512/${iconId.substring(0,4)}/${iconId}.png`;
        }
    } else {
        const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
        const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
        name = `${first} ${last}`;
        avatar = `https://i.pravatar.cc/150?u=${id}`;
    }

    const baseRep = 10000;
    const reputation = Math.floor(baseRep * Math.pow(0.96, i));

    return {
      id,
      name,
      avatar,
      role: isStore ? 'store' : 'user',
      reputation,
      trend: Math.random() > 0.6 ? 'up' : (Math.random() > 0.5 ? 'down' : 'stable'),
      stats: {
        deals: Math.floor(Math.random() * 200),
        responseRate: 70 + Math.floor(Math.random() * 30),
        badges: []
      }
    };
  });

  return [...staticUsers, ...generated];
};

export const LEADERBOARD_USERS: User[] = generateLeaderboardData();

export const CATEGORIES: Category[] = [
    { id: 'cars', name: 'سيارات ومركبات', icon: Car },
    { id: 'mobiles', name: 'جوالات وتابلت', icon: Smartphone },
    { id: 'computers', name: 'كمبيوتر وملحقاته', icon: Laptop },
    { id: 'electronics', name: 'اجهزة والكترونيات', icon: Tv },
    { id: 'cameras', name: 'انظمة الحماية و الكاميرات', icon: Camera },
    { id: 'fashion', name: 'الموضة والجمال', icon: Shirt },
    { id: 'furniture', name: 'أثاث وديكور', icon: Armchair },
    { id: 'e-services', name: 'خدمات ألكترونية', icon: Briefcase },
    { id: 'general-services', name: 'خدمات عامة', icon: Users },
    { id: 'maintenance', name: 'خدمات صيانة منزلية', icon: Wrench },
    { id: 'food', name: 'طعام وغذاء', icon: Utensils },
    { id: 'families', name: 'اسر منتجة', icon: Store },
];

export const CITIES = [
  "الرياض", "جدة", "مكة", "المدينة المنورة", "الدمام", "الاحساء", 
  "الطائف", "خميس مشيط", "بريدة", "الخبر", "تبوك", "حائل"
];

// --- REALISTIC OFFER ITEMS (Offers, Codes, Vouchers) ---
export const OFFER_ITEMS: RewardItem[] = [
    // --- OFFERS (Physical / Services) ---
    {
        id: 'offer_1',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1562967960-f0d7e488107c?auto=format&fit=crop&q=80&w=800', 
        title: 'وجبة دجاج مسحب 7 قطع',
        brandName: 'Al Baik',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/8/8c/Albaik_logo.svg/1200px-Albaik_logo.svg.png',
        discountPercentage: 100, // Free Meal
        pointsCost: 450,
        category: 'restaurants', // Offer Category
        programName: 'وجبات',
        rating: 5.0,
        reviewsCount: 15200,
        expiryDate: 'متاح دائماً'
    },
    {
        id: 'offer_2',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1594212699903-ec8a3eca50f5?auto=format&fit=crop&q=80&w=800', 
        title: 'برجر دجاج مجاناً',
        brandName: 'Herfy',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/ar/d/d6/Herfy_Logo.jpg',
        discountPercentage: 100,
        pointsCost: 300,
        category: 'restaurants',
        programName: 'ساندوتشات',
        rating: 4.5,
        reviewsCount: 3200,
        expiryDate: '15 ابريل'
    },
    {
        id: 'offer_3',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&q=80&w=800', 
        title: 'عرض اشتر 1 واحصل على 1',
        brandName: 'Domino\'s',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3e/Domino%27s_pizza_logo.svg/1200px-Domino%27s_pizza_logo.svg.png',
        discountPercentage: 50,
        pointsCost: 150,
        category: 'restaurants',
        programName: 'عشاء',
        rating: 4.6,
        reviewsCount: 4100,
        expiryDate: '18 مارس'
    },
    {
        id: 'offer_4',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&q=80&w=800', 
        title: 'تذكرة سينما ستاندرد',
        brandName: 'VOX Cinemas',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/VOX_Cinemas_Logo.png/800px-VOX_Cinemas_Logo.png',
        discountPercentage: 100, // Full ticket
        pointsCost: 800,
        category: 'entertainment',
        programName: 'ترفيه',
        rating: 4.7,
        reviewsCount: 3100,
        expiryDate: '30 ابريل'
    },
    {
        id: 'offer_5',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800', 
        title: 'دخول يومي للنادي',
        brandName: 'Fitness Time',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/ar/d/d4/Fitness_Time.png',
        discountPercentage: 100,
        pointsCost: 500,
        category: 'health', // Changed to match Health category
        programName: 'لياقة',
        rating: 4.9,
        reviewsCount: 2200,
        expiryDate: '12 يونيو'
    },
    {
        id: 'offer_6',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=800', 
        title: 'تغيير زيت مجاني',
        brandName: 'Petromin Express',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/en/2/28/Petromin_Corporation_logo.png', // Placeholder
        discountPercentage: 100,
        pointsCost: 1200,
        category: 'automotive',
        programName: 'سيارات',
        rating: 4.8,
        reviewsCount: 1500,
        expiryDate: '01 مايو'
    },

    // --- DISCOUNT CODES (Codes for Online/Apps) ---
    {
        id: 'code_1',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=800', 
        title: 'كود خصم 20% على الأزياء',
        brandName: 'Namshi',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/8/8f/Namshi_Logo.jpg',
        discountPercentage: 20,
        pointsCost: 120,
        category: 'fashion',
        programName: 'أزياء',
        rating: 4.5,
        reviewsCount: 3800,
        expiryDate: '01 ابريل'
    },
    {
        id: 'code_2',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?auto=format&fit=crop&q=80&w=800', 
        title: 'كود خصم 15% شامل',
        brandName: 'Noon',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/f/fc/Noon-logo-en.png',
        discountPercentage: 15,
        pointsCost: 100,
        category: 'general', // General Shopping
        programName: 'تسوق',
        rating: 4.6,
        reviewsCount: 4500,
        expiryDate: '1 شهر'
    },
    {
        id: 'code_3',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?auto=format&fit=crop&q=80&w=800', 
        title: 'توصيل مجاني لطلبك',
        brandName: 'HungerStation',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/en/thumb/5/53/HungerStation.jpg/220px-HungerStation.jpg',
        discountPercentage: 100, // 100% off delivery fee
        pointsCost: 150,
        category: 'apps', // Delivery Apps
        programName: 'توصيل',
        rating: 4.8,
        reviewsCount: 6700,
        expiryDate: '15 مايو'
    },
    {
        id: 'code_4',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdd403cc2?auto=format&fit=crop&q=80&w=800', 
        title: 'كود خصم 25% منتجات تجميل',
        brandName: 'Nice One',
        brandLogo: 'https://play-lh.googleusercontent.com/I7yGjG-ZqC_WqWqXj_M_x_q_q_q_q_q_q_q_q_q_q_q_q_q_q', // Placeholder
        discountPercentage: 25,
        pointsCost: 200,
        category: 'beauty',
        programName: 'تجميل',
        rating: 4.7,
        reviewsCount: 2100,
        expiryDate: '20 يونيو'
    },
    {
        id: 'code_5',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?auto=format&fit=crop&q=80&w=800', 
        title: 'كود خصم 10% إضافي',
        brandName: 'IKEA',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Ikea_logo.svg/2560px-Ikea_logo.svg.png',
        discountPercentage: 10,
        pointsCost: 250,
        category: 'home',
        programName: 'أثاث',
        rating: 4.9,
        reviewsCount: 5000,
        expiryDate: '30 ديسمبر'
    },

    // --- VOUCHERS (Cash Value) ---
    {
        id: 'voucher_1',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1556742049-0cfed4f7a07d?auto=format&fit=crop&q=80&w=800', 
        title: 'قسيمة شرائية 50 ريال',
        brandName: 'Jarir Bookstore',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Jarir_Bookstore_logo.svg/2560px-Jarir_Bookstore_logo.svg.png',
        discountPercentage: 0, // It's a value, not a percentage
        pointsCost: 1500,
        category: 'electronics', // Or Shopping
        programName: 'مكتبات',
        rating: 4.9,
        reviewsCount: 8900,
        expiryDate: '30 يونيو'
    },
    {
        id: 'voucher_2',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800', 
        title: 'قسيمة شرائية 100 ريال',
        brandName: 'Panda',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Panda_Retail_Company_Logo.svg/1200px-Panda_Retail_Company_Logo.svg.png', // Placeholder
        discountPercentage: 0,
        pointsCost: 3000,
        category: 'groceries',
        programName: 'سوبرماركت',
        rating: 4.7,
        reviewsCount: 4200,
        expiryDate: '1 سنة'
    },
    {
        id: 'voucher_3',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800', 
        title: 'بطاقة ستور 20 دولار',
        brandName: 'PlayStation',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/00/PlayStation_logo.svg/2560px-PlayStation_logo.svg.png',
        discountPercentage: 0,
        pointsCost: 2500,
        category: 'electronics', // Or Gaming
        programName: 'ألعاب',
        rating: 4.9,
        reviewsCount: 12000,
        expiryDate: 'فوري'
    },
    {
        id: 'voucher_4',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1522335789203-abd6538d8ad3?auto=format&fit=crop&q=80&w=800', 
        title: 'قسيمة بقيمة 100 ريال',
        brandName: 'Sephora',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/13/Sephora_logo.svg/2560px-Sephora_logo.svg.png',
        discountPercentage: 0,
        pointsCost: 2800,
        category: 'beauty',
        programName: 'تجميل',
        rating: 4.8,
        reviewsCount: 5600,
        expiryDate: '20 مايو'
    },
    {
        id: 'voucher_5',
        type: 'reward',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800', 
        title: 'بطاقة هدايا 50 ريال',
        brandName: 'Amazon SA',
        brandLogo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/2560px-Amazon_logo.svg.png',
        discountPercentage: 0,
        pointsCost: 1600,
        category: 'general',
        programName: 'تسوق',
        rating: 4.8,
        reviewsCount: 9000,
        expiryDate: '10 سنوات'
    }
];

// ... (Rest of the file including Wallet Transactions, Ads Gen, etc.) ...
export const WALLET_TRANSACTIONS: Transaction[] = [
    {
        id: '1',
        type: 'subscription_bonus',
        title: 'اشتراك باقة البائع المميز',
        subtitle: 'الباقة السنوية',
        amount: 2000,
        currency: 'نقطة',
        date: '2025-11-20', // Today
        displayDate: 'اليوم',
        time: '10:30 PM',
        iconName: 'Crown',
        operationId: 'sub_992',
        status: 'completed'
    },
    {
        id: '2',
        type: 'buy_reward',
        title: 'شراء قسيمة قهوة',
        subtitle: 'عنوان القهوة',
        amount: -150,
        currency: 'نقطة',
        date: '2025-11-20',
        displayDate: 'اليوم',
        time: '09:00 AM',
        iconName: 'Coffee',
        operationId: 'cpn_112',
        status: 'completed'
    },
    {
        id: '3',
        type: 'commission_reward',
        title: 'مكافأة دفع عمولة',
        subtitle: 'ايفون 14 برو',
        amount: 200,
        currency: 'نقطة',
        date: '2025-11-19', // Yesterday
        displayDate: 'أمس',
        time: '02:30 PM',
        iconName: 'Briefcase',
        operationId: 'cms_773',
        status: 'completed'
    },
    {
        id: '4',
        type: 'ad_promo_bonus',
        title: 'مكافأة ترقية إعلان',
        subtitle: 'باقة VIP - كامري 2022',
        amount: 50,
        currency: 'نقطة',
        date: '2025-11-19',
        displayDate: 'أمس',
        time: '11:15 AM',
        iconName: 'Rocket',
        operationId: 'bst_101',
        status: 'completed'
    },
    {
        id: '5',
        type: 'transfer_sent',
        title: 'تحويل نقاط',
        subtitle: 'إلى: فيصل العتيبي',
        amount: -500,
        currency: 'نقطة',
        date: '2025-11-18',
        displayDate: '18 نوفمبر 2025',
        time: '08:45 PM',
        iconName: 'ArrowRight',
        operationId: 'trf_442',
        status: 'completed'
    },
    {
        id: '6',
        type: 'expired',
        title: 'نقاط منتهية الصلاحية',
        subtitle: 'دورة النقاط الربع سنوية',
        amount: -95,
        currency: 'نقطة',
        date: '2025-11-15',
        displayDate: '15 نوفمبر 2025',
        time: '12:00 AM',
        iconName: 'AlertCircle',
        operationId: 'exp_001',
        status: 'completed',
        expiryDate: '2025-11-15'
    },
    {
        id: '7',
        type: 'sale_reward',
        title: 'توثيق عملية بيع',
        subtitle: 'مسح كود QR',
        amount: 150,
        currency: 'نقطة',
        date: '2025-11-12',
        displayDate: '12 نوفمبر 2025',
        time: '04:20 PM',
        iconName: 'ScanLine',
        operationId: 'sale_221',
        status: 'completed'
    },
    {
        id: '8',
        type: 'daily_reward',
        title: 'دخول يومي',
        subtitle: 'مكافأة الاستخدام المتواصل',
        amount: 10,
        currency: 'نقطة',
        date: '2025-11-10',
        displayDate: '10 نوفمبر 2025',
        time: '09:00 AM',
        iconName: 'Sun',
        operationId: 'dly_111',
        status: 'completed'
    },
    {
        id: '9',
        type: 'referral_bonus',
        title: 'دعوة صديق',
        subtitle: 'انضمام: سارة خالد',
        amount: 300,
        currency: 'نقطة',
        date: '2025-11-05',
        displayDate: '05 نوفمبر 2025',
        time: '06:00 PM',
        iconName: 'Users',
        operationId: 'ref_888',
        status: 'completed'
    }
];

// Templates for generating diverse ads
const AD_TEMPLATES: Record<string, { title: string, price: number, img: string }[]> = {
    'cars': [
        { title: 'تويوتا كامري 2023 قراندي نظيفة', price: 95000, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=800' },
        { title: 'هيونداي سوناتا 2021 سمارت', price: 68000, img: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?auto=format&fit=crop&q=80&w=800' },
        { title: 'فورد تورس 2022 تيتانيوم', price: 110000, img: 'https://images.unsplash.com/photo-1551830820-330a71b99659?auto=format&fit=crop&q=80&w=800' },
        { title: 'مرسيدس يخت S500 موديل 2019', price: 380000, img: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=800' },
        { title: 'لاندكروزر GXR 2022 ديزل', price: 290000, img: 'https://images.unsplash.com/photo-1594502184342-d4344e40d95c?auto=format&fit=crop&q=80&w=800' },
        { title: 'تويوتا هايلكس 2022 غمارتين دبل', price: 105000, img: 'https://images.unsplash.com/photo-1594502184342-d4344e40d95c?auto=format&fit=crop&q=80&w=800' },
        { title: 'كيا K5 موديل 2021 فل كامل', price: 82000, img: 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?auto=format&fit=crop&q=80&w=800' },
        { title: 'جمس يوكن 2018 قصير دبل', price: 145000, img: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&q=80&w=800' },
    ],
    'mobiles': [
        { title: 'ايفون 14 برو ماكس بنفسجي 256', price: 3800, img: 'https://images.unsplash.com/photo-1663499482523-1c0c167dd2a7?auto=format&fit=crop&q=80&w=800' },
        { title: 'سامسونج S23 الترا اخضر', price: 3200, img: 'https://images.unsplash.com/photo-1678911820864-e2c567c655d7?auto=format&fit=crop&q=80&w=800' },
        { title: 'ايفون 13 عادي ازرق 128', price: 2100, img: 'https://images.unsplash.com/photo-1632661674596-df8be070a5c5?auto=format&fit=crop&q=80&w=800' },
        { title: 'شاومي 13 برو جديد', price: 2500, img: 'https://images.unsplash.com/photo-1598327105666-5b89351aff23?auto=format&fit=crop&q=80&w=800' },
        { title: 'ايفون 12 برو ذهبي نظيف', price: 2000, img: 'https://images.unsplash.com/photo-1605236453806-6ff36851218e?auto=format&fit=crop&q=80&w=800' },
        { title: 'سامسونج فولد 4 مستعمل', price: 3500, img: 'https://images.unsplash.com/photo-1610945699354-96269f846f53?auto=format&fit=crop&q=80&w=800' },
        { title: 'ايباد برو M2 مقاس 12.9', price: 4200, img: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&q=80&w=800' },
    ],
    'furniture': [
        { title: 'كنب زاوية ايكيا نظيف', price: 1500, img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
        { title: 'طاولة طعام خشب زان 8 كراسي', price: 3000, img: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&q=80&w=800' },
        { title: 'غرفة نوم كاملة مودرن', price: 4500, img: 'https://images.unsplash.com/photo-1505693416388-b0346ef4143d?auto=format&fit=crop&q=80&w=800' },
        { title: 'مجلس عربي ارضي تفصيل', price: 2200, img: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800' },
        { title: 'مكتب دراسي مع كرسي', price: 450, img: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800' },
        { title: 'دولاب ملابس كبير 6 ابواب', price: 1200, img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800' },
    ],
    'electronics': [
        { title: 'شاشة سوني 65 بوصة 4K', price: 2800, img: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?auto=format&fit=crop&q=80&w=800' },
        { title: 'بلايستيشن 5 نسخة القرص', price: 1900, img: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?auto=format&fit=crop&q=80&w=800' },
        { title: 'سماعات ابل ماكس فضي', price: 1800, img: 'https://images.unsplash.com/photo-1613040809024-b4ef7ba99bc3?auto=format&fit=crop&q=80&w=800' },
        { title: 'ساعة ابل الترا 2', price: 2900, img: 'https://images.unsplash.com/photo-1673124572216-3e0d86241b71?auto=format&fit=crop&q=80&w=800' },
        { title: 'ماكينة قهوة ديلونجي', price: 850, img: 'https://images.unsplash.com/photo-1517912443048-c9c03b1442c4?auto=format&fit=crop&q=80&w=800' },
    ],
    'computers': [
        { title: 'ماك بوك اير M2 جديد', price: 4800, img: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca4?auto=format&fit=crop&q=80&w=800' },
        { title: 'بي سي قيمنق رايزن 5', price: 3500, img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=800' },
        { title: 'لابتوب اتش بي للدراسة', price: 1500, img: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800' },
    ],
    'cameras': [
        { title: 'كاميرا كانون R6 مع عدسة', price: 8500, img: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800' },
        { title: 'سوني A7III بودي فقط', price: 5500, img: 'https://images.unsplash.com/photo-1519638831568-d9897f54ed69?auto=format&fit=crop&q=80&w=800' },
        { title: 'جو برو هيرو 11', price: 1200, img: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?auto=format&fit=crop&q=80&w=800' },
    ],
    'food': [
        { title: 'تمر سكري فاخر مكنوز', price: 150, img: 'https://images.unsplash.com/photo-1557929036-7c980312527b?auto=format&fit=crop&q=80&w=800' },
        { title: 'عسل سدر بلدي مضمون', price: 350, img: 'https://images.unsplash.com/photo-1587049359530-4daa5f659836?auto=format&fit=crop&q=80&w=800' },
        { title: 'ورق عنب وملفوف شغل بيت', price: 80, img: 'https://images.unsplash.com/photo-1626202158925-635c34cb346c?auto=format&fit=crop&q=80&w=800' },
    ],
    'fashion': [
        { title: 'فستان سهرة راقي لبسة واحدة', price: 500, img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800' },
        { title: 'شنطة شانيل كلاسيك اصلية', price: 12000, img: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=800' },
        { title: 'ساعة رولكس ديت جست', price: 45000, img: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&q=80&w=800' },
    ],
    'default': [
        { title: 'خدمات نقل عفش فك وتركيب', price: 300, img: 'https://images.unsplash.com/photo-1600518464441-9154a4dea21b?auto=format&fit=crop&q=80&w=800' },
        { title: 'صيانة مكيفات سبليت وشباك', price: 100, img: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&q=80&w=800' },
        { title: 'خيام ملكية للايجار', price: 1000, img: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?auto=format&fit=crop&q=80&w=800' },
        { title: 'ذبائح نعيم طيبة للبيع', price: 1300, img: 'https://images.unsplash.com/photo-1484557985045-6f5c50761930?auto=format&fit=crop&q=80&w=800' },
    ]
};

const generateAds = (count: number): AdItem[] => {
    return Array.from({ length: count }, (_, i) => {
        // Cycle through categories
        const catIndex = i % CATEGORIES.length;
        const categoryId = CATEGORIES[catIndex].id;
        
        // Get specific templates for this category or fallback to default
        const templates = AD_TEMPLATES[categoryId] || AD_TEMPLATES['default'];
        const template = templates[Math.floor(Math.random() * templates.length)];
        
        // Randomize user from leaderboard for realism
        const randomUser = LEADERBOARD_USERS[Math.floor(Math.random() * LEADERBOARD_USERS.length)];
        
        // Randomize City
        const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];

        // Generate Time
        const times = ['منذ دقيقة', 'منذ 15 دقيقة', 'منذ ساعة', 'منذ 3 ساعات', 'منذ يوم', 'منذ يومين'];
        const time = times[Math.floor(Math.random() * times.length)];

        return {
            id: `gen_ad_${i + 100}`,
            type: 'ad',
            title: template.title,
            image: template.img,
            images: [template.img], // Could add more placeholder images
            price: template.price,
            currency: 'ر.س',
            location: randomCity,
            category: categoryId,
            condition: Math.random() > 0.3 ? 'مستعمل' : 'جديد',
            postedTime: time,
            description: `تفاصيل ${template.title}. ${categoryId === 'cars' ? 'ممشى قليل، بدي وكالة.' : 'استخدام نظيف، كامل الملحقات.'}`,
            views: Math.floor(Math.random() * 500) + 10,
            user: { ...randomUser, role: randomUser.role || 'user' },
            isFeatured: false, // Ensure generated ads are regular
            isVIP: false       // Ensure generated ads are regular
        };
    });
};

const STATIC_ADS: AdItem[] = [
  // 1. VIP Ad - Mercedes G-Class
  {
    id: 'vip1',
    type: 'ad',
    title: 'مرسيدس جي كلاس G63 AMG 2024 فل كامل',
    image: 'https://images.unsplash.com/photo-1609520505218-7421da3b3d35?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1609520505218-7421da3b3d35?auto=format&fit=crop&q=80&w=800'],
    price: 1150000,
    currency: 'ر.س',
    location: 'الرياض',
    condition: 'جديد',
    postedTime: 'الآن',
    category: 'cars',
    description: 'مرسيدس G63 AMG موديل 2024، اللون أسود مطفي، داخلية أحمر، ضمان الوكيل، أصفار.',
    views: 15200,
    isVIP: true,
    user: { id: 'vip_u1', name: 'معرض النخبة للسيارات', avatar: 'https://cdn-icons-png.flaticon.com/512/55/55283.png', reputation: 9000, role: 'store' }
  },
  
  // 2. Featured Ad 1 - iPhone 15 Pro Max
  {
    id: 'feat1',
    type: 'ad',
    title: 'ايفون 15 برو ماكس تيتانيوم طبيعي 512GB',
    image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1696446701796-da61225697cc?auto=format&fit=crop&q=80&w=800'],
    price: 5200,
    currency: 'ر.س',
    location: 'جدة',
    condition: 'جديد',
    postedTime: 'منذ 30 دقيقة',
    category: 'mobiles',
    description: 'ايفون 15 برو ماكس، 512 جيجا، لون تيتانيوم طبيعي، جديد بكرتونه لم يفتح، ضمان سنتين.',
    views: 3400,
    isFeatured: true,
    user: { id: 'u2', name: 'متجر التقنية', avatar: 'https://cdn-icons-png.flaticon.com/512/3062/3062634.png', reputation: 500, role: 'store' }
  },

  // 3. Featured Ad 2 - Modern Villa
  {
    id: 'feat2',
    type: 'ad',
    title: 'فيلا مودرن درج صالة حي الملقا',
    image: 'https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1600596542815-2495db9dc2c3?auto=format&fit=crop&q=80&w=800'],
    price: 3800000,
    currency: 'ر.س',
    location: 'الرياض',
    condition: 'جديد',
    postedTime: 'منذ ساعتين',
    category: 'furniture', // Using furniture/home category placeholder
    description: 'فيلا مودرن مساحة 375م، شارع 20 شمالي، تكييف مركزي، مسبح، مصعد، تشطيب فاخر.',
    views: 2100,
    isFeatured: true,
    user: { id: 'u3', name: 'عقارات المملكة', avatar: 'https://cdn-icons-png.flaticon.com/512/609/609803.png', reputation: 28500, role: 'store' }
  },

  // 4. VIP Ad 2 - Rolex Watch
  {
    id: 'vip2',
    type: 'ad',
    title: 'ساعة رولكس سبمارينر ديت ستيل',
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800',
    images: ['https://images.unsplash.com/photo-1523170335258-f5ed11844a49?auto=format&fit=crop&q=80&w=800'],
    price: 65000,
    currency: 'ر.س',
    location: 'الخبر',
    condition: 'مستعمل',
    postedTime: 'منذ 10 دقائق',
    category: 'fashion',
    description: 'رولكس سبمارينر، موديل 2021، كامل المرفقات، استخدام حشمة، اخت الجديدة.',
    views: 5400,
    isVIP: true,
    user: { id: 'vip_u2', name: 'جاليري الساعات', avatar: 'https://cdn-icons-png.flaticon.com/512/2590/2590525.png', reputation: 12000, role: 'store' }
  }
];

const REWARDS: RewardItem[] = [OFFER_ITEMS[0]];
const BULK_ADS: AdItem[] = generateAds(60); // Increased generation count

export const FEED_ITEMS: FeedItem[] = [...STATIC_ADS, ...REWARDS, ...BULK_ADS];
