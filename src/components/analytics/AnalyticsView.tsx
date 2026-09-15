import React from 'react';
import { useGym } from '../../store/GymContext';
import { BarChart3, TrendingUp, Clock, Wrench, ShieldAlert } from 'lucide-react';

export const AnalyticsView: React.FC = () => {
  const { machines, appMode, logService } = useGym();
  const isStaff = appMode === 'staff';

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
    <div className="space-y-6">
      {/* Top Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">
            <Clock className="w-4 h-4" /> Optimal Workout Window
          </div>
          <div className="text-xl font-bold text-white">13:30 – 15:30</div>
          <p className="text-xs text-slate-400 mt-1">Average gym occupancy is lowest at 28% capacity during early afternoon.</p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <TrendingUp className="w-4 h-4" /> Peak Rush Hours
          </div>
          <div className="text-xl font-bold text-white">17:00 – 19:45</div>
          <p className="text-xs text-slate-400 mt-1">Squat racks and cable towers reach 95%+ utilization after hotel business hours.</p>
        </div>

        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-400 uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" /> Average Station Duration
          </div>
          <div className="text-xl font-bold text-white">22 Minutes</div>
          <p className="text-xs text-slate-400 mt-1">Power racks average 32 mins, while cardio machines average 24 mins.</p>
        </div>
      </div>

      {/* Staff Overuse & Maintenance Telemetry Table */}
      {isStaff && (
        <div className="bg-slate-900/90 rounded-xl border border-amber-800/60 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-600/20 text-amber-400 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Machine Overuse & Preventative Inspection Telemetry</h3>
                <p className="text-xs text-slate-400">Automated threshold tracking based on machine usage cycles and operating hours</p>
              </div>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {overdueMachines.length} Action Required
            </span>
          </div>

          <div className="divide-y divide-slate-800 border border-slate-800 rounded-lg overflow-hidden bg-slate-950/60">
            {overdueMachines.map(m => (
              <div key={m.id} className="p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3 hover:bg-slate-900/40">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-white">
                      {m.code}
                    </span>
                    <span className="font-semibold text-sm text-slate-200">{m.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                      m.maintenanceStatus === 'critical_overuse'
                        ? 'bg-red-950 text-red-300 border border-red-700'
                        : 'bg-amber-950 text-amber-300 border border-amber-700'
                    }`}>
                      {m.maintenanceStatus === 'critical_overuse' ? 'Critical Overuse' : 'Service Due'}
                    </span>
                  </div>
                  <p className="text-xs text-amber-300/90">{m.serviceNotes}</p>
                  <p className="text-[11px] text-slate-500">
                    Logged: {m.hoursSinceLastService}h operational since {m.lastServicedDate} (Limit: {m.serviceThresholdHours}h)
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => logService(m.id)}
                    className="py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Log Service & Clear
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 24-Hour Peak Usage Histogram Curve */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-sm text-white">24-Hour Facility Busyness Curve</h3>
            <p className="text-xs text-slate-400">Aggregated equipment utilization across the entire gym facility</p>
          </div>
          <span className="text-xs text-slate-400 font-mono">06:00 - 23:00 View</span>
        </div>

        {/* Bar chart representation */}
        <div className="h-44 flex items-end gap-1.5 pt-6 pb-2 px-1">
          {hourlyAverages.slice(6, 23).map((avg, i) => {
            const hour = i + 6;
            const hourStr = `${hour.toString().padStart(2, '0')}:00`;
            const isPeak = avg >= 75;

            return (
              <div key={hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                {/* Tooltip */}
                <div className="absolute -top-7 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 text-white text-[10px] font-mono px-1.5 py-0.5 rounded shadow pointer-events-none whitespace-nowrap z-10">
                  {hourStr}: {avg}% busy
                </div>

                {/* Bar */}
                <div
                  className={`w-full rounded-t transition-all duration-300 ${
                    isPeak
                      ? 'bg-red-500 group-hover:bg-red-400'
                      : avg >= 50
                      ? 'bg-amber-500 group-hover:bg-amber-400'
                      : 'bg-emerald-500 group-hover:bg-emerald-400'
                  }`}
                  style={{ height: `${Math.max(6, avg)}%` }}
                />
                <span className="text-[9px] text-slate-500 font-mono mt-2 truncate w-full text-center">
                  {hour}h
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Equipment Utilization Leaderboard */}
      <div className="bg-slate-900/80 p-5 rounded-xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-white">Equipment Utilization Leaderboard</h3>
          <span className="text-xs text-slate-400">Ranked by Daily Operating Hours</span>
        </div>

        <div className="space-y-3">
          {mostUsed.slice(0, 7).map((m, idx) => (
            <div key={m.id} className="flex items-center gap-3 text-xs">
              <span className="font-mono text-slate-500 font-bold w-4 text-center">#{idx + 1}</span>
              <span className="font-mono font-bold px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 text-[11px]">
                {m.code}
              </span>
              <span className="font-medium text-slate-200 flex-1 truncate">{m.name}</span>
              <span className="text-slate-400 hidden md:inline">{m.avgDailyUsageHours} hrs/day</span>
              <div className="w-24 md:w-36 bg-slate-800 h-2 rounded-full overflow-hidden">
                <div
                  className={`h-full ${
                    m.utilizationPercentage >= 85
                      ? 'bg-red-500'
                      : m.utilizationPercentage >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${m.utilizationPercentage}%` }}
                />
              </div>
              <span className="font-mono font-bold text-slate-300 w-10 text-right">
                {m.utilizationPercentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
