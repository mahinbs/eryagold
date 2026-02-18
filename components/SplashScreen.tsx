import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, Image, Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { animations, palette, spacing } from "../constants/theme";

export default function SplashScreen() {
  const router = useRouter();

  // Animation values - reset on every mount
  const logoScale = useSharedValue(0);
  const logoOpacity = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineTranslate = useSharedValue(20);
  const loadingOpacity = useSharedValue(0);

  useEffect(() => {
    // Reset all animations to initial state
    logoScale.value = 0;
    logoOpacity.value = 0;
    taglineOpacity.value = 0;
    taglineTranslate.value = 20;
    loadingOpacity.value = 0;

    // Logo reveal animation
    logoScale.value = withSpring(1, animations.spring);
    logoOpacity.value = withTiming(1, { duration: animations.slow });

    // Tagline animation
    taglineOpacity.value = withDelay(600, withTiming(1, { duration: animations.slow }));
    taglineTranslate.value = withDelay(600, withSpring(0, animations.spring));

    // Loading indicator
    loadingOpacity.value = withDelay(1000, withTiming(1, { duration: animations.normal }));

    // Navigate after animation sequence
    const timer = setTimeout(() => {
      router.push("/login");
    }, 3500);

    return () => clearTimeout(timer);
  }, [router]);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const taglineAnimatedStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineTranslate.value }],
  }));

  const loadingAnimatedStyle = useAnimatedStyle(() => ({
    opacity: loadingOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.content}>
        {/* Logo Container */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require("../assets/eryaGold-logo1.png")}
            style={styles.logoImage}
            resizeMode="cover"
          />
          <Text style={styles.logoText}>Erya Gold</Text>
        </Animated.View>

        {/* Tagline with fade and slide */}
        <Animated.View style={taglineAnimatedStyle}>
          <Text style={styles.tagline}>A QUARRY OF GOLD JEWELLERY</Text>
          <Text style={styles.subtitle}>Where Heritage Meets Modern Elegance</Text>
        </Animated.View>

        {/* Loading Indicator */}
        <Animated.View style={[styles.loadingContainer, loadingAnimatedStyle]}>
          <ActivityIndicator size="small" color={palette.gold} />
          <Text style={styles.loadingText}>Loading...</Text>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F2D23", // Dark forest green to match logo background
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
  },
  logoContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 280,
    height: 250, // Increased height to accommodate text
    marginBottom: spacing.xl,
  },
  logoImage: {
    width: "100%",
    height: 180, // Adjusted height for image
    marginBottom: spacing.md,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "700",
    color: palette.gold,
    letterSpacing: 2,
    fontFamily: Platform.OS === "ios" ? "Didot" : "serif", // Elegant serif font
  },
  tagline: {
    fontSize: 16,
    fontWeight: "600",
    color: palette.champagne,
    letterSpacing: 4,
    marginBottom: spacing.sm,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    fontWeight: "400",
    color: "rgba(247, 231, 206, 0.7)",
    letterSpacing: 1.5,
    textAlign: "center",
    marginTop: spacing.xs,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
    position: "absolute",
    bottom: spacing.xl * 2,
  },
  loadingText: {
    fontSize: 12,
    color: "rgba(247, 231, 206, 0.6)",
    fontWeight: "400",
    letterSpacing: 1,
  },
});

