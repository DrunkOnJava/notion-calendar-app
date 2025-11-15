"use client"

import { useState } from "react"
import { Check } from "lucide-react"
import type { DatabaseItem } from "@/types/calendar"

interface DatabaseTableViewProps {
  items: DatabaseItem[]
  onItemClick: (item: DatabaseItem) => void
}

export function DatabaseTableView({ items, onItemClick }: DatabaseTableViewProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())

  if (items.length === 0) {
    return <div className="p-8 text-center text-sm text-[#6b6b6b]">No items found</div>
  }

  const properties = Object.keys(items[0].properties || {})

  const toggleItem = (name: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(name)) {
      newSelected.delete(name)
    } else {
      newSelected.add(name)
    }
    setSelectedItems(newSelected)
  }

  return (
    <div className="overflow-auto">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-[#1c1c1c] border-b border-[#2a2a2a]">
          <tr>
            <th className="w-8 p-2">
              <input
                type="checkbox"
                className="w-4 h-4"
                checked={selectedItems.size === items.length}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedItems(new Set(items.map((i) => i.name)))
                  } else {
                    setSelectedItems(new Set())
                  }
                }}
              />
            </th>
            <th className="text-left p-2 text-[#9a9a9a] font-medium">Name</th>
            {properties.slice(0, 5).map((prop) => (
              <th key={prop} className="text-left p-2 text-[#9a9a9a] font-medium">
                {prop}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, idx) => (
            <tr
              key={idx}
              className="border-b border-[#2a2a2a] hover:bg-[#202020] cursor-pointer"
              onClick={() => onItemClick(item)}
            >
              <td className="p-2">
                <input
                  type="checkbox"
                  className="w-4 h-4"
                  checked={selectedItems.has(item.name)}
                  onChange={(e) => {
                    e.stopPropagation()
                    toggleItem(item.name)
                  }}
                />
              </td>
              <td className="p-2 font-medium text-[#d0d0d0]">{item.name}</td>
              {properties.slice(0, 5).map((prop) => {
                const value = item.properties[prop]
                return (
                  <td key={prop} className="p-2 text-[#9a9a9a]">
                    {typeof value === "boolean" ? (
                      value ? (
                        <div className="flex items-center justify-center w-5 h-5 bg-info rounded">
                          <Check className="w-3 h-3" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 border border-[#4a4a4a] rounded"></div>
                      )
                    ) : prop === "Certification Level" ? (
                      <span className="bg-success/50 text-success-foreground px-2 py-0.5 rounded text-xs">{value}</span>
                    ) : prop === "Shift" ? (
                      <span className="bg-badge-pink text-badge-pink-foreground px-2 py-0.5 rounded-full text-xs">
                        {value}
                      </span>
                    ) : value === null ? (
                      <span className="text-[#6b6b6b] italic text-xs">Empty</span>
                    ) : (
                      String(value)
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
