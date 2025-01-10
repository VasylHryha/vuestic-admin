const { defineConfig } = require('@playwright/test')
require('dotenv').config() // Load .env variables

module.exports = defineConfig({
  // Global settings
  testDir: './tests', // Base directory for all tests
  timeout: 30 * 1000, // Global test timeout (30 seconds)
  // retries: 2, // Retry tests on failures
  snapshotDir: './snapshots', // Shared snapshot directory for snapshots
  use: {
    headless: true, // Run in headless mode by default
    baseURL: `http://localhost:${process.env.TEST_PORT || 3000}`, // Default to 3000 if TEST_PORT is not set
    trace: 'on-first-retry', // Collect trace on first retry
  },

  // Project-specific configurations
  projects: [
    // E2E Tests
    {
      name: 'e2e',
      testDir: './tests/e2e', // Directory for E2E tests
    },

    // Visual Tests
    {
      name: 'visual',
      testDir: './tests/visual', // Directory for visual regression tests
    },

    // Browser-specific configurations for cross-browser testing
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
      },
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
      },
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
      },
    },
  ],
})
