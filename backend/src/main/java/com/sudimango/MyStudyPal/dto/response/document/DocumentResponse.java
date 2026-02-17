package com.sudimango.MyStudyPal.dto.response.document;

import java.time.Instant;

import com.sudimango.MyStudyPal.entity.Document;

import lombok.Getter;

@Getter
public class DocumentResponse {
    private String documentId;
    private String title;
    private Instant createdAt;
    private int numChunks;

    public DocumentResponse(Document document) {
        this.documentId = document.getDocumentId();
        this.title = document.getTitle();
        this.createdAt = document.getCreatedAt();
        this.numChunks = document.getNumChunks();
    }
}
