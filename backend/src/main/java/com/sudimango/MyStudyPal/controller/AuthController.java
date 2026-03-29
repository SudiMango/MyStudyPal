package com.sudimango.MyStudyPal.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.AuthDto;
import com.sudimango.MyStudyPal.dto.AuthDto.ResendVerificationEmailRequest;
import com.sudimango.MyStudyPal.dto.AuthDto.VerifyAccountRequest;
import com.sudimango.MyStudyPal.service.auth.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /**
     * Sign up a new user to the system
     * 
     * Endpoint: {@code POST /auth/signup}
     * 
     * @param signUpRequest - request body
     * @see AuthDto.SignupRequest SignupRequest for request body structure
     * 
     * @return
     * {@code HTTP 201}: User created successfully
     * 
     * @throws
     * {@code HTTP 422}: Validation errors with request body
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody AuthDto.SignupRequest signUpRequest) {
        authService.signUp(signUpRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    /**
     * Log in existing user to the system
     * 
     * Endpoint: {@code POST /auth/login}
     * 
     * @param loginRequest - request body
     * @param request - HttpRequest
     * @param response - HttpResponse
     * @see AuthDto.LoginRequest LoginRequest for request body structure
     * @see AuthDto.LoginResponse LoginResponse for response body structure
     * 
     * @return
     * {@code LoginResponse HTTP 200} - User logged in successfully
     * 
     * @throws
     * {@code HTTP 401} - Invalid credentials
     * {@code HTTP 403} - User account not enabled
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthDto.LoginRequest loginRequest, HttpServletRequest request,
            HttpServletResponse response) {
        AuthDto.LoginResponse loginResponse = authService.login(loginRequest, request, response);
        return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
    }

    /**
     * Logs user out of the current device
     * 
     * Endpoint: {@code POST /auth/logout}
     * 
     * @param request - HttpRequest
     * @param response - HttpResponse
     * 
     * @return
     * {@code HTTP 200} - User logged off successfully
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(null);
    }

    /**
     * Refresh access token for user
     * 
     * Endpoint: {@code POST /auth/refresh}
     * 
     * @param request - HttpRequest
     * @param response - HttpResponse
     * 
     * @return
     * {@code HTTP 200} - Account verified successfully
     * 
     * @throws
     * {@code HTTP 401} - Invalid credentials
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        AuthDto.LoginResponse accessToken = authService.refreshAccessToken(request, response);
        return ResponseEntity.status(HttpStatus.CREATED).body(accessToken);
    }

    /**
     * Verify sign up email
     * 
     * Endpoint: {@code POST /auth/verify-account}
     * 
     * @param verifyAccountRequest - request body
     * @see AuthDto.VerifyAccountRequest VerifyAccountRequest for request body structure
     * 
     * @return
     * {@code HTTP 200} - Account verified successfully
     * 
     * @throws
     * {@code HTTP 401} - Invalid credentials
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/verify-account")
    public ResponseEntity<?> verify(@Valid @RequestBody AuthDto.VerifyAccountRequest verifyAccountRequest) {
        authService.verifyAccountWithCode(verifyAccountRequest);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

    /**
     * Resend account verification code
     * 
     * Endpoint: {@code POST /auth/resend-verification}
     * 
     * @param resendVerificationEmailRequest - request body
     * @see AuthDto.ResendVerificationEmailRequest ResendVerificationEmailRequest for request body structure
     * 
     * @return
     * {@code HTTP 200} - Resent email successfully
     * 
     * @throws
     * {@code HTTP 422} - Validation errors with request body
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(
            @Valid @RequestBody AuthDto.ResendVerificationEmailRequest resendVerificationEmailRequest) {
        authService.resendVerificationEmail(resendVerificationEmailRequest);
        return ResponseEntity.status(HttpStatus.OK).body(null);
    }

}
