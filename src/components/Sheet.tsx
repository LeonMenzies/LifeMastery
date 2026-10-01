import { FC, ReactNode } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, { SlideInDown } from "react-native-reanimated";

import { AppText } from "~components/AppText";
import { MAX_CONTENT_WIDTH, radius, space, useTheme } from "~theme/Theme";

type SheetT = {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  // "page": a full native sheet (iOS pageSheet). "compact": a small card from the bottom for quick choices.
  variant?: "page" | "compact";
  action?: { label: string; onPress: () => void; disabled?: boolean };
  closeLabel?: string;
  footer?: ReactNode;
  scroll?: boolean;
};

export const Sheet: FC<SheetT> = ({ visible, onClose, title, children, variant = "page", action, closeLabel = "Close", footer, scroll = true }) => {
  const colors = useTheme();
  const insets = useSafeAreaInsets();
  const ios = Platform.OS === "ios";

  const header = (
    <View style={styles.header}>
      <Pressable accessibilityRole="button" onPress={onClose} hitSlop={10} style={styles.headerSide}>
        <AppText variant="headline" weight="400" tone="accent">
          {closeLabel}
        </AppText>
      </Pressable>
      <AppText variant="headline" numberOfLines={1} style={styles.headerTitle} accessibilityRole="header">
        {title}
      </AppText>
      <View style={[styles.headerSide, styles.headerRight]}>
        {action && (
          <Pressable accessibilityRole="button" accessibilityState={{ disabled: action.disabled }} onPress={action.disabled ? undefined : action.onPress} hitSlop={10}>
            <AppText variant="headline" color={action.disabled ? colors.textFaint : colors.accent}>
              {action.label}
            </AppText>
          </Pressable>
        )}
      </View>
    </View>
  );

  if (variant === "compact") {
    return (
      <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose} statusBarTranslucent>
        <GestureHandlerRootView style={styles.flex}>
          <Pressable style={[styles.flex, { backgroundColor: colors.backdrop }]} onPress={onClose} accessibilityLabel="Dismiss" />
          <Animated.View
            entering={SlideInDown.springify().damping(22)}
            style={[styles.compact, { backgroundColor: colors.surfaceRaised, paddingBottom: Math.max(insets.bottom, space.lg) }]}
          >
            <View style={[styles.grabber, { backgroundColor: colors.border }]} />
            <AppText variant="headline" style={styles.compactTitle} accessibilityRole="header">
              {title}
            </AppText>
            {children}
          </Animated.View>
        </GestureHandlerRootView>
      </Modal>
    );
  }

  const body = <View style={styles.body}>{children}</View>;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle={ios ? "pageSheet" : "fullScreen"} onRequestClose={onClose}>
      <GestureHandlerRootView style={[styles.flex, { backgroundColor: colors.background, paddingTop: ios ? 0 : insets.top }]}>
        {header}
        <KeyboardAvoidingView style={styles.flex} behavior={ios ? "padding" : undefined}>
          {scroll ? (
            <ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={{ paddingBottom: footer ? space.lg : insets.bottom + space.xxl }}>
              {body}
            </ScrollView>
          ) : (
            <View style={styles.flex}>{body}</View>
          )}
          {footer && <View style={[styles.footer, { paddingBottom: Math.max(insets.bottom, space.lg), borderTopColor: colors.border, backgroundColor: colors.background }]}>{footer}</View>}
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: space.lg,
    height: 56,
  },
  headerSide: {
    width: 90,
  },
  headerRight: {
    alignItems: "flex-end",
  },
  headerTitle: {
    flex: 1,
    textAlign: "center",
  },
  body: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    paddingHorizontal: space.lg,
    flex: 1,
  },
  footer: {
    paddingHorizontal: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  compact: {
    width: "100%",
    maxWidth: MAX_CONTENT_WIDTH,
    alignSelf: "center",
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    paddingHorizontal: space.xl,
    paddingTop: space.sm,
  },
  grabber: {
    width: 36,
    height: 5,
    borderRadius: 3,
    alignSelf: "center",
    marginBottom: space.md,
  },
  compactTitle: {
    textAlign: "center",
    marginBottom: space.lg,
  },
});
