"use client"

import { useEffect } from "react"
import { X, Bell, CheckCircle, AlertCircle, Info } from "lucide-react"
import { cn } from "@/lib/utils"

interface ToastNotificationProps {
  id: string
  type: "success" | "error" | "warning" | "info"
  title: string
  message: string
  duration?: number
  onClose: (id: string) => void
}

export function ToastNotification({ id, type, title, message, duration = 5000, onClose }: ToastNotificationProps) {
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
      case "success":
        return <CheckCircle className="w-5 h-5 text-success" />
      case "error":
        return <AlertCircle className="w-5 h-5 text-destructive" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-warning" />
      case "info":
        return <Info className="w-5 h-5 text-info" />
      default:
        return <Bell className="w-5 h-5" />
    }
  }

  const getBorderColor = () => {
    switch (type) {
      case "success":
        return "border-l-success"
      case "error":
        return "border-l-destructive"
      case "warning":
        return "border-l-warning"
      case "info":
        return "border-l-info"
      default:
        return "border-l-[#4a4a4a]"
    }
  }

  return (
    <div
      className={cn(
        "bg-[#1c1c1c] border border-[#2a2a2a] border-l-4 rounded-lg shadow-lg p-4 min-w-[320px] max-w-[400px] animate-in slide-in-from-right",
        getBorderColor(),
      )}
    >
      <div className="flex items-start gap-3">
        <div className="shrink-0 mt-0.5">{getIcon()}</div>
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-white mb-1">{title}</h3>
          <p className="text-sm text-[#9a9a9a]">{message}</p>
        </div>
        <button onClick={() => onClose(id)} className="shrink-0 hover:bg-[#2a2a2a] p-1 rounded">
          <X className="w-4 h-4 text-[#6b6b6b]" />
        </button>
      </div>
    </div>
  )
}

export function ToastContainer({
  toasts,
  onClose,
}: { toasts: ToastNotificationProps[]; onClose: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
      <div className="flex flex-col gap-2 pointer-events-auto">
        {toasts.map((toast) => (
          <ToastNotification key={toast.id} {...toast} onClose={onClose} />
        ))}
      </div>
    </div>
  )
}
