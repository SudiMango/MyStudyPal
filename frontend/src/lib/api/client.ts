export const API_BASE_URL = "http://localhost:8080/api";

interface FetchOptions {
    method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: unknown;
}

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
}

export const apiCall = async <T>(
    endpoint: string,
    options: FetchOptions = {}
): Promise<ApiResponse<T>> => {
    const { method = "GET", body } = options;

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            method,
            headers: { "Content-Type": "application/json" },
            body: body ? JSON.stringify(body) : undefined,
        });

        const data = await response.json().catch(() => ({}));

        if (response.ok) {
            return { success: true, data };
        } else {
            return {
                success: false,
                error:
                    data.error ||
                    data.errors?.join(" ") ||
                    "An error occurred. Please try again.",
            };
        }
    } catch (err) {
        return {
            success: false,
            error: "Unable to connect to the server. Please try again later.",
        };
    }
};
