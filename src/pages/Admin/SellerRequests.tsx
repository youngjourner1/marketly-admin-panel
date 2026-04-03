import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { SellerRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  ShoppingBag, 
  ExternalLink,
  Search
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

const AdminSellerRequests: React.FC = () => {
  const [requests, setRequests] = useState<SellerRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [selectedRequest, setSelectedRequest] = useState<SellerRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const q = query(collection(db, 'seller_requests'), where('status', '==', filter));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as SellerRequest[];
      setRequests(docs.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [filter]);

  const handleApprove = async (request: SellerRequest) => {
    try {
      const batch = writeBatch(db);
      
      // 1. Update request status
      const requestRef = doc(db, 'seller_requests', request.id);
      batch.update(requestRef, {
        status: 'approved',
        reviewedAt: serverTimestamp()
      });

      // 2. Update user role to seller
      const userRef = doc(db, 'users', request.userId);
      batch.update(userRef, {
        role: 'seller',
        isSellerRequestPending: false
      });

      await batch.commit();
      toast.success(`Approved ${request.fullName} as a seller!`);
    } catch (error: any) {
      toast.error('Failed to approve request: ' + error.message);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest || !rejectionReason.trim()) return;

    try {
      const batch = writeBatch(db);
      
      // 1. Update request status
      const requestRef = doc(db, 'seller_requests', selectedRequest.id);
      batch.update(requestRef, {
        status: 'rejected',
        reviewNote: rejectionReason,
        reviewedAt: serverTimestamp()
      });

      // 2. Update user status
      const userRef = doc(db, 'users', selectedRequest.userId);
      batch.update(userRef, {
        isSellerRequestPending: false
      });

      await batch.commit();
      toast.error(`Rejected ${selectedRequest.fullName}'s application.`);
      setIsRejectDialogOpen(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error: any) {
      toast.error('Failed to reject request: ' + error.message);
    }
  };

  const filteredRequests = requests.filter(r => 
    r.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.phone.includes(searchTerm) ||
    r.businessName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Seller Applications</h1>
          <p className="text-slate-500">Review and manage requests from buyers to become sellers.</p>
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {(['pending', 'approved', 'rejected'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-all ${
                filter === s ? 'bg-white text-orange-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search by name, phone or business..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map(i => <div key={i} className="h-64 bg-slate-100 rounded-2xl" />)}
        </div>
      ) : filteredRequests.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <ShoppingBag className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 font-medium">No {filter} requests found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
              >
                {request.status === 'pending' && <div className="absolute top-0 right-0 w-2 h-full bg-orange-500" />}
                
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                    <User className="h-6 w-6 text-slate-500" />
                  </div>
                  <Badge variant={request.status === 'approved' ? 'default' : request.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {request.status.toUpperCase()}
                  </Badge>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-1">{request.fullName}</h3>
                {request.businessName && <p className="text-orange-600 font-semibold text-sm mb-3">{request.businessName}</p>}

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-slate-600">
                    <Phone className="h-4 w-4 mr-2 text-slate-400" /> {request.phone}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <CreditCard className="h-4 w-4 mr-2 text-slate-400" /> {request.ghanaCardId}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <MapPin className="h-4 w-4 mr-2 text-slate-400" /> {request.location}
                  </div>
                  <div className="flex items-center text-sm text-slate-600">
                    <ShoppingBag className="h-4 w-4 mr-2 text-slate-400" /> {request.category}
                  </div>
                </div>

                {filter === 'pending' && (
                  <div className="flex gap-3">
                    <Button 
                      className="flex-1 bg-green-600 hover:bg-green-700"
                      onClick={() => handleApprove(request)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                    <Button 
                      variant="outline"
                      className="flex-1 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        setSelectedRequest(request);
                        setIsRejectDialogOpen(true);
                      }}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Reject
                    </Button>
                  </div>
                )}

                {request.reviewNote && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-xs font-bold text-red-800 uppercase mb-1">Rejection Note:</p>
                    <p className="text-xs text-red-700">{request.reviewNote}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={isRejectDialogOpen} onOpenChange={setIsRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Application</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting {selectedRequest?.fullName}'s application. This will be visible to them.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="e.g. Invalid Ghana Card ID, Business category not supported..."
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsRejectDialogOpen(false)}>Cancel</Button>
            <Button 
              variant="destructive" 
              onClick={handleReject}
              disabled={!rejectionReason.trim()}
            >
              Confirm Rejection
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminSellerRequests;