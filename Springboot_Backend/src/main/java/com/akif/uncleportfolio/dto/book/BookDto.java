package com.akif.uncleportfolio.dto.book;

import java.util.UUID;

public record BookDto(
        UUID id,
        String slug,
        String title,
        String subtitle,
        String author,
        String publisher,
        Integer publicationYear,
        String isbn,
        String description,
        String category,
        String externalBookUrl,
        String pdfExternalUrl,
        UUID pdfAssetId,
        UUID coverAssetId,
        Integer displayOrder,
        boolean published,
        String createdAt,
        String updatedAt
) {
}
