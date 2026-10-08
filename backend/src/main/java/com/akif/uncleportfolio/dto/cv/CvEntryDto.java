package com.akif.uncleportfolio.dto.cv;

import java.util.UUID;

public record CvEntryDto(
        UUID id,
        String heading,
        String organization,
        String location,
        String startDate,
        String endDate,
        String description,
        Integer displayOrder
) {
}
