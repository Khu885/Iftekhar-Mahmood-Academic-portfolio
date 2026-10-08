package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.CvEntry;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CvEntryRepository extends JpaRepository<CvEntry, UUID> {
    List<CvEntry> findBySectionIdOrderByDisplayOrderAsc(UUID sectionId);
}
