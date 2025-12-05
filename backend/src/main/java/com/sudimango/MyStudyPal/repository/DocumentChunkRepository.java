package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.sudimango.MyStudyPal.entity.DocumentChunk;

import jakarta.transaction.Transactional;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, String> {
    @Query(value = "SELECT dc.chunk_text FROM document_chunks dc " +
    "WHERE dc.document_id = :documentId " +
    "ORDER BY dc.embedding <=> CAST(:queryVector AS vector) LIMIT :limit",
    nativeQuery = true)
    List<String> findSimilarChunks(
        @Param("documentId") String documentId,
        @Param("queryVector") String queryVector,
        @Param("limit") int limit
    );

    @Modifying
    @Transactional
    @Query(value = "INSERT INTO document_chunks (document_chunk_id, document_id, chunk_text, embedding) " +
        "VALUES (gen_random_uuid(), :documentId, :chunkText, CAST(:embedding as vector))",
        nativeQuery = true)
    void saveChunkWithEmbedding(
        @Param("documentId") String documentId,
        @Param("chunkText") String chunkText,
        @Param("embedding") String embedding
    );

    List<DocumentChunk> findAllByDocument_DocumentId(String documentId);
}
