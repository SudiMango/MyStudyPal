package com.sudimango.MyStudyPal.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.sudimango.MyStudyPal.dto.DocumentDto;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.service.other.DocumentService;

import jakarta.validation.constraints.NotNull;

@RestController
@RequestMapping("/api/document")
public class DocumentController {

    @Autowired
    private DocumentService documentProcessor;

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
    @PostMapping("/upload/{studySetId}")
    public ResponseEntity<?> uploadDocument(@PathVariable String studySetId,
                                            @RequestParam("files") @NotNull(message = "File cannot be null") MultipartFile[] pdfFiles, 
                                            @AuthenticationPrincipal User user) {
        try {
            int chunkIndex = 0;
            for (MultipartFile pdfFile : pdfFiles) {
                documentProcessor.ingestPdfDocument(
                    user.getUserId(), 
                    studySetId, 
                    pdfFile,
                    chunkIndex
                );
                chunkIndex++;
            }
            
            return ResponseEntity.status(HttpStatus.NO_CONTENT).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to upload documents: " + e.getMessage());
        }
    }

    /**
     * Get all documents for a specific study set
     */
    @GetMapping("/get-all/{studySetId}")
    public ResponseEntity<?> getAllDocumentsForStudySet(@PathVariable String studySetId) {
        try {
            List<DocumentDto.DocumentResponse> documents = documentProcessor.getAllDocumentsForStudySet(studySetId);
            return ResponseEntity.ok(documents);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to fetch documents: " + e.getMessage());
        }
    }

    /**
     * Delete a specific document
     */
    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable String documentId) {
        try {
            documentProcessor.deleteDocument(documentId);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("Failed to delete document: " + e.getMessage());
        }
    }

}
