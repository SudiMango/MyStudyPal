package com.sudimango.MyStudyPal.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sudimango.MyStudyPal.component.DocumentProcessor;
import com.sudimango.MyStudyPal.dto.response.DocumentUploadResponse;
import com.sudimango.MyStudyPal.entity.User;

import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    private DocumentProcessor documentProcessor;

    /**
     * Upload a document with its chunks into the database
     * 
     * @apiNote {@code POST /api/document/upload}
     * 
     * @param pdfFile - file to be uploaded
     * 
     * @return
     * {@code HTTP 201} - Document object and chunks created successfully
     * {@code HTTP 400} - Validation errors with request body {errors: []}
     * {@code HTTP 500} - Something went wrong while uploading the document {error: ""}
     */
    @PostMapping("/upload")
    public ResponseEntity<?> uploadDocument(@RequestParam("file") @NotNull(message = "File cannot be null") MultipartFile pdfFile, 
                                            @AuthenticationPrincipal User user) {
        try {
            DocumentUploadResponse response = documentProcessor.ingestPdfDocument(user.getUserId(), pdfFile);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

}
