package com.sudimango.MyStudyPal.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sudimango.MyStudyPal.dto.request.auth.LoginRequest;
import com.sudimango.MyStudyPal.dto.request.auth.ResendVerificationEmailRequest;
import com.sudimango.MyStudyPal.dto.request.auth.SignUpRequest;
import com.sudimango.MyStudyPal.dto.request.auth.VerifyAccountRequest;
import com.sudimango.MyStudyPal.dto.response.auth.LoginResponse;
import com.sudimango.MyStudyPal.service.auth.AuthService;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;
    
    /**
     * Sign up a new user to the system
     * 
     * @param signUpRequest - request body
     * @see SignUpRequest SignUpRequest class for request body structure
     * 
     * @return
     * {@code HTTP 201} - User created successfully
     * {@code HTTP 409} - User with this email already exists {error: ""}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     */
    @PostMapping("/signup")
    public ResponseEntity<?> signUp(@Valid @RequestBody SignUpRequest signUpRequest) {
        try {
            authService.signUp(signUpRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(null);
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Log in existing user to the system
     * 
     * @param loginRequest - request body
     * @param request - HttpRequest
     * @param response - HttpResponse
     * @see LoginRequest LoginRequest class for request body structure
     * 
     * @return
     * {@code HTTP 200} - User logged in successfully {accessToken: ""}
     * {@code HTTP 401} - Error occured with user logging in {error: ""}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        try {
            LoginResponse loginResponse = authService.login(loginRequest, request, response);
            return ResponseEntity.status(HttpStatus.OK).body(loginResponse);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Logs user out of the current device
     * 
     * @param request - HttpRequest
     * @param response - HttpResponse
     * 
     * @return
     * {@code HTTP 200} - User logged off successfully {null}
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
        authService.logout(request, response);
        return ResponseEntity.ok(null);
    }


    /**
     * Refresh access token for user
     * 
     * 
     * @return
     * {@code HTTP 200} - Account verified successfully {null}
     * {@code HTTP 401} - Error occured while verifying account {error: ""}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(HttpServletRequest request, HttpServletResponse response) {
        try {
            LoginResponse accessToken = authService.refreshAccessToken(request, response);
            return ResponseEntity.status(HttpStatus.CREATED).body(accessToken);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Verify sign up email
     * 
     * @param verifyAccountRequest - request body
     * @see VerifyAccountRequest VerifyAccountRequest class for request body structure
     * 
     * @return
     * {@code HTTP 200} - Account verified successfully {null}
     * {@code HTTP 401} - Error occured while verifying account {error: ""}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     */
    @PostMapping("/verify-account")
    public ResponseEntity<?> verify(@Valid @RequestBody VerifyAccountRequest verifyAccountRequest) {
        try {
            authService.verifyAccountWithCode(verifyAccountRequest);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("error", e.getMessage()));
        }
    }

    /**
     * Resend account verification code
     * 
     * @param resendVerificationEmailRequest - request body
     * @see ResendVerificationEmailRequest ResendVerificationEmailRequest class for request body structure
     * 
     * @return
     * {@code HTTP 200} - Resent email successfully {null}
     * {@code HTTP 500} - Error occured while resending email {error: ""}
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     */
    @PostMapping("/resend-verification")
    public ResponseEntity<?> resendVerificationEmail(@Valid @RequestBody ResendVerificationEmailRequest resendVerificationEmailRequest) {
        try {
            authService.resendVerificationEmail(resendVerificationEmailRequest);
            return ResponseEntity.status(HttpStatus.OK).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("error", e.getMessage()));
        }
    }

}
