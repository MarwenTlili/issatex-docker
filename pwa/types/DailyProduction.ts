import { Item } from "./item"

export class DailyProduction implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public firstChoiceQuantity?: number,
        public secondChoiceQuantity?: number,
        public ilot?: string,
        public weeklySchedule?: string,
        public day?: string
    ) {
        this["@id"] = _id
    }
}
