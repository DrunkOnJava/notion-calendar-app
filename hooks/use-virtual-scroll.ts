import { useEffect, useRef, useState, useCallback } from 'react'

interface VirtualScrollOptions {
  itemHeight: number
  containerHeight: number
  overscan?: number
}

/**
 * Virtual scrolling hook for rendering large lists efficiently
 * Only renders visible items + overscan buffer
 */
export function useVirtualScroll<T>(items: T[], options: VirtualScrollOptions) {
  const { itemHeight, containerHeight, overscan = 3 } = options

  const [scrollTop, setScrollTop] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const totalHeight = items.length * itemHeight
  const visibleCount = Math.ceil(containerHeight / itemHeight)
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan)
  const endIndex = Math.min(
    items.length - 1,
    Math.floor((scrollTop + containerHeight) / itemHeight) + overscan
  )

  const visibleItems = items.slice(startIndex, endIndex + 1)
  const offsetY = startIndex * itemHeight

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    visibleItems,
    totalHeight,
    offsetY,
    startIndex,
    endIndex,
  }
}

/**
 * Virtual grid for calendar views
 * Handles both rows and columns efficiently
 */
export function useVirtualGrid<T>(
  items: T[],
  options: {
    rowHeight: number
    columnWidth: number
    columns: number
    containerHeight: number
    containerWidth: number
    overscan?: number
  }
) {
  const { rowHeight, columnWidth, columns, containerHeight, containerWidth, overscan = 2 } = options

  const [scrollTop, setScrollTop] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const rows = Math.ceil(items.length / columns)
  const totalHeight = rows * rowHeight
  const totalWidth = columns * columnWidth

  const visibleRows = Math.ceil(containerHeight / rowHeight)
  const visibleColumns = Math.ceil(containerWidth / columnWidth)

  const startRow = Math.max(0, Math.floor(scrollTop / rowHeight) - overscan)
  const endRow = Math.min(
    rows - 1,
    Math.floor((scrollTop + containerHeight) / rowHeight) + overscan
  )

  const startCol = Math.max(0, Math.floor(scrollLeft / columnWidth) - overscan)
  const endCol = Math.min(
    columns - 1,
    Math.floor((scrollLeft + containerWidth) / columnWidth) + overscan
  )

  const visibleItems: Array<{ item: T; row: number; col: number; index: number }> = []

  for (let row = startRow; row <= endRow; row++) {
    for (let col = startCol; col <= endCol; col++) {
      const index = row * columns + col
      if (index < items.length) {
        visibleItems.push({
          item: items[index],
          row,
          col,
          index,
        })
      }
    }
  }

  const handleScroll = useCallback((e: Event) => {
    const target = e.target as HTMLDivElement
    setScrollTop(target.scrollTop)
    setScrollLeft(target.scrollLeft)
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    visibleItems,
    totalHeight,
    totalWidth,
    startRow,
    endRow,
    startCol,
    endCol,
  }
}

/**
 * Infinite scroll with automatic loading
 */
export function useInfiniteScroll(
  onLoadMore: () => void,
  options: {
    threshold?: number
    isLoading?: boolean
    hasMore?: boolean
  } = {}
) {
  const { threshold = 200, isLoading = false, hasMore = true } = options
  const containerRef = useRef<HTMLDivElement>(null)
  const [isFetching, setIsFetching] = useState(false)

  const handleScroll = useCallback(() => {
    const container = containerRef.current
    if (!container || isLoading || !hasMore || isFetching) return

    const { scrollTop, scrollHeight, clientHeight } = container
    const distanceFromBottom = scrollHeight - (scrollTop + clientHeight)

    if (distanceFromBottom < threshold) {
      setIsFetching(true)
      onLoadMore()
      // Reset after a short delay
      setTimeout(() => setIsFetching(false), 1000)
    }
  }, [onLoadMore, threshold, isLoading, hasMore, isFetching])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('scroll', handleScroll, { passive: true })
    return () => container.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return {
    containerRef,
    isFetching,
  }
}
