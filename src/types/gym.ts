export type MachineStatus = 'available' | 'in_use' | 'maintenance';
export type MaintenanceStatus = 'healthy' | 'service_due' | 'critical_overuse';
export type EquipmentCategory = 'cardio' | 'racks_benches' | 'cables_plate' | 'free_weights';
export type GymZone = 'Cardio Deck' | 'Power & Strength Racks' | 'Cable & Functional Bay' | 'Free Weight Turf';

export interface ServiceRecord {
  date: string;
  type: string;
  technician: string;
}

export interface GymMachine {
  id: string;
  name: string;
  code: string; // e.g. "TM-01", "SR-02"
  category: EquipmentCategory;
  zone: GymZone;
  status: MachineStatus;
  currentSessionMinutes: number; // e.g. 18 min in use
  estimatedWaitMinutes: number; // e.g. 10 min

  // Staff Maintenance & Overuse Telemetry
  totalLifetimeHours: number;
  hoursSinceLastService: number;
  serviceThresholdHours: number; // e.g. 200 hours inspection interval
  maintenanceStatus: MaintenanceStatus;
  lastServicedDate: string;
  serviceNotes?: string;
  serviceHistory?: ServiceRecord[];

  // Usage Analytics
  avgDailyUsageHours: number;
  peakHours: string; // e.g. "17:00 - 19:30"
  utilizationPercentage: number; // 0 - 100%
  hourlyUsage: number[]; // 24-element array for 24 hours of the day (0-100% busy)

  // 2D SVG Canvas Position (on 1000x600 viewBox)
  coordinates: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
  };
}

export type AppMode = 'guest' | 'staff';
export type ActiveTab = 'floorplan' | 'list' | 'analytics';

export interface GymSummaryStats {
  totalMachines: number;
  availableCount: number;
  inUseCount: number;
  maintenanceCount: number;
  occupancyRate: number; // e.g. 65%
  serviceDueCount: number;
  criticalOveruseCount: number;
}
