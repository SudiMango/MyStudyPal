package com.sudimango.MyStudyPal.service.study.quiz;

import java.time.Instant;
import java.util.AbstractMap;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.AnswerSubmission;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.CreateQuizAttemptRequest;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.CreateQuizAttemptResponse;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.QuizAttemptAnswerResponse;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.QuizAttemptResponse;
import com.sudimango.MyStudyPal.dto.QuizAttemptDto.ShortAnswerGradingResponse;
import com.sudimango.MyStudyPal.entity.QuestionType;
import com.sudimango.MyStudyPal.entity.Quiz;
import com.sudimango.MyStudyPal.entity.QuizAttempt;
import com.sudimango.MyStudyPal.entity.QuizAttemptAnswer;
import com.sudimango.MyStudyPal.entity.QuizAttemptQuestion;
import com.sudimango.MyStudyPal.entity.QuizQuestion;
import com.sudimango.MyStudyPal.exception.AiJsonException;
import com.sudimango.MyStudyPal.exception.EmptyAiResponseException;
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
    @PreAuthorize("@resourceAuthorizationService.canAccessQuiz(#quizId, authentication.principal.userId)")
    public CreateQuizAttemptResponse submitAttempt(String quizId, CreateQuizAttemptRequest request) {

        // Find quiz to grade
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        // Create quiz attempt
        QuizAttempt attempt = QuizAttempt.builder().quiz(quiz)
                .startedAt(Instant.now().minusSeconds(request.timeSpentSeconds())).completedAt(Instant.now()).score(0.0)
                .maxScore(0.0).quizAttemptAnswers(new ArrayList<>()).quizAttemptQuestions(new ArrayList<>()).build();

        // Get all valid questions
        Map<String, QuizQuestion> questionMap = quiz.getQuizQuestions().stream()
                .collect(Collectors.toMap(QuizQuestion::getQuestionId, q -> q));
        Map<String, QuizAttemptQuestion> attemptQuestionMap = createQuestionSnapshots(attempt, quiz.getQuizQuestions());

        double totalEarned = 0.0;
        double totalPossible = 0.0;
        List<AbstractMap.SimpleEntry<QuizAttemptQuestion, QuizAttemptDto.AnswerSubmission>> qtoa = new ArrayList<>();
        List<AnswerSubmission> submittedAnswers = request.answers() == null ? List.of() : request.answers();

        // Handle submitted answers
        for (QuizAttemptDto.AnswerSubmission submission : submittedAnswers) {
            QuizQuestion question = questionMap.get(submission.questionId());
            if (question == null)
                continue;
            QuizAttemptQuestion attemptQuestion = attemptQuestionMap.get(submission.questionId());

            if (question.getQuestionType() == QuestionType.SHORT_ANSWER) {
                qtoa.add(new AbstractMap.SimpleEntry<>(attemptQuestion, submission));
            } else {
                double pointsToGive = roundToTwoDecimals(getPointsForAnswer(attemptQuestion, submission.userAnswer()));

                QuizAttemptAnswer answerRecord = QuizAttemptAnswer.builder().quizAttempt(attempt)
                        .quizAttemptQuestion(attemptQuestion).userAnswer(submission.userAnswer())
                        .isCorrect(pointsToGive > 0.0 ? true : false).pointsEarned(pointsToGive).build();

                attempt.getQuizAttemptAnswers().add(answerRecord);
                totalEarned += pointsToGive;
                totalPossible += question.getPoints();
            }
        }

        // Save unanswered questions as 0-point records
        Set<String> submittedIds = submittedAnswers.stream().map(QuizAttemptDto.AnswerSubmission::questionId)
                .collect(Collectors.toSet());

        for (QuizQuestion question : quiz.getQuizQuestions()) {
            if (submittedIds.contains(question.getQuestionId())) {
                continue;
            }

            QuizAttemptQuestion attemptQuestion = attemptQuestionMap.get(question.getQuestionId());

            QuizAttemptAnswer unanswered = QuizAttemptAnswer.builder().quizAttempt(attempt)
                    .quizAttemptQuestion(attemptQuestion).userAnswer(List.of()).isCorrect(false).pointsEarned(0.0)
                    .build();

            attempt.getQuizAttemptAnswers().add(unanswered);
            totalPossible += question.getPoints();
        }

        // Handle short answer grading
        double shortAnswerEarned = 0.0;
        double shortAnswerPossible = 0.0;

        if (!qtoa.isEmpty()) {
            AbstractMap.SimpleEntry<Double, Double> shortAnswerGrades = gradeShortAnswerQuestions(qtoa, attempt);
            shortAnswerEarned = shortAnswerGrades.getKey();
            shortAnswerPossible = shortAnswerGrades.getValue();
        }

        attempt.setScore(roundToTwoDecimals(totalEarned + shortAnswerEarned));
        attempt.setMaxScore(totalPossible + shortAnswerPossible);

        QuizAttempt saved = attemptRepository.save(attempt);
        return new CreateQuizAttemptResponse(saved.getAttemptId());
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessQuizAttempt(#attemptId, authentication.principal.userId)")
    public QuizAttemptResponse getOneAttempt(String attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + attemptId));

        return new QuizAttemptResponse(attempt);
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessQuiz(#quizId, authentication.principal.userId)")
    public List<QuizAttemptResponse> getAllAttemptsForQuiz(String quizId) {
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz not found with id: " + quizId));

        List<QuizAttemptResponse> response = new ArrayList<>();
        for (QuizAttempt q : quiz.getQuizAttempts()) {
            response.add(new QuizAttemptResponse(q));
        }

        return response;
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessQuizAttempt(#attemptId, authentication.principal.userId)")
    public List<QuizAttemptAnswerResponse> getAttemptAnswers(String attemptId) {
        QuizAttempt attempt = attemptRepository.findById(attemptId)
                .orElseThrow(() -> new ResourceNotFoundException("Quiz attempt not found with id: " + attemptId));

        return attempt.getQuizAttemptAnswers().stream()
                .sorted(Comparator.comparingInt(qa -> qa.getQuizAttemptQuestion().getOrderIndex()))
                .map(QuizAttemptAnswerResponse::new).collect(Collectors.toList());
    }

    /**
     * 
     * Private functions
     * 
     */

    private double getPointsForAnswer(QuizAttemptQuestion question, Object userAnswer) {
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
        double totalScore = 0;

        for (String answer : userAnswers) {
            if (correctAnswers.contains(answer)) {
                totalScore += pointsPerCorrectAnswer;
            } else {
                totalScore -= pointsPerCorrectAnswer;
            }
        }

        return Math.clamp(totalScore, 0.0, maxPoints);
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

    private AbstractMap.SimpleEntry<Double, Double> gradeShortAnswerQuestions(
            List<AbstractMap.SimpleEntry<QuizAttemptQuestion, AnswerSubmission>> qtoa, QuizAttempt attempt) {
        double totalEarned = 0.0;
        double totalPossible = 0.0;

        List<String> questions = new ArrayList<>();
        List<String> correctAnswers = new ArrayList<>();
        List<String> userAnswers = new ArrayList<>();
        List<String> hints = new ArrayList<>();
        List<Double> maxPoints = new ArrayList<>();
        for (AbstractMap.SimpleEntry<QuizAttemptQuestion, QuizAttemptDto.AnswerSubmission> entry : qtoa) {
            QuizAttemptQuestion key = entry.getKey();
            QuizAttemptDto.AnswerSubmission value = entry.getValue();

            questions.add(key.getQuestionText());
            correctAnswers.add(key.getCorrectAnswers().get(0));
            userAnswers.add(convertUserAnswerToList(value.userAnswer()).get(0));
            hints.add(key.getHint());
            maxPoints.add(key.getPoints());
            totalPossible += key.getPoints();
        }

        // Handle AI response for grading short answers
        String response = geminiClient.markShortAnswerQuestions(questions, correctAnswers, userAnswers, hints,
                maxPoints);
        if (response == null || response.trim().equals("")) {
            throw new EmptyAiResponseException(
                    "AI response for grading short answer questions for the quiz was empty.");
        }

        System.out.println(response);

        String cleaned = response.replace("```json", "").replace("```", "").trim();

        List<ShortAnswerGradingResponse> grades = new ArrayList<>();
        try {
            grades = mapper.readValue(cleaned, new TypeReference<List<ShortAnswerGradingResponse>>() {
            });
        } catch (JsonProcessingException e) {
            throw new AiJsonException("AI didn't return proper json format.");
        }

        int gradeIndex = 0;
        for (AbstractMap.SimpleEntry<QuizAttemptQuestion, AnswerSubmission> entry : qtoa) {
            QuizAttemptQuestion key = entry.getKey();
            AnswerSubmission value = entry.getValue();
            double roundedScore = roundToTwoDecimals(grades.get(gradeIndex).score());

            QuizAttemptAnswer answerRecord = QuizAttemptAnswer.builder().quizAttempt(attempt).quizAttemptQuestion(key)
                    .userAnswer(value.userAnswer()).isCorrect(roundedScore > 0.0 ? true : false)
                    .pointsEarned(roundedScore).build();

            attempt.getQuizAttemptAnswers().add(answerRecord);
            totalEarned += roundedScore;
            gradeIndex++;
        }

        return new AbstractMap.SimpleEntry<>(totalEarned, totalPossible);
    }

    private double roundToTwoDecimals(double value) {
        return Math.round(value * 100.0) / 100.0;
    }

    private Map<String, QuizAttemptQuestion> createQuestionSnapshots(QuizAttempt attempt,
            List<QuizQuestion> questions) {
        return questions.stream().collect(Collectors.toMap(QuizQuestion::getQuestionId, question -> {
            QuizAttemptQuestion snapshot = QuizAttemptQuestion.builder().quizAttempt(attempt)
                    .originalQuestionId(question.getQuestionId()).questionType(question.getQuestionType())
                    .questionText(question.getQuestionText()).options(question.getOptions())
                    .correctAnswers(question.getCorrectAnswers()).hint(question.getHint()).points(question.getPoints())
                    .orderIndex(question.getOrderIndex()).build();
            attempt.getQuizAttemptQuestions().add(snapshot);
            return snapshot;
        }));
    }
}
