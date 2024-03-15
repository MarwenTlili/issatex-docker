import { Item } from "./item"
import { DailyProductionQuantity } from "./DailyProductionQuantity"
import { WeeklySchedule } from "./WeeklySchedule"

export class DailyProduction implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public day?: string,
        public weeklySchedule?: WeeklySchedule | string,
        public dailyProductionQuantities?: DailyProductionQuantity[] | string[],
    ) {
        this["@id"] = _id
    }
}
