import { FC } from "react";
import { StyleSheet, View } from "react-native";

import { AppText } from "~components/AppText";
import { Card } from "~components/Card";
import { Sheet } from "~components/Sheet";
import { useDataStore } from "~store/dataStore";
import { space, useAreaColor, useTheme } from "~theme/Theme";
import { addDays, formatDayMonth, formatShortDate } from "~utils/Dates";
import { formatDuration } from "~utils/Helpers";
import { completionRate, streak, weekBalance } from "~utils/PlanLogic";

type BalanceT = { visible: boolean; onClose: () => void };

export const Balance: FC<BalanceT> = ({ visible, onClose }) => {
  const colors = useTheme();
  const areaColor = useAreaColor();
  const areas = useDataStore((s) => s.areas);
  const actions = useDataStore((s) => s.actions);
  const history = useDataStore((s) => s.history);
  const today = useDataStore((s) => s.today);

  if (!visible) return null;

  const balance = weekBalance(history, today, actions, areas);
  const rate = completionRate(history, today.date);
  const days = streak(history, today, actions);
  const scaleMax = Math.max(60, ...balance.rows.map((r) => Math.max(r.minutes, r.targetMinutes)));
  const recent = history.slice(0, 14);

  return (
    <Sheet visible={visible} onClose={onClose} title="Balance" closeLabel="Done">
      <View style={styles.tiles}>
        <Tile value={`${days}`} unit={days === 1 ? "day" : "days"} label="Streak" />
        <Tile value={rate === null ? "–" : `${Math.round(rate)}%`} label="Done, last 7 days" />
        <Tile value={formatDuration(balance.totalMinutes)} label="This week" />
      </View>

      <AppText variant="footnote" weight="600" tone="muted" style={styles.sectionLabel}>
        THIS WEEK BY AREA · FROM {formatDayMonth(balance.weekStart).toUpperCase()}
      </AppText>
      <Card>
        {balance.rows.length === 0 && (
          <AppText variant="callout" tone="muted">
            Add areas of importance to see how your time is balanced.
          </AppText>
        )}
        {balance.rows.map((row, i) => {
          const area = areas.find((a) => a.id === row.areaId);
          const color = areaColor(area?.color);
          return (
            <View key={row.areaId || "none"} style={[styles.row, i > 0 && styles.rowGap]} accessible accessibilityLabel={`${area?.name || "No area"}: ${formatDuration(row.minutes)}${row.targetMinutes ? ` of ${formatDuration(row.targetMinutes)} target` : ""}`}>
              <View style={styles.rowText}>
                <AppText variant="callout" weight="600" style={styles.flex} numberOfLines={1}>
                  {area?.name || "No area"}
                </AppText>
                <AppText variant="footnote" tone="muted" style={styles.tabular}>
                  {formatDuration(row.minutes)}
                  {row.targetMinutes ? ` / ${formatDuration(row.targetMinutes)}` : ""}
                </AppText>
              </View>
              <View style={[styles.track, { backgroundColor: colors.fill }]}>
                {row.minutes > 0 && <View style={[styles.fill, { width: `${(row.minutes / scaleMax) * 100}%`, backgroundColor: color }]} />}
                {row.targetMinutes > 0 && <View style={[styles.target, { left: `${(row.targetMinutes / scaleMax) * 100}%`, backgroundColor: colors.text }]} />}
              </View>
            </View>
          );
        })}
        {balance.rows.length > 0 && (
          <AppText variant="footnote" tone="faint" style={styles.note}>
            Completed time only. The dark tick marks an area's weekly target, which you can set under Actions → Areas.
          </AppText>
        )}
      </Card>

      <AppText variant="footnote" weight="600" tone="muted" style={styles.sectionLabel}>
        RECENT DAYS
      </AppText>
      <Card padded={false}>
        {recent.length === 0 ? (
          <AppText variant="callout" tone="muted" style={styles.empty}>
            Finished days will show up here.
          </AppText>
        ) : (
          recent.map((day, i) => {
            const done = day.items.filter((it) => it.done);
            const allDone = done.length === day.items.length;
            return (
              <View key={day.date} style={[styles.day, i > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: colors.border }]}>
                <View style={styles.flex}>
                  <AppText variant="body">{day.date === addDays(today.date, -1) ? "Yesterday" : formatShortDate(day.date)}</AppText>
                  {day.focus ? (
                    <AppText variant="footnote" tone="muted" numberOfLines={1}>
                      {day.focus}
                    </AppText>
                  ) : null}
                </View>
                <View style={styles.dayRight}>
                  <AppText variant="callout" weight="600" tone={allDone ? "success" : "default"}>
                    {done.length}/{day.items.length}
                  </AppText>
                  <AppText variant="footnote" tone="muted">
                    {formatDuration(done.reduce((s, it) => s + it.minutes, 0))}
                  </AppText>
                </View>
              </View>
            );
          })
        )}
      </Card>
    </Sheet>
  );
};

const Tile: FC<{ value: string; unit?: string; label: string }> = ({ value, unit, label }) => (
  <Card style={styles.tile}>
    <AppText variant="title" style={styles.tabular} adjustsFontSizeToFit numberOfLines={1}>
      {value}
      {unit ? (
        <AppText variant="callout" tone="muted">
          {" "}
          {unit}
        </AppText>
      ) : null}
    </AppText>
    <AppText variant="footnote" tone="muted">
      {label}
    </AppText>
  </Card>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  tabular: {
    fontVariant: ["tabular-nums"],
  },
  tiles: {
    flexDirection: "row",
    gap: space.sm,
    marginTop: space.md,
  },
  tile: {
    flex: 1,
    padding: space.md,
    gap: 2,
  },
  sectionLabel: {
    marginTop: space.xxl,
    marginBottom: space.sm,
    letterSpacing: 0.5,
  },
  row: {
    gap: space.sm,
  },
  rowGap: {
    marginTop: space.lg,
  },
  rowText: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: space.sm,
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  fill: {
    height: 8,
    borderRadius: 4,
    maxWidth: "100%",
  },
  target: {
    position: "absolute",
    top: -3,
    width: 2,
    height: 14,
    marginLeft: -1,
    borderRadius: 1,
  },
  note: {
    marginTop: space.lg,
  },
  empty: {
    padding: space.lg,
  },
  day: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    gap: space.md,
  },
  dayRight: {
    alignItems: "flex-end",
  },
});
