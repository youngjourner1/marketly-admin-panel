import React from 'react';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand & About */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white tracking-tighter">Marketly</h2>
            <p className="text-sm leading-relaxed max-w-xs">
              Your ultimate multi-vendor marketplace for everything. From gadgets to fashion, we've got it all. High quality, competitive prices, and fast delivery.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="hover:text-orange-500 transition-colors"><Facebook className="h-5 w-5" /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Twitter className="h-5 w-5" /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Instagram className="h-5 w-5" /></a>
              <a href="#" className="hover:text-orange-500 transition-colors"><Youtube className="h-5 w-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Marketplace</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/categories" className="hover:text-orange-500 transition-colors">All Categories</Link></li>
              <li><Link to="/flash-sales" className="hover:text-orange-500 transition-colors">Flash Sales</Link></li>
              <li><Link to="/popular" className="hover:text-orange-500 transition-colors">Popular Products</Link></li>
              <li><Link to="/sellers" className="hover:text-orange-500 transition-colors">Our Sellers</Link></li>
            </ul>
          </div>

          {/* Business */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Business</h3>
            <ul className="space-y-3 text-sm">
              <li><Link to="/seller/register" className="hover:text-orange-500 transition-colors">Sell on Marketly</Link></li>
              <li><Link to="/affiliate" className="hover:text-orange-500 transition-colors">Affiliate Program</Link></li>
              <li><Link to="/shipping" className="hover:text-orange-500 transition-colors">Shipping Policy</Link></li>
              <li><Link to="/terms" className="hover:text-orange-500 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-white">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-orange-500 shrink-0" />
                <span>123 Market Street, E-commerce City, EC 54321</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-orange-500 shrink-0" />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-orange-500 shrink-0" />
                <span>support@marketly.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>© 2024 Marketly Marketplace. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            <a href="#" className="hover:text-white transition-colors">Security</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;