import { ArrowRight, Compass, HelpCircle, Home, MousePointerClick, Rotate3d } from 'lucide-react';
import { MuseumView } from '../types/museum';

interface VisitorGuidePageProps {
  onNavigate: (view: MuseumView) => void;
}

export function VisitorGuidePage({ onNavigate }: VisitorGuidePageProps) {
  const steps = [
    {
      number: '01',
      title: 'How to Navigate Between Galleries',
      instruction: 'Use the top navigation bar or click any pedestal inside the 3D Main Museum Hall.',
      detail:
        'You can move smoothly between the Main Hall, Explore Exhibits archive, Knowledge Centre, and Quizzes using the header menu. The breadcrumb bar directly underneath always shows your current location and how many of the nine galleries you have explored.',
      icon: Compass,
    },
    {
      number: '02',
      title: 'How to Explore an Exhibit',
      instruction: 'Click on an exhibit card or 3D pedestal to open its full gallery page.',
      detail:
        'Scroll down to read the historical introduction, location, dates, important features, and the dedicated "The Science Behind It" section explaining how ancient engineers solved real physical challenges.',
      icon: MousePointerClick,
    },
    {
      number: '03',
      title: 'How to Interact with 3D Models',
      instruction: 'Drag to rotate 360°, scroll to zoom, and switch structural modes below the model.',
      detail:
        'Rotate 3D objects to view them from different angles, use Overview / Close-Up / Top Plan camera buttons, toggle Cross-Section Cutaways or Animated Scientific Simulations, and click numbered 3D labels to inspect key components.',
      icon: Rotate3d,
    },
    {
      number: '04',
      title: 'How to Attempt Quizzes',
      instruction: 'Complete the quizzes at the end of every exhibit or try the 9-exhibit Museum Challenge.',
      detail:
        'Each exhibit includes 4 multiple-choice questions with instant feedback and clear explanations. When you have explored the galleries, head to Quizzes to attempt the full Museum Challenge.',
      icon: HelpCircle,
    },
    {
      number: '05',
      title: 'How to Return to the Main Hall',
      instruction: 'Click "Home", "Main Hall" in the breadcrumb bar, or "Back to Main Hall" at the bottom of any exhibit.',
      detail:
        'You will never lose your place—every exhibit also includes Previous Exhibit and Next Exhibit buttons so you can walk through all nine galleries in sequence.',
      icon: Home,
    },
  ];

  return (
    <div className="max-w-[1040px] mx-auto px-4 sm:px-8 py-8 sm:py-12 space-y-10">
      <header className="border-b border-[#2A1E17]/14 pb-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[#78552B]">
          Orientation &amp; Accessibility
        </p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold text-[#2A1E17] mt-1.5">
          Visitor Guide
        </h1>
        <p className="mt-3 text-base text-[#594335] max-w-2xl leading-relaxed">
          Welcome to The Indian Heritage &amp; Ancient Science Museum. Follow these five simple steps to explore our 3D monuments, scientific explanations, and interactive quizzes at your own pace.
        </p>
      </header>

      {/* Quick Beginner Checklist Strip */}
      <section className="rounded-xl border border-[#2A1E17]/15 bg-[#EFE7D8] p-6">
        <h2 className="font-display text-2xl font-semibold text-[#2A1E17]">
          Quick Start Tips
        </h2>
        <ul className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-[#2A1E17]">
          <li className="rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/10 px-4 py-3">
            Click on an exhibit to explore it.
          </li>
          <li className="rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/10 px-4 py-3">
            Rotate 3D objects to view them from different angles.
          </li>
          <li className="rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/10 px-4 py-3">
            Scroll to discover more information.
          </li>
          <li className="rounded-lg bg-[#F8F4EC] border border-[#2A1E17]/10 px-4 py-3">
            Complete the quizzes to test your knowledge.
          </li>
        </ul>
      </section>

      {/* Detailed Step-by-Step Guide */}
      <section className="space-y-4">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article
              key={step.number}
              className="rounded-xl border border-[#2A1E17]/14 bg-[#F8F4EC] p-6 flex flex-col sm:flex-row gap-5 items-start"
            >
              <div className="w-11 h-11 rounded-lg bg-[#EFE7D8] border border-[#2A1E17]/14 flex items-center justify-center shrink-0 text-[#7C3F1E]">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-mono text-[#78552B]">Step {step.number}</p>
                <h2 className="font-display text-2xl font-semibold text-[#2A1E17]">
                  {step.title}
                </h2>
                <p className="text-sm font-medium text-[#7C3F1E]">{step.instruction}</p>
                <p className="text-sm text-[#594335] leading-relaxed">{step.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      <div className="pt-2 flex flex-wrap gap-3">
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
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-[#2A1E17]/20 bg-[#EFE7D8] text-[#2A1E17] text-sm font-medium hover:bg-[#E5D9C3] transition-colors"
        >
          <span>Browse All Nine Exhibits</span>
        </button>
      </div>
    </div>
  );
}
