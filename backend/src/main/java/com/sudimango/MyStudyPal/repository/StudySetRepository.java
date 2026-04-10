package com.sudimango.MyStudyPal.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.sudimango.MyStudyPal.entity.StudySet;

@Repository
public interface StudySetRepository extends JpaRepository<StudySet, String> {
    List<StudySet> findAllByUser_UserId(String userId);
    
    boolean existsByStudySetIdAndUser_UserId(String studySetId, String userId);
}