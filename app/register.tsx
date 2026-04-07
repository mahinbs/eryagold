import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Image, KeyboardAvoidingView, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import LuxuryButton from "../components/LuxuryButton";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";
import { supabase } from "../supabase/client";
import { useToast } from "../utils/toast";

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const ringsOpacity = useSharedValue(0);
  const ringsScale = useSharedValue(0.9);
  const formOpacity = useSharedValue(0);
  const formTranslate = useSharedValue(40);
  const buttonsOpacity = useSharedValue(0);

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    titleTranslate.value = withSpring(0, { damping: 15, stiffness: 100 });

    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

    ringsOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    ringsScale.value = withDelay(400, withSpring(1, { damping: 10, stiffness: 80 }));

    formOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));
    formTranslate.value = withDelay(600, withSpring(0, { damping: 15, stiffness: 100 }));

    buttonsOpacity.value = withDelay(800, withTiming(1, { duration: 600 }));
  }, []);

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const { showToast } = useToast();

  const handleRegister = async () => {
    if (!profile.fullName || !profile.email || !profile.password || !profile.confirmPassword) {
      showToast("Please fill in all fields.", "error");
      return;
    }

    if (profile.password !== profile.confirmPassword) {
      showToast("Passwords do not match.", "error");
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email: profile.email,
      password: profile.password,
      options: {
        data: {
          full_name: profile.fullName,
          phone: profile.phone,
        },
      },
    });

    if (error) {
      if (error.status === 429) {
        showToast("Too many attempts. Please try again in an hour.", "error");
      } else {
        showToast(error.message, "error");
      }
      setLoading(false);
    } else {
      showToast("Registration successful! Verify your email.", "success");
      // Instead of direct home navigation, go to OTP verification
      router.push({
        pathname: "/verify-otp",
        params: { 
          email: profile.email,
        }
      });
    }
  };

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const ringsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: ringsOpacity.value,
    transform: [{ scale: ringsScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    opacity: formOpacity.value,
    transform: [{ translateY: formTranslate.value }],
  }));

  const buttonsAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonsOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <Animated.View style={[styles.header, titleAnimatedStyle]}>
            <Text style={styles.title}>Create Account</Text>
          </Animated.View>

          <Animated.View style={subtitleAnimatedStyle}>
            <Text style={styles.subtitle}>Join the world of exquisite jewellery</Text>
          </Animated.View>

          {/* Rings Image */}
          <Animated.View style={[styles.ringsContainer, ringsAnimatedStyle]}>
            <Image
              source={require("../assets/eryaGold-logo1.png")}
              style={styles.ringsImage}
              resizeMode="cover"
            />
          </Animated.View>

          {/* Form */}
          <Animated.View style={[styles.form, formAnimatedStyle]}>
            {[
              { key: "fullName", label: "Full name", placeholder: "Enter your name" },
              {
                key: "email",
                label: "Email",
                placeholder: "stylist@eryagold.com",
                keyboardType: "email-address" as const,
              },
              { key: "phone", label: "Phone", placeholder: "Enter your phone", keyboardType: "phone-pad" as const },
            ].map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  value={profile[field.key as keyof typeof profile]}
                  onChangeText={(value) =>
                    handleChange(field.key as keyof typeof profile, value)
                  }
                  placeholder={field.placeholder}
                  placeholderTextColor={palette.textSecondary}
                  keyboardType={field.keyboardType}
                  autoCapitalize={field.key === "email" ? "none" : "words"}
                  style={styles.input}
                />
              </View>
            ))}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                value={profile.password}
                onChangeText={(value) => handleChange("password", value)}
                placeholder="Create a secure password"
                placeholderTextColor={palette.textSecondary}
                secureTextEntry
                style={styles.input}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                value={profile.confirmPassword}
                onChangeText={(value) => handleChange("confirmPassword", value)}
                placeholder="Confirm your password"
                placeholderTextColor={palette.textSecondary}
                secureTextEntry
                style={styles.input}
              />
            </View>
          </Animated.View>

          {/* Buttons */}
          <Animated.View style={[styles.buttonContainer, buttonsAnimatedStyle]}>
            <LuxuryButton
              title="Create Account"
              onPress={handleRegister}
              variant="primary"
              size="large"
              fullWidth
            />

            <Text style={styles.footerText}>
              Already have an account?{" "}
              <Link href="/login">
                <Text style={styles.link}>Sign in</Text>
              </Link>
            </Text>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.white,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    padding: spacing.lg,
    gap: spacing.md,
    paddingBottom: spacing.xxl,
  },
  header: {
    alignItems: "center",
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: palette.textPrimary, // Charcoal
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: "center",
    marginBottom: spacing.lg,
  },
  ringsContainer: {
    width: 200,
    height: 200,
    alignSelf: "center",
    borderRadius: radius.full,
    overflow: "hidden",
    marginBottom: spacing.lg,
    ...shadow.elevated,
    borderWidth: 1,
    borderColor: palette.goldChampagne,
  },
  ringsImage: {
    width: "100%",
    height: "100%",
  },
  form: {
    gap: spacing.lg,
    marginBottom: spacing.lg,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  label: {
    ...typography.bodySmall,
    color: palette.textPrimary,
    fontWeight: "500",
  },
  input: {
    backgroundColor: palette.white,
    color: palette.textPrimary,
    borderRadius: radius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    ...typography.body,
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
    color: palette.gold,
    fontWeight: "600",
  },
});
