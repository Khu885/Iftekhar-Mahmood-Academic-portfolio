package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.book.BookDto;
import com.akif.uncleportfolio.dto.book.BookRequest;
import com.akif.uncleportfolio.entity.Book;
import com.akif.uncleportfolio.entity.FileAsset;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.BookRepository;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class BookService {
    private final BookRepository bookRepository;
    private final FileAssetRepository fileAssetRepository;

    public BookService(BookRepository bookRepository, FileAssetRepository fileAssetRepository) {
        this.bookRepository = bookRepository;
        this.fileAssetRepository = fileAssetRepository;
    }

    @Transactional(readOnly = true)
    public List<BookDto> findAllPublic() {
        return bookRepository.findByPublishedTrue(Sort.by(Sort.Direction.ASC, "displayOrder")
                .and(Sort.by(Sort.Direction.DESC, "publicationYear"))
                .and(Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<BookDto> findAllAdmin() {
        return bookRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder")
                .and(Sort.by(Sort.Direction.DESC, "publicationYear"))
                .and(Sort.by(Sort.Direction.DESC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public BookDto findById(UUID id) {
        return toDto(bookRepository.findById(id).orElseThrow(() -> new ApiException("Book not found")));
    }

    @Transactional
    public BookDto create(BookRequest request) {
        validateSlug(request.slug(), "Book");
        Book book = new Book();
        apply(book, request);
        return toDto(bookRepository.save(book));
    }

    @Transactional
    public BookDto update(UUID id, BookRequest request) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ApiException("Book not found"));
        if (request.slug() != null && !request.slug().equals(book.getSlug())) {
            validateSlug(request.slug(), "Book");
            book.setSlug(request.slug());
        }
        apply(book, request);
        return toDto(bookRepository.save(book));
    }

    @Transactional
    public void delete(UUID id) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ApiException("Book not found"));
        bookRepository.delete(book);
    }

    @Transactional
    public BookDto setPublished(UUID id, boolean published) {
        Book book = bookRepository.findById(id).orElseThrow(() -> new ApiException("Book not found"));
        book.setPublished(published);
        return toDto(bookRepository.save(book));
    }

    public void reorder(List<UUID> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Book book = bookRepository.findById(ids.get(i)).orElseThrow(() -> new ApiException("Book not found"));
            book.setDisplayOrder(i);
            bookRepository.save(book);
        }
    }

    private void validateSlug(String slug, String entityType) {
        if (slug == null || slug.isBlank()) {
            throw new ApiException(entityType + " slug is required");
        }
        if (bookRepository.existsBySlug(slug)) {
            throw new ApiException("Duplicate slug: " + slug);
        }
    }

    private void apply(Book book, BookRequest request) {
        book.setTitle(request.title());
        book.setSubtitle(request.subtitle());
        book.setAuthor(request.author());
        book.setPublisher(request.publisher());
        book.setPublicationYear(request.publicationYear());
        book.setIsbn(request.isbn());
        book.setDescription(request.description());
        book.setCategory(request.category());
        book.setExternalBookUrl(request.externalBookUrl());
        book.setPdfExternalUrl(request.pdfExternalUrl());
        book.setPdfAsset(resolveAsset(request.pdfAssetId()));
        book.setCoverAsset(resolveAsset(request.coverAssetId()));
        book.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        book.setPublished(Boolean.TRUE.equals(request.published()));
        if (request.slug() != null) {
            book.setSlug(request.slug());
        }
        if (book.getId() == null) {
            book.setCreatedAt(OffsetDateTime.now());
            book.setUpdatedAt(OffsetDateTime.now());
        }
        book.setUpdatedAt(OffsetDateTime.now());
    }

    private BookDto toDto(Book book) {
        return new BookDto(
                book.getId(),
                book.getSlug(),
                book.getTitle(),
                book.getSubtitle(),
                book.getAuthor(),
                book.getPublisher(),
                book.getPublicationYear(),
                book.getIsbn(),
                book.getDescription(),
                book.getCategory(),
                book.getExternalBookUrl(),
                book.getPdfExternalUrl(),
                book.getPdfAsset() == null ? null : book.getPdfAsset().getId(),
                book.getCoverAsset() == null ? null : book.getCoverAsset().getId(),
                book.getDisplayOrder(),
                book.isPublished(),
                book.getCreatedAt() == null ? null : book.getCreatedAt().toString(),
                book.getUpdatedAt() == null ? null : book.getUpdatedAt().toString()
        );
    }

    private FileAsset resolveAsset(java.util.UUID assetId) {
        if (assetId == null) {
            return null;
        }
        return fileAssetRepository.findById(assetId).orElseThrow(() -> new ApiException("File asset not found"));
    }
}
