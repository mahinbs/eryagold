import { Feather } from "@expo/vector-icons";
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
import LuxuryButton from "../components/LuxuryButton";
import { catalogByCategory } from "../constants/catalog";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { category, type } = useLocalSearchParams<{ category?: string; type?: string }>();

  const categoryName = category ?? "Necklaces";

  const items = useMemo(() => catalogByCategory[categoryName] ?? [], [categoryName]);

  const isTablet = width >= 768;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={palette.gold} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <Text style={styles.headerTitle}>{categoryName}</Text>
          {type && <Text style={styles.headerSubtitle}>{type}</Text>}
        </View>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerActionChip}>
            <Feather name="sliders" size={16} color={palette.gold} />
            <Text style={styles.headerActionText}>Sort</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerActionChip}>
            <Feather name="filter" size={16} color={palette.gold} />
            <Text style={styles.headerActionText}>Filter</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: spacing.lg,
          paddingBottom: spacing.xl,
          paddingTop: spacing.lg,
          gap: spacing.lg,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.grid}>
          {items.map((item) => (
            <View key={item.name} style={styles.card}>
              <View style={styles.imageContainer}>
                <Image source={item.image} style={styles.image} />
                <TouchableOpacity style={styles.favButton}>
                  <Feather name="heart" size={18} color={palette.gold} />
                </TouchableOpacity>
              </View>
              <View style={styles.cardBody}>
                <Text style={styles.skuLabel} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.metaRow}>
                  <Text style={styles.metaLabel}>{item.price}</Text>
                </View>
              </View>
              <View style={styles.buttonContainer}>
                <LuxuryButton
                  title="ADD TO CART"
                  onPress={() => {}}
                  variant="primary"
                  size="small"
                  fullWidth
                />
              </View>
            </View>
          ))}

          {items.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No products yet</Text>
              <Text style={styles.emptyCopy}>
                We’re still adding pieces in this category. Please check back shortly or contact
                our concierge.
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
    backgroundColor: palette.white, // White background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: palette.white, // White for header
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.2)",
    ...shadow.card,
  },
  headerIcon: {
    padding: spacing.sm,
  },
  headerTitleWrapper: {
    flex: 1,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.green, // Deep green for headings
    fontWeight: "500",
  },
  headerSubtitle: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    gap: spacing.sm,
  },
  headerActionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: radius.full,
    borderWidth: 1.5,
    borderColor: "rgba(212, 175, 55, 0.3)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    backgroundColor: "#F7F4E8", // Light premium gold
  },
  headerActionText: {
    ...typography.bodySmall,
    color: palette.gold,
    fontWeight: "600",
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
    justifyContent: "flex-start",
  },
  card: {
    width: (width - spacing.lg * 3) / 2,
    backgroundColor: palette.white,
    borderRadius: radius.md,
    overflow: "hidden",
    flexDirection: "column",
    ...shadow.card,
  },
  imageContainer: {
    height: 180, // Fixed height
    position: "relative",
    width: "100%",
    backgroundColor: palette.divider,
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  favButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "rgba(212,175,55,0.3)",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: palette.white, // White
    zIndex: 1,
    ...shadow.card,
  },
  cardBody: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: 4,
  },
  skuLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: palette.green, // Deep green for headings
    marginBottom: spacing.xs / 2,
    lineHeight: 20,
  },
  metaLabel: {
    fontSize: 11,
    color: palette.textSecondary,
    lineHeight: 16,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.xs / 2,
  },
  buttonContainer: {
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.sm,
    paddingTop: spacing.xs,
  },
  emptyState: {
    width: "100%",
    padding: spacing.xl,
    borderRadius: radius.xl,
    backgroundColor: "#F0F5F3", // Light premium green
    alignItems: "center",
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
  },
  emptyTitle: {
    ...typography.h3,
    color: palette.green, // Deep green for headings
    fontWeight: "500",
  },
  emptyCopy: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
  },
});


