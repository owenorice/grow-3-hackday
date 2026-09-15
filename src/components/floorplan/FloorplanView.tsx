import React from 'react';
import { useGym } from '../../store/GymContext';
import { GymMachine } from '../../types/gym';
import { Clock, AlertTriangle, CheckCircle2, Wrench, X } from 'lucide-react';

export const FloorplanView: React.FC = () => {
  const {
    machines,
    selectedMachineId,
    selectMachine,
    selectedMachine,
    appMode,
    toggleMachineStatus,
    logService,
    toggleMaintenance,
  } = useGym();

  const isStaff = appMode === 'staff';

  const getMachineFill = (m: GymMachine) => {
    if (m.status === 'maintenance') return '#475569'; // slate-600

    if (isStaff) {
      if (m.maintenanceStatus === 'critical_overuse') return '#b91c1c'; // red-700
      if (m.maintenanceStatus === 'service_due') return '#b45309'; // amber-700
      return '#0f766e'; // teal-700
    }

    if (m.status === 'in_use') return '#ef4444'; // red-500
    return '#10b981'; // emerald-500
  };

  const getMachineStroke = (m: GymMachine) => {
    if (m.id === selectedMachineId) return '#38bdf8'; // sky-400 highlight
    if (isStaff && m.maintenanceStatus === 'critical_overuse') return '#fca5a5';
    if (isStaff && m.maintenanceStatus === 'service_due') return '#fcd34d';
    return '#334155'; // slate-700
  };

  return (
    <div className="space-y-4">
      {/* Zone Legend & Top Info */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="font-semibold text-slate-300 uppercase tracking-wider">Zones:</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-blue-500/30 border border-blue-400"></span> Cardio Deck
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-purple-500/30 border border-purple-400"></span> Power Racks & Benches
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-indigo-500/30 border border-indigo-400"></span> Cable & Functional
          </span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <span className="w-2.5 h-2.5 rounded bg-emerald-500/30 border border-emerald-400"></span> Free Weight Turf
          </span>
        </div>

        {/* Status Legend */}
        <div className="flex items-center gap-3">
          {!isStaff ? (
            <>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span> Free
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span> In Use
              </span>
              <span className="flex items-center gap-1 text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Service
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1 text-emerald-400">
                <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span> Healthy (&lt; threshold)
              </span>
              <span className="flex items-center gap-1 text-amber-400">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-600"></span> Service Due
              </span>
              <span className="flex items-center gap-1 text-red-400">
                <span className="w-2.5 h-2.5 rounded-full bg-red-600 animate-pulse"></span> Critical Overuse
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive SVG Floorplan Canvas */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <svg
          viewBox="0 0 1000 580"
          className="w-full h-auto select-none font-sans"
          style={{ minHeight: '380px' }}
        >
          {/* Subtle Grid Pattern */}
          <defs>
            <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="1000" height="580" fill="#090d16" />
          <rect width="1000" height="580" fill="url(#grid)" />

          {/* ZONE 1: Cardio Deck (Top Left) */}
          <g>
            <rect x="30" y="30" width="340" height="230" rx="12" fill="#1e293b" fillOpacity="0.4" stroke="#3b82f6" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="45" y="54" fill="#93c5fd" fontSize="12" fontWeight="700" letterSpacing="0.05em">CARDIO DECK</text>
            <text x="350" y="54" textAnchor="end" fill="#64748b" fontSize="10">8 Machines</text>
          </g>

          {/* ZONE 2: Power & Strength Racks (Top Right) */}
          <g>
            <rect x="410" y="30" width="560" height="230" rx="12" fill="#1e293b" fillOpacity="0.4" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="425" y="54" fill="#d8b4fe" fontSize="12" fontWeight="700" letterSpacing="0.05em">POWER RACKS & PLATFORMS</text>
            <text x="955" y="54" textAnchor="end" fill="#64748b" fontSize="10">6 Stations</text>
          </g>

          {/* ZONE 3: Free Weight Turf (Bottom Left) */}
          <g>
            <rect x="30" y="290" width="340" height="260" rx="12" fill="#1e293b" fillOpacity="0.4" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="45" y="314" fill="#6ee7b7" fontSize="12" fontWeight="700" letterSpacing="0.05em">FREE WEIGHTS & SPRINT TURF</text>
            <text x="350" y="314" textAnchor="end" fill="#64748b" fontSize="10">Dumbbells & Turf</text>
          </g>

          {/* ZONE 4: Cable & Functional Bay (Bottom Right) */}
          <g>
            <rect x="410" y="290" width="560" height="260" rx="12" fill="#1e293b" fillOpacity="0.4" stroke="#6366f1" strokeWidth="1.5" strokeDasharray="4 3" />
            <text x="425" y="314" fill="#a5b4fc" fontSize="12" fontWeight="700" letterSpacing="0.05em">CABLES & PLATE LOADED</text>
            <text x="955" y="314" textAnchor="end" fill="#64748b" fontSize="10">5 Stations</text>
          </g>

          {/* Walkway Guides */}
          <line x1="390" y1="30" x2="390" y2="550" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="30" y1="275" x2="970" y2="275" stroke="#334155" strokeWidth="1" strokeDasharray="3 3" />
          <text x="390" y="280" textAnchor="middle" fill="#475569" fontSize="9" letterSpacing="0.1em">CENTRAL PASSAGEWAY</text>

          {/* MACHINE RECTANGLES */}
          {machines.map(m => {
            const isSelected = m.id === selectedMachineId;
            const fill = getMachineFill(m);
            const stroke = getMachineStroke(m);

            return (
              <g
                key={m.id}
                onClick={() => selectMachine(isSelected ? null : m.id)}
                className="cursor-pointer transition-all hover:opacity-90"
              >
                {/* Selection Aura */}
                {isSelected && (
                  <rect
                    x={m.coordinates.x - 4}
                    y={m.coordinates.y - 4}
                    width={m.coordinates.width + 8}
                    height={m.coordinates.height + 8}
                    rx="10"
                    fill="none"
                    stroke="#38bdf8"
                    strokeWidth="3"
                    className="animate-pulse"
                  />
                )}

                {/* Overuse warning border in staff mode */}
                {isStaff && m.maintenanceStatus === 'critical_overuse' && (
                  <rect
                    x={m.coordinates.x - 3}
                    y={m.coordinates.y - 3}
                    width={m.coordinates.width + 6}
                    height={m.coordinates.height + 6}
                    rx="9"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />
                )}

                {/* Main Machine Box */}
                <rect
                  x={m.coordinates.x}
                  y={m.coordinates.y}
                  width={m.coordinates.width}
                  height={m.coordinates.height}
                  rx="6"
                  fill={fill}
                  stroke={stroke}
                  strokeWidth={isSelected ? '2' : '1.5'}
                />

                {/* Code Label */}
                <text
                  x={m.coordinates.x + m.coordinates.width / 2}
                  y={m.coordinates.y + m.coordinates.height / 2 - 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill="#ffffff"
                  fontSize={m.coordinates.width > 90 ? '11' : '10'}
                  fontWeight="700"
                >
                  {m.code}
                </text>

                {/* Status Subtext or Telemetry */}
                <text
                  x={m.coordinates.x + m.coordinates.width / 2}
                  y={m.coordinates.y + m.coordinates.height / 2 + 10}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={isSelected ? '#bae6fd' : '#e2e8f0'}
                  fontSize="8"
                  fontWeight="500"
                >
                  {!isStaff
                    ? m.status === 'in_use'
                      ? `${m.currentSessionMinutes}m in use`
                      : 'FREE'
                    : `${m.hoursSinceLastService}h / ${m.serviceThresholdHours}h`}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Machine Detail Card Floating in Floorplan */}
        {selectedMachine && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-xl shadow-2xl z-20 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs font-bold border border-slate-700">
                    {selectedMachine.code}
                  </span>
                  <span className="font-bold text-sm text-white">{selectedMachine.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedMachine.zone}</p>
              </div>
              <button
                onClick={() => selectMachine(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guest view details */}
            {!isStaff ? (
              <div className="mt-3 space-y-2 text-xs">
                <div className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60 border border-slate-700/50">
                  <span className="text-slate-400">Current Status:</span>
                  <span
                    className={`font-semibold flex items-center gap-1.5 ${
                      selectedMachine.status === 'available'
                        ? 'text-emerald-400'
                        : selectedMachine.status === 'in_use'
                        ? 'text-red-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {selectedMachine.status === 'available' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" /> Ready for workout
                      </>
                    ) : selectedMachine.status === 'in_use' ? (
                      <>
                        <Clock className="w-3.5 h-3.5" /> In Use ({selectedMachine.currentSessionMinutes}m elapsed)
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3.5 h-3.5" /> Out of Service
                      </>
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between text-slate-400 px-1">
                  <span>Peak Hours:</span>
                  <span className="text-slate-200">{selectedMachine.peakHours}</span>
                </div>

                <button
                  onClick={() => toggleMachineStatus(selectedMachine.id)}
                  className={`w-full py-2 px-3 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
                    selectedMachine.status === 'available'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                      : 'bg-red-600/80 hover:bg-red-500 text-white'
                  }`}
                >
                  {selectedMachine.status === 'available' ? "I'm using this machine" : "Done / Free Machine"}
                </button>
              </div>
            ) : (
              /* Staff View Telemetry & Service Actions */
              <div className="mt-3 space-y-2 text-xs">
                <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Hours Since Last Service:</span>
                    <span className={`font-mono font-bold ${
                      selectedMachine.maintenanceStatus === 'critical_overuse'
                        ? 'text-red-400'
                        : selectedMachine.maintenanceStatus === 'service_due'
                        ? 'text-amber-400'
                        : 'text-emerald-400'
                    }`}>
                      {selectedMachine.hoursSinceLastService}h / {selectedMachine.serviceThresholdHours}h Limit
                    </span>
                  </div>

                  {/* Overuse Progress Bar */}
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        selectedMachine.maintenanceStatus === 'critical_overuse'
                          ? 'bg-red-500'
                          : selectedMachine.maintenanceStatus === 'service_due'
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{
                        width: `${Math.min(100, (selectedMachine.hoursSinceLastService / selectedMachine.serviceThresholdHours) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Lifetime Hours: {selectedMachine.totalLifetimeHours}h</span>
                    <span>Last: {selectedMachine.lastServicedDate}</span>
                  </div>
                </div>

                {selectedMachine.serviceNotes && (
                  <div className="p-2 rounded bg-amber-950/30 border border-amber-800/40 text-amber-300 text-[11px] flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{selectedMachine.serviceNotes}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => logService(selectedMachine.id)}
                    className="flex-1 py-2 px-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center justify-center gap-1.5"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Log Service & Reset
                  </button>
                  <button
                    onClick={() => toggleMaintenance(selectedMachine.id)}
                    className="py-2 px-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium"
                  >
                    {selectedMachine.status === 'maintenance' ? 'Reopen' : 'Flag Out'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
