'use client'

import type React from 'react'

import { useState } from 'react'
import { Upload, X, Paperclip } from 'lucide-react'
import { cn } from '@/lib/utils'

interface FileDropZoneProps {
  onFilesAdded: (files: File[]) => void
  existingFiles?: Array<{ name: string; size: number; url?: string }>
  onRemoveFile?: (index: number) => void
  maxFiles?: number
  acceptedTypes?: string[]
}

export function FileDropZone({
  onFilesAdded,
  existingFiles = [],
  onRemoveFile,
  maxFiles = 5,
  acceptedTypes = ['image/*', 'application/pdf', '.doc', '.docx', '.txt'],
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    if (files.length + existingFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }
    onFilesAdded(files)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : []
    if (files.length + existingFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`)
      return
    }
    onFilesAdded(files)
  }

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          'rounded-lg border-2 border-dashed p-6 text-center transition-colors',
          isDragOver ? 'border-info bg-info/10' : 'border-border hover:border-muted-foreground'
        )}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="text-muted-foreground h-8 w-8" />
          <div className="text-foreground text-sm">
            <label className="text-info hover:text-info/80 cursor-pointer">
              Choose files
              <input
                type="file"
                multiple
                accept={acceptedTypes.join(',')}
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>
            {' or drag and drop'}
          </div>
          <div className="text-muted-foreground text-xs">
            Up to {maxFiles} files (images, PDFs, documents)
          </div>
        </div>
      </div>

      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <div className="text-muted-foreground text-xs">Attachments ({existingFiles.length})</div>
          {existingFiles.map((file, index) => (
            <div
              key={index}
              className="bg-surface border-border flex items-center gap-2 rounded-lg border p-2"
            >
              <Paperclip className="text-muted-foreground h-4 w-4" />
              <div className="min-w-0 flex-1">
                <div className="text-foreground truncate text-sm">{file.name}</div>
                <div className="text-muted-foreground text-xs">{formatFileSize(file.size)}</div>
              </div>
              {onRemoveFile && (
                <button
                  onClick={() => onRemoveFile(index)}
                  className="text-muted-foreground hover:text-destructive p-1"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
