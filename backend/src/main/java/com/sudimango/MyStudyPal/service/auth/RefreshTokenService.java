package com.sudimango.MyStudyPal.service.auth;

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

    @org.springframework.beans.factory.annotation.Value("${app.cookie.secure}")
    private boolean isCookieSecure;

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
                        .secure(isCookieSecure)
                        .sameSite(isCookieSecure ? "None" : "Lax")
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
        Optional<RefreshToken> refreshTokenObj = refreshTokenRepository.findByToken(refreshToken);
        return refreshTokenObj.isPresent();
    }

    public ResponseCookie createRefreshTokenCookie(String refreshToken, HttpServletResponse response) {
        ResponseCookie refreshTokenCookie = ResponseCookie.from("refresh_token", refreshToken)
                .httpOnly(true)
                .secure(isCookieSecure)
                .sameSite(isCookieSecure ? "None" : "Lax")
                .path("/")
                .maxAge(JwtService.REFRESH_TOKEN_EXPIRATION)
                .build();
            
        return refreshTokenCookie;
    }

}
