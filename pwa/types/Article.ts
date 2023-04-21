import { Item } from "./item";

export class Article implements Item {
	public "@id"?: string;

	constructor(
		_id?: string,
		public designation?: string,
		public model?: string,
		public composition?: string,
		public manufacturingOrders?: string[]
	) {
		this["@id"] = _id;
	}
}
