import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image as RNImage, ScrollView, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { AppHeader } from "../components/AppHeader";
import { getDesigns, getDesignsByCollection } from "../supabase/api";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";
import { useToast } from "../utils/toast";
import { useWishlist } from "./context/WishlistContext";

const { width } = Dimensions.get("window");

export default function CategoryScreen() {
  const { name, tag, material, collectionId } = useLocalSearchParams<{ 
    name?: string, 
    tag?: string,
    material?: string,
    collectionId?: string 
  }>();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const { wishlistIds, toggleItem } = useWishlist();
  const [loading, setLoading] = useState(true);

  const categoryName = name ?? "Necklaces";
  const displayTitle = material ? `${material} ${categoryName}` : categoryName;
  const { showToast } = useToast();

  useEffect(() => {
    fetchItems();
  }, [categoryName, tag, material, collectionId]);

  const fetchItems = async () => {
    setLoading(true);
    try {
      let data;
      if (collectionId) {
        data = await getDesignsByCollection(collectionId);
      } else {
        data = await getDesigns(categoryName, tag, material);
      }
      setItems(data || []);
    } catch (error) {
      console.error("Error fetching category items:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async (id: string, name: string) => {
    await toggleItem(id);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={{ paddingBottom: spacing.xl }}>
        <View style={styles.hero}>
          <Text style={styles.breadcrumb}>
            Collection · {categoryName} {tag && tag !== 'All' && `· ${tag}`}
          </Text>
          <Text style={styles.title}>{displayTitle}</Text>
          <Text style={styles.copy}>
            {tag && tag !== 'All' 
              ? `Exploring our finest ${tag.toLowerCase()} ${categoryName.toLowerCase()}.`
              : `Explore couture-ready pieces curated for ${categoryName.toLowerCase()} lovers.`
            } Tap any product to request price, video or WhatsApp styling.
          </Text>
        </View>
        <View style={styles.grid}>
          {loading ? (
            <ActivityIndicator size="large" color={palette.gold} />
          ) : (
            items.map((item, index) => (
              <TouchableOpacity 
                key={item.id} 
                style={styles.card}
                onPress={() => router.push({
                  pathname: "/product-details",
                  params: { designId: item.id }
                })}
              >
                <View style={{ position: 'relative' }}>
                  <Image 
                    source={item.image_url ? { uri: item.image_url } : require("../assets/jawellery-images/jawelery-image-2.jpg")} 
                    style={styles.image} 
                    contentFit="contain"
                    transition={300}
                  />
                  <TouchableOpacity 
                    style={styles.favButton}
                    onPress={() => handleToggleWishlist(item.id, item.name)}
                  >
                    <Feather 
                      name={wishlistIds.includes(item.id) ? "heart" : "heart"} 
                      size={18} 
                      color={palette.gold} 
                      fill={wishlistIds.includes(item.id) ? palette.gold : "transparent"}
                    />
                  </TouchableOpacity>
                </View>
                <View style={styles.cardBody}>
                  <View>
                    <Text style={styles.cardCategory}>{item.material || 'Premium Gold'}</Text>
                    <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
                  </View>
                  <Text style={styles.cardPrice}>{item.price || 'P.O.E.'}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          {!loading && items.length === 0 && (
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
    backgroundColor: palette.white,
    borderRadius: radius.lg,
    overflow: "hidden",
    ...shadow.card,
    marginBottom: spacing.md,
  },
  image: {
    width: "100%",
    height: 180,
    backgroundColor: palette.ivory,
  },
  favButton: {
    position: "absolute",
    top: spacing.sm,
    right: spacing.sm,
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    zIndex: 1,
    ...shadow.card,
  },
  cardBody: {
    padding: spacing.md,
    gap: spacing.xs,
    flex: 1,
    justifyContent: "space-between",
  },
  cardCategory: {
    ...typography.caption,
    fontSize: 10,
    color: palette.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
  },
  cardName: {
    ...typography.h3,
    fontSize: 14,
    color: palette.textPrimary,
    marginBottom: 4,
  },
  cardPrice: {
    ...typography.price,
    fontSize: 15,
    color: palette.gold,
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

