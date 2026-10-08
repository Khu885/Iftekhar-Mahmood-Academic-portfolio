package com.akif.uncleportfolio.controller;

import com.akif.uncleportfolio.dto.ApiResponse;
import com.akif.uncleportfolio.dto.contact.ContactMessageDto;
import com.akif.uncleportfolio.dto.contact.ContactRequest;
import com.akif.uncleportfolio.service.ContactService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class ContactController {
    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    /** Public endpoint — anyone can submit a contact message */
    @PostMapping("/api/public/contact")
    public ResponseEntity<ApiResponse<ContactMessageDto>> submit(@Valid @RequestBody ContactRequest request) {
        return ResponseEntity.ok(ApiResponse.success(contactService.submit(request), "Message sent successfully"));
    }

    /** Admin endpoints — authenticated only */
    @GetMapping("/api/admin/messages")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<List<ContactMessageDto>>> listAll() {
        return ResponseEntity.ok(ApiResponse.success(contactService.listAll(), "Messages loaded"));
    }

    @GetMapping("/api/admin/messages/unread-count")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Long>> unreadCount() {
        return ResponseEntity.ok(ApiResponse.success(contactService.countUnread(), "Unread count"));
    }

    @PatchMapping("/api/admin/messages/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ContactMessageDto>> markRead(
            @PathVariable UUID id,
            @RequestBody Map<String, Boolean> payload
    ) {
        boolean read = Boolean.TRUE.equals(payload.get("read"));
        return ResponseEntity.ok(ApiResponse.success(contactService.markRead(id, read), "Message updated"));
    }

    @DeleteMapping("/api/admin/messages/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<Void>> delete(@PathVariable UUID id) {
        contactService.delete(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Message deleted"));
    }
}
