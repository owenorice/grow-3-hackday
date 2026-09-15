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

const AppContent: React.FC = () => {
  const { activeTab } = useGym();

  return (
    <div className="min-h-screen bg-black text-white flex flex-col font-sans selection:bg-[#97D700] selection:text-black">
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
