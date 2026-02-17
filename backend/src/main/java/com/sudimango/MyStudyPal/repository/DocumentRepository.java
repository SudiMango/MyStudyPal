package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sudimango.MyStudyPal.entity.Document;

@Repository
public interface DocumentRepository extends JpaRepository<Document, String> {
    List<Document> findByStudySet_StudySetId(String studySetId);
}