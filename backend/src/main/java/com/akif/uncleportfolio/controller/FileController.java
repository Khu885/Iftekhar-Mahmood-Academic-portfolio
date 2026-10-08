package com.akif.uncleportfolio.controller;

import com.akif.uncleportfolio.dto.ApiResponse;
import com.akif.uncleportfolio.dto.file.FileUploadResponse;
import com.akif.uncleportfolio.entity.FileAsset;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import com.akif.uncleportfolio.service.FileStorageService;
import java.util.UUID;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api")
public class FileController {
    private final FileStorageService fileStorageService;
    private final FileAssetRepository fileAssetRepository;

    public FileController(FileStorageService fileStorageService, FileAssetRepository fileAssetRepository) {
        this.fileStorageService = fileStorageService;
        this.fileAssetRepository = fileAssetRepository;
    }

    @PostMapping("/admin/files/upload")
    public ResponseEntity<ApiResponse<FileUploadResponse>> upload(@RequestParam("file") MultipartFile file,
                                                                @RequestParam(value = "prefix", defaultValue = "asset") String prefix) {
        return ResponseEntity.ok(ApiResponse.success(fileStorageService.storeFile(file, prefix), "File uploaded successfully"));
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<Resource> download(@PathVariable UUID id) {
        FileAsset asset = fileAssetRepository.findById(id).orElseThrow(() -> new ApiException("File not found"));
        ByteArrayResource resource = new ByteArrayResource(asset.getFileData());
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(asset.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + asset.getOriginalFilename() + "\"")
                .contentLength(asset.getFileData().length)
                .body(resource);
    }
}
