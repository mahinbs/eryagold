import { useLocalSearchParams, useRouter } from "expo-router";
import { useMemo } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader } from "../components/AppHeader";
import { catalogByCategory } from "../constants/catalog";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function CategoryScreen() {
  const { name } = useLocalSearchParams<{ name?: string }>();
  const router = useRouter();

  const categoryName = name ?? "Necklaces";
  const items = useMemo(() => catalogByCategory[categoryName] ?? [], [categoryName]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.hero}>
          <Text style={styles.breadcrumb}>Collection · {categoryName}</Text>
          <Text style={styles.title}>{categoryName}</Text>
          <Text style={styles.copy}>
            Explore couture-ready pieces curated for {categoryName.toLowerCase()} lovers. Tap any
            product to request price, video or WhatsApp styling.
          </Text>
        </View>
        <View style={styles.grid}>
          {items.map((item) => (
            <TouchableOpacity key={item.name} style={styles.card}>
              <Image source={item.image} style={styles.image} />
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardDescription}>{item.description}</Text>
                <Text style={styles.cardPrice}>{item.price}</Text>
              </View>
            </TouchableOpacity>
          ))}
          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Coming soon</Text>
              <Text style={styles.emptyCopy}>
                We are crafting new pieces for this category. Reach our concierge to pre-book a
                private preview.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.ivory,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    gap: spacing.md,
    backgroundColor: palette.white,
    marginBottom: spacing.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  breadcrumb: {
    ...typography.caption,
    color: palette.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
    fontWeight: "300",
  },
  title: {
    ...typography.hero,
    color: palette.textPrimary,
  },
  copy: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 22,
    fontWeight: "300",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
  },
  card: {
    width: (width - spacing.lg * 2 - spacing.md) / 2, // 2 cards per row with gap
    height: 360, // Fixed height for all cards
    borderRadius: radius.md,
    backgroundColor: palette.white,
    overflow: "hidden",
    ...shadow.card,
  },
  image: {
    width: "100%",
    height: 200, // Reduced image height to show content
    backgroundColor: palette.divider,
  },
  cardBody: {
    padding: spacing.lg,
    gap: spacing.xs,
    flex: 1,
    justifyContent: "space-between",
  },
  cardName: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: spacing.xs / 2,
  },
  cardDescription: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    marginBottom: spacing.xs,
    fontWeight: "300",
  },
  cardPrice: {
    ...typography.price,
    color: palette.gold,
    marginTop: spacing.xs,
  },
  emptyState: {
    width: "100%",
    padding: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: palette.white,
    alignItems: "center",
    gap: spacing.md,
    ...shadow.card,
  },
  emptyTitle: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  emptyCopy: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "300",
  },
});

