package com.akif.uncleportfolio.dto.book;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record BookRequest(
        @NotBlank(message = "Title is required") @Size(max = 300, message = "Title cannot exceed 300 characters") String title,
        @Size(max = 500) String subtitle,
        @Size(max = 300) String author,
        @Size(max = 300) String publisher,
        Integer publicationYear,
        @Size(max = 30) String isbn,
        String description,
        @Size(max = 150) String category,
        String externalBookUrl,
        String pdfExternalUrl,
        Integer displayOrder,
        Boolean published,
        String slug,
        UUID pdfAssetId,
        UUID coverAssetId
) {
}
