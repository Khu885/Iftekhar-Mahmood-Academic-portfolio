package com.akif.uncleportfolio.controller;

import com.akif.uncleportfolio.dto.ApiResponse;
import com.akif.uncleportfolio.dto.book.BookDto;
import com.akif.uncleportfolio.dto.book.BookRequest;
import com.akif.uncleportfolio.dto.cv.CvDocumentDto;
import com.akif.uncleportfolio.dto.cv.CvRequest;
import com.akif.uncleportfolio.dto.project.ProjectDto;
import com.akif.uncleportfolio.dto.project.ProjectRequest;
import com.akif.uncleportfolio.dto.publication.PublicationDto;
import com.akif.uncleportfolio.dto.publication.PublicationRequest;
import com.akif.uncleportfolio.service.BookService;
import com.akif.uncleportfolio.service.CvService;
import com.akif.uncleportfolio.service.ProjectService;
import com.akif.uncleportfolio.service.PublicationService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminContentController {
    private final BookService bookService;
    private final PublicationService publicationService;
    private final ProjectService projectService;
    private final CvService cvService;

    public AdminContentController(BookService bookService, PublicationService publicationService,
                                 ProjectService projectService, CvService cvService) {
        this.bookService = bookService;
        this.publicationService = publicationService;
        this.projectService = projectService;
        this.cvService = cvService;
    }

    @GetMapping("/books")
    public ResponseEntity<ApiResponse<List<BookDto>>> listBooks() { return ResponseEntity.ok(ApiResponse.success(bookService.findAllAdmin(), "Books loaded")); }
    @PostMapping("/books")
    public ResponseEntity<ApiResponse<BookDto>> createBook(@Valid @RequestBody BookRequest request) { return ResponseEntity.ok(ApiResponse.success(bookService.create(request), "Book created")); }
    @GetMapping("/books/{id}")
    public ResponseEntity<ApiResponse<BookDto>> getBook(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(bookService.findById(id), "Book loaded")); }
    @PutMapping("/books/{id}")
    public ResponseEntity<ApiResponse<BookDto>> updateBook(@PathVariable UUID id, @Valid @RequestBody BookRequest request) { return ResponseEntity.ok(ApiResponse.success(bookService.update(id, request), "Book updated")); }
    @DeleteMapping("/books/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteBook(@PathVariable UUID id) { bookService.delete(id); return ResponseEntity.ok(ApiResponse.success(null, "Book deleted")); }
    @PatchMapping("/books/{id}/published")
    public ResponseEntity<ApiResponse<BookDto>> toggleBookPublished(@PathVariable UUID id, @RequestBody Map<String, Boolean> payload) { return ResponseEntity.ok(ApiResponse.success(bookService.setPublished(id, payload.getOrDefault("published", false)), "Book publication status updated")); }
    @PatchMapping("/books/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderBooks(@RequestBody List<UUID> ids) { bookService.reorder(ids); return ResponseEntity.ok(ApiResponse.success(null, "Book order updated")); }

    @GetMapping("/publications")
    public ResponseEntity<ApiResponse<List<PublicationDto>>> listPublications() { return ResponseEntity.ok(ApiResponse.success(publicationService.findAllAdmin(), "Publications loaded")); }
    @PostMapping("/publications")
    public ResponseEntity<ApiResponse<PublicationDto>> createPublication(@Valid @RequestBody PublicationRequest request) { return ResponseEntity.ok(ApiResponse.success(publicationService.create(request), "Publication created")); }
    @GetMapping("/publications/{id}")
    public ResponseEntity<ApiResponse<PublicationDto>> getPublication(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(publicationService.findById(id), "Publication loaded")); }
    @PutMapping("/publications/{id}")
    public ResponseEntity<ApiResponse<PublicationDto>> updatePublication(@PathVariable UUID id, @Valid @RequestBody PublicationRequest request) { return ResponseEntity.ok(ApiResponse.success(publicationService.update(id, request), "Publication updated")); }
    @DeleteMapping("/publications/{id}")
    public ResponseEntity<ApiResponse<Void>> deletePublication(@PathVariable UUID id) { publicationService.delete(id); return ResponseEntity.ok(ApiResponse.success(null, "Publication deleted")); }
    @PatchMapping("/publications/{id}/published")
    public ResponseEntity<ApiResponse<PublicationDto>> togglePublicationPublished(@PathVariable UUID id, @RequestBody Map<String, Boolean> payload) { return ResponseEntity.ok(ApiResponse.success(publicationService.setPublished(id, payload.getOrDefault("published", false)), "Publication publication status updated")); }
    @PatchMapping("/publications/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderPublications(@RequestBody List<UUID> ids) { publicationService.reorder(ids); return ResponseEntity.ok(ApiResponse.success(null, "Publication order updated")); }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> listProjects() { return ResponseEntity.ok(ApiResponse.success(projectService.findAllAdmin(), "Projects loaded")); }
    @PostMapping("/projects")
    public ResponseEntity<ApiResponse<ProjectDto>> createProject(@Valid @RequestBody ProjectRequest request) { return ResponseEntity.ok(ApiResponse.success(projectService.create(request), "Project created")); }
    @GetMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProject(@PathVariable UUID id) { return ResponseEntity.ok(ApiResponse.success(projectService.findById(id), "Project loaded")); }
    @PutMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<ProjectDto>> updateProject(@PathVariable UUID id, @Valid @RequestBody ProjectRequest request) { return ResponseEntity.ok(ApiResponse.success(projectService.update(id, request), "Project updated")); }
    @DeleteMapping("/projects/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProject(@PathVariable UUID id) { projectService.delete(id); return ResponseEntity.ok(ApiResponse.success(null, "Project deleted")); }
    @PatchMapping("/projects/{id}/published")
    public ResponseEntity<ApiResponse<ProjectDto>> toggleProjectPublished(@PathVariable UUID id, @RequestBody Map<String, Boolean> payload) { return ResponseEntity.ok(ApiResponse.success(projectService.setPublished(id, payload.getOrDefault("published", false)), "Project publication status updated")); }
    @PatchMapping("/projects/reorder")
    public ResponseEntity<ApiResponse<Void>> reorderProjects(@RequestBody List<UUID> ids) { projectService.reorder(ids); return ResponseEntity.ok(ApiResponse.success(null, "Project order updated")); }

    @GetMapping("/cv")
    public ResponseEntity<ApiResponse<CvDocumentDto>> getCv() { return ResponseEntity.ok(ApiResponse.success(cvService.getActiveCv(), "CV loaded")); }
    @PutMapping("/cv")
    public ResponseEntity<ApiResponse<CvDocumentDto>> upsertCv(@Valid @RequestBody CvRequest request) { return ResponseEntity.ok(ApiResponse.success(cvService.upsertCv(request), "CV updated")); }
    @PostMapping("/cv/document")
    public ResponseEntity<ApiResponse<CvDocumentDto>> createCvDocument(@Valid @RequestBody CvRequest request) { return ResponseEntity.ok(ApiResponse.success(cvService.upsertCv(request), "CV document created")); }
    @DeleteMapping("/cv/document")
    public ResponseEntity<ApiResponse<Void>> deleteCvDocument() { cvService.deleteDocument(); return ResponseEntity.ok(ApiResponse.success(null, "CV document deleted")); }
    @PatchMapping("/cv/activate")
    public ResponseEntity<ApiResponse<CvDocumentDto>> activateDocument(@RequestBody Map<String, UUID> payload) { return ResponseEntity.ok(ApiResponse.success(cvService.activateDocument(payload.get("documentId")), "CV activated")); }
}
