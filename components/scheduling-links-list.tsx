"use client"

import { useState } from "react"
import { Link2, Copy, Edit, Trash2, MoreVertical, Check, Calendar } from "lucide-react"

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

interface SchedulingLinksListProps {
  links: SchedulingLink[]
  onEdit: (link: SchedulingLink) => void
  onDelete: (id: string) => void
  onViewBookings: (link: SchedulingLink) => void
}

export function SchedulingLinksList({ links, onEdit, onDelete, onViewBookings }: SchedulingLinksListProps) {
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [menuOpen, setMenuOpen] = useState<string | null>(null)

  const copyLink = (link: SchedulingLink) => {
    navigator.clipboard.writeText(link.link)
    setCopiedId(link.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="space-y-3">
      {links.map((link) => (
        <div
          key={link.id}
          className="bg-surface border border-border rounded-lg p-4 hover:border-info/50 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                style={{ backgroundColor: `${link.color}20` }}
              >
                <Calendar className="w-5 h-5" style={{ color: link.color }} />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-semibold text-foreground">{link.name}</h3>
                  {link.requireApproval && (
                    <span className="px-2 py-0.5 bg-warning/20 text-warning text-xs rounded-full">
                      Approval Required
                    </span>
                  )}
                </div>

                {link.description && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{link.description}</p>
                )}

                <div className="flex items-center gap-4 mt-2 text-xs text-secondary">
                  <span>{link.duration} min</span>
                  {link.location && <span>{link.location}</span>}
                  {(link.bufferBefore > 0 || link.bufferAfter > 0) && (
                    <span>Buffer: {link.bufferBefore + link.bufferAfter} min</span>
                  )}
                  <span>Max: {link.maxBookingsPerDay}/day</span>
                </div>

                <div className="flex items-center gap-2 mt-3">
                  <input
                    type="text"
                    value={link.link}
                    readOnly
                    className="flex-1 px-2 py-1 bg-input border border-border rounded text-xs text-secondary focus:outline-none"
                  />
                  <button
                    onClick={() => copyLink(link)}
                    className="px-3 py-1 bg-info/10 hover:bg-info/20 text-info rounded text-xs font-medium transition-colors flex items-center gap-1"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="w-3 h-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        Copy
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setMenuOpen(menuOpen === link.id ? null : link.id)}
                className="p-1 hover:bg-surface-hover rounded"
              >
                <MoreVertical className="w-4 h-4 text-muted-foreground" />
              </button>

              {menuOpen === link.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                  <div className="absolute right-0 top-8 z-50 bg-card border border-border rounded-lg shadow-lg py-1 w-48">
                    <button
                      onClick={() => {
                        onViewBookings(link)
                        setMenuOpen(null)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover flex items-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      View Bookings
                    </button>
                    <button
                      onClick={() => {
                        onEdit(link)
                        setMenuOpen(null)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-foreground hover:bg-surface-hover flex items-center gap-2"
                    >
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(link.id)
                        setMenuOpen(null)
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-destructive hover:bg-destructive/10 flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      ))}

      {links.length === 0 && (
        <div className="text-center py-12">
          <Link2 className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-sm text-muted-foreground">No scheduling links yet</p>
          <p className="text-xs text-secondary mt-1">Create your first link to start accepting bookings</p>
        </div>
      )}
    </div>
  )
}
