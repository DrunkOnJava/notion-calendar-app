"use client"

import { useState } from "react"
import { X, Bell, Check, Trash2, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Notification {
  id: string
  type: "reminder" | "event-change" | "invitation" | "booking" | "system"
  title: string
  message: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  eventId?: string
}

interface NotificationCenterProps {
  isOpen: boolean
  onClose: () => void
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
  onDelete: (id: string) => void
  onClearAll: () => void
}

export function NotificationCenter({
  isOpen,
  onClose,
  notifications,
  onMarkAsRead,
  onMarkAllAsRead,
  onDelete,
  onClearAll,
}: NotificationCenterProps) {
  const [filter, setFilter] = useState<"all" | "unread">("all")

  if (!isOpen) return null

  const filteredNotifications = filter === "unread" ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "reminder":
        return "⏰"
      case "event-change":
        return "📝"
      case "invitation":
        return "📨"
      case "booking":
        return "📅"
      case "system":
        return "ℹ️"
      default:
        return "🔔"
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center sm:justify-end z-50">
      <div className="bg-[#1c1c1c] rounded-t-lg sm:rounded-lg w-full sm:w-[400px] sm:mr-4 max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-info text-info-foreground text-xs font-medium px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1.5 rounded">
            <X className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-[#2a2a2a]">
          <button
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              filter === "all" ? "bg-info text-info-foreground" : "text-[#9a9a9a] hover:bg-[#2a2a2a]",
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={cn(
              "px-3 py-1 text-sm rounded transition-colors",
              filter === "unread" ? "bg-info text-info-foreground" : "text-[#9a9a9a] hover:bg-[#2a2a2a]",
            )}
          >
            Unread ({unreadCount})
          </button>
          <div className="flex-1"></div>
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllAsRead}
                className="text-xs text-info hover:text-info/80"
                title="Mark all as read"
              >
                <Check className="w-4 h-4" />
              </button>
              <button onClick={onClearAll} className="text-xs text-[#9a9a9a] hover:text-white" title="Clear all">
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-center p-6">
              <Bell className="w-12 h-12 text-[#4a4a4a] mb-3" />
              <p className="text-[#9a9a9a] text-sm">No notifications</p>
              <p className="text-[#6b6b6b] text-xs mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "p-4 hover:bg-[#202020] transition-colors cursor-pointer",
                    !notification.read && "bg-info/10",
                  )}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-2xl shrink-0">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className={cn("text-sm font-medium", !notification.read && "text-info-foreground")}>
                          {notification.title}
                        </h3>
                        {!notification.read && <div className="w-2 h-2 rounded-full bg-info shrink-0 mt-1"></div>}
                      </div>
                      <p className="text-sm text-[#9a9a9a] mb-2">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6b6b6b]">{formatTimestamp(notification.timestamp)}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(notification.id)
                          }}
                          className="text-xs text-[#6b6b6b] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#2a2a2a]">
          <button className="w-full text-sm text-[#9a9a9a] hover:text-white flex items-center justify-center gap-2 py-2">
            <Settings className="w-4 h-4" />
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}
