import React, { useState } from 'react';
import {
  X,
  Presentation,
  Download,
  ExternalLink,
  Sparkles,
  Zap,
  PoundSterling,
} from 'lucide-react';

interface RoadmapSlideshowModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RoadmapSlideshowModal: React.FC<RoadmapSlideshowModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'slide' | 'speaker_notes'>('slide');

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0d0e] border-2 border-[#97D700] max-w-5xl w-full p-4 sm:p-7 relative shadow-[0_0_90px_rgba(151,215,0,0.25)] text-white space-y-4 max-h-[95vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Tactical Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#97D700]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#97D700]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#97D700]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#97D700]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-2 border-[#20252b] pb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#97D700] text-black text-[10px] font-black font-oswald px-2 py-0.5 tracking-wider uppercase">
                EXECUTIVE PITCH DECK
              </span>
              <span className="text-xs font-mono text-[#8c959e] tracking-wider uppercase">
                VILLAGE GYM // FUTURE PRODUCT ROADMAP
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-oswald tracking-wide uppercase text-white flex items-center gap-2">
              <Presentation className="w-7 h-7 text-[#97D700]" />
              EXECUTIVE SLIDESHOW &amp; STRATEGY BRIEFING
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-[#20252b] pb-2">
          <button
            onClick={() => setActiveTab('slide')}
            className={`font-oswald font-black text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-colors flex items-center gap-1.5 ${
              activeTab === 'slide'
                ? 'bg-[#97D700] text-black border-[#97D700]'
                : 'bg-black text-[#8c959e] border-[#2b3036] hover:text-white hover:border-[#8c959e]'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            16:9 WIDESCREEN SLIDE
          </button>
          <button
            onClick={() => setActiveTab('speaker_notes')}
            className={`font-oswald font-black text-xs uppercase tracking-wider px-3.5 py-1.5 border transition-colors flex items-center gap-1.5 ${
              activeTab === 'speaker_notes'
                ? 'bg-[#00e5ff] text-black border-[#00e5ff]'
                : 'bg-black text-[#8c959e] border-[#2b3036] hover:text-white hover:border-[#8c959e]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            SPEAKER TALKING POINTS &amp; DEFENSE
          </button>
        </div>

        {/* TAB 1: 16:9 Slide Preview */}
        {activeTab === 'slide' && (
          <div className="space-y-3">
            <div className="relative aspect-[16/9] w-full bg-black border-2 border-[#20252b] overflow-hidden group shadow-[0_0_40px_rgba(0,0,0,0.8)]">
              <img
                src="/assets/slideshow-future-roadmap.svg"
                alt="Village Gym Future Roadmap Slide"
                className="w-full h-full object-contain"
              />
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                <a
                  href="/assets/slideshow-future-roadmap.svg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-black/80 hover:bg-[#97D700] hover:text-black border border-[#97D700] text-white text-[11px] font-oswald font-bold px-3 py-1.5 flex items-center gap-1 tracking-wider uppercase backdrop-blur-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  FULL RESOLUTION
                </a>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-[#8c959e] pt-1">
              <span>Standard 1920×1080 Widescreen • Formatted for Keynote, PowerPoint &amp; Google Slides</span>
              <a
                href="/assets/slideshow-future-roadmap.svg"
                download="village_gym_roadmap_pitch_slide.svg"
                className="bg-[#14171a] border border-[#2b3036] hover:border-[#97D700] text-[#97D700] font-oswald font-black text-xs py-1.5 px-3 tracking-wider uppercase flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                DOWNLOAD SLIDE (SVG)
              </a>
            </div>
          </div>
        )}

        {/* TAB 2: Keynote Talking Points */}
        {activeTab === 'speaker_notes' && (
          <div className="space-y-4 py-2">
            <div className="bg-[#101316] border border-[#262c33] p-4 space-y-2">
              <h3 className="font-oswald font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <PoundSterling className="w-4 h-4 text-[#97D700]" />
                PILLAR 1: FINANCE CAPEX &amp; FLEET UTILIZATION ENGINE
              </h3>
              <ul className="text-xs text-[#cfd6dc] space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-white">The CFO Problem:</strong> Gym equipment procurement is historically based on anecdotal complaints rather than telemetry, leading to mismatched Capex allocation.
                </li>
                <li>
                  <strong className="text-white">The Solution:</strong> Real-time and cumulative utilization rates identify actual club friction points.
                </li>
                <li>
                  <strong className="text-[#DC3545]">Bottleneck Case Study:</strong> Olympic Power Racks sustain 96.4% load during peak rush with 26-minute queues. Investing £14,800 to add 2 platforms protects an estimated £38,400/year in at-risk subscription cancellations.
                </li>
                <li>
                  <strong className="text-[#9FC63B]">Footprint Reallocation:</strong> Recumbent bikes sit at 18.2% capacity. Retiring 4 units reclaims 24m² to install high-margin functional Hyrox sled sprint turf (+28% PT conversion).
                </li>
              </ul>
            </div>

            <div className="bg-[#101316] border border-[#262c33] p-4 space-y-2">
              <h3 className="font-oswald font-black text-base text-white uppercase tracking-wider flex items-center gap-2">
                <Zap className="w-4 h-4 text-[#00e5ff]" />
                PILLAR 2: DYNAMIC AI WORKOUT CIRCUIT OPTIMIZER
              </h3>
              <ul className="text-xs text-[#cfd6dc] space-y-2 list-disc list-inside leading-relaxed">
                <li>
                  <strong className="text-white">The Member Problem:</strong> Members waste an average of 23 minutes standing idle between circuit stations during peak evening rush.
                </li>
                <li>
                  <strong className="text-white">Predictive Re-Sequencing:</strong> If Station 2 has a 16-minute line, the AI dynamically swaps the sequence so the member works on an open station first while the busy station turns over.
                </li>
                <li>
                  <strong className="text-white">Biomechanical Equivalents:</strong> 1-click alternative swaps with matching muscle groups (e.g., busy Barbell Bench ➔ available Incline Dumbbell Bench).
                </li>
                <li>
                  <strong className="text-[#00e5ff]">Commercial Impact:</strong> Cuts idle wait time from 23 minutes to 4 minutes, dramatically boosting member satisfaction and gym floor turnover.
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Action Footer */}
        <div className="flex items-center justify-between pt-3 border-t-2 border-[#20252b]">
          <span className="text-[11px] font-mono text-[#8c959e] uppercase">
            Village Gym Intelligence Roadmap • Issue #22
          </span>
          <button
            onClick={onClose}
            className="bg-[#97D700] hover:bg-[#85c000] text-black font-oswald font-black text-xs py-2 px-4 tracking-wider uppercase transition-colors"
          >
            CLOSE DECK
          </button>
        </div>
      </div>
    </div>
  );
};
