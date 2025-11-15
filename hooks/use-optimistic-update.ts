import { useState, useCallback } from 'react'

interface OptimisticUpdateOptions<T> {
  /**
   * Function that performs the actual update
   */
  mutate: (data: T) => Promise<T>

  /**
   * Function called on successful update
   */
  onSuccess?: (data: T) => void

  /**
   * Function called on error (for rollback)
   */
  onError?: (error: Error, rollbackData: T) => void

  /**
   * Optional delay before showing loading state (prevents flash)
   */
  loadingDelay?: number
}

/**
 * Hook for optimistic UI updates
 * Updates UI immediately while request is in flight, rolls back on error
 */
export function useOptimisticUpdate<T>(options: OptimisticUpdateOptions<T>) {
  const { mutate, onSuccess, onError, loadingDelay = 300 } = options

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const execute = useCallback(
    async (optimisticData: T, actualData: T) => {
      setError(null)

      // Delay showing loading state to prevent flash
      const loadingTimeout = setTimeout(() => {
        setIsLoading(true)
      }, loadingDelay)

      try {
        // Perform the actual mutation
        const result = await mutate(actualData)

        clearTimeout(loadingTimeout)
        setIsLoading(false)

        // Call success callback
        onSuccess?.(result)

        return result
      } catch (err) {
        clearTimeout(loadingTimeout)
        setIsLoading(false)

        const error = err instanceof Error ? err : new Error('Update failed')
        setError(error)

        // Rollback by calling error callback with optimistic data
        onError?.(error, optimisticData)

        throw error
      }
    },
    [mutate, onSuccess, onError, loadingDelay]
  )

  return {
    execute,
    isLoading,
    error,
  }
}

/**
 * Example usage for event creation:
 *
 * const createEvent = useOptimisticUpdate({
 *   mutate: async (event) => {
 *     return await api.createEvent(event)
 *   },
 *   onSuccess: (newEvent) => {
 *     announce('Event created successfully')
 *   },
 *   onError: (error, originalEvents) => {
 *     setEvents(originalEvents) // Rollback
 *     announce('Failed to create event')
 *   }
 * })
 *
 * // In your component:
 * const handleCreate = async (newEvent) => {
 *   // Optimistically add to UI
 *   setEvents([...events, newEvent])
 *
 *   // Perform actual update
 *   await createEvent.execute(events, newEvent)
 * }
 */

/**
 * Simpler version for common CRUD operations
 */
export function useOptimisticCrud<T extends { id: string }>(
  items: T[],
  setItems: (items: T[]) => void
) {
  // Create
  const optimisticCreate = async (newItem: T, mutate: (item: T) => Promise<T>) => {
    const previousItems = items
    setItems([...items, newItem])

    try {
      const result = await mutate(newItem)
      setItems([...items.slice(0, -1), result]) // Replace temp with real
      return result
    } catch (error) {
      setItems(previousItems) // Rollback
      throw error
    }
  }

  // Update
  const optimisticUpdate = async (
    updatedItem: T,
    mutate: (item: T) => Promise<T>
  ) => {
    const previousItems = items
    setItems(items.map((item) => (item.id === updatedItem.id ? updatedItem : item)))

    try {
      const result = await mutate(updatedItem)
      setItems(items.map((item) => (item.id === result.id ? result : item)))
      return result
    } catch (error) {
      setItems(previousItems) // Rollback
      throw error
    }
  }

  // Delete
  const optimisticDelete = async (id: string, mutate: (id: string) => Promise<void>) => {
    const previousItems = items
    setItems(items.filter((item) => item.id !== id))

    try {
      await mutate(id)
    } catch (error) {
      setItems(previousItems) // Rollback
      throw error
    }
  }

  return {
    optimisticCreate,
    optimisticUpdate,
    optimisticDelete,
  }
}
