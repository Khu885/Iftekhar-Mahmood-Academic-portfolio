package com.akif.uncleportfolio.dto;

import java.time.Instant;
import java.util.Map;

public record ErrorResponse(
        Instant timestamp,
        int status,
        String message,
        Map<String, String> errors,
        String path
) {
}
