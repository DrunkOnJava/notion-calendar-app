"use client"

import { useState } from "react"
import { X, Link2, Clock, Settings, Copy, Check } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SchedulingLink {
  id: string
  name: string
  duration: number
  description: string
  location: string
  bufferBefore: number
  bufferAfter: number
  maxBookingsPerDay: number
  requireApproval: boolean
  link: string
  color: string
}

interface SchedulingLinkModalProps {
  isOpen: boolean
  onClose: () => void
  link?: SchedulingLink
  onSave: (link: SchedulingLink) => void
}

export function SchedulingLinkModal({ isOpen, onClose, link, onSave }: SchedulingLinkModalProps) {
  const [name, setName] = useState(link?.name || "")
  const [duration, setDuration] = useState(link?.duration || 30)
  const [description, setDescription] = useState(link?.description || "")
  const [location, setLocation] = useState(link?.location || "")
  const [bufferBefore, setBufferBefore] = useState(link?.bufferBefore || 0)
  const [bufferAfter, setBufferAfter] = useState(link?.bufferAfter || 0)
  const [maxBookingsPerDay, setMaxBookingsPerDay] = useState(link?.maxBookingsPerDay || 10)
  const [requireApproval, setRequireApproval] = useState(link?.requireApproval || false)
  const [color, setColor] = useState(link?.color || "#3b82f6")
  const [copiedLink, setCopiedLink] = useState(false)

  const generatedLink = `${typeof window !== "undefined" ? window.location.origin : ""}/book/${name.toLowerCase().replace(/\s+/g, "-")}`

  const handleSave = () => {
    const schedulingLink: SchedulingLink = {
      id: link?.id || Date.now().toString(),
      name,
      duration,
      description,
      location,
      bufferBefore,
      bufferAfter,
      maxBookingsPerDay,
      requireApproval,
      link: generatedLink,
      color,
    }
    onSave(schedulingLink)
    onClose()
  }

  const copyLink = () => {
    navigator.clipboard.writeText(generatedLink)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card border border-border rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-5 h-5 text-info" />
            <h2 className="text-lg font-semibold text-foreground">
              {link ? "Edit Scheduling Link" : "Create Scheduling Link"}
            </h2>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Event Name *</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 30 Minute Meeting"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What is this meeting about?"
                rows={3}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Zoom, Google Meet, Office"
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-info focus:border-transparent"
              />
            </div>
          </div>

          {/* Duration & Buffers */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Duration & Buffer
            </h3>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-muted-foreground mb-2">Duration (min)</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
                >
                  <option value={15}>15 min</option>
                  <option value={30}>30 min</option>
                  <option value={45}>45 min</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Buffer Before (min)</label>
                <input
                  type="number"
                  value={bufferBefore}
                  onChange={(e) => setBufferBefore(Number(e.target.value))}
                  min={0}
                  max={60}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
                />
              </div>

              <div>
                <label className="block text-sm text-muted-foreground mb-2">Buffer After (min)</label>
                <input
                  type="number"
                  value={bufferAfter}
                  onChange={(e) => setBufferAfter(Number(e.target.value))}
                  min={0}
                  max={60}
                  className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
                />
              </div>
            </div>
          </div>

          {/* Limits & Settings */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Limits & Settings
            </h3>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Max Bookings Per Day</label>
              <input
                type="number"
                value={maxBookingsPerDay}
                onChange={(e) => setMaxBookingsPerDay(Number(e.target.value))}
                min={1}
                max={50}
                className="w-full px-3 py-2 bg-input border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-info"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-medium text-foreground">Require Approval</div>
                <div className="text-xs text-muted-foreground">Manually approve booking requests</div>
              </div>
              <button
                onClick={() => setRequireApproval(!requireApproval)}
                className={`relative w-11 h-6 rounded-full transition-colors ${
                  requireApproval ? "bg-info" : "bg-muted"
                }`}
              >
                <div
                  className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    requireApproval ? "translate-x-5" : ""
                  }`}
                />
              </button>
            </div>

            <div>
              <label className="block text-sm text-muted-foreground mb-2">Event Color</label>
              <div className="flex gap-2">
                {["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981", "#06b6d4"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`w-8 h-8 rounded-full border-2 ${
                      color === c ? "border-foreground" : "border-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Generated Link */}
          {name && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Your Booking Link</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={generatedLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-surface border border-border rounded-lg text-secondary text-sm focus:outline-none"
                />
                <Button onClick={copyLink} variant="outline" size="sm" className="shrink-0 bg-transparent">
                  {copiedLink ? (
                    <>
                      <Check className="w-4 h-4 mr-2" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>

        <div className="sticky bottom-0 bg-card border-t border-border p-4 flex justify-end gap-2">
          <Button onClick={onClose} variant="outline">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!name} className="bg-info hover:bg-info/90">
            {link ? "Save Changes" : "Create Link"}
          </Button>
        </div>
      </div>
    </div>
  )
}
