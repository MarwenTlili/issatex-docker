import { Item } from "./item"

export class Article implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public designation?: string,
        public model?: string,
        public composition?: string,
        public image?: string,
        public manufacturingOrders?: string[],
        public client?: string
    ) {
        this["@id"] = _id
    }
}
