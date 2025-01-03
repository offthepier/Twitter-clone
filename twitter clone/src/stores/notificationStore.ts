import { create } from 'zustand';
import * as notificationService from '../services/notificationService';
import { toast } from 'react-hot-toast';
import type { Database } from '../types/supabase';

type Notification = Database['public']['Tables']['notifications']['Row'] & {
  actor: Database['public']['Tables']['profiles']['Row'];
  tweet?: Database['public']['Tables']['tweets']['Row'];
};

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  fetchNotifications: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  loading: false,

  fetchNotifications: async () => {
    set({ loading: true });
    try {
      const notifications = await notificationService.getNotifications();
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast.error('Failed to fetch notifications');
    } finally {
      set({ loading: false });
    }
  },

  markAsRead: async (id) => {
    try {
      await notificationService.markNotificationAsRead(id);
      const notifications = get().notifications.map(n =>
        n.id === id ? { ...n, read: true } : n
      );
      const unreadCount = notifications.filter(n => !n.read).length;
      set({ notifications, unreadCount });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast.error('Failed to mark notification as read');
    }
  },

  addNotification: (notification) => {
    set(state => {
      const notifications = [notification, ...state.notifications];
      const unreadCount = notifications.filter(n => !n.read).length;
      
      // Show toast for new notification
      const notificationTypes = {
        like: 'liked your tweet',
        retweet: 'retweeted your tweet',
        follow: 'followed you',
        mention: 'mentioned you'
      };
      
      const message = `${notification.actor.display_name || notification.actor.username} ${
        notificationTypes[notification.type as keyof typeof notificationTypes]
      }`;
      
      toast.success(message, {
        duration: 4000,
        icon: '🔔'
      });
      
      return { notifications, unreadCount };
    });
  }
}));