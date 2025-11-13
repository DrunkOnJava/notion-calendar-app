"use client"

import { useState } from "react"
import { X, LinkIcon, Mail, Copy, Check } from "lucide-react"

interface SharePermission {
  email: string
  permission: "view" | "edit" | "manage"
  id: string
}

interface CalendarShareModalProps {
  isOpen: boolean
  onClose: () => void
  calendarName: string
  calendarId: string
  onShare: (email: string, permission: "view" | "edit" | "manage") => void
  onRevoke: (shareId: string) => void
  onGenerateLink: (permission: "view" | "edit") => string
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
  const [email, setEmail] = useState("")
  const [permission, setPermission] = useState<"view" | "edit" | "manage">("view")
  const [shareLink, setShareLink] = useState<string | null>(null)
  const [linkCopied, setLinkCopied] = useState(false)

  if (!isOpen) return null

  const handleShare = () => {
    if (email.trim()) {
      onShare(email, permission)
      setEmail("")
    }
  }

  const handleGenerateLink = () => {
    const link = onGenerateLink("view")
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[550px] max-h-[80vh] flex flex-col overflow-hidden">
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">Share Calendar</h2>
              <p className="text-sm text-muted-foreground mt-1">{calendarName}</p>
            </div>
            <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          {/* Share with specific people */}
          <div>
            <h3 className="text-sm font-medium mb-3">Share with specific people</h3>
            <div className="flex gap-2 mb-4">
              <input
                type="email"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleShare()}
                className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-info"
              />
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value as any)}
                className="bg-[#2a2a2a] text-sm px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-info"
              >
                <option value="view">Can view</option>
                <option value="edit">Can edit</option>
                <option value="manage">Can manage</option>
              </select>
              <button
                onClick={handleShare}
                className="bg-info hover:bg-info/90 text-info-foreground px-4 py-2 rounded text-sm font-medium"
              >
                Share
              </button>
            </div>

            {existingShares.length > 0 && (
              <div className="space-y-2">
                {existingShares.map((share) => (
                  <div key={share.id} className="flex items-center justify-between p-3 bg-[#2a2a2a] rounded">
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{share.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {share.permission === "view" && "Can view"}
                        {share.permission === "edit" && "Can edit"}
                        {share.permission === "manage" && "Can manage"}
                      </span>
                      <button
                        onClick={() => onRevoke(share.id)}
                        className="text-xs text-destructive hover:text-destructive/80"
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
            <h3 className="text-sm font-medium mb-3">Share link</h3>
            <p className="text-xs text-muted-foreground mb-4">Anyone with the link can view this calendar</p>

            {!shareLink ? (
              <button
                onClick={handleGenerateLink}
                className="w-full flex items-center justify-center gap-2 bg-[#2a2a2a] hover:bg-[#3a3a3a] py-2 px-4 rounded text-sm"
              >
                <LinkIcon className="w-4 h-4" />
                Generate Share Link
              </button>
            ) : (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="bg-info hover:bg-info/90 text-info-foreground px-4 py-2 rounded text-sm font-medium flex items-center gap-2"
                >
                  {linkCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
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
