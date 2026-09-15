import React from 'react';
import { useGym } from '../../store/GymContext';
import { ShieldCheck, AlertTriangle, Sparkles, Dumbbell } from 'lucide-react';

export const Header: React.FC = () => {
  const { appMode, setAppMode, stats } = useGym();

  const isStaff = appMode === 'staff';

  return (
    <header className="bg-black border-b-2 border-[#333333] sticky top-0 z-40 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-4">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-black border-2 border-[#97D700] flex items-center justify-center font-bold text-[#97D700] shadow-[0_0_15px_rgba(151,215,0,0.3)]">
            <Dumbbell className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-lg tracking-[3px] text-white uppercase">
                VILLAGE <span className="text-[#97D700]">GYM</span>
              </span>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 bg-[#212529] text-[#97D700] border border-[#333333] tracking-widest">
                CLUB TELEMETRY
              </span>
            </div>
            <p className="text-[11px] text-[#AAAAAA] uppercase tracking-wider font-medium">
              {isStaff ? 'Facility Operations & Machine Health' : 'Real-Time Floor Availability & Stations'}
            </p>
          </div>
        </div>

        {/* Center Live Availability / Maintenance Counters */}
        <div className="flex items-center gap-2 text-xs">
          {!isStaff ? (
            <div className="flex items-center gap-3 bg-[#111111] border-2 border-[#333333] px-3.5 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#97D700] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#97D700]"></span>
              </span>
              <span className="font-bold text-[#97D700] tracking-wider uppercase">
                {stats.availableCount} / {stats.totalMachines} FREE
              </span>
              <span className="text-[#555555]">|</span>
              <span className="text-[#AAAAAA] font-mono">{stats.occupancyRate}% OCCUPIED</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-[#212529] border-2 border-[#DC3545] px-3.5 py-1.5 text-white">
              <AlertTriangle className="w-3.5 h-3.5 text-[#DC3545] animate-pulse" />
              <span className="font-bold tracking-wider text-xs uppercase text-[#DC3545]">
                {stats.serviceDueCount + stats.criticalOveruseCount} ALERTS NEEDING SERVICE
              </span>
            </div>
          )}
        </div>

        {/* Right: Guest / Staff Mode Toggle Switch */}
        <div className="flex items-center bg-black border-2 border-[#333333] p-0.5">
          <button
            onClick={() => setAppMode('guest')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              !isStaff
                ? 'bg-[#97D700] text-black shadow-sm'
                : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Guest View
          </button>
          <button
            onClick={() => setAppMode('staff')}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              isStaff
                ? 'bg-[#DC3545] text-white shadow-sm'
                : 'text-[#AAAAAA] hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Staff Portal
          </button>
        </div>
      </div>
    </header>
  );
};
