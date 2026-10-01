# LifeMastery — Makeover Plan

Status: **implemented on branch `makeover` (v1.2.0), 2026-10-01. Not yet built or shipped.**

What was decided:
- Keep the original flows: 4 tabs (Home is now labelled "Today"), pick actions with a 1–9 priority, Finalize today's plan, tick off on Today. The redesign is visual and explanatory, not a new flow.
- Problem 3 (going over Max Plan Time wipes the plan) is **intentional** and kept. The Plan screen now shows a time budget bar and warns before you finalize.
- Kept "Areas of importance", the Finalize lock and the 1–9 priorities (priority now lives on the plan, chosen from a 1–9 grid). No react-navigation: the custom tab bar was kept, now safe-area aware.
- Tomorrow's plan saves automatically and becomes today's plan at midnight, ready to finalize. It can't be finalized ahead of time, same as before.
- All four phases were done in one go, with no mockup first.
- The area palette is now a validated 8-colour set (max 8 areas, previously 9). Migrated v1 colours map slot for slot.

The original proposal follows, kept for reference.

The core idea is good: plan each day against the areas of your life that matter, within a time budget. The execution is a 2023 prototype with real bugs. The biggest gap is that **finished days are overwritten and never kept**, so an app about balancing your life can't show you your balance.

---

## 1. Worst problems (fix regardless of redesign)

| # | Problem | Where |
|---|---|---|
| 1 | **Settings screen loops forever.** The effect that loads settings depends on `[settings]`, and loading them replaces the object, so it runs again. The screen keeps reading storage and re-rendering the whole time it's open. | `src/pages/Settings/Settings.tsx` |
| 2 | **Brand-new users hit a dead end.** An action needs an area, the add form doesn't say where to create one (hidden behind an unlabelled ⋯ icon on the Actions tab), and Home only says "No Plan Finalized For Today", with no button. | first-run flow |
| 3 | **Going over the time limit wipes the plan.** If planned hours exceed Max Plan Time, Finalize clears the whole selection ("lets try again"). | `src/pages/Plan/PlanCard.tsx` `handleFinalize` |
| 4 | **Plan picks aren't saved.** Today's selections are lost on tab or screen switch before Finalize. Tomorrow uses a separate "Save" button instead, so the tabs behave differently. | Plan |
| 5 | **The day rollover is fragile.** Yesterday's unfinished actions silently drop (no carry-over). `tomorrow-plan` becomes today's but is never moved or cleared. Dates are `toLocaleDateString()` strings, so date sorting breaks on non-US region settings (e.g. NZ `30/09/2026` → Invalid Date). | `src/utils/PlanHandler.ts`, `Helpers.ts`, `ActionsList.tsx` sort |
| 6 | **Data loss.** Over 1000 actions, `addAction` silently deletes the oldest. Every completed repeating action adds another copy, so you reach the limit faster. | `src/utils/ActionsHandler.ts` |
| 7 | **Areas are linked by name.** Actions store the area's name, not an ID. You can't rename an area. Deleting one blanks `areaOfImportance` on its actions, and those actions then vanish from Home (`HomeActionSection` filters by name) while still counting toward the total and %. The same `>=` array-comparison bug as the one fixed in `deleteActions` also exists in `deleteAreaOfImportance`. | `src/utils/AreasOfImportanceHandler.ts` |
| 8 | **Destructive buttons don't ask first.** "Clear Action", "Clear Todays Plan" and "Clear Tomorrows Plan" wipe data in one tap. | Settings |
| 9 | **The time picker contradicts itself.** The hours slider goes 0–12, but anything over 9h is rejected. Action names are capped at 30 characters. | `src/components/ActionAddEdit.tsx` |
| 10 | **The layout is hard-coded.** `height - 100`, `paddingTop: 50` and a 100px tab bar instead of safe areas, which breaks around the Dynamic Island and home indicator. `Dimensions` is read at render, so it doesn't respond to rotation. `supportsTablet: true`, but iPad gets a stretched phone layout. | `src/components/navigator/` |

Minor: `try/catch` around promise chains never catches async errors. Toast typos: "reas of importance must be unique" and "ailed to add Area Of Importance".

## 2. Design and UX problems

- **The interface is dated.** Yellow outlined buttons, a 100px tab bar, bare text rows, a crooked "Day is Finalized" stamp (rotated 30°). There are no cards, no consistent type scale and no spacing system.
- **Key actions are hidden.** Delete is long-press → multi-select, reordering areas is long-press on a Home section (this conflicts with checkbox taps), and area management is behind ⋯ on Actions. The last tab's internal key is `areasOfImportance`, but it shows Settings.
- **Priority is awkward.** Adding an item to a plan opens a 1–9 number pop-up every time. Priority is stored on the action itself, not per plan. Tapping a planned item removes it straight away (no undo) and resets its priority to 0.
- **Status is shown only by colour.** 3px green (in plan / completed) and blue (repeat) bars. Icon buttons have no accessibility labels, tap targets are small, and there's no Dynamic Type support.
- **Dark mode is half-built.** It's a manual toggle and ignores the system appearance. `textSecondary` is black on a navy background. The settings labels flip to show the current state ("Light Mode" / "Dark Mode", "Time Complete" / "Tasks Complete") instead of naming the setting.
- **Too many toasts.** Every save shows a "Successfully…" message.
- **No haptics or motion** apart from the progress bar.
- **Autocomplete shows duplicates** (repeat copies) and uses Levenshtein distance over every action on each keystroke.
- **Unused packages and leftovers:** `react-native-swipeable-item` (installed, unused), `RepeatSelector` + `RepearSelectorButton` (weekday repeat, unfinished), `PlanFocusModal` ("key focus", unfinished), `src/assets/TimeMastery.png`.

