import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';
import { BaseMap } from './BaseMap';

export class LoginMap extends BaseMap {
	constructor(page: Page) {
		super(page);
	}

	async _changeToRegisterForm() {
		await this.page.getByRole('button', { name: 'Create new account' }).click();
	}

	async _enterName(name: string) {
		await this.page.getByLabel('name').fill(name);
	}

	async _enterEmail(email: string) {
		await this.page.getByLabel('email').fill(email);
	}

	async _enterPassword(password: string) {
		await this.page.getByLabel('password').fill(password);
	}

	async _checkTOS(checked: boolean) {
		await this.page.getByLabel('I understand and agree the ').setChecked(checked);
	}

	async _clickCreateAccount() {
		await this.page.getByRole('button', { name: 'Create' }).click();
	}

	async _clickLogin() {
		await this.page.getByRole('button', { name: 'Login' }).click();
	}
	
	async _logout(){
	  await this.page.goto('/login/logout');
	}

	async goTo() {
		await this.page.goto('/login');
	}

	async createAccount(name: string, email: string, password: string) {
		await this._changeToRegisterForm();

		await this._enterName(name);
		await this._enterEmail(email);
		await this._enterPassword(password);

		await this._checkTOS(true);

		await this._clickCreateAccount();
	}

	async loginToAccount(email: string, password: string) {
		await this._enterEmail(email);
		await this._enterPassword(password);
		
		await this._clickLogin()
	}

	async logout() {
		await this._logout()
		expect(this.page.url()).toContain('/');
	}
}
