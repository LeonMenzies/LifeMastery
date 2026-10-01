import { FC, ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { AppText } from "~components/AppText";
import { MAX_CONTENT_WIDTH, space, useTheme } from "~theme/Theme";

type ScreenHeaderT = {
  title: string;
  subtitle?: string;
  right?: ReactNode;
};

export const ScreenHeader: FC<ScreenHeaderT> = ({ title, subtitle, right }) => (
  <View style={styles.header}>
    <View style={styles.headerText}>
      {subtitle ? (
        <AppText variant="footnote" weight="600" tone="muted" style={styles.subtitle}>
          {subtitle}
        </AppText>
      ) : null}
      <AppText variant="largeTitle" accessibilityRole="header" numberOfLines={1} adjustsFontSizeToFit>
        {title}
      </AppText>
    </View>
    {right && <View style={styles.right}>{right}</View>}
  </View>
);

// Page shell: safe area on top, centred column that stops growing on iPad.
export const Screen: FC<{ children: ReactNode }> = ({ children }) => {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: insets.top }]}>
      <View style={styles.column}>{children}</View>
    </View>
  );
};

export const contentPadding = { paddingHorizontal: space.lg };

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  column: {
    flex: 1,
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    paddingBottom: space.md,
    gap: space.md,
  },
  headerText: {
    flex: 1,
  },
  subtitle: {
    textTransform: "uppercase",
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  right: {
    flexDirection: "row",
    gap: space.sm,
    paddingBottom: 4,
  },
});
