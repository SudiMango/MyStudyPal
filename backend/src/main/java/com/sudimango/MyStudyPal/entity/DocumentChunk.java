package com.sudimango.MyStudyPal.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "document_chunks")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DocumentChunk {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String documentChunkId;
    
    @Column(name = "chunk_text", columnDefinition = "TEXT", nullable = false)
    private String chunkText;
    
    @Column(name = "embedding", columnDefinition = "vector(768)")
    private String embedding;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "document_id", nullable = false)
    private Document document;
}
