let accessToken: string | null = null;

export const TokenStore = {
    get: () => accessToken,
    set: (token: string | null) => {
        accessToken = token;
        console.log(accessToken);
    },
};
