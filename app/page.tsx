"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  ChevronLeft,
  ChevronRight,
  X,
  Search,
  Plus,
  MoreHorizontal,
  Table,
  LayoutGrid,
  CalendarIcon,
  Clock,
} from "lucide-react"
import { Button } from "@/components/ui/button" // Added for scheduling links
import { cn } from "@/lib/utils"
import { DatabaseCard } from "@/components/database-card"
import { EventCreateModal } from "@/components/event-create-modal"
import { EventDetailModal } from "@/components/event-detail-modal"
import { CommandPalette } from "@/components/command-palette"
import { WeekView } from "@/components/week-view"
import { DayView } from "@/components/day-view"
import { AgendaView } from "@/components/agenda-view"
import { ViewSwitcher } from "@/components/view-switcher"
import { DraggableEvent } from "@/components/draggable-event"
import { SearchBar } from "@/components/search-bar"
import { DatabaseFilter } from "@/components/database-filter"
import { DatabaseSort } from "@/components/database-sort"
import { DatabaseTableView } from "@/components/database-table-view"
import { DatabaseBoardView } from "@/components/database-board-view"
import { type RecurrenceRule, generateRecurringDates } from "@/components/recurrence-editor"
import { EventSeriesModal } from "@/components/event-series-modal"
import { DatePickerModal } from "@/components/date-picker-modal"
import { NotificationCenter, type Notification } from "@/components/notification-center"
import { ToastContainer } from "@/components/toast-notification"
import { SettingsModal, type Settings } from "@/components/settings-modal"
import { EventContextMenu } from "@/components/event-context-menu"
import { MultiSelectToolbar } from "@/components/multi-select-toolbar"
import { BulkActionModal } from "@/components/bulk-action-modal"
import { EventHoverPreview } from "@/components/event-hover-preview"
import { CalendarListModal, type Calendar, type CalendarGroup } from "@/components/calendar-list-modal"
import { CalendarImportExport } from "@/components/calendar-import-export"
import { CalendarShareModal } from "@/components/calendar-share-modal"
import { CalendarContextMenu } from "@/components/calendar-context-menu"
import { DatabaseItemContextMenu } from "@/components/database-item-context-menu"
import { SelectionContextMenu } from "@/components/selection-context-menu"
import { DraggableDatabaseItem } from "@/components/draggable-database-item"
// Add scheduling links imports
import { SchedulingLinkModal } from "@/components/scheduling-link-modal"
import { SchedulingLinksList } from "@/components/scheduling-links-list"
import { AvailabilityEditor } from "@/components/availability-editor"

