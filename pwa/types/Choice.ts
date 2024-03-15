import { DailyProductionQuantity } from "./DailyProductionQuantity"
import { Item } from "./item"

export class Choice implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public dailyProductionQuantities?: DailyProductionQuantity[] | string[]
    ) {
        this["@id"] = _id
    }
}
