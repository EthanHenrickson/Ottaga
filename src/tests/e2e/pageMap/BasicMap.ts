import { BaseMap } from "./BaseMap"

export class BasicMap extends BaseMap {

    async GoTo(destination: string = "/") {
        await this.page.goto(destination)
    }
}