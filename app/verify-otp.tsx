import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
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
import LuxuryButton from "../components/LuxuryButton";
import { palette, radius, spacing, typography } from "../constants/theme";

export default function VerifyOtp() {
    const router = useRouter();
    const params = useLocalSearchParams();
    const contact = params.contact as string || "your email/phone";

    const [otp, setOtp] = useState(["", "", "", ""]);
    const [timer, setTimer] = useState(30);
    const [isResendDisabled, setIsResendDisabled] = useState(true);

    // Animation values
    const titleOpacity = useSharedValue(0);
    const titleTranslate = useSharedValue(20);
    const subtitleOpacity = useSharedValue(0);
    const inputOpacity = useSharedValue(0);
    const inputTranslate = useSharedValue(30);
    const buttonOpacity = useSharedValue(0);

    useEffect(() => {
        // Entrance animations
        titleOpacity.value = withTiming(1, { duration: 600 });
        titleTranslate.value = withSpring(0, { damping: 15, stiffness: 100 });

        subtitleOpacity.value = withDelay(200, withTiming(1, { duration: 600 }));

        inputOpacity.value = withDelay(400, withTiming(1, { duration: 600 }));
        inputTranslate.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 100 }));

        buttonOpacity.value = withDelay(600, withTiming(1, { duration: 600 }));

        // Timer logic
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

        return () => clearInterval(interval);
    }, []);

    const handleVerify = () => {
        const enteredOtp = otp.join("");
        if (enteredOtp.length === 4) {
            // Simulate verification
            router.replace("/(tabs)/home");
        } else {
            // Show error (visual feedback could be added here)
            alert("Please enter a valid 4-digit code");
        }
    };

    const handleResend = () => {
        setTimer(30);
        setIsResendDisabled(true);
        // Simulate resend API call
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
    };

    const handleChangeOtp = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        // Auto-focus next input
        if (text && index < 3) {
            // This is a simplified way to handle focus in React Native without refs for each input
            // In a production app, use refs to standard Inputs
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
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.keyboardView}
                >
                    <View style={styles.content}>
                        <Animated.View style={[styles.header, titleAnimatedStyle]}>
                            <Text style={styles.title}>Verification</Text>
                        </Animated.View>

                        <Animated.View style={subtitleAnimatedStyle}>
                            <Text style={styles.subtitle}>
                                Enter the 4-digit code sent to{"\n"}
                                <Text style={styles.contactText}>{contact}</Text>
                            </Text>
                        </Animated.View>

                        <Animated.View style={[styles.inputContainer, inputAnimatedStyle]}>
                            <View style={styles.otpRow}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        style={styles.otpInput}
                                        value={digit}
                                        onChangeText={(text) => {
                                            if (text.length <= 1) handleChangeOtp(text, index);
                                            if (text.length === 1 && index < 3) {
                                                // Rudimentary focus management could go here with refs
                                            }
                                        }}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        selectTextOnFocus
                                    />
                                ))}
                            </View>
                        </Animated.View>

                        <Animated.View style={[styles.footer, buttonAnimatedStyle]}>
                            <LuxuryButton
                                title="Verify & Proceed"
                                onPress={handleVerify}
                                variant="primary"
                                size="large"
                                fullWidth
                            />

                            <View style={styles.resendContainer}>
                                <Text style={styles.resendText}>Didn't receive code? </Text>
                                <TouchableWithoutFeedback onPress={isResendDisabled ? undefined : handleResend}>
                                    <Text style={[styles.resendLink, isResendDisabled && styles.resendDisabled]}>
                                        {isResendDisabled ? `Resend in ${timer}s` : "Resend"}
                                    </Text>
                                </TouchableWithoutFeedback>
                            </View>
                        </Animated.View>
                    </View>
                </KeyboardAvoidingView>
            </TouchableWithoutFeedback>
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
    content: {
        flex: 1,
        padding: spacing.lg,
        justifyContent: "center",
        alignItems: "center",
    },
    header: {
        marginBottom: spacing.sm,
    },
    title: {
        ...typography.h1,
        color: palette.textPrimary,
        textAlign: "center",
    },
    subtitle: {
        ...typography.body, // Fixed: removed .regular which doesn't exist on typography.body
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
        marginBottom: spacing.xl,
    },
    otpRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        gap: spacing.sm,
        maxWidth: 300,
        alignSelf: "center",
    },
    otpInput: {
        width: 60,
        height: 60,
        borderRadius: radius.md,
        borderWidth: 1,
        borderColor: palette.divider, // Use palette.divider or a specific gold like "rgba(212, 175, 55, 0.3)"
        backgroundColor: palette.white,
        textAlign: "center",
        fontSize: 24,
        color: palette.textPrimary,
        ...typography.h2,
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
        opacity: 0.7,
    },
});
