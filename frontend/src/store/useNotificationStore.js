import { create } from "zustand";
import toast from "react-hot-toast";

export const useNotificationStore = create((set, get) => ({
  unreadMessages: [],
  isConnected: false,

  addNotification: (notification) => {
    set((state) => {
      const exists = state.unreadMessages.find(
        (msg) => msg.id === notification.id
      );
      if (exists) {
        return state;
      }

      toast.success(`New message from ${notification.senderName}`, {
        duration: 4000,
        onClick: () => {
          window.location.href = `/chat/${notification.senderId}`;
        },
      });

      return {
        unreadMessages: [...state.unreadMessages, notification],
      };
    });
  },

  markAsRead: (channelId) => {
    set((state) => ({
      unreadMessages: state.unreadMessages.filter(
        (msg) => msg.channelId !== channelId
      ),
    }));
  },

  clearAll: () => {
    set({ unreadMessages: [] });
  },

  setConnected: (connected) => {
    set({ isConnected: connected });
  },
}));
