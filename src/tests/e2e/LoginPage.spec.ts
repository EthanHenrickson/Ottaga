import { expect, test } from '@playwright/test';
import { LoginMap } from './pageMap/LoginMap';
import { faker } from '@faker-js/faker';
import { BasicMap } from './pageMap/BasicMap';

const testData = {
	name: faker.person.firstName(),
	email: faker.internet.email(),
	password: faker.internet.password()
};

test('Should redirect unauthenticated user from protected routes', async ({ page }) => {
	let BasicPage = new BasicMap(page);

	await BasicPage.GoTo('/dashboard');
	expect(page.url()).not.toContain('/dashboard');
});

test('Should display error message when logging in with invalid credentials', async ({ page }) => {
	let email = faker.internet.email();
	let password = faker.internet.password();

	let LoginPage = new LoginMap(page);

	await LoginPage.GoTo();
	await LoginPage.LoginToAccount(email, password);

	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('login');
	await expect(page.locator('#error')).toContainText('Incorrect email or password');
});

test('Should successfully create account and login with new credentials', async ({ page }) => {
	let LoginPage = new LoginMap(page);

	await LoginPage.GoTo();
	await LoginPage.CreateAccount(testData.name, testData.email, testData.password);
	await LoginPage.LoginToAccount(testData.email, testData.password);

	expect(page.url()).toContain('dashboard');
});

test('Should successfully logout and redirect to home page', async ({ page }) => {
	let BasicPage = new BasicMap(page);
	let LoginPage = new LoginMap(page);

	await LoginPage.GoTo();
	await LoginPage.LoginToAccount(testData.email, testData.password);
	await LoginPage.Logout();

	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('/');

	await BasicPage.GoTo('/dashboard');
	expect(page.url()).toContain('/login');
});

test('Should prevent account creation with duplicate email address', async ({ page }) => {
	let LoginPage = new LoginMap(page);

	await LoginPage.GoTo();
	await LoginPage.CreateAccount('TestName', 'test@gmail.com', testData.password);
	expect(page.locator('#error')).toHaveText('An account with that email already exists.');
	expect(page.url()).not.toContain('dashboard');
	expect(page.url()).toContain('/login');
});
