package com.sudimango.MyStudyPal.service.study.quiz;

import java.time.Instant;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.request.quiz.attempt.AnswerSubmission;
import com.sudimango.MyStudyPal.dto.request.quiz.attempt.CreateQuizAttemptRequest;
import com.sudimango.MyStudyPal.dto.response.quiz.attempt.CreateQuizAttemptResponse;
import com.sudimango.MyStudyPal.dto.response.quiz.attempt.QuizAttemptDetails;
import com.sudimango.MyStudyPal.dto.response.quiz.attempt.ShortAnswerGradingResponse;
import com.sudimango.MyStudyPal.entity.QuestionType;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.repository.QuizAttemptRepository;
import com.sudimango.MyStudyPal.repository.QuizRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;

import jakarta.transaction.Transactional;

@Service
public class QuizAttemptService {

    @Autowired
    private QuizAttemptRepository attemptRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private GeminiClient geminiClient;

    private ObjectMapper mapper;

    public QuizAttemptService() {
        mapper = new ObjectMapper();
    }

    @Transactional
    public CreateQuizAttemptResponse submitAttempt(String quizId, CreateQuizAttemptRequest request) throws JsonProcessingException, JsonMappingException {

        // Find quiz to grade
        Quiz quiz = quizRepository.findById(quizId)
            .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        // Create quiz attempt
        QuizAttempt attempt = QuizAttempt.builder()
                .quiz(quiz)
                .startedAt(Instant.now().minusSeconds(request.getTimeSpentSeconds()))
                .completedAt(Instant.now())
                .score(0.0)
                .maxScore(0.0)
                .quizAttemptAnswers(new ArrayList<>())
                .build();

        // Get all valid questions
        Map<String, QuizQuestion> questionMap = quiz.getQuizQuestions().stream()
                .collect(Collectors.toMap(QuizQuestion::getQuestionId, q -> q));

        double totalEarned = 0.0;
        double totalPossible = 0.0;
        Map<QuizQuestion, AnswerSubmission> qtoa = new HashMap<>(); 

        // Handle submitted answers
        for (AnswerSubmission submission : request.getAnswers()) {
            QuizQuestion question = questionMap.get(submission.getQuestionId());
            if (question == null) continue;

            if (question.getQuestionType() == QuestionType.SHORT_ANSWER) {
                qtoa.put(question, submission);
            } else {
                double pointsToGive = getPointsForAnswer(question, submission.getUserAnswer());

                QuizAttemptAnswer answerRecord = QuizAttemptAnswer.builder()
                        .quizAttempt(attempt)
                        .quizQuestion(question)
                        .userAnswer(submission.getUserAnswer())
                        .isCorrect(pointsToGive > 0.0 ? true : false)
                        .pointsEarned(pointsToGive)
                        .build();
                
                attempt.getQuizAttemptAnswers().add(answerRecord);
                totalEarned += pointsToGive;
                totalPossible += question.getPoints();
            }
        }

        // Save unanswered questions as 0-point records
        Set<String> submittedIds = request.getAnswers().stream()
            .map(AnswerSubmission::getQuestionId)
            .collect(Collectors.toSet());

        for (QuizQuestion question : quiz.getQuizQuestions()) {
            if (submittedIds.contains(question.getQuestionId())) continue;

            QuizAttemptAnswer unanswered = QuizAttemptAnswer.builder()
                    .quizAttempt(attempt)
                    .quizQuestion(question)
                    .userAnswer(List.of())
                    .isCorrect(false)
                    .pointsEarned(0.0)
                    .build();

            attempt.getQuizAttemptAnswers().add(unanswered);
            totalPossible += question.getPoints();
        }

        AbstractMap.SimpleEntry<Double, Double> shortAnswerGrades = gradeShortAnswerQuestions(qtoa, attempt);
        attempt.setScore(totalEarned + shortAnswerGrades.getKey());
        attempt.setMaxScore(totalPossible + shortAnswerGrades.getKey());

        QuizAttempt saved = attemptRepository.save(attempt);
        return new CreateQuizAttemptResponse(saved.getAttemptId());
    }

