import React from 'react';
import { GymProvider, useGym } from './store/GymContext';
import { Header } from './components/layout/Header';
import { Tabs } from './components/layout/Tabs';
import { FloorplanView } from './components/floorplan/FloorplanView';
import { EquipmentListView } from './components/equipment/EquipmentListView';
import { AnalyticsView } from './components/analytics/AnalyticsView';
import { SimulatorDrawer } from './components/simulator/SimulatorDrawer';

const AppContent: React.FC = () => {
  const { activeTab } = useGym();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header with Guest / Staff Mode Switch & Live Gauges */}
      <Header />

      {/* Navigation Tabs */}
      <Tabs />

      {/* Main Content Area */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        {activeTab === 'floorplan' && <FloorplanView />}
        {activeTab === 'list' && <EquipmentListView />}
        {activeTab === 'analytics' && <AnalyticsView />}
      </main>

      {/* Floating Demo Simulator Controls */}
      <SimulatorDrawer />

      {/* Bottom Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 text-center text-xs text-slate-600">
        <p>Apex Hotel & Leisure Club • Gym Floorplan & Overuse Telemetry System • 90-Min Hackday Edition</p>
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
