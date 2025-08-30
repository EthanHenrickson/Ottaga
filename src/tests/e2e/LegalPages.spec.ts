import { expect, test } from '@playwright/test';
import { BasicMap } from './pageMap/BasicMap';

test('Should expect TOS page too exist', async ({ page }) => {
	const MainPage = new BasicMap(page);

	await MainPage.GoTo('/legal/tos');
	await expect(page.getByRole('heading', { name: 'Terms of Service', exact: true })).toBeAttached();
});

test('Should expect cookie page too exist', async ({ page }) => {
	const MainPage = new BasicMap(page);

	await MainPage.GoTo('/legal/cookie');
	await expect(
		page.getByRole('heading', { name: 'Browser Storage Policy', exact: true })
	).toBeAttached();
});

test('Should expect privacy page too exist', async ({ page }) => {
	const MainPage = new BasicMap(page);

	await MainPage.GoTo('/legal/privacy');
	await expect(page.getByRole('heading', { name: 'Privacy Policy', exact: true })).toBeAttached();
});
