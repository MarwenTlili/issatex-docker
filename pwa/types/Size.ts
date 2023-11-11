import { Item } from "./item"

export class Size implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public manufacturingOrderSizes?: string[]
    ) {
        this["@id"] = _id
    }
}
