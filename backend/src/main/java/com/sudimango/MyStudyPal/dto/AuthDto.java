package com.sudimango.MyStudyPal.dto;

import jakarta.validation.constraints.NotBlank;

// @formatter:off
public class AuthDto {
    /**
     * Request
     */

    public record LoginRequest(
        @NotBlank String username,
        @NotBlank String password
    ) {}

    public record SignupRequest(
        @NotBlank String username,
        @NotBlank String password
    ) {}

    public record VerifyAccountRequest(
        @NotBlank String username,
        @NotBlank String verificationCode
    ) {}

    public record ResendVerificationEmailRequest(
        @NotBlank String username
    ) {}

    /**
     * Response
     */

    public record LoginResponse(
        String accessToken,
        String username
    ) {}
}
