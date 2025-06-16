import { expect, test } from '@playwright/test'
import { LegalMap } from './pageMap/LegalMap'

test("TOS", async ({page}) => {
    const LegalPage = new LegalMap(page)

    LegalPage.GoTo('tos')
    await expect(page.getByRole('heading', { name: 'Terms of Service', exact: true })).toBeAttached()
})

test("Cookie", async ({ page }) => {
    const LegalPage = new LegalMap(page)

    await LegalPage.GoTo("cookie")
    await expect(page.getByRole('heading', { name: 'Browser Storage Policy', exact: true })).toBeAttached()
})

test("Privacy", async ({ page }) => {
    const LegalPage = new LegalMap(page)

    await LegalPage.GoTo("privacy")
    await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true})).toBeAttached()
})