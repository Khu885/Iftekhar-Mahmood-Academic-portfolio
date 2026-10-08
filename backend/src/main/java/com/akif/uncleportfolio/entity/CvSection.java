package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Entity
@Table(name = "cv_sections")
public class CvSection {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "section_type", nullable = false, length = 100)
    @NotBlank
    private String sectionType;

    @Column(nullable = false, length = 200)
    @NotBlank
    @Size(max = 200)
    private String title;

    @Column(name = "display_order", nullable = false)
    @NotNull
    private Integer displayOrder = 0;

    @Column(nullable = false)
    private boolean visible = true;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getSectionType() { return sectionType; }
    public void setSectionType(String sectionType) { this.sectionType = sectionType; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
    public boolean isVisible() { return visible; }
    public void setVisible(boolean visible) { this.visible = visible; }
}
