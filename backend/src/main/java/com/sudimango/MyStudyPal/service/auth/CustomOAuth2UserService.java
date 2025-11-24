package com.sudimango.MyStudyPal.service.auth;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.OAuth2Error;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.entity.AuthProvider;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.UserRepository;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);
        String email = oAuth2User.getAttribute("email");

        if (email == null) {
            throw new OAuth2AuthenticationException(
                new OAuth2Error("invalid_user_info", "Email not found from OAuth2 provider.", null)
            );
        }

        Optional<User> existingUserOpt = userRepository.findByUsername(email);
        if (existingUserOpt.isPresent()) {
            User existingUser = existingUserOpt.get();

            if (existingUser.getAuthProvider() != AuthProvider.GOOGLE) {
                throw new OAuth2AuthenticationException(
                    new OAuth2Error("invalid_provider", "Account registered with a different login method.", null)
                );
            }
        } else {
            User newUser = User.builder()
                .username(email)
                .password("")
                .authProvider(AuthProvider.GOOGLE)
                .isEnabled(true)
                .build();
            userRepository.save(newUser);
        }

        return oAuth2User;
    }

}
