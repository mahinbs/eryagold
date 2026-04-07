import { Feather } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
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
    backgroundColor: palette.white, // White
  },
  header: {
    flexDirection: "row",
    gap: spacing.md,
    backgroundColor: palette.greenLight, // Light green
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  headerTitle: {
    color: palette.green, // Deep green for headings
    fontSize: 22,
    fontWeight: "500",
    fontFamily: "serif",
  },
  headerCopy: {
    color: palette.textSecondary,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  card: {
    backgroundColor: palette.goldCream, // Cream gold for cards
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardLabel: {
    color: palette.gold, // Gold
    fontSize: 26,
    fontWeight: "500",
    fontFamily: "serif",
  },
  cardPurity: {
    color: palette.textSecondary,
  },
  cardCopy: {
    color: palette.textSecondary,
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
    color: palette.textSecondary,
    fontSize: 12,
  },
  metricValue: {
    color: palette.charcoal,
    fontWeight: "400",
  },
  tipCard: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
    padding: spacing.lg,
    gap: spacing.xs,
    backgroundColor: palette.greenLight, // Light green
  },
  tipTitle: {
    color: palette.green, // Deep green for headings
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "serif",
  },
  tipCopy: {
    color: palette.textSecondary,
    lineHeight: 20,
  },
});

