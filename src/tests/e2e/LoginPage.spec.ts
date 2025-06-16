import { expect, test } from '@playwright/test'
import { LoginMap } from './pageMap/LoginMap'
import { faker } from '@faker-js/faker'

const testData = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    password: faker.internet.password()
}

test("Create an account", async ({page}) => {
    let LoginPage = new LoginMap(page)

    await LoginPage.GoTo();
    await LoginPage.CreateAccount(testData.name, testData.email, testData.password);
})

test("Login to an account", async ({page}) => {
    let LoginPage = new LoginMap(page)

    await LoginPage.GoTo()
    await LoginPage.LoginToAccount(testData.email, testData.password)

    await expect(page.url()).toContain('dashboard')
})
