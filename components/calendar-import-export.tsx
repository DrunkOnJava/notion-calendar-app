'use client'

import type React from 'react'

import { useState } from 'react'
import { X, Upload, Download, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CalendarImportExportProps {
  isOpen: boolean
  onClose: () => void
  onImport: (file: File) => void
  onExport: (calendarId: string, format: 'ics' | 'csv') => void
  calendars: Array<{ id: string; name: string }>
}

export function CalendarImportExport({
  isOpen,
  onClose,
  onImport,
  onExport,
  calendars,
}: CalendarImportExportProps) {
  const [mode, setMode] = useState<'import' | 'export'>('import')
  const [selectedCalendar, setSelectedCalendar] = useState(calendars[0]?.id || '')
  const [exportFormat, setExportFormat] = useState<'ics' | 'csv'>('ics')
  const [dragActive, setDragActive] = useState(false)

  if (!isOpen) return null

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0]
      if (file.name.endsWith('.ics') || file.name.endsWith('.csv')) {
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[500px] overflow-hidden rounded-lg bg-[#1c1c1c]">
        <div className="border-b border-[#2a2a2a] p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold">Import/Export Calendar</h2>
            <button onClick={onClose} className="rounded p-1 hover:bg-[#2a2a2a]">
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setMode('import')}
              className={cn(
                'flex-1 rounded px-4 py-2 text-sm font-medium',
                mode === 'import'
                  ? 'bg-info text-info-foreground'
                  : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
              )}
            >
              Import
            </button>
            <button
              onClick={() => setMode('export')}
              className={cn(
                'flex-1 rounded px-4 py-2 text-sm font-medium',
                mode === 'export'
                  ? 'bg-info text-info-foreground'
                  : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
              )}
            >
              Export
            </button>
          </div>
        </div>

        <div className="p-6">
          {mode === 'import' ? (
            <div className="space-y-4">
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  'rounded-lg border-2 border-dashed p-8 text-center transition-colors',
                  dragActive ? 'border-info bg-info/10' : 'border-[#3a3a3a]'
                )}
              >
                <Upload className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
                <p className="mb-2 text-sm">Drag and drop your .ics file here</p>
                <p className="text-muted-foreground mb-4 text-xs">or</p>
                <label className="bg-info hover:bg-info/90 text-info-foreground inline-block cursor-pointer rounded px-4 py-2 text-sm font-medium">
                  Choose File
                  <input
                    type="file"
                    accept=".ics,.csv"
                    onChange={handleFileInput}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="text-muted-foreground text-xs">
                <p className="mb-1">Supported formats:</p>
                <ul className="list-inside list-disc space-y-1">
                  <li>.ics (iCalendar format)</li>
                  <li>.csv (Comma-separated values)</li>
                </ul>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium">Select Calendar</label>
                <select
                  value={selectedCalendar}
                  onChange={(e) => setSelectedCalendar(e.target.value)}
                  className="focus:ring-info w-full rounded border-none bg-[#2a2a2a] px-3 py-2 text-sm focus:ring-2 focus:outline-none"
                >
                  {calendars.map((cal) => (
                    <option key={cal.id} value={cal.id}>
                      {cal.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">Export Format</label>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded bg-[#2a2a2a] p-3 hover:bg-[#3a3a3a]">
                    <input
                      type="radio"
                      name="format"
                      value="ics"
                      checked={exportFormat === 'ics'}
                      onChange={() => setExportFormat('ics')}
                      className="h-4 w-4"
                    />
                    <FileText className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">.ics (iCalendar)</div>
                      <div className="text-muted-foreground text-xs">
                        Standard format for most calendar apps
                      </div>
                    </div>
                  </label>

                  <label className="flex cursor-pointer items-center gap-3 rounded bg-[#2a2a2a] p-3 hover:bg-[#3a3a3a]">
                    <input
                      type="radio"
                      name="format"
                      value="csv"
                      checked={exportFormat === 'csv'}
                      onChange={() => setExportFormat('csv')}
                      className="h-4 w-4"
                    />
                    <FileText className="h-5 w-5" />
                    <div>
                      <div className="text-sm font-medium">.csv (Spreadsheet)</div>
                      <div className="text-muted-foreground text-xs">
                        For use in Excel, Sheets, etc.
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              <button
                onClick={handleExport}
                className="bg-info hover:bg-info/90 text-info-foreground flex w-full items-center justify-center gap-2 rounded px-4 py-2 text-sm font-medium"
              >
                <Download className="h-4 w-4" />
                Export Calendar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
