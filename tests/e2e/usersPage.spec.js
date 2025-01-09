import { test, expect } from '@playwright/test'

const MOCKED_USER_DATA = {
  fullName: 'John Tester',
  username: 'johntester',
  email: 'johntester@example.com',
  active: true,
}

test.describe('Users Page Tests', () => {
  test('Switch between active and inactive users and count results', async ({ page }) => {
    // Navigate to the users page
    await page.goto('/users')
    await page.waitForLoadState('networkidle') // Ensure the page is fully loaded

    // Ensure the page loads by checking for a specific element
    const pageTitle = await page.getByRole('heading', { name: 'Users' }).textContent()
    expect(pageTitle).toBe('Users')

    // Wait for the results table to load
    await page.waitForSelector('.va-data-table__table-tbody')

    // Count the number of rows in the active users table
    const activeRows = await page.locator('.va-data-table__table-tbody .va-data-table__table-tr').count()
    console.log(`Active users count: ${activeRows}`)
    expect(activeRows).toBeGreaterThan(0) // At least one record expected

    // Switch to the "Inactive" tab
    const inactiveButton = await page.getByRole('button', { name: 'Inactive' })
    await inactiveButton.click()
    await page.waitForTimeout(5000) // Static wait due to mocked data

    // Wait for the results table to load
    await page.waitForSelector('.va-data-table__table-tbody')

    // Verify the results table for inactive users
    const inactiveRows = await page.locator('.va-data-table__table-tbody .va-data-table__table-tr').count()
    console.log(`Inactive users count: ${inactiveRows}`)
    expect(inactiveRows).toBeGreaterThan(0) // At least one record expected
  })

  test('Add a new user with multiselect through the modal form', async ({ page }) => {
    // Navigate to the users page
    await page.goto('/users')
    await page.waitForLoadState('networkidle') // Ensure the page is fully loaded

    // Open the "Add User" modal
    const addUserButton = page.getByTestId('add-user-button')
    await addUserButton.click()

    // Wait for the modal to appear
    const modal = page.locator('.va-modal__dialog')
    await expect(modal).toBeVisible()

    // Fill out the form fields
    await modal.getByTestId('fullname-input').locator('input').fill(MOCKED_USER_DATA.fullName)
    await modal.getByTestId('username-input').locator('input').fill(MOCKED_USER_DATA.username)
    await modal.getByTestId('email-input').locator('input').fill(MOCKED_USER_DATA.email)

    if (MOCKED_USER_DATA.active) {
      await modal.getByTestId('active-checkbox').locator('input').check()
    }

    // Verify and click the "Add" button
    const addButton = modal.getByTestId('save-button')
    await expect(addButton).toBeEnabled()
    await addButton.click()

    // Wait for the modal to close
    await expect(modal).toBeHidden()

    // Verify the new user appears in the table
    const newUserRow = page.locator('.va-data-table__table-tbody .va-data-table__table-tr', {
      hasText: MOCKED_USER_DATA.fullName,
    })
    await newUserRow.waitFor({ state: 'visible', timeout: 10000 })
  })
})
