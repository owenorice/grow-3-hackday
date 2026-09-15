import React from 'react';
import { useGym } from '../../store/GymContext';
import { Map, ListFilter, BarChart3 } from 'lucide-react';
import { ActiveTab } from '../../types/gym';

export const Tabs: React.FC = () => {
  const { activeTab, setActiveTab, appMode } = useGym();
  const isStaff = appMode === 'staff';

  const tabItems: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'floorplan', label: 'Interactive Floor', icon: <Map className="w-4 h-4" /> },
    { id: 'list', label: 'Equipment Directory', icon: <ListFilter className="w-4 h-4" /> },
    { id: 'analytics', label: isStaff ? 'Staff Overuse Telemetry' : 'Peak Traffic & Trends', icon: <BarChart3 className="w-4 h-4" /> },
  ];

  return (
    <div className="flex border-b-2 border-[#333333] bg-black">
      <div className="max-w-6xl mx-auto px-4 w-full flex gap-1">
        {tabItems.map(tab => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-3.5 px-5 text-xs font-bold uppercase tracking-[1.5px] border-b-2 transition-all ${
                isActive
                  ? isStaff
                    ? 'border-[#DC3545] text-white bg-[#212529]'
                    : 'border-[#97D700] text-[#97D700] bg-[#111111]'
                  : 'border-transparent text-[#AAAAAA] hover:text-white hover:bg-[#111111]'
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
