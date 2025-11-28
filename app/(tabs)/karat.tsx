import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { AppHeader } from "../../components/AppHeader";
import { palette, radius, spacing } from "../../constants/theme";

const karatGuide = [
  {
    label: "24K",
    purity: "99.9% pure gold",
    use: "Reserved for coins and investments. Too soft for daily wear but radiant in ceremonial pieces.",
  },
  {
    label: "22K",
    purity: "91.6% pure gold",
    use: "Ideal for bridal and heirloom jewellery. Balanced malleability for intricate detailing.",
  },
  {
    label: "18K",
    purity: "75% pure gold",
    use: "Perfect for gemstone settings, high-gloss polishes and international hallmarking standards.",
  },
  {
    label: "14K",
    purity: "58.5% pure gold",
    use: "Lightweight daily jewels with superior durability and accessible pricing.",
  },
];

export default function KaratScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <ScrollView contentContainerStyle={{ padding: spacing.lg, gap: spacing.lg }}>
        <View style={styles.header}>
          <Feather name="star" size={24} color={palette.gold} />
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>Karat Intelligence</Text>
            <Text style={styles.headerCopy}>
              Understand the purity matrix, price impact and recommended use-cases for each karat.
            </Text>
          </View>
        </View>

        {karatGuide.map((band) => (
          <View key={band.label} style={styles.card}>
            <View style={styles.cardTop}>
              <Text style={styles.cardLabel}>{band.label}</Text>
              <Text style={styles.cardPurity}>{band.purity}</Text>
            </View>
            <Text style={styles.cardCopy}>{band.use}</Text>
            <View style={styles.metricRow}>
              <Metric label="Colour" value={band.label === "24K" ? "Rich amber" : "Warm gold"} />
              <Metric label="Durability" value={band.label === "24K" ? "Soft" : "High"} />
              <Metric label="Investment" value={band.label === "24K" ? "Premium" : "Balanced"} />
            </View>
          </View>
        ))}

        <View style={styles.tipCard}>
          <Text style={styles.tipTitle}>Expert tip</Text>
          <Text style={styles.tipCopy}>
            Pair 22K necklaces with 18K gemstone pendants to keep structural strength while letting
            the colour palettes align seamlessly.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const Metric = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.metric}>
    <Text style={styles.metricLabel}>{label}</Text>
    <Text style={styles.metricValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.deepGreen,
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: palette.emerald,
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
  headerTitle: {
    color: palette.paleGold,
    fontSize: 22,
    fontWeight: "700",
  },
  headerCopy: {
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.dusk,
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    color: palette.gold,
    fontSize: 26,
    fontWeight: "700",
  },
  cardPurity: {
    color: palette.cream,
  },
  cardCopy: {
    color: "rgba(255,255,255,0.8)",
    lineHeight: 20,
  },
  metricRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: spacing.md,
  },
  metric: {
    flex: 1,
    padding: spacing.sm,
  },
  metricLabel: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 12,
  },
  metricValue: {
    color: palette.paleGold,
    fontWeight: "600",
  },
  tipCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    padding: spacing.lg,
    gap: spacing.xs,
  },
  tipTitle: {
    color: palette.paleGold,
    fontSize: 16,
    fontWeight: "700",
  },
  tipCopy: {
    color: palette.cream,
    lineHeight: 20,
  },
});

