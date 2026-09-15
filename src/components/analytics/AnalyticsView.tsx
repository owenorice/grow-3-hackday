import React, { useState, useMemo } from 'react';
import { useGym } from '../../store/GymContext';
import { GymMachine, GymZone } from '../../types/gym';
import {
  TrendingUp,
  Clock,
  Wrench,
  ShieldAlert,
  Zap,
  Dumbbell,
  BarChart2,
  ShieldCheck,
  Search,
  MapPin,
  Layers,
  ArrowUpDown,
  Flame,
  CheckCircle2,
} from 'lucide-react';
import { ServiceModal } from '../staff/ServiceModal';

type SortOption = 'utilization' | 'hours' | 'urgency' | 'code';
type TelemetryFilter = 'overdue_only' | 'critical_only' | 'all';

const ALL_ZONES: GymZone[] = [
  'Cardio Deck',
  'Power & Strength Racks',
  'Cable & Functional Bay',
  'Free Weight Turf',
];

export const AnalyticsView: React.FC = () => {
  const { machines, appMode, selectMachine, setActiveTab, stats } = useGym();
  const isStaff = appMode === 'staff';

  // State
  const [hoveredHour, setHoveredHour] = useState<{ hour: number; avg: number; count: number } | null>(null);
  const [servicingMachine, setServicingMachine] = useState<GymMachine | null>(null);
  const [selectedChartZone, setSelectedChartZone] = useState<GymZone | 'all'>('all');
  const [telemetryFilter, setTelemetryFilter] = useState<TelemetryFilter>('overdue_only');

  // Leaderboard filters
  const [leaderboardSearch, setLeaderboardSearch] = useState<string>('');
  const [leaderboardZone, setLeaderboardZone] = useState<GymZone | 'all'>('all');
  const [leaderboardSort, setLeaderboardSort] = useState<SortOption>('utilization');

  // Current system hour for the "LIVE NOW" marker
  const currentHour = new Date().getHours();

  // Filtered machines for the 24h curve
  const chartMachines = useMemo(() => {
    if (selectedChartZone === 'all') return machines;
    return machines.filter(m => m.zone === selectedChartZone);
  }, [machines, selectedChartZone]);

  // Aggregated hourly usage across filtered machines (0 to 23 hours)
  const hourlyAverages = useMemo(() => {
    if (chartMachines.length === 0) return Array(24).fill(0);
    return Array.from({ length: 24 }, (_, hour) => {
      const total = chartMachines.reduce((sum, m) => sum + (m.hourlyUsage[hour] || 0), 0);
      return Math.round(total / chartMachines.length);
    });
  }, [chartMachines]);

  // Healthy machines count
  const healthyCount = useMemo(() => {
    return machines.filter(m => m.maintenanceStatus === 'healthy').length;
  }, [machines]);

  // Telemetry machines for staff view
  const telemetryMachines = useMemo(() => {
    return machines.filter(m => {
      if (telemetryFilter === 'critical_only') {
        return m.maintenanceStatus === 'critical_overuse';
      }
      if (telemetryFilter === 'overdue_only') {
        return m.maintenanceStatus === 'critical_overuse' || m.maintenanceStatus === 'service_due';
      }
      return true; // 'all'
    });
  }, [machines, telemetryFilter]);

  // Sorted and filtered leaderboard machines
  const filteredLeaderboard = useMemo(() => {
    return machines
      .filter(m => {
        const matchesSearch =
          m.name.toLowerCase().includes(leaderboardSearch.toLowerCase()) ||
          m.code.toLowerCase().includes(leaderboardSearch.toLowerCase());
        const matchesZone = leaderboardZone === 'all' || m.zone === leaderboardZone;
        return matchesSearch && matchesZone;
      })
      .sort((a, b) => {
        if (leaderboardSort === 'utilization') {
          return b.utilizationPercentage - a.utilizationPercentage;
        }
        if (leaderboardSort === 'hours') {
          return b.avgDailyUsageHours - a.avgDailyUsageHours;
        }
        if (leaderboardSort === 'urgency') {
          const urgencyScore = (m: GymMachine) =>
            m.maintenanceStatus === 'critical_overuse' ? 3 : m.maintenanceStatus === 'service_due' ? 2 : 1;
          return urgencyScore(b) - urgencyScore(a) || b.hoursSinceLastService - a.hoursSinceLastService;
        }
        if (leaderboardSort === 'code') {
          return a.code.localeCompare(b.code);
        }
        return 0;
      });
  }, [machines, leaderboardSearch, leaderboardZone, leaderboardSort]);

  // Top 3 Workhorse machines overall
  const topThreeWorkhorses = useMemo(() => {
    return [...machines].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage).slice(0, 3);
  }, [machines]);

  const handleLocateOnMap = (machineId: string) => {
    selectMachine(machineId);
    setActiveTab('floorplan');
  };

  const healthScore = stats.totalMachines > 0
    ? Math.round((healthyCount / stats.totalMachines) * 100)
    : 100;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================= SECTION 1: TOP ATHLETIC INSIGHT PODS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            Floor traffic drops to <span className="text-[#97D700] font-bold">28% capacity</span> during early afternoon lull.
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
            Racks and dual cable towers surge to <span className="text-[#DC3545] font-bold">95%+ occupancy</span>.
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
            Power racks average 32m; cardio turnovers average 24m with 2m buffer.
          </p>
        </div>

        {/* Pod 4: Fleet Safety & Compliance */}
        <div className="bg-black border-2 border-[#333333] hover:border-[#97D700] p-5 relative overflow-hidden transition-all shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]">
          <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-[#97D700]" />
          <div className="flex items-center justify-between text-xs font-black uppercase tracking-[2px] text-[#97D700] mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" /> FLEET SAFETY
            </span>
            <span className={`text-[10px] px-2 py-0.5 border ${
              healthScore >= 90
                ? 'bg-[#97D700]/10 border-[#97D700] text-[#97D700]'
                : 'bg-[#FFC107]/10 border-[#FFC107] text-[#FFC107]'
            }`}>
              {healthScore >= 90 ? 'OPTIMAL' : 'SERVICE REQ'}
            </span>
          </div>
          <div className="text-3xl font-black text-white font-display tracking-wider flex items-baseline gap-2">
            {healthScore}%
            <span className="text-xs text-[#777777] font-mono">({healthyCount}/{stats.totalMachines})</span>
          </div>
          <p className="text-xs text-[#AAAAAA] mt-2 font-normal leading-relaxed">
            Safety threshold status across all 4 club zones.
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

            {/* Filter Pills */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={() => setTelemetryFilter('overdue_only')}
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${
                  telemetryFilter === 'overdue_only'
                    ? 'bg-[#DC3545] text-white border-[#DC3545]'
                    : 'bg-black text-[#888888] border-[#333333] hover:border-white'
                }`}
              >
                ACTION REQ ({machines.filter(m => m.maintenanceStatus !== 'healthy').length})
              </button>
              <button
                onClick={() => setTelemetryFilter('critical_only')}
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${
                  telemetryFilter === 'critical_only'
                    ? 'bg-[#DC3545] text-white border-[#DC3545]'
                    : 'bg-black text-[#888888] border-[#333333] hover:border-white'
                }`}
              >
                CRITICAL ONLY ({machines.filter(m => m.maintenanceStatus === 'critical_overuse').length})
              </button>
              <button
                onClick={() => setTelemetryFilter('all')}
                className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-wider border-2 transition-colors ${
                  telemetryFilter === 'all'
                    ? 'bg-white text-black border-white'
                    : 'bg-black text-[#888888] border-[#333333] hover:border-white'
                }`}
              >
                ALL FLEET ({machines.length})
              </button>
            </div>
          </div>

          {telemetryMachines.length === 0 ? (
            <div className="p-8 text-center border-2 border-[#222222] bg-[#111111] space-y-2">
              <CheckCircle2 className="w-8 h-8 text-[#97D700] mx-auto" />
              <p className="text-sm font-bold uppercase tracking-[2px] text-[#97D700]">
                ✓ NO OVERDUE MACHINES MATCHING CURRENT FILTER
              </p>
              <p className="text-xs text-[#888888]">
                All monitored equipment operating within safety inspection parameters.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {telemetryMachines.map(m => {
                const isOverdue = m.maintenanceStatus !== 'healthy';
                const percentHours = Math.min(100, Math.round((m.hoursSinceLastService / m.serviceThresholdHours) * 100));

                return (
                  <div
                    key={m.id}
                    className={`p-4 bg-[#111111] border-2 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                      m.maintenanceStatus === 'critical_overuse'
                        ? 'border-[#DC3545] hover:border-white'
                        : m.maintenanceStatus === 'service_due'
                        ? 'border-[#FFC107] hover:border-white'
                        : 'border-[#222222] hover:border-[#444444]'
                    }`}
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-display font-black text-xs px-2.5 py-1 bg-black text-[#97D700] border border-[#333333]">
                          {m.code}
                        </span>
                        <span className="font-display font-black text-sm uppercase tracking-wider text-white">
                          {m.name}
                        </span>
                        <span className="text-[10px] font-mono text-[#888888] px-2 py-0.5 bg-black border border-[#222222] uppercase">
                          {m.zone}
                        </span>
                        <span className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-wider border ${
                          m.maintenanceStatus === 'critical_overuse'
                            ? 'bg-[#DC3545]/20 text-[#DC3545] border-[#DC3545]'
                            : m.maintenanceStatus === 'service_due'
                            ? 'bg-[#FFC107]/20 text-[#FFC107] border-[#FFC107]'
                            : 'bg-[#97D700]/20 text-[#97D700] border-[#97D700]'
                        }`}>
                          {m.maintenanceStatus === 'critical_overuse'
                            ? 'CRITICAL OVERUSE'
                            : m.maintenanceStatus === 'service_due'
                            ? 'SERVICE DUE'
                            : 'HEALTHY'}
                        </span>
                      </div>

                      {m.serviceNotes && (
                        <p className="text-xs font-semibold text-[#FFC107] leading-relaxed">
                          ⚠️ {m.serviceNotes}
                        </p>
                      )}

                      {/* Wear meter progress bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-[#888888] font-mono">
                          <span>
                            DUTY CYCLES: <strong className="text-white">{m.hoursSinceLastService}h</strong> / {m.serviceThresholdHours}h LIMIT
                          </span>
                          <span className={percentHours >= 100 ? 'text-[#DC3545] font-bold' : 'text-[#AAAAAA]'}>
                            {percentHours}% OF INTERVAL
                          </span>
                        </div>
                        <div className="w-full bg-black h-2 border border-[#333333] overflow-hidden">
                          <div
                            className={`h-full transition-all duration-500 ${
                              percentHours >= 100
                                ? 'bg-[#DC3545]'
                                : percentHours >= 80
                                ? 'bg-[#FFC107]'
                                : 'bg-[#97D700]'
                            }`}
                            style={{ width: `${percentHours}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-[11px] text-[#888888] font-mono">
                        <span>LAST SERVICED: <strong className="text-white">{m.lastServicedDate}</strong></span>
                        {m.serviceHistory && m.serviceHistory.length > 0 && (
                          <span>AUDIT LOGS: <strong className="text-white">{m.serviceHistory.length} ENTRIES</strong></span>
                        )}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-2">
                      <button
                        onClick={() => handleLocateOnMap(m.id)}
                        className="vg-btn vg-btn-1 text-xs px-3 py-2.5 tracking-wider"
                        title="Locate on Floorplan"
                      >
                        <MapPin className="w-3.5 h-3.5 mr-1 text-[#97D700]" />
                        MAP
                      </button>
                      <button
                        onClick={() => setServicingMachine(m)}
                        className={`vg-btn ${isOverdue ? 'vg-btn-3' : 'vg-btn-2'} text-xs px-4 py-2.5 tracking-wider`}
                      >
                        <Wrench className="w-3.5 h-3.5 mr-1" />
                        {isOverdue ? 'INSPECT & CLEAR' : 'LOG INSPECTION'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ================= SECTION 3: 24-HOUR BUSYNESS CURVE ================= */}
      <div className="bg-black border-2 border-[#333333] p-6 space-y-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b-2 border-[#212529]">
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px] flex items-center gap-2">
              <BarChart2 className="w-5 h-5 text-[#97D700]" />
              24-HOUR PEAK TRAFFIC HISTOGRAM
            </h3>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-wider">
              Aggregated sensor load from {chartMachines.length} monitored stations in selected zone
            </p>
          </div>

          {/* Zone Selector Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#777777] mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3" /> ZONE:
            </span>
            <button
              onClick={() => setSelectedChartZone('all')}
              className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border transition-colors ${
                selectedChartZone === 'all'
                  ? 'bg-[#97D700] text-black border-[#97D700]'
                  : 'bg-black text-[#AAAAAA] border-[#333333] hover:text-white'
              }`}
            >
              ALL FACILITY
            </button>
            {ALL_ZONES.map(zone => (
              <button
                key={zone}
                onClick={() => setSelectedChartZone(zone)}
                className={`px-2.5 py-1 text-[10px] font-black uppercase tracking-wider border transition-colors ${
                  selectedChartZone === zone
                    ? 'bg-[#97D700] text-black border-[#97D700]'
                    : 'bg-black text-[#AAAAAA] border-[#333333] hover:text-white'
                }`}
              >
                {zone.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* Legend Bar & Guidance */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] font-black uppercase tracking-wider">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#97D700]" /> LOW (&lt;50%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#9FC63B]" /> MODERATE (50-74%)</span>
            <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-[#DC3545]" /> SURGE RUSH (75%+)</span>
          </div>
          <div className="flex items-center gap-2 text-[#DC3545] text-[10px] font-mono">
            <span className="w-4 h-0 border-t-2 border-dashed border-[#DC3545]" />
            80% CAPACITY SURGE THRESHOLD
          </div>
        </div>

        {/* Bar chart representation with 80% Surge Line and "NOW" indicator */}
        <div className="relative pt-10 pb-2">
          {/* Active Hover Floating Readout */}
          {hoveredHour && (
            <div className="absolute top-0 right-2 px-3 py-1 bg-black border-2 border-[#97D700] text-xs font-black uppercase tracking-[2px] text-white">
              {hoveredHour.hour.toString().padStart(2, '0')}:00 ➔ <span className="text-[#97D700]">{hoveredHour.avg}% OCCUPANCY</span>
            </div>
          )}

          {/* 80% Capacity Surge Line */}
          <div
            className="absolute left-2 right-2 border-t-2 border-dashed border-[#DC3545]/60 pointer-events-none z-10 flex items-center justify-end pr-2"
            style={{ bottom: 'calc(24px + 80% * 0.75)' }}
          >
            <span className="text-[9px] font-mono font-bold text-[#DC3545] bg-black px-1.5 border border-[#DC3545]/40">
              80% SURGE LIMIT
            </span>
          </div>

          <div className="h-56 flex items-end gap-1 sm:gap-2 px-2 border-b-2 border-[#333333]">
            {hourlyAverages.slice(6, 23).map((avg, i) => {
              const hour = i + 6;
              const isPeak = avg >= 75;
              const isModerate = avg >= 50 && avg < 75;
              const isCurrent = hour === currentHour;

              return (
                <div
                  key={hour}
                  onMouseEnter={() => setHoveredHour({ hour, avg, count: chartMachines.length })}
                  onMouseLeave={() => setHoveredHour(null)}
                  className={`flex-1 flex flex-col items-center h-full justify-end cursor-pointer group relative ${
                    isCurrent ? 'bg-[#97D700]/5 border-x border-[#97D700]/20' : ''
                  }`}
                >
                  {/* LIVE NOW marker */}
                  {isCurrent && (
                    <div className="absolute -top-6 left-1/2 -translate-x-1/2 px-1.5 py-0.5 bg-[#97D700] text-black text-[9px] font-black uppercase font-display tracking-widest whitespace-nowrap shadow-[0_0_10px_#97D700]">
                      NOW
                    </div>
                  )}

                  {/* Bar */}
                  <div
                    className={`w-full transition-all duration-200 border-t-2 relative ${
                      isPeak
                        ? 'bg-[#DC3545] border-white group-hover:brightness-125'
                        : isModerate
                        ? 'bg-[#9FC63B] border-white group-hover:brightness-125'
                        : 'bg-[#97D700] border-white group-hover:brightness-125'
                    }`}
                    style={{ height: `${Math.max(8, avg)}%` }}
                  />

                  {/* Hour Label */}
                  <span className={`text-[10px] font-mono mt-2 truncate w-full text-center transition-colors ${
                    isCurrent
                      ? 'text-[#97D700] font-bold'
                      : 'text-[#777777] group-hover:text-white'
                  }`}>
                    {hour}h
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ================= SECTION 4: TOP 3 PODIUM WORKHORSES ================= */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Flame className="w-5 h-5 text-[#97D700]" />
          <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px]">
            CLUB PODIUM WORKHORSES (TOP 3 HEAVIEST DUTY)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topThreeWorkhorses.map((m, index) => {
            const podiumMedals = ['#1 HEAVIEST LOAD', '#2 RUNNER UP', '#3 PACESETTER'];
            const borderColors = ['border-[#97D700]', 'border-white', 'border-[#888888]'];
            const badgeBg = ['bg-[#97D700] text-black', 'bg-white text-black', 'bg-[#888888] text-white'];

            return (
              <div
                key={m.id}
                className={`bg-black border-2 ${borderColors[index]} p-5 space-y-3 relative shadow-[inset_0_0_50px_rgba(0,0,0,0.8)]`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 ${badgeBg[index]}`}>
                    {podiumMedals[index]}
                  </span>
                  <span className="font-display font-black text-2xl text-white">
                    {m.utilizationPercentage}%
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-black text-xs px-2 py-0.5 bg-[#111111] text-[#97D700] border border-[#333333]">
                      {m.code}
                    </span>
                    <span className="font-display font-black text-sm uppercase text-white truncate">
                      {m.name}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#888888] mt-1 font-mono uppercase">
                    {m.zone} • {m.avgDailyUsageHours} hrs/day avg
                  </p>
                </div>

                {/* Meter */}
                <div className="w-full bg-[#111111] h-2.5 border border-[#333333]">
                  <div
                    className="h-full bg-[#97D700]"
                    style={{ width: `${m.utilizationPercentage}%` }}
                  />
                </div>

                <div className="pt-2 flex items-center justify-between border-t border-[#222222]">
                  <span className={`text-[10px] font-black uppercase ${
                    m.status === 'available' ? 'text-[#97D700]' : 'text-[#DC3545]'
                  }`}>
                    ● {m.status.toUpperCase()}
                  </span>
                  <button
                    onClick={() => handleLocateOnMap(m.id)}
                    className="text-[10px] font-bold uppercase text-[#97D700] hover:underline flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3" /> LOCATE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ================= SECTION 5: EQUIPMENT UTILIZATION LEADERBOARD ================= */}
      <div className="bg-black border-2 border-[#333333] p-6 space-y-5 shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-[#212529]">
          <div>
            <h3 className="font-display font-black text-lg text-white uppercase tracking-[2px] flex items-center gap-2">
              <Dumbbell className="w-5 h-5 text-[#97D700]" />
              EQUIPMENT UTILIZATION LEADERBOARD
            </h3>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-wider">
              {filteredLeaderboard.length} stations ranked by cumulative daily operational duty
            </p>
          </div>

          {/* Search, Zone Filter & Sort Controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-[#777777] absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="SEARCH CODE / NAME..."
                value={leaderboardSearch}
                onChange={e => setLeaderboardSearch(e.target.value)}
                className="bg-[#111111] border-2 border-[#333333] pl-8 pr-3 py-1.5 text-xs text-white uppercase placeholder:text-[#555555] focus:outline-none focus:border-[#97D700] w-48"
              />
            </div>

            {/* Zone Filter */}
            <select
              value={leaderboardZone}
              onChange={e => setLeaderboardZone(e.target.value as GymZone | 'all')}
              className="bg-[#111111] border-2 border-[#333333] px-3 py-1.5 text-xs text-white uppercase focus:outline-none focus:border-[#97D700]"
            >
              <option value="all">ALL ZONES</option>
              {ALL_ZONES.map(zone => (
                <option key={zone} value={zone} className="bg-[#111111]">
                  {zone.toUpperCase()}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <div className="flex items-center gap-1.5 bg-[#111111] border-2 border-[#333333] px-2.5 py-1.5">
              <ArrowUpDown className="w-3.5 h-3.5 text-[#97D700]" />
              <select
                value={leaderboardSort}
                onChange={e => setLeaderboardSort(e.target.value as SortOption)}
                className="bg-transparent text-xs text-white uppercase focus:outline-none"
              >
                <option value="utilization" className="bg-[#111111]">UTILIZATION %</option>
                <option value="hours" className="bg-[#111111]">DAILY HOURS</option>
                <option value="urgency" className="bg-[#111111]">SERVICE URGENCY</option>
                <option value="code" className="bg-[#111111]">MACHINE CODE</option>
              </select>
            </div>
          </div>
        </div>

        {/* List of Ranked Machines */}
        {filteredLeaderboard.length === 0 ? (
          <div className="p-8 text-center border-2 border-[#222222] bg-[#111111]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#888888]">
              No machines match the selected search or zone filter.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {filteredLeaderboard.map((m, idx) => (
              <div
                key={m.id}
                className="p-3 bg-[#111111] border-2 border-[#222222] hover:border-[#444444] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <span className="font-display font-black text-sm text-[#555555] w-7 text-center shrink-0">
                    #{idx + 1}
                  </span>
                  <span className="font-display font-black px-2 py-0.5 bg-black text-[#97D700] border border-[#333333] text-xs shrink-0">
                    {m.code}
                  </span>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-display font-bold uppercase tracking-wider text-white truncate">
                        {m.name}
                      </span>
                      <span className="text-[#AAAAAA] font-mono text-[11px] shrink-0">
                        {m.avgDailyUsageHours}h/day
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full bg-black h-2.5 border border-[#333333] overflow-hidden">
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
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pl-10 sm:pl-0">
                  <span className="font-display font-black text-sm text-white w-12 text-right">
                    {m.utilizationPercentage}%
                  </span>
                  <button
                    onClick={() => handleLocateOnMap(m.id)}
                    className="vg-btn vg-btn-1 text-[10px] px-3 py-1.5 tracking-wider flex items-center gap-1"
                  >
                    <MapPin className="w-3 h-3 text-[#97D700]" />
                    LOCATE
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Staff Maintenance Inspection Modal */}
      {servicingMachine && (
        <ServiceModal
          machine={servicingMachine}
          onClose={() => setServicingMachine(null)}
        />
      )}
    </div>
  );
};
