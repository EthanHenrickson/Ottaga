import { expect, test } from '@playwright/test'
import { BasicMap } from './pageMap/BasicMap'

test("TOS", async ({ page }) => {
    const MainPage = new BasicMap(page)

    await MainPage.GoTo('/legal/tos')
    expect(page.getByRole('heading', { name: 'Terms of Service', exact: true })).toBeAttached()
})

test("Cookie", async ({ page }) => {
    const MainPage = new BasicMap(page)

    await MainPage.GoTo("/legal/cookie")
    expect(page.getByRole('heading', { name: 'Browser Storage Policy', exact: true })).toBeAttached()
})

test("Privacy", async ({ page }) => {
    const MainPage = new BasicMap(page)

    await MainPage.GoTo("/legal/privacy")
    expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeAttached()
})