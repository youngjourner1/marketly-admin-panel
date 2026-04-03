import React, { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShieldCheck, Truck, CreditCard, ChevronRight, MapPin, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { initializePaystack } from '@/lib/paystack';
import { db, collection, addDoc, serverTimestamp } from '@/lib/firebase';

const Checkout: React.FC = () => {
  const { cart, totalPrice, clearCart } = useCart();
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [address, setAddress] = useState({
    street: '',
    city: '',
    state: '',
    phone: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/');
    }
  }, [cart, navigate]);

  const handlePaystackPayment = () => {
    if (!user || !profile) return;
    
    setLoading(true);
    initializePaystack({
      email: user.email!,
      amount: totalPrice + 10,
      onSuccess: async (reference) => {
        try {
          // Create order in Firestore
          await addDoc(collection(db, 'orders'), {
            buyerId: user.uid,
            buyerName: profile.name,
            items: cart,
            totalAmount: totalPrice + 10,
            status: 'paid',
            paymentReference: reference,
            shippingAddress: address,
            createdAt: serverTimestamp()
          });
          
          toast.success('Order placed successfully! Reference: ' + reference);
          clearCart();
          navigate('/');
        } catch (error) {
          toast.error('Payment succeeded but order creation failed. Contact support.');
        } finally {
          setLoading(false);
        }
      },
      onClose: () => {
        setLoading(false);
        toast.info('Payment cancelled');
      }
    });
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-20 transition-all duration-300">
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <h1 className="text-3xl font-black mb-10 flex items-center gap-4 text-slate-900 tracking-tight">
           Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
           <div className="lg:col-span-8 space-y-8">
              {/* Step 1: Address */}
              <motion.div 
                layout
                className="bg-white rounded-2xl p-8 shadow-sm border overflow-hidden"
              >
                 <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                       <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-base ${step >= 1 ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-100 text-slate-400'}`}>1</div>
                       <h2 className="text-2xl font-black text-slate-900 tracking-tight">Delivery Address</h2>
                    </div>
                    {step > 1 && <button onClick={() => setStep(1)} className="text-orange-600 text-xs font-black uppercase hover:underline tracking-widest">Edit Address</button>}
                 </div>

                 {step === 1 ? (
                   <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Full Name</Label>
                            <Input defaultValue={profile?.name} className="h-12 bg-slate-50 border-none shadow-none focus-visible:ring-orange-600" />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Phone Number</Label>
                            <Input 
                              placeholder="+234 800 000 0000" 
                              className="h-12 bg-slate-50 border-none shadow-none focus-visible:ring-orange-600"
                              value={address.phone}
                              onChange={(e) => setAddress({...address, phone: e.target.value})}
                            />
                         </div>
                      </div>
                      <div className="space-y-2">
                         <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">Street Address</Label>
                         <Input 
                          placeholder="Enter your full address" 
                          className="h-12 bg-slate-50 border-none shadow-none focus-visible:ring-orange-600"
                          value={address.street}
                          onChange={(e) => setAddress({...address, street: e.target.value})}
                         />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                         <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">City</Label>
                            <Input 
                              className="h-12 bg-slate-50 border-none shadow-none focus-visible:ring-orange-600" 
                              value={address.city}
                              onChange={(e) => setAddress({...address, city: e.target.value})}
                            />
                         </div>
                         <div className="space-y-2">
                            <Label className="text-xs font-black uppercase text-slate-400 tracking-widest">State</Label>
                            <Input 
                              className="h-12 bg-slate-50 border-none shadow-none focus-visible:ring-orange-600" 
                              value={address.state}
                              onChange={(e) => setAddress({...address, state: e.target.value})}
                            />
                         </div>
                      </div>
                      <Button 
                        onClick={() => setStep(2)} 
                        disabled={!address.street || !address.phone}
                        className="bg-orange-600 hover:bg-orange-700 h-14 px-10 font-black uppercase tracking-widest text-sm shadow-xl shadow-orange-100"
                      >
                        Save & Continue
                      </Button>
                   </div>
                 ) : (
                   <div className="flex items-start gap-4 p-6 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                      <div className="h-10 w-10 bg-white rounded-lg flex items-center justify-center border shadow-sm">
                         <MapPin className="h-5 w-5 text-orange-600" />
                      </div>
                      <div>
                         <p className="font-black text-slate-900">{profile?.name}</p>
                         <p className="text-sm text-slate-500 mt-1">{address.street}, {address.city}, {address.state}</p>
                         <p className="text-xs font-bold text-slate-400 mt-2 uppercase">{address.phone}</p>
                      </div>
                   </div>
                 )}
              </motion.div>

              {/* Step 2: Payment */}
              <motion.div 
                layout
                className={`bg-white rounded-2xl p-8 shadow-sm border ${step < 2 ? 'opacity-40 grayscale pointer-events-none' : ''}`}
              >
                 <div className="flex items-center gap-4 mb-8">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center font-black text-base ${step >= 2 ? 'bg-orange-600 text-white shadow-lg shadow-orange-100' : 'bg-slate-100 text-slate-400'}`}>2</div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Payment Method</h2>
                 </div>

                 {step === 2 && (
                   <div className="space-y-8">
                      <RadioGroup defaultValue="paystack" className="space-y-4">
                        <div className="group">
                          <RadioGroupItem value="paystack" id="paystack" className="peer sr-only" />
                          <Label htmlFor="paystack" className="flex items-center justify-between p-6 border-2 rounded-2xl cursor-pointer group-hover:border-orange-200 peer-data-[state=checked]:border-orange-600 peer-data-[state=checked]:bg-orange-50 transition-all">
                             <div className="flex items-center gap-4">
                                <div className="h-12 w-12 bg-white rounded-xl flex items-center justify-center border">
                                   <CreditCard className="h-6 w-6 text-slate-600" />
                                </div>
                                <div>
                                   <p className="font-black text-slate-900">Paystack</p>
                                   <p className="text-xs text-slate-500">Card, Bank Transfer, Mobile Money</p>
                                </div>
                             </div>
                             <img src="https://upload.wikimedia.org/wikipedia/commons/e/ec/Paystack_Logo.png" alt="Paystack" className="h-5" />
                          </Label>
                        </div>
                      </RadioGroup>

                      <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex gap-4">
                         <ShieldCheck className="h-6 w-6 text-blue-600 shrink-0" />
                         <div>
                            <p className="text-blue-900 font-bold text-sm">Secure Checkout</p>
                            <p className="text-blue-700 text-xs mt-1">Your transaction is protected with 256-bit SSL encryption. We never store your card details on our servers.</p>
                         </div>
                      </div>

                      <Button 
                        onClick={handlePaystackPayment} 
                        disabled={loading}
                        className="w-full h-16 bg-orange-600 hover:bg-orange-700 text-white font-black uppercase text-xl shadow-2xl shadow-orange-100 border-b-4 border-orange-800 active:border-b-0 active:translate-y-1 transition-all"
                      >
                         {loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `Pay $${(totalPrice + 10).toLocaleString()}`}
                      </Button>
                   </div>
                 )}
              </motion.div>
           </div>

           <div className="lg:col-span-4">
              <div className="bg-white rounded-2xl p-8 shadow-sm border sticky top-24">
                 <h2 className="font-black text-xs uppercase mb-8 tracking-widest text-slate-400 border-b pb-4">Order Summary</h2>
                 <div className="space-y-6 mb-8">
                    {cart.map(item => (
                      <div key={item.id} className="flex gap-4">
                         <div className="h-16 w-16 rounded-xl bg-slate-50 border shrink-0 overflow-hidden flex items-center justify-center">
                            <img src={item.images[0]} alt="" className="w-full h-full object-contain" />
                         </div>
                         <div className="flex-1 min-w-0">
                            <p className="text-xs font-black text-slate-900 truncate">{item.title}</p>
                            <div className="flex justify-between items-center mt-2">
                               <p className="text-[10px] font-bold text-slate-400">Qty: {item.quantity}</p>
                               <p className="text-sm font-black text-slate-900">${(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-4 mb-8 pt-8 border-t border-dashed">
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Subtotal</span>
                       <span className="font-black text-slate-900">${totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                       <span className="text-slate-500 font-bold">Shipping Fee</span>
                       <span className="font-black text-green-600">$10.00</span>
                    </div>
                    <div className="pt-6 border-t flex justify-between items-center">
                       <span className="font-black text-slate-900 uppercase tracking-widest text-xs">Total Amount</span>
                       <span className="text-3xl font-black text-orange-600">${(totalPrice + 10).toLocaleString()}</span>
                    </div>
                 </div>

                 <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-3 text-[10px] font-black uppercase text-slate-400 tracking-widest mb-3">
                       <Truck className="h-4 w-4" />
                       Expected Delivery
                    </div>
                    <p className="text-sm font-black text-slate-900">By Thursday, Oct 24th</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;