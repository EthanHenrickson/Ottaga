import { BaseMap } from "./BaseMap"

type buttonTypes = 'Session Memory >' | 'Stress and anxiety management >' | 'Emotional support during difficult times >' | 'Guided relaxation and mindfulness exercises >'

export class MainMap extends BaseMap{

    async GoTo() {
        await this.page.goto("/")
    }

    async ClickButton(type: buttonTypes) {
        await this.page.getByRole('tab', { name: type }).click()
    }
}