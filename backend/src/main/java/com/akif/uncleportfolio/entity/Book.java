package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "books", indexes = {
        @Index(name = "idx_books_slug", columnList = "slug", unique = true),
        @Index(name = "idx_books_published_display_order", columnList = "published,display_order")
})
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 180)
    @NotBlank
    @Size(max = 180)
    private String slug;

    @Column(nullable = false, length = 300)
    @NotBlank
    @Size(max = 300)
    private String title;

    @Column(length = 500)
    @Size(max = 500)
    private String subtitle;

    @Column(length = 300)
    @Size(max = 300)
    private String author;

    @Column(length = 300)
    @Size(max = 300)
    private String publisher;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(length = 30)
    @Size(max = 30)
    private String isbn;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 150)
    @Size(max = 150)
    private String category;

    @Column(name = "external_book_url", length = 1000)
    private String externalBookUrl;

    @Column(name = "pdf_external_url", length = 1000)
    private String pdfExternalUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pdf_asset_id")
    private FileAsset pdfAsset;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cover_asset_id")
    private FileAsset coverAsset;

    @Column(name = "display_order", nullable = false)
    @NotNull
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private boolean published = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @PrePersist
    public void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    public void preUpdate() { updatedAt = OffsetDateTime.now(); }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getSubtitle() { return subtitle; }
    public void setSubtitle(String subtitle) { this.subtitle = subtitle; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getPublisher() { return publisher; }
    public void setPublisher(String publisher) { this.publisher = publisher; }
    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }
    public String getIsbn() { return isbn; }
    public void setIsbn(String isbn) { this.isbn = isbn; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getExternalBookUrl() { return externalBookUrl; }
    public void setExternalBookUrl(String externalBookUrl) { this.externalBookUrl = externalBookUrl; }
    public String getPdfExternalUrl() { return pdfExternalUrl; }
    public void setPdfExternalUrl(String pdfExternalUrl) { this.pdfExternalUrl = pdfExternalUrl; }
    public FileAsset getPdfAsset() { return pdfAsset; }
    public void setPdfAsset(FileAsset pdfAsset) { this.pdfAsset = pdfAsset; }
    public FileAsset getCoverAsset() { return coverAsset; }
    public void setCoverAsset(FileAsset coverAsset) { this.coverAsset = coverAsset; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
