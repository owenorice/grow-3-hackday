import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  GymMachine,
  AppMode,
  ActiveTab,
  EquipmentCategory,
  GymSummaryStats,
  WorkoutCircuit,
} from '../types/gym';
import { SEED_MACHINES } from '../data/seedMachines';

interface GymContextType {
  machines: GymMachine[];
  selectedMachineId: string | null;
  selectedMachine: GymMachine | null;
  activeTab: ActiveTab;
  appMode: AppMode;
  filterCategory: EquipmentCategory | 'all';
  showAvailableOnly: boolean;
  searchQuery: string;
  stats: GymSummaryStats;

  // Actions
  selectMachine: (id: string | null) => void;
  setActiveTab: (tab: ActiveTab) => void;
  setAppMode: (mode: AppMode) => void;
  setFilterCategory: (category: EquipmentCategory | 'all') => void;
  setShowAvailableOnly: (show: boolean) => void;
  setSearchQuery: (query: string) => void;

  toggleMachineStatus: (id: string) => void;
  setMachineStatus: (id: string, status: GymMachine['status']) => void;
  logService: (id: string, notes?: string, technician?: string) => void;
  toggleMaintenance: (id: string) => void;

  // Circuit Queue & Sequential Reservation
  circuit: WorkoutCircuit;
  addToCircuit: (machineId: string, plannedMinutes?: number, restTransitionMinutes?: number) => void;
  removeFromCircuit: (machineId: string) => void;
  advanceCircuit: () => void;
  clearCircuit: () => void;
  moveCircuitStation: (fromIndex: number, toIndex: number) => void;
  updateStationTiming: (machineId: string, plannedMinutes: number, restTransitionMinutes: number) => void;
  setCircuitStep: (stepIndex: number) => void;

  // Presenter Simulator Actions
  simulatePeakRush: () => void;
  simulateEmptyGym: () => void;
  simulateTurnover: () => void;
  simulateOveruseSpike: (id: string) => void;
}

const STORAGE_KEY = 'apex_gym_machines_v1';

const GymContext = createContext<GymContextType | undefined>(undefined);

