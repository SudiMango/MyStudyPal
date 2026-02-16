package com.sudimango.MyStudyPal.service.quiz.attempt;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.dto.request.quiz.attempt.SubmitAttemptRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.attempt.SubmitAttemptResponse;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.repository.QuizAttemptRepository;
import com.sudimango.MyStudyPal.repository.QuizRepository;

import jakarta.transaction.Transactional;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    /**
     * Grades the entire quiz submission at once.
     */
    @Transactional
    public SubmitAttemptResponse submitAttempt(String quizId, SubmitAttemptRequest request) {
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new RuntimeException("Quiz not found: " + quizId));

        // Initialize the master Attempt record
        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .startedAt(Instant.now().minusSeconds(request.getTimeSpentSeconds()))
                .completedAt(Instant.now())
                .timeSpentSeconds(request.getTimeSpentSeconds())
                .score(BigDecimal.ZERO)
                .maxScore(BigDecimal.ZERO)
                .quizAttemptAnswers(new ArrayList<>())
                .build();

        // Create a lookup map for questions to avoid N+1 database queries
        Map<String, QuizQuestion> questionMap = quiz.getQuizQuestions().stream()
                .collect(Collectors.toMap(QuizQuestion::getQuestionId, q -> q));

        BigDecimal totalEarned = BigDecimal.ZERO;
        BigDecimal totalPossible = BigDecimal.ZERO;

        // Grade the batch of answers
        for (var submission : request.getAnswers()) {
            QuizQuestion question = questionMap.get(submission.getQuestionId());
            if (question == null) continue;

            boolean isCorrect = checkLogic(question, submission.getUserAnswer());
            BigDecimal points = isCorrect ? BigDecimal.valueOf(question.getPoints()) : BigDecimal.ZERO;

            QuizAttemptAnswer answerRecord = QuizAttemptAnswer.builder()
                    .quizAttempt(attempt)
                    .quizQuestion(question)
                    .userAnswer(submission.getUserAnswer())
                    .isCorrect(isCorrect)
                    .pointsEarned(points)
                    .build();

            attempt.getQuizAttemptAnswers().add(answerRecord);
            totalEarned = totalEarned.add(points);
            totalPossible = totalPossible.add(BigDecimal.valueOf(question.getPoints()));
        }

        attempt.setScore(totalEarned);
        attempt.setMaxScore(totalPossible);

        QuizAttempt saved = attemptRepository.save(attempt);
        return new SubmitAttemptResponse(saved);
    }

    public List<SubmitAttemptResponse> getAttemptsByQuiz(String quizId) {
        return attemptRepository.findByQuiz_QuizIdOrderByCompletedAtDesc(quizId)
                .stream()
                .map(SubmitAttemptResponse::new)
                .collect(Collectors.toList());
    }

    public SubmitAttemptResponse getOneAttempt(String attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new RuntimeException("Attempt record not found"));
        return new SubmitAttemptResponse(attempt);
    }

    /**
     * Internal grading logic for JSONB answers
     */
    private boolean checkLogic(QuizQuestion question, Object userAnswer) {
        if (userAnswer == null) return false;
        List<String> correct = question.getCorrectAnswers();

        // Case: Multi-select (User sent a List)
        if (userAnswer instanceof List) {
            List<?> userList = (List<?>) userAnswer;
            if (userList.size() != correct.size()) return false;
            return userList.stream()
                    .map(Object::toString)
                    .allMatch(correct::contains);
        }

        // Case: Single-choice or Short-answer (User sent a String/Number)
        return correct.contains(userAnswer.toString());
    }
}