import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, Info } from 'lucide-react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  doc, 
  updateDoc,
  limit
} from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { AppNotification } from '@/types';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

const NotificationBell: React.FC = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    try {
      const q = query(
        collection(db, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as AppNotification[];
        setNotifications(docs);
        setUnreadCount(docs.filter(n => n.status === 'unread').length);
      }, (error) => {
        console.error("Error fetching notifications:", error);
      });

      return () => unsubscribe();
    } catch (error) {
      console.error("Setup error for notifications:", error);
    }
  }, [user]);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, 'notifications', id), {
        status: 'read'
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'seller_request_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'seller_request_rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  if (!user) return null;

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white hover:bg-orange-500 rounded-full transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-orange-600">
            {unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
            >
              <div className="p-4 border-b bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-900">Notifications</h3>
                {unreadCount > 0 && (
                  <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full font-semibold">
                    {unreadCount} New
                  </span>
                )}
              </div>

              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <Bell className="h-8 w-8 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">No notifications yet</p>
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      className={`p-4 border-b last:border-0 hover:bg-slate-50 transition-colors cursor-pointer ${n.status === 'unread' ? 'bg-orange-50/30' : ''}`}
                      onClick={() => {
                        markAsRead(n.id);
                        setIsOpen(false);
                      }}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">{getIcon(n.type)}</div>
                        <div className="flex-1">
                          <p className={`text-sm ${n.status === 'unread' ? 'font-bold' : 'font-medium'} text-slate-900`}>
                            {n.title}
                          </p>
                          <p className="text-xs text-slate-600 mt-1 line-clamp-2">
                            {n.message}
                          </p>
                          <p className="text-[10px] text-slate-400 mt-2 flex items-center gap-1">
                            {n.createdAt?.seconds ? formatDistanceToNow(n.createdAt.seconds * 1000, { addSuffix: true }) : 'Just now'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              
              {notifications.length > 0 && (
                <div className="p-2 border-t bg-slate-50 text-center">
                  <button className="text-xs font-bold text-orange-600 hover:text-orange-700">
                    View All Notifications
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;