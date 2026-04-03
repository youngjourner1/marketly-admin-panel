import React from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Heart, Star, CreditCard, User, LogOut } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';

const BuyerDashboard: React.FC = () => {
  const { profile, signOut } = useAuth();

  const stats = [
    { label: 'Total Orders', value: '0', icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Wishlist Items', value: '0', icon: Heart, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Wallet Balance', value: `\u20B5${profile?.walletBalance?.toFixed(2) || '0.00'}`, icon: CreditCard, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Points', value: '0', icon: Star, color: 'text-amber-600', bg: 'bg-amber-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Welcome back, {profile?.name}!</h1>
          <p className="text-slate-500">Manage your orders, wishlist, and account settings.</p>
        </div>
        <Button 
          variant="outline" 
          className="text-slate-600 border-slate-200"
          onClick={() => signOut()}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-6 rounded-2xl border shadow-sm flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
            <div>
              <p className="text-sm text-slate-500 font-medium">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
              <Button variant="link" className="text-orange-600 p-0 h-auto">View all</Button>
            </div>
            <div className="p-12 text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-slate-50 mb-4">
                <ShoppingBag className="h-8 w-8 text-slate-300" />
              </div>
              <h3 className="text-slate-900 font-bold mb-1">No orders yet</h3>
              <p className="text-slate-500 text-sm max-w-xs mx-auto">
                Looks like you haven't placed any orders. Start exploring our marketplace!
              </p>
              <Button className="mt-6 bg-orange-600 hover:bg-orange-700">
                Start Shopping
              </Button>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-white rounded-2xl border shadow-sm p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-12 w-12 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900">Profile Info</h3>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold">{profile?.role}</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Email</p>
                <p className="text-sm text-slate-700 font-semibold">{profile?.email}</p>
              </div>
              <div>
                <p className="text-xs text-slate-400 font-medium uppercase">Joined On</p>
                <p className="text-sm text-slate-700 font-semibold">
                  {profile?.createdAt?.toDate ? profile.createdAt.toDate().toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>

            <Button variant="outline" className="w-full mt-6">
              Edit Profile
            </Button>
          </section>

          <section className="bg-orange-600 rounded-2xl shadow-lg shadow-orange-100 p-6 text-white">
            <h3 className="font-bold text-lg mb-2">Become a Seller</h3>
            <p className="text-orange-100 text-sm mb-4">
              Reach thousands of customers and grow your business with Marketly.
            </p>
            <Button className="w-full bg-white text-orange-600 hover:bg-orange-50 font-bold">
              Apply Now
            </Button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;