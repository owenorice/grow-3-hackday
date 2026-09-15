import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import { Zap, Users, RotateCcw, AlertOctagon, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';

export const SimulatorDrawer: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const {
    simulatePeakRush,
    simulateEmptyGym,
    simulateTurnover,
    simulateOveruseSpike,
    setAppMode,
  } = useGym();

  const handleSpikeCable = () => {
    simulateOveruseSpike('m-cc-01');
    setAppMode('staff');
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300 w-80">
        {/* Header Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-800 transition-colors"
        >
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Presenter Demo Controls</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronUp className="w-4 h-4 text-slate-400" />}
        </button>

        {/* Action Buttons */}
        {isOpen && (
          <div className="p-3 space-y-2 text-xs">
            <p className="text-[11px] text-slate-400 leading-tight">
              Instant triggers to demonstrate live facility occupancy, machine transitions, and staff telemetry during pitch.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={simulatePeakRush}
                className="p-2 rounded-lg bg-red-950/80 hover:bg-red-900 border border-red-800/80 text-red-200 font-medium flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span>Simulate 5PM Rush</span>
              </button>

              <button
                onClick={simulateEmptyGym}
                className="p-2 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-800/80 text-emerald-200 font-medium flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <Users className="w-3.5 h-3.5 text-emerald-400" />
                <span>Reset / Empty Gym</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulateTurnover}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-750 border border-slate-700 text-slate-200 font-medium flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-sky-400" />
                <span>Simulate Turnover</span>
              </button>

              <button
                onClick={handleSpikeCable}
                className="p-2 rounded-lg bg-amber-950/80 hover:bg-amber-900 border border-amber-800/80 text-amber-200 font-medium flex flex-col items-center justify-center gap-1 text-center transition-all"
                title="Spike Cable Tower to demonstrate Staff Overuse Alert"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-amber-400" />
                <span>Trigger Overuse</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
