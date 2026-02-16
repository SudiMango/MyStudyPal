package com.sudimango.MyStudyPal.component;

import java.io.File;
import java.util.ArrayList;
import java.util.List;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.sudimango.MyStudyPal.entity.Document;
import com.sudimango.MyStudyPal.entity.StudySet;
import com.sudimango.MyStudyPal.entity.User;
import com.sudimango.MyStudyPal.repository.DocumentChunkRepository;
import com.sudimango.MyStudyPal.repository.DocumentRepository;
import com.sudimango.MyStudyPal.repository.StudySetRepository;
import com.sudimango.MyStudyPal.repository.UserRepository;

@Component
public class DocumentProcessor {
    
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
    
    // Ingest PDF into database as chunks
    @Transactional
    public void ingestPdfDocument(String userId, String studySetId, MultipartFile pdfFile, int chunkIndex) throws Exception {
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found: " + userId));

        StudySet studySet = studySetRepository.findById(studySetId)
            .orElseThrow(() -> new RuntimeException("Study set not found: " + studySetId));
        
        String tempPath = System.getProperty("java.io.tmpdir") + "/" + System.nanoTime() + ".pdf";
        pdfFile.transferTo(new File(tempPath));
        
        Document doc = null;
        try {
            List<String> chunks = extractAndChunkPdf(tempPath);
            
            doc = Document.builder()
                .title(pdfFile.getOriginalFilename())
                .numChunks(chunks.size())
                .studySet(studySet)
                .user(user)
                .build();
            Document savedDoc = documentRepository.save(doc);
            
            for (String content : chunks) {
                String vectorStr = geminiClient.generateAndFormatEmbedding(content);
                documentChunkRepository.saveChunkWithEmbedding(
                    savedDoc.getDocumentId(),
                    content,
                    vectorStr,
                    chunkIndex
                );
            }
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Failed to ingest PDF: " + e.getMessage(), e);
        } finally {
            new File(tempPath).delete();
        }
    
        if (doc == null) {
            throw new RuntimeException("Document could not be created");
        }
    }

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
