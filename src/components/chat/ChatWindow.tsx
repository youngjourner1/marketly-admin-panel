import React, { useState, useEffect, useRef } from 'react';
import { 
  collection, query, where, orderBy, onSnapshot, addDoc, serverTimestamp, doc, getDoc 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/context/AuthContext';
import { ChatMessage, UserProfile } from '@/types';
import { Send, User, ShieldAlert, X, Maximize2, Minimize2, Check, CheckCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

interface ChatWindowProps {
  chatId: string;
  receiverId: string;
  onClose?: () => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ chatId, receiverId, onClose }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [receiver, setReceiver] = useState<UserProfile | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, 'messages'),
      where('chatId', '==', chatId),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ChatMessage));
      setMessages(msgs);
    });

    const fetchReceiver = async () => {
      const docRef = doc(db, 'users', receiverId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setReceiver(docSnap.data() as UserProfile);
      }
    };
    fetchReceiver();

    return () => unsubscribe();
  }, [chatId, receiverId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !user) return;

    // SECURITY: Anti-Fraud Pattern Detection
    const phoneRegex = /(\+?\d{1,4}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}/g;
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;

    if (phoneRegex.test(newMessage) || emailRegex.test(newMessage)) {
      toast.error('Restricted: For your safety, do not share phone numbers or emails in chat.');
      return;
    }

    try {
      await addDoc(collection(db, 'messages'), {
        chatId,
        senderId: user.uid,
        receiverId,
        message: newMessage,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
    } catch (error) {
      toast.error('Message failed to send');
    }
  };

  return (
    <motion.div 
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed bottom-0 right-4 w-96 bg-white border border-slate-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-t-3xl z-50 overflow-hidden flex flex-col transition-all duration-500 ${isMinimized ? 'h-16' : 'h-[600px]'}`}
    >
      <div className="bg-slate-900 p-5 text-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
           <div className="h-10 w-10 bg-orange-600 rounded-xl flex items-center justify-center font-black text-sm shadow-lg shadow-orange-900/40">
              {receiver?.name.charAt(0) || '?'}
           </div>
           <div>
              <p className="text-sm font-black tracking-tight leading-none">{receiver?.name || 'Store Agent'}</p>
              <div className="flex items-center gap-1.5 mt-1">
                 <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Verified Seller</p>
              </div>
           </div>
        </div>
        <div className="flex items-center gap-1">
           <button onClick={() => setIsMinimized(!isMinimized)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
              {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
           </button>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl transition-all text-red-400">
              <X className="h-4 w-4" />
           </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          <div className="bg-orange-600 p-2 text-[10px] font-black text-white flex items-center justify-center gap-2 uppercase tracking-widest">
             <ShieldAlert className="h-3 w-3 shrink-0" />
             Secure End-to-End Chat
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50">
            {messages.map((msg, i) => {
              const isMe = msg.senderId === user?.uid;
              return (
                <div key={msg.id || i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] px-5 py-3 rounded-2xl text-sm font-medium shadow-sm ${
                    isMe ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none border border-slate-200'
                  }`}>
                    {msg.message}
                    <div className={`flex items-center justify-end gap-1 mt-1 ${isMe ? 'text-orange-200' : 'text-slate-400'}`}>
                       <span className="text-[8px] font-bold">{msg.createdAt?.toDate ? msg.createdAt.toDate().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Just now'}</span>
                       {isMe && <CheckCheck className="h-3 w-3" />}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={scrollRef} />
          </div>

          <form onSubmit={handleSendMessage} className="p-5 bg-white border-t flex gap-3 items-center">
             <Input 
               placeholder="Type your message safely..." 
               className="flex-1 h-12 bg-slate-50 border-none shadow-none focus-visible:ring-2 focus-visible:ring-orange-600 font-medium"
               value={newMessage}
               onChange={(e) => setNewMessage(e.target.value)}
             />
             <Button type="submit" className="h-12 w-12 p-0 bg-orange-600 hover:bg-orange-700 shadow-lg shadow-orange-100 shrink-0 rounded-xl">
                <Send className="h-5 w-5" />
             </Button>
          </form>
        </>
      )}
    </motion.div>
  );
};

export default ChatWindow;