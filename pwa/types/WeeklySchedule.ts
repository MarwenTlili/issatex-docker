import { Item } from "./item";

export class WeeklySchedule implements Item{
    public "@id"?: string
    public "@type"?: string
    public id?: string
    
    constructor(
        _id?: string,
        public startAt?: Date,
        public endAt?: Date,
        public observation?: string,
        public manufacturingOrder?: string,
        public ilot?: string,
        public dailyProductions?: string[]
    ) {
        this["@id"] = _id
    }
}
