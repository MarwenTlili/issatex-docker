import { Choice } from "./Choice"
import { DailyProduction } from "./DailyProduction"
import { Size } from "./Size"
import { Item } from "./item"

export class DailyProductionQuantity implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public quantity?: number,
        public size?: Size | string,
        public choice?: Choice | string,
        public dailyProduction?: DailyProduction | string
    ) {
        this["@id"] = _id
    }
}
