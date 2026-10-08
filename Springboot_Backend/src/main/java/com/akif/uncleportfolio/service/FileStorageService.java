package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.file.FileUploadResponse;
import com.akif.uncleportfolio.entity.FileAsset;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.OffsetDateTime;
import java.util.HexFormat;
import java.util.Optional;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {
    private final FileAssetRepository fileAssetRepository;
    @Value("${MAX_FILE_SIZE_MB:10}")
    private long maxFileSizeMb;

    public FileStorageService(FileAssetRepository fileAssetRepository) {
        this.fileAssetRepository = fileAssetRepository;
    }

    @Transactional
    public FileUploadResponse storeFile(MultipartFile file, String prefix) {
        if (file == null || file.isEmpty()) {
            throw new ApiException("File is empty");
        }
        if (file.getSize() > maxFileSizeMb * 1024L * 1024L) {
            throw new ApiException("File exceeds maximum allowed size");
        }
        String contentType = file.getContentType();
        if (contentType == null || !(contentType.equals("application/pdf") || contentType.startsWith("image/"))) {
            throw new ApiException("Unsupported file type");
        }
        try {
            byte[] bytes = file.getBytes();
            if (bytes.length == 0) {
                throw new ApiException("File is empty");
            }
            String checksum = sha256(bytes);
            Optional<FileAsset> duplicate = fileAssetRepository.findByStoredFilename(checksum);
            FileAsset asset = new FileAsset();
            asset.setOriginalFilename(file.getOriginalFilename() == null ? "upload" : file.getOriginalFilename());
            asset.setStoredFilename(prefix + "-" + UUID.randomUUID() + getExtension(file.getOriginalFilename()));
            asset.setContentType(contentType);
            asset.setFileSize((long) bytes.length);
            asset.setFileData(bytes);
            asset.setChecksum(checksum);
            asset.setCreatedAt(OffsetDateTime.now());
            fileAssetRepository.save(asset);
            return new FileUploadResponse(asset.getId(), asset.getOriginalFilename(), asset.getStoredFilename(), asset.getContentType(), asset.getFileSize());
        } catch (IOException ex) {
            throw new ApiException("Unable to read uploaded file", ex);
        }
    }

    public FileAsset getAsset(UUID id) {
        return fileAssetRepository.findById(id).orElseThrow(() -> new ApiException("File asset not found"));
    }

    public byte[] getFileBytes(UUID id) {
        return getAsset(id).getFileData();
    }

    public void deleteAssetIfUnused(FileAsset asset) {
        if (asset == null) return;
        fileAssetRepository.delete(asset);
    }

    private String sha256(byte[] data) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(data));
        } catch (NoSuchAlgorithmException ex) {
            throw new ApiException("Checksum error", ex);
        }
    }

    private String getExtension(String filename) {
        if (filename == null) return ".bin";
        int idx = filename.lastIndexOf('.') ;
        return idx >= 0 ? filename.substring(idx) : ".bin";
    }
}
