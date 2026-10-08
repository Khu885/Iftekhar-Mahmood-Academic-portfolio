package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.Project;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {
    Optional<Project> findBySlug(String slug);
    List<Project> findByPublishedTrue(Sort sort);
    boolean existsBySlug(String slug);
}
