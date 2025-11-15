'use client'

import { useState } from 'react'
import { X, Bell, Check, Trash2, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface Notification {
  id: string
  type: 'reminder' | 'event-change' | 'invitation' | 'booking' | 'system'
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
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  if (!isOpen) return null

  const filteredNotifications =
    filter === 'unread' ? notifications.filter((n) => !n.read) : notifications

  const unreadCount = notifications.filter((n) => !n.read).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'reminder':
        return '⏰'
      case 'event-change':
        return '📝'
      case 'invitation':
        return '📨'
      case 'booking':
        return '📅'
      case 'system':
        return 'ℹ️'
      default:
        return '🔔'
    }
  }

  const formatTimestamp = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center sm:justify-end">
      <div className="flex max-h-[80vh] w-full flex-col rounded-t-lg bg-[#1c1c1c] sm:mr-4 sm:w-[400px] sm:rounded-lg">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a2a2a] p-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <h2 className="text-lg font-semibold">Notifications</h2>
            {unreadCount > 0 && (
              <span className="bg-info text-info-foreground rounded-full px-2 py-0.5 text-xs font-medium">
                {unreadCount}
              </span>
            )}
          </div>
          <button onClick={onClose} className="rounded p-1.5 hover:bg-[#2a2a2a]">
            <X className="h-5 w-5 text-[#6b6b6b]" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-[#2a2a2a] px-4 py-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              'rounded px-3 py-1 text-sm transition-colors',
              filter === 'all'
                ? 'bg-info text-info-foreground'
                : 'text-[#9a9a9a] hover:bg-[#2a2a2a]'
            )}
          >
            All
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={cn(
              'rounded px-3 py-1 text-sm transition-colors',
              filter === 'unread'
                ? 'bg-info text-info-foreground'
                : 'text-[#9a9a9a] hover:bg-[#2a2a2a]'
            )}
          >
            Unread ({unreadCount})
          </button>
          <div className="flex-1"></div>
          {notifications.length > 0 && (
            <>
              <button
                onClick={onMarkAllAsRead}
                className="text-info hover:text-info/80 text-xs"
                title="Mark all as read"
              >
                <Check className="h-4 w-4" />
              </button>
              <button
                onClick={onClearAll}
                className="text-xs text-[#9a9a9a] hover:text-white"
                title="Clear all"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-auto">
          {filteredNotifications.length === 0 ? (
            <div className="flex h-48 flex-col items-center justify-center p-6 text-center">
              <Bell className="mb-3 h-12 w-12 text-[#4a4a4a]" />
              <p className="text-sm text-[#9a9a9a]">No notifications</p>
              <p className="mt-1 text-xs text-[#6b6b6b]">You're all caught up!</p>
            </div>
          ) : (
            <div className="divide-y divide-[#2a2a2a]">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    'cursor-pointer p-4 transition-colors hover:bg-[#202020]',
                    !notification.read && 'bg-info/10'
                  )}
                  onClick={() => !notification.read && onMarkAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="shrink-0 text-2xl">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-start justify-between gap-2">
                        <h3
                          className={cn(
                            'text-sm font-medium',
                            !notification.read && 'text-info-foreground'
                          )}
                        >
                          {notification.title}
                        </h3>
                        {!notification.read && (
                          <div className="bg-info mt-1 h-2 w-2 shrink-0 rounded-full"></div>
                        )}
                      </div>
                      <p className="mb-2 text-sm text-[#9a9a9a]">{notification.message}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-[#6b6b6b]">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            onDelete(notification.id)
                          }}
                          className="text-xs text-[#6b6b6b] opacity-0 transition-opacity group-hover:opacity-100 hover:text-red-400"
                        >
                          <Trash2 className="h-3 w-3" />
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
        <div className="border-t border-[#2a2a2a] p-3">
          <button className="flex w-full items-center justify-center gap-2 py-2 text-sm text-[#9a9a9a] hover:text-white">
            <Settings className="h-4 w-4" />
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  )
}
