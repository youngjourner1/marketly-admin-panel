import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Briefcase, CreditCard, Phone, MapPin, Tag, CheckCircle2 } from 'lucide-react';

const CATEGORIES = [
  'Electronics', 
  'Fashion', 
  'Home & Garden', 
  'Health & Beauty', 
  'Groceries', 
  'Others'
];

const REGIONS = [
  'Greater Accra', 
  'Ashanti', 
  'Central', 
  'Eastern', 
  'Western', 
  'Northern', 
  'Volta', 
  'Bono', 
  'Upper East', 
  'Upper West'
];

interface SellerRequestFormProps {
  onSuccess?: () => void;
}

const SellerRequestForm: React.FC<SellerRequestFormProps> = ({ onSuccess }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    ghanaCardId: '',
    businessName: '',
    location: '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      await addDoc(collection(db, 'seller_requests'), {
        userId: user.uid,
        ...formData,
        status: 'pending',
        createdAt: serverTimestamp(),
      });

      setSubmitted(true);
      toast.success('Your seller request has been submitted successfully!');
      if (onSuccess) onSuccess();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit request');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center p-8 bg-white rounded-xl border border-orange-100 shadow-sm">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
          <CheckCircle2 className="h-8 w-8" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Application Received!</h3>
        <p className="text-slate-500 max-w-sm mx-auto">
          Our team will review your Ghana Card ID and business details manually. 
          You will be notified via email once approved.
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-xl border overflow-hidden"
    >
      <div className="bg-orange-600 p-6 text-white">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Briefcase className="h-6 w-6" />
          Become a Verified Seller
        </h2>
        <p className="text-orange-100 mt-1 opacity-90">Start selling to thousands of buyers in Ghana.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name (as on Ghana Card)</Label>
            <div className="relative">
              <Input
                id="fullName"
                className="pl-10"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                required
                placeholder="John Kwame Mensah"
              />
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">WhatsApp / Phone Number</Label>
            <div className="relative">
              <Input
                id="phone"
                className="pl-10"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                required
                placeholder="024 XXXXXXX"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ghanaCardId">Ghana Card ID Number</Label>
            <div className="relative">
              <Input
                id="ghanaCardId"
                className="pl-10"
                value={formData.ghanaCardId}
                onChange={(e) => setFormData({ ...formData, ghanaCardId: e.target.value })}
                required
                placeholder="GHA-XXXXXXXXX-X"
              />
              <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="businessName">Business Name (Optional)</Label>
            <div className="relative">
              <Input
                id="businessName"
                className="pl-10"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="My Awesome Shop"
              />
              <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Location (Region)</Label>
            <div className="relative">
              <Select 
                onValueChange={(v) => setFormData({ ...formData, location: v })}
                required
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select your region" />
                </SelectTrigger>
                <SelectContent>
                  {REGIONS.map(region => (
                    <SelectItem key={region} value={region}>{region}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <MapPin className="absolute left-3 top-[34px] -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Primary Category</Label>
            <div className="relative">
              <Select 
                onValueChange={(v) => setFormData({ ...formData, category: v })}
                required
              >
                <SelectTrigger className="pl-10">
                  <SelectValue placeholder="Select product category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Tag className="absolute left-3 top-[34px] -translate-y-1/2 h-4 w-4 text-slate-400 z-10" />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit"
            className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg uppercase shadow-lg shadow-orange-100"
            disabled={loading}
          >
            {loading ? 'Submitting Application...' : 'Submit Application'}
          </Button>
          <p className="text-center text-[11px] text-slate-400 mt-4">
            By submitting, you agree to Marketly's Seller Terms & Conditions and identity verification process.
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default SellerRequestForm;