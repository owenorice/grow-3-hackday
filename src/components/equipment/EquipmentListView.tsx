import React from 'react';
import { useGym } from '../../store/GymContext';
import { EquipmentCategory, GymMachine } from '../../types/gym';
import { Search, Filter, Clock, CheckCircle2, AlertTriangle, Wrench, ChevronRight } from 'lucide-react';

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
  } = useGym();

  const isStaff = appMode === 'staff';

  const categories: { id: EquipmentCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'All Equipment' },
    { id: 'cardio', label: 'Cardio' },
    { id: 'racks_benches', label: 'Racks & Benches' },
    { id: 'cables_plate', label: 'Cables & Plate' },
    { id: 'free_weights', label: 'Free Weights & Turf' },
  ];

  const filteredMachines = machines.filter(m => {
    // Category filter
    if (filterCategory !== 'all' && m.category !== filterCategory) return false;
    // Available only filter
    if (showAvailableOnly && m.status !== 'available') return false;
    // Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = m.name.toLowerCase().includes(q);
      const matchCode = m.code.toLowerCase().includes(q);
      const matchZone = m.zone.toLowerCase().includes(q);
      if (!matchName && !matchCode && !matchZone) return false;
    }
    return true;
  });

  const handleCardClick = (machine: GymMachine) => {
    selectMachine(machine.id);
  };

  const handleViewOnMap = (e: React.MouseEvent, machine: GymMachine) => {
    e.stopPropagation();
    selectMachine(machine.id);
    setActiveTab('floorplan');
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="bg-slate-900/60 p-4 rounded-xl border border-slate-800 space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search machine, code (e.g. SQ-01), or zone..."
              className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Available Only Toggle */}
          <label className="flex items-center gap-2 cursor-pointer bg-slate-800/80 px-3 py-2 rounded-lg border border-slate-700/80 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={showAvailableOnly}
              onChange={e => setShowAvailableOnly(e.target.checked)}
              className="rounded bg-slate-900 border-slate-600 text-emerald-500 focus:ring-0"
            />
            <span>Show Available Only</span>
          </label>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <Filter className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors ${
                filterCategory === cat.id
                  ? isStaff
                    ? 'bg-amber-600 text-white'
                    : 'bg-emerald-600 text-white'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Equipment Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredMachines.map(m => {
          const isSelected = m.id === selectedMachineId;

          return (
            <div
              key={m.id}
              onClick={() => handleCardClick(m)}
              className={`bg-slate-900/90 rounded-xl border p-4 transition-all cursor-pointer hover:border-slate-600 ${
                isSelected
                  ? 'border-sky-500 shadow-lg shadow-sky-950/30 ring-1 ring-sky-500'
                  : 'border-slate-800'
              }`}
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                      {m.code}
                    </span>
                    <h3 className="font-semibold text-sm text-white">{m.name}</h3>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.zone}</p>
                </div>

                {/* Status Badge */}
                {!isStaff ? (
                  <span
                    className={`text-[11px] font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 ${
                      m.status === 'available'
                        ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                        : m.status === 'in_use'
                        ? 'bg-red-950/80 text-red-400 border border-red-800/80'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {m.status === 'available' ? (
                      <>
                        <CheckCircle2 className="w-3 h-3" /> Free
                      </>
                    ) : m.status === 'in_use' ? (
                      <>
                        <Clock className="w-3 h-3" /> {m.currentSessionMinutes}m In Use
                      </>
                    ) : (
                      'Service'
                    )}
                  </span>
                ) : (
                  /* Staff Maintenance Badge */
                  <span
                    className={`text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
                      m.maintenanceStatus === 'critical_overuse'
                        ? 'bg-red-950 text-red-300 border border-red-700 animate-pulse'
                        : m.maintenanceStatus === 'service_due'
                        ? 'bg-amber-950 text-amber-300 border border-amber-700'
                        : 'bg-teal-950 text-teal-300 border border-teal-700'
                    }`}
                  >
                    {m.maintenanceStatus === 'critical_overuse' ? (
                      <>
                        <AlertTriangle className="w-3 h-3 text-red-400" /> Overdue
                      </>
                    ) : m.maintenanceStatus === 'service_due' ? (
                      <>
                        <Wrench className="w-3 h-3 text-amber-400" /> Service Due
                      </>
                    ) : (
                      'Healthy'
                    )}
                  </span>
                )}
              </div>

              {/* Body: Telemetry or Stats */}
              <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs">
                {!isStaff ? (
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-slate-400">
                      <span>Daily Utilization:</span>
                      <span className="text-slate-200 font-semibold">{m.utilizationPercentage}%</span>
                    </div>
                    <div className="flex justify-between text-slate-400">
                      <span>Peak Hours:</span>
                      <span className="text-slate-300 truncate max-w-[180px]">{m.peakHours}</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between text-slate-400">
                      <span>Service Interval:</span>
                      <span className="font-mono text-slate-200">
                        {m.hoursSinceLastService}h / {m.serviceThresholdHours}h Limit
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${
                          m.maintenanceStatus === 'critical_overuse'
                            ? 'bg-red-500'
                            : m.maintenanceStatus === 'service_due'
                            ? 'bg-amber-500'
                            : 'bg-teal-500'
                        }`}
                        style={{
                          width: `${Math.min(100, (m.hoursSinceLastService / m.serviceThresholdHours) * 100)}%`,
                        }}
                      />
                    </div>
                    {m.serviceNotes && (
                      <p className="text-[11px] text-amber-300/90 italic truncate">{m.serviceNotes}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-3 flex items-center gap-2 pt-2">
                {!isStaff ? (
                  <>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMachineStatus(m.id);
                      }}
                      className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold transition-all ${
                        m.status === 'available'
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                          : 'bg-red-600/70 hover:bg-red-500 text-white'
                      }`}
                    >
                      {m.status === 'available' ? "I'm using this" : "Done / Free"}
                    </button>
                    <button
                      onClick={e => handleViewOnMap(e, m)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                      title="View on Map"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        logService(m.id);
                      }}
                      className="flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-500 text-white flex items-center justify-center gap-1.5"
                    >
                      <Wrench className="w-3 h-3" /> Log Service
                    </button>
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        toggleMaintenance(m.id);
                      }}
                      className="py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs"
                    >
                      {m.status === 'maintenance' ? 'Reopen' : 'Flag'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
