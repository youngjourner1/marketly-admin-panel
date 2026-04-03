import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowLeft, ShoppingBag, CreditCard } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';

const Cart: React.FC = () => {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-slate-50">
        <div className="bg-white p-12 rounded-full shadow-inner mb-6">
          <ShoppingBag className="h-24 w-24 text-slate-200" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your cart is empty!</h2>
        <p className="text-slate-500 mb-8 max-w-xs text-center">Browse our categories and discover our best deals!</p>
        <Link to="/">
          <Button className="bg-orange-600 hover:bg-orange-700 px-8 py-6 text-lg font-bold uppercase rounded-md shadow-lg shadow-orange-200">
            Start Shopping
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-8 flex items-center gap-3">
          <ShoppingBag className="h-6 w-6 text-orange-600" />
          Shopping Cart ({totalItems} items)
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            <AnimatePresence>
              {cart.map((item) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="bg-white rounded-lg p-4 shadow-sm border flex gap-4 md:gap-6"
                >
                  <Link to={`/product/${item.id}`} className="w-24 h-24 md:w-32 md:h-32 rounded-md overflow-hidden bg-gray-50 shrink-0">
                    <img src={item.images[0]} alt={item.title} className="w-full h-full object-contain" />
                  </Link>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2 mb-1">
                        <Link to={`/product/${item.id}`} className="font-medium text-sm md:text-base line-clamp-1 hover:text-orange-600">
                          {item.title}
                        </Link>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400 mb-2">Seller: {item.sellerName}</p>
                      <div className="text-lg font-bold text-black">${item.price.toLocaleString()}</div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                       <div className="flex items-center border rounded-md overflow-hidden">
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-r"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-4 py-1 text-sm font-bold min-w-[40px] text-center">{item.quantity}</span>
                          <button 
                             onClick={() => updateQuantity(item.id, item.quantity + 1)}
                             className="px-3 py-1 bg-gray-50 hover:bg-gray-100 border-l"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                       </div>
                       <div className="font-bold text-orange-600">
                          Subtotal: ${(item.price * item.quantity).toLocaleString()}
                       </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link to="/" className="inline-flex items-center gap-2 text-orange-600 font-semibold hover:underline mt-4">
              <ArrowLeft className="h-4 w-4" />
              Continue Shopping
            </Link>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-4">
             <div className="bg-white rounded-lg p-6 shadow-sm border sticky top-24">
                <h2 className="text-lg font-bold uppercase mb-6 border-b pb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                   <div className="flex justify-between text-slate-600">
                      <span>Subtotal ({totalItems} items)</span>
                      <span>${totalPrice.toLocaleString()}</span>
                   </div>
                   <div className="flex justify-between text-slate-600">
                      <span>Shipping</span>
                      <span className="text-green-600 font-medium">Calculated at checkout</span>
                   </div>
                   <div className="pt-4 border-t flex justify-between items-center">
                      <span className="font-bold text-lg">Total</span>
                      <span className="font-bold text-2xl text-orange-600">${totalPrice.toLocaleString()}</span>
                   </div>
                </div>

                <Button 
                  onClick={() => navigate('/checkout')}
                  className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg uppercase shadow-lg shadow-orange-200"
                >
                  <CreditCard className="h-5 w-5 mr-3" />
                  Checkout
                </Button>

                <div className="mt-6 space-y-3">
                   <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">Secure Payment Guaranteed</p>
                   <div className="flex justify-center gap-4 opacity-50 grayscale">
                      <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-6" />
                      <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="Paypal" className="h-4" />
                   </div>
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;