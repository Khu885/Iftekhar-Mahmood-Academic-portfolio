package com.akif.uncleportfolio.controller;

import com.akif.uncleportfolio.dto.ApiResponse;
import com.akif.uncleportfolio.dto.book.BookDto;
import com.akif.uncleportfolio.dto.cv.CvDocumentDto;
import com.akif.uncleportfolio.dto.project.ProjectDto;
import com.akif.uncleportfolio.dto.publication.PublicationDto;
import com.akif.uncleportfolio.entity.Book;
import com.akif.uncleportfolio.entity.FileAsset;
import com.akif.uncleportfolio.entity.Publication;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.BookRepository;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import com.akif.uncleportfolio.repository.ProjectRepository;
import com.akif.uncleportfolio.repository.PublicationRepository;
import com.akif.uncleportfolio.service.BookService;
import com.akif.uncleportfolio.service.CvService;
import com.akif.uncleportfolio.service.ProjectService;
import com.akif.uncleportfolio.service.PublicationService;
import java.io.IOException;
import java.util.List;
import java.util.UUID;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/public")
public class PublicContentController {
    private final BookService bookService;
    private final PublicationService publicationService;
    private final ProjectService projectService;
    private final CvService cvService;
    private final BookRepository bookRepository;
    private final PublicationRepository publicationRepository;
    private final ProjectRepository projectRepository;
    private final FileAssetRepository fileAssetRepository;

    public PublicContentController(BookService bookService, PublicationService publicationService,
                                 ProjectService projectService, CvService cvService,
                                 BookRepository bookRepository, PublicationRepository publicationRepository,
                                 ProjectRepository projectRepository, FileAssetRepository fileAssetRepository) {
        this.bookService = bookService;
        this.publicationService = publicationService;
        this.projectService = projectService;
        this.cvService = cvService;
        this.bookRepository = bookRepository;
        this.publicationRepository = publicationRepository;
        this.projectRepository = projectRepository;
        this.fileAssetRepository = fileAssetRepository;
    }

    @GetMapping("/books")
    public ResponseEntity<ApiResponse<List<BookDto>>> getBooks() {
        return ResponseEntity.ok(ApiResponse.success(bookService.findAllPublic(), "Books loaded"));
    }

    @GetMapping("/books/{slug}")
    public ResponseEntity<ApiResponse<BookDto>> getBook(@PathVariable String slug) {
        Book book = bookRepository.findBySlug(slug).orElseThrow(() -> new ApiException("Book not found"));
        if (!book.isPublished()) throw new ApiException("Book not found");
        return ResponseEntity.ok(ApiResponse.success(bookService.findById(book.getId()), "Book loaded"));
    }

    @Transactional(readOnly = true)
    @GetMapping("/books/{slug}/pdf")
    public ResponseEntity<Resource> getBookPdf(@PathVariable String slug) {
        Book book = bookRepository.findBySlugWithAssets(slug).orElseThrow(() -> new ApiException("Book not found"));
        if (!book.isPublished()) throw new ApiException("Book not found");
        FileAsset asset = book.getPdfAsset();
        if (asset == null && book.getPdfExternalUrl() != null) {
            return ResponseEntity.status(302).header(HttpHeaders.LOCATION, book.getPdfExternalUrl()).build();
        }
        if (asset == null) throw new ApiException("PDF not available");
        return buildFileResponse(asset);
    }

    @Transactional(readOnly = true)
    @GetMapping("/books/{slug}/cover")
    public ResponseEntity<Resource> getBookCover(@PathVariable String slug) {
        Book book = bookRepository.findBySlugWithAssets(slug).orElseThrow(() -> new ApiException("Book not found"));
        FileAsset asset = book.getCoverAsset();
        if (asset == null) throw new ApiException("Cover not available");
        return buildFileResponse(asset);
    }

    @GetMapping("/publications")
    public ResponseEntity<ApiResponse<List<PublicationDto>>> getPublications(
            @RequestParam(required = false) String title,
            @RequestParam(required = false) String authors,
            @RequestParam(required = false) String journal,
            @RequestParam(required = false) String tags,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) String keyword) {
        return ResponseEntity.ok(ApiResponse.success(publicationService.findAllPublic(title, authors, journal, tags, year, keyword), "Publications loaded"));
    }

    @GetMapping("/publications/{slug}")
    public ResponseEntity<ApiResponse<PublicationDto>> getPublication(@PathVariable String slug) {
        Publication publication = publicationRepository.findBySlug(slug).orElseThrow(() -> new ApiException("Publication not found"));
        if (!publication.isPublished()) throw new ApiException("Publication not found");
        return ResponseEntity.ok(ApiResponse.success(publicationService.findById(publication.getId()), "Publication loaded"));
    }

    @Transactional(readOnly = true)
    @GetMapping("/publications/{slug}/pdf")
    public ResponseEntity<Resource> getPublicationPdf(@PathVariable String slug) {
        Publication publication = publicationRepository.findBySlugWithAssets(slug)
                .or(() -> publicationRepository.findBySlug(slug))
                .orElseThrow(() -> new ApiException("Publication not found"));
        if (!publication.isPublished()) throw new ApiException("Publication not found");
        FileAsset asset = publication.getPdfAsset();
        if (asset == null && publication.getPdfExternalUrl() != null) {
            return ResponseEntity.status(302).header(HttpHeaders.LOCATION, publication.getPdfExternalUrl()).build();
        }
        if (asset == null) throw new ApiException("PDF not available");
        return buildFileResponse(asset);
    }

    @GetMapping("/projects")
    public ResponseEntity<ApiResponse<List<ProjectDto>>> getProjects() {
        return ResponseEntity.ok(ApiResponse.success(projectService.findAllPublic(), "Projects loaded"));
    }

    @GetMapping("/projects/{slug}")
    public ResponseEntity<ApiResponse<ProjectDto>> getProject(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.success(projectService.findAllPublic().stream()
                .filter(item -> slug.equals(item.slug())).findFirst().orElseThrow(() -> new ApiException("Project not found")), "Project loaded"));
    }

    @GetMapping("/cv")
    public ResponseEntity<ApiResponse<CvDocumentDto>> getCv() {
        return ResponseEntity.ok(ApiResponse.success(cvService.getActiveCv(), "CV loaded"));
    }

    @GetMapping("/cv/pdf")
    public ResponseEntity<Resource> getCvPdf() {
        CvDocumentDto cv = cvService.getActiveCv();
        if (cv == null || cv.assetId() == null) throw new ApiException("CV PDF not available");
        FileAsset asset = fileAssetRepository.findById(cv.assetId()).orElseThrow(() -> new ApiException("CV PDF not available"));
        return buildFileResponse(asset);
    }

    private ResponseEntity<Resource> buildFileResponse(FileAsset asset) {
        byte[] content = asset.getFileData();
        ByteArrayResource resource = new ByteArrayResource(content);
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(asset.getContentType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + asset.getOriginalFilename() + "\"")
                .contentLength(content.length)
                .body(resource);
    }
}
