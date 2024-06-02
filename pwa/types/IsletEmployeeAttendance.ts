import { Attendance } from "./Attendance"
import { Item } from "./item"

export class IsletEmployeeAttendance implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string
    public islet?: string
    public employee?: string
    public attendance?: Attendance | string

    constructor({
        _id = undefined,
        islet = '',
        employee = '',
        attendance = new Attendance({})
    }: Props) {
        this["@id"] = _id
        this.islet = islet
        this.employee = employee
        this.attendance = attendance
    }
}

interface Props {
    _id?: string,
    islet?: string,
    employee?: string,
    attendance?: Attendance | string
}
