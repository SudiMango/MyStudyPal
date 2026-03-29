package com.sudimango.MyStudyPal.service.auth;

import java.io.IOException;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.AuthDto;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.entity.VerificationCode;
import com.sudimango.MyStudyPal.exception.InvalidVerificationCodeException;
import com.sudimango.MyStudyPal.repository.VerificationCodeRepository;
import com.sudimango.MyStudyPal.service.other.EmailService;

import jakarta.mail.MessagingException;
import jakarta.transaction.Transactional;

@Service
public class VerificationCodeService {

    @Autowired
    private VerificationCodeRepository verificationCodeRepository;

    @Autowired
    private EmailService emailService;

    @Transactional
    public void sendVerificationEmail(User user) {
        if (user.isEnabled()) {
            throw new RuntimeException("User is already verified.");
        }

        try {
            String verificationCode = generateNewCodeForUser(user);
            String subject = "MyStudyPal — Email Verification Code";
            String htmlContent = loadHtmlTemplate(verificationCode);

            emailService.sendVerificationEmail(user.getUsername(), subject, htmlContent);
        } catch (MessagingException e) {
            throw new RuntimeException("Error sending verification email: " + e.getMessage());
        } catch (IOException e) {
            throw new RuntimeException("Error sending verification email: " + e.getMessage());
        }
    }

    public VerificationCode getVerificationCode(AuthDto.VerifyAccountRequest verifyAccountRequest) {
        Optional<VerificationCode> savedVerificationCode = verificationCodeRepository.findByCodeAndUser_Username(verifyAccountRequest.verificationCode(), verifyAccountRequest.username());
        if (savedVerificationCode.isEmpty()) {
            throw new InvalidVerificationCodeException("Invalid verification code.");
        }
        return savedVerificationCode.get();
    }

    public boolean isCodeValid(AuthDto.VerifyAccountRequest verifyAccountRequest, VerificationCode verificationCode) {
        System.out.println(verifyAccountRequest.username().equals(verificationCode.getUser().getUsername()));
        System.out.println(verifyAccountRequest.verificationCode().equals(verificationCode.getCode()));
        return verifyAccountRequest.username().equals(verificationCode.getUser().getUsername()) &&
                 verifyAccountRequest.verificationCode().equals(verificationCode.getCode()) && 
                 Instant.now().isBefore(verificationCode.getExpiryDate());
    }

    public void deleteVerificationCode(VerificationCode verificationCode) {
        verificationCodeRepository.delete(verificationCode);
    }

    private String loadHtmlTemplate(String verificationCode) throws IOException {
        ClassPathResource resource = new ClassPathResource("templates/verification_email.html");
        
        try (InputStream inputStream = resource.getInputStream()) {
            byte[] bytes = inputStream.readAllBytes();
            String htmlContent = new String(bytes, StandardCharsets.UTF_8);
            
            return String.format(htmlContent, verificationCode);
        }
    }

    private String generateNewCodeForUser(User user) {
        String code = generateVerificationCode();
        VerificationCode verificationCode = VerificationCode.builder()
                                                            .code(code)
                                                            .expiryDate(Instant.now().plusSeconds(15 * 60))
                                                            .user(user)
                                                            .build();

        if (!verificationCodeRepository.findByUser_Username(user.getUsername()).isEmpty()) {
            verificationCodeRepository.deleteByUser_Username(user.getUsername());
        }
        verificationCodeRepository.save(verificationCode);
        return code;
    }

    private String generateVerificationCode() {
        Random random = new Random();
        int code = random.nextInt(900000) + 100000;
        return String.valueOf(code);
    }
}
