import type { Page } from "@playwright/test";

export class BaseMap {
    protected page: Page

    constructor(page: Page) {
        this.page = page
    }
}