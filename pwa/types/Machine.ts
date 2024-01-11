import { Item } from "./item"

export class Machine implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public category?: string,
        public brand?: string,
        public ilot?: string
    ) {
        this["@id"] = _id
    }
}
