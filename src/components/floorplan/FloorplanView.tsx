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
    if (m.status === 'maintenance') return '#333333'; // neutral-800

    if (isStaff) {
      if (m.maintenanceStatus === 'critical_overuse') return '#DC3545'; // Danger
      if (m.maintenanceStatus === 'service_due') return '#FFC107'; // Warning
      return '#198754'; // Success green
    }

    if (m.status === 'in_use') return '#DC3545'; // Danger
    return '#97D700'; // Volt Lime (Village Gym brand accent)
  };

  const getMachineStroke = (m: GymMachine) => {
    if (m.id === selectedMachineId) return '#FFFFFF'; // White high-contrast selection
    if (isStaff && m.maintenanceStatus === 'critical_overuse') return '#DC3545';
    if (isStaff && m.maintenanceStatus === 'service_due') return '#FFC107';
    return '#212529'; // Dark charcoal border
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
              <pattern id="floor-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#222222" strokeWidth="0.8" />
              </pattern>

              {/* Turf Texture */}
              <pattern id="turf-stripes" width="16" height="16" patternUnits="userSpaceOnUse">
                <rect width="16" height="8" fill="#143601" fillOpacity="0.4" />
                <rect y="8" width="16" height="8" fill="#1b4d02" fillOpacity="0.6" />
              </pattern>

              {/* Ambient Stadium Spotlights */}
              <radialGradient id="spotlight-power" cx="70%" cy="25%" r="45%">
                <stop offset="0%" stopColor="#97D700" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="spotlight-turf" cx="22%" cy="75%" r="40%">
                <stop offset="0%" stopColor="#97D700" stopOpacity="0.10" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              <radialGradient id="spotlight-cardio" cx="20%" cy="25%" r="35%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.06" />
                <stop offset="100%" stopColor="#000000" stopOpacity="0" />
              </radialGradient>

              {/* Glow Filter for Active Machines */}
              <filter id="volt-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#97D700" floodOpacity="0.7"/>
              </filter>

              <filter id="overuse-glow" x="-30%" y="-30%" width="160%" height="160%">
                <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#DC3545" floodOpacity="0.8"/>
              </filter>
            </defs>

            {/* Background Canvas */}
            <rect width="1000" height="580" fill="#000000" />
            <rect width="1000" height="580" fill="url(#floor-grid)" />

            {/* Stadium Ambient Lights */}
            <rect width="1000" height="580" fill="url(#spotlight-power)" pointerEvents="none" />
            <rect width="1000" height="580" fill="url(#spotlight-turf)" pointerEvents="none" />
            <rect width="1000" height="580" fill="url(#spotlight-cardio)" pointerEvents="none" />

            {/* OUTER WALLS - Sharp Brutalist Zero-Radius */}
            <rect x="15" y="15" width="970" height="550" rx="0" fill="none" stroke="#333333" strokeWidth="2.5" />
            
            {/* Corner Tactical Brackets */}
            <path d="M 15 35 L 15 15 L 35 15" fill="none" stroke="#97D700" strokeWidth="2" />
            <path d="M 965 15 L 985 15 L 985 35" fill="none" stroke="#97D700" strokeWidth="2" />
            <path d="M 15 545 L 15 565 L 35 565" fill="none" stroke="#97D700" strokeWidth="2" />
            <path d="M 965 565 L 985 565 L 985 545" fill="none" stroke="#97D700" strokeWidth="2" />

            {/* ENTRANCE & RECEPTION DOORS (Bottom Center) */}
            <g>
              <rect x="440" y="555" width="120" height="15" fill="#000000" stroke="#333333" strokeWidth="1" />
              <path d="M 440 565 A 60 60 0 0 1 500 565" fill="none" stroke="#97D700" strokeWidth="2" strokeDasharray="3 3" />
              <path d="M 560 565 A 60 60 0 0 0 500 565" fill="none" stroke="#97D700" strokeWidth="2" strokeDasharray="3 3" />
              <text x="500" y="548" textAnchor="middle" fill="#97D700" fontSize="10" fontWeight="900" letterSpacing="0.15em">
                MAIN CLUB ENTRANCE & TURNSTILES
              </text>
            </g>

            {/* LOCKER ROOMS & SPA EXITS (Top Center) */}
            <g>
              <rect x="445" y="10" width="110" height="15" fill="#000000" stroke="#333333" strokeWidth="1" />
              <text x="500" y="22" textAnchor="middle" fill="#AAAAAA" fontSize="9" fontWeight="700" letterSpacing="0.12em">
                TO SPA & LOCKER SUITES
              </text>
            </g>

            {/* HYDRATION & TOWEL STATIONS */}
            <g transform="translate(385, 245)">
              <rect x="0" y="0" width="28" height="28" fill="#111111" stroke="#333333" strokeWidth="1.5" />
              <text x="14" y="14" textAnchor="middle" fill="#97D700" fontSize="9" fontWeight="900">H₂O</text>
              <text x="14" y="24" textAnchor="middle" fill="#AAAAAA" fontSize="7" fontWeight="700" letterSpacing="0.05em">WATER</text>
            </g>

            <g transform="translate(385, 295)">
              <rect x="0" y="0" width="28" height="28" fill="#111111" stroke="#333333" strokeWidth="1.5" />
              <text x="14" y="14" textAnchor="middle" fill="#97D700" fontSize="9" fontWeight="900">WIPES</text>
              <text x="14" y="24" textAnchor="middle" fill="#AAAAAA" fontSize="7" fontWeight="700" letterSpacing="0.05em">CLEAN</text>
            </g>

            {/* ===================== ZONE 1: CARDIO DECK POD ===================== */}
            <g>
              <rect
                x="30"
                y="30"
                width="340"
                height="225"
                rx="0"
                fill="#111111"
                fillOpacity="0.4"
                stroke="#333333"
                strokeWidth="1.5"
              />
              <line x1="30" y1="30" x2="120" y2="30" stroke="#97D700" strokeWidth="2.5" />
              <text x="45" y="52" fill="#FFFFFF" fontSize="12" fontWeight="900" letterSpacing="0.12em">
                CARDIO DECK
              </text>
              <text x="350" y="52" textAnchor="end" fill="#777777" fontSize="10" letterSpacing="0.05em">
                LifeFitness & Matrix
              </text>
            </g>

            {/* ===================== ZONE 2: POWER RACKS POD ===================== */}
            <g>
              <rect
                x="430"
                y="30"
                width="540"
                height="225"
                rx="0"
                fill="#111111"
                fillOpacity="0.4"
                stroke="#333333"
                strokeWidth="1.5"
              />
              <line x1="430" y1="30" x2="550" y2="30" stroke="#97D700" strokeWidth="2.5" />
              <text x="445" y="52" fill="#FFFFFF" fontSize="12" fontWeight="900" letterSpacing="0.12em">
                POWER RACKS & OLYMPIC PLATFORMS
              </text>
              <text x="955" y="52" textAnchor="end" fill="#777777" fontSize="10" letterSpacing="0.05em">
                Eleiko & Hammer Strength
              </text>
            </g>

            {/* ===================== ZONE 3: FREE WEIGHTS & TURF POD ===================== */}
            <g>
              <rect
                x="30"
                y="280"
                width="340"
                height="265"
                rx="0"
                fill="#111111"
                fillOpacity="0.4"
                stroke="#333333"
                strokeWidth="1.5"
              />
              <line x1="30" y1="280" x2="130" y2="280" stroke="#97D700" strokeWidth="2.5" />
              <text x="45" y="302" fill="#FFFFFF" fontSize="12" fontWeight="900" letterSpacing="0.12em">
                FREE WEIGHTS & FUNCTIONAL TURF
              </text>
              <text x="350" y="302" textAnchor="end" fill="#777777" fontSize="10" letterSpacing="0.05em">
                Dumbbells to 50kg
              </text>

              {/* Turf Runway Fill */}
              <rect x="50" y="420" width="260" height="80" rx="0" fill="url(#turf-stripes)" stroke="#222222" strokeWidth="1" />
              {/* Turf distance markers */}
              <line x1="115" y1="420" x2="115" y2="500" stroke="#97D700" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="180" y1="420" x2="180" y2="500" stroke="#97D700" strokeWidth="1.5" strokeDasharray="3 3" />
              <line x1="245" y1="420" x2="245" y2="500" stroke="#97D700" strokeWidth="1.5" strokeDasharray="3 3" />
              <text x="115" y="435" textAnchor="middle" fill="#97D700" fontSize="9" fontWeight="900">5M</text>
              <text x="180" y="435" textAnchor="middle" fill="#97D700" fontSize="9" fontWeight="900">10M</text>
              <text x="245" y="435" textAnchor="middle" fill="#97D700" fontSize="9" fontWeight="900">15M</text>
            </g>

            {/* ===================== ZONE 4: CABLE & FUNCTIONAL BAY POD ===================== */}
            <g>
              <rect
                x="430"
                y="280"
                width="540"
                height="265"
                rx="0"
                fill="#111111"
                fillOpacity="0.4"
                stroke="#333333"
                strokeWidth="1.5"
              />
              <line x1="430" y1="280" x2="560" y2="280" stroke="#97D700" strokeWidth="2.5" />
              <text x="445" y="302" fill="#FFFFFF" fontSize="12" fontWeight="900" letterSpacing="0.12em">
                CABLE CROSSOVER & PLATE LOADED
              </text>
              <text x="955" y="302" textAnchor="end" fill="#777777" fontSize="10" letterSpacing="0.05em">
                Pulleys & Leg Machines
              </text>
            </g>

            {/* Central Main Corridor */}
            <line x1="398" y1="30" x2="398" y2="540" stroke="#222222" strokeWidth="1.5" strokeDasharray="6 4" />
            <line x1="30" y1="265" x2="970" y2="265" stroke="#222222" strokeWidth="1.5" strokeDasharray="6 4" />
            <text x="400" y="270" textAnchor="middle" fill="#555555" fontSize="9" fontWeight="700" letterSpacing="0.2em">
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
                    filter={isAvailable && !isStaff ? 'url(#volt-glow)' : undefined}
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

        {/* Selected Machine Detail Card Floating in Floorplan - Village Gym Pod */}
        {selectedMachine && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-black border-2 border-[#97D700] p-4 shadow-[0_0_30px_rgba(151,215,0,0.25)] z-30 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 bg-[#212529] text-[#97D700] font-mono text-xs font-bold border border-[#333333]">
                    {selectedMachine.code}
                  </span>
                  <span className="font-black text-sm uppercase tracking-wider text-white">{selectedMachine.name}</span>
                </div>
                <p className="text-xs text-[#AAAAAA] uppercase tracking-wider font-semibold mt-0.5">{selectedMachine.zone}</p>
              </div>
              <button
                onClick={() => selectMachine(null)}
                className="text-[#AAAAAA] hover:text-white p-1 hover:bg-[#212529] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Guest view details */}
            {!isStaff ? (
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="flex items-center justify-between p-2.5 bg-[#111111] border border-[#333333]">
                  <span className="text-[#AAAAAA] uppercase font-bold tracking-wider text-[10px]">Current Status:</span>
                  <span
                    className={`font-black uppercase tracking-wider flex items-center gap-1.5 ${
                      selectedMachine.status === 'available'
                        ? 'text-[#97D700]'
                        : selectedMachine.status === 'in_use'
                        ? 'text-[#DC3545]'
                        : 'text-[#AAAAAA]'
                    }`}
                  >
                    {selectedMachine.status === 'available' ? (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#97D700]" /> FREE & READY
                      </>
                    ) : selectedMachine.status === 'in_use' ? (
                      <>
                        <Clock className="w-3.5 h-3.5 text-[#DC3545]" /> OCCUPIED ({selectedMachine.currentSessionMinutes}m)
                      </>
                    ) : (
                      <>
                        <Wrench className="w-3.5 h-3.5 text-[#777777]" /> UNDER SERVICE
                      </>
                    )}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-slate-400 p-1">
                  <div>
                    <span className="block text-[10px] text-[#777777] uppercase font-bold tracking-wider">Peak Times</span>
                    <span className="text-white font-medium text-[11px] truncate block">{selectedMachine.peakHours}</span>
                  </div>
                  <div>
                    <span className="block text-[10px] text-[#777777] uppercase font-bold tracking-wider">Estimated Wait</span>
                    <span className="text-[#97D700] font-bold text-[11px]">
                      {selectedMachine.status === 'available' ? '0 MINS (FREE)' : `~${selectedMachine.estimatedWaitMinutes} MINS`}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => toggleMachineStatus(selectedMachine.id)}
                  className={`w-full vg-btn ${
                    selectedMachine.status === 'available' ? 'vg-btn-3' : 'vg-btn-danger'
                  }`}
                >
                  {selectedMachine.status === 'available' ? "CLAIM THIS STATION" : "RELEASE STATION"}
                </button>
              </div>
            ) : (
              /* Staff View Telemetry & Service Actions */
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-3 bg-[#111111] border border-[#333333] space-y-2">
                  <div className="flex justify-between">
                    <span className="text-[#AAAAAA] uppercase font-bold tracking-wider text-[10px]">Hours Since Last Service:</span>
                    <span className={`font-mono font-black ${
                      selectedMachine.maintenanceStatus === 'critical_overuse'
                        ? 'text-[#DC3545]'
                        : selectedMachine.maintenanceStatus === 'service_due'
                        ? 'text-[#FFC107]'
                        : 'text-[#97D700]'
                    }`}>
                      {selectedMachine.hoursSinceLastService}h / {selectedMachine.serviceThresholdHours}h Limit
                    </span>
                  </div>

                  {/* Overuse Progress Bar */}
                  <div className="w-full bg-[#212529] h-2.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        selectedMachine.maintenanceStatus === 'critical_overuse'
                          ? 'bg-[#DC3545]'
                          : selectedMachine.maintenanceStatus === 'service_due'
                          ? 'bg-[#FFC107]'
                          : 'bg-[#97D700]'
                      }`}
                      style={{
                        width: `${Math.min(100, (selectedMachine.hoursSinceLastService / selectedMachine.serviceThresholdHours) * 100)}%`,
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-[11px] text-[#777777] pt-0.5 uppercase tracking-wider font-semibold">
                    <span>Lifetime: {selectedMachine.totalLifetimeHours}h</span>
                    <span>Last Serviced: {selectedMachine.lastServicedDate}</span>
                  </div>
                </div>

                {selectedMachine.serviceNotes && (
                  <div className="p-2.5 bg-[#212529] border-l-4 border-[#FFC107] text-[#FFC107] text-[11px] flex gap-2">
                    <AlertTriangle className="w-4 h-4 text-[#FFC107] flex-shrink-0 mt-0.5" />
                    <span>{selectedMachine.serviceNotes}</span>
                  </div>
                )}

                <div className="flex gap-2 pt-1">
                  <button
                    onClick={() => logService(selectedMachine.id)}
                    className="flex-1 vg-btn vg-btn-3"
                  >
                    <Wrench className="w-3.5 h-3.5" /> LOG SERVICE
                  </button>
                  <button
                    onClick={() => toggleMaintenance(selectedMachine.id)}
                    className="vg-btn vg-btn-1"
                  >
                    {selectedMachine.status === 'maintenance' ? 'RESTORE' : 'FLAG OUT'}
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
