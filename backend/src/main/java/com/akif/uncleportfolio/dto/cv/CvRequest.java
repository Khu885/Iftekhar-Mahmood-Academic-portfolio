package com.akif.uncleportfolio.dto.cv;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;
import java.util.UUID;

public record CvRequest(
        @NotBlank(message = "Title is required") @Size(max = 300) String title,
        String description,
        String externalUrl,
        UUID assetId,
        Boolean active,
        List<CvSectionDto> sections
) {
}
