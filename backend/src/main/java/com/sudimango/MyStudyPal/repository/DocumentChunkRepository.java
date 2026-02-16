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
    @Query(value = "INSERT INTO document_chunks (document_chunk_id, document_id, chunk_text, embedding, chunk_index) " +
                "VALUES (gen_random_uuid(), :documentId, :chunkText, CAST(:embedding as vector), :chunkIndex)",
        nativeQuery = true)
    void saveChunkWithEmbedding(
        @Param("documentId") String documentId,
        @Param("chunkText") String chunkText,
        @Param("embedding") String embedding,
        @Param("chunkIndex") int chunkIndex
    );

    @Query(value = """
    SELECT dc.chunk_text
    FROM document_chunks dc
    JOIN documents d ON dc.document_id = d.document_id
    WHERE d.study_set_id = :studySetId
    ORDER BY dc.embedding <-> CAST(:queryVector as vector)
    LIMIT :limit
    """, nativeQuery = true)
    List<String> findSimilarChunksInStudySet(
        @Param("studySetId") String studySetId,
        @Param("queryVector") String queryVector,
        @Param("limit") int limit
    );

    List<DocumentChunk> findAllByDocument_DocumentId(String documentId);
}
