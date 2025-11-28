import { useMemo } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { AppHeader } from "../components/AppHeader";
import { catalogByCategory } from "../constants/catalog";
import { palette, radius, spacing } from "../constants/theme";

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
              <Image source={{ uri: item.image }} style={styles.image} />
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
    backgroundColor: palette.deepGreen,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },
  breadcrumb: {
    color: palette.paleGold,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontSize: 12,
  },
  title: {
    color: palette.cream,
    fontSize: 34,
    fontWeight: "700",
  },
  copy: {
    color: "rgba(255,255,255,0.75)",
    lineHeight: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  card: {
    width: "47%",
    borderRadius: radius.lg,
    backgroundColor: palette.emerald,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 180,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
  },
  cardName: {
    color: palette.paleGold,
    fontSize: 16,
    fontWeight: "700",
  },
  cardDescription: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
  },
  cardPrice: {
    color: palette.gold,
    fontWeight: "700",
    marginTop: spacing.xs,
  },
  emptyState: {
    width: "100%",
    padding: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    gap: spacing.sm,
  },
  emptyTitle: {
    color: palette.paleGold,
    fontSize: 18,
    fontWeight: "700",
  },
  emptyCopy: {
    color: "rgba(255,255,255,0.7)",
    textAlign: "center",
    lineHeight: 20,
  },
});

