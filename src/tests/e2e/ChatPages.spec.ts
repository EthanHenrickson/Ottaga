import { expect, test } from '@playwright/test'
import { ChatMap } from './pageMap/ChatMap'

test("Send Message", async ({ page }) => {
    const ChatPage = new ChatMap(page)

    await ChatPage.GoTo()
    await ChatPage.SendMessage("Hi there, I am anxious")
    await expect(page.locator(".assistant")).toHaveCount(2, {timeout: 10000})
})