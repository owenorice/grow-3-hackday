import React from 'react';
import { useGym } from '../../store/GymContext';
import { Activity, Flame, Dumbbell, ArrowRight, ShieldCheck, Clock, Layers } from 'lucide-react';

export const HeroPod: React.FC = () => {
  const { stats, setActiveTab, circuit, appMode } = useGym();

  const getCapacityStatus = () => {
    if (stats.occupancyRate >= 80) {
      return {
        label: 'PEAK RUSH IN PROGRESS',
        color: '#DC3545',
        badgeBg: 'bg-[#DC3545]/20 text-[#DC3545] border-[#DC3545]',
        message: 'Expect short waits for Power Racks and Cable Towers.',
      };
    }
    if (stats.occupancyRate >= 45) {
      return {
        label: 'MODERATE CLUB ACTIVITY',
        color: '#9FC63B',
        badgeBg: 'bg-[#9FC63B]/20 text-[#9FC63B] border-[#9FC63B]',
        message: 'Good workout flow. Most cardio and free weights open.',
      };
    }
    return {
      label: 'OPTIMAL WORKOUT WINDOW',
      color: '#97D700',
      badgeBg: 'bg-[#97D700]/20 text-[#97D700] border-[#97D700]',
      message: 'Floor is wide open. Peak time to smash personal bests.',
    };
  };

  const status = getCapacityStatus();

  return (
    <section className="w-full mb-8">
      {/* Double Pod Container - 50/50 Split on Desktop */}
      <div className="grid grid-cols-1 lg:grid-cols-12 border-2 border-[#333333] bg-black">
        
        {/* ================= LEFT POD: BRAND ATHLETIC HERO ================= */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between border-b-2 lg:border-b-0 lg:border-r-2 border-[#333333] relative overflow-hidden bg-black shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]">
          {/* Tactical Corner Brackets */}
          <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#97D700]" />
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#333333]" />
          <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#333333]" />

          {/* Top Kicker */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-[#97D700] animate-pulse" />
              <span className="text-xs sm:text-sm font-black uppercase tracking-[4px] text-[#97D700]">
                WHERE FITNESS MEETS MAYHEM
              </span>
            </div>

            {/* Main Bold Heading */}
            <h1 className="text-3xl sm:text-5xl font-black uppercase tracking-[3px] sm:tracking-[5px] text-white leading-tight">
              LIVE FLOORPLAN <br />
              <span className="text-[#97D700]">& OVERUSE TELEMETRY</span>
            </h1>

            {/* Editorial Lead Copy */}
            <p className="text-sm sm:text-base text-[#AAAAAA] max-w-xl font-normal leading-relaxed pt-1">
              Real-time station sensor telemetry across cardio, Eleiko Olympic power racks, and functional turf. Track live station occupancy, reserve workout circuit stations, and monitor preventative service thresholds.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="pt-8 space-y-4">
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={() => setActiveTab('floorplan')}
                className="vg-btn vg-btn-3 text-sm px-6 py-3.5 tracking-[2px]"
              >
                <span>OPEN 2D FLOORPLAN</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              <button
                onClick={() => setActiveTab('list')}
                className="vg-btn vg-btn-1 text-sm px-5 py-3.5 tracking-[2px]"
              >
                <Dumbbell className="w-4 h-4 mr-1 text-[#97D700]" />
                <span>EQUIPMENT DIRECTORY</span>
              </button>
            </div>

            {/* Village Gym Underline Link */}
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('analytics')}
                className="vg-link text-xs uppercase tracking-[2px] text-white hover:text-[#97D700] transition-colors"
              >
                EXPLORE 24-HOUR PEAK OCCUPANCY CURVES & METRICS →
              </button>
            </div>
          </div>
        </div>

        {/* ================= RIGHT POD: REAL-TIME CLUB TELEMETRY ================= */}
        <div className="lg:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#0B0D0E] relative shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]">
          {/* Tactical Corner Brackets */}
          <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#97D700]" />
          <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#333333]" />

          <div className="space-y-5">
            {/* Real-time Status Badge */}
            <div className="flex items-center justify-between pb-3 border-b border-[#222222]">
              <span className="text-[11px] font-black uppercase tracking-[2px] text-[#888888]">
                CLUB OCCUPANCY STATUS
              </span>
              <span className={`px-2.5 py-1 text-[11px] font-black uppercase tracking-wider border ${status.badgeBg}`}>
                {status.label}
              </span>
            </div>

            {/* Quick Numbers 2x2 Brutalist Grid */}
            <div className="grid grid-cols-2 gap-3">
              {/* Stat 1: Available Stations */}
              <div className="p-3.5 bg-black border-2 border-[#222222] hover:border-[#97D700] transition-colors">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">AVAILABLE</span>
                  <Activity className="w-3.5 h-3.5 text-[#97D700]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-wider">
                  <span className="text-[#97D700]">{stats.availableCount}</span>
                  <span className="text-xs text-[#666666] font-sans font-normal ml-1">/ {stats.totalMachines}</span>
                </div>
                <span className="text-[10px] text-[#777777] uppercase tracking-wider">Free right now</span>
              </div>

              {/* Stat 2: Floor Occupancy */}
              <div className="p-3.5 bg-black border-2 border-[#222222] hover:border-[#97D700] transition-colors">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">OCCUPANCY</span>
                  <Flame className="w-3.5 h-3.5 text-[#FFC107]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-wider">
                  {stats.occupancyRate}%
                </div>
                <span className="text-[10px] text-[#777777] uppercase tracking-wider">{stats.inUseCount} active members</span>
              </div>

              {/* Stat 3: Est. Wait Time */}
              <div className="p-3.5 bg-black border-2 border-[#222222] hover:border-[#97D700] transition-colors">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">EST. WAIT</span>
                  <Clock className="w-3.5 h-3.5 text-[#AAAAAA]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-wider">
                  {stats.occupancyRate > 75 ? '~12m' : stats.occupancyRate > 40 ? '~5m' : '0m'}
                </div>
                <span className="text-[10px] text-[#777777] uppercase tracking-wider">Average delay</span>
              </div>

              {/* Stat 4: Circuit Queue */}
              <div className="p-3.5 bg-black border-2 border-[#222222] hover:border-[#97D700] transition-colors">
                <div className="flex items-center justify-between text-[#888888] mb-1">
                  <span className="text-[10px] font-black uppercase tracking-wider">CIRCUIT</span>
                  <Layers className="w-3.5 h-3.5 text-[#97D700]" />
                </div>
                <div className="text-2xl sm:text-3xl font-black text-white font-display tracking-wider">
                  {circuit?.stations?.length || 0}
                </div>
                <span className="text-[10px] text-[#777777] uppercase tracking-wider">Stations in queue</span>
              </div>
            </div>

            {/* Real-time Advisory Strip */}
            <div className="p-3 bg-black border border-[#222222] text-xs flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#97D700] shrink-0" />
              <p className="text-[11px] text-[#CCCCCC] leading-tight">
                {status.message}
              </p>
            </div>
          </div>

          {/* Quick Zone Health Glance */}
          <div className="pt-4 border-t border-[#222222] flex items-center justify-between text-[11px]">
            <span className="text-[#777777] uppercase font-bold tracking-wider">MODE:</span>
            <span className="font-black uppercase tracking-widest text-[#97D700]">
              {appMode === 'staff' ? 'STAFF TELEMETRY ACCESS' : 'MEMBER GUEST ACCESS'}
            </span>
          </div>
        </div>

      </div>
    </section>
  );
};
