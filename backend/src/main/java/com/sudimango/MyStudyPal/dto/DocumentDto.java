package com.sudimango.MyStudyPal.dto;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.Document;

public class DocumentDto {

    /**
     * Response
     */

    public record DocumentResponse(
        String documentId,
        String title,
        Instant createdAt,
        int numChunks
    ) {
        public DocumentResponse(Document document) {
            this(
                document.getDocumentId(),
                document.getTitle(),
                document.getCreatedAt(),
                document.getNumChunks()
            );
        }
    }
}
