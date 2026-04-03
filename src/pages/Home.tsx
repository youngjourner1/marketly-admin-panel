import React, { useState, useEffect } from 'react';
import HeroCarousel from '@/components/marketplace/HeroCarousel';
import ProductCard from '@/components/marketplace/ProductCard';
import { Product } from '@/types';
import { Smartphone, Laptop, Shirt, Home as HomeIcon, Sparkles, Cpu, LucideIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db, collection, getDocs, query, where, limit } from '@/lib/firebase';
import { updateMetaTags } from '@/lib/seo';

interface CategoryItem {
  name: string;
  icon: LucideIcon;
  color: string;
  image: string;
}

const CATEGORIES: CategoryItem[] = [
  { name: 'Phones', icon: Smartphone, color: 'bg-blue-100 text-blue-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-iphone-15-d00c6cd4-1775241395041.webp' },
  { name: 'Computing', icon: Laptop, color: 'bg-indigo-100 text-indigo-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-macbook-air-e55b4422-1775241396151.webp' },
  { name: 'Electronics', icon: Cpu, color: 'bg-purple-100 text-purple-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-camera-4k-e2d448de-1775241398405.webp' },
  { name: 'Fashion', icon: Shirt, color: 'bg-pink-100 text-pink-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-sneakers-1-c51e48a0-1775241395652.webp' },
  { name: 'Home & Office', icon: HomeIcon, color: 'bg-green-100 text-green-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/hero-banner-home-1844da66-1775241396324.webp' },
  { name: 'Beauty', icon: Sparkles, color: 'bg-yellow-100 text-yellow-600', image: 'https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-smartwatch-9-d1182486-1775241395209.webp' },
];

const MOCK_PRODUCTS: Product[] = [
  { id: '1', sellerId: 's1', sellerName: 'Global Electronics', title: 'iPhone 15 Pro Max 256GB - Titanium Gray', description: 'Experience the future.', price: 1199, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-iphone-15-d00c6cd4-1775241395041.webp'], category: 'Phones', stock: 15, rating: 4.8, createdAt: new Date(), status: 'approved' },
  { id: '2', sellerId: 's2', sellerName: 'Tech Hub', title: 'MacBook Air 13-inch M2 Chip - Space Gray', description: 'Power meets portability.', price: 999, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-macbook-air-e55b4422-1775241396151.webp'], category: 'Computing', stock: 8, rating: 4.9, createdAt: new Date(), status: 'approved' },
  { id: '3', sellerId: 's1', sellerName: 'Global Electronics', title: 'Noise Cancelling Wireless Headphones', description: 'Superior sound.', price: 299, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-headphones-3f3fad9e-1775241394909.webp'], category: 'Electronics', stock: 25, rating: 4.5, createdAt: new Date(), status: 'approved' },
  { id: '4', sellerId: 's3', sellerName: 'Sports Direct', title: 'Ultra Boost Athletic Sneakers', description: 'Run faster.', price: 150, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-sneakers-1-c51e48a0-1775241395652.webp'], category: 'Fashion', stock: 5, rating: 4.7, createdAt: new Date(), status: 'approved' },
  { id: '5', sellerId: 's2', sellerName: 'Tech Hub', title: 'Smart Watch Series 9', description: 'Stay connected.', price: 399, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-smartwatch-9-d1182486-1775241395209.webp'], category: 'Electronics', stock: 12, rating: 4.6, createdAt: new Date(), status: 'approved' },
  { id: '6', sellerId: 's4', sellerName: 'Photo Pro', title: 'Digital Mirrorless Camera 4K', description: 'Crystal clear photos.', price: 850, images: ['https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/prod-camera-4k-e2d448de-1775241398405.webp'], category: 'Electronics', stock: 4, rating: 4.4, createdAt: new Date(), status: 'approved' }
];

const Home: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    updateMetaTags('Home of Quality Products', 'Shop from thousands of products on Marketly. Best prices, fast shipping.');
    
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), where('status', '==', 'approved'), limit(12));
        const snapshot = await getDocs(q);
        const productList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
        setProducts(productList.length > 0 ? productList : MOCK_PRODUCTS);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="bg-slate-50 min-h-screen pb-12 transition-all duration-500">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-10">
          <div className="hidden lg:flex flex-col bg-white rounded-md shadow-sm overflow-hidden border">
             {CATEGORIES.map((cat) => (
               <Link 
                 key={cat.name} 
                 to={`/category/${cat.name.toLowerCase()}`}
                 className="flex items-center gap-3 px-4 py-3 hover:bg-orange-50 hover:text-orange-600 transition-colors border-b last:border-0 group"
               >
                 <cat.icon className="h-4 w-4 group-hover:scale-110 transition-transform" />
                 <span className="text-sm font-medium">{cat.name}</span>
               </Link>
             ))}
          </div>
          <div className="lg:col-span-3">
            <HeroCarousel />
          </div>
        </div>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900">Shop By Category</h2>
            <Link to="/categories" className="text-orange-600 font-semibold hover:underline text-sm uppercase">See All</Link>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {CATEGORIES.map((cat, idx) => (
              <motion.div
                key={cat.name}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="flex flex-col items-center group cursor-pointer text-center"
              >
                <div className="w-full aspect-square bg-white rounded-full flex items-center justify-center shadow-sm overflow-hidden border-2 border-transparent group-hover:border-orange-500 transition-all mb-2">
                   <img src={cat.image} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                </div>
                <span className="text-xs md:text-sm font-semibold group-hover:text-orange-600">{cat.name}</span>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="mb-10 bg-orange-600 rounded-md p-6 shadow-lg relative overflow-hidden">
          <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl"></div>
          <div className="flex justify-between items-center mb-6 text-white relative z-10">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 animate-pulse" />
              <h2 className="text-xl font-bold italic uppercase tracking-wider">Flash Sales</h2>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-xs font-bold uppercase hidden sm:inline">Ends in:</span>
               <div className="flex gap-1">
                 <span className="bg-white text-orange-600 px-2 py-1 rounded font-mono font-bold">12</span>:
                 <span className="bg-white text-orange-600 px-2 py-1 rounded font-mono font-bold">45</span>:
                 <span className="bg-white text-orange-600 px-2 py-1 rounded font-mono font-bold">08</span>
               </div>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative z-10">
            {loading ? Array(6).fill(0).map((_, i) => <div key={i} className="h-64 bg-white/20 rounded-md animate-pulse"></div>) : products.slice(0, 6).map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </section>

        <section className="mb-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-orange-600 pl-4 uppercase tracking-tight">Recommended For You</h2>
            <Link to="/products" className="text-orange-600 font-semibold hover:underline text-sm uppercase">View All</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {loading ? Array(12).fill(0).map((_, i) => <div key={i} className="h-64 bg-slate-200 rounded-md animate-pulse"></div>) : products.map((product, idx) => (
              <ProductCard key={product.id} product={product} index={idx} />
            ))}
          </div>
        </section>

        <div className="w-full h-32 md:h-48 rounded-lg overflow-hidden relative mb-12">
           <img src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/hero-banner-electronics-6f308fd7-1775241395915.webp" className="w-full h-full object-cover" alt="Ad Banner" />
           <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="text-center text-white p-4">
                <h3 className="text-xl md:text-3xl font-bold mb-2">Ready to Grow Your Business?</h3>
                <p className="mb-4 text-xs md:text-sm opacity-90">Join thousands of successful sellers on Marketly today!</p>
                <Link to="/register" className="bg-orange-600 text-white px-6 py-2 rounded font-bold hover:bg-orange-700 transition-colors uppercase text-sm">Open Your Shop</Link>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Home;