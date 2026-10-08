package com.akif.uncleportfolio.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import java.util.UUID;

@Entity
@Table(name = "cv_entries", indexes = {
        @Index(name = "idx_cv_entries_section_order", columnList = "section_id,display_order")
})
public class CvEntry {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "section_id", nullable = false)
    private CvSection section;

    @Column(length = 500)
    @Size(max = 500)
    private String heading;

    @Column(length = 500)
    @Size(max = 500)
    private String organization;

    @Column(length = 300)
    @Size(max = 300)
    private String location;

    @Column(name = "start_date", length = 50)
    @Size(max = 50)
    private String startDate;

    @Column(name = "end_date", length = 50)
    @Size(max = 50)
    private String endDate;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "display_order", nullable = false)
    private Integer displayOrder = 0;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public CvSection getSection() { return section; }
    public void setSection(CvSection section) { this.section = section; }
    public String getHeading() { return heading; }
    public void setHeading(String heading) { this.heading = heading; }
    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getStartDate() { return startDate; }
    public void setStartDate(String startDate) { this.startDate = startDate; }
    public String getEndDate() { return endDate; }
    public void setEndDate(String endDate) { this.endDate = endDate; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public Integer getDisplayOrder() { return displayOrder; }
    public void setDisplayOrder(Integer displayOrder) { this.displayOrder = displayOrder; }
}
