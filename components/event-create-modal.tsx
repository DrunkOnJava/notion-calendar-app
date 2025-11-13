"use client"

import { useState } from "react"
import { X, Clock, MapPin, Users, Bell, Repeat, Video, FileText, Tag, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import { RecurrenceEditor, type RecurrenceRule } from "@/components/recurrence-editor"

interface EventCreateModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: any) => void
  initialDate?: Date
  initialTime?: string
}

export function EventCreateModal({ isOpen, onClose, onSave, initialDate, initialTime }: EventCreateModalProps) {
  const [title, setTitle] = useState("")
  const [date, setDate] = useState<Date | null>(initialDate || null)
  const [startTime, setStartTime] = useState(initialTime || "09:00")
  const [endTime, setEndTime] = useState("10:00")
  const [isAllDay, setIsAllDay] = useState(false)
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")
  const [calendar, setCalendar] = useState("default")
  const [attendees, setAttendees] = useState<string[]>([])
  const [attendeeInput, setAttendeeInput] = useState("")
  const [reminders, setReminders] = useState<string[]>(["15min"])
  const [videoLink, setVideoLink] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [status, setStatus] = useState<"confirmed" | "tentative" | "cancelled">("confirmed")
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium")
  const [visibility, setVisibility] = useState<"public" | "private" | "confidential">("public")
  const [attachments, setAttachments] = useState<string[]>([])
  const [color, setColor] = useState("#3B82F6")
  const [showRecurrenceEditor, setShowRecurrenceEditor] = useState(false)
  const [recurrence, setRecurrence] = useState<RecurrenceRule | null>(null)
  const [timezone, setTimezone] = useState("America/New_York")

  if (!isOpen) return null

  const handleAddAttendee = () => {
    if (attendeeInput.trim() && !attendees.includes(attendeeInput.trim())) {
      setAttendees([...attendees, attendeeInput.trim()])
      setAttendeeInput("")
    }
  }

  const handleRemoveAttendee = (email: string) => {
    setAttendees(attendees.filter((a) => a !== email))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleAddReminder = () => {
    if (!reminders.includes("1hour")) {
      setReminders([...reminders, "1hour"])
    }
  }

  const handleRemoveReminder = (reminder: string) => {
    setReminders(reminders.filter((r) => r !== reminder))
  }

  const handleSave = () => {
    if (!title.trim() || !date) return

    onSave({
      title,
      date: date.toISOString().split("T")[0],
      startTime: isAllDay ? null : startTime,
      endTime: isAllDay ? null : endTime,
      isAllDay,
      location,
      description,
      calendar,
      attendees,
      reminders,
      videoLink,
      tags,
      status,
      priority,
      visibility,
      attachments,
      color,
      recurrence,
      timezone,
      createdAt: new Date().toISOString(),
    })

    // Reset form
    setTitle("")
    setDate(null)
    setStartTime("09:00")
    setEndTime("10:00")
    setIsAllDay(false)
    setLocation("")
    setDescription("")
    setAttendees([])
    setReminders(["15min"])
    setVideoLink("")
    setTags([])
    setStatus("confirmed")
    setPriority("medium")
    setVisibility("public")
    setAttachments([])
    setColor("#3B82F6")
    setRecurrence(null)
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-[#1c1c1c] rounded-lg w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <h2 className="text-lg font-semibold">Create Event</h2>
            <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1.5 rounded">
              <X className="w-5 h-5 text-[#6b6b6b]" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Title */}
            <div>
              <input
                type="text"
                placeholder="Event title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-transparent text-xl font-semibold border-none outline-none placeholder:text-[#4a4a4a]"
                autoFocus
              />
            </div>

            {/* Date & Time */}
            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <div className="flex-1 space-y-2">
                <input
                  type="date"
                  value={date ? date.toISOString().split("T")[0] : ""}
                  onChange={(e) => setDate(e.target.value ? new Date(e.target.value) : null)}
                  className="w-full bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="allDay"
                    checked={isAllDay}
                    onChange={(e) => setIsAllDay(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <label htmlFor="allDay" className="text-sm text-[#d0d0d0]">
                    All day
                  </label>
                </div>

                {!isAllDay && (
                  <>
                    <div className="flex items-center gap-2">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                      />
                      <span className="text-[#6b6b6b]">to</span>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                      />
                    </div>
                    <select
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full bg-[#2a2a2a] text-xs px-3 py-1.5 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                      <option value="UTC">UTC</option>
                    </select>
                  </>
                )}
              </div>
            </div>

            {/* Recurrence */}
            <div className="flex items-start gap-3">
              <Repeat className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <button
                onClick={() => setShowRecurrenceEditor(true)}
                className="flex-1 text-left bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] hover:bg-[#3a3a3a]"
              >
                {recurrence ? getRecurrenceSummary(recurrence) : "Does not repeat"}
              </button>
            </div>

            {/* Location */}
            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <input
                type="text"
                placeholder="Add location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500 placeholder:text-[#6b6b6b]"
              />
            </div>

            {/* Video Conference */}
            <div className="flex items-start gap-3">
              <Video className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <input
                type="text"
                placeholder="Add video conference link (Zoom, Meet, Teams)"
                value={videoLink}
                onChange={(e) => setVideoLink(e.target.value)}
                className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500 placeholder:text-[#6b6b6b]"
              />
            </div>

            {/* Attendees */}
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder="Add attendees (email)"
                    value={attendeeInput}
                    onChange={(e) => setAttendeeInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAttendee())}
                    className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500 placeholder:text-[#6b6b6b]"
                  />
                  <button
                    onClick={handleAddAttendee}
                    className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-sm px-3 py-2 rounded"
                  >
                    Add
                  </button>
                </div>
                {attendees.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {attendees.map((email) => (
                      <span key={email} className="bg-[#2a2a2a] text-xs px-2 py-1 rounded flex items-center gap-1">
                        {email}
                        <button onClick={() => handleRemoveAttendee(email)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <textarea
                placeholder="Add description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500 placeholder:text-[#6b6b6b] resize-none"
              />
            </div>

            {/* Tags */}
            <div className="flex items-start gap-3">
              <Tag className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <div className="flex-1 space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500 placeholder:text-[#6b6b6b]"
                  />
                  <button onClick={handleAddTag} className="bg-[#2a2a2a] hover:bg-[#3a3a3a] text-sm px-3 py-2 rounded">
                    Add
                  </button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-badge-blue text-badge-blue-foreground text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        {tag}
                        <button onClick={() => handleRemoveTag(tag)} className="hover:text-destructive">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Reminders */}
            <div className="flex items-start gap-3">
              <Bell className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <div className="flex-1 space-y-2">
                {reminders.map((reminder, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <select
                      value={reminder}
                      onChange={(e) => {
                        const newReminders = [...reminders]
                        newReminders[idx] = e.target.value
                        setReminders(newReminders)
                      }}
                      className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                    >
                      <option value="0min">At time of event</option>
                      <option value="5min">5 minutes before</option>
                      <option value="15min">15 minutes before</option>
                      <option value="30min">30 minutes before</option>
                      <option value="1hour">1 hour before</option>
                      <option value="2hours">2 hours before</option>
                      <option value="1day">1 day before</option>
                      <option value="1week">1 week before</option>
                    </select>
                    {reminders.length > 1 && (
                      <button onClick={() => handleRemoveReminder(reminder)} className="hover:bg-[#2a2a2a] p-1 rounded">
                        <X className="w-4 h-4 text-[#6b6b6b]" />
                      </button>
                    )}
                  </div>
                ))}
                <button onClick={handleAddReminder} className="text-sm text-info hover:text-info/80">
                  Add another reminder
                </button>
              </div>
            </div>

            {/* Status & Priority */}
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-[#6b6b6b] mt-2" />
              <div className="flex-1 grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-[#9a9a9a] mb-1 block">Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                  >
                    <option value="confirmed">Confirmed</option>
                    <option value="tentative">Tentative</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-[#9a9a9a] mb-1 block">Priority</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Color & Visibility */}
            <div className="border-t border-[#2a2a2a] pt-4 space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-[#9a9a9a] w-24">Color</label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  className="w-12 h-8 rounded cursor-pointer"
                />
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-[#9a9a9a] w-24">Visibility</label>
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as any)}
                  className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                  <option value="confidential">Confidential</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <label className="text-sm text-[#9a9a9a] w-24">Calendar</label>
                <select
                  value={calendar}
                  onChange={(e) => setCalendar(e.target.value)}
                  className="flex-1 bg-[#2a2a2a] text-sm px-3 py-2 rounded border border-[#3a3a3a] outline-none focus:border-blue-500"
                >
                  <option value="default">Default Calendar</option>
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-2 p-4 border-t border-[#2a2a2a]">
            <button onClick={onClose} className="px-4 py-2 text-sm text-[#d0d0d0] hover:bg-[#2a2a2a] rounded">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title || !date}
              className={cn(
                "px-4 py-2 text-sm rounded font-medium",
                title && date
                  ? "bg-info hover:bg-info/90 text-info-foreground"
                  : "bg-[#3a3a3a] text-[#6b6b6b] cursor-not-allowed",
              )}
            >
              Create Event
            </button>
          </div>
        </div>
      </div>

      {showRecurrenceEditor && (
        <RecurrenceEditor
          value={recurrence || undefined}
          onChange={(rule) => {
            setRecurrence(rule)
            setShowRecurrenceEditor(false)
          }}
          onClose={() => setShowRecurrenceEditor(false)}
        />
      )}
    </>
  )
}

function getRecurrenceSummary(rule: RecurrenceRule): string {
  let summary = `Every ${rule.interval > 1 ? rule.interval + " " : ""}`

  switch (rule.frequency) {
    case "daily":
      summary += rule.interval === 1 ? "day" : "days"
      break
    case "weekly":
      summary += rule.interval === 1 ? "week" : "weeks"
      if (rule.byWeekday && rule.byWeekday.length > 0) {
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
        summary += " on " + rule.byWeekday.map((d) => days[d]).join(", ")
      }
      break
    case "monthly":
      summary += rule.interval === 1 ? "month" : "months"
      if (rule.byMonthDay) {
        summary += ` on day ${rule.byMonthDay}`
      }
      break
    case "yearly":
      summary += rule.interval === 1 ? "year" : "years"
      break
  }

  if (rule.endType === "count") {
    summary += `, ${rule.count} times`
  } else if (rule.endType === "until") {
    summary += `, until ${rule.until}`
  }

  return summary
}
