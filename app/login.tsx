import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue
} from "react-native-reanimated";
import LuxuryButton from "../components/LuxuryButton";
import { supabase } from "../supabase/client";
import { palette, radius, spacing, typography } from "../constants/theme";
import { fadeIn, slideUp } from "../utils/animations";
import { useToast } from "../utils/toast";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Animation values
  const headerOpacity = useSharedValue(0);
  const headerTranslate = useSharedValue(20);
  const formOpacity = useSharedValue(0);
  const formTranslate = useSharedValue(30);

  useEffect(() => {
    // Staggered entrance animations
    headerOpacity.value = fadeIn(0);
    headerTranslate.value = slideUp(0);
    formOpacity.value = fadeIn(200);
    formTranslate.value = slideUp(200);
  }, []);

  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();

  const handleLogin = async () => {
    if (!email || !password) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      showToast(error.message, "error");
      setLoading(false);
    } else {
      showToast("Signed in successfully", "success");
      router.replace("/(tabs)/home");
    }
  };

  const headerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: headerOpacity.value,
    transform: [{ translateY: headerTranslate.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslate.value }],
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <View style={styles.content}>
          {/* Logo */}
          <Animated.View style={[styles.logoContainer, headerAnimatedStyle]}>
            <Image
              source={require("../assets/eryaGold-logo1.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </Animated.View>

          {/* Header */}
          <Animated.View style={[styles.header, headerAnimatedStyle]}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to continue curating your dream jewellery wardrobe.
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, formAnimatedStyle]}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="stylist@eryagold.com"
                placeholderTextColor={palette.textSecondary}
                keyboardType="email-address"
                autoCapitalize="none"
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter secure passcode"
                placeholderTextColor={palette.textSecondary}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <Text style={styles.forgotPassword}>Forgot password?</Text>
          </Animated.View>

          {/* Buttons */}
          <Animated.View style={[styles.buttonContainer, formAnimatedStyle]}>
            <LuxuryButton
              title={loading ? "Signing In..." : "Sign In"}
              onPress={handleLogin}
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            />

            <LuxuryButton
              title="Continue with WhatsApp"
              onPress={() => { }}
              variant="outline"
              size="large"
              fullWidth
            />

            <Text style={styles.footerText}>
              New to the maison?{" "}
              <Link href="/register">
                <Text style={styles.link}>Create profile</Text>
              </Link>
            </Text>
          </Animated.View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white, // White background
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    gap: spacing.xl,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: spacing.md,
  },
  logo: {
    width: 280,
    height: 100,
  },
  header: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  title: {
    ...typography.h1,
    color: palette.green, // Deep green text
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary, // Gray
    lineHeight: 22,
  },
  form: {
    gap: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: palette.green, // Deep green labels
    fontWeight: "400",
  },
  input: {
    backgroundColor: palette.white, // White
    color: palette.textPrimary, // Deep green text
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    ...typography.body,
  },
  forgotPassword: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "right",
    marginTop: -spacing.sm,
  },
  buttonContainer: {
    gap: spacing.md,
    marginTop: spacing.md,
  },
  footerText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  link: {
    color: palette.gold, // Gold link
    fontWeight: "600",
  },
});
