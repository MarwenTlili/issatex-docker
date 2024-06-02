import { Item } from "./item"

export class Attendance implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string
    public dateAt?: string
    public startAt?: string
    public endAt?: string

    constructor({
        _id = undefined,
        dateAt = '',
        startAt = '',
        endAt = ''
    }: Props) {
        this["@id"] = _id
        this.dateAt = dateAt
        this.startAt = startAt
        this.endAt = endAt
    }
}

interface Props {
    _id?: string,
    dateAt?: string,
    startAt?: string,
    endAt?: string,
    isletEmployeeAttendances?: string[]
}
