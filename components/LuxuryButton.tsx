import * as Haptics from "expo-haptics";
import React, { ReactNode } from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { animations, palette, radius, spacing } from "../constants/theme";

type LuxuryButtonProps = {
  title: string;
  onPress: () => void;
  variant?: "primary" | "secondary" | "outline";
  size?: "small" | "medium" | "large";
  disabled?: boolean;
  icon?: ReactNode;
  fullWidth?: boolean;
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function LuxuryButton({
  title,
  onPress,
  variant = "primary",
  size = "medium",
  disabled = false,
  icon,
  fullWidth = false,
}: LuxuryButtonProps) {
  const scale = useSharedValue(1);

  const glowOpacity = useSharedValue(0);

  const handlePressIn = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withSpring(0.97, animations.spring);
    // Soft glow on press
    glowOpacity.value = withTiming(0.4, { duration: animations.buttonGlow });
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1, animations.spring);
    glowOpacity.value = withTiming(0, { duration: animations.buttonGlow });
  };

  const handlePress = () => {
    if (disabled) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));


  const buttonStyles = [
    styles.button,
    styles[`button_${variant}`],
    styles[`button_${size}`],
    fullWidth && styles.buttonFullWidth,
    disabled && styles.buttonDisabled,
  ];

  const textStyles = [
    styles.text,
    styles[`text_${variant}`],
    styles[`text_${size}`],
  ];

  return (
    <AnimatedPressable
      onPress={handlePress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      style={[buttonStyles, animatedStyle]}
    >
      {/* Soft glow overlay for gold buttons */}
      {variant === "primary" && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            {
              backgroundColor: palette.gold,
              borderRadius: radius.full,
            },
            glowStyle,
          ]}
        />
      )}
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={textStyles}>{title}</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: radius.full,
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  button_primary: {
    backgroundColor: palette.gold, // Gold button
    // Gold gradient effect (subtle)
    shadowColor: palette.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  button_secondary: {
    backgroundColor: palette.charcoal,
  },
  button_outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: palette.gold,
  },
  button_small: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    minHeight: 40,
  },
  button_medium: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    minHeight: 52,
  },
  button_large: {
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    minHeight: 64,
  },
  buttonFullWidth: {
    width: "100%",
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.sm,
    zIndex: 1,
  },
  iconContainer: {
    marginRight: spacing.xs,
  },
  text: {
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  text_primary: {
    color: palette.white, // White text on gold
  },
  text_secondary: {
    color: palette.white,
  },
  text_outline: {
    color: palette.gold, // Gold text
  },
  text_small: {
    fontSize: 14,
  },
  text_medium: {
    fontSize: 16,
  },
  text_large: {
    fontSize: 18,
  },
});

