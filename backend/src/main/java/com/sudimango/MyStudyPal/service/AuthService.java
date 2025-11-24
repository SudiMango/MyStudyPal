package com.sudimango.MyStudyPal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.request.LoginRequest;
import com.sudimango.MyStudyPal.dto.request.ResendVerificationEmailRequest;
import com.sudimango.MyStudyPal.dto.request.SignUpRequest;
import com.sudimango.MyStudyPal.dto.request.VerifyAccountRequest;
import com.sudimango.MyStudyPal.dto.response.LoginResponse;
import com.sudimango.MyStudyPal.entity.AuthProvider;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.entity.VerificationCode;
import com.sudimango.MyStudyPal.exception.InvalidCredentialsException;
import com.sudimango.MyStudyPal.exception.InvalidRefreshTokenException;
import com.sudimango.MyStudyPal.exception.InvalidVerificationCodeException;
import com.sudimango.MyStudyPal.exception.UserAccountNotEnabledException;
import com.sudimango.MyStudyPal.exception.WrongAuthProviderException;
import com.sudimango.MyStudyPal.repository.UserRepository;
import com.sudimango.MyStudyPal.service.auth.CustomUserDetailsService;
import com.sudimango.MyStudyPal.service.auth.JwtService;

import io.jsonwebtoken.Claims;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Autowired
    private PasswordEncoder encoder;

    @Autowired
    private VerificationCodeService verificationCodeService;

    public void signUp(SignUpRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.getUsername())) {
            throw new IllegalStateException("User with this email already exists.");
        }

        User user = User.builder()
                        .username(signUpRequest.getUsername())
                        .password(encoder.encode(signUpRequest.getPassword()))
                        .authProvider(AuthProvider.EMAILPASSWORD)
                        .isEnabled(false)
                        .build();

        userRepository.save(user);
        verificationCodeService.sendVerificationEmail(user);
    }

    public LoginResponse login(LoginRequest loginRequest, HttpServletRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));

        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateAccessToken(loginRequest.getUsername());
            String refreshToken = jwtService.generateRefreshToken(loginRequest.getUsername());
            User savedUser = userRepository.findByUsername(loginRequest.getUsername()).get();

            if (savedUser.getAuthProvider() != AuthProvider.EMAILPASSWORD) {
                throw new WrongAuthProviderException("This email is already signed up with another auth provider.");
            }
            if (!savedUser.isEnabled()) {
                throw new UserAccountNotEnabledException("Account not verified.");
            }

            refreshTokenService.saveRefreshTokenForUser(savedUser, refreshToken);

            // Add refresh token to response as cookie
            Cookie cookie = new Cookie("refresh_token", refreshToken);
            cookie.setHttpOnly(true);
            cookie.setPath("/auth");
            cookie.setMaxAge(7 * 24 * 60 * 60);
            response.addCookie(cookie);

            return new LoginResponse(accessToken);
        } else {
            throw new InvalidCredentialsException("Invalid credentials.");
        }
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        refreshTokenService.deleteRefreshToken(request, response);
    }

    public LoginResponse refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        // Refresh token not found in cookies
        Cookie[] cookies = request.getCookies();
        if (cookies == null) throw new InvalidRefreshTokenException("Cookies not found.");

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh_token")) {
                refreshToken = cookie.getValue();
                break;
            }
        }
        if (refreshToken == null) throw new InvalidRefreshTokenException("Refresh token not found in cookies.");

        // Refresh token not found in database
        if (!refreshTokenService.isRefreshTokenFoundInDatabase(refreshToken)) {
            throw new InvalidRefreshTokenException("Refresh token not found in database.");
        }

        // Ensure refresh token isn't an access token
        if (("access".equals(jwtService.extractClaim(refreshToken, 
            claims -> claims.get("type", String.class)))))
                throw new InvalidRefreshTokenException("Refresh token cannot be of type access.");

        // Return new access token if refresh token is valid
        String username = jwtService.extractClaim(refreshToken, Claims::getSubject);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            return new LoginResponse(jwtService.generateAccessToken(username));
        }

        throw new InvalidRefreshTokenException("Invalid refresh token.");
    }

    public void verifyAccountWithCode(VerifyAccountRequest verifyAccountRequest) {
        Optional<User> savedUser = userRepository.findByUsername(verifyAccountRequest.getUsername());
        if (savedUser.isEmpty()) {
            throw new InvalidCredentialsException("Invalid email.");
        }

        User user = savedUser.get();
        if (user.isEnabled()) {
            throw new RuntimeException("User is already verified.");
        }

        VerificationCode verificationCode = verificationCodeService.getVerificationCode(verifyAccountRequest);
        if (verificationCodeService.isCodeValid(verifyAccountRequest, verificationCode)) {
            user.setEnabled(true);
            userRepository.save(user);
            verificationCodeService.deleteVerificationCode(verificationCode);
        } else {
            throw new InvalidVerificationCodeException("Invalid or expired verification code.");
        }
    }

    public void resendVerificationEmail(ResendVerificationEmailRequest resendVerificationEmailRequest) {
        Optional<User> savedUser = userRepository.findByUsername(resendVerificationEmailRequest.getUsername());
        if (savedUser.isEmpty()) {
            throw new InvalidCredentialsException("Invalid email.");
        }
        verificationCodeService.sendVerificationEmail(savedUser.get());
    }


}
