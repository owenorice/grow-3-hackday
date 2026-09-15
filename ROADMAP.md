# Apex Hotel & Leisure Club — Gym Equipment & Overuse Telemetry System

A mobile-responsive web application for luxury hotel & leisure centers that tracks real-time gym machine availability, presents an interactive 2D floorplan, provides peak workout telemetry, and equips staff with automated machine overuse & preventative maintenance alerts.

---

## 🚀 Quickstart

```bash
# Install dependencies
npm install

# Run local dev server
npm run dev

# Build for production
npm run build
```

---

## 🏗️ Architecture & Component Isolation

To enable multiple independent AI agents to develop features concurrently without merge conflicts, work is strictly separated by directory:

```
src/
├── types/
│   └── gym.ts                  # Shared data models (Machines, Zones, Telemetry, Maintenance)
├── data/
│   └── seedMachines.ts         # 22 pre-seeded machines with coordinates and usage metrics
├── store/
│   └── GymContext.tsx          # Central reactive store + LocalStorage persistence + Simulator tools
├── components/
│   ├── layout/                 # Header with Guest/Staff switch, Navigation Tabs
│   ├── floorplan/              # [Issue #2] 2D SVG Interactive Gym Floorplan
│   ├── equipment/              # [Issue #3] Filterable Equipment Catalog & In-Use Toggles
│   ├── analytics/              # [Issue #4] Peak Hours Curves & Overuse Dashboard
│   └── simulator/              # [Issue #5] Floating Presenter Demo Controls
└── App.tsx                     # Top-level shell
```

---

## 📋 Multi-Agent GitHub Issue Tickets

| Issue | Priority | Title | Focus Area | Recommended Branch |
|---|---|---|---|---|
| **#1** | `P0-foundation` | Base Scaffold, Types, Mock Store & Staff/Guest Shell | `src/types/`, `src/store/` | `main` |
| **#2** | `P1-mvp` | Interactive 2D SVG Gym Floorplan & Status Pins | `src/components/floorplan/` | `feature/issue-2-floorplan` |
| **#3** | `P1-mvp` | Filterable Equipment List, Category Dropdown & Quick Actions | `src/components/equipment/` | `feature/issue-3-equipment-list` |
| **#4** | `P2-enhancement` | Usage Analytics, 24h Peak Curve & Overuse Telemetry | `src/components/analytics/` | `feature/issue-4-analytics` |
| **#5** | `P2-enhancement` | Presenter Demo Simulator Controls & Rush Triggers | `src/components/simulator/` | `feature/issue-5-demo-simulator` |
| **#6** | `P2-enhancement` | Staff Maintenance Inspection Modal & Checklist | `src/components/staff/` | `feature/issue-6-staff-modal` |

---

## 🤖 Instructions for AI Agent Sessions

1. **Check out your ticket branch**:
   ```bash
   git checkout -b feature/issue-<ID>-<name>
   ```
2. **Work strictly inside your designated component directory** to avoid merge conflicts with other agents.
3. **Use the shared store**: Import `useGym()` from `../../store/GymContext` for all machine states and actions.
4. **Run build check before opening PR**:
   ```bash
   npm run build
   ```
5. **Open Pull Request** linking to the respective GitHub Issue:
   ```bash
   gh pr create --title "[#<ID>] Feature Name" --body "Resolves #<ID>"
   ```
