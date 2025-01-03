import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import * as messageService from '../services/messageService';
import type { Database } from '../types/supabase';
import { toast } from 'react-hot-toast';

type Profile = Database['public']['Tables']['profiles']['Row'];

type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  content: string;
  read: boolean;
  created_at: string;
  sender: Profile;
  recipient: Profile;
};

type Conversation = {
  partnerId: string;
  partner: Profile;
  lastMessage: Message;
  unreadCount: number;
};

interface MessageState {
  messages: Message[];
  conversations: Conversation[];
  loading: boolean;
  fetchMessages: () => Promise<void>;
  sendMessage: (recipientId: string, content: string) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addMessage: (message: Message) => void;
}

export const useMessageStore = create<MessageState>((set, get) => ({
  messages: [],
  conversations: [],
  loading: false,

  fetchMessages: async () => {
    set({ loading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');
      
      const messages = await messageService.getMessages(user.id);
      
      // Group messages by conversation partner
      const conversationsMap = new Map<string, Conversation>();
      
      messages.forEach(message => {
        const isCurrentUserSender = message.sender_id === user.id;
        const partnerId = isCurrentUserSender ? message.recipient_id : message.sender_id;
        const partner = isCurrentUserSender ? message.recipient : message.sender;
        
        const existing = conversationsMap.get(partnerId);
        const messageDate = new Date(message.created_at).getTime();
        
        if (!existing || messageDate > new Date(existing.lastMessage.created_at).getTime()) {
          conversationsMap.set(partnerId, {
            partnerId,
            partner,
            lastMessage: message,
            unreadCount: (!isCurrentUserSender && !message.read) ? 1 : 0
          });
        } else if (!isCurrentUserSender && !message.read) {
          existing.unreadCount++;
        }
      });
      
      const conversations = Array.from(conversationsMap.values())
        .sort((a, b) => 
          new Date(b.lastMessage.created_at).getTime() - 
          new Date(a.lastMessage.created_at).getTime()
        );

      set({ messages, conversations });
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to fetch messages');
    } finally {
      set({ loading: false });
    }
  },

  sendMessage: async (recipientId, content) => {
    try {
      await messageService.sendMessage(recipientId, content);
      await get().fetchMessages();
      toast.success('Message sent!');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
      throw error;
    }
  },

  markAsRead: async (id) => {
    try {
      await messageService.markMessageAsRead(id);
      const messages = get().messages.map(m =>
        m.id === id ? { ...m, read: true } : m
      );
      set({ messages });
      await get().fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
      toast.error('Failed to mark message as read');
    }
  },

  addMessage: (message) => {
    set(state => {
      const messages = [message, ...state.messages];
      // Show toast for new message
      toast.success('New message received!', {
        duration: 4000,
        icon: '✉️'
      });
      return { messages };
    });
    get().fetchMessages(); // Refresh conversations
  }
}));