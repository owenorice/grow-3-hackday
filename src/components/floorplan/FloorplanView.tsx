import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import { GymMachine, GymZone } from '../../types/gym';
import {
  Clock,
  AlertTriangle,
  CheckCircle2,
  Wrench,
  X,
  ZoomIn,
  ZoomOut,
  RotateCcw,
} from 'lucide-react';

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

  // Zoom & Viewport states
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [activeZoneFilter, setActiveZoneFilter] = useState<GymZone | 'all'>('all');
  const [hoveredMachineId, setHoveredMachineId] = useState<string | null>(null);

  // Zone Coordinates for viewport focusing
  const zoneViewBoxes: Record<GymZone | 'all', { x: number; y: number; w: number; h: number }> = {
    all: { x: 0, y: 0, w: 1000, h: 580 },
    'Cardio Deck': { x: 20, y: 20, w: 380, h: 260 },
    'Power & Strength Racks': { x: 390, y: 20, w: 590, h: 260 },
    'Free Weight Turf': { x: 20, y: 270, w: 380, h: 290 },
    'Cable & Functional Bay': { x: 390, y: 270, w: 590, h: 290 },
  };

  const currentViewBox = zoneViewBoxes[activeZoneFilter];

  // Helper to compute zone stats
  const getZoneStats = (zoneName: GymZone) => {
    const zoneMachines = machines.filter(m => m.zone === zoneName);
    const available = zoneMachines.filter(m => m.status === 'available').length;
    const total = zoneMachines.length;
    return { available, total, percentBusy: total > 0 ? Math.round(((total - available) / total) * 100) : 0 };
  };

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

  const handleZoom = (delta: number) => {
    setZoomLevel(prev => Math.min(2.0, Math.max(0.8, Number((prev + delta).toFixed(2)))));
  };

  const resetView = () => {
    setZoomLevel(1);
    setActiveZoneFilter('all');
  };

  const hoveredMachine = machines.find(m => m.id === hoveredMachineId);

  return (
    <div className="space-y-4">
      {/* Top Controls: Zone Jump Filters & Status Legend */}
      <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Zone Selector Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          <span className="font-semibold text-slate-400 uppercase tracking-wider text-[11px] mr-1">
            Focus:
          </span>
          <button
            onClick={() => {
              setActiveZoneFilter('all');
              setZoomLevel(1);
            }}
            className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
              activeZoneFilter === 'all'
                ? isStaff ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
            }`}
          >
            All Zones
          </button>
          {(['Cardio Deck', 'Power & Strength Racks', 'Cable & Functional Bay', 'Free Weight Turf'] as GymZone[]).map(zone => {
            const stats = getZoneStats(zone);
            return (
              <button
                key={zone}
                onClick={() => {
                  setActiveZoneFilter(zone);
                  setZoomLevel(1.2);
                }}
                className={`px-3 py-1.5 rounded-lg font-medium transition-all flex items-center gap-1.5 whitespace-nowrap ${
                  activeZoneFilter === zone
                    ? isStaff ? 'bg-amber-600 text-white' : 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-750'
                }`}
              >
                <span>{zone}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  stats.available > 0 ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-red-950 text-red-300'
                }`}>
                  {stats.available}/{stats.total} free
                </span>
              </button>
            );
          })}
        </div>

        {/* Legend Indicators */}
        <div className="flex items-center gap-3 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
          {!isStaff ? (
            <>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Available
              </span>
              <span className="flex items-center gap-1.5 text-red-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> In Use
              </span>
              <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-slate-600"></span> Maintenance
              </span>
            </>
          ) : (
            <>
              <span className="flex items-center gap-1.5 text-teal-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-teal-500"></span> Healthy
              </span>
              <span className="flex items-center gap-1.5 text-amber-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span> Service Due
              </span>
              <span className="flex items-center gap-1.5 text-red-400 font-medium animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500"></span> Overuse Alert
              </span>
            </>
          )}
        </div>
      </div>

      {/* Main Floorplan Container */}
      <div className="relative bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        {/* Floating Architectural Toolbar (Top Left) */}
        <div className="absolute top-4 left-4 z-20 flex items-center gap-2 bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700/80 text-xs shadow-lg">
          <span className="font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Floorplan View
          </span>
          {activeZoneFilter !== 'all' && (
            <span className="text-emerald-400 font-semibold">• {activeZoneFilter}</span>
          )}
        </div>

        {/* Floating Zoom & Reset Controls (Top Right) */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-slate-900/90 backdrop-blur-md p-1 rounded-xl border border-slate-700/80 shadow-lg">
          <button
            onClick={() => handleZoom(0.2)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <span className="text-[11px] font-mono text-slate-400 px-1 font-semibold">
            {Math.round(zoomLevel * 100)}%
          </span>
          <button
            onClick={() => handleZoom(-0.2)}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetView}
            className="p-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-l border-slate-700/80 pl-2"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* SVG Floorplan Canvas */}
        <div className="overflow-hidden cursor-crosshair">
          <svg
            viewBox={`${currentViewBox.x} ${currentViewBox.y} ${currentViewBox.w} ${currentViewBox.h}`}
            className="w-full h-auto select-none font-sans transition-all duration-500 ease-out"
            style={{
              minHeight: '440px',
              transform: `scale(${zoomLevel})`,
              transformOrigin: 'center center',
            }}
          >
            {/* SVG Definitions */}
            <defs>
              {/* Floor Tile Grid */}
              <pattern id="floor-grid" width="25" height="25" patternUnits="userSpaceOnUse">
                <path d="M 25 0 L 0 0 0 25" fill="none" stroke="#1e293b" strokeWidth="0.6" />
              </pattern>

              {/* Turf Texture */}
              <pattern id="turf-stripes" width="20" height="20" patternUnits="userSpaceOnUse">
                <rect width="20" height="10" fill="#064e3b" fillOpacity="0.35" />
                <rect y="10" width="20" height="10" fill="#065f46" fillOpacity="0.45" />
              </pattern>

              {/* Glow Filter for Active Machines */}
              <filter id="emerald-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              <filter id="overuse-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Background Canvas */}
            <rect width="1000" height="580" fill="#080c14" />
            <rect width="1000" height="580" fill="url(#floor-grid)" />

            {/* OUTER WALLS */}
            <rect x="15" y="15" width="970" height="550" rx="16" fill="none" stroke="#334155" strokeWidth="3" />

            {/* ENTRANCE & RECEPTION DOORS (Bottom Center) */}
            <g>
              <rect x="440" y="555" width="120" height="15" fill="#0f172a" />
              <path d="M 440 565 A 60 60 0 0 1 500 565" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 560 565 A 60 60 0 0 0 500 565" fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
              <text x="500" y="550" textAnchor="middle" fill="#10b981" fontSize="10" fontWeight="700" letterSpacing="0.1em">
                MAIN CLUB ENTRANCE & TURNSTILES
              </text>
            </g>

            {/* LOCKER ROOMS & SPA EXITS (Top Center) */}
            <g>
              <rect x="450" y="10" width="100" height="15" fill="#0f172a" />
              <text x="500" y="24" textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="600" letterSpacing="0.08em">
                TO SPA & LOCKER SUITES
              </text>
            </g>

            {/* HYDRATION & TOWEL STATIONS */}
            <g transform="translate(385, 250)">
              <rect x="0" y="0" width="26" height="26" rx="6" fill="#0284c7" fillOpacity="0.2" stroke="#38bdf8" strokeWidth="1" />
              <circle cx="13" cy="13" r="7" fill="#0369a1" />
              <text x="13" y="16" textAnchor="middle" fill="#ffffff" fontSize="9" fontWeight="bold">H₂O</text>
              <text x="13" y="36" textAnchor="middle" fill="#38bdf8" fontSize="8" fontWeight="600">WATER</text>
            </g>

            <g transform="translate(385, 300)">
              <rect x="0" y="0" width="26" height="26" rx="6" fill="#10b981" fillOpacity="0.2" stroke="#34d399" strokeWidth="1" />
              <circle cx="13" cy="13" r="7" fill="#059669" />
              <text x="13" y="16" textAnchor="middle" fill="#ffffff" fontSize="8" fontWeight="bold">WIPES</text>
              <text x="13" y="36" textAnchor="middle" fill="#34d399" fontSize="8" fontWeight="600">CLEAN</text>
            </g>

            {/* ===================== ZONE 1: CARDIO DECK ===================== */}
            <g>
              <rect
                x="30"
                y="30"
                width="340"
                height="225"
                rx="12"
                fill="#1e293b"
                fillOpacity="0.35"
                stroke="#3b82f6"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="45" y="52" fill="#93c5fd" fontSize="12" fontWeight="800" letterSpacing="0.05em">
                CARDIO DECK
              </text>
              <text x="350" y="52" textAnchor="end" fill="#64748b" fontSize="10">
                LifeFitness & Matrix
              </text>
            </g>

            {/* ===================== ZONE 2: POWER RACKS & BENCHES ===================== */}
            <g>
              <rect
                x="430"
                y="30"
                width="540"
                height="225"
                rx="12"
                fill="#1e293b"
                fillOpacity="0.35"
                stroke="#a855f7"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="445" y="52" fill="#d8b4fe" fontSize="12" fontWeight="800" letterSpacing="0.05em">
                POWER RACKS & OLYMPIC PLATFORMS
              </text>
              <text x="955" y="52" textAnchor="end" fill="#64748b" fontSize="10">
                Eleiko & Hammer Strength
              </text>
            </g>

            {/* ===================== ZONE 3: FREE WEIGHTS & TURF ===================== */}
            <g>
              <rect
                x="30"
                y="280"
                width="340"
                height="265"
                rx="12"
                fill="#1e293b"
                fillOpacity="0.35"
                stroke="#10b981"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="45" y="302" fill="#6ee7b7" fontSize="12" fontWeight="800" letterSpacing="0.05em">
                FREE WEIGHTS & FUNCTIONAL TURF
              </text>
              <text x="350" y="302" textAnchor="end" fill="#64748b" fontSize="10">
                Dumbbells to 50kg
              </text>

              {/* Turf Grass pattern fill inside Turf area */}
              <rect x="50" y="420" width="260" height="80" rx="8" fill="url(#turf-stripes)" stroke="#059669" strokeWidth="1" />
              {/* Turf distance markers */}
              <line x1="115" y1="420" x2="115" y2="500" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="180" y1="420" x2="180" y2="500" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
              <line x1="245" y1="420" x2="245" y2="500" stroke="#10b981" strokeWidth="1" strokeDasharray="2 2" />
              <text x="115" y="435" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">5M</text>
              <text x="180" y="435" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">10M</text>
              <text x="245" y="435" textAnchor="middle" fill="#6ee7b7" fontSize="8" fontWeight="bold">15M</text>
            </g>

            {/* ===================== ZONE 4: CABLE & FUNCTIONAL BAY ===================== */}
            <g>
              <rect
                x="430"
                y="280"
                width="540"
                height="265"
                rx="12"
                fill="#1e293b"
                fillOpacity="0.35"
                stroke="#6366f1"
                strokeWidth="1.5"
                strokeDasharray="4 3"
              />
              <text x="445" y="302" fill="#a5b4fc" fontSize="12" fontWeight="800" letterSpacing="0.05em">
                CABLE CROSSOVER & PLATE LOADED
              </text>
              <text x="955" y="302" textAnchor="end" fill="#64748b" fontSize="10">
                Pulleys & Leg Machines
              </text>
            </g>

            {/* Central Main Corridor */}
            <line x1="398" y1="30" x2="398" y2="540" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <line x1="30" y1="265" x2="970" y2="265" stroke="#334155" strokeWidth="1" strokeDasharray="4 4" />
            <text x="400" y="270" textAnchor="middle" fill="#475569" fontSize="9" letterSpacing="0.15em">
              MAIN CENTRAL CORRIDOR
            </text>

            {/* ===================== MACHINE NODES ===================== */}
            {machines.map(m => {
              const isSelected = m.id === selectedMachineId;
              const isHovered = m.id === hoveredMachineId;
              const fill = getMachineFill(m);
              const stroke = getMachineStroke(m);

              const isOverdue = isStaff && m.maintenanceStatus === 'critical_overuse';
              const isServiceDue = isStaff && m.maintenanceStatus === 'service_due';
              const isAvailable = m.status === 'available';

              return (
                <g
                  key={m.id}
                  onClick={() => selectMachine(isSelected ? null : m.id)}
                  onMouseEnter={() => setHoveredMachineId(m.id)}
                  onMouseLeave={() => setHoveredMachineId(null)}
                  className="cursor-pointer transition-all duration-200"
                >
                  {/* Subtle Radar Pulse for Available Machines in Guest Mode */}
                  {!isStaff && isAvailable && (
                    <circle
                      cx={m.coordinates.x + m.coordinates.width / 2}
                      cy={m.coordinates.y + m.coordinates.height / 2}
                      r={Math.max(m.coordinates.width, m.coordinates.height) / 1.7}
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="1"
                      strokeOpacity="0.4"
                      className="animate-ping"
                      style={{ animationDuration: '4s' }}
                    />
                  )}

                  {/* Pulsing Beacon for Selected Machine */}
                  {isSelected && (
                    <rect
                      x={m.coordinates.x - 5}
                      y={m.coordinates.y - 5}
                      width={m.coordinates.width + 10}
                      height={m.coordinates.height + 10}
                      rx="10"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="3.5"
                      className="animate-pulse"
                    />
                  )}

                  {/* Overuse Warning Border in Staff Mode */}
                  {isOverdue && (
                    <rect
                      x={m.coordinates.x - 4}
                      y={m.coordinates.y - 4}
                      width={m.coordinates.width + 8}
                      height={m.coordinates.height + 8}
                      rx="9"
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2.5"
                      strokeDasharray="4 2"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Machine Box */}
                  <rect
                    x={m.coordinates.x}
                    y={m.coordinates.y}
                    width={m.coordinates.width}
                    height={m.coordinates.height}
                    rx="7"
                    fill={fill}
                    stroke={stroke}
                    strokeWidth={isSelected || isHovered ? '2.5' : '1.5'}
                    filter={isAvailable && !isStaff ? 'url(#emerald-glow)' : undefined}
                    className="transition-colors duration-200"
                  />

                  {/* Visual Machine Glyph / Details */}
                  {/* Treadmill running lines */}
                  {m.code.startsWith('TM') && (
                    <g opacity="0.4">
                      <line x1={m.coordinates.x + 8} y1={m.coordinates.y + 10} x2={m.coordinates.x + m.coordinates.width - 8} y2={m.coordinates.y + 10} stroke="#ffffff" strokeWidth="1" />
                      <line x1={m.coordinates.x + 8} y1={m.coordinates.y + m.coordinates.height - 10} x2={m.coordinates.x + m.coordinates.width - 8} y2={m.coordinates.y + m.coordinates.height - 10} stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Power Rack Barbell Glyph */}
                  {m.code.startsWith('SQ') && (
                    <g opacity="0.4">
                      <line x1={m.coordinates.x + 10} y1={m.coordinates.y + m.coordinates.height / 2} x2={m.coordinates.x + m.coordinates.width - 10} y2={m.coordinates.y + m.coordinates.height / 2} stroke="#ffffff" strokeWidth="2" />
                      <circle cx={m.coordinates.x + 14} cy={m.coordinates.y + m.coordinates.height / 2} r="4" fill="#ffffff" />
                      <circle cx={m.coordinates.x + m.coordinates.width - 14} cy={m.coordinates.y + m.coordinates.height / 2} r="4" fill="#ffffff" />
                    </g>
                  )}

                  {/* Cable Tower Pulley Arms Glyph */}
                  {m.code.startsWith('CC') && (
                    <g opacity="0.4">
                      <circle cx={m.coordinates.x + 12} cy={m.coordinates.y + 15} r="4" fill="#ffffff" />
                      <circle cx={m.coordinates.x + m.coordinates.width - 12} cy={m.coordinates.y + 15} r="4" fill="#ffffff" />
                      <line x1={m.coordinates.x + 12} y1={m.coordinates.y + 15} x2={m.coordinates.x + m.coordinates.width / 2} y2={m.coordinates.y + m.coordinates.height - 12} stroke="#ffffff" strokeWidth="1" />
                      <line x1={m.coordinates.x + m.coordinates.width - 12} y1={m.coordinates.y + 15} x2={m.coordinates.x + m.coordinates.width / 2} y2={m.coordinates.y + m.coordinates.height - 12} stroke="#ffffff" strokeWidth="1" />
                    </g>
                  )}

                  {/* Code Label */}
                  <text
                    x={m.coordinates.x + m.coordinates.width / 2}
                    y={m.coordinates.y + m.coordinates.height / 2 - 4}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="#ffffff"
                    fontSize={m.coordinates.width > 90 ? '11' : '10'}
                    fontWeight="800"
                    letterSpacing="0.03em"
                  >
                    {m.code}
                  </text>

                  {/* Subtext Status or Hours */}
                  <text
                    x={m.coordinates.x + m.coordinates.width / 2}
                    y={m.coordinates.y + m.coordinates.height / 2 + 10}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill={isSelected ? '#bae6fd' : '#f8fafc'}
                    fontSize="8"
                    fontWeight="600"
                  >
                    {!isStaff
                      ? m.status === 'in_use'
                        ? `${m.currentSessionMinutes}m in use`
                        : 'FREE'
                      : `${m.hoursSinceLastService}h / ${m.serviceThresholdHours}h`}
                  </text>

                  {/* Staff Warning Badge Icon */}
                  {isStaff && (isOverdue || isServiceDue) && (
                    <circle
                      cx={m.coordinates.x + m.coordinates.width - 4}
                      cy={m.coordinates.y + 4}
                      r="6"
                      fill={isOverdue ? '#ef4444' : '#f59e0b'}
                      stroke="#0f172a"
                      strokeWidth="1.5"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Hover Tooltip Preview */}
        {hoveredMachine && !selectedMachine && (
          <div
            className="absolute top-16 left-6 pointer-events-none bg-slate-900/95 backdrop-blur-md border border-slate-700/80 px-3 py-2 rounded-xl shadow-xl z-30 transition-all text-xs"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono font-bold text-slate-200">{hoveredMachine.code}</span>
              <span className="font-semibold text-white">{hoveredMachine.name}</span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-[11px]">
              <span className={hoveredMachine.status === 'available' ? 'text-emerald-400 font-semibold' : 'text-red-400 font-semibold'}>
                {hoveredMachine.status === 'available' ? '🟢 Available' : `🔴 In Use (${hoveredMachine.currentSessionMinutes}m)`}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{hoveredMachine.zone}</span>
            </div>
          </div>
        )}

        {/* Selected Machine Detail Card Floating in Floorplan */}
        {selectedMachine && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-slate-900/95 backdrop-blur-md border border-slate-700 p-4 rounded-2xl shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-lg bg-slate-800 text-slate-200 font-mono text-xs font-bold border border-slate-700">
                    {selectedMachine.code}
                  </span>
                  <span className="font-bold text-sm text-white">{selectedMachine.name}</span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{selectedMachine.zone}</p>
              </div>
              <button
                onClick={() => selectMachine(null)}
                className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guest view details */}
            {!isStaff ? (
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/50">
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
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free & Ready to Workout
                      </>
                    ) : selectedMachine.status === 'in_use' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-red-400" /> In Use ({selectedMachine.currentSessionMinutes}m elapsed)
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3.5 h-3.5 text-slate-400" /> Out of Service
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-400 p-1">
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Peak Times</span>
                    <span className="text-slate-200 font-medium text-[11px] truncate block">{selectedMachine.peakHours}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-slate-500 uppercase font-semibold">Estimated Wait</span>
                    <span className="text-slate-200 font-medium text-[11px]">
                      {selectedMachine.status === 'available' ? 'None (Free)' : `~${selectedMachine.estimatedWaitMinutes} mins`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMachineStatus(selectedMachine.id)}
                  className={`w-full py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg ${
                    selectedMachine.status === 'available'
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/50'
                      : 'bg-red-600/90 hover:bg-red-500 text-white shadow-red-950/50'
                  }`}
                >
                  {selectedMachine.status === 'available' ? "I'm using this machine" : "Done / Free Up Machine"}
                </button>
              </div>
            ) : (
              /* Staff View Telemetry & Service Actions */
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700/60 space-y-2">
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
                  <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
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

                  <div className="flex justify-between text-[11px] text-slate-400 pt-0.5">
                    <span>Total Lifetime: {selectedMachine.totalLifetimeHours}h</span>
                    <span>Last Serviced: {selectedMachine.lastServicedDate}</span>
                  </div>
                </div>

                {selectedMachine.serviceNotes && (
                  <div className="p-2.5 rounded-xl bg-amber-950/40 border border-amber-800/50 text-amber-300 text-[11px] flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                    <span>{selectedMachine.serviceNotes}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => logService(selectedMachine.id)}
                    className="flex-1 py-2.5 px-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-1.5 shadow-lg shadow-amber-950/40"
                  >
                    <Wrench className="w-3.5 h-3.5" /> Log Service & Reset
                  </button>
                  <button
                    onClick={() => toggleMaintenance(selectedMachine.id)}
                    className="py-2.5 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-300 font-medium"
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
