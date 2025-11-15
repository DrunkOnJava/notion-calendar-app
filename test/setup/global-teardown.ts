/**
 * Global test teardown for Playwright and other test frameworks
 * Cleans up test environment and stops containers after test execution
 */

import { getTestEnvironment } from '../utils/testcontainers'

async function globalTeardown() {
  console.log('🧹 Starting test environment teardown...')

  const useContainers = process.env.USE_TESTCONTAINERS === 'true'

  if (useContainers) {
    const env = getTestEnvironment()

    try {
      console.log('🛑 Stopping Testcontainers...')
      await env.cleanup()
      console.log('✅ All containers stopped successfully')
    } catch (error) {
      console.error('❌ Failed to cleanup test environment:', error)
      // Don't throw - we want teardown to complete even if cleanup fails
    }
  } else {
    console.log('📝 Docker Compose environment - no automatic cleanup')
    console.log('💡 Run: pnpm test:env:down to stop Docker Compose services')
  }

  console.log('✅ Test environment teardown completed')
}

export default globalTeardown
