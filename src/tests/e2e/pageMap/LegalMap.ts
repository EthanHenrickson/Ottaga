
import type { Page } from "@playwright/test";
import { BaseMap } from "./BaseMap";

export class LegalMap extends BaseMap{
    constructor(page: Page){
        super(page)
    }

    async GoTo(page: "tos" | "cookie" | "privacy"){
        await this.page.goto(`/legal/${page}`)
    }
}