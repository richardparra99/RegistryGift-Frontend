import { Event } from "./Event";
import { User } from "./User";

export interface Comment {
	id: number;
	event: Event;
	poster?: User | number | null;
	text: string;
	posttime?: string;
}