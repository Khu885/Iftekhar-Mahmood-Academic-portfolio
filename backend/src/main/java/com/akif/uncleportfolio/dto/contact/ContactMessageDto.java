package com.akif.uncleportfolio.dto.contact;

import java.util.UUID;

public record ContactMessageDto(
        UUID id,
        String name,
        String email,
        String message,
        boolean read,
        String createdAt
) {}
