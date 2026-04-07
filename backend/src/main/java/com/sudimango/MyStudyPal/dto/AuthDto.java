package com.sudimango.MyStudyPal.dto;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.AuthProvider;
import com.sudimango.MyStudyPal.entity.User;

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
        String accessToken
    ) {}

    public record UserDetailsResponse(
        String userId,
        String username,
        AuthProvider authProvider,
        boolean isEnabled,
        Instant createdAt,
        Instant updatedAt
    ) {
        public UserDetailsResponse(User user) {
            this(
                user.getUserId(),
                user.getUsername(),
                user.getAuthProvider(),
                user.isEnabled(),
                user.getCreatedAt(),
                user.getUpdatedAt()
            );
        }
    }
}
