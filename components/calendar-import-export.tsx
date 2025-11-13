"use client"

import type React from "react"

import { useState } from "react"
import { X, Upload, Download, FileText } from "lucide-react"
import { cn } from "@/lib/utils"

interface CalendarImportExportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  onExport: (calendarId: string, format: "ics" | "csv") => void
  calendars: Array<{ id: string; name: string }>
}

export function CalendarImportExport({ isOpen, onClose, onImport, onExport, calendars }: CalendarImportExportProps) {
  const [mode, setMode] = useState<"import" | "export">("import")
  const [selectedCalendar, setSelectedCalendar] = useState(calendars[0]?.id || "")
  const [exportFormat, setExportFormat] = useState<"ics" | "csv">("ics")
  const [dragActive, setDragActive] = useState(false)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith(".ics") || file.name.endsWith(".csv")) {
        onImport(file)
        onClose()
      }
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      onImport(e.target.files[0])
      onClose()
    }
  }

  const handleExport = () => {
    onExport(selectedCalendar, exportFormat)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-[#1c1c1c] rounded-lg w-[500px] overflow-hidden">
        <div className="p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Import/Export Calendar</h2>
            <button onClick={onClose} className="hover:bg-[#2a2a2a] p-1 rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode("import")}
              className={cn(
                "flex-1 py-2 px-4 rounded text-sm font-medium",
                mode === "import" ? "bg-info text-info-foreground" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]",
              )}
            >
              Import
            </button>
            <button
              onClick={() => setMode("export")}
              className={cn(
                "flex-1 py-2 px-4 rounded text-sm font-medium",
                mode === "export" ? "bg-info text-info-foreground" : "bg-[#2a2a2a] hover:bg-[#3a3a3a]",
              )}
            >
              Export
            </button>
          </div>
        </div>

        <div className="p-6">
          {mode === "import" ? (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center transition-colors",
                  dragActive ? "border-info bg-info/10" : "border-[#3a3a3a]",
                )}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-sm mb-2">Drag and drop your .ics file here</p>
                <p className="text-xs text-muted-foreground mb-4">or</p>
                <label className="inline-block bg-info hover:bg-info/90 text-info-foreground py-2 px-4 rounded text-sm font-medium cursor-pointer">
                  Choose File
                  <input type="file" accept=".ics,.csv" onChange={handleFileInput} className="hidden" />
                </label>
              </div>

              <div className="text-xs text-muted-foreground">
                <p className="mb-1">Supported formats:</p>
                <ul className="list-disc list-inside space-y-1">
                  <li>.ics (iCalendar format)</li>
                  <li>.csv (Comma-separated values)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Select Calendar</label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="w-full bg-[#2a2a2a] text-sm px-3 py-2 rounded border-none focus:outline-none focus:ring-2 focus:ring-info"
                >
                  {calendars.map((cal) => (
                    <option key={cal.id} value={cal.id}>
                      {cal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Export Format</label>
                <div className="space-y-2">
                  <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a] cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="ics"
                      checked={exportFormat === "ics"}
                      onChange={() => setExportFormat("ics")}
                      className="w-4 h-4"
                    />
                    <FileText className="w-5 h-5" />
                    <div>
                      <div className="text-sm font-medium">.ics (iCalendar)</div>
                      <div className="text-xs text-muted-foreground">Standard format for most calendar apps</div>
                    </div>
                  </label>

                  <label className="flex items-center gap-3 p-3 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a] cursor-pointer">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === "csv"}
                      onChange={() => setExportFormat("csv")}
                      className="w-4 h-4"
                    />
                    <FileText className="w-5 h-5" />
                    <div>
                      <div className="text-sm font-medium">.csv (Spreadsheet)</div>
                      <div className="text-xs text-muted-foreground">For use in Excel, Sheets, etc.</div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="w-full flex items-center justify-center gap-2 bg-info hover:bg-info/90 text-info-foreground py-2 px-4 rounded text-sm font-medium"
              >
                <Download className="w-4 h-4" />
                Export Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
