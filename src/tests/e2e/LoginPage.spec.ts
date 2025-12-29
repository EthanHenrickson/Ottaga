import { expect, test } from '@playwright/test';
import { LoginMap } from './pageMap/LoginMap';
import { faker } from '@faker-js/faker';
import { BasicMap } from './pageMap/BasicMap';

const testData = {
	name: "testgenerated_" + faker.person.firstName(),
	email: "testgenerated_" + faker.internet.email(),
	password: faker.internet.password()
};

test('Should redirect unauthenticated user from protected routes', async ({ page }) => {
	const BasicPage = new BasicMap(page);

	await BasicPage.GoTo('/dashboard');
	expect(page.url()).not.toContain('/dashboard');
});

test('Should display error message when logging in with invalid credentials', async ({ page }) => {
	const email = faker.internet.email();
	const password = faker.internet.password();

	const LoginPage = new LoginMap(page);

	await LoginPage.goTo();
	await LoginPage.loginToAccount(email, password);

	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('login');
	await expect(page.locator('#error')).toContainText('Incorrect email or password');
});

test('Should successfully create account and login and then log out with new credentials', async ({
	page
}) => {
	const BasicPage = new BasicMap(page);
	const LoginPage = new LoginMap(page);

	await LoginPage.goTo();
	await LoginPage.createAccount(testData.name, testData.email, testData.password);
	await LoginPage.loginToAccount(testData.email, testData.password);

	expect(page.url()).toContain('dashboard');

	await LoginPage.logout();

	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('/');

	await BasicPage.GoTo('/dashboard');
	expect(page.url()).toContain('/login');
});

test('Should prevent account creation with duplicate email address', async ({ page }) => {
	const LoginPage = new LoginMap(page);

	await LoginPage.goTo();
	await LoginPage.createAccount('TestName', 'test@gmail.com', testData.password);
	await expect(page.locator('#error')).toHaveText('An account with that email already exists.');
	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('/login');
});
