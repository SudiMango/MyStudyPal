package com.sudimango.MyStudyPal.service.other;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sudimango.MyStudyPal.repository.DocumentRepository;
import com.sudimango.MyStudyPal.repository.FlashcardRepository;
import com.sudimango.MyStudyPal.repository.FlashcardSetRepository;
import com.sudimango.MyStudyPal.repository.QuizAttemptRepository;
import com.sudimango.MyStudyPal.repository.QuizRepository;
import com.sudimango.MyStudyPal.repository.StudySetRepository;

@Service
public class ResourceAuthorizationService {

    @Autowired
    private StudySetRepository studySetRepository;

    @Autowired
    private FlashcardSetRepository flashcardSetRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private QuizRepository quizRepository;

    @Autowired
    private QuizAttemptRepository quizAttemptRepository;

    @Autowired
    private DocumentRepository documentRepository;

    /**
     * Check if a user owns a study set.
     * 
     * @param studySetId - ID of the study set
     * @param userId - ID of the user
     * @return true if the user owns the study set, false otherwise
     */
    public boolean canAccessStudySet(String studySetId, String userId) {
        return studySetRepository.existsByStudySetIdAndUser_UserId(studySetId, userId);
    }

    /**
     * Check if a user owns a flashcard set (through study set).
     * 
     * @param flashcardSetId - ID of the flashcard set
     * @param userId - ID of the user
     * @return true if the user owns the flashcard set, false otherwise
     */
    public boolean canAccessFlashcardSet(String flashcardSetId, String userId) {
        return flashcardSetRepository.existsByFlashcardSetIdAndStudySet_User_UserId(flashcardSetId, userId);
    }

    /**
     * Check if a user owns a flashcard (through flashcard set → study set).
     * 
     * @param flashcardId - ID of the flashcard
     * @param userId - ID of the user
     * @return true if the user owns the flashcard, false otherwise
     */
    public boolean canAccessFlashcard(String flashcardId, String userId) {
        return flashcardRepository.existsByFlashcardIdAndFlashcardSet_StudySet_User_UserId(flashcardId, userId);
    }

    /**
     * Check if a user owns a quiz (through study set).
     * 
     * @param quizId - ID of the quiz
     * @param userId - ID of the user
     * @return true if the user owns the quiz, false otherwise
     */
    public boolean canAccessQuiz(String quizId, String userId) {
        return quizRepository.existsByQuizIdAndStudySet_User_UserId(quizId, userId);
    }

    /**
     * Check if a user owns a quiz attempt (through quiz → study set).
     * 
     * @param attemptId - ID of the quiz attempt
     * @param userId - ID of the user
     * @return true if the user owns the quiz attempt, false otherwise
     */
    public boolean canAccessQuizAttempt(String attemptId, String userId) {
        return quizAttemptRepository.existsByAttemptIdAndQuiz_StudySet_User_UserId(attemptId, userId);
    }

    /**
     * Check if a user owns a document.
     * 
     * @param documentId - ID of the document
     * @param userId - ID of the user
     * @return true if the user owns the document, false otherwise
     */
    public boolean canAccessDocument(String documentId, String userId) {
        return documentRepository.existsByDocumentIdAndUser_UserId(documentId, userId);
    }
}
