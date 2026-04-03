import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  ShoppingBag, 
  Settings, 
  AlertCircle, 
  DollarSign, 
  FileText,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Package
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-slate-500">Management and monitoring of Marketly platform.</p>
        </div>
        <div className="flex items-center gap-3">
           <div className="flex -space-x-2">
              {[1,2,3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-slate-200" />
              ))}
           </div>
           <span className="text-sm font-semibold text-slate-500">3 Admins Online</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: '₵ 0.00', icon: DollarSign, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Total Users', value: '0', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Active Stores', value: '0', icon: ShieldCheck, color: 'text-orange-600', bg: 'bg-orange-50' },
          { label: 'Pending Requests', value: '...', icon: FileText, color: 'text-yellow-600', bg: 'bg-yellow-50', path: '/admin/requests' },
        ].map((stat, i) => (
          <motion.div 
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="cursor-pointer" 
            onClick={() => stat.path && navigate(stat.path)}
          >
            <Card className="border-none shadow-sm hover:shadow-md transition-all group">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300" />
                </div>
                <div className="mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <h3 className="text-2xl font-black text-slate-900">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2 border-none shadow-sm">
           <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-xl font-bold">Platform Activity</CardTitle>
              <Button variant="outline" size="sm">Last 7 Days</Button>
           </CardHeader>
           <CardContent className="p-12 text-center">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                 <TrendingUp className="h-8 w-8 text-slate-200" />
              </div>
              <p className="text-slate-400">No activity data available yet.</p>
           </CardContent>
        </Card>

        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-900 text-white">
            <CardTitle className="text-xl font-bold">Management</CardTitle>
          </CardHeader>
          <CardContent className="p-2">
            {[ 
              { label: 'Seller Applications', icon: FileText, path: '/admin/requests', count: 'View Requests' },
              { label: 'Product Verification', icon: Package, path: '/admin/products', count: '0 pending' },
              { label: 'User Management', icon: Users, path: '/admin/users' },
              { label: 'Security Logs', icon: AlertCircle, path: '/admin/logs' },
              { label: 'Platform Settings', icon: Settings, path: '/admin/settings' },
            ].map((item) => (
              <Button 
                key={item.label} 
                variant="ghost" 
                className="w-full justify-between h-14 hover:bg-slate-50 rounded-none border-b border-slate-50 last:border-0 px-4"
                onClick={() => navigate(item.path)}
              >
                <span className="flex items-center gap-3 font-semibold">
                  <item.icon className="h-5 w-5 text-slate-400" /> {item.label}
                </span>
                <span className="text-xs bg-orange-100 text-orange-600 px-2 py-1 rounded font-bold">{item.count}</span>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;