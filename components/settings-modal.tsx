"use client"

import { useState } from "react"
import { X, Check, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: Settings
  onSave: (settings: Settings) => void
}

export interface Settings {
  // General
  defaultView: "month" | "week" | "day" | "agenda"
  weekStartsOn: "sunday" | "monday"
  timeFormat: "12h" | "24h"
  dateFormat: "MM/DD/YYYY" | "DD/MM/YYYY" | "YYYY-MM-DD"

  // Appearance
  theme: "dark" | "light" | "system"
  showWeekNumbers: boolean
  showDeclinedEvents: boolean
  compactMode: boolean

  // Calendar
  defaultEventDuration: number // in minutes
  defaultReminders: string[]
  showWeatherForecast: boolean
  enableDragAndDrop: boolean

  // Notifications
  enableNotifications: boolean
  enableDesktopNotifications: boolean
  enableEmailNotifications: boolean
  notificationSound: boolean

  // Privacy
  showEventLocation: boolean
  showEventDescription: boolean
  allowGuestList: boolean
}

export function SettingsModal({ isOpen, onClose, settings: initialSettings, onSave }: SettingsModalProps) {
  const [settings, setSettings] = useState<Settings>(initialSettings)
  const [activeSection, setActiveSection] = useState<
    "general" | "appearance" | "calendar" | "notifications" | "privacy"
  >("general")

  if (!isOpen) return null

  const handleSave = () => {
    onSave(settings)
    onClose()
  }

  const sections = [
    { id: "general", label: "General", icon: "⚙️" },
    { id: "appearance", label: "Appearance", icon: "🎨" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
  ] as const

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[900px] max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <h2 className="text-xl font-semibold">Settings</h2>
          <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1.5 rounded">
            <X className="w-5 h-5 text-[#6b6b6b]" />
          </button>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-[#2a2a2a] overflow-auto">
            <nav className="p-3">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-2.5 rounded text-sm transition-colors",
                    activeSection === section.id ? "bg-info text-info-foreground" : "text-[#d0d0d0] hover:bg-[#2a2a2a]",
                  )}
                >
                  <span>{section.icon}</span>
                  <span className="flex-1 text-left">{section.label}</span>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-6">
            {activeSection === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">General Settings</h3>
                  <p className="text-sm text-[#9a9a9a] mb-6">Customize your calendar preferences</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default View</label>
                    <select
                      value={settings.defaultView}
                      onChange={(e) => setSettings({ ...settings, defaultView: e.target.value as any })}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="month">Month</option>
                      <option value="week">Week</option>
                      <option value="day">Day</option>
                      <option value="agenda">Agenda</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Week Starts On</label>
                    <select
                      value={settings.weekStartsOn}
                      onChange={(e) => setSettings({ ...settings, weekStartsOn: e.target.value as any })}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="sunday">Sunday</option>
                      <option value="monday">Monday</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Time Format</label>
                    <select
                      value={settings.timeFormat}
                      onChange={(e) => setSettings({ ...settings, timeFormat: e.target.value as any })}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="12h">12-hour (2:00 PM)</option>
                      <option value="24h">24-hour (14:00)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Date Format</label>
                    <select
                      value={settings.dateFormat}
                      onChange={(e) => setSettings({ ...settings, dateFormat: e.target.value as any })}
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/31/2025)</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY (31/12/2025)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2025-12-31)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "appearance" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Appearance</h3>
                  <p className="text-sm text-[#9a9a9a] mb-6">Customize how your calendar looks</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Theme</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["light", "dark", "system"].map((theme) => (
                        <button
                          key={theme}
                          onClick={() => setSettings({ ...settings, theme: theme as any })}
                          className={cn(
                            "flex flex-col items-center gap-2 p-4 rounded border-2 transition-colors",
                            settings.theme === theme
                              ? "border-info bg-info/20"
                              : "border-[#3a3a3a] hover:border-[#4a4a4a]",
                          )}
                        >
                          <div className="w-12 h-12 rounded flex items-center justify-center text-2xl">
                            {theme === "light" && "☀️"}
                            {theme === "dark" && "🌙"}
                            {theme === "system" && "💻"}
                          </div>
                          <span className="text-sm capitalize">{theme}</span>
                          {settings.theme === theme && (
                            <div className="w-5 h-5 rounded-full bg-info flex items-center justify-center">
                              <Check className="w-3 h-3" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Show Week Numbers</div>
                      <div className="text-xs text-[#9a9a9a]">Display week numbers in the calendar</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showWeekNumbers: !settings.showWeekNumbers })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.showWeekNumbers ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.showWeekNumbers ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Show Declined Events</div>
                      <div className="text-xs text-[#9a9a9a]">Display events you've declined</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showDeclinedEvents: !settings.showDeclinedEvents })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.showDeclinedEvents ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.showDeclinedEvents ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Compact Mode</div>
                      <div className="text-xs text-[#9a9a9a]">Use a more condensed layout</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, compactMode: !settings.compactMode })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.compactMode ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.compactMode ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "calendar" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Calendar Settings</h3>
                  <p className="text-sm text-[#9a9a9a] mb-6">Configure calendar behavior and defaults</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Default Event Duration</label>
                    <select
                      value={settings.defaultEventDuration}
                      onChange={(e) =>
                        setSettings({ ...settings, defaultEventDuration: Number.parseInt(e.target.value) })
                      }
                      className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded px-3 py-2 text-sm outline-none focus:border-blue-500"
                    >
                      <option value="15">15 minutes</option>
                      <option value="30">30 minutes</option>
                      <option value="60">1 hour</option>
                      <option value="90">1.5 hours</option>
                      <option value="120">2 hours</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Default Reminders</label>
                    <div className="space-y-2">
                      {["15 min before", "30 min before", "1 hour before", "1 day before"].map((reminder) => (
                        <label key={reminder} className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={settings.defaultReminders.includes(reminder)}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSettings({
                                  ...settings,
                                  defaultReminders: [...settings.defaultReminders, reminder],
                                })
                              } else {
                                setSettings({
                                  ...settings,
                                  defaultReminders: settings.defaultReminders.filter((r) => r !== reminder),
                                })
                              }
                            }}
                            className="w-4 h-4 rounded border-[#4a4a4a] bg-[#2a2a2a]"
                          />
                          <span className="text-sm">{reminder}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Show Weather Forecast</div>
                      <div className="text-xs text-[#9a9a9a]">Display weather in calendar view</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showWeatherForecast: !settings.showWeatherForecast })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.showWeatherForecast ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.showWeatherForecast ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Enable Drag and Drop</div>
                      <div className="text-xs text-[#9a9a9a]">Move events by dragging them</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, enableDragAndDrop: !settings.enableDragAndDrop })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.enableDragAndDrop ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.enableDragAndDrop ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeSection === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  <p className="text-sm text-[#9a9a9a] mb-6">Manage how you receive notifications</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium">Enable Notifications</div>
                      <div className="text-xs text-[#9a9a9a]">Receive notifications for events</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, enableNotifications: !settings.enableNotifications })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.enableNotifications ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.enableNotifications ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  {settings.enableNotifications && (
                    <>
                      <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                        <div>
                          <div className="text-sm font-medium">Desktop Notifications</div>
                          <div className="text-xs text-[#9a9a9a]">Show notifications on your desktop</div>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              enableDesktopNotifications: !settings.enableDesktopNotifications,
                            })
                          }
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            settings.enableDesktopNotifications ? "bg-info" : "bg-[#3a3a3a]",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                              settings.enableDesktopNotifications ? "left-5" : "left-0.5",
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                        <div>
                          <div className="text-sm font-medium">Email Notifications</div>
                          <div className="text-xs text-[#9a9a9a]">Receive notifications via email</div>
                        </div>
                        <button
                          onClick={() =>
                            setSettings({
                              ...settings,
                              enableEmailNotifications: !settings.enableEmailNotifications,
                            })
                          }
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            settings.enableEmailNotifications ? "bg-info" : "bg-[#3a3a3a]",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                              settings.enableEmailNotifications ? "left-5" : "left-0.5",
                            )}
                          />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                        <div>
                          <div className="text-sm font-medium">Notification Sound</div>
                          <div className="text-xs text-[#9a9a9a]">Play sound for notifications</div>
                        </div>
                        <button
                          onClick={() => setSettings({ ...settings, notificationSound: !settings.notificationSound })}
                          className={cn(
                            "relative w-11 h-6 rounded-full transition-colors",
                            settings.notificationSound ? "bg-info" : "bg-[#3a3a3a]",
                          )}
                        >
                          <div
                            className={cn(
                              "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                              settings.notificationSound ? "left-5" : "left-0.5",
                            )}
                          />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {activeSection === "privacy" && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Privacy Settings</h3>
                  <p className="text-sm text-[#9a9a9a] mb-6">Control what information is visible</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <div className="text-sm font-medium">Show Event Location</div>
                      <div className="text-xs text-[#9a9a9a]">Display location in shared events</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showEventLocation: !settings.showEventLocation })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.showEventLocation ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.showEventLocation ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Show Event Description</div>
                      <div className="text-xs text-[#9a9a9a]">Display description in shared events</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, showEventDescription: !settings.showEventDescription })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.showEventDescription ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.showEventDescription ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between py-3 border-t border-[#2a2a2a]">
                    <div>
                      <div className="text-sm font-medium">Allow Guest List</div>
                      <div className="text-xs text-[#9a9a9a]">Show guest list in shared events</div>
                    </div>
                    <button
                      onClick={() => setSettings({ ...settings, allowGuestList: !settings.allowGuestList })}
                      className={cn(
                        "relative w-11 h-6 rounded-full transition-colors",
                        settings.allowGuestList ? "bg-info" : "bg-[#3a3a3a]",
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 w-5 h-5 rounded-full bg-white transition-transform",
                          settings.allowGuestList ? "left-5" : "left-0.5",
                        )}
                      />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-[#2a2a2a]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm bg-[#2a2a2a] hover:bg-[#3a3a3a] rounded transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm bg-info hover:bg-info/90 text-info-foreground rounded transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
