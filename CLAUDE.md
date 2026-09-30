# CLAUDE.md — LifeMastery

## Project Overview
**LifeMastery** — personal daily-planning app (React Native / Expo). Local-first, no backend.
Add **actions** (task + time estimate + priority + area of importance), build a **plan** for Today or Tomorrow from them, and track completion on Home.

## Tech Stack
- **Expo 57**, React Native 0.86 (New Architecture), React 19, TypeScript 6 (`strict: false`)
- **Zustand** — state, one store per concern in `src/store/` (`useXStore((s) => s.field)`)
- **AsyncStorage** — all persistence, via handlers in `src/utils/*Handler.ts`
- Navigation is a custom bottom menu driven by `useNavigatorStore` (`src/components/navigator/`) — no router library
- iOS bundle ID `com.leonmenzies.LifeMastery`; EAS project `c661cead-b01d-49a6-94ba-1e01d55965ae` (account `leonmenzies`)

## Structure
```
App.js                 # RootSiblingParent (needed for toasts) + Navigator
src/
├── components/        # Shared inputs/buttons, ActionAddEdit modal, navigator/
├── pages/             # Home, Plan, ActionsList, AreasOfImportance (modal), Settings
├── store/             # Zustand stores
├── types/Types.ts     # ActionItemT, PlanT, SettingsT, ThemeT, ...
└── utils/             # AsyncStorage handlers, Constants (storage keys), Helpers
```
Import aliases (`~components`, `~pages`, `~store`, `~types`, `~utils`, `~assets`) are defined in both `babel.config.js` and `tsconfig.json` — keep them in sync.

## Data model notes
- Storage keys: `action-list`, `today-plan`, `tomorrow-plan`, `settings` (`src/utils/Constants.ts`).
- Plans store `actionKeys` referencing actions; plan `date` is `toLocaleDateString()`. On load, a stale `today-plan` is replaced by `tomorrow-plan` if its date is today (day switch).
- `repeat` is a boolean: completing a repeating action re-adds a fresh copy.

## Commands
```bash
npx expo start          # dev server
npx tsc --noEmit        # type check (must be clean)
npx expo-doctor         # dependency/config health (must pass)
```
No tests yet.

## Deploying
Mobile only — never docker. Use `/deploy expo` (OTA, JS-only changes) or `/deploy apple` (native build → TestFlight).
`runtimeVersion` policy is `appVersion`, so bump `expo.version` in `app.json` for any native change.
Build numbers are remote + auto-incremented (`eas.json`); production builds use channel `production`.
`react-native-root-siblings` must stay on the same version `react-native-root-toast` depends on, or toasts won't render.

## Roadmap
A full design/flow makeover is planned but not started — see `docs/makeover-plan.md` (problems found, proposed redesign, phases, open decisions). Read it before any UI or data-model work.

## Do Not
- Do not add backend calls or auth
- Do not re-introduce Recoil (breaks on React 19) or add a second state library
