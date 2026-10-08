package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.CvDocument;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CvDocumentRepository extends JpaRepository<CvDocument, UUID> {
    Optional<CvDocument> findByActiveTrue();
    Optional<CvDocument> findFirstByOrderByCreatedAtDesc();
}
