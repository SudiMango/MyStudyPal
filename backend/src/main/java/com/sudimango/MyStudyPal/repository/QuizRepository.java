package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.sudimango.MyStudyPal.entity.Quiz;

public interface QuizRepository extends JpaRepository<Quiz, String> {
    List<Quiz> findAllByStudySet_StudySetId(String studySetId);
    
    boolean existsByQuizIdAndStudySet_User_UserId(String quizId, String userId);
}
