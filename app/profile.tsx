import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader } from "../components/AppHeader";
import { palette, radius, spacing } from "../constants/theme";

const profileFields = [
  { key: "fullName", label: "Full Name", placeholder: "Ariana Kapoor" },
  { key: "email", label: "Email", placeholder: "aria@aurum.app", keyboardType: "email-address" },
  { key: "phone", label: "WhatsApp", placeholder: "+91 98700 01212", keyboardType: "phone-pad" },
  { key: "city", label: "City", placeholder: "Mumbai" },
];

const preferencePresets = {
  metals: ["22K Gold", "Rose Gold", "Platinum"],
  gemstones: ["Emerald", "Polki", "Pearl"],
  occasions: ["Sangeet", "Cocktail", "Bridal Phera"],
};

const conciergeStats = [
  { label: "Looks curated", value: "18", hint: "in last 6 months" },
  { label: "Wishlist items", value: "42", hint: "across categories" },
  { label: "Upcoming events", value: "3", hint: "marked with concierge" },
];

export default function ProfileScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Record<string, string>>({
    fullName: "Aria Kapoor",
    email: "aria@aurumatelier.com",
    phone: "+91 98700 01212",
    city: "Mumbai",
    stylingNotes: "Prefer heritage polki with emeralds and light-weight mehendi sets.",
  });

  const initials = useMemo(
    () =>
      profile.fullName
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .slice(0, 2)
        .toUpperCase(),
    [profile.fullName],
  );

  const handleChange = (key: string, value: string) =>
    setProfile((prev) => ({ ...prev, [key]: value }));

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={styles.heroCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarLabel}>{initials}</Text>
          </View>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={styles.title}>{profile.fullName}</Text>
            <Text style={styles.subtitle}>
              Heritage Club · Member since 2018 · Preferred stylist Sanjana
            </Text>
            <View style={styles.badgeRow}>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>Concierge tier · Emerald</Text>
              </View>
              <View style={styles.badge}>
                <Text style={styles.badgeLabel}>WhatsApp verified</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.statsRow}>
          {conciergeStats.map((stat) => (
            <View key={stat.label} style={styles.statCard}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statHint}>{stat.hint}</Text>
            </View>
          ))}
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Personal details</Text>
          <View style={{ gap: spacing.md }}>
            {profileFields.map((field) => (
              <View key={field.key}>
                <Text style={styles.label}>{field.label}</Text>
                <TextInput
                  value={profile[field.key]}
                  onChangeText={(value) => handleChange(field.key, value)}
                  placeholder={field.placeholder}
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  keyboardType={field.keyboardType as any}
                  style={styles.input}
                />
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Styling DNA</Text>
          <View style={styles.preferenceBlock}>
            <Text style={styles.preferenceLabel}>Metals</Text>
            <View style={styles.chipRow}>
              {preferencePresets.metals.map((item) => (
                <View key={item} style={styles.chip}>
                  <Text style={styles.chipLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.preferenceBlock}>
            <Text style={styles.preferenceLabel}>Gemstones</Text>
            <View style={styles.chipRow}>
              {preferencePresets.gemstones.map((item) => (
                <View key={item} style={styles.chip}>
                  <Text style={styles.chipLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
          <View style={styles.preferenceBlock}>
            <Text style={styles.preferenceLabel}>Occasions</Text>
            <View style={styles.chipRow}>
              {preferencePresets.occasions.map((item) => (
                <View key={item} style={styles.chip}>
                  <Text style={styles.chipLabel}>{item}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Styling notes</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={profile.stylingNotes}
            onChangeText={(value) => handleChange("stylingNotes", value)}
            placeholder="Tell us about upcoming events, preferred gemstones or karat."
            placeholderTextColor="rgba(255,255,255,0.4)"
            style={[styles.input, { height: 120, textAlignVertical: "top" as const }]}
          />
        </View>

        <View style={styles.row}>
          <TouchableOpacity style={[styles.pillButton, styles.outline]}>
            <Text style={[styles.buttonLabel, { color: palette.paleGold }]}>Share profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.pillButton, styles.primary]}>
            <Text style={[styles.buttonLabel, { color: palette.deepGreen }]}>Save updates</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.deepGreen,
  },
  heroCard: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: radius.full,
    backgroundColor: palette.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarLabel: {
    color: palette.deepGreen,
    fontSize: 24,
    fontWeight: "700",
  },
  title: {
    color: palette.paleGold,
    fontSize: 32,
    fontWeight: "700",
  },
  subtitle: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },
  badgeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.xs,
  },
  badge: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
  },
  badgeLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 12,
  },
  statsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    minWidth: 110,
    backgroundColor: palette.emerald,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs / 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  statValue: {
    color: palette.gold,
    fontSize: 24,
    fontWeight: "700",
  },
  statLabel: {
    color: palette.cream,
    fontSize: 13,
  },
  statHint: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 11,
  },
  card: {
    backgroundColor: palette.emerald,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
  },
  cardTitle: {
    color: palette.cream,
    fontSize: 18,
    fontWeight: "700",
  },
  label: {
    color: palette.paleGold,
    marginBottom: spacing.xs / 2,
  },
  input: {
    borderRadius: radius.md,
    backgroundColor: palette.dusk,
    padding: spacing.md,
    color: palette.cream,
  },
  preferenceBlock: {
    gap: spacing.xs,
  },
  preferenceLabel: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
  },
  chip: {
    borderRadius: radius.full,
    backgroundColor: "rgba(0,0,0,0.25)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.12)",
  },
  chipLabel: {
    color: palette.paleGold,
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    gap: spacing.md,
  },
  pillButton: {
    flex: 1,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    alignItems: "center",
  },
  outline: {
    borderWidth: 1,
    borderColor: palette.paleGold,
  },
  primary: {
    backgroundColor: palette.gold,
  },
  buttonLabel: {
    fontWeight: "700",
  },
});

