# Village Gym — Club Equipment & Preventative Telemetry System

A high-voltage web application built for **Village Health & Wellness Clubs**, matching the official **Village Gym Design System** (`village_gym_design_system.md`). Features real-time gym equipment availability, interactive 2D brutalist floorplan, peak usage analytics, and staff machine overuse telemetry.

---

## 🎨 Visual Identity & Design Tokens

- **Brand Accent**: High-Voltage **Volt Lime (`#97D700`)**
- **Surfaces**: Pitch Black (`#000000`), Dark Charcoal (`#212529` / `#333333`), Warm Stone (`#F1F1EC`)
- **Aesthetic**: Athletic brutalism, 0px border-radius (`rounded-none`), uppercase condensed typography (`tracking-[2px]` to `tracking-[6px]`), and inset vignette shadows.
- **Button System**: `.vg-btn`, `.vg-btn-1` (Dark Neutral), `.vg-btn-2` (Accent Outline), `.vg-btn-3` (Primary Volt Lime CTA), `.vg-btn-danger`.

---

## 👥 Parallel AI Developer Team Assignments

| Developer | Assigned Issue | Priority | Focus Area | Status |
|---|---|---|---|---|
| 👤 **Owen** | **[#8 Athletic Split-Pod Hero](https://github.com/owenorice/grow-3-hackday/issues/8)** & **[#11 UI Beautification](https://github.com/owenorice/grow-3-hackday/issues/11)** & **[#2 SVG Floorplan](https://github.com/owenorice/grow-3-hackday/issues/2)** | `P1` / `P3` | `src/components/layout/` & `floorplan/` | ✅ **SHIPPED** (PRs #7, #13, #14) |
| 👤 **Oliver** | **[#3 Filterable Equipment Directory](https://github.com/owenorice/grow-3-hackday/issues/3)** & **[#9 Workout Circuit & Linear Queue](https://github.com/owenorice/grow-3-hackday/issues/9)** | `P1` / `P2` | `src/components/equipment/` & `circuit/` | ✅ **SHIPPED** (PRs #10, #12) |
| 👤 **Tom** | **[#4 Usage Analytics & Brutalist Telemetry Charts](https://github.com/owenorice/grow-3-hackday/issues/4)** | `P2` | `src/components/analytics/` | ✅ **SHIPPED** (PR #15) |
| 👤 **Conor** | **[#6 Staff Maintenance Inspection Modal](https://github.com/owenorice/grow-3-hackday/issues/6)** & **[#5 Demo Simulator Controls](https://github.com/owenorice/grow-3-hackday/issues/5)** | `P2` | `src/components/staff/` & `simulator/` | ✅ **SHIPPED** (PRs #5, #17) |

---

## 🏗️ Architecture & Component Isolation

```
src/
├── types/
│   └── gym.ts                  # Shared types & contracts (All read-only)
├── data/
│   └── seedMachines.ts         # 22 pre-seeded machines & coordinates
├── store/
│   └── GymContext.tsx          # Central reactive store + simulator triggers
├── components/
│   ├── layout/                 # [Owen - Issue #8] Brand Header, Tabs & Hero Pod
│   ├── floorplan/              # [Owen - Issue #2 ✅] 2D SVG Floorplan Canvas (Village Gym Styled)
│   ├── equipment/              # [Oliver - Issue #3] Equipment Catalog & Filter Pods
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
git checkout -b feature/issue-8-hero-pod
# Work in src/components/layout/HeroPod.tsx
npm run build
gh pr create --title "[#8] Village Gym Split-Pod Hero Banner" --body "Resolves #8"
```

### For Oliver (`assignee:oliver`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-3-equipment-list
# Work in src/components/equipment/EquipmentListView.tsx using Village Gym pod card design
npm run build
gh pr create --title "[#3] Filterable Equipment Directory & Pod Cards" --body "Resolves #3"
```

### For Tom (`assignee:tom`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-4-analytics
# Work in src/components/analytics/AnalyticsView.tsx using Village Gym brutalist charts
npm run build
gh pr create --title "[#4] Usage Analytics & Brutalist Telemetry Charts" --body "Resolves #4"
```

### For Conor (`assignee:conor`):
```bash
git checkout main && git pull origin main
git checkout -b feature/issue-6-staff-modal
# Work in src/components/staff/ and src/components/simulator/
npm run build
gh pr create --title "[#6] Staff Maintenance Inspection Modal & Demo Controls" --body "Resolves #6 and #5"
```
