import React from 'react';
import { GymProvider, useGym } from './store/GymContext';
import { Header } from './components/layout/Header';
import { Tabs } from './components/layout/Tabs';
import { HeroPod } from './components/layout/HeroPod';
import { FloorplanView } from './components/floorplan/FloorplanView';
import { EquipmentListView } from './components/equipment/EquipmentListView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { WorkoutCircuitDrawer } from './components/circuit/WorkoutCircuitDrawer';
import { SimulatorDrawer } from './components/simulator/SimulatorDrawer';
import { CheckCircle2 } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, toast } = useGym();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#97D700] selection:text-black">
      {/* Action Toast Confirmation Banner */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 animate-fadeIn pointer-events-none">
          <div className="bg-[#111111] border-2 border-[#97D700] px-4 py-2.5 shadow-[0_0_25px_rgba(151,215,0,0.4)] flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 text-[#97D700] shrink-0" />
            <span className="text-xs font-black uppercase tracking-[1px] text-white">{toast}</span>
          </div>
        </div>
      )}

      {/* Top Header with Guest / Staff Mode Switch & Live Gauges */}
      <Header />

      {/* Hero Double Pod Banner */}
      <div className="max-w-6xl w-full mx-auto px-4 pt-6">
        <HeroPod />
      </div>

      {/* Navigation Tabs */}
      <Tabs />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6 pb-24">
        {activeTab === 'floorplan' && <FloorplanView />}
        {activeTab === 'list' && <EquipmentListView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Member Linear Workout Circuit Queue Bar & Drawer */}
      <WorkoutCircuitDrawer />

      {/* Floating Demo Simulator Controls */}
      <SimulatorDrawer />

      {/* Bottom Brutalist Footer */}
      <footer className="border-t-2 border-[#212529] bg-black py-5 text-center text-xs text-[#777777] uppercase tracking-[2px]">
        <p>
          <span className="text-white font-black">VILLAGE GYM</span> • HEALTH & WELLNESS CLUB • REAL-TIME FLOOR & MAINTENANCE TELEMETRY
        </p>
      </footer>
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <GymProvider>
      <AppContent />
    </GymProvider>
  );
};

export default App;
