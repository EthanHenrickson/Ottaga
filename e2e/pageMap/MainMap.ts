import { BaseMap } from "./BaseMap"


type buttonTypes = 'Start a conversation' | 'Session Memory' | 'Stress and anxiety management' | 'Emotional support during difficult times' | 'Guided relaxation and mindfulness exercises'

export class MainMap extends BaseMap{

    async GoTo() {
        await this.page.goto("/")
        //await this.page.waitForLoadState("networkidle")
    }

    async ClickButton(type: buttonTypes) {
        await this.page.getByRole('button', { name: new RegExp(type) }).click()
    }
}