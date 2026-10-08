"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/layout/Header";
import HeroBanner from "@/components/layout/HeroBanner";
import Sidebar from "@/components/layout/Sidebar";
import Footer from "@/components/layout/Footer";
import FloatingTools from "@/components/layout/FloatingTools";
import Toast from "@/components/ui/Toast";
import { loadPortfolioContent } from "@/lib/portfolio-api";

import AboutTab from "@/components/tabs/AboutTab";
import PublicationsTab from "@/components/tabs/PublicationsTab";
import ProjectsTab from "@/components/tabs/ProjectsTab";
import BooksTab from "@/components/tabs/BooksTab";
import CvTab from "@/components/tabs/CvTab";
import ContactTab from "@/components/tabs/ContactTab";

import AbstractModal from "@/components/modals/AbstractModal";
import CiteModal from "@/components/modals/CiteModal";
import BookPreviewModal from "@/components/modals/BookPreviewModal";
import QrModal from "@/components/modals/QrModal";
import TranslateModal from "@/components/modals/TranslateModal";
import PrivacyModal from "@/components/modals/PrivacyModal";

export default function Home() {
  const [activeTab, setActiveTab] = useState("home");
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [portfolio, setPortfolio] = useState({
    books: [],
    publications: [],
    projects: [],
    cv: null,
  });
  const [contentLoading, setContentLoading] = useState(true);
  const [contentError, setContentError] = useState("");

  // Toast notification state
  const [toastMessage, setToastMessage] = useState("");
  const [toastVisible, setToastVisible] = useState(false);
  const toastTimeoutRef = useRef(null);

  const showToast = useCallback((msg) => {
    if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    setToastMessage(msg);
    setToastVisible(true);
    toastTimeoutRef.current = setTimeout(() => {
      setToastVisible(false);
    }, 3000);
  }, []);

  // Sync with initial URL hash
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.replace("#", "");
      const validTabs = ["home", "publications", "projects", "books", "cv", "contact"];
      if (validTabs.includes(hash)) {
        setActiveTab(hash);
      }
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadContent() {
      try {
        const data = await loadPortfolioContent();
        if (!cancelled) {
          setPortfolio(data);
          setContentError("");
        }
      } catch (error) {
        if (!cancelled) {
          setContentError(error instanceof Error ? error.message : "Failed to load portfolio content");
        }
      } finally {
        if (!cancelled) {
          setContentLoading(false);
        }
      }
    }

    loadContent();
    return () => {
      cancelled = true;
    };
  }, []);

  // Update hash when active tab changes
  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", `#${tabId}`);
    }
  };

  // Text-Only Accessibility Mode
  const toggleTextOnly = useCallback(() => {
    const isTextOnly = document.body.classList.toggle("owl-text-only");
    showToast(isTextOnly ? "Text-Only Mode Enabled" : "Standard View Restored");
  }, [showToast]);

  // Share profile
  const handleShare = useCallback(async () => {
    const profileUrl = "https://www.linkedin.com/in/iftekhar-mahmood-78981b192/";
    try {
      await navigator.clipboard.writeText(profileUrl);
      showToast("Profile link copied to clipboard");
    } catch {
      showToast("Profile link: " + profileUrl);
    }
  }, [showToast]);

  // Modal openers
  const openAbstract = useCallback((pub) => {
    setModalData(pub);
    setActiveModal("abstract");
  }, []);

  const openCite = useCallback((citation) => {
    setModalData(citation);
    setActiveModal("cite");
  }, []);

  const openBookPreview = useCallback((book) => {
    setModalData(book);
    setActiveModal("book-preview");
  }, []);

  const openModal = useCallback((type) => {
    setActiveModal(type);
  }, []);

  const closeModal = useCallback(() => {
    setActiveModal(null);
    setModalData(null);
  }, []);

  return (
    <>
      {/* Sleek Modern Header */}
      <Header activeTab={activeTab} onSelectTab={handleSelectTab} />

      {/* Hero / Banner Section */}
      <HeroBanner />

      {/* Main Grid Content */}
      <main className="max-w-6xl mx-auto px-6 w-full flex-grow pb-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 mt-0">
          {/* Left Sidebar */}
          <Sidebar onSelectTab={handleSelectTab} />

          {/* Right Main Content Area */}
          <section className="md:col-span-8 lg:col-span-8.5 pt-4 sm:pt-6">
            {activeTab === "home" && <AboutTab onSelectTab={handleSelectTab} />}
            {activeTab === "publications" && (
              <PublicationsTab
                publications={portfolio.publications}
                loading={contentLoading}
                error={contentError}
                onOpenAbstract={openAbstract}
                onOpenCite={openCite}
              />
            )}
            {activeTab === "projects" && (
              <ProjectsTab
                projects={portfolio.projects}
                loading={contentLoading}
                error={contentError}
              />
            )}
            {activeTab === "books" && (
              <BooksTab
                books={portfolio.books}
                loading={contentLoading}
                error={contentError}
                onOpenBookPreview={openBookPreview}
              />
            )}
            {activeTab === "cv" && (
              <CvTab cv={portfolio.cv} loading={contentLoading} error={contentError} />
            )}
            {activeTab === "contact" && (
              <ContactTab onShowToast={showToast} />
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenModal={openModal}
        onShare={handleShare}
        onToggleTextOnly={toggleTextOnly}
      />

      {/* Floating Tools Quick Access */}
      <FloatingTools
        onOpenModal={openModal}
        onToggleTextOnly={toggleTextOnly}
      />

      {/* Modals */}
      <AbstractModal
        isOpen={activeModal === "abstract"}
        onClose={closeModal}
        data={modalData}
      />
      <CiteModal
        isOpen={activeModal === "cite"}
        onClose={closeModal}
        citation={modalData}
        onCopySuccess={showToast}
      />
      <BookPreviewModal
        isOpen={activeModal === "book-preview"}
        onClose={closeModal}
        book={modalData}
      />
      <QrModal
        isOpen={activeModal === "qr"}
        onClose={closeModal}
      />
      <TranslateModal
        isOpen={activeModal === "translate"}
        onClose={closeModal}
        onSelectLanguage={(lang) => showToast(`Translated to ${lang}`)}
      />
      <PrivacyModal
        isOpen={activeModal === "privacy"}
        onClose={closeModal}
      />

      {/* Toast Notice */}
      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
