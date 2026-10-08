package com.akif.uncleportfolio.dto.project;

import java.util.List;
import java.util.UUID;

public record ProjectDto(
        UUID id,
        String slug,
        String title,
        String category,
        String status,
        String description,
        Integer displayOrder,
        boolean published,
        List<ProjectHighlightDto> highlights,
        String createdAt,
        String updatedAt
) {
}
