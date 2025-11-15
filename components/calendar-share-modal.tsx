'use client'

import { useState } from 'react'
import { X, LinkIcon, Mail, Copy, Check } from 'lucide-react'

interface SharePermission {
  email: string
  permission: 'view' | 'edit' | 'manage'
  id: string
}

interface CalendarShareModalProps {
  isOpen: boolean
  onClose: () => void
  calendarName: string
  calendarId: string
  onShare: (email: string, permission: 'view' | 'edit' | 'manage') => void
  onRevoke: (shareId: string) => void
  onGenerateLink: (permission: 'view' | 'edit') => string
  existingShares: SharePermission[]
}

export function CalendarShareModal({
  isOpen,
  onClose,
  calendarName,
  calendarId,
  onShare,
  onRevoke,
  onGenerateLink,
  existingShares,
}: CalendarShareModalProps) {
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState<'view' | 'edit' | 'manage'>('view')
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  if (!isOpen) return null

  const handleShare = () => {
    if (email.trim()) {
      onShare(email, permission)
      setEmail('')
    }
  }

  const handleGenerateLink = () => {
    const link = onGenerateLink('view')
    setShareLink(link)
  }

  const handleCopyLink = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      setTimeout(() => setLinkCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="flex max-h-[80vh] w-[550px] flex-col overflow-hidden rounded-lg bg-[#1c1c1c]">
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Share Calendar</h2>
              <p className="text-muted-foreground mt-1 text-sm">{calendarName}</p>
            </div>
            <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-auto p-6">
          {/* Share with specific people */}
          <div>
            <h3 className="mb-3 text-sm font-medium">Share with specific people</h3>
            <div className="mb-4 flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShare()}
                className="focus:ring-info flex-1 rounded border-none bg-[#2a2a2a] px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
                className="focus:ring-info rounded border-none bg-[#2a2a2a] px-3 py-2 text-sm focus:ring-2 focus:outline-none"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
                <option value="manage">Can manage</option>
              </select>
              <button
                onClick={handleShare}
                className="bg-info hover:bg-info/90 text-info-foreground rounded px-4 py-2 text-sm font-medium"
              >
                Share
              </button>
            </div>

            {existingShares.length > 0 && (
              <div className="space-y-2">
                {existingShares.map((share) => (
                  <div
                    key={share.id}
                    className="flex items-center justify-between rounded bg-[#2a2a2a] p-3"
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="text-muted-foreground h-4 w-4" />
                      <span className="text-sm">{share.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-muted-foreground text-xs">
                        {share.permission === 'view' && 'Can view'}
                        {share.permission === 'edit' && 'Can edit'}
                        {share.permission === 'manage' && 'Can manage'}
                      </span>
                      <button
                        onClick={() => onRevoke(share.id)}
                        className="text-destructive hover:text-destructive/80 text-xs"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Share link */}
          <div className="border-t border-[#2a2a2a] pt-6">
            <h3 className="mb-3 text-sm font-medium">Share link</h3>
            <p className="text-muted-foreground mb-4 text-xs">
              Anyone with the link can view this calendar
            </p>

            {!shareLink ? (
              <button
                onClick={handleGenerateLink}
                className="flex w-full items-center justify-center gap-2 rounded bg-[#2a2a2a] px-4 py-2 text-sm hover:bg-[#3a3a3a]"
              >
                <LinkIcon className="h-4 w-4" />
                Generate Share Link
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 rounded border-none bg-[#2a2a2a] px-3 py-2 text-sm"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-info hover:bg-info/90 text-info-foreground flex items-center gap-2 rounded px-4 py-2 text-sm font-medium"
                >
                  {linkCopied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copy
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
