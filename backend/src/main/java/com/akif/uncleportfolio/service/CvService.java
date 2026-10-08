package com.akif.uncleportfolio.service;

import com.akif.uncleportfolio.dto.cv.CvDocumentDto;
import com.akif.uncleportfolio.dto.cv.CvEntryDto;
import com.akif.uncleportfolio.dto.cv.CvRequest;
import com.akif.uncleportfolio.dto.cv.CvSectionDto;
import com.akif.uncleportfolio.entity.CvDocument;
import com.akif.uncleportfolio.entity.FileAsset;
import com.akif.uncleportfolio.entity.CvEntry;
import com.akif.uncleportfolio.entity.CvSection;
import com.akif.uncleportfolio.exception.ApiException;
import com.akif.uncleportfolio.repository.CvDocumentRepository;
import com.akif.uncleportfolio.repository.CvEntryRepository;
import com.akif.uncleportfolio.repository.CvSectionRepository;
import com.akif.uncleportfolio.repository.FileAssetRepository;
import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CvService {
    private final CvDocumentRepository cvDocumentRepository;
    private final CvSectionRepository cvSectionRepository;
    private final CvEntryRepository cvEntryRepository;
    private final FileAssetRepository fileAssetRepository;

    public CvService(CvDocumentRepository cvDocumentRepository, CvSectionRepository cvSectionRepository, CvEntryRepository cvEntryRepository, FileAssetRepository fileAssetRepository) {
        this.cvDocumentRepository = cvDocumentRepository;
        this.cvSectionRepository = cvSectionRepository;
        this.cvEntryRepository = cvEntryRepository;
        this.fileAssetRepository = fileAssetRepository;
    }

    @Transactional(readOnly = true)
    public CvDocumentDto getActiveCv() {
        CvDocument document = cvDocumentRepository.findByActiveTrue().orElseGet(() -> cvDocumentRepository.findFirstByOrderByCreatedAtDesc().orElse(null));
        if (document == null) {
            return buildDefaultCv();
        }
        return toDto(document);
    }

    @Transactional
    public CvDocumentDto upsertCv(CvRequest request) {
        CvDocument document = cvDocumentRepository.findByActiveTrue()
                .orElseGet(() -> cvDocumentRepository.findFirstByOrderByCreatedAtDesc().orElseGet(CvDocument::new));
        document.setTitle(request.title());
        document.setDescription(request.description());
        document.setExternalUrl(request.externalUrl());
        document.setAsset(resolveAsset(request.assetId()));
        document.setActive(request.active() == null ? true : request.active());
        document.setCreatedAt(document.getCreatedAt() == null ? OffsetDateTime.now() : document.getCreatedAt());
        document.setUpdatedAt(OffsetDateTime.now());
        cvDocumentRepository.save(document);
        if (request.sections() != null) {
            upsertSections(document, request.sections());
        }
        return toDto(document);
    }

    @Transactional
    public void deleteDocument() {
        List<CvDocument> docs = cvDocumentRepository.findAll();
        if (docs.isEmpty()) {
            throw new ApiException("No CV document found");
        }
        cvDocumentRepository.deleteAll(docs);
    }

    @Transactional
    public CvDocumentDto activateDocument(UUID documentId) {
        List<CvDocument> docs = cvDocumentRepository.findAll();
        for (CvDocument doc : docs) {
            doc.setActive(doc.getId().equals(documentId));
            cvDocumentRepository.save(doc);
        }
        CvDocument document = cvDocumentRepository.findById(documentId).orElseThrow(() -> new ApiException("CV document not found"));
        return toDto(document);
    }

    private void upsertSections(CvDocument document, List<CvSectionDto> sections) {
        cvEntryRepository.deleteAll();
        cvSectionRepository.deleteAll();
        for (int i = 0; i < sections.size(); i++) {
            CvSectionDto sectionDto = sections.get(i);
            CvSection section = new CvSection();
            section.setSectionType(sectionDto.sectionType());
            section.setTitle(sectionDto.title());
            section.setDisplayOrder(sectionDto.displayOrder() == null ? i : sectionDto.displayOrder());
            section.setVisible(sectionDto.visible());
            cvSectionRepository.save(section);
            if (sectionDto.entries() != null) {
                for (int j = 0; j < sectionDto.entries().size(); j++) {
                    CvEntryDto entryDto = sectionDto.entries().get(j);
                    CvEntry entry = new CvEntry();
                    entry.setSection(section);
                    entry.setHeading(entryDto.heading());
                    entry.setOrganization(entryDto.organization());
                    entry.setLocation(entryDto.location());
                    entry.setStartDate(entryDto.startDate());
                    entry.setEndDate(entryDto.endDate());
                    entry.setDescription(entryDto.description());
                    entry.setDisplayOrder(entryDto.displayOrder() == null ? j : entryDto.displayOrder());
                    cvEntryRepository.save(entry);
                }
            }
        }
    }

    private CvDocumentDto buildDefaultCv() {
        List<CvSectionDto> sections = new ArrayList<>();
        sections.add(new CvSectionDto(UUID.randomUUID(), "Core Expertise", "Core Expertise", 0, true, List.of(
                new CvEntryDto(UUID.randomUUID(), "Regulatory Affairs", null, null, null, null, "IND, NDA, and BLA submission strategy; FDA meeting preparation (Pre-IND, EOP2, Pre-BLA/NDA); Due Diligence & Gap Analysis; Orphan Drug Designations and Pediatric Study Plans (iPSP/PIP).", 0),
                new CvEntryDto(UUID.randomUUID(), "Clinical Pharmacology & Methodological Expertise", null, null, null, null, "Pediatric dose optimization, Animal Rule, First-in-Human (FIH) dose estimation, Drug-Drug Interactions (DDIs), and Exposure-Response analysis; Interspecies allometric scaling, non-compartmental and population PK (PopPK), and physiological modeling.", 1),
                new CvEntryDto(UUID.randomUUID(), "Therapeutic Modalities & Classes", null, null, null, null, "Small molecules, Monoclonal Antibodies (mAbs), Antibody-Drug Conjugates (ADCs), Coagulation Factors, Immunoglobulins, Cell & Gene Therapies.", 2),
                new CvEntryDto(UUID.randomUUID(), "FDA Working Groups & Regulatory Guidances", null, null, null, null, "Contributed to multiple inter-center CDER and CBER working groups tasked with authoring FDA guidance documents for the pharmaceutical industry.", 3)
        )));
        sections.add(new CvSectionDto(UUID.randomUUID(), "Professional Experience", "Professional Experience", 1, true, List.of(
                new CvEntryDto(UUID.randomUUID(), "Founder & CEO / Principal Consultant", "Mahmood Clinical Pharmacology Consulting, LLC", "Rockville, MD", "September 2019", "Present", "• Provide independent clinical pharmacology and regulatory advisory services to pharmaceutical and biotech clients worldwide.\n• Guide first-in-human and pediatric clinical pharmacology programs, including trial design, dose selection, and modeling protocols.\n• Author and audit regulatory briefing packages, investigator brochures, clinical protocols, and Module 2/5 CTD submission dossiers.", 0),
                new CvEntryDto(UUID.randomUUID(), "Senior Clinical Pharmacologist & Team Leader", "US Food and Drug Administration (FDA)", "Silver Spring & Rockville, MD", "1993", "2019", "• Center for Biologics Evaluation and Research (CBER): Served as Team Leader overseeing clinical and non-clinical pharmacology reviews. Formulated clinical pharmacology review frameworks within the Office of Blood Review and Research (OBRR) and the Office of Tissues and Advanced Therapeutics (OTAT). Evaluated complex biologics including blood coagulation factors, immunoglobulins, antibodies, and advanced regenerative medicines.\n• Center for Drug Evaluation and Research (CDER): Conducted primary pharmacokinetics, safety, and efficacy evaluations for neurological and analgesic therapeutics. Served as Principal Investigator on 3 FDA internal research grants (anti-epileptics, pediatric pharmacology, and DDI mechanisms). Participated in multiple agency-wide CDER/CBER guidance-writing committees shaping industry regulatory standards.", 1)
        )));
        sections.add(new CvSectionDto(UUID.randomUUID(), "Education", "Education", 2, true, List.of(
                new CvEntryDto(UUID.randomUUID(), "Ph.D. in Pharmaceutical Sciences (Pharmacokinetics)", "University of Missouri – Kansas City (UMKC)", "Kansas City, MO", "1993", null, null, 0),
                new CvEntryDto(UUID.randomUUID(), "M.S. in Pharmaceutical Sciences", "West Virginia University", "Morgantown, WV", null, null, null, 1),
                new CvEntryDto(UUID.randomUUID(), "Bachelor of Pharmacy (B.Pharm)", "University of Karachi", "Karachi, Pakistan", null, null, null, 2)
        )));
        sections.add(new CvSectionDto(UUID.randomUUID(), "Honors & Awards", "Honors & Awards", 3, true, List.of(
                new CvEntryDto(UUID.randomUUID(), "FDA CDER Center Director Special Citation", null, null, null, null, null, 0),
                new CvEntryDto(UUID.randomUUID(), "FDA Commendable Service Award", null, null, null, null, null, 1),
                new CvEntryDto(UUID.randomUUID(), "Principal Investigator, 3 US FDA CDER Competitive Research Grants", null, null, null, null, "Competitive research grants covering anti-epileptic drugs, pediatric clinical pharmacology, and drug-drug interactions (DDIs).", 2),
                new CvEntryDto(UUID.randomUUID(), "Rho Chi Pharmacy Academic Honor Society", null, null, null, null, null, 3)
        )));
        sections.add(new CvSectionDto(UUID.randomUUID(), "Selected Books & Publications", "Selected Books & Publications", 4, true, List.of(
                new CvEntryDto(UUID.randomUUID(), "Fundamentals of Pediatric Drug Dosing", "Springer Nature", null, null, null, "Author of seminal reference textbook on principles and clinical application of pediatric drug dosing.", 0),
                new CvEntryDto(UUID.randomUUID(), "Interspecies Pharmacokinetic Scaling: Principles and Application of Allometric Scaling", "Pine House Enterprises", null, null, null, "Author of reference textbook on principles and application of allometric scaling for FIH dose prediction.", 1),
                new CvEntryDto(UUID.randomUUID(), "Peer-Reviewed Scientific Articles (125+ Papers)", null, null, null, null, "Author / Co-Author of over 125 peer-reviewed scientific articles in high-impact journals including Journal of Pharmaceutical Sciences, American Journal of Therapeutics, Clinical Pharmacokinetics, and Antibodies.", 2),
                new CvEntryDto(UUID.randomUUID(), "Historical & Non-Scientific Publications", null, null, null, null, "• Islam Beyond Terrorists and Terrorism: Biographies of the Most Influential Muslims in History (University Press of America, 2002)\n• The Rise and Fall of the Islamic Empires", 3)
        )));
        return new CvDocumentDto(UUID.randomUUID(), "Iftekhar Mahmood, Ph.D.", "Senior Clinical Pharmacologist with over 30 years of regulatory and drug development experience, including 26 years at the US FDA (CDER and CBER). Founder and CEO of Mahmood Clinical Pharmacology Consulting, LLC, advising biopharmaceutical sponsors globally on Phase 1–4 clinical pharmacology programs, IND/NDA/BLA regulatory submissions, pediatric dosing, allometric scaling, and translational PK/PD strategies across small and large molecules.", null, "Rockville, MD, USA | Iftekharmahmood@aol.com", true, sections, null, null);
    }

    private CvDocumentDto toDto(CvDocument document) {
        List<CvSectionDto> sections = new ArrayList<>();
        for (CvSection section : cvSectionRepository.findByVisibleTrueOrderByDisplayOrderAsc()) {
            List<CvEntryDto> entries = cvEntryRepository.findBySectionIdOrderByDisplayOrderAsc(section.getId()).stream()
                    .map(entry -> new CvEntryDto(entry.getId(), entry.getHeading(), entry.getOrganization(), entry.getLocation(), entry.getStartDate(), entry.getEndDate(), entry.getDescription(), entry.getDisplayOrder()))
                    .toList();
            sections.add(new CvSectionDto(section.getId(), section.getSectionType(), section.getTitle(), section.getDisplayOrder(), section.isVisible(), entries));
        }
        return new CvDocumentDto(
                document.getId(),
                document.getTitle(),
                document.getDescription(),
                document.getAsset() == null ? null : document.getAsset().getId(),
                document.getExternalUrl(),
                document.isActive(),
                sections,
                document.getCreatedAt() == null ? null : document.getCreatedAt().toString(),
                document.getUpdatedAt() == null ? null : document.getUpdatedAt().toString()
        );
    }

    private FileAsset resolveAsset(java.util.UUID assetId) {
        if (assetId == null) {
            return null;
        }
        return fileAssetRepository.findById(assetId).orElseThrow(() -> new ApiException("File asset not found"));
    }
}