export const GymProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [machines, setMachines] = useState<GymMachine[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Failed to load cached machines from localStorage', e);
    }
    return SEED_MACHINES;
  });

  const [selectedMachineId, setSelectedMachineId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('floorplan');
  const [appMode, setAppMode] = useState<AppMode>('guest');
  const [filterCategory, setFilterCategory] = useState<EquipmentCategory | 'all'>('all');
  const [showAvailableOnly, setShowAvailableOnly] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [circuit, setCircuit] = useState<WorkoutCircuit>(() => {
    try {
      const saved = localStorage.getItem('village_gym_circuit_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Failed to load circuit', e);
    }
    return {
      id: 'default-circuit',
      name: "TODAY'S WORKOUT CIRCUIT",
      currentStepIndex: 0,
      stations: [
        { machineId: 'm-tm-01', order: 1, plannedMinutes: 15, restTransitionMinutes: 2 },
        { machineId: 'm-pr-01', order: 2, plannedMinutes: 20, restTransitionMinutes: 3 },
        { machineId: 'm-cc-01', order: 3, plannedMinutes: 15, restTransitionMinutes: 2 },
      ],
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(machines));
    } catch (e) {
      console.error('Failed to cache machines to localStorage', e);
    }
  }, [machines]);

  useEffect(() => {
    try {
      localStorage.setItem('village_gym_circuit_v1', JSON.stringify(circuit));
    } catch (e) {
      console.error('Failed to cache circuit', e);
    }
  }, [circuit]);

  const selectedMachine = useMemo(() => {
    return machines.find(m => m.id === selectedMachineId) || null;
  }, [machines, selectedMachineId]);

  const stats = useMemo<GymSummaryStats>(() => {
    const total = machines.length;
    const available = machines.filter(m => m.status === 'available').length;
    const inUse = machines.filter(m => m.status === 'in_use').length;
    const maintenance = machines.filter(m => m.status === 'maintenance').length;
    const serviceDue = machines.filter(m => m.maintenanceStatus === 'service_due').length;
    const critical = machines.filter(m => m.maintenanceStatus === 'critical_overuse').length;

    return {
      totalMachines: total,
      availableCount: available,
      inUseCount: inUse,
      maintenanceCount: maintenance,
      occupancyRate: total > 0 ? Math.round((inUse / total) * 100) : 0,
      serviceDueCount: serviceDue,
      criticalOveruseCount: critical,
    };
  }, [machines]);

  // Toggle between available & in_use
  const toggleMachineStatus = (id: string) => {
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const newStatus = m.status === 'available' ? 'in_use' : 'available';
        const sessionMins = newStatus === 'in_use' ? Math.floor(Math.random() * 20) + 5 : 0;
        const waitMins = newStatus === 'in_use' ? Math.max(1, 30 - sessionMins) : 0;
        return {
          ...m,
          status: newStatus,
          currentSessionMinutes: sessionMins,
          estimatedWaitMinutes: waitMins,
        };
      })
    );
  };

  const setMachineStatus = (id: string, status: GymMachine['status']) => {
    setMachines(prev =>
      prev.map(m => (m.id === id ? { ...m, status } : m))
    );
  };

  // Staff Maintenance: Reset service hours & mark healthy
  const logService = (id: string, notes?: string, technician = 'Staff On Duty') => {
    const today = new Date().toISOString().split('T')[0];
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        return {
          ...m,
          hoursSinceLastService: 0,
          maintenanceStatus: 'healthy',
          status: m.status === 'maintenance' ? 'available' : m.status,
          lastServicedDate: today,
          serviceNotes: notes || 'Routine maintenance and inspection completed. Operational clearance granted.',
          serviceHistory: [
            {
              date: today,
              type: notes || 'Routine Preventive Maintenance',
              technician: technician || 'Staff On Duty',
            },
            ...(m.serviceHistory || []),
          ],
        };
      })
    );
  };

  const toggleMaintenance = (id: string) => {
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const nextStatus = m.status === 'maintenance' ? 'available' : 'maintenance';
        return {
          ...m,
          status: nextStatus,
        };
      })
    );
  };

  // Presenter Simulator Actions
  const simulatePeakRush = () => {
    setMachines(prev =>
      prev.map(m => {
        // Occupy ~85% of machines
        const isOccupied = Math.random() < 0.85;
        const sessionMins = isOccupied ? Math.floor(Math.random() * 35) + 5 : 0;
        return {
          ...m,
          status: isOccupied ? 'in_use' : 'available',
          currentSessionMinutes: sessionMins,
          estimatedWaitMinutes: isOccupied ? Math.max(2, 35 - sessionMins) : 0,
        };
      })
    );
  };

  const simulateEmptyGym = () => {
    setMachines(prev =>
      prev.map(m => ({
        ...m,
        status: 'available',
        currentSessionMinutes: 0,
        estimatedWaitMinutes: 0,
      }))
    );
  };

  const simulateTurnover = () => {
    setMachines(prev => {
      const copy = [...prev];
      // pick 3 random machines and flip them
      for (let i = 0; i < 3; i++) {
        const idx = Math.floor(Math.random() * copy.length);
        const item = copy[idx];
        const nextStatus = item.status === 'available' ? 'in_use' : 'available';
        copy[idx] = {
          ...item,
          status: nextStatus,
          currentSessionMinutes: nextStatus === 'in_use' ? 5 : 0,
          estimatedWaitMinutes: nextStatus === 'in_use' ? 20 : 0,
        };
      }
      return copy;
    });
  };

  const simulateOveruseSpike = (id: string) => {
    setMachines(prev =>
      prev.map(m => {
        if (m.id !== id) return m;
        const spikedHours = m.serviceThresholdHours + 45;
        return {
          ...m,
          hoursSinceLastService: spikedHours,
          maintenanceStatus: 'critical_overuse',
          serviceNotes: `URGENT: Machine accumulated ${spikedHours} hours exceeding ${m.serviceThresholdHours}h safety threshold. Cable and motor check required immediately.`,
        };
      })
    );
  };

  const addToCircuit = (machineId: string, plannedMinutes = 15, restTransitionMinutes = 2) => {
    setCircuit(prev => {
      if (prev.stations.some(s => s.machineId === machineId)) return prev;
      return {
        ...prev,
        stations: [
          ...prev.stations,
          {
            machineId,
            order: prev.stations.length + 1,
            plannedMinutes,
            restTransitionMinutes,
          },
        ],
      };
    });
  };

  const removeFromCircuit = (machineId: string) => {
    setCircuit(prev => {
      const filtered = prev.stations.filter(s => s.machineId !== machineId);
      return {
        ...prev,
        currentStepIndex: Math.min(prev.currentStepIndex, Math.max(0, filtered.length - 1)),
        stations: filtered.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
  };

  const advanceCircuit = () => {
    setCircuit(prev => {
      if (prev.stations.length === 0) return prev;
      const currentStation = prev.stations[prev.currentStepIndex];
      const nextIdx = (prev.currentStepIndex + 1) % prev.stations.length;
      const nextStation = prev.stations[nextIdx];

      // Auto-update machine states: free up previous, claim next
      setMachines(currentMachines =>
        currentMachines.map(m => {
          if (m.id === currentStation?.machineId) {
            return { ...m, status: 'available', currentSessionMinutes: 0 };
          }
          if (m.id === nextStation?.machineId) {
            return { ...m, status: 'in_use', currentSessionMinutes: 1 };
          }
          return m;
        })
      );

      return {
        ...prev,
        currentStepIndex: nextIdx,
      };
    });
  };

  const clearCircuit = () => {
    setCircuit(prev => ({
      ...prev,
      currentStepIndex: 0,
      stations: [],
    }));
  };

  const moveCircuitStation = (fromIndex: number, toIndex: number) => {
    setCircuit(prev => {
      if (fromIndex < 0 || fromIndex >= prev.stations.length) return prev;
      if (toIndex < 0 || toIndex >= prev.stations.length) return prev;
      const updated = [...prev.stations];
      const [moved] = updated.splice(fromIndex, 1);
      updated.splice(toIndex, 0, moved);
      return {
        ...prev,
        stations: updated.map((s, idx) => ({ ...s, order: idx + 1 })),
      };
    });
  };

  const updateStationTiming = (machineId: string, plannedMinutes: number, restTransitionMinutes: number) => {
    setCircuit(prev => ({
      ...prev,
      stations: prev.stations.map(s =>
        s.machineId === machineId
          ? {
              ...s,
              plannedMinutes: Math.max(1, plannedMinutes),
              restTransitionMinutes: Math.max(0, restTransitionMinutes),
            }
          : s
      ),
    }));
  };

  const setCircuitStep = (stepIndex: number) => {
    setCircuit(prev => {
      if (stepIndex < 0 || stepIndex >= prev.stations.length) return prev;
      const targetStation = prev.stations[stepIndex];
      setMachines(current =>
        current.map(m => {
          if (m.id === targetStation.machineId) {
            return { ...m, status: 'in_use', currentSessionMinutes: 1 };
          }
          return m;
        })
      );
      return {
        ...prev,
        currentStepIndex: stepIndex,
      };
    });
  };

  return (
    <GymContext.Provider
      value={{
        machines,
        selectedMachineId,
        selectedMachine,
        activeTab,
        appMode,
        filterCategory,
        showAvailableOnly,
        searchQuery,
        stats,

        selectMachine: setSelectedMachineId,
        setActiveTab,
        setAppMode,
        setFilterCategory,
        setShowAvailableOnly,
        setSearchQuery,

        toggleMachineStatus,
        setMachineStatus,
        logService,
        toggleMaintenance,

        circuit,
        addToCircuit,
        removeFromCircuit,
        advanceCircuit,
        clearCircuit,
        moveCircuitStation,
        updateStationTiming,
        setCircuitStep,

        simulatePeakRush,
        simulateEmptyGym,
        simulateTurnover,
        simulateOveruseSpike,
      }}
    >
      {children}
    </GymContext.Provider>
  );
};

export const useGym = () => {
  const context = useContext(GymContext);
  if (!context) {
    throw new Error('useGym must be used within a GymProvider');
  }
  return context;
};
