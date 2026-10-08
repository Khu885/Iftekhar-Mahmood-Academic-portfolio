package com.akif.uncleportfolio.dto.file;

import java.util.UUID;

public record FileUploadResponse(UUID fileId, String originalFilename, String storedFilename, String contentType, long fileSize) {
}
