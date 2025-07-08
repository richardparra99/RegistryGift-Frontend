import { User } from "./User";

export interface Event {
	id: number;
	name: string;
	description: string;
	datetime: string;
	type: 'birthday' | 'wedding' | 'anniversary' | 'other';
	private: boolean;
	owner: User | number;
}