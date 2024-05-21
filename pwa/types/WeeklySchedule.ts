import { Ilot } from "./Ilot";
import { ManufacturingOrder } from "./ManufacturingOrder";
import { Item } from "./item";
import { DailyProduction } from "./DailyProduction";

export class WeeklySchedule implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public startAt?: string,
        public endAt?: string,
        public observation?: string,
        public manufacturingOrder?: ManufacturingOrder,
        public ilot?: Ilot,
        public dailyProductions?: DailyProduction[]
    ) {
        this["@id"] = _id
    }
}
