import { ArrowRight, Check } from 'lucide-react';
import { ExhibitData } from '../types/museum';

interface MonumentPreviewCardProps {
  exhibit: ExhibitData;
  isExplored?: boolean;
  actionHint?: string;
}

export function MonumentPreviewCard({
  exhibit,
  isExplored = false,
  actionHint = 'Click monument to inspect 3D exhibit',
}: MonumentPreviewCardProps) {
  return (
    <div className="w-[290px] sm:w-[320px] rounded-xl overflow-hidden bg-[#140E0B]/96 border border-[#C69632]/55 shadow-[0_20px_48px_rgba(0,0,0,0.78)] text-left text-[#FAF5EA]">
      <div className="relative h-32 w-full bg-[#211812] overflow-hidden border-b border-[#E6B84D]/20">
        {exhibit.archivalImage ? (
          <img
            src={exhibit.archivalImage}
            alt={exhibit.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-end p-3"
            style={{
              background: `radial-gradient(circle at 75% 25%, ${exhibit.accentColor}66 0%, #1B1410 80%)`,
            }}
          >
            <span className="font-display text-lg text-[#FAF5EA]">{exhibit.shortTitle}</span>
          </div>
        )}
        <div
          className="absolute inset-0 bg-gradient-to-t from-[#140E0B] via-[#140E0B]/30 to-transparent"
          aria-hidden="true"
        />
        <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between gap-2 text-[11px]">
          <span className="font-mono tracking-wider text-[#F0C968] tabular-nums">
            Exhibit {exhibit.number} · {exhibit.accessionNumber}
          </span>
          {isExplored && (
            <span className="inline-flex items-center gap-1 text-[#E6B84D] font-medium">
              <Check className="w-3 h-3" />
              Visited
            </span>
          )}
        </div>
      </div>

      <div className="p-3.5 space-y-1.5">
        <p className="text-[11px] text-[#D8C5A5] truncate">
          {exhibit.location} · {exhibit.period}
        </p>
        <h3 className="font-display text-xl font-semibold text-[#FAF5EA] leading-tight">
          {exhibit.shortTitle}
        </h3>
        <p className="text-xs text-[#E5D9C3]/90 leading-relaxed line-clamp-2">
          {exhibit.shortDescription}
        </p>
        <div className="pt-1.5 flex items-center justify-between text-[11px] font-medium text-[#F0C968] border-t border-[#E6B84D]/15">
          <span>{actionHint}</span>
          <ArrowRight className="w-3.5 h-3.5 shrink-0" />
        </div>
      </div>
    </div>
  );
}
