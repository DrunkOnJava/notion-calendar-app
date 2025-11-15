'use client'

import { useEffect } from 'react'
import { X, Bell, CheckCircle, AlertCircle, Info } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ToastNotificationProps {
  id: string
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function ToastNotification({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastNotificationProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose(id)
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [id, duration, onClose])

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="text-success h-5 w-5" />
      case 'error':
        return <AlertCircle className="text-destructive h-5 w-5" />
      case 'warning':
        return <AlertCircle className="text-warning h-5 w-5" />
      case 'info':
        return <Info className="text-info h-5 w-5" />
      default:
        return <Bell className="h-5 w-5" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case 'success':
        return 'border-l-success'
      case 'error':
        return 'border-l-destructive'
      case 'warning':
        return 'border-l-warning'
      case 'info':
        return 'border-l-info'
      default:
        return 'border-l-[#4a4a4a]'
    }
  }

  return (
    <div
      className={cn(
        'animate-in slide-in-from-right max-w-[400px] min-w-[320px] rounded-lg border border-l-4 border-[#2a2a2a] bg-[#1c1c1c] p-4 shadow-lg',
        getBorderColor()
      )}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">{getIcon()}</div>
        <div className="min-w-0 flex-1">
          <h3 className="mb-1 text-sm font-semibold text-white">{title}</h3>
          <p className="text-sm text-[#9a9a9a]">{message}</p>
        </div>
        <button onClick={() => onClose(id)} className="shrink-0 rounded p-1 hover:bg-[#2a2a2a]">
          <X className="h-4 w-4 text-[#6b6b6b]" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
}: {
  toasts: Omit<ToastNotificationProps, 'onClose'>[]
  onClose: (id: string) => void
}) {
  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-50 flex flex-col gap-2">
      <div className="pointer-events-auto flex flex-col gap-2">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}
