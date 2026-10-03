# CLAUDE.md — LifeMastery

## Project Overview
**LifeMastery** — personal daily-planning app (React Native / Expo). Local-first, no backend.
Add **actions** (task + time estimate + area of importance), build a **plan** for Today or Tomorrow by picking actions with a priority (1–9), **finalize** today's plan, and tick things off on the Today tab.

## Tech Stack
- **Expo 57**, React Native 0.86 (New Architecture), React 19, TypeScript 6 (`strict: false`)
- **Zustand** — `useDataStore` (areas, actions, plans, history; persisted) and `useSettingsStore` (persisted), plus non-persisted `uiStore` (tab, open sheets) and `alertStore` (toasts)
- **AsyncStorage** via Zustand `persist` — keys `lifemastery-data` / `lifemastery-settings`, schema version 2
- Navigation is a custom bottom tab bar driven by `useUiStore` (`src/components/navigator/`) — no router library. Sheets are RN `Modal` (`pageSheet` on iOS) via `src/components/Sheet.tsx`
- Native extras: `expo-haptics`, `expo-notifications` (daily local reminders), `react-native-svg` (progress ring), `expo-file-system` / `expo-sharing` / `expo-document-picker` (JSON backup)
- iOS bundle ID `com.leonmenzies.LifeMastery`; EAS project `c661cead-b01d-49a6-94ba-1e01d55965ae` (account `leonmenzies`)

## Structure
```
App.js                 # migrate v1 → hydrate stores → rollover, then Navigator
src/
├── components/        # UI primitives (AppText, Button, Card, Chip, Sheet, Stepper, …), ActionAddEdit sheet, navigator/
├── pages/             # Home (Today + Balance sheet), Plan, ActionsList, AreasOfImportance (sheet), Settings
├── store/             # Zustand stores (+ __tests__)
├── theme/Theme.ts     # light/dark tokens, spacing/radius/type scale, useTheme, useAreaColor
├── types/Types.ts     # AreaT, ActionT, PlanT, DayLogT, DataT, SettingsT, ThemeT
└── utils/             # Dates, PlanLogic (rollover/progress/stats), Migration, Backup, Notifications, Haptics (+ __tests__)
```
Import aliases (`~components`, `~pages`, `~store`, `~theme`, `~types`, `~utils`, `~assets`) are defined in both `babel.config.js` and `tsconfig.json` — keep them in sync.

## Brand
The app is for Lenny's dad: **blue `#0327C7` and yellow `#FFC10C` are his brand** (`BRAND_BLUE` / `BRAND_YELLOW` in `theme/Theme.ts`). Yellow = main buttons, progress, active tab; blue = links/icons and the Today hero card. Keep them in any redesign. App icon art must stay centred (ring centre at 512,512 of 1024).

## Data model notes
- Dates are local ISO days (`YYYY-MM-DD`, `utils/Dates.ts`). Never store `toLocaleDateString()`.
- Areas have stable ids; actions reference `areaId` (null = "No area"). Area colours come from the validated `AREA_COLORS` order (max 8); render them through `useAreaColor()` so dark mode gets its own step.
- Plans (`today`, `tomorrow`) hold `actionIds`, per-plan `priorities` and `completedIds`, `finalized`, `focus`.
- Repeating actions are templates: completion is per plan, they never get `completedOn`. `repeatDays` (0 = Sun) empty means every day; due ones sort first in Plan.
- `rollover()` (on launch and app foreground) archives the old day into `history`, promotes `tomorrow` → `today`, and puts unfinished non-repeating actions in `carryOver` (Home offers to add them).
- **Intentional:** finalizing a plan over Max Plan Time clears the selection. Don't "fix" it.
- v1 keys (`action-list`, `aol-list`, `today-plan`, `tomorrow-plan`, `settings`) are migrated once by `utils/Migration.ts` and left in place.

## Commands
```bash
npx expo start          # dev server
npx tsc --noEmit        # type check (must be clean)
npx jest                # tests (must pass)
npx expo-doctor         # dependency/config health (must pass)
```

## Deploying
Mobile only — never docker. Use `/deploy expo` (OTA, JS-only changes) or `/deploy apple` (native build → TestFlight).
`runtimeVersion` policy is `appVersion`, so bump `expo.version` in `app.json` for any native change.
Build numbers are remote + auto-incremented (`eas.json`); production builds use channel `production`.
`react-native-root-siblings` must stay on the same version `react-native-root-toast` depends on, or toasts won't render.

## Roadmap
The makeover in `docs/makeover-plan.md` is implemented on branch `makeover` (v1.2.0, needs a TestFlight build). See the status section at the top of that file.

## Do Not
- Do not add backend calls or auth
- Do not re-introduce Recoil (breaks on React 19) or add a second state library
