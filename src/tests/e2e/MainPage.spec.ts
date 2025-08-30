import { test, expect } from '@playwright/test';
import { BasicMap } from './pageMap/BasicMap';

test('Verify main marketing page functionality', async ({ page }) => {
	const BasicPage = new BasicMap(page);

	await BasicPage.GoTo('/');

	await page.getByRole('tab', { name: 'Session Memory ⯈' }).click();
	await expect(page.locator('#help-panel')).toContainText('Experience personalized support');

	await page.getByRole('tab', { name: 'Stress and anxiety management' }).click();
	await expect(page.locator('#help-panel')).toContainText('Learn practical coping');

	await page.getByRole('tab', { name: 'Emotional support during' }).click();
	await expect(page.locator('#help-panel')).toContainText('Experience empathy and validation');

	await page.getByRole('tab', { name: 'Guided relaxation and' }).click();
	await expect(page.locator('#help-panel')).toContainText('Access a variety of mindfulness');
});
