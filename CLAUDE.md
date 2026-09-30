# CLAUDE.md — LifeMastery

## Project Overview
**LifeMastery** — personal daily-planning app (React Native / Expo). Local-first, no backend.
Add **actions** (task + time estimate + priority + area of importance), build a **plan** for Today or Tomorrow from them, and track completion on Home.

## Tech Stack
- **Expo 52**, React Native 0.76, TypeScript
- **Recoil** — state (atoms in `src/recoil/`)
- **AsyncStorage** — all persistence, via handlers in `src/utils/*Handler.ts`
- Navigation is a custom bottom menu driven by `navigatorAtom` (`src/components/navigator/`) — expo-router is installed but not used
- iOS bundle ID `com.leonmenzies.LifeMastery`; EAS project `c661cead-b01d-49a6-94ba-1e01d55965ae` (account `leonmenzies`)

## Structure
```
App.js                 # RecoilRoot + Navigator
src/
├── components/        # Shared inputs/buttons, ActionAddEdit modal, navigator/
├── pages/             # Home, Plan, ActionsList, AreasOfImportance (modal), Settings
├── recoil/            # Atoms
├── types/Types.ts     # ActionItemT, PlanT, SettingsT, ThemeT, ...
└── utils/             # AsyncStorage handlers, Constants (storage keys), Helpers
```
Import aliases (`~components`, `~pages`, `~recoil`, `~types`, `~utils`, `~assets`) are defined in both `babel.config.js` and `tsconfig.json` — keep them in sync.

## Data model notes
- Storage keys: `action-list`, `today-plan`, `tomorrow-plan`, `settings` (`src/utils/Constants.ts`).
- Plans store `actionKeys` referencing actions; plan `date` is `toLocaleDateString()`. On load, a stale `today-plan` is replaced by `tomorrow-plan` if its date is today (day switch).
- `repeat` is a boolean: completing a repeating action re-adds a fresh copy.

## Commands
```bash
npx expo start          # dev server
npx tsc --noEmit        # type check (must be clean)
```
No tests yet.

## Deploying
Mobile only — never docker. Use `/deploy expo` (OTA, JS-only changes) or `/deploy apple` (native build → TestFlight).
`runtimeVersion` policy is `appVersion`, so bump `expo.version` in `app.json` for any native change.

## Do Not
- Do not add backend calls or auth
- Do not introduce a second state library alongside Recoil (if migrating, replace it fully)
