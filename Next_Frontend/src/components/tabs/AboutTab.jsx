"use client";

export default function AboutTab({ onSelectTab }) {
  const handleNav = (tabId) => {
    onSelectTab(tabId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Section Title */}
      <h1 className="text-3xl sm:text-[34px] font-bold text-gray-950 tracking-tight">
        About me
      </h1>

      {/* Lead Sentence */}
      <p className="text-[17px] text-gray-800 font-normal leading-relaxed">
        Clinical pharmacologist, regulatory strategist, and researcher exploring
        interspecies pharmacokinetic scaling, pediatric dose prediction, and biologics disposition.
      </p>

      {/* Main Narrative Body */}
      <div className="text-[15px] text-gray-700 leading-relaxed space-y-4 font-normal">
        <p>
          I am a senior clinical pharmacologist with over{" "}
          <strong>25 years of service at the United States Food and Drug Administration (FDA)</strong>.
          During my tenure at the FDA, I served as a Senior Review Pharmacologist and Team Leader across
          both the <strong>Center for Drug Evaluation and Research (CDER)</strong> and the{" "}
          <strong>Center for Biologics Evaluation and Research (CBER)</strong>.
        </p>

        <p>
          From 1993 to 2019, my regulatory and scientific purview spanned neurological medications,
          anesthetics, and analgesics in CDER (9 years), followed by therapeutic proteins including
          monoclonal antibodies, antibody-drug conjugates (ADCs), coagulation factors VIII &amp; IX, and
          immunoglobulins in CBER (16 years). I evaluated hundreds of Investigational New Drugs (INDs),
          New Drug Applications (NDAs), and Biologics License Applications (BLAs), and served as
          Principal Investigator on <strong>3 FDA CDER internal research grants</strong>.
        </p>

        <p>
          Beyond regulatory decision-making, my research focuses on{" "}
          <strong>interspecies pharmacokinetic allometric scaling</strong>,{" "}
          <strong>pediatric dose prediction (including the Salisbury Rule and GFR maturation models)</strong>,
          and <strong>minimal physiologically based pharmacokinetic (mPBPK) modeling</strong>. To
          date, I have authored or co-authored over <strong>125 peer-reviewed scientific articles</strong>{" "}
          and published <strong>8 academic textbooks</strong> utilized by drug developers and
          regulatory scientists worldwide.
        </p>

        <p>
          Additional information about my work can be found in the{" "}
          <button
            onClick={() => handleNav("publications")}
            className="owl-link inline font-medium"
          >
            publications
          </button>
          ,{" "}
          <button
            onClick={() => handleNav("projects")}
            className="owl-link inline font-medium"
          >
            projects
          </button>
          , and{" "}
          <button
            onClick={() => handleNav("books")}
            className="owl-link inline font-medium"
          >
            books
          </button>{" "}
          sections, which offer deeper insights into the methodologies I employ and the research
          questions I investigate. For inquiries, regulatory advisory, or scientific collaborations,
          feel free to get in touch by{" "}
          <button
            onClick={() => handleNav("contact")}
            className="owl-link inline font-medium"
          >
            sending me a note
          </button>
          .
        </p>
      </div>
    </div>
  );
}
