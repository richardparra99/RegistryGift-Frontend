import { apiClient } from "./interceptors";
import type { Event } from "../models/Event";
import axios from "axios";

export class EventService {
	static async list(): Promise<Event[]> {
		const token = localStorage.getItem("access_token");

		if (token) {
			const res = await apiClient.get<Event[]>("events/");
			return res.data;
		} else {
			const res = await axios.get<Event[]>("http://localhost:8000/api/events/");
			return res.data;
		}
	}

	static async listMine(): Promise<Event[]> {
		const res = await apiClient.get<Event[]>("events/my/");
		return res.data;
	}

	static async get(id: number): Promise<Event> {
		const res = await apiClient.get<Event>(`events/${id}/`);
		return res.data;
	}

	static async create(data: Omit<Event, "id" | "owner">): Promise<Event> {
		const res = await apiClient.post<Event>("events/", data);
		return res.data;
	}

	static async update(id: number, data: Partial<Omit<Event, "id" | "owner">>): Promise<Event> {
		const res = await apiClient.patch<Event>(`events/${id}/`, data);
		return res.data;
	}

	static async delete(id: number): Promise<void> {
		await apiClient.delete(`events/${id}/`);
	}
}