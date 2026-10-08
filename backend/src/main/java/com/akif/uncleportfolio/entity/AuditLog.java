package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "audit_logs")
public class AuditLog {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "admin_user_id")
    private AdminUser adminUser;

    @Column(nullable = false, length = 50)
    @NotBlank
    private String action;

    @Column(name = "entity_type", nullable = false, length = 100)
    @NotBlank
    private String entityType;

    @Column(name = "entity_id")
    private UUID entityId;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(columnDefinition = "jsonb")
    private String details;

    @PrePersist
    public void prePersist() {
        if (createdAt == null) createdAt = OffsetDateTime.now();
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public AdminUser getAdminUser() { return adminUser; }
    public void setAdminUser(AdminUser adminUser) { this.adminUser = adminUser; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getEntityType() { return entityType; }
    public void setEntityType(String entityType) { this.entityType = entityType; }
    public UUID getEntityId() { return entityId; }
    public void setEntityId(UUID entityId) { this.entityId = entityId; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(OffsetDateTime createdAt) { this.createdAt = createdAt; }
    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }
}
