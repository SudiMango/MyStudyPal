export enum AuthProvider {
    EMAILPASSWORD = "EMAILPASSWORD",
    GOOGLE = "GOOGLE",
}

/**
 * Request
 */

export interface LoginRequest {
    username: string;
    password: string;
}

export interface SignupRequest {
    username: string;
    password: string;
}

export interface VerifyAccountRequest {
    username: string;
    verificationCode: string;
}

export interface ResendVerificationEmailRequest {
    username: string;
}

/**
 * Response
 */

export interface LoginResponse {
    accessToken: string;
}

export interface UserDetailsResponse {
    userId: string;
    username: string;
    authProvider: AuthProvider;
    isEnabled: boolean;
    createdAt: string;
    updatedAt: string;
}
