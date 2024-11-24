import { expect,test } from '@playwright/test'

test('main page desktop navbar view', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/')
  await expect(page.getByText('Sign In').nth(0)).toBeHidden()
  await expect(page.getByText('Sign In').nth(1)).toBeVisible()
  await expect(page.getByText('Sign Up').nth(0)).toBeHidden()
  await expect(page.getByText('Sign Up').nth(1)).toBeVisible()
  await expect(page.getByText('Booking system for business')).toBeVisible()
})

test('main page mobile navbar view', async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 900 })
  await page.goto('/')
  await expect(page.getByText('Sign In').nth([0,1])).toBeHidden()
  await expect(page.getByText('Sign Up').nth([0,1])).toBeHidden()
  await expect(page.getByText('Booking system for business')).toBeVisible()
})