import { Item } from "./item"

export class ManufacturingOrder implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public createdAt?: Date,
        public totalQuantity?: number,
        public technicalDocument?: string,
        public unitTime?: number,
        public unitPrice?: string,
        public totalPrice?: string,
        public observation?: string,
        public urgent?: boolean,
        public launched?: boolean,
        public denied?: boolean,
        public client?: string,
        public palettes?: string[],
        public article?: string,
        public invoice?: string,
        public weeklySchedule?: string,
        public manufacturingOrderSize?: string[],
        public originId?: string
    ) {
        this["@id"] = _id
    }
}
