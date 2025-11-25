package com.sudimango.MyStudyPal.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.UserRepository;
import com.sudimango.MyStudyPal.service.auth.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
       
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        User user = userRepository.findByUsername(email)
                                    .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login"));

        String accessToken = jwtService.generateAccessToken(user.getUsername());
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        ResponseCookie refreshTokenCookie = refreshTokenService.createRefreshTokenCookie(refreshToken, response);
        response.addHeader("Set-Cookie", refreshTokenCookie.toString());
        refreshTokenService.saveRefreshTokenForUser(user, refreshToken);

        String targetUrl = "http://localhost:3000/login/oauth/callback?token=" + accessToken;
        response.sendRedirect(targetUrl);
    }
    
}
