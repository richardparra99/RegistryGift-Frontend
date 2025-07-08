import { apiClient } from "./interceptors";
import type { Gift } from "../models/Gift";
import axios from "axios";

export class GiftService {
	static async listByEvent(eventId: number): Promise<Gift[]> {
		const token = localStorage.getItem("access_token");

		if (token) {
			const res = await apiClient.get<Gift[]>(`gifts/?event_id=${eventId}`);
			return res.data;
		} else {
			const res = await axios.get<Gift[]>(`http://localhost:8000/api/gifts/?event_id=${eventId}`);
			return res.data;
		}
	}

	static async get(id: number): Promise<Gift> {
		const res = await apiClient.get<Gift>(`gifts/${id}/`);
		return res.data;
	}

	static async create(data: Omit<Gift, "id" | "event" | "reserved_by" | "reserved"> & { event_id: number }): Promise<Gift> {
		const res = await apiClient.post<Gift>("gifts/", data);
		return res.data;
	}

	static async update(id: number, data: Partial<Omit<Gift, "id" | "event" | "reserved_by" | "reserved">>): Promise<Gift> {
		const res = await apiClient.patch<Gift>(`gifts/${id}/`, data);
		return res.data;
	}

	static async delete(id: number): Promise<void> {
		await apiClient.delete(`gifts/${id}/`);
	}

	static async reserve(id: number): Promise<{ message?: string; error?: string }> {
		try {
			const token = localStorage.getItem("access_token");

			if (token) {
				const res = await apiClient.post(`gifts/${id}/reserve/`);
				return res.data;
			} else {
				const res = await axios.post(`http://localhost:8000/api/gifts/${id}/reserve/`);
				return res.data;
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error("Error reservando: " + error.message);
			}
			throw new Error("Error reservando: Se produjo un error desconocido");
		}
	}
}