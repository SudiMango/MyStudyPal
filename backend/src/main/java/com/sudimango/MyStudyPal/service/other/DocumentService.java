package com.sudimango.MyStudyPal.service.other;

import java.io.File;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.google.genai.errors.ClientException;
import com.sudimango.MyStudyPal.component.GeminiClient;
import com.sudimango.MyStudyPal.dto.DocumentDto;
import com.sudimango.MyStudyPal.entity.Document;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.exception.ResourceNotFoundException;
import com.sudimango.MyStudyPal.exception.TooManyRequestsException;
import com.sudimango.MyStudyPal.exception.UnsupportedFormatException;
import com.sudimango.MyStudyPal.repository.DocumentChunkRepository;
import com.sudimango.MyStudyPal.repository.DocumentRepository;
import com.sudimango.MyStudyPal.repository.StudySetRepository;
import com.sudimango.MyStudyPal.repository.UserRepository;

@Component
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private DocumentChunkRepository documentChunkRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private StudySetRepository studySetRepository;

    @Autowired
    private GeminiClient geminiClient;

    private static final int OVERLAP_WORDS = 100;
    private static final int MIN_PAGE_WORDS = 300;

    public void ingestPdfDocuments(String userId, String studySetId, MultipartFile[] pdfFiles) {
        for (MultipartFile pdfFile : pdfFiles) {
            boolean isPdf = "application/pdf".equals(pdfFile.getContentType()) || (pdfFile.getOriginalFilename() != null
                    && pdfFile.getOriginalFilename().toLowerCase().endsWith(".pdf")) && !pdfFile.isEmpty();
            if (!isPdf) {
                throw new UnsupportedFormatException("Attached files might be empty or not a PDF.");
            }
        }

        for (MultipartFile pdfFile : pdfFiles) {
            ingestPdfDocument(userId, studySetId, pdfFile);
        }
    }

    // Ingest PDF into database as chunks
    @Transactional
    public void ingestPdfDocument(String userId, String studySetId, MultipartFile pdfFile) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        StudySet studySet = studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Study set not found: " + studySetId));

        String tempPath = System.getProperty("java.io.tmpdir") + "/" + System.nanoTime() + ".pdf";

        try {
            pdfFile.transferTo(new File(tempPath));
        } catch (IllegalStateException | IOException e) {
            throw new RuntimeException(
                    "Something went wrong while ingesting pdf file. Please try again after some time.");
        }

        Document doc = null;
        try {
            List<String> chunks = extractAndChunkPdf(tempPath);

            doc = Document.builder().title(pdfFile.getOriginalFilename()).numChunks(chunks.size())
                    .size(pdfFile.getSize()).studySet(studySet).user(user).build();
            Document savedDoc = documentRepository.save(doc);

            int chunkIdx = 0;
            for (String content : chunks) {
                String vectorStr = geminiClient.generateAndFormatEmbedding(content);
                documentChunkRepository.saveChunkWithEmbedding(savedDoc.getDocumentId(), content, vectorStr, chunkIdx);
            }
        } catch (Exception e) {
            if (e instanceof ClientException) {
                throw new TooManyRequestsException(e.getMessage());
            }

            throw new RuntimeException(
                    "Something went wrong while ingesting pdf file. Please try again after some time.");
        } finally {
            new File(tempPath).delete();
        }

        if (doc == null) {
            throw new RuntimeException(
                    "Something went wrong while ingesting pdf file. Please try again after some time.");
        }
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessStudySet(#studySetId, authentication.principal.userId)")
    public List<DocumentDto.DocumentResponse> getAllDocumentsForStudySet(String studySetId) {
        studySetRepository.findById(studySetId)
                .orElseThrow(() -> new ResourceNotFoundException("Study set not found with id " + studySetId));
        List<Document> documents = documentRepository.findByStudySet_StudySetId(studySetId);

        List<DocumentDto.DocumentResponse> responses = new ArrayList<>();
        for (Document d : documents) {
            responses.add(new DocumentDto.DocumentResponse(d));
        }

        return responses;
    }

    @PreAuthorize("@resourceAuthorizationService.canAccessDocument(#documentId, authentication.principal.userId)")
    public void deleteDocument(String documentId) {
        documentRepository.findById(documentId)
                .orElseThrow(() -> new ResourceNotFoundException("Document not found with id " + documentId));
        documentRepository.deleteById(documentId);
    }

    /**
     * 
     * Private functions
     * 
     */

    // Extract text page by page, merge small pages, and add overlap
    private List<String> extractAndChunkPdf(String pdfPath) throws Exception {
        PDDocument document = Loader.loadPDF(new File(pdfPath));
        List<String> pageTexts = new ArrayList<>();

        PDFTextStripper stripper = new PDFTextStripper();
        int numPages = document.getNumberOfPages();

        // Extract all pages
        for (int pageNum = 1; pageNum <= numPages; pageNum++) {
            stripper.setStartPage(pageNum);
            stripper.setEndPage(pageNum);
            String pageText = stripper.getText(document).trim();

            if (!pageText.isEmpty()) {
                pageTexts.add(pageText);
            }
        }

        document.close();

        // If no valid pages, return whole document as one chunk
        if (pageTexts.isEmpty()) {
            String fullText = new PDFTextStripper().getText(Loader.loadPDF(new File(pdfPath)));
            return List.of(fullText);
        }

        // Merge small pages with adjacent pages
        List<String> mergedPages = mergeSmallPages(pageTexts, MIN_PAGE_WORDS);

        // Add overlap from previous chunk for context
        return addOverlapBetweenChunks(mergedPages);
    }

    // Merge pages that are too small with the next page.
    // Large pages are kept intact.
    private List<String> mergeSmallPages(List<String> pages, int minWordCount) {
        List<String> merged = new ArrayList<>();
        int i = 0;

        while (i < pages.size()) {
            String currentPage = pages.get(i);
            int wordCount = countWords(currentPage);

            // If current page is too small and not the last page, merge with next
            if (wordCount < minWordCount && i < pages.size() - 1) {
                String nextPage = pages.get(i + 1);
                currentPage = currentPage + "\n\n" + nextPage;
                i += 2;
            } else {
                i++;
            }

            merged.add(currentPage);
        }

        return merged;
    }

    // Add overlap from previous chunk to current chunk for context
    private List<String> addOverlapBetweenChunks(List<String> chunks) {
        List<String> withOverlap = new ArrayList<>();

        for (int i = 0; i < chunks.size(); i++) {
            String chunk = chunks.get(i);

            if (i > 0) {
                String previousOverlap = extractLastWords(chunks.get(i - 1));
                chunk = previousOverlap + "\n\n" + chunk;
            }

            withOverlap.add(chunk);
        }

        return withOverlap;
    }

    // Extract the last X words from text
    private String extractLastWords(String text) {
        String[] words = text.trim().split("\\s+");

        if (words.length <= OVERLAP_WORDS) {
            return text;
        }

        StringBuilder result = new StringBuilder();
        int startIdx = Math.max(0, words.length - OVERLAP_WORDS);

        for (int i = startIdx; i < words.length; i++) {
            result.append(words[i]).append(" ");
        }

        return result.toString().trim();
    }

    // Count words in a string
    private int countWords(String text) {
        if (text == null || text.trim().isEmpty()) {
            return 0;
        }
        return text.trim().split("\\s+").length;
    }
}
