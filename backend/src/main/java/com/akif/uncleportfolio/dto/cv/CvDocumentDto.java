package com.akif.uncleportfolio.dto.cv;

import java.util.List;
import java.util.UUID;

public record CvDocumentDto(
        UUID id,
        String title,
        String description,
        UUID assetId,
        String externalUrl,
        boolean active,
        List<CvSectionDto> sections,
        String createdAt,
        String updatedAt
) {
}
