"use client";

import { useState } from "react";
import Image from "next/image";

export default function Sidebar({ onSelectTab }) {
  const [imgError, setImgError] = useState(false);

  return (
    <aside className="md:col-span-4 lg:col-span-3 flex flex-col">
      {/* ── Mobile: horizontal card (photo left, info right) ── */}
      {/* ── Desktop: vertical card (photo top, info below) ── */}
      <div className="flex flex-row md:flex-col gap-3.5 sm:gap-4 md:gap-0">

        {/* Profile Portrait Photo */}
        <div className="profile-photo-container -mt-10 sm:-mt-16 md:-mt-20 shrink-0 relative z-10 w-fit">
          <div className="profile-photo-frame w-24 h-32 sm:w-36 sm:h-44 md:w-44 md:h-52 bg-gray-100 overflow-hidden rounded shadow-sm border border-white/60 flex items-center justify-center text-gray-700 relative">
            {!imgError ? (
              <Image
                src="/assets/images/iftekhar.jpg"
                alt="Iftekhar Mahmood, PhD"
                width={176}
                height={208}
                priority
                unoptimized
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center bg-gray-200 text-gray-800 font-bold text-2xl">
                IM
                <span className="text-xs font-normal text-gray-600 mt-1">Ph.D.</span>
              </div>
            )}
          </div>
        </div>

        {/* Name, Title, Links — shown inline on mobile, stacked on desktop */}
        <div className="flex flex-col justify-start pt-0 md:pt-0 flex-1 min-w-0">
          {/* Name & Professional Metadata */}
          <div className="space-y-0.5 md:space-y-1 md:mt-5">
            <h2 className="text-base sm:text-xl md:text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
              Iftekhar Mahmood
            </h2>
            <p className="text-[12px] sm:text-[13px] md:text-[14px] text-gray-600 font-normal leading-snug">
              Senior Clinical Pharmacologist &amp; Consultant
            </p>
          </div>

          {/* Department / Affiliation */}
          <div className="mt-1.5 md:mt-4 text-[11.5px] sm:text-[12.5px] md:text-[13.5px] text-gray-600 leading-snug md:leading-relaxed">
            <p className="truncate sm:whitespace-normal">Mahmood Clinical Pharmacology</p>
            <p>Rockville, Maryland, USA</p>
            <p className="text-[10.5px] sm:text-xs text-gray-500 mt-0.5 line-clamp-2 md:line-clamp-none">
              Former Senior Reviewer &amp; Team Lead, US FDA (25+ Years)
            </p>
          </div>

          {/* Academic & Social Profile Links */}
          <div className="mt-2.5 md:mt-4 pt-2 md:pt-4 border-t border-gray-100 grid grid-cols-2 md:grid-cols-1 gap-x-2 gap-y-1.5 md:space-y-2 text-[12px] sm:text-[13px] md:text-[13.5px]">
            {/* LinkedIn */}
            <div className="flex items-center space-x-2">
              <Image
                src="/assets/icons/linkedin.svg"
                alt="LinkedIn"
                width={15}
                height={15}
                className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0"
              />
              <a
                href="https://www.linkedin.com/in/iftekhar-mahmood-78981b192/"
                target="_blank"
                rel="noopener noreferrer"
                className="owl-link font-normal truncate"
              >
                LinkedIn
              </a>
            </div>

            {/* ResearchGate */}
            <div className="flex items-center space-x-2">
              <span className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-600 font-bold text-[10px] md:text-xs flex items-center justify-center shrink-0">
                R<sup>G</sup>
              </span>
              <a
                href="https://www.researchgate.net/profile/Iftekhar-Mahmood"
                target="_blank"
                rel="noopener noreferrer"
                className="owl-link font-normal truncate"
              >
                ResearchGate
              </a>
            </div>

            {/* ORCID */}
            <div className="flex items-center space-x-2">
              <Image
                src="/assets/icons/orcid.svg"
                alt="ORCID"
                width={15}
                height={15}
                className="w-3.5 h-3.5 md:w-4 md:h-4 shrink-0"
              />
              <a
                href="https://orcid.org/0000-0003-1311-4237"
                target="_blank"
                rel="noopener noreferrer"
                className="owl-link font-normal truncate"
              >
                ORCID
              </a>
            </div>

            {/* Contact link */}
            <div className="flex items-center space-x-2">
              <svg
                className="w-3.5 h-3.5 md:w-4 md:h-4 text-gray-500 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              <button
                onClick={() => {
                  onSelectTab("contact");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="owl-link font-normal text-left truncate cursor-pointer"
              >
                Contact
              </button>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
