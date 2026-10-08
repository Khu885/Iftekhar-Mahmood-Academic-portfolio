import "./globals.css";

export const metadata = {
  title: "Iftekhar Mahmood, Ph.D. - Senior Clinical Pharmacologist & Consultant",
  description:
    "Official academic and professional portfolio of Dr. Iftekhar Mahmood, Ph.D. Former Senior Reviewer and Team Leader at US FDA (25+ years). Specialized in interspecies pharmacokinetic scaling, pediatric dose prediction, and biologics.",
  keywords: [
    "Iftekhar Mahmood",
    "Clinical Pharmacology",
    "FDA",
    "Pharmacokinetics",
    "Allometric Scaling",
    "Pediatric Dose",
    "Biologics",
    "Salisbury Rule",
  ],
  authors: [{ name: "Iftekhar Mahmood, Ph.D." }],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col justify-between antialiased">
        {children}
      </body>
    </html>
  );
}
