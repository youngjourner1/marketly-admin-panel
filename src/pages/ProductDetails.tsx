import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, MessageSquare, ShieldCheck, Truck, RefreshCw, User, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { db, doc, getDoc, collection, query, where, getDocs, addDoc, serverTimestamp } from '@/lib/firebase';
import { updateMetaTags, generateProductSchema } from '@/lib/seo';
import { formatGHS } from '@/lib/utils';
import VerifiedSellerBadge from '@/components/marketplace/VerifiedSellerBadge';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
          setProduct(data);
          updateMetaTags(data.title, data.description, data.images[0]);
          
          // Inject JSON-LD
          const script = document.createElement('script');
          script.type = 'application/ld+json';
          script.text = JSON.stringify(generateProductSchema(data));
          document.head.appendChild(script);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const handleStartChat = async () => {
    if (!user) {
      toast.error('Please login to chat with the seller');
      navigate('/login');
      return;
    }
    if (!product) return;

    if (user.uid === product.sellerId) {
      toast.info("This is your own product!");
      return;
    }

    try {
      const chatsRef = collection(db, 'chats');
      const q = query(
        chatsRef,
        where('buyerId', '==', user.uid),
        where('sellerId', '==', product.sellerId)
      );
      const snapshot = await getDocs(q);
      
      let chatId = '';
      if (snapshot.empty) {
        const newChat = await addDoc(chatsRef, {
          buyerId: user.uid,
          sellerId: product.sellerId,
          lastMessage: '',
          updatedAt: serverTimestamp(),
          productId: product.id
        });
        chatId = newChat.id;
      } else {
        chatId = snapshot.docs[0].id;
      }

      navigate('/messages', { state: { chatId } });
    } catch (error) {
      toast.error('Could not start chat');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center flex-col gap-4">
      <div className="h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Loading Product...</p>
    </div>
  );
  
  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
      <div className="bg-slate-100 p-8 rounded-full mb-6">
        <ShoppingCart className="h-20 w-20 text-slate-300" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Product Not Found</h2>
      <p className="text-slate-500 mb-6">The item you're looking for might have been removed or is no longer available.</p>
      <Link to="/"><Button className="bg-orange-600 hover:bg-orange-700">Back to Homepage</Button></Link>
    </div>
  );

  return (
    <div className="bg-slate-50 min-h-screen pb-12">
      <div className="container mx-auto px-4 py-8">
        <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-orange-600 font-bold text-xs uppercase mb-6 transition-colors">
           <ChevronLeft className="h-4 w-4" />
           Back to shopping
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5">
             <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               className="bg-white rounded-xl p-4 md:p-8 shadow-sm border sticky top-24"
             >
                <div className="aspect-square bg-white rounded-lg overflow-hidden mb-6 flex items-center justify-center">
                  <img 
                    src={product.images[0]} 
                    alt={product.title} 
                    className="w-full h-full object-contain hover:scale-105 transition-transform duration-700"
                  />
                </div>
                <div className="flex gap-4 overflow-x-auto pb-2">
                   {product.images.map((img, i) => (
                     <div key={i} className="h-20 w-20 rounded-md border-2 border-slate-100 cursor-pointer hover:border-orange-500 overflow-hidden shrink-0 transition-all">
                       <img src={img} alt="" className="w-full h-full object-cover" />
                     </div>
                   ))}
                </div>
             </motion.div>
          </div>

          <div className="lg:col-span-4">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl p-6 md:p-8 shadow-sm border"
            >
              <div className="flex flex-wrap items-center gap-2 mb-4">
                {product.isVerifiedSeller ? <VerifiedSellerBadge /> : <Badge variant="outline" className="font-bold uppercase text-[10px]">Marketly Store</Badge>}
                <Badge variant="secondary" className="text-blue-600 bg-blue-50 border-none font-bold uppercase text-[10px]">{product.category}</Badge>
              </div>
              
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 tracking-tight">{product.title}</h1>
              
              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                 <div className="flex items-center gap-1.5">
                    <div className="flex text-orange-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-slate-200'}`} />
                      ))}
                    </div>
                    <span className="text-sm font-bold text-slate-900">{product.rating || 0}</span>
                 </div>
                 <div className="h-4 w-px bg-slate-200"></div>
                 <span className="text-xs text-blue-600 font-bold hover:underline cursor-pointer">120 Verified Reviews</span>
              </div>

              <div className="mb-8">
                <div className="flex items-baseline gap-3 mb-1">
                   <span className="text-3xl font-black text-slate-900">{formatGHS(product.price)}</span>
                   <span className="text-sm text-slate-400 line-through">{formatGHS(product.price * 1.25)}</span>
                   <Badge className="bg-red-100 text-red-600 hover:bg-red-100 border-none font-black">-25%</Badge>
                </div>
                <p className="text-xs text-slate-400 italic">Secure your item today. Price inclusive of all taxes.</p>
              </div>

              <div className="flex flex-col gap-4 mb-8">
                 <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-lg border border-slate-100">
                    <span className="text-xs font-bold uppercase text-slate-500">Quantity:</span>
                    <div className="flex items-center border bg-white rounded-md overflow-hidden">
                       <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors font-bold">-</button>
                       <span className="w-12 h-10 flex items-center justify-center border-x font-bold">{quantity}</span>
                       <button onClick={() => setQuantity(q => Math.min(product.stock, q+1))} className="w-10 h-10 flex items-center justify-center hover:bg-slate-50 transition-colors font-bold">+</button>
                    </div>
                    <span className="text-[10px] font-bold text-orange-600 uppercase">{product.stock} items left</span>
                 </div>

                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                   <Button 
                     onClick={() => addToCart(product, quantity)}
                     className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-black text-lg uppercase shadow-xl shadow-orange-100 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all"
                     disabled={product.stock === 0}
                   >
                     <ShoppingCart className="h-6 w-6 mr-3" />
                     Add To Cart
                   </Button>
                   <Button 
                    onClick={() => { addToCart(product, quantity); navigate('/checkout'); }}
                    variant="outline" 
                    className="w-full h-14 border-2 border-orange-600 text-orange-600 font-black uppercase hover:bg-orange-50"
                    disabled={product.stock === 0}
                   >
                      Buy Now
                   </Button>
                 </div>
              </div>

              <div className="pt-6 border-t">
                 <h4 className="font-black text-xs mb-4 uppercase text-slate-400 tracking-widest">Description</h4>
                 <p className="text-sm text-slate-600 leading-relaxed">
                   {product.description}
                 </p>
              </div>
            </motion.div>
          </div>

          <div className="lg:col-span-3 space-y-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border overflow-hidden">
                 <h3 className="font-black text-xs mb-4 uppercase text-slate-400 tracking-widest border-b pb-2">Delivery Info</h3>
                 <div className="space-y-6">
                    <div className="flex gap-4">
                       <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600 shrink-0">
                          <Truck className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Standard Shipping</p>
                          <p className="text-[10px] text-slate-500">Delivery in 3-5 business days.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center text-green-600 shrink-0">
                          <RefreshCw className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Easy Returns</p>
                          <p className="text-[10px] text-slate-500">Free returns within 7 days of delivery.</p>
                       </div>
                    </div>
                    <div className="flex gap-4">
                       <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center text-orange-600 shrink-0">
                          <ShieldCheck className="h-5 w-5" />
                       </div>
                       <div>
                          <p className="text-xs font-bold">Buyer Protection</p>
                          <p className="text-[10px] text-slate-500">Secure payments and verified sellers.</p>
                       </div>
                    </div>
                 </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border">
                 <h3 className="font-black text-xs mb-4 uppercase text-slate-400 tracking-widest border-b pb-2">Sold By</h3>
                 <div className="mb-6">
                    <div className="flex items-center gap-4">
                       <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center text-orange-600 text-xl font-black shrink-0">
                          {product.sellerName.charAt(0)}
                       </div>
                       <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-bold truncate max-w-[120px]">{product.sellerName}</p>
                            {product.isVerifiedSeller && <VerifiedSellerBadge className="scale-75 origin-left" />}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                             <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none text-[8px] font-black uppercase">98% Positive</Badge>
                          </div>
                       </div>
                    </div>
                 </div>
                 <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-3 text-blue-600 border-blue-600 hover:bg-blue-50 font-bold h-12 uppercase text-xs"
                  onClick={handleStartChat}
                 >
                    <MessageSquare className="h-5 w-5" />
                    Ask the Seller
                 </Button>
                 <p className="text-[10px] text-center text-slate-400 mt-4">Average response time: 2 hours</p>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;