    public QuizAttemptDetails getOneAttempt(String attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + attemptId));

        return new QuizAttemptDetails(attempt);
    }


    /**
     * 
     * Private functions
     * 
     */


    private double getPointsForAnswer(QuizQuestion question, Object userAnswer) {
        if (userAnswer == null) {
            return 0.0;
        }

        List<String> correctAnswers = question.getCorrectAnswers();
        List<String> userAnswers = convertUserAnswerToList(userAnswer);
        double maxPoints = question.getPoints();
        double ret = 0.0;

        if (question.getQuestionType() == QuestionType.MULTIPLE_ANSWER) {
            ret = getScoreForMultipleAnswer(correctAnswers, userAnswers, maxPoints);
        } else if (question.getQuestionType() == QuestionType.MULTIPLE_CHOICE) {
            ret = getScoreForMultipleChoice(correctAnswers, userAnswers, maxPoints);
        } else if (question.getQuestionType() == QuestionType.TRUE_FALSE) {
            ret = getScoreForTrueFalse(correctAnswers, userAnswers, maxPoints);
        }

        return ret;
    }

    private List<String> convertUserAnswerToList(Object userAnswer) {
        if (!(userAnswer instanceof List<?>)) {
            throw new IllegalArgumentException("Expected a list, but received: " + userAnswer.getClass().getName());
        }

        List<?> rawList = (List<?>) userAnswer;
        List<String> result = new ArrayList<>();

        for (Object item : rawList) {
            if (item instanceof String) {
                result.add((String) item);
            } else {
                throw new IllegalArgumentException("List contains non-string element: " + item);
            }
        }

        return result;
    }

    private double getScoreForTrueFalse(List<String> correctAnswers, List<String> userAnswers, double maxPoints) {
        if (userAnswers.isEmpty() || correctAnswers.isEmpty()) {
            return 0.0;
        }

        if (userAnswers.get(0).equals(correctAnswers.get(0))) {
            return maxPoints;
        }

        return 0.0;
    }

    private double getScoreForMultipleAnswer(List<String> correctAnswers, List<String> userAnswers, double maxPoints) {
        if (userAnswers.isEmpty() || correctAnswers.isEmpty()) {
            return 0.0;
        }

        double pointsPerCorrectAnswer = maxPoints / correctAnswers.size();
        double ret = 0;

        for (String a : userAnswers) {
            if (correctAnswers.contains(a)) {
                ret += pointsPerCorrectAnswer;
            }
        }

        return Math.clamp(ret, 0, maxPoints);
    }

    private double getScoreForMultipleChoice(List<String> correctAnswers, List<String> userAnswers, double maxPoints) {
        if (userAnswers.isEmpty() || correctAnswers.isEmpty()) {
            return 0.0;
        }

        if (userAnswers.get(0).equals(correctAnswers.get(0))) {
            return maxPoints;
        }

        return 0.0;
    }

    private AbstractMap.SimpleEntry<Double, Double> gradeShortAnswerQuestions(Map<QuizQuestion, AnswerSubmission> qtoa, QuizAttempt attempt) throws JsonProcessingException, JsonMappingException {
        double totalEarned = 0.0;
        double totalPossible = 0.0;

        List<String> questions = new ArrayList<>();
        List<String> correctAnswers = new ArrayList<>();
        List<String> userAnswers = new ArrayList<>();
        List<Double> maxPoints = new ArrayList<>();
        for (Map.Entry<QuizQuestion, AnswerSubmission> entry : qtoa.entrySet()) {
            QuizQuestion key = entry.getKey();
            AnswerSubmission value = entry.getValue();

            questions.add(key.getQuestionText());
            correctAnswers.add(key.getCorrectAnswers().get(0));
            userAnswers.add(convertUserAnswerToList(value.getUserAnswer()).get(0));
            maxPoints.add(key.getPoints());
            totalPossible += key.getPoints();
        }

        // Handle AI response for grading short answers
        String response = geminiClient.markShortAnswerQuestions(questions, correctAnswers, userAnswers, maxPoints);
        if (response == null || response.trim().equals("")) {
            throw new RuntimeException("AI response was null.");
        }

        System.out.println(response);
        
        String cleaned = response
            .replace("```json", "")
            .replace("```", "")
            .trim();

        List<ShortAnswerGradingResponse> grades = mapper.readValue(cleaned,
            new TypeReference<List<ShortAnswerGradingResponse>>() {
        });

        int gradeIndex = 0;
        for (Map.Entry<QuizQuestion, AnswerSubmission> entry : qtoa.entrySet()) {
            QuizQuestion key = entry.getKey();
            AnswerSubmission value = entry.getValue();

            QuizAttemptAnswer answerRecord = QuizAttemptAnswer.builder()
                        .quizAttempt(attempt)
                        .quizQuestion(key)
                        .userAnswer(value.getUserAnswer())
                        .isCorrect(grades.get(gradeIndex).getScore() > 0.0 ? true : false)
                        .pointsEarned(grades.get(gradeIndex).getScore())
                        .build();

            attempt.getQuizAttemptAnswers().add(answerRecord);
            totalEarned += grades.get(gradeIndex).getScore();
            gradeIndex++;
        }

        return new AbstractMap.SimpleEntry<>(totalEarned, totalPossible);
    }
}