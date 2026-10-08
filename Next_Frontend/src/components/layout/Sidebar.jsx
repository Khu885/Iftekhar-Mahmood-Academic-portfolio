"use client";

import { useState } from "react";
import Image from "next/image";

export default function Sidebar({ onSelectTab }) {
  const [imgError, setImgError] = useState(false);

  return (
    <aside className="md:col-span-4 lg:col-span-3.5 flex flex-col">
      {/* Profile Portrait Photo (Overlapping the banner) */}
      <div className="profile-photo-container -mt-16 sm:-mt-20 mb-5 relative z-10 w-fit">
        <div className="profile-photo-frame w-36 h-44 sm:w-44 sm:h-52 bg-gray-100 overflow-hidden rounded-sm flex items-center justify-center text-gray-700 relative">
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

      {/* Name & Professional Metadata */}
      <div className="space-y-1">
        <h2 className="text-xl sm:text-[22px] font-bold text-gray-900 tracking-tight leading-snug">
          Iftekhar Mahmood
        </h2>
        <p className="text-[14px] text-gray-600 font-normal">
          Senior Clinical Pharmacologist &amp; Consultant
        </p>
      </div>

      {/* Department / Affiliation */}
      <div className="mt-4 text-[13.5px] text-gray-600 leading-relaxed">
        <p>Mahmood Clinical Pharmacology Consultancy</p>
        <p>Rockville, Maryland, USA</p>
        <p className="text-xs text-gray-500 mt-1">
          Former Senior Reviewer &amp; Team Lead, US FDA (25+ Years)
        </p>
      </div>

      {/* Academic & Social Profile Links */}
      <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5 text-[14px]">
        {/* LinkedIn */}
        <div className="flex items-center space-x-2.5">
          <Image
            src="/assets/icons/linkedin.svg"
            alt="LinkedIn"
            width={16}
            height={16}
            className="w-4 h-4 shrink-0"
          />
          <a
            href="https://www.linkedin.com/in/iftekhar-mahmood-78981b192/"
            target="_blank"
            rel="noopener noreferrer"
            className="owl-link font-normal"
          >
            LinkedIn
          </a>
        </div>

        {/* ResearchGate */}
        <div className="flex items-center space-x-2.5">
          <span className="w-4 h-4 text-gray-600 font-bold text-xs flex items-center justify-center shrink-0">
            R<sup>G</sup>
          </span>
          <a
            href="https://www.researchgate.net/profile/Iftekhar-Mahmood"
            target="_blank"
            rel="noopener noreferrer"
            className="owl-link font-normal"
          >
            ResearchGate
          </a>
        </div>

        {/* ORCID */}
        <div className="flex items-center space-x-2.5">
          <Image
            src="/assets/icons/orcid.svg"
            alt="ORCID"
            width={16}
            height={16}
            className="w-4 h-4 shrink-0"
          />
          <a
            href="https://orcid.org/0000-0003-1311-4237"
            target="_blank"
            rel="noopener noreferrer"
            className="owl-link font-normal"
          >
            ORCID
          </a>
        </div>

        {/* Contact link */}
        <div className="flex items-center space-x-2.5 pt-1">
          <svg
            className="w-4 h-4 text-gray-500 shrink-0"
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
            className="owl-link font-normal text-left"
          >
            Contact
          </button>
        </div>
      </div>
    </aside>
  );
}
