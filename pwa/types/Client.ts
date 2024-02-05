import { Article } from "./Article"
import { Item } from "./item"

export class Client implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string
    public name?: string
    public phone?: string
    public isValid?: boolean
    public isPrivileged?: boolean
    public account?: string
    public manufacturingOrders?: string[]
    public palettes?: string[]
    public articles?: Article[]

    constructor({
        _id = undefined,
        name = undefined,
        phone = undefined,
        isValid = false,
        isPrivileged = false,
        account = undefined,
        manufacturingOrders = undefined,
        palettes = undefined,
        articles = undefined
    }: Props) {
        this["@id"] = _id
        this.name = name
        this.phone = phone
        this.isValid = isValid
        this.isPrivileged = isPrivileged
        this.account = account
        this.manufacturingOrders = manufacturingOrders
        this.palettes = palettes
        this.articles = articles
    }
}

interface Props {
    _id?: string
    name?: string
    phone?: string
    isValid?: boolean
    isPrivileged?: boolean
    account?: string
    manufacturingOrders?: string[]
    palettes?: string[]
    articles?: Article[]
}
