import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Phone, CreditCard, ShoppingBag, ArrowLeft } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Health', 
  'Groceries', 'Automotive', 'Real Estate', 'Jobs', 'Services'
];

const REGIONS = [
  'Greater Accra', 'Ashanti', 'Western', 'Central', 'Eastern', 
  'Northern', 'Volta', 'Upper East', 'Upper West', 'Bono', 
  'Bono East', 'Ahafo', 'Savannah', 'North East', 'Oti', 'Western North'
];

const SellerRequestForm: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: profile?.name || '',
    phone: '',
    ghanaCardId: '',
    businessName: '',
    location: '',
    region: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      // Add to seller_requests collection
      await addDoc(collection(db, 'seller_requests'), {
        userId: user.uid,
        ...formData,
        fullLocation: `${formData.location}, ${formData.region}`,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      // Update user profile status
      await updateDoc(doc(db, 'users', user.uid), {
        isSellerRequestPending: true
      });

      toast.success('Your application has been submitted successfully! We will review it shortly.');
      navigate('/');
    } catch (error: any) {
      toast.error('Failed to submit application: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (profile?.isSellerRequestPending) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-slate-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg text-center border"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Briefcase className="h-10 w-10 text-orange-600 animate-pulse" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Application Pending</h2>
          <p className="text-slate-500 mb-6">
            Your request to become a seller is currently being reviewed by our team. 
            We'll notify you via email once a decision has been made.
          </p>
          <Button onClick={() => navigate('/')} className="w-full bg-orange-600 hover:bg-orange-700">
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pt-10 pb-20 px-4">
      <div className="max-w-2xl mx-auto">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')} 
          className="mb-6 text-slate-500 hover:text-orange-600"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Marketplace
        </Button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden border"
        >
          <div className="bg-orange-600 p-8 text-white text-center">
            <Briefcase className="h-12 w-12 mx-auto mb-4 opacity-80" />
            <h1 className="text-3xl font-bold">Become a Seller</h1>
            <p className="opacity-90">Fill out the form below to start selling on Marketly</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name (As on ID)</Label>
                <div className="relative">
                  <Input
                    id="fullName"
                    required
                    className="pl-10"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number (Momo enabled)</Label>
                <div className="relative">
                  <Input
                    id="phone"
                    required
                    placeholder="024XXXXXXX"
                    className="pl-10"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ghanaCardId">Ghana Card ID</Label>
                <div className="relative">
                  <Input
                    id="ghanaCardId"
                    required
                    placeholder="GHA-XXXXXXXXX-X"
                    className="pl-10"
                    value={formData.ghanaCardId}
                    onChange={(e) => setFormData({ ...formData, ghanaCardId: e.target.value })}
                  />
                  <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name (Optional)</Label>
                <div className="relative">
                  <Input
                    id="businessName"
                    placeholder="My Store Name"
                    className="pl-10"
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  />
                  <ShoppingBag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label>Region</Label>
                <Select 
                  onValueChange={(v) => setFormData({ ...formData, region: v })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select region" />
                  </SelectTrigger>
                  <SelectContent>
                    {REGIONS.map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">City / Town</Label>
                <div className="relative">
                  <Input
                    id="location"
                    required
                    placeholder="Accra, Kumasi..."
                    className="pl-10"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Primary Product Category</Label>
              <Select 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="What will you be selling?" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(c => (
                    <SelectItem key={c} value={c}>{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              type="submit" 
              className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg shadow-lg"
              disabled={loading}
            >
              {loading ? 'Submitting Application...' : 'Submit Application'}
            </Button>

            <p className="text-center text-slate-400 text-xs">
              By submitting this form, you agree to Marketly's Seller Terms of Service and Privacy Policy.
            </p>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default SellerRequestForm;