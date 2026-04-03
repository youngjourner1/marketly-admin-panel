import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Chat } from '@/types';
import { MessageSquare, Search, ChevronRight, Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';
import ChatWindow from '@/components/chat/ChatWindow';
import { motion } from 'framer-motion';

const ChatInterface: React.FC = () => {
  const { profile } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [receiverId, setReceiverId] = useState<string | null>(null);

  useEffect(() => {
    if (!profile) return;

    const roleField = profile.role === 'buyer' ? 'buyerId' : 'sellerId';
    const q = query(
      collection(db, 'chats'),
      where(roleField, '==', profile.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Chat));
      setChats(chatList);
    });

    return () => unsubscribe();
  }, [profile]);

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-orange-600" />
          Messages
        </h1>

        <div className="bg-white rounded-2xl shadow-xl border overflow-hidden flex h-[700px]">
          {/* Chat List Sidebar */}
          <div className="w-full md:w-80 border-r flex flex-col shrink-0">
            <div className="p-4 border-b">
               <div className="relative">
                  <Input placeholder="Search messages..." className="pl-10 h-10 bg-slate-50 border-none" />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
               </div>
            </div>
            
            <div className="flex-1 overflow-y-auto divide-y">
               {chats.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-8 text-center opacity-30 mt-20">
                    <MessageSquare className="h-16 w-16 mb-4" />
                    <p className="font-bold">No Conversations</p>
                    <p className="text-sm">Start a chat with a {profile?.role === 'buyer' ? 'seller' : 'buyer'} to see it here.</p>
                 </div>
               ) : (
                 chats.map((chat) => (
                   <motion.div 
                     key={chat.id}
                     whileHover={{ backgroundColor: 'rgb(248 250 252)' }}
                     onClick={() => {
                       setActiveChatId(chat.id);
                       setReceiverId(profile?.role === 'buyer' ? chat.sellerId : chat.buyerId);
                     }}
                     className={`p-4 cursor-pointer flex items-center gap-4 transition-colors ${activeChatId === chat.id ? 'bg-orange-50 border-l-4 border-orange-600' : ''}`}
                   >
                     <div className="h-12 w-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold shrink-0">
                        {profile?.role === 'buyer' ? 'S' : 'B'}
                     </div>
                     <div className="flex-1 overflow-hidden">
                        <div className="flex justify-between items-center mb-1">
                           <p className="font-bold text-sm truncate">Chat with {profile?.role === 'buyer' ? 'Seller' : 'Buyer'}</p>
                           <p className="text-[10px] text-gray-400 flex items-center gap-1"><Clock className="h-2 w-2" /> 2m</p>
                        </div>
                        <p className="text-xs text-gray-500 truncate">{chat.lastMessage || 'Click to start chatting'}</p>
                     </div>
                     <ChevronRight className="h-4 w-4 text-slate-300" />
                   </motion.div>
                 ))
               )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div className="flex-1 flex flex-col bg-slate-50">
            {activeChatId && receiverId ? (
               <div className="h-full flex flex-col relative">
                  <ChatWindow chatId={activeChatId} receiverId={receiverId} onClose={() => setActiveChatId(null)} />
               </div>
            ) : (
               <div className="flex-1 flex flex-col items-center justify-center opacity-20">
                  <div className="bg-white p-12 rounded-full mb-6">
                    <MessageSquare className="h-24 w-24" />
                  </div>
                  <h3 className="text-2xl font-bold">Select a message</h3>
                  <p className="text-lg">to start a conversation</p>
               </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;