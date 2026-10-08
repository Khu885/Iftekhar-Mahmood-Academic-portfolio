package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.Book;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BookRepository extends JpaRepository<Book, UUID> {
    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.coverAsset LEFT JOIN FETCH b.pdfAsset WHERE b.slug = :slug")
    Optional<Book> findBySlugWithAssets(@Param("slug") String slug);

    Optional<Book> findBySlug(String slug);
    List<Book> findByPublishedTrue(Sort sort);
    boolean existsBySlug(String slug);
}

