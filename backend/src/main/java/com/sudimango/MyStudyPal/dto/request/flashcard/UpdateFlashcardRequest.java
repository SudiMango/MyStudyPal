package com.sudimango.MyStudyPal.dto.request.flashcard;

import lombok.Getter;

@Getter
public class UpdateFlashcardRequest {
    private String question;
    private String answer;
    private String hint;
}
