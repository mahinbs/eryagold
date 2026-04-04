import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { AppHeader } from "../components/AppHeader";
import LuxuryButton from "../components/LuxuryButton";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";
import { supabase } from "../supabase/client";
import { useToast } from "../utils/toast";

export default function VerifyOtp() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string || "";
  const contact = email || "your email";

  const [otp, setOtp] = useState(new Array(8).fill(""));
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);

  const inputRefs = useRef<TextInput[]>([]);

  // Animation values
  const titleOpacity = useSharedValue(0);
  const titleTranslate = useSharedValue(20);
  const subtitleOpacity = useSharedValue(0);
  const inputOpacity = useSharedValue(0);
  const inputTranslate = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);

  const { showToast } = useToast();

  useEffect(() => {
    titleOpacity.value = withTiming(1, { duration: 600 });
    titleTranslate.value = withSpring(0, { damping: 15, stiffness: 100 });
    subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));
    inputOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
    inputTranslate.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));
    buttonOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

    startTimer();
  }, []);

  const startTimer = () => {
    setIsResendDisabled(true);
    setTimer(30);
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setIsResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return interval;
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 8) {
      showToast("Please enter the full 8-digit code.", "error");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email,
        token: enteredOtp,
        type: 'signup',
      });

      if (error) throw error;

      showToast("Account verified successfully!", "success");
      router.replace("/(tabs)/home");
    } catch (error: any) {
      showToast(error.message || "Invalid code.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      });
      if (error) throw error;
      showToast("Code resent successfully.", "success");
      startTimer();
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleChangeOtp = (text: string, index: number) => {
    const newOtp = [...otp];
    
    // Check for paste (more than 1 char)
    if (text.length > 1) {
      const pastedData = text.slice(0, 8).split("");
      pastedData.forEach((char, i) => {
        if (index + i < 8) newOtp[index + i] = char;
      });
      setOtp(newOtp);
      // Small timeout to ensure state update and then focus
      setTimeout(() => {
        const nextIndex = Math.min(index + pastedData.length, 7);
        inputRefs.current[nextIndex]?.focus();
      }, 10);
      return;
    }

    // Normal typing
    const char = text.slice(-1); // Take the last char entered
    newOtp[index] = char;
    setOtp(newOtp);

    // Auto-focus next input with a tiny delay to ensure value is committed
    if (char && index < 7) {
      setTimeout(() => {
        inputRefs.current[index + 1]?.focus();
      }, 10);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === 'Backspace') {
      if (!otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const titleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslate.value }],
  }));

  const subtitleAnimatedStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
  }));

  const inputAnimatedStyle = useAnimatedStyle(() => ({
    opacity: inputOpacity.value,
    transform: [{ translateY: inputTranslate.value }],
  }));

  const buttonAnimatedStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <AppHeader 
        icon="back" 
        onMenuPress={() => router.back()} 
        showWishlist={false} 
        showSearch={false} 
      />
      <View style={styles.keyboardView}>
        <View style={styles.content}>
          <Animated.View style={[styles.header, titleAnimatedStyle]}>
            <Text style={styles.title}>Account Verification</Text>
          </Animated.View>

          <Animated.View style={subtitleAnimatedStyle}>
            <Text style={styles.subtitle}>
              We've sent an 8-digit secure code to{"\n"}
              <Text style={styles.contactText}>{contact}</Text>
            </Text>
          </Animated.View>

          <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
            <View style={styles.otpGrid}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    if (ref) inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    otp[index] ? styles.otpInputActive : null
                  ]}
                  value={digit}
                  onChangeText={(text) => handleChangeOtp(text, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="numeric"
                  inputMode="numeric"
                  maxLength={1} // Consistently 1 for all platforms
                  selectTextOnFocus
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>
          </Animated.View>

          <Animated.View style={[styles.footer, buttonAnimatedStyle]}>
            <LuxuryButton
              title={loading ? "Verifying..." : "Confirm Verification"}
              onPress={handleVerify}
              variant="primary"
              size="large"
              fullWidth
              disabled={loading}
            />

            <View style={styles.resendContainer}>
              <Text style={styles.resendText}>Didn't receive code? </Text>
              <TouchableWithoutFeedback onPress={isResendDisabled ? undefined : handleResend}>
                <Text style={[styles.resendLink, isResendDisabled && styles.resendDisabled]}>
                  {isResendDisabled ? `Resend in ${timer}s` : "Resend Now"}
                </Text>
              </TouchableWithoutFeedback>
            </View>
          </Animated.View>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.ivory,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: spacing.lg,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    marginBottom: spacing.xs,
  },
  title: {
    ...typography.h1,
    color: palette.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: "center",
    marginBottom: spacing.xl,
    lineHeight: 24,
  },
  contactText: {
    color: palette.textPrimary,
    fontWeight: "600",
  },
  inputContainer: {
    width: "100%",
    marginBottom: spacing.xxl,
  },
  otpGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: 8,
  },
  otpInput: {
    width: 44,
    height: 52,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: "rgba(198, 162, 77, 0.2)",
    backgroundColor: palette.white,
    fontSize: 22,
    color: palette.textPrimary,
    ...Platform.select({
      web: {
        outlineStyle: 'none',
      },
    }),
    ...shadow.card,
  },
  otpInputActive: {
    borderColor: palette.gold,
    borderWidth: 1.5,
  },
  footer: {
    width: "100%",
    gap: spacing.lg,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  resendText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
  },
  resendLink: {
    ...typography.bodySmall,
    color: palette.gold,
    fontWeight: "600",
  },
  resendDisabled: {
    color: palette.textSecondary,
    opacity: 0.6,
  },
});
