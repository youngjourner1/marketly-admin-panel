import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, Menu, X, LogOut, LayoutDashboard, Briefcase } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import NotificationBell from './NotificationBell';

const Navbar: React.FC = () => {
  const { user, profile, isAdmin, isSeller } = useAuth();
  const { totalItems } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-orange-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold tracking-tighter hover:opacity-90">
            Marketly
          </Link>

          {/* Search Bar - Desktop */}
          <form onSubmit={handleSearch} className="hidden flex-1 max-w-2xl relative md:flex">
            <Input
              type="text"
              placeholder="Search products, brands and categories"
              className="w-full bg-white text-black pl-10 h-11 rounded-md border-none focus-visible:ring-2 focus-visible:ring-orange-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-5 w-5" />
            <Button type="submit" className="absolute right-0 top-0 h-11 bg-orange-800 hover:bg-orange-900 rounded-l-none">
              Search
            </Button>
          </form>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-6">
            {user && !isSeller && !isAdmin && (
              <Link 
                to="/become-seller" 
                className="text-sm font-bold bg-orange-500 hover:bg-orange-400 px-4 py-2 rounded-full border border-white/20 transition-all flex items-center gap-2 animate-bounce-slow"
              >
                <Briefcase className="h-4 w-4" />
                BECOME A SELLER
              </Link>
            )}

            <div className="flex items-center gap-4">
              {user && <NotificationBell />}

              <div className="flex items-center gap-2 cursor-pointer group relative">
                <div className="relative">
                  <User className="h-6 w-6" />
                  {user && <div className="absolute -top-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-orange-600" />}
                </div>
                <div className="flex flex-col">
                  <span className="text-xs leading-tight">Hi, {profile?.name.split(' ')[0] || 'Account'}</span>
                  <span className="text-sm font-semibold leading-tight">Account</span>
                </div>
                
                <div className="hidden group-hover:block absolute top-10 right-0 pt-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                   <div className="bg-white text-black p-2 rounded-xl shadow-2xl border border-slate-100 w-56 flex flex-col gap-1 overflow-hidden">
                     {user ? (
                       <>
                          <div className="px-3 py-2 border-b mb-1">
                             <p className="text-xs text-slate-500">Signed in as</p>
                             <p className="font-bold truncate">{profile?.email}</p>
                          </div>
                          <Link to="/profile" className="p-2 hover:bg-orange-50 rounded-lg text-sm flex items-center gap-2 transition-colors"><User className="h-4 w-4" /> My Account</Link>
                          <Link to="/orders" className="p-2 hover:bg-orange-50 rounded-lg text-sm flex items-center gap-2 transition-colors"><ShoppingCart className="h-4 w-4" /> Orders</Link>
                          {isSeller && <Link to="/seller/dashboard" className="p-2 hover:bg-orange-50 rounded-lg text-sm flex items-center gap-2 transition-colors font-bold text-orange-600"><LayoutDashboard className="h-4 w-4" /> Seller Dashboard</Link>}
                          {isAdmin && <Link to="/admin/dashboard" className="p-2 hover:bg-orange-50 rounded-lg text-sm flex items-center gap-2 transition-colors font-bold text-orange-600"><LayoutDashboard className="h-4 w-4" /> Admin Panel</Link>}
                          <hr className="my-1" />
                          <button onClick={handleLogout} className="p-2 text-left hover:bg-red-50 rounded-lg text-sm text-red-600 flex items-center gap-2 transition-colors"><LogOut className="h-4 w-4" /> Logout</button>
                       </>
                     ) : (
                       <>
                         <Link to="/login" className="bg-orange-600 text-white text-center py-2.5 rounded-lg font-bold text-sm hover:bg-orange-700 transition-colors">LOGIN</Link>
                         <Link to="/register" className="text-center py-2.5 border-2 border-orange-600 text-orange-600 rounded-lg font-bold text-sm hover:bg-orange-50 transition-colors mt-2">CREATE ACCOUNT</Link>
                       </>
                     )}
                   </div>
                </div>
              </div>
            </div>

            <Link to="/cart" className="flex items-center gap-2 relative group">
              <div className="relative">
                <ShoppingCart className="h-6 w-6" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-800 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center border-2 border-orange-600">
                    {totalItems}
                  </span>
                )}
              </div>
              <span className="font-semibold">Cart</span>
            </Link>
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            {user && <NotificationBell />}
            <button className="p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Search Bar - Mobile */}
        <form onSubmit={handleSearch} className="mt-3 md:hidden relative">
          <Input
            type="text"
            placeholder="Search products..."
            className="w-full bg-white text-black pl-10 h-10 rounded-md border-none focus-visible:ring-2 focus-visible:ring-orange-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 h-4 w-4" />
        </form>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMenuOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-4/5 max-w-sm bg-white text-black z-50 md:hidden flex flex-col p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-8">
                <span className="text-2xl font-black text-orange-600">Marketly</span>
                <button onClick={() => setIsMenuOpen(false)}><X className="h-6 w-6 text-slate-400" /></button>
              </div>

              <div className="flex flex-col gap-4">
                {user ? (
                   <>
                    <div className="border-b border-slate-100 pb-4 mb-2">
                       <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mb-1">Account Info</p>
                       <p className="font-bold text-lg">{profile?.name}</p>
                       <p className="text-sm text-slate-500">{profile?.email}</p>
                    </div>
                    
                    {!isSeller && !isAdmin && (
                      <Link 
                        to="/become-seller" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-4 text-lg font-bold text-orange-600 bg-orange-50 px-4 rounded-xl"
                      >
                        <Briefcase className="h-6 w-6" /> Become a Seller
                      </Link>
                    )}

                    <Link to="/profile" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg font-medium hover:text-orange-600"><User className="h-5 w-5" /> Account Settings</Link>
                    <Link to="/orders" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 py-3 text-lg font-medium hover:text-orange-600"><ShoppingCart className="h-5 w-5" /> My Orders</Link>
                    
                    {isSeller && (
                      <Link 
                        to="/seller/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-lg font-bold text-orange-600"
                      >
                        <LayoutDashboard className="h-5 w-5" /> Seller Dashboard
                      </Link>
                    )}
                    
                    {isAdmin && (
                      <Link 
                        to="/admin/dashboard" 
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-3 py-3 text-lg font-bold text-blue-600"
                      >
                        <LayoutDashboard className="h-5 w-5" /> Admin Dashboard
                      </Link>
                    )}

                    <div className="mt-auto">
                      <button onClick={handleLogout} className="flex items-center gap-3 py-3 text-lg font-bold text-red-600 w-full mt-4"><LogOut className="h-5 w-5" /> Logout</button>
                    </div>
                   </>
                ) : (
                  <>
                    <div className="flex flex-col gap-4 mt-8">
                      <Link to="/login" onClick={() => setIsMenuOpen(false)} className="bg-orange-600 text-white text-center py-4 rounded-xl font-bold text-lg">Login</Link>
                      <Link to="/register" onClick={() => setIsMenuOpen(false)} className="text-center py-4 border-2 border-orange-600 text-orange-600 rounded-xl font-bold text-lg">Create Account</Link>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;