import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "../components/AppHeader";
import { palette, radius, spacing } from "../constants/theme";

const legalCopy: Record<string, { title: string; bullets: string[] }> = {
  privacy: {
    title: "Privacy Policy",
    bullets: [
      "Client data is encrypted in transit and at rest using AES-256.",
      "We only store purchase history and concierge notes to personalise trays.",
      "You may request deletion of your data by emailing privacy@aurumatelier.com.",
    ],
  },
  terms: {
    title: "Terms & Conditions",
    bullets: [
      "All bespoke orders require a 30% advance and balance before dispatch.",
      "Hallmark certificates and appraisals are issued digitally post QA.",
      "International shipping timelines vary between 7-21 business days.",
    ],
  },
};

export default function LegalScreen() {
  const router = useRouter();
  const { type } = useLocalSearchParams<{ type?: string }>();
  const key = type === "terms" ? "terms" : "privacy";
  const content = legalCopy[key];

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={styles.card}>
          <Text style={styles.title}>{content.title}</Text>
          {content.bullets.map((bullet) => (
            <View key={bullet} style={styles.bulletRow}>
              <View style={styles.bullet} />
              <Text style={styles.copy}>{bullet}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.white, // White
  },
  card: {
    backgroundColor: palette.goldCream, // Cream gold for cards
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  title: {
    color: palette.green, // Deep green for headings
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "serif",
  },
  bulletRow: {
    flexDirection: "row",
    gap: spacing.md,
  },
  bullet: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    backgroundColor: palette.gold, // Gold
    marginTop: spacing.xs,
  },
  copy: {
    flex: 1,
    color: palette.textPrimary, // Deep green text
    lineHeight: 20,
  },
});

