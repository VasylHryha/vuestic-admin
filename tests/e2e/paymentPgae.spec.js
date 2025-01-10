// e2e/tests/payment-page.spec.js
import { test, expect } from '@playwright/test'

test.describe('Payment Page Tests', () => {
  test('Verify specific cards are displayed on page load', async ({ page }) => {
    // Navigate to the payment page
    await page.goto('/payments/payment-methods') // Replace with your actual page URL
    await page.waitForLoadState('networkidle') // Wait until network requests are idle

    // Validate the section heading
    const sectionHeading = await page.locator('text=My cards')
    await expect(sectionHeading).toBeVisible()

    // Check if the card with ending '4242' is displayed
    const card4242 = await page.locator('text=visa **** 4242')
    await expect(card4242).toBeVisible()

    // Check if the card with ending '4444' is displayed
    const card4444 = await page.locator('text=mastercard **** 4444')
    await expect(card4444).toBeVisible()

    // Check if the card with ending '0341' is displayed
    const card0341 = await page.locator('text=visa **** 0341')
    await expect(card0341).toBeVisible()

    // Optional: Log a success message if all cards are validated
    console.log('All specified cards are displayed correctly.')
  })

  test('Add a Stripe test card and remove it', async ({ page }) => {
    // Navigate to the payment page
    await page.goto('/payments/payment-methods')
    await page.waitForLoadState('networkidle')

    // Click the "Add card" button
    const addCardButton = await page.getByTestId('add-card')
    await addCardButton.click()

    // Verify the modal opens
    const modalHeading = await page.locator('text=Add payment card')
    await expect(modalHeading).toBeVisible()

    // Fill in the cardholder name
    const cardholderNameInput = page.getByTestId('cardholder-name').locator('input')
    await cardholderNameInput.fill('Test User')

    // Access the Stripe iframe and fill in card details
    const stripeFrame = page.frameLocator('iframe[title="Secure card payment input frame"]')
    const cardNumberInput = stripeFrame.locator('input[name="cardnumber"]')
    const expiryInput = stripeFrame.locator('input[name="exp-date"]')
    const cvcInput = stripeFrame.locator('input[name="cvc"]')

    await cardNumberInput.fill('4000056655665556') // Stripe test card number
    await expiryInput.fill('12/34') // Expiry date
    await cvcInput.fill('123') // CVC code

    // Save the card
    const saveButton = await page.getByTestId('save-card')
    await saveButton.click()

    // Find the card by text and locate its parent with [data-testid="card-row"]
    const cardRow = page.locator('[data-testid="card-row"]:has-text("visa **** 5556")')
    await cardRow.waitFor({ state: 'visible', timeout: 10000 })

    // Click the "Remove" button within the cardRow
    const removeButton = cardRow.locator('[data-testid="remove-card"]')
    await removeButton.click()

    // Wait for the confirmation modal to appear
    const confirmationModal = page.locator('text=Are you really sure you want to delete this card?')
    await expect(confirmationModal).toBeVisible()

    // Click the "OK" button to confirm deletion
    const okButton = page.locator('button:has-text("OK")')
    await okButton.click()

    // Verify the card is removed from the list
    await expect(cardRow).not.toBeVisible()

    // Log success
    console.log('Add and remove card functionality with confirmation works as expected.')
  })
})
