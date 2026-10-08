package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "publications", indexes = {
        @Index(name = "idx_publications_slug", columnList = "slug", unique = true),
        @Index(name = "idx_publications_published_order", columnList = "published,display_order")
})
public class Publication {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(nullable = false, unique = true, length = 180)
    @NotBlank
    @Size(max = 180)
    private String slug;

    @Column(nullable = false, length = 500)
    @NotBlank
    @Size(max = 500)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String authors;

    @Column(length = 300)
    private String journal;

    @Column(name = "publication_year")
    private Integer publicationYear;

    @Column(length = 50)
    private String volume;

    @Column(length = 50)
    private String issue;

    @Column(length = 100)
    private String pages;

    @Column(columnDefinition = "TEXT")
    private String abstractText;

    @Column(columnDefinition = "TEXT")
    private String citation;

    @Column(length = 255)
    private String doi;

    @ElementCollection(fetch = FetchType.LAZY)
    @CollectionTable(name = "publication_tags", joinColumns = @JoinColumn(name = "publication_id", nullable = false))
    @OrderColumn(name = "display_order")
    @Column(name = "tag", nullable = false, length = 150)
    private List<String> tags = new ArrayList<>();

    @Column(name = "original_publication_url", length = 1000)
    private String originalPublicationUrl;

    @Column(name = "pdf_external_url", length = 1000)
    private String pdfExternalUrl;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pdf_asset_id")
    private FileAsset pdfAsset;

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
    public String getAuthors() { return authors; }
    public void setAuthors(String authors) { this.authors = authors; }
    public String getJournal() { return journal; }
    public void setJournal(String journal) { this.journal = journal; }
    public Integer getPublicationYear() { return publicationYear; }
    public void setPublicationYear(Integer publicationYear) { this.publicationYear = publicationYear; }
    public String getVolume() { return volume; }
    public void setVolume(String volume) { this.volume = volume; }
    public String getIssue() { return issue; }
    public void setIssue(String issue) { this.issue = issue; }
    public String getPages() { return pages; }
    public void setPages(String pages) { this.pages = pages; }
    public String getAbstractText() { return abstractText; }
    public void setAbstractText(String abstractText) { this.abstractText = abstractText; }
    public String getCitation() { return citation; }
    public void setCitation(String citation) { this.citation = citation; }
    public String getDoi() { return doi; }
    public void setDoi(String doi) { this.doi = doi; }
    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags == null ? new ArrayList<>() : tags; }
    public String getOriginalPublicationUrl() { return originalPublicationUrl; }
    public void setOriginalPublicationUrl(String originalPublicationUrl) { this.originalPublicationUrl = originalPublicationUrl; }
    public String getPdfExternalUrl() { return pdfExternalUrl; }
    public void setPdfExternalUrl(String pdfExternalUrl) { this.pdfExternalUrl = pdfExternalUrl; }
    public FileAsset getPdfAsset() { return pdfAsset; }
    public void setPdfAsset(FileAsset pdfAsset) { this.pdfAsset = pdfAsset; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public boolean isPublished() { return published; }
    public void setPublished(boolean published) { this.published = published; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(OffsetDateTime updatedAt) { this.updatedAt = updatedAt; }
}
