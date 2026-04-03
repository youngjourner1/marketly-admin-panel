export type UserRole = 'buyer' | 'seller' | 'admin' | 'super_admin';

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  role: UserRole;
  walletBalance: number;
  createdAt: any;
  status: 'active' | 'banned';
  isSellerRequestPending?: boolean;
}

export interface SellerRequest {
  id: string;
  userId: string;
  fullName: string;
  phone: string;
  ghanaCardId: string;
  businessName?: string;
  location: string;
  category: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewNote?: string;
  createdAt: any;
}

export interface AppNotification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'seller_request_approved' | 'seller_request_rejected' | 'order_update' | 'chat_message';
  status: 'read' | 'unread';
  reviewNote?: string;
  createdAt: any;
  metadata?: any;
}

export interface Seller {
  userId: string;
  storeName: string;
  storeLogo: string;
  description: string;
  verified: boolean;
  createdAt: any;
}

export interface Product {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  stock: number;
  rating: number;
  createdAt: any;
  status: 'approved' | 'pending' | 'rejected';
  isVerifiedSeller?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: string;
  buyerId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: any;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  message: string;
  createdAt: any;
}

export interface Chat {
  id: string;
  buyerId: string;
  sellerId: string;
  lastMessage: string;
  updatedAt: any;
}