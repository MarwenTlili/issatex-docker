import { Item } from "./item"

export class ManufacturingOrderSize implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public quantity?: number,
        public manufacturingOrder?: string,
        public size?: string
    ) {
        this["@id"] = _id
    }
}
