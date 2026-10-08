package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.FileAsset;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FileAssetRepository extends JpaRepository<FileAsset, UUID> {
    Optional<FileAsset> findByStoredFilename(String storedFilename);
}
