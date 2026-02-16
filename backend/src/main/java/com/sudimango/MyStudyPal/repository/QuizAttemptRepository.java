package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sudimango.MyStudyPal.entity.QuizAttempt;

public interface QuizAttemptRepository extends JpaRepository<QuizAttempt, String> {
    List<QuizAttempt> findByQuiz_QuizIdOrderByCompletedAtDesc(String quizId);
}
