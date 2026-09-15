import React, { useState, useMemo } from 'react';
import { useGym } from '../../store/GymContext';
import {
  ChevronUp,
  ChevronDown,
  X,
  Play,
  CheckCircle2,
  Clock,
  ArrowRight,
  MoveUp,
  MoveDown,
  Trash2,
  MapPin,
  Flame,
  Dumbbell,
  HeartPulse,
  Layers,
  Sparkles,
  RotateCcw,
  Zap,
} from 'lucide-react';
import { EquipmentCategory } from '../../types/gym';

export const WorkoutCircuitDrawer: React.FC = () => {
  const {
    machines,
    circuit,
    advanceCircuit,
    removeFromCircuit,
    clearCircuit,
    moveCircuitStation,
    updateStationTiming,
    setCircuitStep,
    optimizeCircuitRoute,
    swapCircuitMachine,
    selectMachine,
    setActiveTab,
    appMode,
  } = useGym();

  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If in staff mode, hide member workout circuit or keep minimal
  const isStaff = appMode === 'staff';

  const stationsWithData = useMemo(() => {
    return circuit.stations.map((station, index) => {
      const machine = machines.find(m => m.id === station.machineId);
      const isCurrent = index === circuit.currentStepIndex;
      const isPast = index < circuit.currentStepIndex;
      const isUpcoming = index > circuit.currentStepIndex;

      return {
        ...station,
        index,
        machine,
        isCurrent,
        isPast,
        isUpcoming,
      };
    });
  }, [circuit, machines]);

  // Congested upcoming stations where equipment is currently occupied
  const upcomingCongested = useMemo(() => {
    return stationsWithData.filter(s => s.isUpcoming && s.machine && s.machine.status === 'in_use');
  }, [stationsWithData]);

  const totalUpcomingWaitMinutes = useMemo(() => {
    return upcomingCongested.reduce((sum, s) => sum + (s.machine?.estimatedWaitMinutes || 8), 0);
  }, [upcomingCongested]);

  // Find equivalent machine recommendations for any congested stations
  const alternativeRecommendations = useMemo(() => {
    return upcomingCongested
      .map(station => {
        const busyMachine = station.machine!;
        // Find machines with matching codes or same target muscle group that are AVAILABLE
        const candidates = machines.filter(m => {
          if (m.id === busyMachine.id || m.status !== 'available') return false;
          const matchesEquivalentCode = busyMachine.equivalentMachineCodes?.includes(m.code);
          const matchesTargetMuscle =
            busyMachine.targetMuscleGroup &&
            m.targetMuscleGroup &&
            busyMachine.targetMuscleGroup === m.targetMuscleGroup;
          const matchesCategory = m.category === busyMachine.category;
          return matchesEquivalentCode || matchesTargetMuscle || matchesCategory;
        });

        return {
          congestedStation: station,
          busyMachine,
          bestAlternative: candidates[0] || null,
        };
      })
      .filter(r => r.bestAlternative !== null);
  }, [upcomingCongested, machines]);

  const handleAutoOptimize = () => {
    const { reordered, savedMinutes } = optimizeCircuitRoute();
    if (reordered) {
      setToastMessage(`⚡ Smart route re-ordered! Saved ${savedMinutes} minutes in upcoming wait time.`);
    } else {
      setToastMessage('✅ Stations already sequenced for optimal turnover!');
    }
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleSwapAlternative = (busyId: string, altId: string, altName: string) => {
    swapCircuitMachine(busyId, altId);
    setToastMessage(`🔄 Replaced with ${altName}! Station is available immediately (0m wait).`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const currentStationData = stationsWithData[circuit.currentStepIndex] || null;

  const totalExerciseMinutes = useMemo(() => {
    return circuit.stations.reduce((sum, s) => sum + s.plannedMinutes, 0);
  }, [circuit.stations]);

  const totalRestMinutes = useMemo(() => {
    return circuit.stations.reduce((sum, s) => sum + s.restTransitionMinutes, 0);
  }, [circuit.stations]);

  const totalCircuitMinutes = totalExerciseMinutes + totalRestMinutes;

  const getCategoryIcon = (category?: EquipmentCategory) => {
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

  const handleViewOnMap = (e: React.MouseEvent, machineId: string) => {
    e.stopPropagation();
    selectMachine(machineId);
    setActiveTab('floorplan');
    setIsExpanded(false);
  };

  if (isStaff || (circuit.stations.length === 0 && !isExpanded)) {
    return null;
  }

  return (
    <>
      {/* Docked Sticky Bottom Floating Bar (Brutalist Village Gym Design) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-black border-t-2 border-[#97D700] shadow-[0_-10px_25px_rgba(0,0,0,0.8)]">
        <div className="max-w-6xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 lg:pr-88">
          {/* Left: Circuit Progress & Active Machine */}
          <div
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Step Counter Badge */}
            <div className="bg-[#97D700] text-black font-black text-xs px-2.5 py-1 uppercase tracking-[1px] flex items-center gap-1">
              <span>CIRCUIT</span>
              <span className="font-mono">
                {circuit.stations.length > 0 ? `${circuit.currentStepIndex + 1}/${circuit.stations.length}` : '0'}
              </span>
            </div>

            {/* Current Station Details */}
            {currentStationData && currentStationData.machine ? (
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#97D700]">
                    {currentStationData.machine.code}
                  </span>
                  <span className="text-xs font-black uppercase text-white tracking-[0.5px] group-hover:text-[#97D700] transition-colors">
                    {currentStationData.machine.name}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-1.5 py-0.2 uppercase tracking-wide ${
                      currentStationData.machine.status === 'available'
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                        : currentStationData.machine.status === 'in_use'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'bg-amber-950 text-amber-400 border border-amber-800'
                    }`}
                  >
                    {currentStationData.machine.status === 'available' ? 'Ready' : 'Active'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-[10px] text-[#AAAAAA] uppercase tracking-[1px]">
                  <span>{currentStationData.machine.zone}</span>
                  <span>•</span>
                  <span>{currentStationData.plannedMinutes}m target</span>
                  <span>•</span>
                  <span>+{currentStationData.restTransitionMinutes}m rest</span>
                </div>
              </div>
            ) : (
              <span className="text-xs uppercase text-[#AAAAAA] tracking-[1px]">
                Circuit queue is empty • Add machines from catalog
              </span>
            )}
          </div>

          {/* Right: Telemetry & Actions */}
          <div className="flex items-center gap-2">
            {/* Total Estimated Time Banner */}
            {circuit.stations.length > 0 && (
              <div className="hidden md:flex items-center gap-2 bg-[#111111] border border-[#333333] px-3 py-1.5 text-xs">
                <Clock className="w-3.5 h-3.5 text-[#97D700]" />
                <span className="text-[#AAAAAA] uppercase tracking-[1px] text-[10px]">Est. Circuit:</span>
                <span className="font-mono font-bold text-white text-xs">{totalCircuitMinutes} MINS</span>
              </div>
            )}

            {/* Advance to Next Station Button */}
            {circuit.stations.length > 0 && (
              <button
                onClick={advanceCircuit}
                className="bg-[#97D700] hover:bg-[#86be00] text-black font-black px-3.5 py-1.5 text-xs uppercase tracking-[1px] flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(151,215,0,0.3)] active:translate-y-0.5"
                title="Mark current station complete and advance to next machine"
              >
                <span>NEXT STATION</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}

            {/* Toggle Drawer Button */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="bg-[#222222] hover:bg-[#333333] text-white border border-[#444444] px-2.5 py-1.5 text-xs uppercase tracking-[1px] flex items-center gap-1 transition-colors"
            >
              <span>{isExpanded ? 'CLOSE' : 'QUEUE'}</span>
              {isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Circuit Modal / Drawer */}
      {isExpanded && (
        <div
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn"
          onClick={() => setIsExpanded(false)}
        >
          <div
            className="bg-black border-2 border-[#333333] w-full max-w-3xl max-h-[90vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.9)]"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-[#111111] border-b-2 border-[#222222] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-[#97D700] text-black flex items-center justify-center font-black">
                  <Play className="w-5 h-5 fill-black" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-[2px] text-white">
                    MY WORKOUT CIRCUIT & RESERVATIONS
                  </h3>
                  <p className="text-[11px] text-[#AAAAAA] uppercase tracking-[1px]">
                    Linear sequence • Automated rest buffers & transition times
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-[#AAAAAA] hover:text-white p-1.5 bg-[#222222] hover:bg-[#333333] transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Telemetry Summary Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 bg-[#0a0a0a] border-b border-[#222222] divide-x divide-[#222222] text-xs">
              <div className="p-3 text-center">
                <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Stations</span>
                <span className="text-base font-black text-white font-mono">{circuit.stations.length}</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Exercise Time</span>
                <span className="text-base font-black text-[#97D700] font-mono">{totalExerciseMinutes}m</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Rest & Buffers</span>
                <span className="text-base font-black text-sky-400 font-mono">{totalRestMinutes}m</span>
              </div>
              <div className="p-3 text-center">
                <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Total Duration</span>
                <span className="text-base font-black text-white font-mono">~{totalCircuitMinutes}m</span>
              </div>
            </div>

            {/* Action Toast Banner */}
            {toastMessage && (
              <div className="bg-[#97D700] text-black font-oswald font-black text-xs px-4 py-2 flex items-center justify-between tracking-wider uppercase animate-in fade-in duration-200">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4" />
                  {toastMessage}
                </span>
                <button onClick={() => setToastMessage(null)} className="p-0.5 hover:bg-black/10">
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* AI Smart Circuit Optimization & Zero-Wait Pod */}
            {circuit.stations.length > 1 && (
              <div className="bg-[#0b0e10] border-b-2 border-[#1f2429] p-3 sm:p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                  <div className="flex items-start gap-2.5">
                    <div className="w-7 h-7 bg-[#00e5ff]/20 text-[#00e5ff] border border-[#00e5ff] flex items-center justify-center shrink-0 mt-0.5">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-oswald font-black text-xs uppercase tracking-[1.5px] text-white">
                          AI CIRCUIT OPTIMIZER // ZERO-WAIT ROUTING
                        </span>
                        {totalUpcomingWaitMinutes > 0 ? (
                          <span className="bg-rose-950/80 text-rose-300 border border-rose-800 text-[10px] font-mono px-2 py-0.5 font-bold">
                            +{totalUpcomingWaitMinutes}M QUEUE DELAY
                          </span>
                        ) : (
                          <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-mono px-2 py-0.5 font-bold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> 0M WAIT PREDICTED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-[#8c959e] mt-0.5">
                        {totalUpcomingWaitMinutes > 0
                          ? `Upcoming stations are occupied. Re-order sequence or swap with idle biomechanical equivalents to eliminate delay.`
                          : `All upcoming circuit stations are currently open or will turnover in time for your arrival.`}
                      </p>
                    </div>
                  </div>

                  {totalUpcomingWaitMinutes > 0 && (
                    <button
                      onClick={handleAutoOptimize}
                      className="bg-[#00e5ff] hover:bg-[#00c4db] text-black font-oswald font-black text-xs py-2 px-3.5 tracking-wider uppercase flex items-center gap-1.5 shrink-0 transition-colors shadow-[0_0_15px_rgba(0,229,255,0.3)]"
                    >
                      <Zap className="w-3.5 h-3.5 fill-black" />
                      AUTO-OPTIMIZE SEQUENCE
                    </button>
                  )}
                </div>

                {/* Biomechanical Alternatives List */}
                {alternativeRecommendations.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[10px] font-mono font-bold uppercase text-[#8c959e] tracking-wider block">
                      Recommended 0-Wait Machine Swaps:
                    </span>
                    {alternativeRecommendations.map(({ busyMachine, bestAlternative }) => (
                      <div
                        key={busyMachine.id}
                        className="bg-[#101417] border border-[#262c33] hover:border-[#00e5ff] p-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors"
                      >
                        <div className="flex flex-wrap items-center gap-2 text-xs">
                          <span className="text-rose-400 font-mono font-bold line-through">
                            {busyMachine.name}
                          </span>
                          <span className="text-[10px] text-rose-400 font-mono">
                            (+{busyMachine.estimatedWaitMinutes || 8}m wait)
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 text-[#00e5ff] shrink-0" />
                          <span className="text-white font-bold font-oswald tracking-wide">
                            {bestAlternative.name}
                          </span>
                          <span className="bg-[#122415] text-[#97D700] border border-[#97D700]/40 text-[9px] font-mono px-1.5 py-0.5">
                            0m WAIT • SAME TARGET: {busyMachine.targetMuscleGroup || 'TARGET MUSCLE'}
                          </span>
                        </div>

                        <button
                          onClick={() => handleSwapAlternative(busyMachine.id, bestAlternative.id, bestAlternative.name)}
                          className="bg-[#181d22] hover:bg-[#00e5ff] hover:text-black border border-[#00e5ff] text-[#00e5ff] font-oswald font-black text-[11px] py-1 px-3 tracking-wider uppercase transition-colors shrink-0"
                        >
                          SWAP NOW (0m WAIT)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Stations Queue List */}
            <div className="p-4 overflow-y-auto max-h-[50vh] space-y-3 divide-y divide-[#222222]/50">
              {stationsWithData.length === 0 ? (
                <div className="py-12 text-center space-y-3">
                  <div className="w-12 h-12 bg-[#111111] border border-[#333333] flex items-center justify-center mx-auto text-[#777777]">
                    <Layers className="w-6 h-6" />
                  </div>
                  <h4 className="font-black text-sm uppercase tracking-[2px] text-white">Circuit is empty</h4>
                  <p className="text-xs text-[#AAAAAA] max-w-sm mx-auto">
                    Browse the Equipment Catalog or Floorplan and tap &ldquo;+ Add to Circuit&rdquo; on any machine to build your sequential workout routine.
                  </p>
                </div>
              ) : (
                stationsWithData.map((s, idx) => {
                  const m = s.machine;
                  if (!m) return null;

                  return (
                    <div
                      key={s.machineId}
                      className={`pt-3 first:pt-0 p-3 transition-all border ${
                        s.isCurrent
                          ? 'bg-[#111111] border-[#97D700] shadow-[inset_0_0_20px_rgba(151,215,0,0.15)]'
                          : s.isPast
                          ? 'bg-[#050505] border-[#222222] opacity-70'
                          : 'bg-black border-[#222222]'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        {/* Station Number & Machine Details */}
                        <div className="flex items-start gap-3">
                          {/* Step Badge */}
                          <div
                            className={`w-9 h-9 flex-shrink-0 flex items-center justify-center font-black text-xs uppercase tracking-wider ${
                              s.isCurrent
                                ? 'bg-[#97D700] text-black shadow-[0_0_10px_rgba(151,215,0,0.5)]'
                                : s.isPast
                                ? 'bg-[#222222] text-[#777777]'
                                : 'bg-[#1a1a1a] text-white border border-[#333333]'
                            }`}
                          >
                            {s.isPast ? <CheckCircle2 className="w-4 h-4 text-[#97D700]" /> : `#${idx + 1}`}
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs font-bold text-[#97D700]">{m.code}</span>
                              <h4 className="font-bold text-xs uppercase tracking-[0.5px] text-white">{m.name}</h4>
                              <span className="p-0.5">{getCategoryIcon(m.category)}</span>
                            </div>

                            <p className="text-[11px] text-[#AAAAAA] mt-0.5 flex items-center gap-1 uppercase tracking-[0.5px]">
                              <MapPin className="w-3 h-3 text-[#777777]" />
                              {m.zone}
                            </p>

                            {/* Status Tag */}
                            <div className="flex items-center gap-2 mt-1 text-[10px]">
                              {s.isCurrent && (
                                <span className="bg-[#97D700] text-black font-black px-2 py-0.5 uppercase tracking-wider">
                                  ACTIVE NOW
                                </span>
                              )}
                              {s.isPast && (
                                <span className="bg-[#222222] text-[#777777] font-bold px-2 py-0.5 uppercase tracking-wider">
                                  COMPLETED
                                </span>
                              )}
                              {s.isUpcoming && (
                                <span className="bg-[#1a1a1a] text-[#AAAAAA] border border-[#333333] px-2 py-0.5 uppercase tracking-wider">
                                  {idx === circuit.currentStepIndex + 1 ? 'UP NEXT (HELD)' : 'QUEUED'}
                                </span>
                              )}

                              <span
                                className={`px-2 py-0.5 uppercase font-bold tracking-wider ${
                                  m.status === 'available'
                                    ? 'text-emerald-400'
                                    : m.status === 'in_use'
                                    ? 'text-red-400'
                                    : 'text-amber-400'
                                }`}
                              >
                                {m.status === 'available' ? '• Free' : m.status === 'in_use' ? `• In Use (${m.currentSessionMinutes}m)` : '• Maintenance'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Timing Controls: Planned & Transition Buffers */}
                        <div className="flex flex-wrap items-center gap-3 text-xs">
                          {/* Planned Workout Minutes */}
                          <div className="flex items-center gap-1.5 bg-[#111111] border border-[#333333] px-2 py-1">
                            <span className="text-[10px] text-[#777777] uppercase tracking-wider">Workout:</span>
                            <button
                              onClick={() =>
                                updateStationTiming(s.machineId, Math.max(5, s.plannedMinutes - 5), s.restTransitionMinutes)
                              }
                              className="text-white hover:text-[#97D700] font-mono px-1 font-bold"
                              title="Decrease workout time"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-white text-xs">{s.plannedMinutes}m</span>
                            <button
                              onClick={() => updateStationTiming(s.machineId, s.plannedMinutes + 5, s.restTransitionMinutes)}
                              className="text-white hover:text-[#97D700] font-mono px-1 font-bold"
                              title="Increase workout time"
                            >
                              +
                            </button>
                          </div>

                          {/* Rest & Transition Buffer Minutes */}
                          <div className="flex items-center gap-1.5 bg-[#111111] border border-[#333333] px-2 py-1">
                            <span className="text-[10px] text-[#777777] uppercase tracking-wider">Rest:</span>
                            <button
                              onClick={() =>
                                updateStationTiming(s.machineId, s.plannedMinutes, Math.max(0, s.restTransitionMinutes - 1))
                              }
                              className="text-white hover:text-sky-400 font-mono px-1 font-bold"
                              title="Decrease rest time"
                            >
                              -
                            </button>
                            <span className="font-mono font-bold text-sky-400 text-xs">{s.restTransitionMinutes}m</span>
                            <button
                              onClick={() =>
                                updateStationTiming(s.machineId, s.plannedMinutes, s.restTransitionMinutes + 1)
                              }
                              className="text-white hover:text-sky-400 font-mono px-1 font-bold"
                              title="Increase rest time"
                            >
                              +
                            </button>
                          </div>

                          {/* Reordering Controls */}
                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => moveCircuitStation(idx, idx - 1)}
                              className="p-1.5 bg-[#222222] hover:bg-[#333333] disabled:opacity-30 disabled:pointer-events-none text-white border border-[#444444]"
                              title="Move station earlier"
                            >
                              <MoveUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              disabled={idx === stationsWithData.length - 1}
                              onClick={() => moveCircuitStation(idx, idx + 1)}
                              className="p-1.5 bg-[#222222] hover:bg-[#333333] disabled:opacity-30 disabled:pointer-events-none text-white border border-[#444444]"
                              title="Move station later"
                            >
                              <MoveDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={e => handleViewOnMap(e, s.machineId)}
                              className="p-1.5 bg-[#222222] hover:bg-[#333333] text-[#97D700] border border-[#444444]"
                              title="Locate station on floorplan"
                            >
                              <MapPin className="w-3.5 h-3.5" />
                            </button>
                            {!s.isCurrent && (
                              <button
                                onClick={() => setCircuitStep(idx)}
                                className="px-2 py-1 bg-[#222222] hover:bg-[#333333] text-white border border-[#444444] text-[10px] font-bold uppercase tracking-wider"
                                title="Jump to make this the active station"
                              >
                                Set Active
                              </button>
                            )}
                            <button
                              onClick={() => removeFromCircuit(s.machineId)}
                              className="p-1.5 bg-red-950/60 hover:bg-red-900 text-red-400 border border-red-800"
                              title="Remove station from circuit"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Footer Toolbar */}
            <div className="bg-[#111111] border-t-2 border-[#222222] p-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={clearCircuit}
                  disabled={circuit.stations.length === 0}
                  className="px-3 py-2 bg-[#222222] hover:bg-[#333333] disabled:opacity-40 text-xs font-bold uppercase tracking-[1px] text-[#AAAAAA] hover:text-white border border-[#444444] flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Clear Circuit
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsExpanded(false)}
                  className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-xs font-bold uppercase tracking-[1px] text-white border border-[#444444] transition-colors"
                >
                  Close Queue
                </button>
                {circuit.stations.length > 0 && (
                  <button
                    onClick={advanceCircuit}
                    className="px-4 py-2 bg-[#97D700] hover:bg-[#86be00] text-black text-xs font-black uppercase tracking-[1px] flex items-center gap-1.5 shadow-[0_0_20px_rgba(151,215,0,0.4)] transition-all"
                  >
                    <span>NEXT STATION</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
