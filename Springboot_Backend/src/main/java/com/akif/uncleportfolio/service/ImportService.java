package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.entity.Book;
import com.akif.uncleportfolio.entity.Project;
import com.akif.uncleportfolio.entity.ProjectHighlight;
import com.akif.uncleportfolio.entity.Publication;
import com.akif.uncleportfolio.repository.BookRepository;
import com.akif.uncleportfolio.repository.ProjectRepository;
import com.akif.uncleportfolio.repository.PublicationRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.net.URL;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.event.EventListener;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ImportService {
    private final ObjectMapper objectMapper = new ObjectMapper();
    private final BookRepository bookRepository;
    private final PublicationRepository publicationRepository;
    private final ProjectRepository projectRepository;

    public ImportService(BookRepository bookRepository, PublicationRepository publicationRepository, ProjectRepository projectRepository) {
        this.bookRepository = bookRepository;
        this.publicationRepository = publicationRepository;
        this.projectRepository = projectRepository;
    }

    @EventListener(ApplicationReadyEvent.class)
    @Transactional
    public void importExistingData() throws IOException {
        if (bookRepository.count() > 0 || publicationRepository.count() > 0 || projectRepository.count() > 0) {
            return;
        }

        JsonNode booksNode = objectMapper.readTree(new URL("file:../my-next-portfolio-app/src/data/books.json"));
        for (JsonNode node : booksNode) {
            Book book = new Book();
            book.setSlug(node.path("id").asText());
            book.setTitle(node.path("title").asText());
            book.setSubtitle(node.path("subtitle").asText(null));
            book.setAuthor(node.path("author").asText(null));
            book.setPublisher(node.path("publisher").asText(null));
            book.setPublicationYear(parseInt(node.path("year").asText(null)));
            book.setDescription(node.path("description").asText(null));
            book.setExternalBookUrl(node.path("link").asText(null));
            book.setIsbn(node.path("isbn").asText(null));
            book.setPublished(true);
            book.setDisplayOrder(0);
            book.setCreatedAt(OffsetDateTime.now());
            book.setUpdatedAt(OffsetDateTime.now());
            bookRepository.save(book);
        }

        JsonNode publicationsNode = objectMapper.readTree(new URL("file:../my-next-portfolio-app/src/data/publications.json"));
        Iterator<Map.Entry<String, JsonNode>> fields = publicationsNode.fields();
        while (fields.hasNext()) {
            Map.Entry<String, JsonNode> entry = fields.next();
            JsonNode node = entry.getValue();
            Publication publication = new Publication();
            publication.setSlug(node.path("id").asText(entry.getKey()));
            publication.setTitle(node.path("title").asText());
            publication.setAuthors(node.path("authors").asText(null));
            publication.setJournal(node.path("journal").asText(null));
            publication.setAbstractText(node.path("text").asText(null));
            publication.setCitation(node.path("citation").asText(null));
            publication.setOriginalPublicationUrl(node.path("originalLink").asText(null));
            publication.setPdfExternalUrl(node.path("pdfLink").asText(null));
            publication.setTags(parseTags(node.path("tags").asText(null)));
            publication.setPublished(true);
            publication.setDisplayOrder(0);
            publication.setCreatedAt(OffsetDateTime.now());
            publication.setUpdatedAt(OffsetDateTime.now());
            publicationRepository.save(publication);
        }

        JsonNode projectsNode = objectMapper.readTree(new URL("file:../my-next-portfolio-app/src/data/projects.json"));
        for (JsonNode node : projectsNode) {
            Project project = new Project();
            project.setSlug(node.path("id").asText());
            project.setTitle(node.path("title").asText());
            project.setCategory(node.path("category").asText(null));
            project.setStatus(node.path("status").asText(null));
            project.setDescription(node.path("description").asText(null));
            project.setPublished(true);
            project.setDisplayOrder(0);
            project.setCreatedAt(OffsetDateTime.now());
            project.setUpdatedAt(OffsetDateTime.now());
            Project saved = projectRepository.save(project);
            ArrayList<ProjectHighlight> list = new ArrayList<>();
            for (JsonNode highlightNode : node.path("highlights")) {
                ProjectHighlight highlight = new ProjectHighlight();
                highlight.setProject(saved);
                highlight.setHighlightText(highlightNode.asText());
                highlight.setDisplayOrder(list.size());
                list.add(highlight);
            }
            saved.setHighlights(list);
            projectRepository.save(saved);
        }
    }

    private List<String> parseTags(String rawTags) {
        List<String> tags = new ArrayList<>();
        if (rawTags == null || rawTags.isBlank()) {
            return tags;
        }
        Arrays.stream(rawTags.split("[,\\s]+"))
                .map(String::trim)
                .filter(tag -> !tag.isEmpty())
                .forEach(tags::add);
        return tags;
    }

    private Integer parseInt(String value) {
        if (value == null || value.isBlank()) return null;
        try {
            return Integer.parseInt(value);
        } catch (NumberFormatException ex) {
            return null;
        }
    }
}
