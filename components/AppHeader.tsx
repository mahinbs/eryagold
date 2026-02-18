import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { memo } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { palette, spacing, typography } from "../constants/theme";

type AppHeaderProps = {
  onMenuPress?: () => void;
  icon?: "menu" | "back";
  showSearch?: boolean;
  showWishlist?: boolean;
  showCart?: boolean;
};

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

function AppHeaderComponent({ 
  onMenuPress, 
  icon = "menu",
  showSearch = true,
  showWishlist = true,
  showCart = true,
}: AppHeaderProps) {
  const router = useRouter();
  const iconName = icon === "back" ? "chevron-left" : "menu";
  const searchScale = useSharedValue(1);
  const wishlistScale = useSharedValue(1);
  const cartScale = useSharedValue(1);

  const handleMenuPress = () => {
    if (onMenuPress) {
      onMenuPress();
    }
  };

  const handleSearchPress = () => {
    // TODO: Navigate to search screen
    searchScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  };

  const handleWishlistPress = () => {
    router.push("/(tabs)/wishlist");
    wishlistScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  };

  const handleCartPress = () => {
    router.push("/(tabs)/cart");
    cartScale.value = withSequence(
      withTiming(0.95, { duration: 100 }),
      withSpring(1, { damping: 10, stiffness: 200 })
    );
  };

  const searchAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: searchScale.value }],
  }));

  const wishlistAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: wishlistScale.value }],
  }));

  const cartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: cartScale.value }],
  }));

  const iconButton =
    onMenuPress != null ? (
      <AnimatedTouchable 
        style={styles.iconButton} 
        onPress={handleMenuPress}
        activeOpacity={0.7}
      >
        <Feather name={iconName} size={22} color={palette.textPrimary} />
      </AnimatedTouchable>
    ) : (
      <View style={[styles.iconButton, { opacity: 0.3 }]}>
        <Feather name={iconName} size={22} color={palette.textPrimary} />
      </View>
    );

  return (
    <View style={styles.container}>
      {iconButton}
      <View style={styles.logoContainer}>
        <Text style={styles.logoText}>Erya Gold</Text>
      </View>
      <View style={styles.headerActions}>
        {showSearch && (
          <AnimatedTouchable 
            style={[styles.iconButton, searchAnimatedStyle]} 
            onPress={handleSearchPress}
            activeOpacity={0.7}
          >
            <Feather name="search" size={20} color={palette.textPrimary} />
          </AnimatedTouchable>
        )}
        {showWishlist && (
          <AnimatedTouchable 
            style={[styles.iconButton, wishlistAnimatedStyle]} 
            onPress={handleWishlistPress}
            activeOpacity={0.7}
          >
            <Feather name="heart" size={20} color={palette.textPrimary} />
          </AnimatedTouchable>
        )}
        {showCart && (
          <AnimatedTouchable 
            style={[styles.iconButton, cartAnimatedStyle]} 
            onPress={handleCartPress}
            activeOpacity={0.7}
          >
            <Feather name="shopping-bag" size={20} color={palette.textPrimary} />
          </AnimatedTouchable>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: palette.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 22,
  },
  logoContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    ...typography.h3,
    color: palette.gold,
    letterSpacing: 1,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.xs,
  },
});

export const AppHeader = memo(AppHeaderComponent);

