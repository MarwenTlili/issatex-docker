import { Item } from "./item"

export class Employee implements Item {
    public "@id"?: string
    public "@type"?: string
    public id?: string

    constructor(
        _id?: string,
        public firstName?: string,
        public lastName?: string,
        public registrationCode?: string,
        public category?: string,
        public recuruitmentAt?: string,
        public employeeAttendances?: string[],
        public ilotEmployees?: string[],
    ) {
        this["@id"] = _id
    }
}
