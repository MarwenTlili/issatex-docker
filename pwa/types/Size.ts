import { Item } from "./item"
import { DailyProductionQuantity } from "./DailyProductionQuantity"

export class Size implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public manufacturingOrderSizes?: string[],
        public dailyProductionQuantities?: DailyProductionQuantity[] | string[]
    ) {
        this["@id"] = _id
    }
}
