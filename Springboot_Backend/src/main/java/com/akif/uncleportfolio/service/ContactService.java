package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.contact.ContactMessageDto;
import com.akif.uncleportfolio.dto.contact.ContactRequest;
import com.akif.uncleportfolio.entity.ContactMessage;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.ContactMessageRepository;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ContactService {
    private final ContactMessageRepository contactMessageRepository;

    public ContactService(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @Transactional
    public ContactMessageDto submit(ContactRequest request) {
        ContactMessage msg = new ContactMessage();
        msg.setName(request.name());
        msg.setEmail(request.email());
        msg.setMessage(request.message());
        msg.setRead(false);
        contactMessageRepository.save(msg);
        return toDto(msg);
    }

    @Transactional(readOnly = true)
    public List<ContactMessageDto> listAll() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::toDto).toList();
    }

    @Transactional
    public ContactMessageDto markRead(UUID id, boolean read) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ApiException("Message not found"));
        msg.setRead(read);
        contactMessageRepository.save(msg);
        return toDto(msg);
    }

    @Transactional
    public void delete(UUID id) {
        ContactMessage msg = contactMessageRepository.findById(id)
                .orElseThrow(() -> new ApiException("Message not found"));
        contactMessageRepository.delete(msg);
    }

    @Transactional(readOnly = true)
    public long countUnread() {
        return contactMessageRepository.countUnread();
    }

    private ContactMessageDto toDto(ContactMessage msg) {
        return new ContactMessageDto(
                msg.getId(),
                msg.getName(),
                msg.getEmail(),
                msg.getMessage(),
                msg.isRead(),
                msg.getCreatedAt() != null ? msg.getCreatedAt().toString() : null
        );
    }
}
