import { expect } from "vitest";
import { BaseMap } from "./BaseMap"
import type { Page } from "@playwright/test";

export class ChatMap extends BaseMap {
    constructor(page: Page) {
        super(page)
    }

    async GoTo(){
        await this.page.goto("/chat")
        expect(this.page.url()).toContain("/chat")
    }

    async SendMessage(message: string){
        await this.page.getByRole('textbox', { name: 'Send a message' }).fill(message)
        await this.page.getByRole('button', { name: 'Send' }).click()
        expect(this.page.locator(".user").last()).toContain(message)
    }
}