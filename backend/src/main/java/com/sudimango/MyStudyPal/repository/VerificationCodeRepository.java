package com.sudimango.MyStudyPal.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sudimango.MyStudyPal.entity.VerificationCode;

@Repository
public interface VerificationCodeRepository extends JpaRepository<VerificationCode, String> {
    Optional<VerificationCode> findByCodeAndUser_Username(String code, String username);
    Optional<VerificationCode> findByUser_Username(String username);
    void deleteByUser_Username(String username);
}
