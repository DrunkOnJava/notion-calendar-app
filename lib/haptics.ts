/**
 * Provides haptic feedback on supported devices
 * Uses the Vibration API for mobile/touch devices
 */

type HapticIntensity = 'light' | 'medium' | 'heavy'

const HAPTIC_PATTERNS: Record<HapticIntensity, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: [10, 20, 10],
}

/**
 * Triggers haptic feedback if the device supports it
 * @param intensity - The intensity of the haptic feedback
 */
export function hapticFeedback(intensity: HapticIntensity = 'light'): void {
  // Check if the Vibration API is available
  if (typeof window === 'undefined' || !('vibrate' in navigator)) {
    return
  }

  const pattern = HAPTIC_PATTERNS[intensity]

  try {
    navigator.vibrate(pattern)
  } catch (error) {
    // Silently fail if vibration is not supported or blocked
    console.debug('Haptic feedback not available:', error)
  }
}
