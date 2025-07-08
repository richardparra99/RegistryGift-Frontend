import axios from "axios";
import type { AxiosInstance } from "axios";

const BASE_URL = "http://localhost:8000/api";
const REFRESH_URL = `${BASE_URL}/token/refresh`;

const getAccessToken = () => localStorage.getItem("access_token");
const getRefreshToken = () => localStorage.getItem("refresh_token");

const redirectToLogin = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
};

const attachAuthToken = (config: any) => {
    const token = getAccessToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
};

const createApiClient = (): AxiosInstance => {
    const client = axios.create({
        baseURL: BASE_URL,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    client.interceptors.request.use(attachAuthToken);

    client.interceptors.response.use(
        (res) => res,
        async (err) => {
            const originalRequest = err.config;

            if (
                err.response?.status === 401 &&
                !originalRequest._retry &&
                !originalRequest.url.includes("/token") &&
                !originalRequest.url.includes("/token/refresh")
            ) {
                originalRequest._retry = true;
                const refresh = getRefreshToken();

                if (!refresh) {
                    redirectToLogin();
                    return Promise.reject(err);
                }

                try {
                    const res = await axios.post(REFRESH_URL, { refresh });
                    const newAccess = res.data.access;
                    localStorage.setItem("access_token", newAccess);

                    originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                    return client(originalRequest);
                } catch (refreshError) {
                    redirectToLogin();
                    return Promise.reject(refreshError);
                }
            }

            return Promise.reject(err);
        }
    );

    return client;
};



export const apiClient = createApiClient();
