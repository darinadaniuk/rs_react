# RS School React

## Overview

This is a React application developed by **Darya Daniuk** as part of the RS School React course.
The project aimed to gain React coding skills. The application bootstrapped with [Vite](https://vitejs.dev/).

## Getting Started

### Prerequisites

- Node.js (version 16 or higher recommended)
- npm or yarn package manager

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/darinadaniuk/rs_react.git
   cd rs_react
   ```

2. Install dependencies:

   ```bash
    npm install
    # or
    yarn install
   ```

3. Running the Development Server
   Start the Vite development server:

```bash
  npm run dev
  # or
  yarn dev
```

Open your browser and navigate to http://localhost:5173 (default Vite port) to see the app.


# Countries Performance 

Explore and profile country data (population + CO₂ metrics) with fast client‑side interactions, i18n, and a focus on rendering performance.

## ✨ Features

* **Data fetch + transform** from the OWID CO₂ dataset.
* **Country cards** with latest population & ISO and a **yearly data table**.
* **Global Year selector** to switch the visible year across all cards.
* **Search** countries by name.
* **Sorting** by population (selected year) and by name (asc/desc).
* **Column Picker modal** to add/remove optional metrics (e.g., `co2`, `co2_per_capita`).
* **i18n** via `next-intl` (English & Russian messages).
* **Performance optimizations** with `useMemo`, `useCallback`, memoized subcomponents, and Suspense fallback.
* **Tests** with Vitest + React Testing Library.

> This implementation follows the Rolling Scopes School performance task.


## 🧠 Performance Notes

### Techniques used

* Memoize derived collections (filtered/sorted lists, visible columns) with `useMemo`.
* Memoize event handlers (`onSort`, `onSearch`, `onToggleColumn`, `onYearChange`) with `useCallback`.
* Extract and memoize row/cell subcomponents (`React.memo`) to reduce cascading rerenders.
* Hoist heavy utilities (e.g., `Intl.NumberFormat`) to module scope or stable refs.
* Use **Suspense** to show lightweight fallbacks during data load.


## 📈 Profiling Results

> Taken on a local production build using React DevTools Profiler. Interactions were not explicitly recorded; the analysis relies on commit and render durations from the Profiler captures.

### Before optimization

* Sorting by **Population** – Commit **2.3s**, Render **1038.6ms**

* Sorting by **Name (desc)** – Commit **2.9s**, Render **1107.4ms**

* **Search** – Commit **4.3s**, Render **1004.5ms**

* **Select Year** – Commit **4.9s**, Render **25.1ms**

* **Add/Remove Columns** – Commit **0.8s**, Render **1182.4ms**


### After optimization

* Sorting by **Population** – Commit **1.9s**, Render **166.2ms**

* Sorting by **Name (desc)** – Commit **1.7s**, Render **158.8ms**

* **Search** – Commit **1.7s**, Render **137.4ms**

* **Select Year** – Commit **3.9s**, Render **24.3ms**

* **Add/Remove Columns** – Commit **0.8s**, Render **1414.8ms**


### Summary (↓ faster, ↑ slower)

| Scenario            | Commit (s) Before → After |    Δ |          % | Render (ms) Before → After |          Δ |          % |
| ------------------- | ------------------------: | ---: | ---------: | -------------------------: | ---------: | ---------: |
| Sort by Population  |                 2.3 → 1.9 | −0.4 | **−17.4%** |             1038.6 → 166.2 |     −872.4 | **−84.0%** |
| Sort by Name (desc) |                 2.9 → 1.7 | −1.2 | **−41.4%** |             1107.4 → 158.8 |     −948.6 | **−85.7%** |
| Search              |                 4.3 → 1.7 | −2.6 | **−60.5%** |             1004.5 → 137.4 |     −867.1 | **−86.3%** |
| Select Year         |                 4.9 → 3.9 | −1.0 | **−20.4%** |                25.1 → 24.3 |       −0.8 |      −3.2% |
| Add/Remove Columns  |                 0.8 → 0.8 |  0.0 |       0.0% |            1182.4 → 1414.8 | **+232.4** | **+19.7%** |

