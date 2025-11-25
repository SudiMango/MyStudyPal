import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { TokenStore } from "../token-store";

let isRefreshing = false;
let failedQueue: {
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
}[] = [];

const processQueue = (error: Error | null, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

const apiClient = axios.create({
    baseURL: "/api",
    withCredentials: true,
});

apiClient.interceptors.request.use(
    (config) => {
        const token = TokenStore.get();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
            _retry?: boolean;
        };

        const nonRefreshableURLs = ["/auth/login", "/auth/refresh"];
        const requestedUrl = originalRequest.url || "";

        if (
            error.response?.status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !nonRefreshableURLs.includes(requestedUrl)
        ) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization =
                                "Bearer " + token;
                        }
                        return apiClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const { data } = await apiClient.post("/auth/refresh");
                const newAccessToken = data.accessToken;
                TokenStore.set(newAccessToken);

                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }

                processQueue(null, newAccessToken);

                return apiClient(originalRequest);
            } catch (refreshError: any) {
                processQueue(refreshError, null);
                TokenStore.set(null);
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default apiClient;
