import { forwardRef } from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

import { AppText } from "~components/AppText";
import { radius, space, type, useTheme } from "~theme/Theme";

type TextFieldT = TextInputProps & {
  label?: string;
  hint?: string;
};

export const TextField = forwardRef<TextInput, TextFieldT>(({ label, hint, style, ...props }, ref) => {
  const colors = useTheme();

  return (
    <View style={styles.container}>
      {label && (
        <AppText variant="footnote" weight="600" tone="muted" style={styles.label}>
          {label}
        </AppText>
      )}
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.textFaint}
        selectionColor={colors.accent}
        {...props}
        style={[type.body, styles.input, { color: colors.text, backgroundColor: colors.surface, borderColor: colors.border }, style]}
      />
      {hint && (
        <AppText variant="footnote" tone="faint" style={styles.hint}>
          {hint}
        </AppText>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  label: {
    marginBottom: space.sm,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: space.md,
    paddingVertical: space.md,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  hint: {
    marginTop: space.xs,
  },
});
