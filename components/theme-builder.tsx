'use client'

import { useState, useEffect } from 'react'
import { Palette, Download, Upload, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { hapticFeedback } from '@/lib/haptics'

interface ColorToken {
  name: string
  variable: string
  defaultValue: string
  description: string
}

const COLOR_TOKENS: ColorToken[] = [
  { name: 'Primary', variable: '--primary', defaultValue: 'oklch(0.205 0 0)', description: 'Primary brand color' },
  { name: 'Info', variable: '--info', defaultValue: 'oklch(0.6 0.18 240)', description: 'Info/accent color' },
  { name: 'Success', variable: '--success', defaultValue: 'oklch(0.6 0.18 145)', description: 'Success states' },
  { name: 'Warning', variable: '--warning', defaultValue: 'oklch(0.75 0.16 85)', description: 'Warning states' },
  { name: 'Destructive', variable: '--destructive', defaultValue: 'oklch(0.577 0.245 27.325)', description: 'Error/destructive actions' },
  { name: 'Background', variable: '--background', defaultValue: 'oklch(1 0 0)', description: 'Main background' },
  { name: 'Foreground', variable: '--foreground', defaultValue: 'oklch(0.145 0 0)', description: 'Main text color' },
]

const PRESET_THEMES = {
  default: {
    name: 'Default',
    colors: {
      '--primary': 'oklch(0.205 0 0)',
      '--info': 'oklch(0.6 0.18 240)',
      '--success': 'oklch(0.6 0.18 145)',
      '--warning': 'oklch(0.75 0.16 85)',
      '--destructive': 'oklch(0.577 0.245 27.325)',
    },
  },
  ocean: {
    name: 'Ocean',
    colors: {
      '--primary': 'oklch(0.45 0.18 230)',
      '--info': 'oklch(0.6 0.2 250)',
      '--success': 'oklch(0.6 0.18 170)',
      '--warning': 'oklch(0.75 0.16 70)',
      '--destructive': 'oklch(0.577 0.245 20)',
    },
  },
  sunset: {
    name: 'Sunset',
    colors: {
      '--primary': 'oklch(0.6 0.2 30)',
      '--info': 'oklch(0.6 0.18 320)',
      '--success': 'oklch(0.6 0.18 145)',
      '--warning': 'oklch(0.75 0.2 50)',
      '--destructive': 'oklch(0.6 0.25 25)',
    },
  },
  forest: {
    name: 'Forest',
    colors: {
      '--primary': 'oklch(0.45 0.15 150)',
      '--info': 'oklch(0.6 0.18 180)',
      '--success': 'oklch(0.6 0.2 140)',
      '--warning': 'oklch(0.7 0.18 90)',
      '--destructive': 'oklch(0.577 0.245 27)',
    },
  },
  lavender: {
    name: 'Lavender',
    colors: {
      '--primary': 'oklch(0.55 0.15 290)',
      '--info': 'oklch(0.6 0.18 280)',
      '--success': 'oklch(0.6 0.18 145)',
      '--warning': 'oklch(0.75 0.16 85)',
      '--destructive': 'oklch(0.6 0.25 340)',
    },
  },
}

export function ThemeBuilder() {
  const [customColors, setCustomColors] = useState<Record<string, string>>({})
  const [selectedPreset, setSelectedPreset] = useState<keyof typeof PRESET_THEMES>('default')

  // Load saved theme from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('custom-theme')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCustomColors(parsed)
        applyTheme(parsed)
      } catch (e) {
        console.error('Failed to load custom theme:', e)
      }
    }
  }, [])

  const applyTheme = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
  }

  const handleColorChange = (variable: string, value: string) => {
    const newColors = { ...customColors, [variable]: value }
    setCustomColors(newColors)
    applyTheme(newColors)

    // Save to localStorage
    localStorage.setItem('custom-theme', JSON.stringify(newColors))
  }

  const applyPreset = (preset: keyof typeof PRESET_THEMES) => {
    setSelectedPreset(preset)
    const colors = PRESET_THEMES[preset].colors
    setCustomColors(colors)
    applyTheme(colors)
    localStorage.setItem('custom-theme', JSON.stringify(colors))
    hapticFeedback('light')
  }

  const resetToDefault = () => {
    setCustomColors({})
    setSelectedPreset('default')

    // Remove all custom colors
    COLOR_TOKENS.forEach((token) => {
      document.documentElement.style.removeProperty(token.variable)
    })

    localStorage.removeItem('custom-theme')
    hapticFeedback('medium')
  }

  const exportTheme = () => {
    const themeData = {
      name: 'My Custom Theme',
      colors: customColors,
      createdAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(themeData, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'theme.json'
    a.click()
    URL.revokeObjectURL(url)
  }

  const importTheme = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const theme = JSON.parse(event.target?.result as string)
        if (theme.colors) {
          setCustomColors(theme.colors)
          applyTheme(theme.colors)
          localStorage.setItem('custom-theme', JSON.stringify(theme.colors))
          hapticFeedback('medium')
        }
      } catch (error) {
        console.error('Failed to import theme:', error)
      }
    }
    reader.readAsText(file)
  }

  return (
    <div className="space-y-6">
      {/* Preset Themes */}
      <div>
        <h3 className="mb-3 text-sm font-medium flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Preset Themes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.entries(PRESET_THEMES).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key as keyof typeof PRESET_THEMES)}
              className={cn(
                'rounded-lg border-2 p-3 text-left transition-all duration-200',
                'hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info',
                selectedPreset === key
                  ? 'border-info bg-info/10 shadow-sm'
                  : 'border-[#2a2a2a] hover:border-info/50'
              )}
            >
              <div className="font-medium text-sm">{preset.name}</div>
              <div className="mt-2 flex gap-1">
                {Object.values(preset.colors).slice(0, 5).map((color, i) => (
                  <div
                    key={i}
                    className="h-4 w-4 rounded-full border border-[#2a2a2a]"
                    style={{ background: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Custom Colors */}
      <div>
        <h3 className="mb-3 text-sm font-medium">Custom Colors (OKLCH)</h3>
        <div className="space-y-3">
          {COLOR_TOKENS.map((token) => (
            <div key={token.variable} className="space-y-1">
              <label className="flex items-center justify-between text-sm">
                <span>{token.name}</span>
                <span className="text-xs text-muted-foreground">{token.description}</span>
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={customColors[token.variable] || token.defaultValue}
                  onChange={(e) => handleColorChange(token.variable, e.target.value)}
                  placeholder={token.defaultValue}
                  className="flex-1 rounded border border-[#2a2a2a] bg-[#1c1c1c] px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
                />
                <div
                  className="h-10 w-10 shrink-0 rounded border border-[#2a2a2a]"
                  style={{
                    background: customColors[token.variable] || token.defaultValue,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-[#2a2a2a]">
        <button
          onClick={resetToDefault}
          className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm transition-all duration-150 hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
        >
          <RotateCcw className="h-4 w-4" />
          Reset to Default
        </button>

        <button
          onClick={exportTheme}
          className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm transition-all duration-150 hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-info"
        >
          <Download className="h-4 w-4" />
          Export Theme
        </button>

        <label className="flex items-center gap-2 rounded-lg border border-[#2a2a2a] px-4 py-2 text-sm transition-all duration-150 hover:bg-[#2a2a2a] cursor-pointer focus-within:ring-2 focus-within:ring-info">
          <Upload className="h-4 w-4" />
          Import Theme
          <input
            type="file"
            accept=".json"
            onChange={importTheme}
            className="sr-only"
          />
        </label>
      </div>

      {/* Live Preview */}
      <div className="rounded-lg border border-[#2a2a2a] bg-[#1c1c1c] p-4 space-y-3">
        <h4 className="text-sm font-medium">Live Preview</h4>
        <div className="flex flex-wrap gap-2">
          <button className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground transition-transform hover:scale-105">
            Primary
          </button>
          <button className="rounded bg-info px-3 py-1.5 text-sm text-info-foreground transition-transform hover:scale-105">
            Info
          </button>
          <button className="rounded bg-success px-3 py-1.5 text-sm text-success-foreground transition-transform hover:scale-105">
            Success
          </button>
          <button className="rounded bg-warning px-3 py-1.5 text-sm text-warning-foreground transition-transform hover:scale-105">
            Warning
          </button>
          <button className="rounded bg-destructive px-3 py-1.5 text-sm text-destructive-foreground transition-transform hover:scale-105">
            Destructive
          </button>
        </div>
      </div>
    </div>
  )
}

/**
 * Hook for custom theme management
 */
export function useCustomTheme() {
  const [currentTheme, setCurrentTheme] = useState<Record<string, string>>({})

  useEffect(() => {
    const saved = localStorage.getItem('custom-theme')
    if (saved) {
      try {
        const parsed = JSON.parse(saved)
        setCurrentTheme(parsed)
      } catch (e) {
        console.error('Failed to load theme:', e)
      }
    }
  }, [])

  const applyTheme = (colors: Record<string, string>) => {
    Object.entries(colors).forEach(([variable, value]) => {
      document.documentElement.style.setProperty(variable, value)
    })
    setCurrentTheme(colors)
    localStorage.setItem('custom-theme', JSON.stringify(colors))
  }

  const resetTheme = () => {
    COLOR_TOKENS.forEach((token) => {
      document.documentElement.style.removeProperty(token.variable)
    })
    setCurrentTheme({})
    localStorage.removeItem('custom-theme')
  }

  return {
    currentTheme,
    applyTheme,
    resetTheme,
  }
}
