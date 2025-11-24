package com.sudimango.MyStudyPal.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;

@AllArgsConstructor
@Getter
public class SignUpRequest {
    @NotBlank(message = "Username field in SignUpRequest class cannot be null or blank.")
    private String username;

    @NotBlank(message = "Password field in SignUpRequest class cannot be null or blank.")
    private String password;
}
