const TOKEN_KEY = "access_token";

export const TokenStore = {
    get: (): string | null => {
        if (typeof window === "undefined") return null;
        return localStorage.getItem(TOKEN_KEY);
    },
    set: (token: string | null) => {
        if (typeof window === "undefined") return;

        if (token === null) {
            localStorage.removeItem(TOKEN_KEY);
        } else {
            localStorage.setItem(TOKEN_KEY, token);
        }
    },
};
