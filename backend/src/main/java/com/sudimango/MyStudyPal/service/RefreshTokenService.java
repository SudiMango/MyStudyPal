package com.sudimango.MyStudyPal.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseCookie;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.entity.RefreshToken;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.RefreshTokenRepository;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

@Service
public class RefreshTokenService {

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    public void saveRefreshTokenForUser(User user, String refreshToken) {
        RefreshToken refreshTokenObj = RefreshToken.builder()
                                            .token(refreshToken)
                                            .user(user)
                                            .build();
        refreshTokenRepository.save(refreshTokenObj);
    }

    public void deleteRefreshToken(HttpServletRequest request, HttpServletResponse response) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("refresh_token".equals(cookie.getName())) {
                    refreshTokenRepository.deleteById(cookie.getValue());
                    ResponseCookie deleteCookie = ResponseCookie.from("refresh_token", "")
                        .httpOnly(true)
                        .secure(false)
                        .sameSite("Lax")
                        .path("/")
                        .maxAge(0)
                        .build();
                    response.addHeader("Set-Cookie", deleteCookie.toString());
                    break;
                }
            }
        }
    }

    public boolean isRefreshTokenFoundInDatabase(String refreshToken) {
        Optional<RefreshToken> refreshTokenObj = refreshTokenRepository.findById(refreshToken);
        return refreshTokenObj.isPresent();
    }

}
