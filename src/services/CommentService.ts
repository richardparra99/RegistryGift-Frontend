import { apiClient } from "./interceptors";
import type { Comment } from "../models/Comment";
import axios from "axios";

export class CommentService {
	static async listByEvent(eventId: number): Promise<Comment[]> {
		const token = localStorage.getItem("access_token");

		if (token) {
			const res = await apiClient.get<Comment[]>(`comments/?event_id=${eventId}`);
			return res.data;
		} else {
			const res = await axios.get<Comment[]>(`http://localhost:8000/api/comments/?event_id=${eventId}`);
			return res.data;
		}
	}

	static async create(data: Omit<Comment, "id" | "event"> & { event_id: number }): Promise<Comment> {
		try {
			const token = localStorage.getItem("access_token");

			if (token) {
				const res = await apiClient.post<Comment>("comments/", data);
				return res.data;
			} else {
				const res = await axios.post<Comment>("http://localhost:8000/api/comments/", data);
				return res.data;
			}
		} catch (error: unknown) {
			if (error instanceof Error) {
				throw new Error("Error al crear comentario: " + error.message);
			}
			throw new Error("Error al crear comentario: Se produjo un error desconocido");
		}
	}

	static async update(id: number, data: Partial<Omit<Comment, "id" | "event" | "poster" | "posttime">>): Promise<Comment> {
		const res = await apiClient.patch<Comment>(`comments/${id}/`, data);
		return res.data;
	}

	static async delete(id: number): Promise<void> {
		await apiClient.delete(`comments/${id}/`);
	}
}