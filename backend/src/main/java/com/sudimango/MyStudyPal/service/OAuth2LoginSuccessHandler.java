package com.sudimango.MyStudyPal.service;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.sudimango.MyStudyPal.dto.response.LoginResponse;
import com.sudimango.MyStudyPal.entity.RefreshToken;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.RefreshTokenRepository;
import com.sudimango.MyStudyPal.repository.UserRepository;
import com.sudimango.MyStudyPal.service.auth.JwtService;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import tools.jackson.databind.ObjectMapper;

@Component
public class OAuth2LoginSuccessHandler implements AuthenticationSuccessHandler {

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
       
        OAuth2User oauth2User = (OAuth2User) authentication.getPrincipal();
        String email = oauth2User.getAttribute("email");

        User user = userRepository.findByUsername(email)
                                    .orElseThrow(() -> new RuntimeException("User not found after OAuth2 login"));

        String accessToken = jwtService.generateAccessToken(user.getUsername());
        String refreshToken = jwtService.generateRefreshToken(user.getUsername());

        RefreshToken refreshTokenObj = RefreshToken.builder()
                                        .token(refreshToken)
                                        .user(user)
                                        .build();
        refreshTokenRepository.save(refreshTokenObj);

        // Add refresh token to response as cookie
        Cookie cookie = new Cookie("refresh_token", refreshToken);
        cookie.setHttpOnly(true);
        cookie.setPath("/auth");
        cookie.setMaxAge(7 * 24 * 60 * 60);
        response.addCookie(cookie);

        LoginResponse loginResponse = new LoginResponse(accessToken);
        response.setContentType("application/json");
        response.setCharacterEncoding("UTF-8");
        response.getWriter().write(objectMapper.writeValueAsString(loginResponse));
    }
    
}
