import { Item } from "./item"

export class Islet implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public createdAt?: Date,
        public machines?: string[],
        public dailyProductions?: string[],
        public weeklySchedules?: string[]
    ) {
        this["@id"] = _id
    }
}
