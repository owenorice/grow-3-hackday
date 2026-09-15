import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Wrench,
  ShieldAlert,
  Flame,
  Dumbbell,
  HeartPulse,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  AlertTriangle,
} from 'lucide-react';
import { EquipmentCategory } from '../../types/gym';
import { ServiceModal } from '../staff/ServiceModal';

export const AnalyticsView: React.FC = () => {
  const { machines, appMode } = useGym();
  const isStaff = appMode === 'staff';

  const [inspectingMachineId, setInspectingMachineId] = useState<string | null>(null);
  const [hoveredHour, setHoveredHour] = useState<{ hour: number; avg: number } | null>(null);

  // Sort machines by utilization
  const mostUsed = [...machines].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);

  // High risk / overdue machines for staff
  const overdueMachines = machines.filter(
    m => m.maintenanceStatus === 'critical_overuse' || m.maintenanceStatus === 'service_due'
  );

  // Fleet health score
  const healthyCount = machines.filter(m => m.maintenanceStatus === 'healthy').length;
  const fleetHealthScore = Math.round((healthyCount / (machines.length || 1)) * 100);

  // Aggregated hourly usage across all machines (0 to 23 hours)
  const hourlyAverages = Array.from({ length: 24 }, (_, hour) => {
    const total = machines.reduce((sum, m) => sum + (m.hourlyUsage[hour] || 0), 0);
    return Math.round(total / (machines.length || 1));
  });

  const getCategoryIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'cardio':
        return <HeartPulse className="w-3.5 h-3.5 text-[#97D700]" />;
      case 'racks_benches':
        return <Dumbbell className="w-3.5 h-3.5 text-sky-400" />;
      case 'cables_plate':
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'free_weights':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
      default:
        return <Sparkles className="w-3.5 h-3.5 text-[#97D700]" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Insights Cards (Village Gym Brutalist Pods) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Optimal Workout Window */}
        <div className="bg-black p-5 border-2 border-[#222222] relative group hover:border-[#97D700] transition-colors">
          <div className="flex items-center justify-between text-xs font-black text-[#97D700] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#97D700]" />
              OPTIMAL WINDOW
            </span>
            <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 text-[#97D700] border border-[#97D700]/40">
              LOW TRAFFIC
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">13:30 – 15:30</div>
          <p className="text-xs text-[#AAAAAA] mt-2 uppercase tracking-[0.5px] leading-relaxed">
            Floor occupancy averages 28% capacity during early afternoon lull.
          </p>
        </div>

        {/* Peak Rush Hours */}
        <div className="bg-black p-5 border-2 border-[#222222] relative group hover:border-[#DC3545] transition-colors">
          <div className="flex items-center justify-between text-xs font-black text-[#DC3545] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#DC3545]" />
              PEAK RUSH
            </span>
            <span className="text-[10px] bg-red-950/80 px-1.5 py-0.5 text-red-400 border border-red-800">
              HIGH RUSH
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">17:00 – 19:45</div>
          <p className="text-xs text-[#AAAAAA] mt-2 uppercase tracking-[0.5px] leading-relaxed">
            Squat racks and cable towers reach 95%+ occupancy after business hours.
          </p>
        </div>

        {/* Average Station Duration */}
        <div className="bg-black p-5 border-2 border-[#222222] relative group hover:border-sky-400 transition-colors">
          <div className="flex items-center justify-between text-xs font-black text-sky-400 uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-sky-400" />
              STATION DURATION
            </span>
            <span className="text-[10px] bg-[#111111] px-1.5 py-0.5 text-sky-400 border border-sky-400/40">
              AVG
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">22 MINUTES</div>
          <p className="text-xs text-[#AAAAAA] mt-2 uppercase tracking-[0.5px] leading-relaxed">
            Power racks average 32 mins, while cardio deck averages 24 mins.
          </p>
        </div>

        {/* Facility Fleet Health Score */}
        <div className="bg-black p-5 border-2 border-[#222222] relative group hover:border-[#97D700] transition-colors">
          <div className="flex items-center justify-between text-xs font-black text-[#97D700] uppercase tracking-[2px] mb-2">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#97D700]" />
              FLEET SAFETY
            </span>
            <span className="text-[10px] bg-emerald-950 px-1.5 py-0.5 text-emerald-400 border border-emerald-800">
              {healthyCount}/{machines.length} HEALTHY
            </span>
          </div>
          <div className="text-2xl font-black text-white font-mono tracking-tight">{fleetHealthScore}% SCORE</div>
          <p className="text-xs text-[#AAAAAA] mt-2 uppercase tracking-[0.5px] leading-relaxed">
            Cumulative preventative compliance across all 4 club fitness zones.
          </p>
        </div>
      </div>

      {/* Staff Overuse & Maintenance Telemetry Table */}
      {isStaff && (
        <div className="bg-black border-2 border-[#DC3545] p-5 space-y-4 shadow-[0_0_25px_rgba(220,53,69,0.15)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#DC3545] text-white flex items-center justify-center font-black">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-black text-sm uppercase tracking-[2px] text-white">
                  MACHINE OVERUSE & PREVENTATIVE INSPECTION TELEMETRY
                </h3>
                <p className="text-xs text-[#AAAAAA] uppercase tracking-[1px]">
                  Automated cycle tracking exceeding safety thresholds
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-[1px] px-3 py-1 bg-red-950 text-red-300 border border-red-800">
                {overdueMachines.length} ACTION REQUIRED
              </span>
            </div>
          </div>

          {overdueMachines.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-[#97D700] mx-auto" />
              <p className="text-xs uppercase tracking-[2px] text-white font-black">
                All machines operating within safety thresholds
              </p>
              <p className="text-[11px] text-[#777777]">
                No equipment currently requires immediate preventative maintenance sign-off.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#222222] border border-[#222222] bg-[#0a0a0a]">
              {overdueMachines.map(m => (
                <div
                  key={m.id}
                  className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-[#111111] transition-colors"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 bg-black border border-[#333333] text-[#97D700]">
                        {m.code}
                      </span>
                      <span className="font-black text-sm uppercase tracking-[0.5px] text-white">{m.name}</span>
                      <span className="text-[10px] text-[#AAAAAA] uppercase tracking-[1px]">• {m.zone}</span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 uppercase tracking-wider ${
                          m.maintenanceStatus === 'critical_overuse'
                            ? 'bg-[#DC3545] text-white'
                            : 'bg-[#FFC107] text-black font-black'
                        }`}
                      >
                        {m.maintenanceStatus.replace('_', ' ')}
                      </span>
                    </div>

                    <p className="text-xs text-red-300 flex items-center gap-1.5 font-medium">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#DC3545] flex-shrink-0" />
                      {m.serviceNotes}
                    </p>

                    <p className="text-[11px] text-[#777777] uppercase tracking-[1px] font-mono">
                      Accumulated: <span className="text-white font-bold">{m.hoursSinceLastService}h</span> / Safe Limit: {m.serviceThresholdHours}h • Last Serviced: {m.lastServicedDate}
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setInspectingMachineId(m.id)}
                      className="py-2 px-4 bg-[#97D700] hover:bg-[#86be00] text-black text-xs font-black uppercase tracking-[1px] flex items-center gap-1.5 shadow-[0_0_15px_rgba(151,215,0,0.3)] transition-all"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      <span>INSPECT & CLEAR</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 24-Hour Peak Facility Busyness Curve (Brutalist Histogram) */}
      <div className="bg-black p-5 border-2 border-[#222222] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
          <div>
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#97D700]" />
              <h3 className="font-black text-sm uppercase tracking-[2px] text-white">
                24-HOUR PEAK FACILITY BUSYNESS CURVE
              </h3>
            </div>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-[1px] mt-0.5">
              Aggregated hourly occupancy percentage across all 22 gym machines
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[1px]">
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#97D700]"></span> &lt;50% Optimal
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#FFC107]"></span> 50-74% Moderate
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 bg-[#DC3545]"></span> 75%+ Rush
            </span>
          </div>
        </div>

        {/* Bar chart representation (06:00 to 23:00) */}
        <div className="h-52 flex items-end gap-1.5 pt-8 pb-3 px-2 bg-[#080808] border border-[#222222] relative">
          {hourlyAverages.slice(6, 24).map((avg, i) => {
            const hour = i + 6;
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const isPeak = avg >= 75;
            const isModerate = avg >= 50 && avg < 75;

            return (
              <div
                key={hour}
                onMouseEnter={() => setHoveredHour({ hour, avg })}
                onMouseLeave={() => setHoveredHour(null)}
                className="flex-1 flex flex-col items-center h-full justify-end group relative cursor-pointer"
              >
                {/* Tooltip */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-black border border-[#97D700] text-white text-[10px] font-mono px-2 py-1 shadow-lg pointer-events-none whitespace-nowrap z-20">
                  <span className="text-[#97D700] font-bold">{hourStr}</span> • {avg}% Occupied
                </div>

                {/* Vertical Bar */}
                <div
                  className={`w-full transition-all duration-300 ${
                    isPeak
                      ? 'bg-[#DC3545] group-hover:brightness-125 shadow-[0_0_10px_rgba(220,53,69,0.5)]'
                      : isModerate
                      ? 'bg-[#FFC107] group-hover:brightness-125'
                      : 'bg-[#97D700] group-hover:brightness-125 shadow-[0_0_8px_rgba(151,215,0,0.3)]'
                  }`}
                  style={{ height: `${Math.max(8, avg)}%` }}
                />
                <span className="text-[10px] text-[#777777] font-mono mt-2 group-hover:text-white transition-colors">
                  {hour}h
                </span>
              </div>
            );
          })}
        </div>

        {/* Selected Hour Telemetry Callout */}
        {hoveredHour && (
          <div className="text-center text-xs font-mono text-[#AAAAAA] uppercase tracking-[1px] animate-fadeIn">
            At {hoveredHour.hour.toString().padStart(2, '0')}:00 — Occupancy is{' '}
            <span
              className={`font-black ${
                hoveredHour.avg >= 75
                  ? 'text-[#DC3545]'
                  : hoveredHour.avg >= 50
                  ? 'text-[#FFC107]'
                  : 'text-[#97D700]'
              }`}
            >
              {hoveredHour.avg}% ({Math.round((hoveredHour.avg / 100) * machines.length)} of {machines.length} machines in use)
            </span>
          </div>
        )}
      </div>

      {/* Equipment Utilization Leaderboard */}
      <div className="bg-black p-5 border-2 border-[#222222] space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
          <div>
            <h3 className="font-black text-sm uppercase tracking-[2px] text-white">
              EQUIPMENT UTILIZATION LEADERBOARD
            </h3>
            <p className="text-xs text-[#AAAAAA] uppercase tracking-[1px] mt-0.5">
              Ranked by daily operating cycle hours & capacity utilization
            </p>
          </div>
          <span className="text-xs text-[#97D700] font-mono uppercase tracking-[1px] font-bold">
            TOP 10 WORKHORSES
          </span>
        </div>

        <div className="divide-y divide-[#222222] border border-[#222222] bg-[#0a0a0a]">
          {mostUsed.slice(0, 10).map((m, idx) => (
            <div
              key={m.id}
              className="p-3.5 flex items-center gap-3 text-xs hover:bg-[#111111] transition-colors"
            >
              {/* Rank Badge */}
              <span
                className={`font-mono font-black w-6 text-center text-xs ${
                  idx === 0
                    ? 'text-[#97D700]'
                    : idx === 1
                    ? 'text-sky-400'
                    : idx === 2
                    ? 'text-amber-400'
                    : 'text-[#555555]'
                }`}
              >
                #{idx + 1}
              </span>

              {/* Machine Code */}
              <span className="font-mono font-black px-2 py-0.5 bg-black text-[#97D700] border border-[#333333] text-[11px]">
                {m.code}
              </span>

              {/* Category Icon */}
              <span>{getCategoryIcon(m.category)}</span>

              {/* Machine Name & Zone */}
              <div className="flex-1 min-w-0">
                <span className="font-bold text-white uppercase tracking-[0.5px] truncate block">
                  {m.name}
                </span>
                <span className="text-[10px] text-[#777777] uppercase tracking-[0.5px]">
                  {m.zone}
                </span>
              </div>

              {/* Daily Usage Hours */}
              <span className="text-[#AAAAAA] font-mono hidden sm:inline text-xs">
                {m.avgDailyUsageHours} hrs/day
              </span>

              {/* Meter Bar */}
              <div className="w-28 sm:w-44 bg-[#111111] h-3 border border-[#333333] overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    m.utilizationPercentage >= 85
                      ? 'bg-[#DC3545]'
                      : m.utilizationPercentage >= 70
                      ? 'bg-[#FFC107]'
                      : 'bg-[#97D700]'
                  }`}
                  style={{ width: `${m.utilizationPercentage}%` }}
                />
              </div>

              {/* Utilization Percentage */}
              <span className="font-mono font-black text-white w-12 text-right">
                {m.utilizationPercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Staff Inspection Modal */}
      <ServiceModal
        machineId={inspectingMachineId}
        isOpen={inspectingMachineId !== null}
        onClose={() => setInspectingMachineId(null)}
      />
    </div>
  );
};
