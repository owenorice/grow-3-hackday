# Apex Hotel & Leisure Club — Gym Equipment & Overuse Telemetry System

A mobile-responsive web application for luxury hotel & leisure centers that tracks real-time gym machine availability, presents an interactive 2D floorplan, provides peak workout telemetry, and equips staff with automated machine overuse & preventative maintenance alerts.

---

## 🚀 Quickstart

```bash
# Clone the repository
git clone https://github.com/owenorice/grow-3-hackday.git
cd grow-3-hackday

# Install dependencies
npm install

# Run local dev server
npm run dev

# Build for production
npm run build
```

---

## 👥 Parallel AI Developer Team Assignments

| Developer | Assigned Issue | Priority | Focus Directory | Git Branch |
|---|---|---|---|---|
| 👤 **Owen** | **[#2 Interactive 2D SVG Gym Floorplan & Status Pins](https://github.com/owenorice/grow-3-hackday/issues/2)** | `P1-mvp` | `src/components/floorplan/` | `feature/issue-2-floorplan` |
| 👤 **Oliver** | **[#3 Filterable Equipment List, Category Dropdown & Quick Actions](https://github.com/owenorice/grow-3-hackday/issues/3)** | `P1-mvp` | `src/components/equipment/` | `feature/issue-3-equipment-list` |
| 👤 **Tom** | **[#4 Usage Analytics, 24h Peak Curve & Overuse Telemetry](https://github.com/owenorice/grow-3-hackday/issues/4)** | `P2-enhancement` | `src/components/analytics/` | `feature/issue-4-analytics` |
| 👤 **Conor** | **[#6 Staff Maintenance Inspection Modal](https://github.com/owenorice/grow-3-hackday/issues/6)** & **[#5 Presenter Demo Simulator](https://github.com/owenorice/grow-3-hackday/issues/5)** | `P2-enhancement` | `src/components/staff/` & `src/components/simulator/` | `feature/issue-6-staff-modal` |

---

## 🏗️ Architecture & Component Isolation

To prevent merge conflicts across parallel AI sessions, each developer owns their isolated directory:

```
src/
├── types/
│   └── gym.ts                  # Shared types & contracts (All read-only)
├── data/
│   └── seedMachines.ts         # 22 pre-seeded machines & coordinates
├── store/
│   └── GymContext.tsx          # Central reactive store + simulator triggers
├── components/
│   ├── layout/                 # Shared Header & Tabs
│   ├── floorplan/              # [Owen - Issue #2] 2D SVG Floorplan Canvas
│   ├── equipment/              # [Oliver - Issue #3] Equipment Catalog & Filters
│   ├── analytics/              # [Tom - Issue #4] Analytics & Overuse Table
│   ├── staff/                  # [Conor - Issue #6] Staff Inspection Modal
│   └── simulator/              # [Conor - Issue #5] Floating Presenter Demo Bar
└── App.tsx                     # Top-level shell
```

---

## 🤖 AI Session Quick-Start Instructions

### For Owen (`assignee:owen`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-2-floorplan
# Work in src/components/floorplan/FloorplanView.tsx
npm run build
gh pr create --title "[#2] Interactive 2D Floorplan Polish" --body "Resolves #2"
```

### For Oliver (`assignee:oliver`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-3-equipment-list
# Work in src/components/equipment/EquipmentListView.tsx
npm run build
gh pr create --title "[#3] Filterable Equipment List & Quick Actions" --body "Resolves #3"
```

### For Tom (`assignee:tom`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-4-analytics
# Work in src/components/analytics/AnalyticsView.tsx
npm run build
gh pr create --title "[#4] Usage Analytics & Overuse Telemetry" --body "Resolves #4"
```

### For Conor (`assignee:conor`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-6-staff-modal
# Work in src/components/staff/ and src/components/simulator/
npm run build
gh pr create --title "[#6] Staff Maintenance Inspection Modal & Demo Controls" --body "Resolves #6 and #5"
```
