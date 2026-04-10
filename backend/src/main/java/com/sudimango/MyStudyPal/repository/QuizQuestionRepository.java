package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.sudimango.MyStudyPal.entity.QuizQuestion;

public interface QuizQuestionRepository extends JpaRepository<QuizQuestion, String> {
        List<QuizQuestion> findByQuiz_QuizIdOrderByOrderIndexAsc(String quizId);

        @Modifying
        @Query("UPDATE QuizQuestion q SET q.orderIndex = q.orderIndex + 1 WHERE q.quiz.quizId = :quizId AND q.orderIndex >= :index")
        void incrementIndicesFrom(String quizId, int index);

        @Modifying
        @Query("UPDATE QuizQuestion q SET q.orderIndex = q.orderIndex - 1 WHERE q.quiz.quizId = :quizId AND q.orderIndex > :index")
        void decrementOrderIndices(String quizId, int index);
}
