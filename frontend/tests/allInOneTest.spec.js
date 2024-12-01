/* eslint-disable no-undef */
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
  await page.waitForTimeout(300)
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

test('user can change own booking', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill('test@user.com')
  await page.getByPlaceholder('Password').fill('12345678')
  await page.getByRole('button', { name: 'Sign In' }).click()
  await page.waitForTimeout(200)
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
  await page.getByRole('button', { name: '1:00 PM – 1:30 PM My event "' }).click();
  await page.getByLabel('End Time:').fill('14:30')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expectNotification(page, 'Booking updated successfully!')
})

test('admin can change booking of user', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.waitForTimeout(100)
  await page.goto('/bookings')
  await expect(page.getByText('Meeting room', { exact: true })).toBeVisible()
  if (await page.getByText('Saturday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  if (await page.getByText('Sunday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  await page.getByRole('button', { name: '1:00 PM – 2:30 PM Meeting' }).click()
  await page.getByLabel('End Time:').fill('13:30')
  await page.getByRole('button', { name: 'Submit' }).click()
  await expectNotification(page, 'Booking updated successfully!')
})

test('admin can delete booking of user', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.waitForTimeout(100)
  await page.goto('/bookings')
  await expect(page.getByText('Meeting room', { exact: true })).toBeVisible()
  if (await page.getByText('Saturday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  if (await page.getByText('Sunday').isVisible()) {
    await page.getByRole('button', { name: 'Next' }).click()
  }
  await page.getByRole('button', { name: '1:00 PM – 1:30 PM Meeting' }).click()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Delete' }).click()
  await expectNotification(page, 'Booking deleted successfully')
})

test('admin can delete user', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
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

test('admin can create a message', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.goto('/notifications')
  await page.getByRole('heading', { name: 'Add new message' }).click();
  await page.getByRole('button', { name: 'Submit' }).click();
  await expectNotification(page, 'Message created')
})

test('admin can edit the message', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.goto('/notifications')
  await page.getByRole('link', { name: 'Message 1' }).click();
  await page.getByRole('heading', { name: 'Current message' }).isVisible()
  await page.getByRole('button', { name: 'Edit' }).click()
  await page.getByRole('textbox').click()
  await page.getByRole('textbox').fill('New message')
  await page.getByRole('button', { name: 'Save' }).click()
  await expectNotification(page, 'Message updated')
})

test('admin can delete the message', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 720 })
  await page.goto('/signin')
  await page.getByPlaceholder('Email').fill(process.env.ADMIN_USERNAME)
  await page.getByPlaceholder('Password').fill(process.env.ADMIN_PASSWORD)
  await page.getByRole('button', { name: 'Sign In' }).click()
  await expectNotification(page, 'You have successfully signed in to Roomies App as admin')
  await page.goto('/notifications')
  await page.getByRole('link', { name: 'New message' }).click();
  await page.getByRole('heading', { name: 'Current message' }).isVisible()
  page.on('dialog', dialog => dialog.accept())
  await page.getByRole('button', { name: 'Delete' }).click()
  await expectNotification(page, 'Message deleted')
})