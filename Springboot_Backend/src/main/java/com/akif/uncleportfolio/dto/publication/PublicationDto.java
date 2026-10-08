package com.akif.uncleportfolio.dto.publication;

import java.util.UUID;

public record PublicationDto(
        UUID id,
        String slug,
        String title,
        String authors,
        String journal,
        Integer publicationYear,
        String volume,
        String issue,
        String pages,
        String abstractText,
        String citation,
        String doi,
        String[] tags,
        String originalPublicationUrl,
        String pdfExternalUrl,
        UUID pdfAssetId,
        Integer displayOrder,
        boolean published,
        String createdAt,
        String updatedAt
) {
}
