'use client'

import { useState } from 'react'
import { Link2, Copy, Edit, Trash2, MoreVertical, Check, Calendar } from 'lucide-react'

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

export function SchedulingLinksList({
  links,
  onEdit,
  onDelete,
  onViewBookings,
}: SchedulingLinksListProps) {
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
          className="bg-surface border-border hover:border-info/50 rounded-lg border p-4 transition-colors"
        >
          <div className="flex items-start justify-between">
            <div className="flex flex-1 items-start gap-3">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg"
                style={{ backgroundColor: `${link.color}20` }}
              >
                <Calendar className="h-5 w-5" style={{ color: link.color }} />
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-foreground text-sm font-semibold">{link.name}</h3>
                  {link.requireApproval && (
                    <span className="bg-warning/20 text-warning rounded-full px-2 py-0.5 text-xs">
                      Approval Required
                    </span>
                  )}
                </div>

                {link.description && (
                  <p className="text-muted-foreground mt-1 line-clamp-2 text-sm">
                    {link.description}
                  </p>
                )}

                <div className="text-secondary mt-2 flex items-center gap-4 text-xs">
                  <span>{link.duration} min</span>
                  {link.location && <span>{link.location}</span>}
                  {(link.bufferBefore > 0 || link.bufferAfter > 0) && (
                    <span>Buffer: {link.bufferBefore + link.bufferAfter} min</span>
                  )}
                  <span>Max: {link.maxBookingsPerDay}/day</span>
                </div>

                <div className="mt-3 flex items-center gap-2">
                  <input
                    type="text"
                    value={link.link}
                    readOnly
                    className="bg-input border-border text-secondary flex-1 rounded border px-2 py-1 text-xs focus:outline-none"
                  />
                  <button
                    onClick={() => copyLink(link)}
                    className="bg-info/10 hover:bg-info/20 text-info flex items-center gap-1 rounded px-3 py-1 text-xs font-medium transition-colors"
                  >
                    {copiedId === link.id ? (
                      <>
                        <Check className="h-3 w-3" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
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
                className="hover:bg-surface-hover rounded p-1"
              >
                <MoreVertical className="text-muted-foreground h-4 w-4" />
              </button>

              {menuOpen === link.id && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(null)} />
                  <div className="bg-card border-border absolute top-8 right-0 z-50 w-48 rounded-lg border py-1 shadow-lg">
                    <button
                      onClick={() => {
                        onViewBookings(link)
                        setMenuOpen(null)
                      }}
                      className="text-foreground hover:bg-surface-hover flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
                    >
                      <Calendar className="h-4 w-4" />
                      View Bookings
                    </button>
                    <button
                      onClick={() => {
                        onEdit(link)
                        setMenuOpen(null)
                      }}
                      className="text-foreground hover:bg-surface-hover flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
                    >
                      <Edit className="h-4 w-4" />
                      Edit
                    </button>
                    <button
                      onClick={() => {
                        onDelete(link.id)
                        setMenuOpen(null)
                      }}
                      className="text-destructive hover:bg-destructive/10 flex w-full items-center gap-2 px-4 py-2 text-left text-sm"
                    >
                      <Trash2 className="h-4 w-4" />
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
        <div className="py-12 text-center">
          <Link2 className="text-muted-foreground mx-auto mb-3 h-12 w-12" />
          <p className="text-muted-foreground text-sm">No scheduling links yet</p>
          <p className="text-secondary mt-1 text-xs">
            Create your first link to start accepting bookings
          </p>
        </div>
      )}
    </div>
  )
}
