import { Event } from "./Event";
import { User } from "./User";

export interface Gift {
	id: number;
	event: Event;
	name: string;
	description: string;
	quantity: number;
	reference_link: string | null;
	priority: 'high' | 'medium' | 'low';
	reserved_by: User | number | null;
	reserved: boolean;
}