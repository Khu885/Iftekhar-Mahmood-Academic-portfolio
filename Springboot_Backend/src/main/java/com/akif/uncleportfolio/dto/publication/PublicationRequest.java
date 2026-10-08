package com.akif.uncleportfolio.dto.publication;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record PublicationRequest(
        @NotBlank(message = "Title is required") @Size(max = 500) String title,
        String authors,
        @Size(max = 300) String journal,
        Integer publicationYear,
        @Size(max = 50) String volume,
        @Size(max = 50) String issue,
        @Size(max = 100) String pages,
        String abstractText,
        String citation,
        @Size(max = 255) String doi,
        String[] tags,
        String originalPublicationUrl,
        String pdfExternalUrl,
        Integer displayOrder,
        Boolean published,
        String slug,
        UUID pdfAssetId
) {
}
