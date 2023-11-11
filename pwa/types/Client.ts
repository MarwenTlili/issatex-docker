import { Article } from "./Article"
import { Item } from "./item"

export class Client implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public name?: string,
        public phone?: string,
        public isValid?: boolean,
        public isPrivileged?: boolean,
        public account?: string,
        public manufacturingOrders?: string[],
        public palettes?: string[],
        public articles?: Article[]
    ) {
        this["@id"] = _id
    }
}