## 3. Proposed makeover

### Navigation: 3 tabs plus native sheets (react-navigation bottom tabs + native-stack `formSheet`)

**Today**
- Date, a progress ring, and an optional *one key focus* for the day (reviving the `PlanFocusModal` idea).
- Actions grouped by area. Tap to complete (haptic + strike-through animation), swipe to push to tomorrow.
- Empty state: one clear "Plan your day" button.

**Plan**
- A single flow for Today and Tomorrow that **saves automatically**. No separate Save / Finalize buttons.
- A time-budget bar showing planned vs available hours. It turns amber when you're over, warns, and **never wipes**.
- Pick from the backlog grouped by area. **Drag to set the order** instead of typing 1–9 priority numbers. The order is stored on the plan, not the action.
- "Start my day" locks the plan (optional, see decisions), and you can edit it again at any time.

**Library**
- All actions: search, area filter chips, and a quick-add bar at the top.
- Swipe to edit or delete, with **undo**.
- Areas get a proper screen: rename, colour, icon, and weekly target hours.

**Settings** moves behind a gear icon in the header. It follows the system theme, asks before destructive actions, and holds notifications and backup.

### New features that deliver on the "Life Mastery" idea

1. **History and a Balance view:** keep every finished day. Show hours per area this week against the targets, plus streaks and completion rate.
2. **Proper repeats:** per-weekday schedules (finishing `RepeatSelector`). A repeating action is stored once as a template and generates each day's copy, instead of cloning itself on completion.
3. **End-of-day review:** "3 left, move to tomorrow?". This fixes the rollover problem through the UI.
4. **Notifications:** "Plan tomorrow" in the evening, "Here's your day" in the morning (`expo-notifications`).
5. **First-run setup:** pick 3–5 starter areas (Health, Work, Relationships…), then add your first action.
6. **Backup:** export and import as JSON, since all the data lives only on the phone.

### Visual direction

Calm and modern:
- System font with a clear type scale. Spacing and radius tokens.
- Soft cards on a neutral background, with each area's colour as the accent.
- Dark mode designed properly, as its own palette.
- Motion via Reanimated 4 (already installed): layout animations, completion feedback. Haptics via `expo-haptics`.
- Safe areas everywhere, plus a two-column layout on iPad.

## 4. Technical foundation

- **Data model v2**, persisted via Zustand `persist` + AsyncStorage with a schema `version`:
  - Areas have stable IDs; actions reference `areaId`.
  - Dates are ISO `YYYY-MM-DD` (local day), not locale strings.
  - Plans are kept by date (`plans["2026-09-30"]`), so history survives. The plan holds its ordered action IDs plus completion state for that day.
  - Repeating actions are templates (weekday mask), and each day gets a generated copy.
- **Migration from v1 must keep existing data.** v1 keys: `action-list`, `aol-list` (areas; note the typo is the real key), `today-plan`, `tomorrow-plan`, `settings`.
  - Map area names to new IDs.
  - Parse locale dates carefully: try en-US, fall back to the date the item was added.
  - Merge duplicate repeat copies into one template.
- **Tests (jest)** for the migration, day rollover, the time budget and the repeat generator.

## 5. Build order

| Phase | Contents | Ships via |
|---|---|---|
| **1. Foundation** | Data model v2 + migration + tests. react-navigation tabs and sheets. Design tokens and theme (system appearance). Safe areas. `expo-haptics`. Fix problems 1, 3, 5, 6, 7 and 8. | **TestFlight** (new native packages: bump `expo.version` to 1.2.0) |
| **2. Today and Plan** | Redesigned screens, auto-save, time budget, drag to order, carry-over / end-of-day review, key focus | OTA (`/deploy expo`) |
| **3. Library and Areas** | Search, filters, swipe with undo, area editor, weekday repeats, first-run setup | OTA |
| **4. Insights** | Balance and history, streaks, notifications, JSON backup | **TestFlight** (`expo-notifications` is native) |

Put every native package needed later (haptics, notifications, any others) into phase 1's build where possible, so phases 2–4 can go out OTA.

Optional before phase 1: a clickable HTML mockup of Today, Plan and Library, in light and dark, to settle the look first.

## 6. Open decisions

1. **Naming:** keep "Areas of Importance", or use "Areas" / "Life areas"? Is "LifeMastery" staying as the app name?
2. **Locking the day:** keep a "Start my day" lock, or drop it and always allow editing?
3. **Priority:** OK to replace 1–9 priority numbers with drag-to-order?
4. **Scope:** all four phases, or phases 1 and 2 first and then review?
5. **Mockup first?** Yes or no.

## 7. State at time of writing

- Branch `lifemastery-cleanup` (SDK 57 upgrade + cleanup) is pushed but **not merged to `main`**.
- v1.1.0 (build 3) is built and submitted to TestFlight.
- **New app icon is committed but not shipped yet.** It's the multicolour progress ring on blue (#0327C7), used for the iOS icon, the Android icon, the splash screen and the favicon. The source image (1254×1254 from ChatGPT) was resized to 1024. It goes out with the phase 1 TestFlight build; the leftover `src/assets/splash.png` and `src/assets/TimeMastery.png` are unused and can be deleted then.
- `eas.json` has no `submit.production.ios.ascAppId`. Adding it (App Store Connect → App Information → Apple ID) lets `/deploy apple` run without you.
