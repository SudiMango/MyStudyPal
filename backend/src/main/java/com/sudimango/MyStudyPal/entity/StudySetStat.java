package com.sudimango.MyStudyPal.entity;

import java.math.BigDecimal;
import java.time.Instant;

import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@Table(name = "study_set_stats")
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudySetStat {
    
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String statId;
    
    @Column(nullable = false)
    @Builder.Default
    private int totalFlashcardReviews = 0;
    
    @Column(nullable = false)
    @Builder.Default
    private int totalQuizAttempts = 0;
    
    @Column
    private BigDecimal averageQuizScore;
    
    @Column(nullable = false)
    @Builder.Default
    private int totalStudyTimeSeconds = 0;
    
    @Column
    private Instant lastStudiedAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private Instant updatedAt;
    
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_set_id", nullable = false)
    private StudySet studySet;
}