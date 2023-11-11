import { Item } from "./item"

export class TechnicalDocument implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public contentUrl?: string
    ) {
        this["@id"] = _id
    }
}
