package com.sudimango.MyStudyPal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sudimango.MyStudyPal.entity.DocumentChunk;

@Repository
public interface DocumentChunkRepository extends JpaRepository<DocumentChunk, String> {
    
}
