import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import { Zap, RotateCcw, AlertOctagon, ChevronDown, ChevronUp, Sparkles, CheckSquare } from 'lucide-react';

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
      <div className="bg-black border-2 border-[#333333] shadow-[0_0_25px_rgba(0,0,0,0.8)] overflow-hidden transition-all duration-300 w-80">
        {/* Header Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 flex items-center justify-between text-xs font-black uppercase tracking-[2px] text-white bg-[#111111] hover:bg-[#212529] border-b-2 border-[#333333] transition-colors"
        >
          <div className="flex items-center gap-2 text-[#97D700]">
            <Sparkles className="w-4 h-4 text-[#97D700] animate-spin" style={{ animationDuration: '6s' }} />
            <span>PRESENTER SIMULATOR</span>
          </div>
          {isOpen ? <ChevronDown className="w-4 h-4 text-[#AAAAAA]" /> : <ChevronUp className="w-4 h-4 text-[#AAAAAA]" />}
        </button>

        {/* Action Buttons */}
        {isOpen && (
          <div className="p-3.5 space-y-2.5 text-xs bg-black">
            <p className="text-[10px] text-[#AAAAAA] uppercase tracking-wider font-semibold leading-tight">
              Instant pitch triggers to simulate floor occupancy, transitions, and staff telemetry.
            </p>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={simulatePeakRush}
                className="p-2.5 bg-black hover:bg-[#DC3545] text-white hover:text-white border-2 border-[#DC3545] font-black uppercase tracking-wider text-[11px] flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <Zap className="w-3.5 h-3.5 text-[#DC3545]" />
                <span>5PM RUSH (85%)</span>
              </button>

              <button
                onClick={simulateEmptyGym}
                className="p-2.5 bg-black hover:bg-[#97D700] text-white hover:text-black border-2 border-[#97D700] font-black uppercase tracking-wider text-[11px] flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <CheckSquare className="w-3.5 h-3.5 text-[#97D700]" />
                <span>RESET / ALL FREE</span>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={simulateTurnover}
                className="p-2.5 bg-[#111111] hover:bg-white text-white hover:text-black border-2 border-[#333333] font-bold uppercase tracking-wider text-[11px] flex flex-col items-center justify-center gap-1 text-center transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5 text-white" />
                <span>STEP TURNOVER</span>
              </button>

              <button
                onClick={handleSpikeCable}
                className="p-2.5 bg-black hover:bg-[#FFC107] text-[#FFC107] hover:text-black border-2 border-[#FFC107] font-black uppercase tracking-wider text-[11px] flex flex-col items-center justify-center gap-1 text-center transition-all"
                title="Spike Cable Tower to demonstrate Staff Overuse Alert"
              >
                <AlertOctagon className="w-3.5 h-3.5 text-[#FFC107]" />
                <span>SPIKE OVERUSE</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
