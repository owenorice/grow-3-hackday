import React from 'react';
import { useGym } from '../../store/GymContext';
import { Map, ListFilter, BarChart3 } from 'lucide-react';
import { ActiveTab } from '../../types/gym';

export const Tabs: React.FC = () => {
  const { activeTab, setActiveTab, appMode } = useGym();
  const isStaff = appMode === 'staff';

  const tabItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'floorplan', label: 'Live Floorplan', icon: <Map className="w-4 h-4" /> },
    { id: 'list', label: 'Equipment Catalog', icon: <ListFilter className="w-4 h-4" /> },
    { id: 'analytics', label: isStaff ? 'Overuse & Health' : 'Peak Usage & Trends', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex border-b border-slate-800 bg-slate-900/40">
      <div className="max-w-6xl mx-auto px-4 w-full flex gap-2">
        {tabItems.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3 px-4 text-sm font-medium border-b-2 transition-all ${
                isActive
                  ? isStaff
                    ? 'border-amber-500 text-amber-400 bg-amber-500/10'
                    : 'border-emerald-500 text-emerald-400 bg-emerald-500/10'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
