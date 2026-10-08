package com.akif.uncleportfolio.dto.project;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProjectRequest(
        @NotBlank(message = "Title is required") @Size(max = 300) String title,
        @Size(max = 200) String category,
        @Size(max = 150) String status,
        String description,
        Integer displayOrder,
        Boolean published,
        String slug,
        List<ProjectHighlightDto> highlights
) {
}
