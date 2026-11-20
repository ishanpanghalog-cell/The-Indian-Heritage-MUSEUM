import { ArrowRight } from 'lucide-react';
import { MUSEUM_ASSETS } from '../data/museumData';
import { MuseumView } from '../types/museum';

interface AboutMuseumPageProps {
  onNavigate: (view: MuseumView) => void;
}

export function AboutMuseumPage({ onNavigate }: AboutMuseumPageProps) {
  return (
    <div className="max-w-[1140px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Curatorial Statement &amp; Mission
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-1.5">
          About the Museum
        </h1>
      </header>

      {/* Hero Editorial Split */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-display text-3xl font-semibold text-[#2A1E17]">
            Showcasing Ancient India’s Scientific &amp; Architectural Genius
          </h2>
          <p className="text-base text-[#2A1E17]/90 leading-relaxed">
            The Indian Heritage &amp; Ancient Science Museum is a virtual educational institution dedicated to presenting the scientific, architectural, engineering, and technological achievements of ancient and historical India in an accessible, interactive 3D format.
          </p>
          <p className="text-base text-[#594335] leading-relaxed">
            From subterranean stepwells engineered to harvest brief monsoons, to 66-meter dry-stone granite towers, self-supporting acoustic domes, carved solar sundial wheels, living root suspension bridges, and soft-iron rocket casings—our nine permanent galleries invite students, educators, and lifelong learners to inspect how ancient innovators solved complex physical challenges.
          </p>
          <p className="text-base text-[#594335] leading-relaxed">
            Every exhibit maintains strict historical integrity: where structures survive in partial ruin—such as the 8th-century Martand Sun Temple in Kashmir—archaeological evidence is explicitly distinguished from scholarly 3D reconstruction, and common naming confusions are clarified transparently.
          </p>
        </div>

        <figure className="lg:col-span-5 rounded-xl overflow-hidden border border-[#2A1E17]/14 bg-[#EFE7D8] flex flex-col">
          <img
            src={MUSEUM_ASSETS.grandHall}
            alt="Interior sandstone arches and skylight inside the virtual museum rotunda"
            referrerPolicy="no-referrer"
            className="w-full h-64 lg:h-full object-cover"
          />
          <figcaption className="px-4 py-3 text-xs font-display italic text-[#594335] border-t border-[#2A1E17]/10">
            Fig. — Architectural study of the Central Sandstone Rotunda and Skylight Gallery.
          </figcaption>
        </figure>
      </section>

      {/* Required Visitor Message Quote */}
      <section
        aria-label="Museum Closing Message"
        className="border-y border-[#2A1E17]/18 py-8 sm:py-10 text-center max-w-3xl mx-auto"
      >
        <blockquote className="font-display italic text-2xl sm:text-3xl text-[#2A1E17] leading-snug">
          “Explore the knowledge of the past. Discover the innovations of ancient India. Understand how history shaped the world we live in today.”
        </blockquote>
      </section>

      {/* Three Pillars */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/75 p-6">
          <p className="text-xs font-mono text-[#78552B]">01. Interactive 3D</p>
          <h3 className="font-display text-2xl font-semibold text-[#2A1E17] mt-1">
            Inspect Every Angle
          </h3>
          <p className="text-sm text-[#594335] mt-2 leading-relaxed">
            Orbit 360° around architectural models, slice open cross-sections, and trigger real-time acoustic, hydrological, and propulsion simulations.
          </p>
        </div>
        <div className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/75 p-6">
          <p className="text-xs font-mono text-[#78552B]">02. Clear Science</p>
          <h3 className="font-display text-2xl font-semibold text-[#2A1E17] mt-1">
            The Science Behind It
          </h3>
          <p className="text-sm text-[#594335] mt-2 leading-relaxed">
            Every monument pairs historical context with clear, student-friendly explanations of structural loads, fluid flow, acoustics, and metallurgy.
          </p>
        </div>
        <div className="rounded-xl border border-[#2A1E17]/14 bg-[#EFE7D8]/75 p-6">
          <p className="text-xs font-mono text-[#78552B]">03. Active Recall</p>
          <h3 className="font-display text-2xl font-semibold text-[#2A1E17] mt-1">
            Quizzes &amp; Challenge
          </h3>
          <p className="text-sm text-[#594335] mt-2 leading-relaxed">
            Check your understanding in each gallery with immediate feedback, or attempt the 9-exhibit Museum Challenge.
          </p>
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => onNavigate('hall')}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#2A1E17] text-[#F8F4EC] text-sm font-semibold hover:bg-[#3F2E24] transition-colors"
        >
          <span>Return to Main Museum Hall</span>
          <ArrowRight className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={() => onNavigate('exhibits')}
          className="px-6 py-3 rounded-lg border border-[#2A1E17]/20 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors"
        >
          Explore All Exhibits
        </button>
      </div>
    </div>
  );
}
