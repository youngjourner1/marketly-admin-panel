import React, { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { db, storage } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Store, Upload, Phone, Mail, Instagram, CheckCircle } from 'lucide-react';

interface SellerProfileSetupProps {
  onComplete?: () => void;
}

const SellerProfileSetup: React.FC<SellerProfileSetupProps> = ({ onComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    storeName: '',
    description: '',
    phone: '',
    email: user?.email || '',
    whatsapp: '',
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    try {
      let logoUrl = '';
      if (logoFile) {
        const storageRef = ref(storage, `sellers/${user.uid}/logo`);
        const snapshot = await uploadBytes(storageRef, logoFile);
        logoUrl = await getDownloadURL(snapshot.ref);
      }

      await setDoc(doc(db, 'sellers', user.uid), {
        userId: user.uid,
        storeName: formData.storeName,
        description: formData.description,
        storeLogo: logoUrl,
        contactOptions: {
          phone: formData.phone,
          email: formData.email,
          whatsapp: formData.whatsapp,
        },
        verified: true,
        createdAt: serverTimestamp(),
      });

      toast.success('Store profile updated successfully!');
      if (onComplete) onComplete();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update store profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto bg-white rounded-3xl shadow-xl border overflow-hidden"
    >
      <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Store size={120} />
        </div>
        <h2 className="text-3xl font-bold mb-2">Setup Your Store</h2>
        <p className="text-slate-400">Tell your customers about your business in Ghana.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-8">
        <div className="flex flex-col items-center justify-center p-8 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 hover:border-orange-400 transition-colors cursor-pointer relative">
          <input 
            type="file" 
            accept="image/*" 
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleFileChange}
          />
          {previewUrl ? (
            <img src={previewUrl} alt="Preview" className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg" />
          ) : (
            <div className="h-32 w-32 rounded-full bg-white flex flex-col items-center justify-center text-slate-400 shadow-sm">
              <Upload size={32} className="mb-2" />
              <span className="text-xs font-bold uppercase tracking-wider">Upload Logo</span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="storeName">Store Name</Label>
              <Input
                id="storeName"
                value={formData.storeName}
                onChange={(e) => setFormData({ ...formData, storeName: e.target.value })}
                placeholder="e.g., Kojo's Electronics"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Store Description</Label>
              <Textarea
                id="description"
                className="h-32"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell customers what makes your shop unique..."
                required
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <Label>Store Contact Number</Label>
              <div className="relative">
                <Input
                  className="pl-10"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="024 XXXXXXX"
                  required
                />
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Customer Support Email</Label>
              <div className="relative">
                <Input
                  type="email"
                  className="pl-10"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>

            <div className="space-y-2">
              <Label>WhatsApp Number (Optional)</Label>
              <div className="relative">
                <Input
                  className="pl-10"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="024 XXXXXXX"
                />
                <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <Button 
            type="submit" 
            className="w-full h-14 bg-slate-900 hover:bg-black text-white font-bold text-lg uppercase shadow-xl"
            disabled={loading}
          >
            {loading ? 'Creating Your Store...' : 'Launch My Store'}
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default SellerProfileSetup;