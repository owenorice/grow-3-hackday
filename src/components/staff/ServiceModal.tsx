import React, { useState } from 'react';
import { useGym } from '../../store/GymContext';
import { GymMachine } from '../../types/gym';
import { ShieldCheck, Wrench, X, CheckSquare, Square, History, AlertTriangle } from 'lucide-react';

interface ServiceModalProps {
  machine: GymMachine | null;
  onClose: () => void;
  onServiced?: (machineId: string) => void;
}

export const ServiceModal: React.FC<ServiceModalProps> = ({ machine, onClose, onServiced }) => {
  const { logService } = useGym();

  const [checklist, setChecklist] = useState({
    cables: true,
    lubrication: true,
    fasteners: true,
    safetyStop: true,
    sanitation: true,
  });

  const [technician, setTechnician] = useState('Dave M. (Head Technician)');
  const [notes, setNotes] = useState(
    'Inspected pulley cable sheath, lubricated guide rails, and completed multi-point safety clearance.'
  );

  if (!machine) return null;

  const allChecked = Object.values(checklist).every(Boolean);

  const toggleCheck = (key: keyof typeof checklist) => {
    setChecklist(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSelectAll = () => {
    setChecklist({
      cables: true,
      lubrication: true,
      fasteners: true,
      safetyStop: true,
      sanitation: true,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!allChecked) return;
    logService(machine.id, notes, technician);
    onServiced?.(machine.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      {/* Modal Container */}
      <div className="bg-black border-2 border-[#97D700] max-w-xl w-full p-6 sm:p-8 relative shadow-[0_0_60px_rgba(151,215,0,0.2)] text-white space-y-6">
        
        {/* Tactical Corner Brackets */}
        <div className="absolute top-2 left-2 w-3 h-3 border-t-2 border-l-2 border-[#97D700]" />
        <div className="absolute top-2 right-2 w-3 h-3 border-t-2 border-r-2 border-[#97D700]" />
        <div className="absolute bottom-2 left-2 w-3 h-3 border-b-2 border-l-2 border-[#333333]" />
        <div className="absolute bottom-2 right-2 w-3 h-3 border-b-2 border-r-2 border-[#333333]" />

        {/* Modal Header */}
        <div className="flex items-start justify-between border-b-2 border-[#222222] pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 bg-[#212529] text-[#97D700] font-mono text-xs font-black border border-[#333333]">
                {machine.code}
              </span>
              <span className="text-xs uppercase font-black tracking-[2px] text-[#AAAAAA]">
                STAFF MAINTENANCE CLEARANCE
              </span>
            </div>
            <h2 className="text-2xl font-black uppercase tracking-[2px] text-white font-display">
              {machine.name}
            </h2>
            <p className="text-xs text-[#888888] uppercase tracking-wider font-mono">
              Zone: <strong className="text-white">{machine.zone}</strong> • Operating: <strong className="text-[#DC3545]">{machine.hoursSinceLastService}h</strong> / {machine.serviceThresholdHours}h Limit
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 text-[#888888] hover:text-white border border-[#333333] hover:border-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overdue Warning Alert */}
        {machine.maintenanceStatus !== 'healthy' && (
          <div className="p-3 bg-[#DC3545]/15 border border-[#DC3545] flex items-center gap-3 text-xs">
            <AlertTriangle className="w-5 h-5 text-[#DC3545] shrink-0" />
            <div>
              <p className="font-black uppercase tracking-wider text-[#DC3545]">
                {machine.maintenanceStatus === 'critical_overuse' ? 'CRITICAL OVERUSE THRESHOLD' : 'SCHEDULED SERVICE DUE'}
              </p>
              <p className="text-[#CCCCCC] text-[11px] mt-0.5">
                {machine.serviceNotes || 'Operating hours exceed manufacturer recommended preventive maintenance interval.'}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Inspection Checklist */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-[2px] text-white flex items-center gap-1.5 font-display">
                <ShieldCheck className="w-4 h-4 text-[#97D700]" />
                PRE-CLEARANCE SAFETY CHECKLIST
              </span>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] font-bold uppercase tracking-wider text-[#97D700] hover:underline"
              >
                SELECT ALL
              </button>
            </div>

            <div className="bg-[#111111] border-2 border-[#222222] divide-y divide-[#222222] text-xs">
              <label
                onClick={() => toggleCheck('cables')}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
              >
                {checklist.cables ? (
                  <CheckSquare className="w-4 h-4 text-[#97D700] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#555555] shrink-0" />
                )}
                <span className={checklist.cables ? 'text-white' : 'text-[#888888]'}>
                  Cables & Pulleys inspected for sheath wear, fraying & smooth rotation
                </span>
              </label>

              <label
                onClick={() => toggleCheck('lubrication')}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
              >
                {checklist.lubrication ? (
                  <CheckSquare className="w-4 h-4 text-[#97D700] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#555555] shrink-0" />
                )}
                <span className={checklist.lubrication ? 'text-white' : 'text-[#888888]'}>
                  Belts tensioned & linear guide rails lubricated with silicone spray
                </span>
              </label>

              <label
                onClick={() => toggleCheck('fasteners')}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
              >
                {checklist.fasteners ? (
                  <CheckSquare className="w-4 h-4 text-[#97D700] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#555555] shrink-0" />
                )}
                <span className={checklist.fasteners ? 'text-white' : 'text-[#888888]'}>
                  Frame anchor bolts, Olympic pins & safety catches tightened
                </span>
              </label>

              <label
                onClick={() => toggleCheck('safetyStop')}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
              >
                {checklist.safetyStop ? (
                  <CheckSquare className="w-4 h-4 text-[#97D700] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#555555] shrink-0" />
                )}
                <span className={checklist.safetyStop ? 'text-white' : 'text-[#888888]'}>
                  Emergency magnetic stop lanyard & electronic brakes tested
                </span>
              </label>

              <label
                onClick={() => toggleCheck('sanitation')}
                className="p-3 flex items-center gap-3 cursor-pointer hover:bg-[#1A1A1A] transition-colors"
              >
                {checklist.sanitation ? (
                  <CheckSquare className="w-4 h-4 text-[#97D700] shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-[#555555] shrink-0" />
                )}
                <span className={checklist.sanitation ? 'text-white' : 'text-[#888888]'}>
                  Anti-microbial deep clean and grip handle wipe-down completed
                </span>
              </label>
            </div>
          </div>

          {/* Technician & Service Log Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#AAAAAA] mb-1">
                TECHNICIAN ON DUTY
              </label>
              <input
                type="text"
                value={technician}
                onChange={e => setTechnician(e.target.value)}
                className="w-full bg-[#111111] border-2 border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#97D700]"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-black uppercase tracking-wider text-[#AAAAAA] mb-1">
                SERVICE CLEARANCE DATE
              </label>
              <input
                type="text"
                readOnly
                value={new Date().toLocaleDateString('en-GB')}
                className="w-full bg-[#111111] border-2 border-[#222222] px-3 py-2 text-xs text-[#888888] cursor-not-allowed font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black uppercase tracking-wider text-[#AAAAAA] mb-1">
              LOG ENTRY & INSPECTION NOTES
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#111111] border-2 border-[#333333] p-3 text-xs text-white focus:outline-none focus:border-[#97D700]"
              required
            />
          </div>

          {/* Past Service History */}
          {machine.serviceHistory && machine.serviceHistory.length > 0 && (
            <div className="space-y-1.5 pt-2 border-t border-[#222222]">
              <span className="text-[10px] font-black uppercase tracking-[2px] text-[#888888] flex items-center gap-1 font-display">
                <History className="w-3 h-3 text-[#97D700]" />
                PRIOR SERVICE AUDIT TRAIL
              </span>
              <div className="max-h-24 overflow-y-auto space-y-1 pr-1 text-[11px] font-mono text-[#888888]">
                {machine.serviceHistory.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-1.5 bg-[#111111] border border-[#222222]">
                    <span className="text-white">{h.date}: {h.type}</span>
                    <span className="text-[#AAAAAA]">{h.technician}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t-2 border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="vg-btn vg-btn-1 text-xs px-5 py-2.5 tracking-wider"
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={!allChecked}
              className={`vg-btn ${allChecked ? 'vg-btn-3' : 'bg-[#333333] text-[#777777] border-[#333333] cursor-not-allowed'} text-xs px-6 py-2.5 tracking-wider flex items-center gap-1.5`}
            >
              <Wrench className="w-4 h-4" />
              SUBMIT SERVICE CLEARANCE
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
