import { expect,test } from '@playwright/test'

const expectNotification = async (page, message) => {
  await expect(page.getByText(message)).toBeVisible()
}

test('signup form works', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signup')
  await expect(page.getByText('Name', { exact: true })).toBeVisible()
  await expect(page.getByText('Username', { exact: true })).toBeVisible()
  await expect(page.getByText('Password', { exact: true })).toBeVisible()
  await expect(page.getByText('Confirm password', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign Up' })).toBeVisible()
  await page.getByPlaceholder('Name').fill('test user')
  await page.getByPlaceholder('Email').fill('test@user.com')
  await page.getByPlaceholder('Password', { exact: true }).fill('12345678')
  await page.getByPlaceholder('Confirm password').fill('12345678')
  await page.getByRole('button', { name: 'Sign Up' }).click()
  await expectNotification(page, 'You are successfully signed up. Use your email and password to sign in to Roomies App.')
})

test('signin form works', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await expect(page.getByText('Username', { exact: true })).toBeVisible()
  await expect(page.getByText('Password', { exact: true })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Sign In' })).toBeVisible()
  await page.getByPlaceholder('Email').fill('test@user.com')
  await page.getByPlaceholder('Password').fill('12345678')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as test user')
})

test('user can book room', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill('test@user.com')
  await page.getByPlaceholder('Password').fill('12345678')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForTimeout(100)
  await page.goto('/bookings')
  await expect(page.getByText('Meeting room', { exact: true })).toBeVisible()
  await expect(page.getByText('Conference room', { exact: true })).toBeVisible()
  await expect(page.getByText('Concert hall', { exact: true })).toBeVisible()
  if (await page.getByText('Saturday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  if (await page.getByText('Sunday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  await page.locator('.rbc-events-container').first().click()
  await page.getByRole('button', { name: 'Submit' }).click()
  await expectNotification(page, 'Booking created successfully!')
})


test('admin can delete user', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill('admin@admin.com')
  await page.getByPlaceholder('Password').fill('gfghlur4754675')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.goto('/users')
  await page.getByRole('cell', { name: 'test@user.com' }).click()
  await page.getByRole('cell', { name: 'test user' }).toBeVisible
  await page.getByRole('button', { name: 'Delete' }).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Delete' }).click()
  await expectNotification(page, 'User deleted')
})

