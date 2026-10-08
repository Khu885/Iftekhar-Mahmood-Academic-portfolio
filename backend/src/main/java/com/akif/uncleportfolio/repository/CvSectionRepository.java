package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.CvSection;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CvSectionRepository extends JpaRepository<CvSection, UUID> {
    List<CvSection> findByVisibleTrueOrderByDisplayOrderAsc();
}
