import React, { useState, useMemo } from 'react';
import { useGym } from '../../store/GymContext';
import { EquipmentCategory, GymMachine, GymZone } from '../../types/gym';
import {
  Search,
  Filter,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Wrench,
  ChevronRight,
  X,
  RotateCcw,
  MapPin,
  ArrowUpDown,
  Flame,
  Dumbbell,
  HeartPulse,
  Layers,
  Sparkles,
  ShieldAlert,
  SlidersHorizontal,
  Check,
} from 'lucide-react';

type SortOption = 'code' | 'name' | 'availability' | 'utilization' | 'service_urgency';

export const EquipmentListView: React.FC = () => {
  const {
    machines,
    filterCategory,
    setFilterCategory,
    showAvailableOnly,
    setShowAvailableOnly,
    searchQuery,
    setSearchQuery,
    selectedMachineId,
    selectMachine,
    setActiveTab,
    appMode,
    toggleMachineStatus,
    logService,
    toggleMaintenance,
    circuit,
    addToCircuit,
    removeFromCircuit,
  } = useGym();

  const isStaff = appMode === 'staff';

  // Local filtering & sorting state
  const [selectedZone, setSelectedZone] = useState<GymZone | 'all'>('all');
  const [sortBy, setSortBy] = useState<SortOption>('code');
  const [staffServiceAlertsOnly, setStaffServiceAlertsOnly] = useState<boolean>(false);
  const [loggingServiceId, setLoggingServiceId] = useState<string | null>(null);
  const [serviceNotesInput, setServiceNotesInput] = useState<string>('');
  const [recentlyServicedId, setRecentlyServicedId] = useState<string | null>(null);

  const categories: { id: EquipmentCategory | 'all'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Equipment', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'cardio', label: 'Cardio', icon: <HeartPulse className="w-3.5 h-3.5" /> },
    { id: 'racks_benches', label: 'Racks & Benches', icon: <Dumbbell className="w-3.5 h-3.5" /> },
    { id: 'cables_plate', label: 'Cables & Plate', icon: <Layers className="w-3.5 h-3.5" /> },
    { id: 'free_weights', label: 'Free Weights & Turf', icon: <Flame className="w-3.5 h-3.5" /> },
  ];

  const zones: { id: GymZone | 'all'; label: string }[] = [
    { id: 'all', label: 'All Zones' },
    { id: 'Cardio Deck', label: 'Cardio Deck' },
    { id: 'Power & Strength Racks', label: 'Power & Strength Racks' },
    { id: 'Cable & Functional Bay', label: 'Cable & Functional Bay' },
    { id: 'Free Weight Turf', label: 'Free Weight Turf' },
  ];

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: machines.length };
    for (const m of machines) {
      counts[m.category] = (counts[m.category] || 0) + 1;
    }
    return counts;
  }, [machines]);

  // Status counts across all machines
  const totalStats = useMemo(() => {
    return {
      available: machines.filter(m => m.status === 'available').length,
      inUse: machines.filter(m => m.status === 'in_use').length,
      maintenance: machines.filter(m => m.status === 'maintenance').length,
      serviceAlerts: machines.filter(
        m => m.maintenanceStatus === 'service_due' || m.maintenanceStatus === 'critical_overuse'
      ).length,
    };
  }, [machines]);

  // Filtering
  const filteredMachines = useMemo(() => {
    return machines.filter(m => {
      // Category filter
      if (filterCategory !== 'all' && m.category !== filterCategory) return false;
      // Zone filter
      if (selectedZone !== 'all' && m.zone !== selectedZone) return false;
      // Available only filter
      if (showAvailableOnly && m.status !== 'available') return false;
      // Staff service alerts only filter
      if (isStaff && staffServiceAlertsOnly && m.maintenanceStatus === 'healthy') return false;

      // Search query
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchName = m.name.toLowerCase().includes(q);
        const matchCode = m.code.toLowerCase().includes(q);
        const matchZone = m.zone.toLowerCase().includes(q);
        const matchCategory = m.category.toLowerCase().includes(q);
        if (!matchName && !matchCode && !matchZone && !matchCategory) return false;
      }
      return true;
    });
  }, [machines, filterCategory, selectedZone, showAvailableOnly, isStaff, staffServiceAlertsOnly, searchQuery]);

  // Sorting
  const sortedMachines = useMemo(() => {
    const list = [...filteredMachines];
    switch (sortBy) {
      case 'code':
        return list.sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));
      case 'name':
        return list.sort((a, b) => a.name.localeCompare(b.name));
      case 'availability': {
        const priority: Record<GymMachine['status'], number> = {
          available: 1,
          in_use: 2,
          maintenance: 3,
        };
        return list.sort((a, b) => priority[a.status] - priority[b.status]);
      }
      case 'utilization':
        return list.sort((a, b) => b.utilizationPercentage - a.utilizationPercentage);
      case 'service_urgency': {
        const urgencyScore = (m: GymMachine) => {
          if (m.maintenanceStatus === 'critical_overuse') return 3;
          if (m.maintenanceStatus === 'service_due') return 2;
          return 1;
        };
        return list.sort((a, b) => {
          const scoreDiff = urgencyScore(b) - urgencyScore(a);
          if (scoreDiff !== 0) return scoreDiff;
          return b.hoursSinceLastService - a.hoursSinceLastService;
        });
      }
      default:
        return list;
    }
  }, [filteredMachines, sortBy]);

  const activeFilterCount =
    (filterCategory !== 'all' ? 1 : 0) +
    (selectedZone !== 'all' ? 1 : 0) +
    (showAvailableOnly ? 1 : 0) +
    (isStaff && staffServiceAlertsOnly ? 1 : 0) +
    (searchQuery.trim() !== '' ? 1 : 0);

  const handleResetFilters = () => {
    setFilterCategory('all');
    setSelectedZone('all');
    setShowAvailableOnly(false);
    setStaffServiceAlertsOnly(false);
    setSearchQuery('');
    setSortBy('code');
  };

  const handleCardClick = (machine: GymMachine) => {
    selectMachine(machine.id);
  };

  const handleViewOnMap = (e: React.MouseEvent, machine: GymMachine) => {
    e.stopPropagation();
    selectMachine(machine.id);
    setActiveTab('floorplan');
  };

  const handleOpenLogModal = (e: React.MouseEvent, machine: GymMachine) => {
    e.stopPropagation();
    setLoggingServiceId(machine.id);
    setServiceNotesInput(
      machine.maintenanceStatus === 'critical_overuse'
        ? 'Full tension re-calibration, cable inspection, and motor lube performed.'
        : 'Routine preventive inspection, belt check, and bolt torque check completed.'
    );
  };

  const handleConfirmServiceLog = (machineId: string) => {
    logService(machineId, serviceNotesInput || 'Routine maintenance logged by facility staff.');
    setLoggingServiceId(null);
    setRecentlyServicedId(machineId);
    setTimeout(() => {
      setRecentlyServicedId(prev => (prev === machineId ? null : prev));
    }, 3000);
  };

  const getCategoryIcon = (category: EquipmentCategory) => {
    switch (category) {
      case 'cardio':
        return <HeartPulse className="w-3.5 h-3.5 text-lime-400" />;
      case 'racks_benches':
        return <Dumbbell className="w-3.5 h-3.5 text-sky-400" />;
      case 'cables_plate':
        return <Layers className="w-3.5 h-3.5 text-indigo-400" />;
      case 'free_weights':
        return <Flame className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="space-y-5">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/90 p-4 md:p-5 rounded-2xl border border-slate-800 shadow-xl space-y-4">
        {/* Top Row: Search Input + Status Filter Toggles + Clear */}
        <div className="flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search by name, code (e.g. TM-01, SQ-02), category, or zone..."
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl pl-10 pr-9 py-2.5 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Quick Toggle Checkboxes */}
          <div className="flex flex-wrap items-center gap-2">
            <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
              showAvailableOnly
                ? 'bg-emerald-950/60 border-emerald-600/80 text-emerald-300'
                : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
            }`}>
              <input
                type="checkbox"
                checked={showAvailableOnly}
                onChange={e => setShowAvailableOnly(e.target.checked)}
                className="rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
              />
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block"></span>
                Show Available Only
              </span>
            </label>

            {isStaff && (
              <label className={`flex items-center gap-2 cursor-pointer px-3 py-2 rounded-xl border text-xs font-medium transition-all ${
                staffServiceAlertsOnly
                  ? 'bg-amber-950/60 border-amber-600/80 text-amber-300'
                  : 'bg-slate-800/80 border-slate-700/80 text-slate-300 hover:border-slate-600'
              }`}>
                <input
                  type="checkbox"
                  checked={staffServiceAlertsOnly}
                  onChange={e => setStaffServiceAlertsOnly(e.target.checked)}
                  className="rounded bg-slate-900 border-slate-600 text-amber-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className="flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  Service Alerts Only ({totalStats.serviceAlerts})
                </span>
              </label>
            )}

            {activeFilterCount > 0 && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-rose-900/60 bg-rose-950/40 text-rose-300 hover:bg-rose-900/40 text-xs font-medium transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                Reset ({activeFilterCount})
              </button>
            )}
          </div>
        </div>

        {/* Middle Row: Mobile Dropdown / Desktop Pills + Zone Dropdown + Sort */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
          {/* Category Filter: Desktop Pills (Scrollable) */}
          <div className="hidden sm:flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
            <span className="text-slate-400 flex items-center gap-1 mr-1 flex-shrink-0 font-medium">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </span>
            {categories.map(cat => {
              const count = categoryCounts[cat.id] || 0;
              const isActive = filterCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setFilterCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap flex items-center gap-1.5 transition-all ${
                    isActive
                      ? isStaff
                        ? 'bg-amber-600 text-white shadow-md shadow-amber-900/40'
                        : 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700/50'
                  }`}
                >
                  {cat.icon}
                  <span>{cat.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-black/30 text-white' : 'bg-slate-900 text-slate-400'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Category Dropdown (Mobile View) */}
          <div className="sm:hidden flex items-center gap-2">
            <label htmlFor="category-select" className="text-xs text-slate-400 flex items-center gap-1 flex-shrink-0">
              <Filter className="w-3.5 h-3.5" />
              Category:
            </label>
            <select
              id="category-select"
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value as EquipmentCategory | 'all')}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.label} ({categoryCounts[cat.id] || 0})
                </option>
              ))}
            </select>
          </div>

          {/* Right Controls: Zone Filter & Sort Dropdown */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Zone Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={selectedZone}
                onChange={e => setSelectedZone(e.target.value as GymZone | 'all')}
                className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                title="Filter by gym zone"
              >
                {zones.map(z => (
                  <option key={z.id} value={z.id} className="bg-slate-900 text-white">
                    {z.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 rounded-lg px-2.5 py-1 text-xs">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={e => setSortBy(e.target.value as SortOption)}
                className="bg-transparent text-slate-200 focus:outline-none text-xs cursor-pointer"
                title="Sort equipment list"
              >
                <option value="code" className="bg-slate-900 text-white">Sort: Code (Default)</option>
                <option value="name" className="bg-slate-900 text-white">Sort: Name (A-Z)</option>
                <option value="availability" className="bg-slate-900 text-white">Sort: Available First</option>
                <option value="utilization" className="bg-slate-900 text-white">Sort: Highest Utilization</option>
                {isStaff && (
                  <option value="service_urgency" className="bg-slate-900 text-white">Sort: Maintenance Urgency</option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Bottom Status Tally Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800/60 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>
              Showing <strong className="text-white">{sortedMachines.length}</strong> of{' '}
              <strong className="text-white">{machines.length}</strong> machines
            </span>
            {searchQuery && (
              <span className="text-slate-500">
                matching &ldquo;<span className="text-emerald-400">{searchQuery}</span>&rdquo;
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              {totalStats.available} Free
            </span>
            <span className="flex items-center gap-1.5 text-red-400">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {totalStats.inUse} In Use
            </span>
            {totalStats.maintenance > 0 && (
              <span className="flex items-center gap-1.5 text-amber-400">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                {totalStats.maintenance} In Service
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {sortedMachines.length === 0 && (
        <div className="bg-slate-900/60 rounded-2xl border border-slate-800 p-12 text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <SlidersHorizontal className="w-7 h-7" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-semibold text-white">No equipment matches your criteria</h3>
            <p className="text-xs text-slate-400">
              Try adjusting your search terms, changing the category, or turning off the availability toggle.
            </p>
          </div>
          <button
            onClick={handleResetFilters}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-lg shadow-emerald-950/40 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear All Filters
          </button>
        </div>
      )}

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedMachines.map(m => {
          const isSelected = m.id === selectedMachineId;
          const isRecentlyServiced = m.id === recentlyServicedId;
          const isInCircuit = circuit.stations.some(s => s.machineId === m.id);
          const serviceRatio = Math.min(100, Math.round((m.hoursSinceLastService / m.serviceThresholdHours) * 100));

          return (
            <div
              key={m.id}
              onClick={() => handleCardClick(m)}
              className={`bg-slate-900/90 rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between relative group ${
                isSelected
                  ? 'border-emerald-500 shadow-xl shadow-emerald-950/40 ring-1 ring-emerald-500 bg-slate-900'
                  : 'border-slate-800/90 hover:border-slate-700 hover:bg-slate-900 hover:shadow-lg'
              }`}
            >
              <div>
                {/* Card Top: Code Badge + Category Icon + Status Pill */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-slate-950 text-slate-200 border border-slate-700/80 tracking-wider">
                        {m.code}
                      </span>
                      <span className="p-1 rounded-md bg-slate-800/80 border border-slate-700/50" title={m.category}>
                        {getCategoryIcon(m.category)}
                      </span>
                    </div>
                    <h3 className="font-bold text-sm text-white mt-2 leading-snug group-hover:text-emerald-300 transition-colors">
                      {m.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      {m.zone}
                    </p>
                  </div>

                  {/* Real-time Status Badge */}
                  {!isStaff ? (
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 transition-colors ${
                          m.status === 'available'
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/80'
                            : m.status === 'in_use'
                            ? 'bg-rose-950/80 text-rose-300 border border-rose-700/80'
                            : 'bg-amber-950/80 text-amber-300 border border-amber-700/80'
                        }`}
                      >
                        {m.status === 'available' ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Free
                          </>
                        ) : m.status === 'in_use' ? (
                          <>
                            <Clock className="w-3.5 h-3.5 text-rose-400 animate-pulse" /> {m.currentSessionMinutes}m In Use
                          </>
                        ) : (
                          <>
                            <Wrench className="w-3.5 h-3.5 text-amber-400" /> Maintenance
                          </>
                        )}
                      </span>
                      {m.status === 'in_use' && m.estimatedWaitMinutes > 0 && (
                        <span className="text-[10px] text-slate-400">
                          ~{m.estimatedWaitMinutes}m est. wait
                        </span>
                      )}
                    </div>
                  ) : (
                    /* Staff Maintenance Telemetry Badge */
                    <div className="flex flex-col items-end gap-1">
                      <span
                        className={`text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 ${
                          m.maintenanceStatus === 'critical_overuse'
                            ? 'bg-red-950 text-red-200 border border-red-700 animate-pulse'
                            : m.maintenanceStatus === 'service_due'
                            ? 'bg-amber-950 text-amber-300 border border-amber-700'
                            : 'bg-teal-950 text-teal-300 border border-teal-700'
                        }`}
                      >
                        {m.maintenanceStatus === 'critical_overuse' ? (
                          <>
                            <AlertTriangle className="w-3.5 h-3.5 text-red-400" /> Overdue
                          </>
                        ) : m.maintenanceStatus === 'service_due' ? (
                          <>
                            <Wrench className="w-3.5 h-3.5 text-amber-400" /> Service Due
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" /> Healthy
                          </>
                        )}
                      </span>
                      {m.status === 'maintenance' && (
                        <span className="text-[10px] uppercase font-semibold text-rose-400 tracking-wider">
                          Out of Order
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Body: Guest Telemetry vs Staff Overuse Metrics */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 text-xs">
                  {!isStaff ? (
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[11px]">Daily Utilization:</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-slate-950 h-1.5 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-emerald-500 h-full rounded-full"
                              style={{ width: `${m.utilizationPercentage}%` }}
                            />
                          </div>
                          <span className="text-slate-200 font-bold font-mono">{m.utilizationPercentage}%</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center text-slate-400">
                        <span className="text-[11px]">Peak Rush Window:</span>
                        <span className="text-slate-300 font-mono text-[11px] px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800">
                          {m.peakHours}
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Staff View: Hours, Threshold Meter & Service Notes */
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-slate-400 text-[11px]">
                        <span>Service Interval Ratio:</span>
                        <span className="font-mono text-slate-200 font-bold">
                          {m.hoursSinceLastService}h / {m.serviceThresholdHours}h ({serviceRatio}%)
                        </span>
                      </div>
                      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            m.maintenanceStatus === 'critical_overuse'
                              ? 'bg-red-500'
                              : m.maintenanceStatus === 'service_due'
                              ? 'bg-amber-500'
                              : 'bg-teal-500'
                          }`}
                          style={{ width: `${serviceRatio}%` }}
                        />
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-slate-400 pt-0.5">
                        <span>Last Serviced: {m.lastServicedDate}</span>
                        <span>Lifetime: {m.totalLifetimeHours}h</span>
                      </div>
                      {m.serviceNotes && (
                        <p className="text-[11px] text-amber-300/90 italic line-clamp-1 bg-amber-950/20 px-2 py-1 rounded border border-amber-900/40">
                          {m.serviceNotes}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Service Log Success Toast */}
                {isRecentlyServiced && (
                  <div className="mt-2 p-2 rounded-lg bg-teal-950/80 border border-teal-700/80 text-teal-300 text-xs flex items-center gap-1.5 animate-fadeIn">
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                    <span>Maintenance logged & operational hours reset to 0h!</span>
                  </div>
                )}
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center gap-2">
                {!isStaff ? (
                  <>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMachineStatus(m.id);
                      }}
                      disabled={m.status === 'maintenance'}
                      className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
                        m.status === 'maintenance'
                          ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                          : m.status === 'available'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-950/40'
                          : 'bg-rose-600/80 hover:bg-rose-600 text-white shadow-rose-950/40'
                      }`}
                    >
                      {m.status === 'maintenance' ? (
                        'Under Maintenance'
                      ) : m.status === 'available' ? (
                        <>
                          <Sparkles className="w-3.5 h-3.5" />
                          I&apos;m using this
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Done / Free Machine
                        </>
                      )}
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        if (isInCircuit) {
                          removeFromCircuit(m.id);
                        } else {
                          addToCircuit(m.id);
                        }
                      }}
                      className={`p-2 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                        isInCircuit
                          ? 'bg-[#97D700] border-[#97D700] text-black font-bold shadow-[0_0_10px_rgba(151,215,0,0.3)]'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border-slate-700/80'
                      }`}
                      title={isInCircuit ? 'Remove from Workout Circuit' : 'Add to Workout Circuit Queue'}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">{isInCircuit ? 'In Circuit' : '+ Circuit'}</span>
                    </button>
                    <button
                      onClick={e => handleViewOnMap(e, m)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors flex items-center gap-1 text-xs font-semibold"
                      title="View machine on 2D floorplan"
                    >
                      <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">Map</span>
                      <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </>
                ) : (
                  /* Staff Actions: Log Service & Maintenance Flag */
                  <>
                    <button
                      onClick={e => handleOpenLogModal(e, m)}
                      className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-500 text-white shadow-md shadow-amber-950/40 flex items-center justify-center gap-1.5 transition-all"
                    >
                      <Wrench className="w-3.5 h-3.5" />
                      Log Service
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMaintenance(m.id);
                      }}
                      className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all flex items-center gap-1 ${
                        m.status === 'maintenance'
                          ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300 hover:bg-emerald-900/60'
                          : 'bg-slate-800/90 border-slate-700 text-slate-300 hover:border-slate-600 hover:text-white'
                      }`}
                      title={m.status === 'maintenance' ? 'Clear maintenance flag and mark available' : 'Flag machine as out of service'}
                    >
                      <ShieldAlert className="w-3.5 h-3.5" />
                      {m.status === 'maintenance' ? 'Reopen' : 'Flag OOO'}
                    </button>
                    <button
                      onClick={e => handleViewOnMap(e, m)}
                      className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/80 transition-colors"
                      title="Locate on floorplan"
                    >
                      <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Staff Quick Service Modal */}
      {loggingServiceId && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setLoggingServiceId(null)}
        >
          <div
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-600/20 border border-amber-600/40 flex items-center justify-center text-amber-400">
                  <Wrench className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">Log Preventive Service</h4>
                  <p className="text-xs text-slate-400 font-mono">
                    {machines.find(m => m.id === loggingServiceId)?.code} •{' '}
                    {machines.find(m => m.id === loggingServiceId)?.name}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setLoggingServiceId(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-300">
                Logging maintenance will reset operational hours to <strong className="text-emerald-400">0h</strong>, clear
                service warnings, and mark the machine status as <strong className="text-teal-400">Healthy</strong>.
              </p>

              <div>
                <label className="block text-slate-400 font-medium mb-1">Service & Inspection Notes:</label>
                <textarea
                  rows={3}
                  value={serviceNotesInput}
                  onChange={e => setServiceNotesInput(e.target.value)}
                  placeholder="Record work completed, belt tension, cable condition, etc..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setLoggingServiceId(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmServiceLog(loggingServiceId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center gap-1.5 shadow-lg shadow-amber-950/40 transition-all"
              >
                <Check className="w-3.5 h-3.5" />
                Confirm & Reset Hours
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
