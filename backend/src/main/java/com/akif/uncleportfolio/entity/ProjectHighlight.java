package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

@Entity
@Table(name = "project_highlights", indexes = {
        @Index(name = "idx_project_highlights_project_order", columnList = "project_id,display_order")
})
public class ProjectHighlight {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(name = "highlight_text", nullable = false, columnDefinition = "TEXT")
    @NotBlank
    private String highlightText;

    @Column(name = "display_order", nullable = false)
    @NotNull
    private Integer displayOrder = 0;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public Project getProject() { return project; }
    public void setProject(Project project) { this.project = project; }
    public String getHighlightText() { return highlightText; }
    public void setHighlightText(String highlightText) { this.highlightText = highlightText; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
