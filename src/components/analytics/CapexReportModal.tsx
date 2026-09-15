import React from 'react';
import { useGym } from '../../store/GymContext';
import {
  X,
  Printer,
  TrendingUp,
  PoundSterling,
  ShieldAlert,
  Download,
} from 'lucide-react';

interface CapexReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExportCsv: () => void;
}

export const CapexReportModal: React.FC<CapexReportModalProps> = ({ isOpen, onClose, onExportCsv }) => {
  const { machines } = useGym();

  if (!isOpen) return null;

  // Aggregate Fleet Capex Metrics
  const totalFleetCapex = machines.reduce((sum, m) => sum + (m.procurementCost || 5000), 0);
  const totalAnnualMaintenance = machines.reduce((sum, m) => sum + (m.annualMaintenanceCost || 500), 0);
  const avgUtilization = Math.round(
    machines.reduce((sum, m) => sum + m.utilizationPercentage, 0) / (machines.length || 1)
  );

  const highestDemand = [...machines].sort((a, b) => b.utilizationPercentage - a.utilizationPercentage).slice(0, 3);
  const lowestDemand = [...machines].sort((a, b) => a.utilizationPercentage - b.utilizationPercentage).slice(0, 3);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="bg-[#0b0d0e] border-2 border-[#97D700] max-w-4xl w-full p-5 sm:p-8 relative shadow-[0_0_80px_rgba(151,215,0,0.25)] text-white space-y-6 max-h-[92vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Tactical Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#97D700]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#97D700]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#97D700]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#97D700]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-2 border-[#20252b] pb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#97D700] text-black text-[10px] font-black font-oswald px-2 py-0.5 tracking-wider uppercase">
                EXECUTIVE TELEMETRY
              </span>
              <span className="text-xs font-mono text-[#8c959e] tracking-wider uppercase">
                FISCAL YEAR 2026 FLEET AUDIT
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-oswald tracking-wide uppercase text-white flex items-center gap-2">
              <PoundSterling className="w-7 h-7 text-[#97D700]" />
              EQUIPMENT CAPEX &amp; FLEET ASSET ROI REPORT
            </h2>
            <p className="text-xs text-[#9ba6b2] mt-0.5">
              Empirical machine utilization telemetry mapped to procurement priorities and footprint optimization.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-[#888888] hover:text-white hover:bg-neutral-800 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Executive Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-[#121518] border border-[#262c33] p-3">
            <span className="text-[10px] font-mono text-[#8c959e] uppercase block">TOTAL FLEET VALUATION</span>
            <span className="text-xl sm:text-2xl font-black font-oswald text-white block mt-1">
              £{totalFleetCapex.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#97D700] font-mono block mt-0.5">22 Asset Units Tracked</span>
          </div>

          <div className="bg-[#121518] border border-[#262c33] p-3">
            <span className="text-[10px] font-mono text-[#8c959e] uppercase block">ANNUAL MAINT. BURN</span>
            <span className="text-xl sm:text-2xl font-black font-oswald text-amber-400 block mt-1">
              £{totalAnnualMaintenance.toLocaleString()}
            </span>
            <span className="text-[10px] text-[#8c959e] font-mono block mt-0.5">Preventive Inspections</span>
          </div>

          <div className="bg-[#121518] border border-[#262c33] p-3">
            <span className="text-[10px] font-mono text-[#8c959e] uppercase block">AVG FLEET UTILIZATION</span>
            <span className="text-xl sm:text-2xl font-black font-oswald text-[#97D700] block mt-1">
              {avgUtilization}%
            </span>
            <span className="text-[10px] text-[#97D700] font-mono block mt-0.5">+8% vs Industry Benchmark</span>
          </div>

          <div className="bg-[#121518] border border-[#262c33] p-3">
            <span className="text-[10px] font-mono text-[#8c959e] uppercase block">OVERCAPACITY RISKS</span>
            <span className="text-xl sm:text-2xl font-black font-oswald text-rose-500 block mt-1">
              {highestDemand.filter(m => m.utilizationPercentage >= 85).length} STATIONS
            </span>
            <span className="text-[10px] text-rose-400 font-mono block mt-0.5">&gt; 85% Peak Saturation</span>
          </div>
        </div>

        {/* Strategic Business Case 1: Squat Rack Expansion */}
        <div className="bg-[#121518] border-2 border-[#DC3545] p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <ShieldAlert className="w-5 h-5 text-[#DC3545]" />
            <h3 className="font-oswald font-black text-lg text-white uppercase tracking-wide">
              BUSINESS CASE 1 // CAPEX EXPANSION PRIORITY: OLYMPIC POWER RACKS
            </h3>
          </div>
          <div className="space-y-2 text-xs text-[#cfd6dc] leading-relaxed">
            <p>
              <strong className="text-white">Empirical Evidence:</strong> Olympic Power Racks (SQ-01, SQ-02, SQ-03) operate at an average of <strong className="text-[#DC3545]">94–96% peak capacity</strong> between 17:00 and 20:30 daily, resulting in sustained 22–28 minute member waiting queues. Exit survey telemetry indicates a 14% correlation with member churn.
            </p>
            <div className="bg-[#1e1013] border border-[#DC3545]/60 p-3 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-mono text-red-300 uppercase block">RECOMMENDED CAPEX</span>
                <span className="text-base font-black font-oswald text-white">£14,800 (+2 Racks)</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-300 uppercase block">PROJECTED REVENUE SAVED</span>
                <span className="text-base font-black font-oswald text-[#97D700]">£38,400 / yr</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-red-300 uppercase block">ESTIMATED PAYBACK PERIOD</span>
                <span className="text-base font-black font-oswald text-cyan-300">4.6 Months</span>
              </div>
            </div>
          </div>
        </div>

        {/* Strategic Business Case 2: Turf / Low Demand Reallocation */}
        <div className="bg-[#121518] border-2 border-[#9FC63B] p-4 relative">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-[#9FC63B]" />
            <h3 className="font-oswald font-black text-lg text-white uppercase tracking-wide">
              BUSINESS CASE 2 // OPEX &amp; FOOTPRINT OPTIMIZATION: RECUMBENT / LOW DEMAND BAYS
            </h3>
          </div>
          <div className="space-y-2 text-xs text-[#cfd6dc] leading-relaxed">
            <p>
              <strong className="text-white">Empirical Evidence:</strong> Underutilized cardio/specialty bays operate at <strong className="text-[#9FC63B]">18–25% average utilization</strong>, consuming approximately 32m² of premium floor area.
            </p>
            <div className="bg-[#161c0d] border border-[#9FC63B]/60 p-3 mt-2 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <span className="text-[10px] font-mono text-lime-300 uppercase block">FLOOR REALLOCATION</span>
                <span className="text-base font-black font-oswald text-white">Reclaim 24m² Space</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-lime-300 uppercase block">STRATEGIC PROPOSAL</span>
                <span className="text-base font-black font-oswald text-[#97D700]">Hyrox Sled Sprint Lane</span>
              </div>
              <div>
                <span className="text-[10px] font-mono text-lime-300 uppercase block">COMMERCIAL RETURN</span>
                <span className="text-base font-black font-oswald text-cyan-300">+28% PT Bookings</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fleet Asset Breakdown Table */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-oswald font-black text-sm uppercase text-white tracking-wider">
              FLEET ASSET UTILIZATION &amp; REPLACEMENT MATRIX ({machines.length} MACHINES)
            </h4>
            <span className="text-[11px] font-mono text-[#8c959e]">Sorted by Utilization %</span>
          </div>

          <div className="border border-[#20252b] overflow-x-auto max-h-60 overflow-y-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#121518] text-[#8c959e] font-mono uppercase text-[10px] sticky top-0 border-b border-[#20252b]">
                <tr>
                  <th className="p-2">Code</th>
                  <th className="p-2">Equipment Name</th>
                  <th className="p-2">Zone</th>
                  <th className="p-2 text-center">Load</th>
                  <th className="p-2 text-right">Capex Cost</th>
                  <th className="p-2 text-right">Annual Maint.</th>
                  <th className="p-2">Target Muscle</th>
                  <th className="p-2">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2329] font-mono text-[11px]">
                {highestDemand.concat(lowestDemand).map(m => {
                  const isHigh = m.utilizationPercentage >= 80;
                  const isLow = m.utilizationPercentage <= 50;
                  return (
                    <tr key={m.id} className="hover:bg-neutral-900/60 transition-colors">
                      <td className="p-2 font-bold text-white">{m.code}</td>
                      <td className="p-2 text-[#cfd6dc] font-sans font-medium">{m.name}</td>
                      <td className="p-2 text-[#8c959e] text-[10px]">{m.zone}</td>
                      <td className="p-2 text-center">
                        <span
                          className={`px-1.5 py-0.5 text-[10px] font-bold ${
                            isHigh
                              ? 'bg-red-950 text-red-300 border border-red-800'
                              : isLow
                              ? 'bg-amber-950 text-amber-300 border border-amber-800'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}
                        >
                          {m.utilizationPercentage}%
                        </span>
                      </td>
                      <td className="p-2 text-right text-white">£{(m.procurementCost || 5000).toLocaleString()}</td>
                      <td className="p-2 text-right text-[#9ba6b2]">£{(m.annualMaintenanceCost || 500).toLocaleString()}</td>
                      <td className="p-2 text-[#97D700] text-[10px] font-sans">{m.targetMuscleGroup || 'General'}</td>
                      <td className="p-2 text-[10px] font-sans">
                        {isHigh ? (
                          <span className="text-red-400 font-bold">Procure Additional Unit</span>
                        ) : isLow ? (
                          <span className="text-amber-400">Reallocate Footprint</span>
                        ) : (
                          <span className="text-emerald-400">Maintain Lifecycle</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t-2 border-[#20252b]">
          <div className="flex items-center gap-2">
            <button
              onClick={onExportCsv}
              className="bg-[#97D700] hover:bg-[#85c000] text-black font-oswald font-black text-xs py-2.5 px-4 tracking-wider uppercase flex items-center gap-2 transition-colors"
            >
              <Download className="w-4 h-4" />
              DOWNLOAD RAW CSV TELEMETRY
            </button>
            <button
              onClick={handlePrint}
              className="bg-[#14171a] border border-[#2b3036] hover:border-[#97D700] text-white font-oswald font-black text-xs py-2.5 px-4 tracking-wider uppercase flex items-center gap-2 transition-colors"
            >
              <Printer className="w-4 h-4 text-[#97D700]" />
              PRINT / SAVE PDF
            </button>
          </div>

          <button
            onClick={onClose}
            className="text-xs font-mono uppercase text-[#8c959e] hover:text-white transition-colors py-2 px-3"
          >
            CLOSE AUDIT
          </button>
        </div>
      </div>
    </div>
  );
};
