import React from 'react';
import { useGym } from '../../store/GymContext';
import { Activity, ShieldCheck, AlertTriangle, Wrench, Sparkles } from 'lucide-react';

export const Header: React.FC = () => {
  const { appMode, setAppMode, stats } = useGym();

  const isStaff = appMode === 'staff';

  return (
    <header className="bg-slate-900/90 backdrop-blur-md border-b border-slate-800 sticky top-0 z-40 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-lg transition-colors duration-300 ${
            isStaff ? 'bg-amber-600 shadow-amber-900/30' : 'bg-emerald-600 shadow-emerald-900/30'
          }`}>
            {isStaff ? <Wrench className="w-5 h-5" /> : <Activity className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base tracking-tight text-white">APEX LEISURE CLUB</span>
              <span className="text-[10px] uppercase font-semibold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                Hotel & Spa
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isStaff ? 'Facility Management & Overuse Telemetry' : 'Live Gym Equipment & Availability'}
            </p>
          </div>
        </div>

        {/* Center Live Availability / Maintenance Counters */}
        <div className="flex items-center gap-2 text-xs">
          {!isStaff ? (
            <div className="flex items-center gap-2 bg-slate-800/80 border border-slate-700/60 rounded-full px-3 py-1.5">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
              <span className="font-semibold text-emerald-400">{stats.availableCount} / {stats.totalMachines} Free</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-300">{stats.occupancyRate}% Occupied</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-950/40 border border-amber-800/60 rounded-full px-3 py-1.5 text-amber-300">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span className="font-semibold">{stats.serviceDueCount + stats.criticalOveruseCount} Overdue / Service Alerts</span>
            </div>
          )}
        </div>

        {/* Right: Guest / Staff Mode Toggle Switch */}
        <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700/80">
          <button
            onClick={() => setAppMode('guest')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
              !isStaff
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Guest View
          </button>
          <button
            onClick={() => setAppMode('staff')}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
              isStaff
                ? 'bg-amber-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Staff / Facility
          </button>
        </div>
      </div>
    </header>
  );
};
