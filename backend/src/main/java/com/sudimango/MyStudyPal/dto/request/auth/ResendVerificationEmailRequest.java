package com.sudimango.MyStudyPal.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class ResendVerificationEmailRequest {
    @NotBlank(message = "Username field in ResendVerificationEmailRequest class cannot be null or blank.")
    private String username;
}
