import { expect, test } from '@playwright/test';
import { ChatMap } from './pageMap/ChatMap';

test('Should display user message and recieve response', async ({ page }) => {
	const ChatPage = new ChatMap(page);

	await ChatPage.GoTo();

	const testMessage = 'This is my test message';
	await ChatPage.SendMessage(testMessage);

	// Check user message is displayed
	const userMessage = page.locator('.user').last();
	await expect(userMessage).toBeVisible();
	await expect(userMessage).toContainText(testMessage);
	await expect(userMessage).toContainText('You:');

	// Wait for response and to prevent error
	await expect(page.locator('.assistant')).toHaveCount(2, { timeout: 15000 });
	await page.waitForTimeout(5000);
});

test('Should show loading indicator while waiting for response', async ({ page }) => {
	const ChatPage = new ChatMap(page);

	await ChatPage.GoTo();

	// Send message
	await page.getByRole('textbox', { name: 'Send a message' }).fill('Hello');
	await page.getByRole('button', { name: 'Send' }).click();

	// Check for loading indicator (may be brief)
	// The loading container should appear briefly
	await expect(page.locator('.loadingMessageContainer')).toBeVisible({ timeout: 5000 });

	// Wait for response to complete
	await expect(page.locator('.assistant')).toHaveCount(2, { timeout: 15000 });
	await page.waitForTimeout(5000);
});

test('Should disable input while loading', async ({ page }) => {
	const ChatPage = new ChatMap(page);

	await ChatPage.GoTo();

	// Send message
	await page.getByRole('textbox', { name: 'Send a message' }).fill('Hello');
	await page.getByRole('button', { name: 'Send' }).click();

	// Input should be disabled during loading
	await expect(page.getByRole('textbox', { name: 'Send a message' })).toBeDisabled({
		timeout: 2000
	});

	// Wait for response to complete
	await expect(page.locator('.assistant')).toHaveCount(2, { timeout: 15000 });
	await page.waitForTimeout(5000);
});
