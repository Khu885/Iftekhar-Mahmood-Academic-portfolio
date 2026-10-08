package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.Publication;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PublicationRepository extends JpaRepository<Publication, UUID>, JpaSpecificationExecutor<Publication> {
    @Query("SELECT p FROM Publication p LEFT JOIN FETCH p.pdfAsset WHERE p.slug = :slug")
    Optional<Publication> findBySlugWithAssets(@Param("slug") String slug);

    Optional<Publication> findBySlug(String slug);
    List<Publication> findByPublishedTrue(Sort sort);
    boolean existsBySlug(String slug);
}
