package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.project.ProjectDto;
import com.akif.uncleportfolio.dto.project.ProjectHighlightDto;
import com.akif.uncleportfolio.dto.project.ProjectRequest;
import com.akif.uncleportfolio.entity.Project;
import com.akif.uncleportfolio.entity.ProjectHighlight;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.ProjectRepository;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProjectService {
    private final ProjectRepository projectRepository;

    public ProjectService(ProjectRepository projectRepository) {
        this.projectRepository = projectRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> findAllPublic() {
        return projectRepository.findByPublishedTrue(Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public List<ProjectDto> findAllAdmin() {
        return projectRepository.findAll(Sort.by(Sort.Direction.ASC, "displayOrder").and(Sort.by(Sort.Direction.ASC, "createdAt")))
                .stream().map(this::toDto).toList();
    }

    @Transactional(readOnly = true)
    public ProjectDto findById(UUID id) {
        return toDto(projectRepository.findById(id).orElseThrow(() -> new ApiException("Project not found")));
    }

    @Transactional
    public ProjectDto create(ProjectRequest request) {
        validateSlug(request.slug(), "Project");
        Project project = new Project();
        apply(project, request);
        return toDto(projectRepository.save(project));
    }

    @Transactional
    public ProjectDto update(UUID id, ProjectRequest request) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ApiException("Project not found"));
        if (request.slug() != null && !request.slug().equals(project.getSlug())) {
            validateSlug(request.slug(), "Project");
            project.setSlug(request.slug());
        }
        apply(project, request);
        return toDto(projectRepository.save(project));
    }

    @Transactional
    public void delete(UUID id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ApiException("Project not found"));
        projectRepository.delete(project);
    }

    @Transactional
    public ProjectDto setPublished(UUID id, boolean published) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new ApiException("Project not found"));
        project.setPublished(published);
        return toDto(projectRepository.save(project));
    }

    @Transactional
    public void reorder(List<UUID> ids) {
        for (int i = 0; i < ids.size(); i++) {
            Project project = projectRepository.findById(ids.get(i)).orElseThrow(() -> new ApiException("Project not found"));
            project.setDisplayOrder(i);
            projectRepository.save(project);
        }
    }

    private void validateSlug(String slug, String entityType) {
        if (slug == null || slug.isBlank()) {
            throw new ApiException(entityType + " slug is required");
        }
        if (projectRepository.existsBySlug(slug)) {
            throw new ApiException("Duplicate slug: " + slug);
        }
    }

    private void apply(Project project, ProjectRequest request) {
        project.setTitle(request.title());
        project.setCategory(request.category());
        project.setStatus(request.status());
        project.setDescription(request.description());
        project.setDisplayOrder(request.displayOrder() == null ? 0 : request.displayOrder());
        project.setPublished(Boolean.TRUE.equals(request.published()));
        if (request.slug() != null) {
            project.setSlug(request.slug());
        }
        if (project.getHighlights() == null) {
            project.setHighlights(new ArrayList<>());
        }
        if (request.highlights() != null) {
            project.getHighlights().clear();
            int i = 0;
            for (ProjectHighlightDto item : request.highlights()) {
                ProjectHighlight highlight = new ProjectHighlight();
                highlight.setHighlightText(item.highlightText());
                highlight.setDisplayOrder(item.displayOrder() == null ? i : item.displayOrder());
                highlight.setProject(project);
                project.getHighlights().add(highlight);
                i++;
            }
        }
        if (project.getId() == null) {
            project.setCreatedAt(OffsetDateTime.now());
            project.setUpdatedAt(OffsetDateTime.now());
        }
        project.setUpdatedAt(OffsetDateTime.now());
    }

    private ProjectDto toDto(Project project) {
        return new ProjectDto(
                project.getId(),
                project.getSlug(),
                project.getTitle(),
                project.getCategory(),
                project.getStatus(),
                project.getDescription(),
                project.getDisplayOrder(),
                project.isPublished(),
                project.getHighlights() == null ? List.of() : project.getHighlights().stream()
                        .sorted((a, b) -> Integer.compare(a.getDisplayOrder(), b.getDisplayOrder()))
                        .map(h -> new ProjectHighlightDto(h.getId(), h.getHighlightText(), h.getDisplayOrder()))
                        .toList(),
                project.getCreatedAt() == null ? null : project.getCreatedAt().toString(),
                project.getUpdatedAt() == null ? null : project.getUpdatedAt().toString()
        );
    }
}
