import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Link, useRouter } from "expo-router";
import { palette, radius, spacing } from "../constants/theme";

export default function Register() {
  const router = useRouter();
  const [profile, setProfile] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
  });

  const handleChange = (field: keyof typeof profile, value: string) => {
    setProfile((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = () => {
    router.replace("/(tabs)/home");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: palette.dusk }}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text
            style={{
              color: palette.paleGold,
              fontSize: 38,
              fontWeight: "700",
              marginBottom: spacing.xs,
            }}
          >
            Create Profile
          </Text>
          <Text style={{ color: palette.cream, fontSize: 15, lineHeight: 22 }}>
            Tell us a little about yourself so we can tailor the collection you see.
          </Text>
        </View>

        {[
          { key: "fullName", label: "Full name", placeholder: "Aria Kapoor" },
          {
            key: "email",
            label: "Email",
            placeholder: "aria@aurumgallery.com",
            keyboardType: "email-address" as const,
          },
          { key: "phone", label: "WhatsApp number", placeholder: "+91 98 765 43210" },
        ].map((field) => (
          <View key={field.key}>
            <Text style={{ color: palette.paleGold, marginBottom: spacing.xs }}>
              {field.label}
            </Text>
            <TextInput
              value={profile[field.key as keyof typeof profile]}
              onChangeText={(value) =>
                handleChange(field.key as keyof typeof profile, value)
              }
              placeholder={field.placeholder}
              placeholderTextColor="rgba(255,255,255,0.45)"
              keyboardType={field.keyboardType}
              style={{
                backgroundColor: palette.emerald,
                color: palette.cream,
                borderRadius: radius.md,
                padding: spacing.md,
              }}
            />
          </View>
        ))}

        <View>
          <Text style={{ color: palette.paleGold, marginBottom: spacing.xs }}>
            Create password
          </Text>
          <TextInput
            value={profile.password}
            onChangeText={(value) => handleChange("password", value)}
            placeholder="8+ characters"
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

        <View
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            borderRadius: radius.md,
            padding: spacing.md,
          }}
        >
          <Text style={{ color: palette.cream, fontSize: 14, lineHeight: 20 }}>
            By creating an account, you agree to receive curated updates, launch previews
            and concierge support messages on WhatsApp.
          </Text>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
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
            Complete Registration
          </Text>
        </TouchableOpacity>

        <Text style={{ textAlign: "center", color: palette.cream }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: palette.gold, fontWeight: "700" }}>
            Sign in
          </Link>
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

