import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import { TrendingUp, Clock, Wrench, ShieldAlert, Zap, Dumbbell, BarChart2 } from 'lucide-react';
import { ServiceModal } from '../staff/ServiceModal';

export const AnalyticsView: React.FC = () => {
  const { machines, appMode } = useGym();
  const isStaff = appMode === 'staff';
  const [hoveredHour, setHoveredHour] = useState<{ hour: number; avg: number } | null>(null);
  const [inspectingMachineId, setInspectingMachineId] = useState<string | null>(null);

  // Sort machines by utilization
  const mostUsed = [...machines].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);

  // High risk / overdue machines for staff
  const overdueMachines = machines.filter(
    m => m.maintenanceStatus === 'critical_overuse' || m.maintenanceStatus === 'service_due'
  );

  // Aggregated hourly usage across all machines (0 to 23 hours)
  const hourlyAverages = Array.from({ length: 24 }, (_, hour) => {
    const total = machines.reduce((sum, m) => sum + (m.hourlyUsage[hour] || 0), 0);
    return Math.round(total / machines.length);
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================= SECTION 1: TOP ATHLETIC INSIGHT PODS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pod 1: Optimal Workout Window */}
        <div className="bg-black border-2 border-[#333333] hover:border-[#97D700] p-5 relative overflow-hidden transition-all shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#97D700]" />
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[2px] text-[#97D700] mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4" /> OPTIMAL WINDOW
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#97D700]/10 border border-[#97D700] text-[#97D700]">LOW TRAFFIC</span>
          </div>
          <div className="text-3xl font-black text-white font-display tracking-wider">
            13:30 – 15:30
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2 font-normal leading-relaxed">
            Floor traffic drops to <span className="text-[#97D700] font-bold">28% capacity</span> during early afternoon. Best time for undisturbed rack circuits.
          </p>
        </div>

        {/* Pod 2: Peak Rush Hours */}
        <div className="bg-black border-2 border-[#333333] hover:border-[#DC3545] p-5 relative overflow-hidden transition-all shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#DC3545]" />
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[2px] text-[#DC3545] mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4" /> PEAK RUSH
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#DC3545]/10 border border-[#DC3545] text-[#DC3545]">85%+ BUSY</span>
          </div>
          <div className="text-3xl font-black text-white font-display tracking-wider">
            17:00 – 19:45
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2 font-normal leading-relaxed">
            Power racks and dual cable towers surge to <span className="text-[#DC3545] font-bold">95%+ occupancy</span>. Pre-reserve circuits in advance.
          </p>
        </div>

        {/* Pod 3: Station Duration */}
        <div className="bg-black border-2 border-[#333333] hover:border-white p-5 relative overflow-hidden transition-all shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-white" />
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[2px] text-white mb-2">
            <span className="flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#97D700]" /> AVG WORKOUT PACE
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-[#212529] border border-[#333333] text-[#AAAAAA]">ESTIMATED</span>
          </div>
          <div className="text-3xl font-black text-white font-display tracking-wider">
            22 MINS
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2 font-normal leading-relaxed">
            Power racks average 32 mins, while cardio machines turnover every 24 mins. Transition buffer averages 2 mins.
          </p>
        </div>
      </div>

      {/* ================= SECTION 2: STAFF OVERUSE & TELEMETRY ================= */}
      {isStaff && (
        <div className="bg-black border-2 border-[#DC3545] p-6 space-y-5 relative shadow-[0_0_40px_rgba(220,53,69,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b-2 border-[#212529]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[#DC3545]/20 text-[#DC3545] border-2 border-[#DC3545] flex items-center justify-center shrink-0">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px]">
                  MACHINE OVERUSE & PREVENTATIVE SERVICE TELEMETRY
                </h3>
                <p className="text-xs text-[#AAAAAA] uppercase tracking-wider">
                  Automated threshold monitoring based on cumulative motor hours & cable load cycles
                </p>
              </div>
            </div>
            <span className="self-start sm:self-auto px-3 py-1.5 font-black uppercase tracking-[2px] text-xs bg-[#DC3545] text-white border border-[#DC3545]">
              {overdueMachines.length} ACTION REQUIRED
            </span>
          </div>

          {overdueMachines.length === 0 ? (
            <div className="p-6 text-center border-2 border-[#222222] bg-[#111111]">
              <p className="text-sm font-bold uppercase tracking-[2px] text-[#97D700]">
                ✓ ALL 22 GYM STATIONS HEALTHY — ZERO OVERDUE THRESHOLDS
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {overdueMachines.map(m => (
                <div
                  key={m.id}
                  className="p-4 bg-[#111111] border-2 border-[#333333] hover:border-[#DC3545] flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors"
                >
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-display font-black text-xs px-2.5 py-1 bg-black text-[#97D700] border border-[#333333]">
                        {m.code}
                      </span>
                      <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                        {m.name}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-wider border ${
                        m.maintenanceStatus === 'critical_overuse'
                          ? 'bg-[#DC3545]/20 text-[#DC3545] border-[#DC3545]'
                          : 'bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]'
                      }`}>
                        {m.maintenanceStatus === 'critical_overuse' ? 'CRITICAL OVERUSE' : 'SERVICE DUE'}
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-[#FFC107] leading-relaxed">
                      {m.serviceNotes}
                    </p>

                    <div className="flex items-center gap-4 text-[11px] text-[#888888] font-mono">
                      <span>OPERATING: <strong className="text-white">{m.hoursSinceLastService}h</strong> / {m.serviceThresholdHours}h LIMIT</span>
                      <span>LAST SERVICED: <strong className="text-white">{m.lastServicedDate}</strong></span>
                    </div>
                  </div>

                  <div className="shrink-0">
                    <button
                      onClick={() => setInspectingMachineId(m.id)}
                      className="vg-btn vg-btn-3 text-xs px-4 py-2.5 tracking-wider w-full md:w-auto"
                    >
                      <Wrench className="w-3.5 h-3.5 mr-1" />
                      INSPECT & CLEAR
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 3: 24-HOUR BUSYNESS CURVE ================= */}
      <div className="bg-black border-2 border-[#333333] p-6 space-y-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#212529]">
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#97D700]" />
              24-HOUR PEAK TRAFFIC HISTOGRAM
            </h3>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-wider">
              Aggregated live sensor load across cardio, strength, and turf zones
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#97D700]" /> LOW (&lt;50%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#9FC63B]" /> MODERATE</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#DC3545]" /> PEAK (&gt;75%)</span>
          </div>
        </div>

        {/* Bar chart representation */}
        <div className="relative pt-8 pb-2">
          {/* Active Hover Floating Readout */}
          {hoveredHour && (
            <div className="absolute top-0 right-2 px-3 py-1 bg-black border-2 border-[#97D700] text-xs font-black uppercase tracking-[2px] text-white">
              {hoveredHour.hour.toString().padStart(2, '0')}:00 ➔ <span className="text-[#97D700]">{hoveredHour.avg}% OCCUPANCY</span>
            </div>
          )}

          <div className="h-52 flex items-end gap-1 sm:gap-2 px-2 border-b-2 border-[#333333]">
            {hourlyAverages.slice(6, 23).map((avg, i) => {
              const hour = i + 6;
              const isPeak = avg >= 75;
              const isModerate = avg >= 50 && avg < 75;

              return (
                <div
                  key={hour}
                  onMouseEnter={() => setHoveredHour({ hour, avg })}
                  onMouseLeave={() => setHoveredHour(null)}
                  className="flex-1 flex flex-col items-center h-full justify-end cursor-pointer group"
                >
                  {/* Bar */}
                  <div
                    className={`w-full transition-all duration-200 border-t-2 ${
                      isPeak
                        ? 'bg-[#DC3545] border-white group-hover:brightness-125'
                        : isModerate
                        ? 'bg-[#9FC63B] border-white group-hover:brightness-125'
                        : 'bg-[#97D700] border-white group-hover:brightness-125'
                    }`}
                    style={{ height: `${Math.max(8, avg)}%` }}
                  />

                  {/* Hour Label */}
                  <span className="text-[10px] text-[#777777] group-hover:text-white font-mono mt-2 truncate w-full text-center transition-colors">
                    {hour}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: EQUIPMENT UTILIZATION LEADERBOARD ================= */}
      <div className="bg-black border-2 border-[#333333] p-6 space-y-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b-2 border-[#212529]">
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px] flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#97D700]" />
              EQUIPMENT UTILIZATION LEADERBOARD
            </h3>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-wider">
              Top stations ranked by cumulative daily operational hours
            </p>
          </div>
          <span className="text-xs text-[#888888] font-mono uppercase tracking-widest">
            RANKED 1 - 7
          </span>
        </div>

        <div className="space-y-2.5">
          {mostUsed.slice(0, 7).map((m, idx) => (
            <div
              key={m.id}
              className="p-3 bg-[#111111] border-2 border-[#222222] hover:border-[#333333] flex items-center gap-3 text-xs transition-colors"
            >
              <span className="font-display font-black text-sm text-[#555555] w-6 text-center">
                #{idx + 1}
              </span>
              <span className="font-display font-black px-2 py-0.5 bg-black text-[#97D700] border border-[#333333] text-xs">
                {m.code}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold uppercase tracking-wider text-white truncate">
                    {m.name}
                  </span>
                  <span className="text-[#AAAAAA] font-mono text-[11px] ml-2 shrink-0">
                    {m.avgDailyUsageHours}h/day
                  </span>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-black h-2.5 border border-[#333333] mt-1.5 overflow-hidden">
                  <div
                    className={`h-full transition-all duration-500 ${
                      m.utilizationPercentage >= 85
                        ? 'bg-[#DC3545]'
                        : m.utilizationPercentage >= 70
                        ? 'bg-[#9FC63B]'
                        : 'bg-[#97D700]'
                    }`}
                    style={{ width: `${m.utilizationPercentage}%` }}
                  />
                </div>
              </div>

              <span className="font-display font-black text-sm text-white w-12 text-right">
                {m.utilizationPercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Inspection Checklist Modal */}
      <ServiceModal
        machineId={inspectingMachineId}
        isOpen={inspectingMachineId !== null}
        onClose={() => setInspectingMachineId(null)}
      />
    </div>
  );
};
