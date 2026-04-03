import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Store, Upload, CheckCircle, ArrowRight } from 'lucide-react';

const StoreSetup: React.FC = () => {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  
  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    storeLogo: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState('');

  useEffect(() => {
    // Check if already setup
    const checkSetup = async () => {
      if (!user) return;
      const docRef = doc(db, 'sellers', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        navigate('/seller/dashboard');
      }
    };
    checkSetup();
  }, [user, navigate]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    
    setLoading(true);
    try {
      let logoUrl = '';
      if (logoFile) {
        const logoRef = ref(storage, `sellers/${user.uid}/logo_${Date.now()}`);
        await uploadBytes(logoRef, logoFile);
        logoUrl = await getDownloadURL(logoRef);
      }

      await setDoc(doc(db, 'sellers', user.uid), {
        userId: user.uid,
        storeName: formData.storeName,
        description: formData.description,
        storeLogo: logoUrl || 'https://via.placeholder.com/150?text=Store+Logo',
        verified: true, // Auto verified as they were approved by admin
        createdAt: serverTimestamp(),
      });

      setStep(2);
      toast.success('Store setup completed successfully!');
    } catch (error: any) {
      toast.error('Failed to setup store: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-orange-50">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white p-8 rounded-3xl shadow-2xl text-center border-4 border-orange-500"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="h-14 w-14 text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">Welcome, {formData.storeName}!</h2>
          <p className="text-slate-600 mb-8">
            Your store is now live on Marketly. You can start listing your products and reach thousands of customers across Ghana.
          </p>
          <img 
            src="https://storage.googleapis.com/dala-prod-public-storage/generated-images/c80f77b2-406e-4a15-b95c-88c1d180af57/seller-welcome-banner-7524847e-1775244226984.webp" 
            alt="Welcome" 
            className="w-full h-40 object-cover rounded-xl mb-8"
          />
          <Button 
            onClick={() => navigate('/seller/dashboard')} 
            className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-lg font-bold"
          >
            Go to Seller Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-xl overflow-hidden border border-orange-100"
        >
          <div className="grid grid-cols-1 md:grid-cols-5">
            <div className="md:col-span-2 bg-orange-600 p-8 text-white flex flex-col justify-center items-center text-center">
              <Store className="h-16 w-16 mb-6 opacity-80" />
              <h1 className="text-3xl font-bold mb-4">Final Step!</h1>
              <p className="text-orange-50 opacity-90">Set up your digital storefront and tell customers what makes your business special.</p>
            </div>

            <div className="md:col-span-3 p-8 md:p-12">
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="space-y-2">
                  <Label htmlFor="storeName" className="text-lg font-bold text-slate-700">Store Name</Label>
                  <Input
                    id="storeName"
                    required
                    placeholder="e.g. Ama's Organic Spices"
                    className="h-12 border-2 focus-visible:ring-orange-600 text-lg"
                    value={formData.storeName}
                    onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                  />
                </div>

                <div className="space-y-4">
                  <Label className="text-lg font-bold text-slate-700">Store Logo</Label>
                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 rounded-2xl border-2 border-dashed border-slate-300 flex items-center justify-center overflow-hidden bg-slate-50 group">
                      {logoPreview ? (
                        <img src={logoPreview} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <Store className="h-10 w-10 text-slate-300 group-hover:text-orange-400 transition-colors" />
                      )}
                    </div>
                    <div className="flex-1">
                      <Label 
                        htmlFor="logo-upload" 
                        className="inline-flex items-center px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg cursor-pointer transition-colors border border-slate-300 font-semibold"
                      >
                        <Upload className="mr-2 h-4 w-4" /> Upload Image
                      </Label>
                      <Input 
                        id="logo-upload" 
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileChange}
                      />
                      <p className="text-xs text-slate-400 mt-2">Recommended: Square aspect ratio, PNG or JPG (Max 2MB)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-lg font-bold text-slate-700">About Your Store</Label>
                  <Textarea
                    id="description"
                    required
                    placeholder="Share your story, values, or what products you specialize in..."
                    className="min-h-[150px] border-2 focus-visible:ring-orange-600"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-14 bg-orange-600 hover:bg-orange-700 text-white font-bold text-xl shadow-lg shadow-orange-100"
                  disabled={loading}
                >
                  {loading ? 'Setting up...' : 'Create My Store'}
                </Button>
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default StoreSetup;