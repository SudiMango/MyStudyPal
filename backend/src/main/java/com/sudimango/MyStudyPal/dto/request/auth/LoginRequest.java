package com.sudimango.MyStudyPal.dto.request.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class LoginRequest {
    @NotBlank(message = "Username field in LoginRequest class cannot be null or blank.")
    private String username;

    @NotBlank(message = "Password field in LoginRequest class cannot be null or blank.")
    private String password;
}
