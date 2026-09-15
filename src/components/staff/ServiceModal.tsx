import React, { useState, useEffect } from 'react';
import { useGym } from '../../store/GymContext';
import {
  Wrench,
  X,
  CheckSquare,
  Square,
  ShieldCheck,
  AlertTriangle,
  History,
  User,
  CheckCircle2,
} from 'lucide-react';

interface ServiceModalProps {
  machineId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onServiceSuccess?: (machineId: string) => void;
}

const CHECKLIST_ITEMS = [
  { id: 'cables', label: 'Cables & Pulleys inspected for sheath wear & alignment' },
  { id: 'belts', label: 'Belts tensioned & guide rails lubricated with silicone spray' },
  { id: 'bolts', label: 'Frame anchor bolts, footings & collar pins tightened' },
  { id: 'safety', label: 'Emergency stop & mechanical safety catch verified' },
];

export const ServiceModal: React.FC<ServiceModalProps> = ({
  machineId,
  isOpen,
  onClose,
  onServiceSuccess,
}) => {
  const { machines, logService } = useGym();
  const machine = machines.find(m => m.id === machineId) || null;

  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({
    cables: true,
    belts: true,
    bolts: true,
    safety: true,
  });

  const [technician, setTechnician] = useState<string>('Dave M. (Staff Duty Lead)');
  const [notes, setNotes] = useState<string>(
    'Routine preventative maintenance completed. Mechanical components inspected, lubricated, and calibrated.'
  );
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);

  useEffect(() => {
    if (isOpen) {
      setCheckedItems({
        cables: true,
        belts: true,
        bolts: true,
        safety: true,
      });
      setIsSubmitted(false);
      setNotes('Routine preventative maintenance completed. Mechanical components inspected, lubricated, and calibrated.');
    }
  }, [isOpen, machineId]);

  if (!isOpen || !machine) {
    return null;
  }

  const allChecked = CHECKLIST_ITEMS.every(item => checkedItems[item.id]);
  const checkedCount = CHECKLIST_ITEMS.filter(item => checkedItems[item.id]).length;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSelectAll = () => {
    const allSelected = allChecked;
    const newState: Record<string, boolean> = {};
    CHECKLIST_ITEMS.forEach(item => {
      newState[item.id] = !allSelected;
    });
    setCheckedItems(newState);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!machine) return;

    const checklistSummary = Object.entries(checkedItems)
      .filter(([, v]) => v)
      .map(([k]) => CHECKLIST_ITEMS.find(i => i.id === k)?.label)
      .join('; ');

    const fullNotes = notes
      ? `${notes} [Checks verified: ${checklistSummary}]`
      : `Inspection verified: ${checklistSummary}`;

    logService(machine.id, fullNotes, technician);
    onServiceSuccess?.(machine.id);
    setIsSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const isOverdue =
    machine.maintenanceStatus === 'critical_overuse' || machine.maintenanceStatus === 'service_due';

  return (
    <div
      className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="bg-black border-2 border-[#333333] max-w-xl w-full max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,0,0,0.95)]"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-[#111111] border-b-2 border-[#222222] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 flex items-center justify-center font-black ${
                isOverdue ? 'bg-[#DC3545] text-white' : 'bg-[#97D700] text-black'
              }`}
            >
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-[#97D700]">{machine.code}</span>
                <h3 className="font-black text-sm uppercase tracking-[2px] text-white">
                  STAFF PREVENTATIVE INSPECTION
                </h3>
              </div>
              <p className="text-xs text-[#AAAAAA] uppercase tracking-[1px] mt-0.5">
                {machine.name} • {machine.zone}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#AAAAAA] hover:text-white p-1.5 bg-[#222222] hover:bg-[#333333] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Telemetry Status Strip */}
        <div className="grid grid-cols-3 bg-[#0a0a0a] border-b border-[#222222] divide-x divide-[#222222] text-xs">
          <div className="p-3 text-center">
            <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Operational Hours</span>
            <span
              className={`text-sm font-black font-mono ${
                isOverdue ? 'text-[#DC3545]' : 'text-white'
              }`}
            >
              {machine.hoursSinceLastService}h / {machine.serviceThresholdHours}h
            </span>
          </div>
          <div className="p-3 text-center">
            <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Lifetime Hours</span>
            <span className="text-sm font-black text-white font-mono">{machine.totalLifetimeHours}h</span>
          </div>
          <div className="p-3 text-center">
            <span className="block text-[10px] text-[#777777] uppercase tracking-[1px]">Status</span>
            <span
              className={`inline-block text-[10px] font-black uppercase px-2 py-0.5 mt-0.5 ${
                machine.maintenanceStatus === 'critical_overuse'
                  ? 'bg-red-950 text-red-400 border border-red-800'
                  : machine.maintenanceStatus === 'service_due'
                  ? 'bg-amber-950 text-amber-400 border border-amber-800'
                  : 'bg-emerald-950 text-emerald-400 border border-emerald-800'
              }`}
            >
              {machine.maintenanceStatus.replace('_', ' ')}
            </span>
          </div>
        </div>

        {/* Overdue Warning Alert */}
        {isOverdue && (
          <div className="bg-red-950/40 border-b border-red-900/60 p-3 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-[#DC3545] flex-shrink-0 mt-0.5" />
            <div className="text-xs text-red-200">
              <span className="font-bold uppercase tracking-wide">Inspection Required:</span>{' '}
              {machine.serviceNotes ||
                `Machine has exceeded the safe inspection threshold of ${machine.serviceThresholdHours} hours.`}
            </div>
          </div>
        )}

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 overflow-y-auto space-y-4 max-h-[55vh]">
          {/* 4-Point Safety Checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-[1.5px] text-white flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#97D700]" />
                Safety Clearance Checklist ({checkedCount}/{CHECKLIST_ITEMS.length})
              </label>
              <button
                type="button"
                onClick={handleSelectAll}
                className="text-[10px] text-[#97D700] hover:underline uppercase tracking-wider font-bold"
              >
                {allChecked ? 'Deselect All' : 'Verify All'}
              </button>
            </div>

            <div className="bg-[#111111] border border-[#222222] p-2.5 space-y-2">
              {CHECKLIST_ITEMS.map(item => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className="flex items-start gap-2.5 p-2 bg-black hover:bg-[#1a1a1a] border border-[#222222] cursor-pointer transition-colors"
                  >
                    <button type="button" className="text-[#97D700] mt-0.5 flex-shrink-0">
                      {isChecked ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4 text-[#555555]" />}
                    </button>
                    <span className={`text-xs ${isChecked ? 'text-white font-medium' : 'text-[#777777]'}`}>
                      {item.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Technician Details */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-[1.5px] text-white flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-[#97D700]" />
              Authorized Technician
            </label>
            <input
              type="text"
              required
              value={technician}
              onChange={e => setTechnician(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#97D700] font-sans"
              placeholder="e.g. Dave M. (Staff Duty Lead)"
            />
          </div>

          {/* Service Notes */}
          <div className="space-y-1.5">
            <label className="text-xs font-black uppercase tracking-[1.5px] text-white flex items-center gap-1.5">
              <Wrench className="w-3.5 h-3.5 text-[#97D700]" />
              Maintenance Notes & Parts Replaced
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={e => setNotes(e.target.value)}
              className="w-full bg-[#111111] border border-[#333333] px-3 py-2 text-xs text-white focus:outline-none focus:border-[#97D700] font-sans resize-none"
              placeholder="Detail actions taken, tension adjustments, lubrication, or components replaced..."
            />
          </div>

          {/* Past Service History Log */}
          {machine.serviceHistory && machine.serviceHistory.length > 0 && (
            <div className="space-y-1.5 pt-1">
              <label className="text-[11px] font-black uppercase tracking-[1px] text-[#AAAAAA] flex items-center gap-1.5">
                <History className="w-3.5 h-3.5 text-[#777777]" />
                Recent Service History
              </label>
              <div className="bg-[#111111] border border-[#222222] divide-y divide-[#222222] max-h-32 overflow-y-auto text-xs">
                {machine.serviceHistory.map((rec, i) => (
                  <div key={i} className="p-2 flex items-center justify-between text-[11px]">
                    <div>
                      <span className="text-white font-medium">{rec.type}</span>
                      <span className="text-[#777777] block text-[10px]">{rec.technician}</span>
                    </div>
                    <span className="font-mono text-[#AAAAAA] text-[10px]">{rec.date}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Success Toast Banner */}
          {isSubmitted && (
            <div className="bg-emerald-950 border border-emerald-600 p-3 flex items-center gap-2 text-emerald-300 text-xs font-bold animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-[#97D700]" />
              <span>Service signed off! Machine reset to 0h and marked Healthy.</span>
            </div>
          )}

          {/* Footer Submit Buttons */}
          <div className="pt-2 flex items-center justify-end gap-2 border-t border-[#222222]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#222222] hover:bg-[#333333] text-xs font-bold uppercase tracking-[1px] text-white border border-[#444444] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitted}
              className="px-5 py-2 bg-[#97D700] hover:bg-[#86be00] disabled:opacity-50 text-black text-xs font-black uppercase tracking-[1px] flex items-center gap-1.5 shadow-[0_0_20px_rgba(151,215,0,0.4)] transition-all"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>SUBMIT SERVICE CLEARANCE</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
