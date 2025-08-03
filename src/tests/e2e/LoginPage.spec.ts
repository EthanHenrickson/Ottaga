import { expect, test } from '@playwright/test'
import { LoginMap } from './pageMap/LoginMap'
import { faker } from '@faker-js/faker'
import { BasicMap } from './pageMap/BasicMap';

const testData = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
}

test.describe.configure({ mode: 'serial' });

test("Skip login", async ({page}) => {
    let BasicPage = new BasicMap(page)

    await BasicPage.GoTo("/dashboard")
    expect(page.url()).not.toContain("/dashboard")
})

test("Create an account", async ({page}) => {
    let LoginPage = new LoginMap(page)

    await LoginPage.GoTo();
    await LoginPage.CreateAccount(testData.name, testData.email, testData.password);
})

test("Login to an account", async ({page}) => {
    let LoginPage = new LoginMap(page)

    await LoginPage.GoTo()
    await LoginPage.LoginToAccount(testData.email, testData.password)

    expect(page.url()).toContain('dashboard')
})

test("Login to an account, signout", async ({ page }) => {
    let BasicPage = new BasicMap(page)
    let LoginPage = new LoginMap(page)

    await LoginPage.GoTo()
    await LoginPage.LoginToAccount(testData.email, testData.password)
    await LoginPage.Logout()

    expect(page.url()).not.toContain('dashboard')
    expect(page.url()).toContain('/')

    await BasicPage.GoTo("/dashboard")
    expect(page.url()).toContain("/login")

})
