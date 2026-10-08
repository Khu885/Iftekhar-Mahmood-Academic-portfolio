package com.akif.uncleportfolio.repository;

import com.akif.uncleportfolio.entity.ContactMessage;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ContactMessageRepository extends JpaRepository<ContactMessage, UUID> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();

    @Query("SELECT COUNT(m) FROM ContactMessage m WHERE m.read = false")
    long countUnread();
}
