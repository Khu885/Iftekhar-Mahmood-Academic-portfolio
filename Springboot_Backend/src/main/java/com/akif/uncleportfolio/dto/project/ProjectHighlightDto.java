package com.akif.uncleportfolio.dto.project;

import java.util.UUID;

public record ProjectHighlightDto(UUID id, String highlightText, Integer displayOrder) {
}
