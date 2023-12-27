import { Item } from "./item";

export class User implements Item {
	public "@id"?: string;
    public "@type"?: string;
    public id?: string;

	constructor(
		_id?: string,
		public email?: string,
		public username?: string,
		public roles?: any,
		public avatar?: string,
		public plainPassword?: string,
        public confirmPassword?: string,
		public createdAt?: Date,
		public lastLoginAt?: Date,
		public isVerified?: boolean
	) {
		this["@id"] = _id;
	}
}
