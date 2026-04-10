package com.sudimango.MyStudyPal.service.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.AuthDto;
import com.sudimango.MyStudyPal.dto.AuthDto.LoginResponse;
import com.sudimango.MyStudyPal.dto.AuthDto.ResendVerificationEmailRequest;
import com.sudimango.MyStudyPal.dto.AuthDto.UserDetailsResponse;
import com.sudimango.MyStudyPal.entity.AuthProvider;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.entity.VerificationCode;
import com.sudimango.MyStudyPal.exception.ForbiddenException;
import com.sudimango.MyStudyPal.exception.UnauthorizedException;
import com.sudimango.MyStudyPal.repository.UserRepository;

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

    public UserDetailsResponse getLoggedInUser(User user) {
        return new UserDetailsResponse(user);
    }

    public void signUp(AuthDto.SignupRequest signUpRequest) {
        if (userRepository.existsByUsername(signUpRequest.username())) {
            return;
        }

        User user = User.builder().username(signUpRequest.username()).password(encoder.encode(signUpRequest.password()))
                .authProvider(AuthProvider.EMAILPASSWORD).isEnabled(false).build();

        userRepository.save(user);
        verificationCodeService.sendVerificationEmail(user);
    }

    public AuthDto.LoginResponse login(AuthDto.LoginRequest loginRequest, HttpServletRequest request,
            HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.username(), loginRequest.password()));

        if (authentication.isAuthenticated()) {
            String accessToken = jwtService.generateAccessToken(loginRequest.username());
            String refreshToken = jwtService.generateRefreshToken(loginRequest.username());
            User savedUser = userRepository.findByUsername(loginRequest.username()).get();

            if (savedUser.getAuthProvider() != AuthProvider.EMAILPASSWORD) {
                throw new UnauthorizedException("This email is already signed up with another auth provider.");
            }
            if (!savedUser.isEnabled()) {
                throw new ForbiddenException("Account not verified.");
            }

            ResponseCookie refreshTokenCookie = refreshTokenService.createRefreshTokenCookie(refreshToken, response);
            response.addHeader("Set-Cookie", refreshTokenCookie.toString());
            refreshTokenService.saveRefreshTokenForUser(savedUser, refreshToken);

            return new AuthDto.LoginResponse(accessToken);
        } else {
            throw new UnauthorizedException("Invalid credentials.");
        }
    }

    public void logout(HttpServletRequest request, HttpServletResponse response) {
        refreshTokenService.deleteRefreshToken(request, response);
    }

    public AuthDto.LoginResponse refreshAccessToken(HttpServletRequest request, HttpServletResponse response) {
        // Refresh token not found in cookies
        Cookie[] cookies = request.getCookies();
        if (cookies == null)
            throw new UnauthorizedException("Cookies not found.");

        String refreshToken = null;
        for (Cookie cookie : cookies) {
            if (cookie.getName().equals("refresh_token")) {
                refreshToken = cookie.getValue();
                break;
            }
        }
        if (refreshToken == null)
            throw new UnauthorizedException("Refresh token not found in cookies.");

        // Refresh token not found in database
        if (!refreshTokenService.isRefreshTokenFoundInDatabase(refreshToken)) {
            throw new UnauthorizedException("Refresh token not found in database.");
        }

        // Ensure refresh token isn't an access token
        if (("access".equals(jwtService.extractClaim(refreshToken, claims -> claims.get("type", String.class)))))
            throw new UnauthorizedException("Refresh token cannot be of type access.");

        // Return new access token if refresh token is valid
        String username = jwtService.extractClaim(refreshToken, Claims::getSubject);
        UserDetails userDetails = customUserDetailsService.loadUserByUsername(username);
        if (jwtService.isTokenValid(refreshToken, userDetails)) {
            return new LoginResponse(jwtService.generateAccessToken(username));
        }

        throw new UnauthorizedException("Invalid refresh token.");
    }

    public void verifyAccountWithCode(AuthDto.VerifyAccountRequest verifyAccountRequest) {
        Optional<User> savedUser = userRepository.findByUsername(verifyAccountRequest.username());
        if (savedUser.isEmpty()) {
            throw new UnauthorizedException("Invalid email.");
        }

        User user = savedUser.get();
        if (user.isEnabled()) {
            return;
        }

        VerificationCode verificationCode = verificationCodeService.getVerificationCode(verifyAccountRequest);
        if (verificationCodeService.isCodeValid(verifyAccountRequest, verificationCode)) {
            user.setEnabled(true);
            userRepository.save(user);
            verificationCodeService.deleteVerificationCode(verificationCode);
        } else {
            throw new UnauthorizedException("Invalid or expired verification code.");
        }
    }

    public void resendVerificationEmail(ResendVerificationEmailRequest resendVerificationEmailRequest) {
        Optional<User> savedUser = userRepository.findByUsername(resendVerificationEmailRequest.username());
        if (savedUser.isEmpty()) {
            throw new UnauthorizedException("Invalid email.");
        }
        verificationCodeService.sendVerificationEmail(savedUser.get());
    }

}
