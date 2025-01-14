import { test } from '@chromatic-com/playwright'

const routes = [
  '/dashboard',
  '/settings',
  '/preferences',
  '/users',
  '/projects',
  '/payments/payment-methods',
  '/payments/billing',
  '/payments/pricing-plans',
  '/faq',
  '/auth/login',
  '/auth/signup',
  '/auth/recover-password',
  '/auth/recover-password-email',
  '/404',
]

test.describe('Visual Tests for All Routes', () => {
  routes.forEach((route) => {
    test(`Visual test for ${route}`, async ({ page}) => {
      await page.goto(route) // Automatically prepends the baseURL
      await page.waitForLoadState('networkidle') // Ensure the page is fully loaded
      await page.waitForTimeout(500) // Optional delay for animations or dynamic content
      await page.screenshot()
    })
  })
})
