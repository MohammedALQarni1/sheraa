
export interface User {
  id: string;
  name: string;
  avatar: string;
  reputation?: number;
  location?: string;
  isGuest?: boolean;
  status?: 'active' | 'suspended';
  role?: 'user' | 'store';
  trend?: 'up' | 'down' | 'stable';
  stats?: {
    deals: number;
    responseRate: number;
    badges: string[];
  };
}

export interface BaseItem {
  id: string;
  image: string;
  title: string;
  category?: string; // Added for filtering
}

export interface AdItem extends BaseItem {
  type: 'ad';
  price: number;
  currency: string;
  location: string;
  user: User;
  postedTime: string; // e.g., "now", "2h ago"
  condition: string; // e.g., "New", "Used"
  description?: string;
  images?: string[];
  views?: number;
  isFeatured?: boolean; // Featured Ads (Yellow)
  isVIP?: boolean; // VIP Ads (Top priority, global visibility)
}

export interface RewardItem extends BaseItem {
  type: 'reward';
  brandName: string;
  brandLogo: string;
  discountPercentage: number;
  pointsCost: number;
  category: string;
  // New fields for Offers View
  rating?: number;
  reviewsCount?: number;
  expiryDate?: string;
  programName?: string; // e.g. "Restaurants", "Shopping" for the badge
}

export type FeedItem = AdItem | RewardItem;

export type NotificationType = 'transaction' | 'message' | 'offer' | 'system' | 'ad';

export interface NotificationItem {
  id: string;
  type: NotificationType;
  title: string;
  body: string;
  time: string;
  isRead: boolean;
  targetId?: string; // ID to navigate to
  amount?: number; // For points transactions
}

export interface Category {
  id: string;
  name: string;
  icon: any; // Lucide icon component
}

export interface Transaction {
  id: string;
  // Comprehensive list of transaction types based on app rules
  type: 
    | 'subscription_bonus'   // Earning points from Premium Subscription
    | 'ad_promo_bonus'       // Earning points from Boosting Ads (Cash payment reward)
    | 'commission_reward'    // Earning points from Paying Commission
    | 'sale_reward'          // Earning points from QR Scan (Selling)
    | 'daily_reward'         // Daily Login
    | 'referral_bonus'       // Inviting friends
    | 'deposit_bonus'        // Bonus points when charging wallet (if applicable)
    | 'buy_reward'           // SPENDING: Buying Store Offers
    | 'transfer_sent'        // SPENDING: Sending points to user
    | 'expired'              // SPENDING: Points expiry
    | 'refund'               // Earning: Refunded points
    | 'transfer_received';   // Earning: Received points
    
  title: string;
  subtitle: string;
  amount: number; // Positive for Earned, Negative for Spent/Expired
  currency: string;
  date: string; // Sorting date YYYY-MM-DD
  displayDate: string; // Header date e.g. "20 نوفمبر 2025"
  time: string; // e.g. "03:37 AM"
  logo?: string;
  iconName?: string; // String identifier for Lucide icons
  status?: 'completed' | 'pending' | 'failed';
  // Detail fields
  operationId?: string;
  expiryDate?: string;
}
