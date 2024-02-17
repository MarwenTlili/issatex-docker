import { Ilot } from "./Ilot";
import { ManufacturingOrder } from "./ManufacturingOrder";
import { Item } from "./item";

export class WeeklySchedule implements Item{
    public "@id"?: string
    public "@type"?: string
    public id?: string
    
    constructor(
        _id?: string,
        public startAt?: string,
        public endAt?: string,
        public observation?: string,
        public manufacturingOrder?: ManufacturingOrder | string,
        public ilot?: Ilot,
        public dailyProductions?: string[]
    ) {
        this["@id"] = _id
    }
}
