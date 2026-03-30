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
@RequestMapping("/document")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    /**
     * Upload a document with its chunks into the database
     * 
     * @apiNote {@code POST /document/{studySetId}}
     * 
     * @param studySetId - id of study set
     * @param pdfFiles - files to be uploaded
     * @param user - current logged in user
     * 
     * @return
     * {@code HTTP 201} - Document object and chunks created successfully
     * 
     * @throws
     * {@code HTTP 404} - Study set not found
     * {@code HTTP 400} - Validation errors with request body
     */
    @PostMapping("/{studySetId}")
    public ResponseEntity<?> uploadDocument(@PathVariable String studySetId,
            @RequestParam("files") @NotNull(message = "File cannot be null") MultipartFile[] pdfFiles,
            @AuthenticationPrincipal User user) {

        documentService.ingestPdfDocuments(user.getUserId(), studySetId, pdfFiles);
        return ResponseEntity.status(HttpStatus.CREATED).body(null);
    }

    /**
     * Get all the documents for a study set
     * 
     * @apiNote {@code Get /document/{studySetId}}
     * 
     * @param studySetId - id of study set
     * 
     * @return
     * {@code DocumentResponse HTTP 200} - Documents retrieved successfully
     * 
     * @throws
     * {@code HTTP 404} - Study set/user not found
     */
    @GetMapping("/{studySetId}")
    public ResponseEntity<?> getAllDocumentsForStudySet(@PathVariable String studySetId) {
        List<DocumentDto.DocumentResponse> documents = documentService.getAllDocumentsForStudySet(studySetId);
        return ResponseEntity.ok(documents);
    }

    /**
     * Delete a document
     * 
     * @apiNote {@code POST /document/{documentId}}
     * 
     * @param documentId - id of document
     * 
     * @return
     * {@code HTTP 200} - Document deleted successfully
     * 
     * @throws
     * {@code HTTP 404} - Document not found
     */
    @DeleteMapping("/{documentId}")
    public ResponseEntity<?> deleteDocument(@PathVariable String documentId) {
        documentService.deleteDocument(documentId);
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
    }

}
