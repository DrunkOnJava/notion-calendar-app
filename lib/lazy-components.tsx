/**
 * Lazy-loaded components for code splitting and performance
 * Use these to reduce initial bundle size
 */

import dynamic from 'next/dynamic'
import { Spinner } from '@/components/ui/spinner'

/**
 * Lazy-loaded modals with loading fallback
 */
export const EventCreateModal = dynamic(
  () => import('@/components/event-create-modal').then((mod) => ({ default: mod.EventCreateModal })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
)

export const SettingsModal = dynamic(
  () => import('@/components/settings-modal').then((mod) => ({ default: mod.SettingsModal })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
)

export const EventDetailModal = dynamic(
  () => import('@/components/event-detail-modal').then((mod) => ({ default: mod.EventDetailModal })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
)

export const CalendarImportExport = dynamic(
  () => import('@/components/calendar-import-export').then((mod) => ({ default: mod.CalendarImportExport })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
)

export const FindTimeModal = dynamic(
  () => import('@/components/find-time-modal').then((mod) => ({ default: mod.FindTimeModal })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
    ssr: false,
  }
)

/**
 * Lazy-loaded heavy components
 */
export const DatabaseBoardView = dynamic(
  () => import('@/components/database-board-view').then((mod) => ({ default: mod.DatabaseBoardView })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
  }
)

export const AgendaView = dynamic(
  () => import('@/components/agenda-view').then((mod) => ({ default: mod.AgendaView })),
  {
    loading: () => (
      <div className="flex items-center justify-center p-8">
        <Spinner />
      </div>
    ),
  }
)

/**
 * Preload a component before it's needed
 */
export function preloadComponent(componentName: keyof typeof componentMap) {
  componentMap[componentName].preload()
}

const componentMap = {
  EventCreateModal,
  SettingsModal,
  EventDetailModal,
  CalendarImportExport,
  FindTimeModal,
  DatabaseBoardView,
  AgendaView,
}

/**
 * Preload multiple components
 */
export function preloadComponents(components: Array<keyof typeof componentMap>) {
  components.forEach((component) => {
    componentMap[component].preload()
  })
}
