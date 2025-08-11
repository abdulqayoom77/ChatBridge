"use client"

import { createContext, useContext } from "react"
import { useNotificationStore } from "../store/useNotificationStore"
import { useNotificationSetup } from "../hooks/useNotificationSetup"

const NotificationContext = createContext()

export const NotificationProvider = ({ children }) => {
  // Set up notifications
  useNotificationSetup()

  // Get notification state
  const { unreadMessages, isConnected, markAsRead, clearAll, addTestNotification } = useNotificationStore()

  const value = {
    unreadMessages,
    unreadCount: unreadMessages.length,
    isConnected,
    markAsRead,
    clearAllNotifications: clearAll,
    addTestNotification,
  }

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
}

export const useNotifications = () => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error("useNotifications must be used within NotificationProvider")
  }
  return context
}
