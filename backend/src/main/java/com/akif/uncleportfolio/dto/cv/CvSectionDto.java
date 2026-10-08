package com.akif.uncleportfolio.dto.cv;

import java.util.List;
import java.util.UUID;

public record CvSectionDto(UUID id, String sectionType, String title, Integer displayOrder, boolean visible, List<CvEntryDto> entries) {
}
