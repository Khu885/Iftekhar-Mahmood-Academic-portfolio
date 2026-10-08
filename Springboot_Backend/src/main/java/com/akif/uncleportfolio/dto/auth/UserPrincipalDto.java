package com.akif.uncleportfolio.dto.auth;

import java.util.UUID;

public record UserPrincipalDto(UUID id, String username, String role) {
}
