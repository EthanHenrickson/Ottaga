import type { Page } from "@playwright/test";
import { expect } from '@playwright/test'
import { BaseMap } from "./BaseMap";

export class LoginMap extends BaseMap {
    constructor(page: Page) {
        super(page)
    }

    async GoTo() {
        await this.page.goto('/login')
    }

    async CreateAccount(name: string, email: string, password: string) {
        await this.page.getByRole('button', { name: 'Create new account' }).click()

        await this.page.getByLabel("name").fill(name)
        await this.page.getByLabel("email").fill(email);
        await this.page.getByLabel('password').fill(password)

        await this.page.getByRole("button", {name: 'Create'}).click()
        expect(this.page.url()).toContain('login')
    }

    async LoginToAccount(email: string, password: string) {
        await this.page.getByLabel("email").fill(email);
        await this.page.getByLabel('password').fill(password)

        await this.page.getByRole("button", {name: 'Login'}).click()
        expect(this.page.url()).toContain('dashboard')
    }

    async Logout(){
        await this.page.goto("/login/logout")
        expect(this.page.url()).toContain('/')
    }
}