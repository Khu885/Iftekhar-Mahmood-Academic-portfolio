package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.publication.PublicationDto;
import com.akif.uncleportfolio.dto.publication.PublicationRequest;
import com.akif.uncleportfolio.entity.Publication;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import com.akif.uncleportfolio.repository.PublicationRepository;
import jakarta.persistence.criteria.Predicate;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.JoinType;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PublicationService {
    private final PublicationRepository publicationRepository;
    private final FileAssetRepository fileAssetRepository;

    public PublicationService(PublicationRepository publicationRepository, FileAssetRepository fileAssetRepository) {
        this.publicationRepository = publicationRepository;
        this.fileAssetRepository = fileAssetRepository;
    }

    @Transactional(readOnly = true)
    public List<PublicationDto> findAllPublic(String title, String authors, String journal, String tags, Integer year, String keyword) {
        Specification<Publication> spec = Specification.where(null);
        if (title != null && !title.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("title")), "%" + title.toLowerCase() + "%"));
        }
        if (authors != null && !authors.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("authors")), "%" + authors.toLowerCase() + "%"));
        }
        if (journal != null && !journal.isBlank()) {
            spec = spec.and((root, query, cb) -> cb.like(cb.lower(root.get("journal")), "%" + journal.toLowerCase() + "%"));
        }
        if (tags != null && !tags.isBlank()) {
            String[] tagParts = tags.split(",");
            spec = spec.and((root, query, cb) -> {
                query.distinct(true);
                List<Predicate> predicates = new ArrayList<>();
                Join<Publication, String> tagJoin = root.join("tags", JoinType.INNER);
                for (String tag : tagParts) {
                    String trimmed = tag.trim().toLowerCase();
                    if (!trimmed.isEmpty()) {
                        predicates.add(cb.equal(cb.lower(tagJoin), trimmed));
                    }
                }
                return cb.or(predicates.toArray(Predicate[]::new));
            });
        }
        if (year != null) {
            spec = spec.and((root, query, cb) -> cb.equal(root.get("publicationYear"), year));
        }
        if (keyword != null && !keyword.isBlank()) {
            String value = keyword.toLowerCase();
            spec = spec.and((root, query, cb) -> cb.or(
                    cb.like(cb.lower(root.get("title")), "%" + value + "%"),
                    cb.like(cb.lower(root.get("authors")), "%" + value + "%"),
                    cb.like(cb.lower(root.get("journal")), "%" + value + "%"),
                    cb.like(cb.lower(root.get("abstractText")), "%" + value + "%"),
                    cb.like(cb.lower(root.get("citation")), "%" + value + "%")
            ));
        }
        spec = spec.and((root, query, cb) -> cb.isTrue(root.get("published")));
        return publicationRepository.findAll(spec, Sort.by(Sort.Direction.ASC, "displayOrder")
                .and(Sort.by(Sort.Direction.DESC, "publicationYear"))
                .and(Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<PublicationDto> findAllAdmin() {
        return publicationRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder")
                .and(Sort.by(Sort.Direction.DESC, "publicationYear"))
                .and(Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public PublicationDto findById(UUID id) {
        return toDto(publicationRepository.findById(id).orElseThrow(() -> new ApiException("Publication not found")));
    }

    @Transactional
    public PublicationDto create(PublicationRequest request) {
        validateSlug(request.slug(), "Publication");
        Publication publication = new Publication();
        apply(publication, request);
        return toDto(publicationRepository.save(publication));
    }

    @Transactional
    public PublicationDto update(UUID id, PublicationRequest request) {
        Publication publication = publicationRepository.findById(id).orElseThrow(() -> new ApiException("Publication not found"));
        if (request.slug() != null && !request.slug().equals(publication.getSlug())) {
            validateSlug(request.slug(), "Publication");
            publication.setSlug(request.slug());
        }
        apply(publication, request);
        return toDto(publicationRepository.save(publication));
    }

    @Transactional
    public void delete(UUID id) {
        Publication publication = publicationRepository.findById(id).orElseThrow(() -> new ApiException("Publication not found"));
        publicationRepository.delete(publication);
    }

    @Transactional
    public PublicationDto setPublished(UUID id, boolean published) {
        Publication publication = publicationRepository.findById(id).orElseThrow(() -> new ApiException("Publication not found"));
        publication.setPublished(published);
        return toDto(publicationRepository.save(publication));
    }

    public void reorder(List<UUID> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Publication publication = publicationRepository.findById(ids.get(i)).orElseThrow(() -> new ApiException("Publication not found"));
            publication.setDisplayOrder(i);
            publicationRepository.save(publication);
        }
    }

    private void validateSlug(String slug, String entityType) {
        if (slug == null || slug.isBlank()) {
            throw new ApiException(entityType + " slug is required");
        }
        if (publicationRepository.existsBySlug(slug)) {
            throw new ApiException("Duplicate slug: " + slug);
        }
    }

    private void apply(Publication publication, PublicationRequest request) {
        publication.setTitle(request.title());
        publication.setAuthors(request.authors());
        publication.setJournal(request.journal());
        publication.setPublicationYear(request.publicationYear());
        publication.setVolume(request.volume());
        publication.setIssue(request.issue());
        publication.setPages(request.pages());
        publication.setAbstractText(request.abstractText());
        publication.setCitation(request.citation());
        publication.setDoi(request.doi());
        publication.setTags(normalizeTags(request.tags()));
        publication.setOriginalPublicationUrl(request.originalPublicationUrl());
        publication.setPdfExternalUrl(request.pdfExternalUrl());
        publication.setPdfAsset(resolveAsset(request.pdfAssetId()));
        publication.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        publication.setPublished(Boolean.TRUE.equals(request.published()));
        if (request.slug() != null) {
            publication.setSlug(request.slug());
        }
        if (publication.getId() == null) {
            publication.setCreatedAt(OffsetDateTime.now());
            publication.setUpdatedAt(OffsetDateTime.now());
        }
        publication.setUpdatedAt(OffsetDateTime.now());
    }

    private PublicationDto toDto(Publication publication) {
        return new PublicationDto(
                publication.getId(),
                publication.getSlug(),
                publication.getTitle(),
                publication.getAuthors(),
                publication.getJournal(),
                publication.getPublicationYear(),
                publication.getVolume(),
                publication.getIssue(),
                publication.getPages(),
                publication.getAbstractText(),
                publication.getCitation(),
                publication.getDoi(),
                publication.getTags().toArray(String[]::new),
                publication.getOriginalPublicationUrl(),
                publication.getPdfExternalUrl(),
                publication.getPdfAsset() == null ? null : publication.getPdfAsset().getId(),
                publication.getDisplayOrder(),
                publication.isPublished(),
                publication.getCreatedAt() == null ? null : publication.getCreatedAt().toString(),
                publication.getUpdatedAt() == null ? null : publication.getUpdatedAt().toString()
        );
    }

    private List<String> normalizeTags(String[] tags) {
        List<String> normalized = new ArrayList<>();
        if (tags == null) {
            return normalized;
        }
        for (String tag : tags) {
            if (tag == null) {
                continue;
            }
            String trimmed = tag.trim();
            if (!trimmed.isEmpty()) {
                normalized.add(trimmed);
            }
        }
        return normalized;
    }

    private com.akif.uncleportfolio.entity.FileAsset resolveAsset(java.util.UUID assetId) {
        if (assetId == null) {
            return null;
        }
        return fileAssetRepository.findById(assetId).orElseThrow(() -> new ApiException("File asset not found"));
    }
}
