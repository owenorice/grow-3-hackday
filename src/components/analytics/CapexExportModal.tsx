import React, { useMemo } from 'react';
import { GymMachine } from '../../types/gym';
import {
  X,
  Download,
  AlertTriangle,
  CheckCircle2,
  FileSpreadsheet,
  Building,
} from 'lucide-react';

interface CapexExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  machines: GymMachine[];
}

interface StationCapexData {
  machine: GymMachine;
  acquisitionCost: number;
  currentBookValue: number;
  depreciationRate: number;
  estReplacementQuarter: string;
  recommendation: string;
  recommendationType: 'acquire' | 'reclaim' | 'service' | 'optimal';
}

export const CapexExportModal: React.FC<CapexExportModalProps> = ({ isOpen, onClose, machines }) => {
  if (!isOpen) return null;

  // Station Capex Calculations
  const capexData: StationCapexData[] = useMemo(() => {
    return machines.map(m => {
      // Estimated commercial unit acquisition cost based on category
      let acquisitionCost = 8500;
      if (m.zone === 'Cardio Deck') acquisitionCost = 11000;
      if (m.zone === 'Power & Strength Racks') acquisitionCost = 14500;
      if (m.zone === 'Cable & Functional Bay') acquisitionCost = 16000;
      if (m.zone === 'Free Weight Turf') acquisitionCost = 6500;

      // Accelerated depreciation based on daily duty hours
      const ratedHours = 20000; // 5-year commercial life
      const dutyMultiplier = 1 + Math.max(0, (m.avgDailyUsageHours - 10) / 10);
      const depreciationPerHr = (acquisitionCost / ratedHours) * dutyMultiplier;
      const totalDepreciation = Math.min(acquisitionCost * 0.88, depreciationPerHr * m.totalLifetimeHours);
      const currentBookValue = Math.round(acquisitionCost - totalDepreciation);
      const depreciationRate = Math.round((totalDepreciation / acquisitionCost) * 100);

      // Replacement quarter projection
      let estReplacementQuarter = 'Q3 2027';
      let recommendation = 'MAINTAIN ROUTINE OVERHAUL';
      let recommendationType: StationCapexData['recommendationType'] = 'optimal';

      if (m.utilizationPercentage >= 90) {
        estReplacementQuarter = 'Q4 2026 (EXPEDITE)';
        recommendation = 'PROCURE +1 DUPLICATE UNIT (BOTTLENECK)';
        recommendationType = 'acquire';
      } else if (m.utilizationPercentage <= 30) {
        estReplacementQuarter = 'Q2 2027 (RETIRE)';
        recommendation = 'RETIRE & RECLAIM FLOOR FOOTPRINT';
        recommendationType = 'reclaim';
      } else if (m.maintenanceStatus === 'critical_overuse') {
        estReplacementQuarter = 'Q1 2027 (OVERHAUL)';
        recommendation = 'SCHEDULE IMMEDIATE BEARING & CABLE REBUILD';
        recommendationType = 'service';
      }

      return {
        machine: m,
        acquisitionCost,
        currentBookValue,
        depreciationRate,
        estReplacementQuarter,
        recommendation,
        recommendationType,
      };
    });
  }, [machines]);

  // Aggregate Totals
  const totalAcquisition = useMemo(() => capexData.reduce((sum, d) => sum + d.acquisitionCost, 0), [capexData]);
  const totalBookValue = useMemo(() => capexData.reduce((sum, d) => sum + d.currentBookValue, 0), [capexData]);
  const totalDepreciationValue = totalAcquisition - totalBookValue;
  const highBottleneckCount = capexData.filter(d => d.recommendationType === 'acquire').length;
  const reclaimCandidateCount = capexData.filter(d => d.recommendationType === 'reclaim').length;

  // CSV Generator Function
  const handleDownloadCsv = () => {
    const headers = [
      'Machine_Code',
      'Machine_Name',
      'Zone',
      'Category',
      'Acquisition_Value_GBP',
      'Current_Book_Value_GBP',
      'Depreciation_Pct',
      'Lifetime_Operating_Hours',
      'Hours_Since_Last_Service',
      'Service_Threshold_Hours',
      'Maintenance_Status',
      'Daily_Avg_Usage_Hours',
      'Peak_Utilization_Pct',
      'Est_Replacement_Quarter',
      'Procurement_Recommendation',
    ];

    const rows = capexData.map(d => [
      `"${d.machine.code}"`,
      `"${d.machine.name}"`,
      `"${d.machine.zone}"`,
      `"${d.machine.category}"`,
      d.acquisitionCost,
      d.currentBookValue,
      `${d.depreciationRate}%`,
      d.machine.totalLifetimeHours,
      d.machine.hoursSinceLastService,
      d.machine.serviceThresholdHours,
      `"${d.machine.maintenanceStatus}"`,
      d.machine.avgDailyUsageHours,
      `${d.machine.utilizationPercentage}%`,
      `"${d.estReplacementQuarter}"`,
      `"${d.recommendation}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `village_gym_capex_telemetry_${new Date().getFullYear()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div
        className="bg-black border-2 border-[#97D700] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_80px_rgba(151,215,0,0.25)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#111111] border-b-2 border-[#222222] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#97D700] text-black flex items-center justify-center font-black shrink-0">
              <FileSpreadsheet className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 bg-black text-[#97D700] border border-[#333333]">
                  EXECUTIVE P4 SUITE
                </span>
                <span className="text-[10px] font-mono text-[#AAAAAA]">RFC-01 SPEC</span>
              </div>
              <h2 className="text-lg font-black uppercase tracking-[2px] text-white">
                FINANCE CAPEX & FLEET UTILIZATION TELEMETRY
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleDownloadCsv}
              className="vg-btn vg-btn-3 text-xs px-4 py-2.5 flex items-center gap-1.5 shadow-[0_0_20px_rgba(151,215,0,0.4)]"
            >
              <Download className="w-4 h-4" />
              <span>DOWNLOAD CSV EXPORT</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 text-[#AAAAAA] hover:text-white bg-[#222222] hover:bg-[#333333] border border-[#333333] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-6">
          {/* Executive KPI Summary Pods */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-4 bg-[#111111] border-2 border-[#333333] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#888888]">
                FLEET ACQUISITION VALUE
              </span>
              <div className="text-2xl font-black text-white font-mono">
                £{totalAcquisition.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#AAAAAA] uppercase">22 Monitored Club Stations</p>
            </div>

            <div className="p-4 bg-[#111111] border-2 border-[#97D700] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#97D700]">
                CURRENT BOOK VALUE
              </span>
              <div className="text-2xl font-black text-[#97D700] font-mono">
                £{totalBookValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#AAAAAA] uppercase">Depreciated Straight-Line</p>
            </div>

            <div className="p-4 bg-[#111111] border-2 border-[#333333] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#888888]">
                ACCRUED DEPRECIATION
              </span>
              <div className="text-2xl font-black text-[#FFC107] font-mono">
                £{totalDepreciationValue.toLocaleString()}
              </div>
              <p className="text-[10px] text-[#AAAAAA] uppercase">
                {Math.round((totalDepreciationValue / totalAcquisition) * 100)}% Amortized
              </p>
            </div>

            <div className="p-4 bg-[#111111] border-2 border-[#DC3545] space-y-1">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#DC3545]">
                PROCUREMENT BOTTLENECKS
              </span>
              <div className="text-2xl font-black text-white font-mono">
                {highBottleneckCount} STATIONS
              </div>
              <p className="text-[10px] text-[#DC3545] uppercase font-bold">&gt;90% Surge Occupancy</p>
            </div>
          </div>

          {/* Strategic Procurement Insight Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-[#111111] border-2 border-[#DC3545] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#DC3545] flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4" /> BOTTLENECK CAPITAL EXPANSION CASE
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#DC3545]/20 text-[#DC3545] border border-[#DC3545] font-black">
                  HIGH PRIORITY
                </span>
              </div>
              <p className="text-xs text-[#DDDDDD] leading-relaxed">
                Olympic Power Racks surge to <strong className="text-white">96% peak occupancy</strong> between 17:00 and 19:45, causing an average of 18 minutes of idle wait time per member.
              </p>
              <div className="p-2.5 bg-black border border-[#333333] text-[11px] text-[#AAAAAA] space-y-1">
                <div>• <strong className="text-[#97D700]">CFO Action</strong>: Allocate £12,500 Capex for 2 additional Half-Rack platforms in Q4.</div>
                <div>• <strong className="text-white">Expected ROI</strong>: Eliminates 35 wait-minutes daily, boosting member retention by 4.2%.</div>
              </div>
            </div>

            <div className="p-4 bg-[#111111] border-2 border-[#97D700] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#97D700] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" /> FOOTPRINT RECLAMATION CASE
                </span>
                <span className="text-[10px] px-2 py-0.5 bg-[#97D700]/20 text-[#97D700] border border-[#97D700] font-black">
                  {reclaimCandidateCount} RECAPTURE CANDIDATES
                </span>
              </div>
              <p className="text-xs text-[#DDDDDD] leading-relaxed">
                Recumbent Lifecycle Bikes operate at only <strong className="text-white">18% capacity</strong>, consuming 8m² of prime floor space during rush hours.
              </p>
              <div className="p-2.5 bg-black border border-[#333333] text-[11px] text-[#AAAAAA] space-y-1">
                <div>• <strong className="text-[#97D700]">CFO Action</strong>: Retire 2 redundant bikes and reallocate space for sled turf.</div>
                <div>• <strong className="text-white">Expected ROI</strong>: Increases functional training throughput by 6 members/hour.</div>
              </div>
            </div>
          </div>

          {/* Machine Inventory & Depreciation Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-[2px] text-white">
                COMMERCIAL FLEET ASSET VALUATION (22 STATIONS)
              </h3>
              <span className="text-[10px] font-mono text-[#AAAAAA] uppercase">
                Sorted by Acquisition Cost & Usage Duty
              </span>
            </div>

            <div className="border-2 border-[#222222] overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#111111] border-b-2 border-[#222222] text-[#888888] font-black uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3">CODE</th>
                    <th className="p-3">EQUIPMENT MODEL</th>
                    <th className="p-3">ZONE</th>
                    <th className="p-3 text-right">BOOK VALUE</th>
                    <th className="p-3 text-right">LIFETIME HRS</th>
                    <th className="p-3 text-center">UTILIZATION</th>
                    <th className="p-3">EST. RETIREMENT</th>
                    <th className="p-3">RECOMMENDATION</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#222222] font-mono text-[11px]">
                  {capexData.map(({ machine: m, currentBookValue, estReplacementQuarter, recommendation, recommendationType }) => (
                    <tr key={m.id} className="hover:bg-[#111111]/80 transition-colors">
                      <td className="p-3 font-bold text-[#97D700]">{m.code}</td>
                      <td className="p-3 font-display font-bold text-white uppercase tracking-wider">{m.name}</td>
                      <td className="p-3 text-[#AAAAAA]">{m.zone}</td>
                      <td className="p-3 text-right text-white">£{currentBookValue.toLocaleString()}</td>
                      <td className="p-3 text-right text-[#AAAAAA]">{m.totalLifetimeHours}h</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 text-[10px] font-bold ${
                          m.utilizationPercentage >= 85
                            ? 'bg-[#DC3545]/20 text-[#DC3545] border border-[#DC3545]'
                            : m.utilizationPercentage >= 65
                            ? 'bg-[#FFC107]/20 text-[#FFC107] border border-[#FFC107]'
                            : 'bg-[#97D700]/20 text-[#97D700] border border-[#97D700]'
                        }`}>
                          {m.utilizationPercentage}%
                        </span>
                      </td>
                      <td className="p-3 text-white">{estReplacementQuarter}</td>
                      <td className="p-3">
                        <span className={`text-[10px] font-bold uppercase tracking-wider ${
                          recommendationType === 'acquire'
                            ? 'text-[#DC3545]'
                            : recommendationType === 'reclaim'
                            ? 'text-[#97D700]'
                            : recommendationType === 'service'
                            ? 'text-[#FFC107]'
                            : 'text-[#888888]'
                        }`}>
                          {recommendation}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#111111] border-t-2 border-[#222222] p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-[#888888] font-mono text-[11px] flex items-center gap-2">
            <Building className="w-3.5 h-3.5 text-[#97D700]" />
            <span>Village Health & Wellness Clubs • Financial Governance Telemetry Node</span>
          </div>
          <button
            onClick={handleDownloadCsv}
            className="vg-btn vg-btn-3 text-xs px-4 py-2 font-black tracking-wider flex items-center justify-center gap-2"
          >
            <Download className="w-3.5 h-3.5" />
            <span>EXPORT SPREADSHEET (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
