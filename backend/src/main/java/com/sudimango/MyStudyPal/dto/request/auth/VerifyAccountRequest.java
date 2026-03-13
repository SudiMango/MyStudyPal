package com.sudimango.MyStudyPal.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class VerifyAccountRequest {
    @NotBlank(message = "Username field in VerifyAccountRequest class cannot be null or blank.")
    private String username;

    @NotBlank(message = "VerificationCode field in VerifyAccountRequest class cannot be null or blank.")
    private String verificationCode;
}
