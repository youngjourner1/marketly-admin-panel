import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { 
  Plus, 
  Store, 
  TrendingUp, 
  Package, 
  DollarSign, 
  MessageSquare, 
  Settings,
  Bell,
  ChevronRight,
  Verified,
  ShoppingBag
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Seller } from '@/types';
import { motion } from 'framer-motion';

const SellerDashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sellerData, setSellerData] = useState<Seller | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!user) return;
      try {
        const docRef = doc(db, 'sellers', user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setSellerData(docSnap.data() as Seller);
        } else {
          // If user is a seller but has no store entry, send to setup
          navigate('/seller/setup');
        }
      } catch (error) {
        console.error("Error fetching seller data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [user, navigate]);

  if (loading) {
    return (
      <div className="p-8 space-y-8 animate-in fade-in duration-500">
        <div className="flex justify-between items-center">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-12 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-32 w-full" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton className="h-96 w-full" />
          <Skeleton className="h-96 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-white shadow-lg bg-white">
            <img src={sellerData?.storeLogo} alt="Logo" className="w-full h-full object-cover" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-bold text-slate-900">{sellerData?.storeName}</h1>
              {sellerData?.verified && <Verified className="h-6 w-6 text-orange-600 fill-orange-600/10" />}
            </div>
            <p className="text-slate-500 font-medium">Welcome back to your store dashboard.</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button className="bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-100">
            <Plus className="h-4 w-4 mr-2" /> List New Product
          </Button>
          <Button variant="outline" size="icon" className="bg-white">
            <Bell className="h-5 w-5 text-slate-600" />
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[ 
          { label: 'Total Sales', value: '₵ 0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Active Listings', value: '0', icon: Package, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Orders Today', value: '0', icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Store Rating', value: '5.0', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
        ].map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <div className="text-xs font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded">+0%</div>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions & Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between border-b border-slate-50">
            <CardTitle className="text-xl font-bold">Recent Orders</CardTitle>
            <Button variant="link" className="text-orange-600">View all orders</Button>
          </CardHeader>
          <CardContent className="p-12 text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="h-10 w-10 text-slate-200" />
            </div>
            <p className="text-slate-400 font-medium">No orders received yet. Once you list products, they will appear here.</p>
            <Button variant="outline" className="mt-6 border-orange-200 text-orange-600 hover:bg-orange-50 font-bold">
              Promote Your Store
            </Button>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="border-none shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl font-bold">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-2">
              {[ 
                { label: 'Store Settings', icon: Settings, path: '/seller/settings' },
                { label: 'Messaging Center', icon: MessageSquare, path: '/messages' },
                { label: 'Payment Accounts', icon: DollarSign, path: '/seller/wallet' },
                { label: 'Store Analytics', icon: TrendingUp, path: '/seller/analytics' },
              ].map((action) => (
                <Button 
                  key={action.label} 
                  variant="ghost" 
                  className="w-full justify-between hover:bg-orange-50 hover:text-orange-700 h-12"
                  onClick={() => navigate(action.path)}
                >
                  <span className="flex items-center gap-3 font-semibold">
                    <action.icon className="h-5 w-5" /> {action.label}
                  </span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-orange-600 border-none shadow-lg text-white overflow-hidden relative">
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
            <CardContent className="p-8 relative z-10">
              <h3 className="text-2xl font-bold mb-2">Ready to Grow?</h3>
              <p className="text-orange-100 mb-6 text-sm">Our verified seller program gives you access to featured listings and lower commissions.</p>
              <Button className="bg-white text-orange-600 hover:bg-orange-50 font-bold w-full">
                Learn More
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;