import { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { palette, radius, spacing } from "../constants/theme";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.deepGreen }}>
      <StatusBar barStyle="light-content" />
      <View style={{ padding: spacing.lg, gap: spacing.xl }}>
        <View>
          <Text
            style={{
              color: palette.paleGold,
              fontSize: 42,
              fontWeight: "700",
              marginBottom: spacing.xs,
            }}
          >
            Welcome Back
          </Text>
          <Text style={{ color: palette.cream, fontSize: 16, lineHeight: 22 }}>
            Sign in to continue curating your dream jewellery wardrobe.
          </Text>
        </View>

        <View style={{ gap: spacing.md }}>
          <View>
            <Text style={{ color: palette.paleGold, marginBottom: spacing.xs }}>
              Email address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="stylist@aurumatelier.com"
              placeholderTextColor="rgba(255,255,255,0.45)"
              keyboardType="email-address"
              style={{
                backgroundColor: palette.emerald,
                color: palette.cream,
                borderRadius: radius.md,
                padding: spacing.md,
              }}
            />
          </View>
          <View>
            <Text style={{ color: palette.paleGold, marginBottom: spacing.xs }}>
              Password
            </Text>
            <TextInput
              value={password}
              onChangeText={setPassword}
              placeholder="Enter secure passcode"
              placeholderTextColor="rgba(255,255,255,0.45)"
              secureTextEntry
              style={{
                backgroundColor: palette.emerald,
                color: palette.cream,
                borderRadius: radius.md,
                padding: spacing.md,
              }}
            />
          </View>
          <Text
            style={{
              color: palette.cream,
              textAlign: "right",
              fontSize: 14,
            }}
          >
            Forgot password?
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          style={{
            backgroundColor: palette.gold,
            padding: spacing.md,
            borderRadius: radius.full,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: palette.deepGreen,
              fontWeight: "700",
              fontSize: 16,
            }}
          >
            Sign In
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            borderRadius: radius.full,
            borderWidth: 1,
            borderColor: palette.paleGold,
            padding: spacing.md,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: palette.paleGold,
              fontWeight: "600",
            }}
          >
            Continue with WhatsApp
          </Text>
        </TouchableOpacity>

        <Text
          style={{
            textAlign: "center",
            color: palette.cream,
          }}
        >
          New to the maison?{" "}
          <Link href="/register" style={{ color: palette.gold, fontWeight: "700" }}>
            Create profile
          </Link>
        </Text>
      </View>
    </SafeAreaView>
  );
}

