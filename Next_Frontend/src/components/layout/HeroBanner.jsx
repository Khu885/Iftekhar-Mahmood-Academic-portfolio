import Image from "next/image";

export default function HeroBanner() {
  return (
    <div className="relative w-full bg-[#070c17] border-b border-slate-900 shadow-md h-[160px] sm:h-[200px] md:h-[240px] overflow-hidden">
      {/* Full-bleed Banner Graphic Background behind the navbar */}
      <div className="owl-banner absolute inset-0 w-full h-full overflow-hidden pointer-events-none">
        <Image
          src="/assets/images/banner-biology.svg"
          alt="Quantitative Pharmacology & Technical Bio-Engineering Banner"
          fill
          priority
          unoptimized
          sizes="100vw"
          className="object-cover object-top"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/60 via-slate-950/15 to-slate-950/50" />
      </div>
    </div>
  );
}