const initialEvents = [
  { id: "1", date: "2025-10-31", title: "Halloween", type: "holiday" },
  { id: "2", date: "2025-11-02", title: "Daylight Saving Time ends", type: "info" },
  { id: "3", date: "2025-11-03", title: "Election Day", type: "info" },
  { id: "4", date: "2025-11-03", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
  { id: "5", date: "2025-11-05", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
  { id: "6", date: "2025-11-11", title: "Veterans Day", type: "holiday" },
  { id: "7", date: "2025-11-12", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
  { id: "8", date: "2025-11-13", title: "Thanksgiving" },
  { id: "9", date: "2025-11-19", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
  { id: "10", date: "2025-11-26", title: "Thanksgiving Day", type: "holiday" },
  { id: "11", date: "2025-11-26", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
  { id: "12", date: "2025-11-27", title: "Black Friday", type: "info" },
  { id: "13", date: "2025-12-03", title: "Game night!", time: "8 PM", startTime: "20:00", endTime: "22:00" },
]

const personnelData = [
  {
    name: "Personnel Roster",
    items: [
      {
        id: "p1",
        name: "Michael Foster",
        time: "October 18, 7:33-7:33PM",
        properties: {
          UTV: true,
          ALS: false,
          Active: true,
          Ambulance: true,
          Available: true,
          BLS: true,
          Boat: true,
          "Brush Truck": true,
          "Certification Level": "EMT",
          Engine: true,
          FTO: true,
          "Last Hold Date": null,
          "Rescue Squad": true,
          Shift: "B",
          Tanker: true,
          Truck: true,
        },
      },
      {
        id: "p2",
        name: "Ryan Baldwin",
        time: "October 18, 7:40-7:40PM",
        properties: {
          UTV: true,
          ALS: false,
          Active: true,
          Ambulance: true,
          Available: true,
          BLS: true,
          Boat: true,
          "Brush Truck": true,
          "Certification Level": "EMT",
          Engine: true,
          FTO: true,
        },
      },
      {
        id: "p3",
        name: "Chad Biby",
        time: "October 18, 7:39-7:39PM",
        properties: {
          UTV: true,
          ALS: false,
          Active: true,
          Ambulance: true,
          Available: true,
          BLS: true,
          Boat: false,
          "Brush Truck": false,
          "Certification Level": "EMT",
          Engine: true,
          FTO: true,
          "Rescue Squad": true,
          Tanker: true,
          Truck: true,
        },
      },
      {
        id: "p4",
        name: "Kiersten Kennedy",
        time: "October 18, 7:40-7:40PM",
        properties: {
          UTV: true,
          ALS: false,
          Active: true,
          Ambulance: true,
          Available: true,
          BLS: true,
          Boat: false,
          "Brush Truck": true,
          "Certification Level": "EMT",
          Engine: true,
          FTO: true,
          "Rescue Squad": true,
          Tanker: true,
        },
      },
      {
        id: "p5",
        name: "Eddie Hammack",
        time: "October 18, 7:42-7:42PM",
        properties: {
          UTV: true,
        },
      },
    ],
  },
]

export default function CalendarPage() {
  const [events, setEvents] = useState(initialEvents)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showDatabaseModal, setShowDatabaseModal] = useState(false)
  const [showEventCreateModal, setShowEventCreateModal] = useState(false)
  const [showEventDetailModal, setShowEventDetailModal] = useState(false)
  const [showCommandPalette, setShowCommandPalette] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<any>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [currentView, setCurrentView] = useState<"month" | "week" | "day" | "agenda">("month")
  const [leftSidebarView, setLeftSidebarView] = useState<"calendar" | "database">("database")
  const [databaseView, setDatabaseView] = useState<"list" | "table" | "board">("list")
  const [expandedPersonnel, setExpandedPersonnel] = useState<{ [key: string]: boolean }>({
    "Michael Foster": true,
  })
  const [selectedPerson, setSelectedPerson] = useState<string | null>("Michael Foster")
  const [selectedDatabase, setSelectedDatabase] = useState<string | null>("Personnel Roster")
  const [showDatabaseDropdown, setShowDatabaseDropdown] = useState(false)
  const [databaseFilter, setDatabaseFilter] = useState<"Personnel Roster" | "All Properties">("Personnel Roster")
  const [draggedEvent, setDraggedEvent] = useState<any>(null)
  const [filters, setFilters] = useState<any[]>([])
  const [sort, setSort] = useState<{ property: string; direction: "asc" | "desc" } | null>(null)
  const [showRecurrenceEditor, setShowRecurrenceEditor] = useState(false)
  const [showEventSeriesModal, setShowEventSeriesModal] = useState(false)
  const [eventSeriesAction, setEventSeriesAction] = useState<"edit" | "delete">("edit")
  const [editingRecurrence, setEditingRecurrence] = useState<RecurrenceRule | null>(null)

  const [currentDate, setCurrentDate] = useState(new Date(2025, 10, 13)) // November 13, 2025
  const [displayYear, setDisplayYear] = useState(2025)
  const [displayMonth, setDisplayMonth] = useState(10) // November
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [miniCalendarMonth, setMiniCalendarMonth] = useState(10)
  const [miniCalendarYear, setMiniCalendarYear] = useState(2025)

  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "reminder",
      title: "Upcoming Event",
      message: "Game night! starts in 15 minutes",
      timestamp: new Date(Date.now() - 900000), // 15 min ago
      read: false,
    },
    {
      id: "2",
      type: "event-change",
      title: "Event Updated",
      message: "Thanksgiving Day has been updated",
      timestamp: new Date(Date.now() - 3600000), // 1 hour ago
      read: false,
    },
    {
      id: "3",
      type: "system",
      title: "Calendar Synced",
      message: "Your Google Calendar has been successfully synced",
      timestamp: new Date(Date.now() - 7200000), // 2 hours ago
      read: true,
    },
  ])
  const [showNotificationCenter, setShowNotificationCenter] = useState(false)
  const [toasts, setToasts] = useState<any[]>([])

  const [showSettings, setShowSettings] = useState(false)
  const [settings, setSettings] = useState<Settings>({
    // General
    defaultView: "month",
    weekStartsOn: "sunday",
    timeFormat: "12h",
    dateFormat: "MM/DD/YYYY",

    // Appearance
    theme: "dark",
    showWeekNumbers: false,
    showDeclinedEvents: false,
    compactMode: false,

    // Calendar
    defaultEventDuration: 60,
    defaultReminders: ["15 min before"],
    showWeatherForecast: false,
    enableDragAndDrop: true,

    // Notifications
    enableNotifications: true,
    enableDesktopNotifications: true,
    enableEmailNotifications: false,
    notificationSound: true,

    // Privacy
    showEventLocation: true,
    showEventDescription: true,
    allowGuestList: true,
  })

  // Add scheduling links state
  const [showSchedulingLinks, setShowSchedulingLinks] = useState(false)
  const [showSchedulingLinkModal, setShowSchedulingLinkModal] = useState(false)
  const [editingSchedulingLink, setEditingSchedulingLink] = useState<any>(null)
  const [schedulingLinks, setSchedulingLinks] = useState<any[]>([])

  const [showAvailabilitySettings, setShowAvailabilitySettings] = useState(false)
  const [weeklyAvailability, setWeeklyAvailability] = useState<any>({
    Monday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Tuesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Wednesday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Thursday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Friday: { enabled: true, slots: [{ start: "09:00", end: "17:00" }] },
    Saturday: { enabled: false, slots: [] },
    Sunday: { enabled: false, slots: [] },
  })

  const [contextMenu, setContextMenu] = useState<{
    event: any
    position: { x: number; y: number }
  } | null>(null)

  const [selectedEvents, setSelectedEvents] = useState<string[]>([])
  const [showBulkActionModal, setShowBulkActionModal] = useState(false)
  const [bulkAction, setBulkAction] = useState<"color" | "calendar">("color")

  const [hoverPreview, setHoverPreview] = useState<{
    event: any
    position: { x: number; y: number }
  } | null>(null)
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const [calendars, setCalendars] = useState<Calendar[]>([
    {
      id: "1",
      name: "Personal",
      color: "#3b82f6",
      visible: true,
      isDefault: true,
      type: "personal",
    },
    {
      id: "2",
      name: "Google Appointments",
      color: "#f97316",
      visible: true,
      type: "google",
      email: "griffinradcliffe@gmail.com",
    },
    {
      id: "3",
      name: "Birthdays",
      color: "#f97316",
      visible: true,
      type: "google",
    },
    {
      id: "4",
      name: "Holidays in United States",
      color: "#22c55e",
      visible: true,
      type: "personal",
    },
  ])

  const [calendarGroups, setCalendarGroups] = useState<CalendarGroup[]>([
    { id: "1", name: "Personal", expanded: true },
    { id: "2", name: "Work", expanded: true },
  ])

  const [showCalendarList, setShowCalendarList] = useState(false)
  const [showImportExport, setShowImportExport] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedCalendarForShare, setSelectedCalendarForShare] = useState<Calendar | null>(null)
  const [calendarShares, setCalendarShares] = useState<any[]>([])

  const [calendarContextMenu, setCalendarContextMenu] = useState<{
    calendar: any
    position: { x: number; y: number }
  } | null>(null)

  const [databaseItemContextMenu, setDatabaseItemContextMenu] = useState<{
    item: any
    position: { x: number; y: number }
  } | null>(null)

  const [selectionContextMenu, setSelectionContextMenu] = useState<{
    position: { x: number; y: number }
  } | null>(null)

  // State for handling event files
  const [eventFiles, setEventFiles] = useState<{ [eventId: string]: File[] }>({})

  const handleCalendarRightClick = (e: React.MouseEvent, calendar: any) => {
    e.preventDefault()
    e.stopPropagation()
    setCalendarContextMenu({
      calendar,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  const handleEditCalendar = (calendar: any) => {
    // Open edit calendar modal
    addToast({
      type: "info",
      title: "Edit Calendar",
      message: `Editing ${calendar.name}`,
    })
  }

  const handleDeleteCalendar = (id: string) => {
    setCalendars(calendars.filter((c) => c.id !== id))
    addToast({
      type: "success",
      title: "Calendar Deleted",
      message: "Calendar has been removed",
    })
  }

  const handleSetDefaultCalendar = (calendarId: string) => {
    setCalendars(calendars.map((c) => ({ ...c, isDefault: c.id === calendarId })))
    addToast({
      type: "success",
      title: "Default Calendar Set",
      message: "Default calendar has been updated",
    })
  }

  const handleExportCalendarInitial = (calendar: any) => {
    setShowImportExport(true)
    addToast({
      type: "info",
      title: "Export Calendar",
      message: `Preparing export for ${calendar.name}`,
    })
  }

  const handleChangeCalendarColor = (calendar: any, color: string) => {
    setCalendars(calendars.map((c) => (c.id === calendar.id ? { ...c, color } : c)))
    addToast({
      type: "success",
      title: "Color Updated",
      message: `Calendar color has been changed`,
    })
  }

  // Add scheduling link handlers
  const handleSaveSchedulingLink = (link: any) => {
    if (editingSchedulingLink) {
      setSchedulingLinks(schedulingLinks.map((l) => (l.id === link.id ? link : l)))
      addToast({
        type: "success",
        title: "Link Updated",
        message: `${link.name} has been updated`,
      })
    } else {
      setSchedulingLinks([...schedulingLinks, link])
      addToast({
        type: "success",
        title: "Link Created",
        message: `${link.name} is ready to share`,
      })
    }
    setEditingSchedulingLink(null)
    setShowSchedulingLinkModal(false) // Close modal after saving
  }

  const handleEditSchedulingLink = (link: any) => {
    setEditingSchedulingLink(link)
    setShowSchedulingLinkModal(true)
  }

  const handleDeleteSchedulingLink = (id: string) => {
    const link = schedulingLinks.find((l) => l.id === id)
    setSchedulingLinks(schedulingLinks.filter((l) => l.id !== id))
    addToast({
      type: "success",
      title: "Link Deleted",
      message: `${link?.name} has been removed`,
    })
  }

  const handleViewBookings = (link: any) => {
    // Navigate to bookings view
    addToast({
      type: "info",
      title: "View Bookings",
      message: `Showing bookings for ${link.name}`,
    })
  }

  const handleDatabaseItemRightClick = (e: React.MouseEvent, item: any) => {
    e.preventDefault()
    e.stopPropagation()
    setDatabaseItemContextMenu({
      item,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  const handleEditDatabaseItem = (item: any) => {
    setSelectedPerson(item.name) // Assuming item.name is the identifier for the person
    addToast({
      type: "info",
      title: "Edit Item",
      message: `Editing ${item.name}`,
    })
  }

  const handleDeleteDatabaseItem = (itemId: string) => {
    setPersonnel(personnel.filter((p) => p.id !== itemId))
    addToast({
      type: "success",
      title: "Item Deleted",
      message: "Database item has been removed",
    })
  }

  const handleDuplicateDatabaseItem = (item: any) => {
    const newItem = {
      ...item,
      id: Date.now().toString(),
      name: `${item.name} (Copy)`,
    }
    setPersonnel([...personnel, newItem])
    addToast({
      type: "success",
      title: "Item Duplicated",
      message: "Database item has been duplicated",
    })
  }

  const handleOpenDatabaseItemInFull = (item: any) => {
    setSelectedPerson(item.name) // Assuming item.name is the identifier for the person
    setLeftSidebarView("database") // Assuming 'person' is a valid view for the left sidebar, though 'database' is used here
    setShowWelcome(false) // Hide welcome screen when viewing details
  }

  const handleSelectionRightClick = (e: React.MouseEvent) => {
    if (selectedEvents.length === 0) return
    e.preventDefault()
    e.stopPropagation()
    setSelectionContextMenu({
      position: { x: e.clientX, y: e.clientY },
    })
  }

  const handleBulkDelete = () => {
    setEvents(events.filter((e) => !selectedEvents.includes(e.id)))
    setSelectedEvents([])
    addToast({
      type: "success",
      title: "Events Deleted",
      message: `${selectedEvents.length} events have been deleted`,
    })
  }

  const handleBulkDuplicate = () => {
    const newEvents = events
      .filter((e) => selectedEvents.includes(e.id))
      .map((e) => ({
        ...e,
        id: Date.now().toString() + Math.random(),
        title: `${e.title} (Copy)`,
      }))
    setEvents([...events, ...newEvents])
    setSelectedEvents([])
    addToast({
      type: "success",
      title: "Events Duplicated",
      message: `${selectedEvents.length} events have been duplicated`,
    })
  }

  const handleBulkChangeColor = () => {
    setShowBulkActionModal(true)
    setBulkAction("color")
  }

  const handleBulkMoveToCalendar = () => {
    setShowBulkActionModal(true)
    setBulkAction("calendar")
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setShowCommandPalette(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "n") {
        e.preventDefault()
        setShowEventCreateModal(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "f") {
        e.preventDefault()
        document.querySelector<HTMLInputElement>('input[placeholder="Search events"]')?.focus()
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "g") {
        e.preventDefault()
        setShowDatePicker(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "t") {
        e.preventDefault()
        navigateToToday()
      }

      // Navigate between days/weeks with arrow keys
      if (!showCommandPalette && !showEventCreateModal && !showEventDetailModal && !showDatePicker) {
        if (e.key === "ArrowLeft") {
          e.preventDefault()
          if (currentView === "month") {
            navigatePrevious()
          } else if (currentView === "week" || currentView === "day") {
            const prev = new Date(currentDate)
            prev.setDate(prev.getDate() - 1)
            setCurrentDate(prev)
          }
        }
        if (e.key === "ArrowRight") {
          e.preventDefault()
          if (currentView === "month") {
            navigateNext()
          } else if (currentView === "week" || currentView === "day") {
            const next = new Date(currentDate)
            next.setDate(next.getDate() + 1)
            setCurrentDate(next)
          }
        }
        if (e.key === "ArrowUp" && currentView === "month") {
          e.preventDefault()
          const prev = new Date(currentDate)
          prev.setDate(prev.getDate() - 7)
          setCurrentDate(prev)
          setDisplayMonth(prev.getMonth())
          setDisplayYear(prev.getFullYear())
        }
        if (e.key === "ArrowDown" && currentView === "month") {
          e.preventDefault()
          const next = new Date(currentDate)
          next.setDate(next.getDate() + 7)
          setCurrentDate(next)
          setDisplayMonth(next.getMonth())
          setDisplayYear(next.getFullYear())
        }
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "e" && selectedEvent) {
        e.preventDefault()
        setShowEventDetailModal(true)
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "d" && selectedEvent) {
        e.preventDefault()
        handleDuplicateEvent(selectedEvent)
      }
      if ((e.key === "Backspace" || e.key === "Delete") && selectedEvent && !showEventDetailModal) {
        e.preventDefault()
        handleDeleteEvent(selectedEvent.id)
      }

      if (e.key === "Escape" && selectedEvents.length > 0) {
        e.preventDefault()
        setSelectedEvents([])
      }

      if ((e.metaKey || e.ctrlKey) && e.key === "a" && !showEventCreateModal && !showEventDetailModal) {
        e.preventDefault()
        const visibleEventIds = events.map((e) => e.id)
        setSelectedEvents(visibleEventIds)
      }
      // Add right-click handler for selection
      if (e.type === "contextmenu" && selectedEvents.length > 0) {
        handleSelectionRightClick(e as any)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [
    currentView,
    currentDate,
    showCommandPalette,
    showEventCreateModal,
    showEventDetailModal,
    showDatePicker,
    selectedEvent,
    selectedEvents, // Add selectedEvents dependency
  ])

  const navigateToToday = () => {
    const today = new Date()
    setCurrentDate(today)
    setDisplayYear(today.getFullYear())
    setDisplayMonth(today.getMonth())
    setMiniCalendarYear(today.getFullYear())
    setMiniCalendarMonth(today.getMonth())
  }

  const navigatePrevious = () => {
    if (currentView === "month") {
      const prevMonth = displayMonth === 0 ? 11 : displayMonth - 1
      const prevYear = displayMonth === 0 ? displayYear - 1 : displayYear
      setDisplayMonth(prevMonth)
      setDisplayYear(prevYear)
    } else if (currentView === "week") {
      const prev = new Date(currentDate)
      prev.setDate(prev.getDate() - 7)
      setCurrentDate(prev)
    } else if (currentView === "day") {
      const prev = new Date(currentDate)
      prev.setDate(prev.getDate() - 1)
      setCurrentDate(prev)
    }
  }

  const navigateNext = () => {
    if (currentView === "month") {
      const nextMonth = displayMonth === 11 ? 0 : displayMonth + 1
      const nextYear = displayMonth === 11 ? displayYear + 1 : displayYear
      setDisplayMonth(nextMonth)
      setDisplayYear(nextYear)
    } else if (currentView === "week") {
      const next = new Date(currentDate)
      next.setDate(next.getDate() + 7)
      setCurrentDate(next)
    } else if (currentView === "day") {
      const next = new Date(currentDate)
      next.setDate(next.getDate() + 1)
      setCurrentDate(next)
    }
  }

  const navigateToDate = (date: Date) => {
    setCurrentDate(date)
    setDisplayYear(date.getFullYear())
    setDisplayMonth(date.getMonth())
    setMiniCalendarYear(date.getFullYear())
    setMiniCalendarMonth(date.getMonth())
  }

  const navigateMiniCalendarPrevious = () => {
    const prevMonth = miniCalendarMonth === 0 ? 11 : miniCalendarMonth - 1
    const prevYear = miniCalendarMonth === 0 ? miniCalendarYear - 1 : miniCalendarYear
    setMiniCalendarMonth(prevMonth)
    setMiniCalendarYear(prevYear)
  }

  const navigateMiniCalendarNext = () => {
    const nextMonth = miniCalendarMonth === 11 ? 0 : miniCalendarMonth + 1
    const nextYear = miniCalendarMonth === 11 ? miniCalendarYear + 1 : miniCalendarYear
    setMiniCalendarMonth(nextMonth)
    setMiniCalendarYear(nextYear)
  }

  const handleMiniCalendarDayClick = (date: Date) => {
    navigateToDate(date)
  }

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate()
  }

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay()
  }

  const year = displayYear
  const month = displayMonth
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfMonth(year, month)
  const daysInPrevMonth = getDaysInMonth(year, month - 1)

  // Mini calendar calculation
  const miniDaysInMonth = getDaysInMonth(miniCalendarYear, miniCalendarMonth)
  const miniFirstDay = getFirstDayOfMonth(miniCalendarYear, miniCalendarMonth)
  const miniDaysInPrevMonth = getDaysInMonth(miniCalendarYear, miniCalendarMonth - 1)

  const calendarDays = []

  for (let i = firstDay - 1; i >= 0; i--) {
    calendarDays.push({
      day: daysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(year, month - 1, daysInPrevMonth - i),
    })
  }

  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(year, month, i),
    })
  }

  const remainingDays = 42 - calendarDays.length // 6 weeks * 7 days
  for (let i = 1; i <= remainingDays; i++) {
    calendarDays.push({
      day: i,
      isCurrentMonth: false,
      date: new Date(year, month + 1, i),
    })
  }

  // Mini calendar days
  const miniCalendarDays = []

  for (let i = miniFirstDay - 1; i >= 0; i--) {
    miniCalendarDays.push({
      day: miniDaysInPrevMonth - i,
      isCurrentMonth: false,
      date: new Date(miniCalendarYear, miniCalendarMonth - 1, miniDaysInPrevMonth - i),
    })
  }

  for (let i = 1; i <= miniDaysInMonth; i++) {
    miniCalendarDays.push({
      day: i,
      isCurrentMonth: true,
      date: new Date(miniCalendarYear, miniCalendarMonth, i),
    })
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return events.filter((event) => event.date === dateStr)
  }

  const formatDateForGrid = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const weeks = []
  for (let i = 0; i < 6; i++) {
    const week = []
    for (let j = 0; j < 7; j++) {
      const dayIndex = i * 7 + j
      if (dayIndex < calendarDays.length) {
        week.push(calendarDays[dayIndex])
      }
    }
    if (week.length > 0) weeks.push(week)
  }

  const togglePersonnel = (name: string) => {
    setExpandedPersonnel((prev) => ({ ...prev, [name]: !prev[name] }))
  }

  const handleSelectPerson = (name: string) => {
    setSelectedPerson(name)
    setShowWelcome(false)
  }

  const handleClosePersonDetails = () => {
    setSelectedPerson(null)
    setShowWelcome(true)
  }

  const addNotification = (notification: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }
    setNotifications((prev) => [newNotification, ...prev])

    // Show toast for new notifications
    addToast({
      type: notification.type === "reminder" ? "info" : "info",
      title: notification.title,
      message: notification.message,
    })
  }

  const addToast = (toast: { type: "success" | "error" | "warning" | "info"; title: string; message: string }) => {
    const newToast = {
      ...toast,
      id: Date.now().toString(),
    }
    setToasts((prev) => [...prev, newToast])
  }

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  const clearAllNotifications = () => {
    setNotifications([])
  }

  const unreadNotificationsCount = notifications.filter((n) => !n.read).length

  useEffect(() => {
    const checkReminders = () => {
      const now = new Date()
      events.forEach((event) => {
        if (event.reminders && Array.isArray(event.reminders)) {
          event.reminders.forEach((reminder: string) => {
            const eventDate = new Date(event.date)
            if (event.startTime) {
              const [hours, minutes] = event.startTime.split(":")
              eventDate.setHours(Number.parseInt(hours), Number.parseInt(minutes))
            }

            const reminderTime = new Date(eventDate)
            if (reminder.includes("min")) {
              const mins = Number.parseInt(reminder)
              reminderTime.setMinutes(reminderTime.getMinutes() - mins)
            } else if (reminder.includes("hour")) {
              const hrs = Number.parseInt(reminder)
              reminderTime.setHours(reminderTime.getHours() - hrs)
            } else if (reminder.includes("day")) {
              const days = Number.parseInt(reminder)
              reminderTime.setDate(reminderTime.getDate() - days)
            }

            // Check if reminder should fire (within 1 minute window)
            const diff = reminderTime.getTime() - now.getTime()
            if (diff > 0 && diff < 60000) {
              // Will fire within next minute
              const existingReminder = notifications.find((n) => n.eventId === event.id && n.message.includes(reminder))
              if (!existingReminder) {
                addNotification({
                  type: "reminder",
                  title: "Upcoming Event",
                  message: `${event.title} starts ${reminder.replace("min", " minutes").replace("hour", " hour").replace("day", " day")} from now`,
                  eventId: event.id,
                })
              }
            }
          })
        }
      })
    }

    const interval = setInterval(checkReminders, 60000) // Check every minute
    checkReminders() // Check immediately

    return () => clearInterval(interval)
  }, [events])

  const handleCreateEvent = (eventData: any) => {
    if (eventData.recurrence) {
      // Generate recurring events
      const dates = generateRecurringDates(eventData.date, eventData.recurrence)
      const recurringEvents = dates.map((date, idx) => ({
        ...eventData,
        id: `${Date.now()}-${idx}`,
        date,
        seriesId: Date.now().toString(),
        recurrence: eventData.recurrence,
        time: eventData.startTime ? `${eventData.startTime}` : null,
      }))
      setEvents([...events, ...recurringEvents])
      addToast({
        type: "success",
        title: "Events Created",
        message: `Created ${recurringEvents.length} recurring events`,
      })
    } else {
      const newEvent = {
        ...eventData,
        id: Date.now().toString(),
        time: eventData.startTime ? `${eventData.startTime}` : null,
      }
      setEvents([...events, newEvent])
      addToast({
        type: "success",
        title: "Event Created",
        message: `${eventData.title} has been added to your calendar`,
      })
    }
  }

  const handleEditEvent = (eventData: any) => {
    if (eventData.seriesId && eventData.recurrence) {
      // This is a recurring event - show modal to ask which events to edit
      setSelectedEvent(eventData)
      setEventSeriesAction("edit")
      setShowEventSeriesModal(true)
    } else {
      setEvents(events.map((e) => (e.id === eventData.id ? eventData : e)))
      addToast({
        type: "success",
        title: "Event Updated",
        message: `${eventData.title} has been updated`,
      })
    }
  }

  const handleEditEventChoice = (choice: "this" | "all" | "future", eventData: any) => {
    if (choice === "this") {
      // Edit only this instance
      setEvents(events.map((e) => (e.id === eventData.id ? { ...eventData, seriesId: undefined } : e)))
    } else if (choice === "all") {
      // Edit all instances
      setEvents(
        events.map((e) => (e.seriesId === eventData.seriesId ? { ...e, ...eventData, id: e.id, date: e.date } : e)),
      )
    } else if (choice === "future") {
      // Edit this and future instances
      const currentDate = new Date(eventData.date)
      setEvents(
        events.map((e) => {
          if (e.seriesId === eventData.seriesId) {
            const eventDate = new Date(e.date)
            if (eventDate >= currentDate) {
              return { ...e, ...eventData, id: e.id, date: e.date }
            }
          }
          return e
        }),
      )
    }
    setShowEventSeriesModal(false)
    addToast({
      type: "success",
      title: "Event Updated",
      message: `${eventData.title} has been updated`,
    })
  }

  const handleDeleteEvent = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event?.seriesId && event?.recurrence) {
      setSelectedEvent(event)
      setEventSeriesAction("delete")
      setShowEventSeriesModal(true)
    } else {
      setEvents(events.filter((e) => e.id !== eventId))
      addToast({
        type: "success",
        title: "Event Deleted",
        message: "Event has been removed from your calendar",
      })
    }
  }

  const handleDeleteEventChoice = (choice: "this" | "all" | "future") => {
    if (!selectedEvent) return

    if (choice === "this") {
      setEvents(events.filter((e) => e.id !== selectedEvent.id))
    } else if (choice === "all") {
      setEvents(events.filter((e) => e.seriesId !== selectedEvent.seriesId))
    } else if (choice === "future") {
      const currentDate = new Date(selectedEvent.date)
      setEvents(
        events.filter((e) => {
          if (e.seriesId === selectedEvent.seriesId) {
            const eventDate = new Date(e.date)
            return eventDate < currentDate
          }
          return true
        }),
      )
    }
    setShowEventSeriesModal(false)
    setShowEventDetailModal(false)
    addToast({
      type: "success",
      title: "Event Deleted",
      message: "Event has been removed from your calendar",
    })
  }

  const handleDuplicateEvent = (event: any) => {
    const newEvent = {
      ...event,
      id: Date.now().toString(),
      title: `${event.title} (Copy)`,
    }
    setEvents([...events, newEvent])
    addToast({
      type: "success",
      title: "Event Duplicated",
      message: `${event.title} has been duplicated`,
    })
  }

  const handleEventClick = (event: any) => {
    setSelectedEvent(event)
    setShowEventDetailModal(true)
  }

  const handleEventRightClick = (e: React.MouseEvent, event: any) => {
    e.preventDefault()
    e.stopPropagation()
    setContextMenu({
      event,
      position: { x: e.clientX, y: e.clientY },
    })
  }

  const handleCloseContextMenu = () => {
    setContextMenu(null)
  }

  const handleChangeEventColor = (event: any, color: string) => {
    setEvents(events.map((e) => (e.id === event.id ? { ...e, color } : e)))
    addToast({
      type: "success",
      title: "Color Updated",
      message: `Event color has been changed`,
    })
  }

  const handleMoveToCalendar = (event: any, calendar: string) => {
    setEvents(events.map((e) => (e.id === event.id ? { ...e, calendar } : e)))
    addToast({
      type: "success",
      title: "Event Moved",
      message: `Event moved to ${calendar}`,
    })
  }

  const handleDayClick = (date: Date) => {
    setSelectedDate(date)
    setSelectedTime(null)
    setShowEventCreateModal(true)
  }

  const handleTimeSlotClick = (date: Date, time: string) => {
    setSelectedDate(date)
    setSelectedTime(time)
    setShowEventCreateModal(true)
  }

  const handleEventResize = (event: any, newStartTime: string, newEndTime: string) => {
    setEvents(
      events.map((e) =>
        e.id === event.id ? { ...e, startTime: newStartTime, endTime: newEndTime, time: newStartTime } : e,
      ),
    )
    addToast({
      type: "success",
      title: "Event Updated",
      message: `${event.title} duration has been changed`,
    })
  }

  const handleCommand = (command: string) => {
    switch (command) {
      case "create-event":
        setShowEventCreateModal(true)
        break
      case "today":
        navigateToToday()
        break
      case "week-view":
        setCurrentView("week")
        break
      case "day-view":
        setCurrentView("day")
        break
      case "month-view":
        setCurrentView("month")
        break
      case "agenda-view":
        setCurrentView("agenda")
        break
      case "settings":
        setShowSettings(true)
        break
      case "search-events":
        // TODO: Focus search
        break
    }
  }

  const handleDragStart = (event: any) => {
    setDraggedEvent(event)
  }

  const handleDragEnd = (event: any, newDate: string) => {
    if (draggedEvent && newDate !== draggedEvent.date) {
      const updatedEvent = { ...draggedEvent, date: newDate }
      setEvents(events.map((e) => (e.id === draggedEvent.id ? updatedEvent : e)))
      addToast({
        type: "success",
        title: "Event Moved",
        message: `${draggedEvent.title} has been moved`,
      })
    }
    setDraggedEvent(null)
  }

  const isDuplicate = (e: React.DragEvent): boolean => {
    // In a real app, you might check e.altKey, but for drag/drop,
    // we'll pass this information via dataTransfer.
    return e.dataTransfer.getData("isDuplicate") === "true"
  }

  const handleDrop = (e: React.DragEvent, date: Date) => {
    e.preventDefault()

    if (draggedEvent) {
      const newDateStr = date.toISOString().split("T")[0]

      if (isDuplicate(e)) {
        const duplicatedEvent = {
          ...draggedEvent,
          id: Date.now().toString(),
          date: newDateStr,
          title: `${draggedEvent.title} (Copy)`,
        }
        setEvents([...events, duplicatedEvent])
        addToast({
          type: "success",
          title: "Event Duplicated",
          message: `${draggedEvent.title} has been duplicated`,
        })
      } else {
        handleDragEnd(draggedEvent, newDateStr)
      }
    }
    setDraggedEvent(null) // Ensure draggedEvent is cleared regardless of operation
  }

  const handleEventClickWithSelection = (e: React.MouseEvent, event: any) => {
    if (e.metaKey || e.ctrlKey) {
      // Cmd/Ctrl+Click to toggle selection
      e.stopPropagation()
      setSelectedEvents((prev) =>
        prev.includes(event.id) ? prev.filter((id) => id !== event.id) : [...prev, event.id],
      )
    } else if (e.shiftKey && selectedEvents.length > 0) {
      // Shift+Click to select range
      e.stopPropagation()
      const lastSelectedId = selectedEvents[selectedEvents.length - 1]
      const lastSelectedIndex = events.findIndex((e) => e.id === lastSelectedId)
      const clickedIndex = events.findIndex((e) => e.id === event.id)

      const start = Math.min(lastSelectedIndex, clickedIndex)
      const end = Math.max(lastSelectedIndex, clickedIndex)
      const rangeIds = events.slice(start, end + 1).map((e) => e.id)

      setSelectedEvents([...new Set([...selectedEvents, ...rangeIds])])
    } else {
      // Normal click - clear selection and open detail
      if (selectedEvents.length > 0) {
        setSelectedEvents([])
      } else {
        handleEventClick(event)
      }
    }
  }

  const handleClearSelection = () => {
    setSelectedEvents([])
  }

  const handleApplyBulkAction = (value: string) => {
    if (bulkAction === "color") {
      setEvents(events.map((e) => (selectedEvents.includes(e.id) ? { ...e, color: value } : e)))
      addToast({
        type: "success",
        title: "Color Changed",
        message: `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""} updated`,
      })
    } else {
      setEvents(events.map((e) => (selectedEvents.includes(e.id) ? { ...e, calendar: value } : e)))
      addToast({
        type: "success",
        title: "Events Moved",
        message: `${selectedEvents.length} event${selectedEvents.length > 1 ? "s" : ""} moved to ${value}`,
      })
    }
    setSelectedEvents([])
  }

  const filteredPersonnel = personnelData[0].items.filter((item) => {
    if (filters.length === 0) return true

    return filters.every((filter) => {
      const value = item.properties[filter.property]
      const filterValue = filter.value.toLowerCase()

      if (filter.operator === "is") {
        return String(value).toLowerCase() === filterValue
      } else if (filter.operator === "is-not") {
        return String(value).toLowerCase() !== filterValue
      } else if (filter.operator === "contains") {
        return String(value).toLowerCase().includes(filterValue)
      }
      return true
    })
  })

  const sortedPersonnel = sort
    ? [...filteredPersonnel].sort((a, b) => {
        const aValue = a.properties[sort.property]
        const bValue = b.properties[sort.property]

        if (sort.direction === "asc") {
          return String(aValue).localeCompare(String(bValue))
        } else {
          return String(bValue).localeCompare(String(aValue))
        }
      })
    : filteredPersonnel

  const allProperties = personnelData[0].items.length > 0 ? Object.keys(personnelData[0].items[0].properties) : []

  // Event hover handlers
  const handleEventMouseEnter = (e: React.MouseEvent, event: any) => {
    setHoverTimeout(
      setTimeout(() => {
        setHoverPreview({ event, position: { x: e.clientX, y: e.clientY } })
      }, 500),
    )
  }

  const handleEventMouseLeave = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setHoverPreview(null)
  }

  const handleCloseHoverPreview = () => {
    setHoverPreview(null)
  }

  const handleUpdateCalendar = (calendar: Calendar) => {
    setCalendars(calendars.map((c) => (c.id === calendar.id ? calendar : c)))
  }

  const handleReorderCalendars = (newCalendars: Calendar[]) => {
    setCalendars(newCalendars)
  }

  const handleToggleVisibility = (id: string) => {
    setCalendars(calendars.map((c) => (c.id === id ? { ...c, visible: !c.visible } : c)))
  }

  const handleSetDefault = (id: string) => {
    setCalendars(calendars.map((c) => ({ ...c, isDefault: c.id === id })))
    addToast({
      type: "success",
      title: "Default Calendar Set",
      message: "New events will be added to this calendar",
    })
  }

  const handleCreateGroup = (name: string) => {
    const newGroup = {
      id: Date.now().toString(),
      name,
      expanded: true,
    }
    setCalendarGroups([...calendarGroups, newGroup])
  }

  const handleAddToGroup = (calendarId: string, groupId: string) => {
    setCalendars(calendars.map((c) => (c.id === calendarId ? { ...c, groupId } : c)))
  }

  const handleImportCalendar = (file: File) => {
    // Parse ICS/CSV file and import events
    const reader = new FileReader()
    reader.onload = (e) => {
      const content = e.target?.result as string
      // TODO: Parse ICS format and add events
      addToast({
        type: "success",
        title: "Calendar Imported",
        message: `Successfully imported ${file.name}`,
      })
    }
    reader.readAsText(file)
  }

  const handleExportCalendar = (calendarId: string, format: "ics" | "csv") => {
    // Export events to ICS/CSV format
    const calendar = calendars.find((c) => c.id === calendarId)
    const calendarEvents = events.filter((e) => e.calendar === calendarId || !e.calendar)

    if (format === "ics") {
      // Generate ICS content
      let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//Notion Calendar//EN\n"
      calendarEvents.forEach((event) => {
        icsContent += "BEGIN:VEVENT\n"
        icsContent += `UID:${event.id}\n`
        icsContent += `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, "").split(".")[0]}Z\n`
        icsContent += `DTSTART:${event.date.replace(/-/g, "")}T${event.startTime?.replace(":", "") || "000000"}\n`
        icsContent += `SUMMARY:${event.title}\n`
        if (event.location) icsContent += `LOCATION:${event.location}\n`
        if (event.description) icsContent += `DESCRIPTION:${event.description}\n`
        icsContent += "END:VEVENT\n"
      })
      icsContent += "END:VCALENDAR"

      const blob = new Blob([icsContent], { type: "text/calendar" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${calendar?.name || "calendar"}.ics`
      a.click()
    } else {
      // Generate CSV content
      let csvContent = "Subject,Start Date,Start Time,End Date,End Time,Location,Description\n"
      calendarEvents.forEach((event) => {
        csvContent += `"${event.title}","${event.date}","${event.startTime || ""}","${event.date}","${event.endTime || ""}","${event.location || ""}","${event.description || ""}"\n`
      })

      const blob = new Blob([csvContent], { type: "text/csv" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${calendar?.name || "calendar"}.csv`
      a.click()
    }

    addToast({
      type: "success",
      title: "Calendar Exported",
      message: `Exported to ${format.toUpperCase()} format`,
    })
  }

  const handleShareCalendar = (email: string, permission: "view" | "edit" | "manage") => {
    const newShare = {
      id: Date.now().toString(),
      email,
      permission,
      calendarId: selectedCalendarForShare?.id,
    }
    setCalendarShares([...calendarShares, newShare])
    addToast({
      type: "success",
      title: "Calendar Shared",
      message: `Shared with ${email}`,
    })
  }

  const handleRevokeShare = (shareId: string) => {
    setCalendarShares(calendarShares.filter((s) => s.id !== shareId))
    addToast({
      type: "success",
      title: "Access Revoked",
      message: "Calendar access has been removed",
    })
  }

  const handleGenerateShareLink = (permission: "view" | "edit") => {
    const link = `https://calendar.notion.so/share/${selectedCalendarForShare?.id}?permission=${permission}`
    return link
  }

  const handleOpenShareModal = (calendar: Calendar) => {
    setSelectedCalendarForShare(calendar)
    setShowShareModal(true)
  }

  // Dummy personnel and setPersonnel for database item context menu handlers
  const [personnel, setPersonnel] = useState(personnelData[0].items)

  // New handlers for files
  const handleFilesAdded = (eventId: string, files: File[]) => {
    setEventFiles((prev) => ({
      ...prev,
      [eventId]: [...(prev[eventId] || []), ...files],
    }))
    addToast({
      type: "success",
      title: "Files Attached",
      message: `${files.length} file${files.length > 1 ? "s" : ""} added to event`,
    })
  }

  const handleRemoveFile = (eventId: string, fileIndex: number) => {
    setEventFiles((prev) => ({
      ...prev,
      [eventId]: (prev[eventId] || []).filter((_, i) => i !== fileIndex),
    }))
  }

  // New handler for reordering database items
  const handleReorderDatabaseItems = (fromIndex: number, toIndex: number) => {
    const newPersonnel = [...personnel]
    const [removed] = newPersonnel.splice(fromIndex, 1)
    newPersonnel.splice(toIndex, 0, removed)
    setPersonnel(newPersonnel)
    addToast({
      type: "success",
      title: "Items Reordered",
      message: "Database items have been reordered",
    })
  }

  // New handler for dragging event to a calendar
  const handleDragEventToCalendar = (event: any, calendarId: string) => {
    setEvents(events.map((e) => (e.id === event.id ? { ...e, calendar: calendarId } : e)))
    const calendar = calendars.find((c) => c.id === calendarId)
    addToast({
      type: "success",
      title: "Event Moved",
      message: `${event.title} moved to ${calendar?.name}`,
    })
  }

  // Add the missing handleDragOver function
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  return (
    <div className="flex h-screen bg-[#1a1a1a] text-white dark">
      {/* Left Sidebar */}
      <div className="w-[220px] bg-[#1c1c1c] border-r border-[#2a2a2a] flex flex-col">
        {leftSidebarView === "calendar" ? (
          <>
            {/* Mini Calendar */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-4">
                <button onClick={navigateMiniCalendarPrevious} className="hover:bg-[#2a2a2a] p-1 rounded">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <h3 className="text-sm font-medium">
                  {new Date(miniCalendarYear, miniCalendarMonth).toLocaleDateString("en-US", {
                    month: "long",
                    year: "numeric",
                  })}
                </h3>
                <button onClick={navigateMiniCalendarNext} className="hover:bg-[#2a2a2a] p-1 rounded">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Mini calendar grid */}
              <div className="text-xs">
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day) => (
                    <div key={day} className="text-center text-[#6b6b6b] font-medium">
                      {day}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {miniCalendarDays.slice(0, 35).map((day, idx) => {
                    const isToday =
                      day.date.getDate() === new Date().getDate() &&
                      day.date.getMonth() === new Date().getMonth() &&
                      day.date.getFullYear() === new Date().getFullYear()
                    const isSelected =
                      day.date.getDate() === currentDate.getDate() &&
                      day.date.getMonth() === currentDate.getMonth() &&
                      day.date.getFullYear() === currentDate.getFullYear()

                    return (
                      <button
                        key={idx}
                        onClick={() => handleMiniCalendarDayClick(day.date)}
                        className={cn(
                          "aspect-square flex items-center justify-center rounded text-xs hover:bg-[#2a2a2a] transition-colors",
                          !day.isCurrentMonth && "text-[#4a4a4a]",
                          isToday && "bg-today font-semibold text-today-foreground",
                          isSelected && !isToday && "bg-[#3a3a3a]",
                        )}
                      >
                        {day.day}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Scheduling Section */}
            <div className="px-4 py-2 border-t border-[#2a2a2a]">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2 text-sm text-[#9a9a9a]">
                  <span>Scheduling</span>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setShowCalendarList(true)}
                    className="text-[#6b6b6b] hover:text-white p-1 rounded hover:bg-[#2a2a2a]"
                    title="Manage Calendars"
                  >
                    <span className="text-xs">⚙️</span>
                  </button>
                  <button className="text-[#6b6b6b] hover:text-white">
                    <span className="text-xs">👁️</span>
                  </button>
                </div>
              </div>

              <div className="mb-3">
                <button
                  onClick={() => setShowSchedulingLinks(true)}
                  className="w-full px-3 py-2 bg-info/10 hover:bg-info/20 text-info rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <span>🔗</span>
                  Scheduling Links
                  {schedulingLinks.length > 0 && (
                    <span className="ml-auto bg-info text-white text-xs px-2 py-0.5 rounded-full">
                      {schedulingLinks.length}
                    </span>
                  )}
                </button>
              </div>

              <div className="space-y-2 text-sm">
                <div className="text-[#7a7a7a] text-xs mb-2">griffinradcliffe@gmail.com</div>
                {calendars.map((calendar) => (
                  <div
                    key={calendar.id}
                    className="flex items-center gap-2 group"
                    onContextMenu={(e) => handleCalendarRightClick(e, calendar)}
                  >
                    <button
                      onClick={() => handleToggleVisibility(calendar.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {calendar.visible ? (
                        <span className="text-xs">👁️</span>
                      ) : (
                        <span className="text-xs opacity-50">👁️</span>
                      )}
                    </button>
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: calendar.color }}></div>
                    <span className={cn("text-[#d0d0d0] text-xs flex-1 truncate", !calendar.visible && "opacity-50")}>
                      {calendar.name}
                      {calendar.isDefault && " (Default)"}
                    </span>
                    <button
                      onClick={() => handleOpenShareModal(calendar)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity hover:text-white"
                      title="Share Calendar"
                    >
                      <span className="text-xs">🔗</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="mt-3 space-y-1">
                <button className="w-full text-xs text-[#7a7a7a] hover:text-white flex items-center gap-1 py-1">
                  <Plus className="w-3 h-3" />
                  Add calendar account
                </button>
                <button
                  onClick={() => setShowImportExport(true)}
                  className="w-full text-xs text-[#7a7a7a] hover:text-white flex items-center gap-1 py-1"
                >
                  <span className="text-xs">📥</span>
                  Import/Export
                </button>
              </div>
            </div>

            <div className="px-4 py-3 border-t border-[#2a2a2a]">
              <button
                onClick={() => setShowDatabaseModal(true)}
                className="text-xs text-[#7a7a7a] hover:text-white flex items-center gap-2"
              >
                <span>📊</span>
                Add Notion database
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 overflow-auto flex flex-col">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-4">
                <button className="hover:bg-[#2a2a2a] p-1 rounded">
                  <Search className="w-4 h-4 text-[#6b6b6b]" />
                </button>
                <span className="flex items-center gap-1 text-xs text-[#d0d0d0]">
                  <span className="text-red-500">👥</span>
                  <span>Personnel Roster</span>
                </span>
                <button className="hover:bg-[#2a2a2a] p-1 rounded ml-auto">
                  <MoreHorizontal className="w-4 h-4 text-[#6b6b6b]" />
                </button>
                <button className="hover:bg-[#2a2a2a] p-1 rounded">
                  <Plus className="w-4 h-4 text-[#6b6b6b]" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <button
                  onClick={() => setDatabaseView("list")}
                  className={cn(
                    "p-1 rounded",
                    databaseView === "list" ? "bg-[#2a2a2a] text-white" : "text-[#6b6b6b] hover:text-white",
                  )}
                  title="List View"
                >
                  <span className="text-sm">☰</span>
                </button>
                <button
                  onClick={() => setDatabaseView("table")}
                  className={cn(
                    "p-1 rounded",
                    databaseView === "table" ? "bg-[#2a2a2a] text-white" : "text-[#6b6b6b] hover:text-white",
                  )}
                  title="Table View"
                >
                  <Table className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDatabaseView("board")}
                  className={cn(
                    "p-1 rounded",
                    databaseView === "board" ? "bg-[#2a2a2a] text-white" : "text-[#6b6b6b] hover:text-white",
                  )}
                  title="Board View"
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>

                <div className="ml-auto flex items-center gap-1">
                  <DatabaseFilter properties={allProperties} onFilterChange={setFilters} />
                  <DatabaseSort properties={allProperties} onSortChange={setSort} />
                </div>
              </div>

              {selectedDatabase && leftSidebarView === "database" && (
                <div className="flex-1 overflow-y-auto px-4 py-2 space-y-1">
                  {personnel.map((person, index) => (
                    <DraggableDatabaseItem
                      key={person.id}
                      item={person}
                      index={index}
                      onReorder={handleReorderDatabaseItems}
                    >
                      <div onContextMenu={(e) => handleDatabaseItemRightClick(e, person)}>
                        {/* </CHANGE> Adding missing onToggle and isExpanded props to DatabaseCard */}
                        <DatabaseCard
                          person={person}
                          isExpanded={!!expandedPersonnel[person.name]}
                          onToggle={() =>
                            setExpandedPersonnel((prev) => ({ ...prev, [person.name]: !prev[person.name] }))
                          }
                          onSelect={() => handleSelectPerson(person.name)}
                        />
                      </div>
                    </DraggableDatabaseItem>
                  ))}
                </div>
              )}
            </div>

            {databaseView === "table" && (
              <div className="flex-1 border-t border-[#2a2a2a] overflow-auto">
                <DatabaseTableView items={sortedPersonnel} onItemClick={handleSelectPerson} />
              </div>
            )}
            {databaseView === "board" && (
              <div className="flex-1 border-t border-[#2a2a2a] overflow-auto">
                <DatabaseBoardView items={sortedPersonnel} onItemClick={handleSelectPerson} />
              </div>
            )}

            <button
              onClick={() => setShowDatabaseModal(true)}
              className="mt-4 w-full text-xs text-[#7a7a7a] hover:text-white flex items-center gap-2 p-2"
            >
              <Plus className="w-3 h-3" />
              Add Notion database
            </button>
          </div>
        )}

        <div className="flex-1"></div>

        {/* Bottom icons */}
        <div className="p-3 border-t border-[#2a2a2a] flex items-center gap-3">
          <button className="text-[#6b6b6b] hover:text-white">
            <span className="text-sm">🎯</span>
          </button>
          <button className="text-[#6b6b6b] hover:text-white">
            <span className="text-sm">✨</span>
          </button>
          <button onClick={() => setShowNotificationCenter(true)} className="text-[#6b6b6b] hover:text-white relative">
            <span className="text-sm">🔔</span>
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive rounded-full text-[10px] flex items-center justify-center text-white font-medium">
                {unreadNotificationsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Main Calendar Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="h-14 border-b border-[#2a2a2a] flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center gap-4">
            <span className="text-xs text-[#6b6b6b]">🎨</span>
            <ViewSwitcher currentView={currentView} onViewChange={setCurrentView} />
            <button onClick={navigateToToday} className="text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] px-3 py-1.5 rounded">
              Today
            </button>
            <button onClick={navigatePrevious} className="hover:bg-[#2a2a2a] p-1.5 rounded">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={navigateNext} className="hover:bg-[#2a2a2a] p-1.5 rounded">
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowDatePicker(true)}
              className="hover:bg-[#2a2a2a] p-1.5 rounded"
              title="Go to date (⌘G)"
            >
              <CalendarIcon className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowEventCreateModal(true)}
              className="flex items-center gap-2 bg-info hover:bg-info/90 text-info-foreground px-3 py-1.5 rounded text-sm font-medium ml-4"
            >
              <Plus className="w-4 h-4" />
              <span>New Event</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="hover:bg-[#2a2a2a] px-3 py-1.5 rounded">
              <SearchBar events={events} onEventSelect={handleEventClick} />
            </div>
          </div>
        </div>

        {/* Calendar Views */}
        {currentView === "week" ? (
          <div className="flex-1 min-h-0">
            <WeekView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
              onEventResize={handleEventResize}
              onEventRightClick={handleEventRightClick}
            />
          </div>
        ) : currentView === "day" ? (
          <div className="flex-1 min-h-0">
            <DayView
              currentDate={currentDate}
              events={events}
              onEventClick={handleEventClick}
              onTimeSlotClick={handleTimeSlotClick}
              onEventResize={handleEventResize}
              onEventRightClick={handleEventRightClick}
            />
          </div>
        ) : currentView === "agenda" ? (
          <div className="flex-1 min-h-0">
            <AgendaView currentDate={currentDate} events={events} onEventClick={handleEventClick} />
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <div className="min-w-[900px] h-full flex flex-col">
              {/* Week days header */}
              <div className="grid grid-cols-7 border-b border-[#2a2a2a] bg-[#1a1a1a] z-10 shrink-0">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="p-4 text-xs text-[#6b6b6b] font-medium border-r border-[#2a2a2a] last:border-r-0"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar weeks - now flex-1 to fill remaining space */}
              <div className="flex-1 flex flex-col">
                {weeks.map((week, weekIdx) => (
                  <div key={weekIdx} className="flex-1 grid grid-cols-7 border-b border-[#2a2a2a]">
                    {week.map((day, dayIdx) => {
                      const dayEvents = getEventsForDate(day.date)

                      return (
                        <div
                          key={dayIdx}
                          className={cn(
                            "p-2 border-r border-[#2a2a2a] last:border-r-0 hover:bg-[#202020] cursor-pointer",
                            !day.isCurrentMonth && "bg-[#151515]",
                          )}
                          onClick={() => handleDayClick(day.date)}
                          onDrop={(e) => handleDrop(e, day.date)}
                          onDragOver={handleDragOver}
                          // Add right-click handler for selection
                          onContextMenu={(e) => handleSelectionRightClick(e)}
                        >
                          <div className={cn("text-xs mb-2", day.isCurrentMonth ? "text-[#d0d0d0]" : "text-[#5a5a5a]")}>
                            {day.day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.map((event, idx) => {
                              const isSelected = selectedEvents.includes(event.id)

                              return (
                                <div
                                  key={idx}
                                  onContextMenu={(e) => handleEventRightClick(e, event)}
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleEventClickWithSelection(e, event)
                                  }}
                                  onMouseEnter={(e) => handleEventMouseEnter(e, event)}
                                  onMouseLeave={handleEventMouseLeave}
                                >
                                  <DraggableEvent
                                    event={event}
                                    onClick={() => {}}
                                    onDragStart={handleDragStart}
                                    onDragEnd={handleDragEnd}
                                    className={cn(
                                      "text-xs px-2 py-1 rounded text-left transition-all",
                                      event.color && `bg-[${event.color}]/60`,
                                      event.type === "holiday" &&
                                        !event.color &&
                                        "bg-event-holiday/40 text-success-foreground",
                                      event.type === "info" && !event.color && "bg-muted text-muted-foreground",
                                      !event.type &&
                                        !event.color &&
                                        event.time &&
                                        "text-foreground bg-event-default/60",
                                      isSelected &&
                                        "ring-2 ring-blue-500 ring-offset-2 ring-offset-[#1a1a1a] scale-105",
                                    )}
                                    style={event.color ? { backgroundColor: `${event.color}99` } : undefined}
                                  >
                                    {event.time && <span className="text-[#8a8a8a]">{event.time} </span>}
                                    {event.title}
                                  </DraggableEvent>
                                </div>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar */}
      {(showWelcome || selectedPerson) && (
        <div className="w-[320px] bg-[#1c1c1c] border-l border-[#2a2a2a] overflow-auto">
          <div className="p-6">
            {showWelcome && !selectedPerson ? (
              <>
                {/* Welcome Screen */}
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-sm font-medium">Welcome to Notion Calendar</h2>
                  <button onClick={() => setShowWelcome(false)} className="hover:bg-[#2a2a2a] p-1 rounded">
                    <X className="w-4 h-4 text-[#6b6b6b]" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3 text-sm text-[#9a9a9a]">
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-[#4a4a4a]"></div>
                      </div>
                      <span>Use ⌘K command palette</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-[#4a4a4a]"></div>
                      </div>
                      <span>Connect another calendar</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-[#4a4a4a]"></div>
                      </div>
                      <span>Connect Notion workspace</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-4 h-4 mt-0.5 shrink-0">
                        <div className="w-4 h-4 rounded-full border-2 border-[#4a4a4a]"></div>
                      </div>
                      <span>Create scheduling link</span>
                    </div>
                  </div>

                  <div className="border-t border-[#2a2a2a] pt-6 mt-6">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-sm font-medium">Invite to Notion Calendar</h3>
                      <button className="hover:bg-[#2a2a2a] p-1 rounded">
                        <X className="w-4 h-4 text-[#6b6b6b]" />
                      </button>
                    </div>
                    <p className="text-sm text-[#9a9a9a] mb-4">Who else would benefit from Notion Calendar?</p>
                    <button className="w-full flex items-center justify-between text-sm text-[#9a9a9a] hover:text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] px-3 py-2 rounded">
                      <span>Invite friend or teammate</span>
                      <span className="text-xs bg-[#3a3a3a] px-1.5 py-0.5 rounded">⌘</span>
                    </button>
                  </div>

                  <div className="border-t border-[#2a2a2a] pt-6">
                    <h3 className="text-sm font-medium mb-3">Useful shortcuts</h3>
                    <div className="space-y-2 text-sm text-[#9a9a9a]">
                      <div className="flex items-center justify-between">
                        <span>Command menu</span>
                        <span className="text-xs bg-[#2a2a2a] px-2 py-1 rounded">⌘ K</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Toggle sidebar</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Go to date</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>All keyboard shortcuts</span>
                        <span className="text-xs">→</span>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Person Details */}
                <div className="flex items-start justify-between mb-6">
                  <h2 className="text-sm font-medium text-[#9a9a9a]">Page</h2>
                  <button onClick={handleClosePersonDetails} className="hover:bg-[#2a2a2a] p-1 rounded">
                    <X className="w-4 h-4 text-[#6b6b6b]" />
                  </button>
                </div>

                <div className="space-y-6 border-0">
                  <h3 className="text-lg font-semibold mb-6">{selectedPerson}</h3>

                  {personnelData[0].items
                    .filter((p) => p.name === selectedPerson)
                    .map((person) => (
                      <div key={person.id} className="space-y-4">
                        <div className="pb-4">
                          <div className="text-xs text-[#6b6b6b] mb-2">Created At</div>
                          <div className="text-sm text-[#d0d0d0]">7:33 PM</div>
                          <div className="text-xs text-[#8a8a8a] mt-1">
                            <span className="inline-flex items-center gap-1">
                              <span>→</span>
                              <span className="text-[#6b6b6b]">7:33 PM</span>
                              <span className="text-[#6b6b6b]">0 min</span>
                            </span>
                          </div>
                          <div className="text-xs text-[#6b6b6b] mt-1">Sat Oct 18</div>
                        </div>

                        <div className="pb-4">
                          <div className="text-xs text-[#6b6b6b] mb-1">All-day</div>
                          <div className="text-xs text-[#6b6b6b]">Time zone</div>
                        </div>

                        <div className="border-t border-[#2a2a2a] pt-4">
                          <div className="flex items-center gap-2 mb-4">
                            <span className="text-xs">👥</span>
                            {/* Replace text-blue-400 with text-info-foreground */}
                            <span className="text-sm text-info-foreground">Personnel Roster</span>
                            <span className="text-xs text-[#6b6b6b]">All Properties</span>
                          </div>

                          <div className="space-y-2.5">
                            {Object.entries(person.properties).map(([key, value]) => (
                              <div key={key} className="flex items-center gap-3 text-sm">
                                {typeof value === "boolean" ? (
                                  <>
                                    <div
                                      className={cn(
                                        "w-4 h-4 rounded border flex items-center justify-center shrink-0",
                                        value ? "bg-info border-info" : "border-[#4a4a4a]",
                                      )}
                                    >
                                      {value && <span className="text-[10px] font-bold">✓</span>}
                                    </div>
                                    <span className="text-[#9a9a9a]">{key}</span>
                                    {value && (
                                      <span className="ml-auto w-4 h-4 rounded bg-info flex items-center justify-center">
                                        <span className="text-[10px] font-bold">✓</span>
                                      </span>
                                    )}
                                  </>
                                ) : key === "Certification Level" ? (
                                  <>
                                    <span className="text-[#9a9a9a] flex-1">{key}</span>
                                    {/* Replace badge colors with semantic tokens */}
                                    <span className="bg-badge-green text-badge-green-foreground px-3 py-1 rounded text-xs font-medium">
                                      {value}
                                    </span>
                                  </>
                                ) : key === "Shift" ? (
                                  <>
                                    <span className="text-[#9a9a9a] flex-1">{key}</span>
                                    {/* Replace bg-pink-900/50 text-pink-400 with semantic tokens */}
                                    <span className="bg-badge-pink text-badge-pink-foreground px-3 py-1 rounded-full text-xs font-medium flex items-center justify-center w-7 h-7">
                                      {value}
                                    </span>
                                  </>
                                ) : key === "Last Hold Date" ? (
                                  <>
                                    <span className="text-[#9a9a9a] flex-1">{key}</span>
                                    <span className="text-[#6b6b6b] text-xs italic">Empty</span>
                                  </>
                                ) : (
                                  <span className="text-[#6b6b6b]">
                                    {key}: {String(value)}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="border-t border-[#2a2a2a] pt-4">
                          <div className="text-xs text-[#6b6b6b] mb-2">Updated At</div>
                          <div className="text-sm text-[#d0d0d0]">{person.time}</div>
                        </div>

                        <div className="border-t border-[#2a2a2a] pt-4">
                          <button className="w-full flex items-center justify-between text-sm text-[#9a9a9a] hover:text-white bg-[#2a2a2a] hover:bg-[#3a3a3a] px-3 py-2 rounded">
                            <span>Manage in Notion</span>
                            <span className="text-xs bg-[#3a3a3a] px-1.5 py-0.5 rounded">⌘</span>
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EventCreateModal
        isOpen={showEventCreateModal}
        onClose={() => {
          setShowEventCreateModal(false)
          setSelectedDate(null)
          setSelectedTime(null)
        }}
        onSave={handleCreateEvent}
        initialDate={selectedDate || undefined}
        initialTime={selectedTime || undefined}
      />

      <EventDetailModal
        isOpen={showEventDetailModal}
        onClose={() => {
          setShowEventDetailModal(false)
          setSelectedEvent(null)
        }}
        event={selectedEvent}
        onEdit={handleEditEvent}
        onDelete={handleDeleteEvent}
        onDuplicate={handleDuplicateEvent}
        // Pass eventFiles and handlers for file operations
        eventFiles={selectedEvent ? eventFiles[selectedEvent.id] || [] : []}
        onFilesAdded={(files) => selectedEvent && handleFilesAdded(selectedEvent.id, files)}
        onRemoveFile={(fileIndex) => selectedEvent && handleRemoveFile(selectedEvent.id, fileIndex)}
      />

      <EventSeriesModal
        isOpen={showEventSeriesModal}
        onClose={() => setShowEventSeriesModal(false)}
        onChoice={(choice) => {
          if (eventSeriesAction === "edit" && selectedEvent) {
            handleEditEventChoice(choice, selectedEvent)
          } else {
            handleDeleteEventChoice(choice)
          }
        }}
        title={selectedEvent?.title || ""}
        action={eventSeriesAction}
      />

      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommand={handleCommand}
      />

      <DatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onSelectDate={navigateToDate}
        initialDate={currentDate}
      />

      <NotificationCenter
        isOpen={showNotificationCenter}
        onClose={() => setShowNotificationCenter(false)}
        notifications={notifications}
        onMarkAsRead={markNotificationAsRead}
        onMarkAllAsRead={markAllNotificationsAsRead}
        onDelete={deleteNotification}
        onClearAll={clearAllNotifications}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSave={(newSettings) => {
          setSettings(newSettings)
          addToast({
            type: "success",
            title: "Settings Saved",
            message: "Your preferences have been updated",
          })
        }}
      />

      <ToastContainer toasts={toasts} onClose={removeToast} />

      {/* Database Modal */}
      {showDatabaseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#1c1c1c] rounded-lg w-[900px] max-h-[80vh] overflow-hidden flex">
            <div className="w-[400px] p-6 flex flex-col">
              <h2 className="text-lg font-semibold mb-2">Add databases to Calendar</h2>
              <p className="text-sm text-[#9a9a9a] mb-6">
                Use databases directly in Notion Calendar. Easily track upcoming tasks and events.
              </p>

              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-sm">📋</span>
                  <span className="text-sm">Griffin Long's Notion</span>
                </div>
              </div>

              <div className="flex-1 overflow-auto">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium">Suggested databases</h3>
                  {/* Replace text-blue-400 hover:text-blue-300 with semantic tokens */}
                  <button className="text-sm text-info-foreground hover:text-info">View all</button>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded">
                    {/* Replace bg-blue-500 with bg-info */}
                    <div className="w-5 h-5 bg-info rounded flex items-center justify-center text-xs">🤖</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#d0d0d0]">AI Models Catalog</div>
                    </div>
                    <input type="checkbox" className="w-4 h-4" />
                  </div>

                  <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded">
                    {/* Replace bg-green-500 with bg-success */}
                    <div className="w-5 h-5 bg-success rounded flex items-center justify-center text-xs">✓</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#d0d0d0]">Task Tracker</div>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>

                  <div className="flex items-center gap-3 p-2 hover:bg-[#2a2a2a] rounded">
                    {/* Replace bg-red-500 with bg-destructive */}
                    <div className="w-5 h-5 bg-destructive rounded flex items-center justify-center text-xs">👥</div>
                    <div className="flex-1">
                      <div className="text-sm text-[#d0d0d0]">Personnel Roster</div>
                    </div>
                    <input type="checkbox" className="w-4 h-4" defaultChecked />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-2">
                <button
                  onClick={() => {
                    setShowDatabaseModal(false)
                    setLeftSidebarView("database")
                    setShowWelcome(false)
                  }}
                  className="w-full bg-info hover:bg-info/90 text-info-foreground py-2 px-4 rounded text-sm font-medium"
                >
                  Connect 3 databases
                </button>
                <button
                  onClick={() => setShowDatabaseModal(false)}
                  className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white py-2 px-4 rounded text-sm"
                >
                  Maybe later
                </button>
              </div>
            </div>

            <div className="flex-1 bg-[#151515] p-6 flex items-center justify-center">
              <div className="text-center text-[#6b6b6b] text-sm">
                <div className="mb-2">Database Preview</div>
                <div className="text-xs">Connect databases to see them here</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Context Menu */}
      {contextMenu && (
        <EventContextMenu
          event={contextMenu.event}
          position={contextMenu.position}
          onClose={handleCloseContextMenu}
          onEdit={handleEditEvent}
          onDelete={handleDeleteEvent}
          onDuplicate={handleDuplicateEvent}
          onChangeColor={handleChangeEventColor}
          onMoveToCalendar={handleMoveToCalendar}
        />
      )}

      {calendarContextMenu && (
        <CalendarContextMenu
          calendar={calendarContextMenu.calendar}
          position={calendarContextMenu.position}
          onClose={() => setCalendarContextMenu(null)}
          onEdit={handleEditCalendar}
          onDelete={handleDeleteCalendar}
          onToggleVisibility={handleToggleVisibility}
          onSetDefault={handleSetDefaultCalendar}
          onShare={handleOpenShareModal}
          onExport={handleExportCalendarInitial}
          onChangeColor={handleChangeCalendarColor}
        />
      )}

      {databaseItemContextMenu && (
        <DatabaseItemContextMenu
          item={databaseItemContextMenu.item}
          position={databaseItemContextMenu.position}
          onClose={() => setDatabaseItemContextMenu(null)}
          onEdit={handleEditDatabaseItem}
          onDelete={handleDeleteDatabaseItem}
          onDuplicate={handleDuplicateDatabaseItem}
          onOpenInFull={handleOpenDatabaseItemInFull}
        />
      )}

      {selectionContextMenu && selectedEvents.length > 0 && (
        <SelectionContextMenu
          selectedCount={selectedEvents.length}
          position={selectionContextMenu.position}
          onClose={() => setSelectionContextMenu(null)}
          onDeleteAll={handleBulkDelete}
          onDuplicateAll={handleBulkDuplicate}
          onChangeColor={handleBulkChangeColor}
          onMoveToCalendar={handleBulkMoveToCalendar}
        />
      )}

      <MultiSelectToolbar
        selectedCount={selectedEvents.length}
        onClear={handleClearSelection}
        onDelete={handleBulkDelete}
        onChangeColor={handleBulkChangeColor}
        onMoveToCalendar={handleBulkMoveToCalendar}
      />

      <BulkActionModal
        isOpen={showBulkActionModal}
        onClose={() => setShowBulkActionModal(false)}
        action={bulkAction}
        selectedCount={selectedEvents.length}
        onApply={handleApplyBulkAction}
      />

      {hoverPreview && (
        <EventHoverPreview
          event={hoverPreview.event}
          position={hoverPreview.position}
          onClose={handleCloseHoverPreview}
        />
      )}

      <CalendarListModal
        isOpen={showCalendarList}
        onClose={() => setShowCalendarList(false)}
        calendars={calendars}
        groups={calendarGroups}
        onUpdateCalendar={handleUpdateCalendar}
        onDeleteCalendar={handleDeleteCalendar}
        onReorderCalendars={handleReorderCalendars}
        onToggleVisibility={handleToggleVisibility}
        onSetDefault={handleSetDefault}
        onCreateGroup={handleCreateGroup}
        onAddToGroup={handleAddToGroup}
      />

      <CalendarImportExport
        isOpen={showImportExport}
        onClose={() => setShowImportExport(false)}
        onImport={handleImportCalendar}
        onExport={handleExportCalendar}
        calendars={calendars.map((c) => ({ id: c.id, name: c.name }))}
      />

      {selectedCalendarForShare && (
        <CalendarShareModal
          isOpen={showShareModal}
          onClose={() => {
            setShowShareModal(false)
            setSelectedCalendarForShare(null)
          }}
          calendarName={selectedCalendarForShare.name}
          calendarId={selectedCalendarForShare.id}
          onShare={handleShareCalendar}
          onRevoke={handleRevokeShare}
          onGenerateLink={handleGenerateShareLink}
          existingShares={calendarShares.filter((s) => s.calendarId === selectedCalendarForShare.id)}
        />
      )}

      {showSchedulingLinks && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Scheduling Links</h2>
              <button
                onClick={() => setShowSchedulingLinks(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-muted-foreground">
                  Create booking links that let people schedule time with you
                </p>
                <div className="flex gap-2">
                  <Button onClick={() => setShowAvailabilitySettings(true)} variant="outline" size="sm">
                    <Clock className="w-4 h-4 mr-2" />
                    Set Availability
                  </Button>
                  <Button
                    onClick={() => {
                      setEditingSchedulingLink(null)
                      setShowSchedulingLinkModal(true)
                    }}
                    size="sm"
                    className="bg-info hover:bg-info/90"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    New Link
                  </Button>
                </div>
              </div>

              <SchedulingLinksList
                links={schedulingLinks}
                onEdit={handleEditSchedulingLink}
                onDelete={handleDeleteSchedulingLink}
                onViewBookings={handleViewBookings}
              />
            </div>
          </div>
        </div>
      )}

      <SchedulingLinkModal
        isOpen={showSchedulingLinkModal}
        onClose={() => {
          setShowSchedulingLinkModal(false)
          setEditingSchedulingLink(null)
        }}
        link={editingSchedulingLink}
        onSave={handleSaveSchedulingLink}
      />

      {showAvailabilitySettings && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-card border-b border-border p-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Weekly Availability</h2>
              <button
                onClick={() => setShowAvailabilitySettings(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-muted-foreground mb-6">
                Set your regular working hours. These times will be available for booking across all your scheduling
                links.
              </p>

              <AvailabilityEditor availability={weeklyAvailability} onChange={setWeeklyAvailability} />

              <div className="flex justify-end gap-2 mt-6 pt-6 border-t border-border">
                <Button onClick={() => setShowAvailabilitySettings(false)} variant="outline">
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setShowAvailabilitySettings(false)
                    addToast({
                      type: "success",
                      title: "Availability Updated",
                      message: "Your weekly hours have been saved",
                    })
                  }}
                  className="bg-info hover:bg-info/90"
                >
                  Save Availability
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
