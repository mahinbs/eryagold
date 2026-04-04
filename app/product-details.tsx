import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import LuxuryButton from "../components/LuxuryButton";
import { palette, radius, shadow, spacing, typography } from "../constants/theme";
import { getDesignById, getCurrentUser } from "../supabase/api";
import { useToast } from "../utils/toast";
import { useWishlist } from "./context/WishlistContext";

const { width } = Dimensions.get("window");

export default function ProductDetailsScreen() {
  const router = useRouter();
  const { designId } = useLocalSearchParams<{ designId: string }>();
  const [design, setDesign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { wishlistIds, toggleItem } = useWishlist();
  const { showToast } = useToast();

  const isWishlisted = design ? wishlistIds.includes(design.id) : false;

  useEffect(() => {
    if (designId) {
      fetchDesignDetails();
    }
  }, [designId]);

  const fetchDesignDetails = async () => {
    setLoading(true);
    try {
      const data = await getDesignById(designId!);
      setDesign(data);
    } catch (error) {
      console.error("Error fetching design details:", error);
      showToast("Failed to load product details", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleWishlist = async () => {
    if (!design) return;
    await toggleItem(design.id);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={palette.gold} />
      </SafeAreaView>
    );
  }

  if (!design) {
    return (
      <SafeAreaView style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Product not found</Text>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.errorLink}>Go back</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerIcon} onPress={() => router.back()}>
          <Feather name="chevron-left" size={24} color={palette.gold} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{design.category}</Text>
        <TouchableOpacity style={styles.headerIcon} onPress={handleToggleWishlist}>
          <Feather 
            name={isWishlisted ? "heart" : "heart"} 
            size={24} 
            color={palette.gold} 
            fill={isWishlisted ? palette.gold : "transparent"}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageWrapper}>
          <Image 
            source={design.image_url ? { uri: design.image_url } : require("../assets/jawellery-images/jawelery-image-2.jpg")} 
            style={styles.mainImage} 
            resizeMode="contain"
          />
          <TouchableOpacity 
            style={styles.floatingFavButton}
            onPress={handleToggleWishlist}
          >
            <Feather 
              name={isWishlisted ? "heart" : "heart"} 
              size={24} 
              color={palette.gold} 
              fill={isWishlisted ? palette.gold : "transparent"}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.titleRow}>
            <View style={{ flex: 1 }}>
               <Text style={styles.productCategory}>{design.material || 'Premium Material'}</Text>
               <Text style={styles.productName}>{design.name}</Text>
            </View>
            <Text style={styles.productPrice}>{design.price || 'P.O.E.'}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>
            {design.description || "An exquisite piece crafted with precision and artistry, capturing the timeless elegance of Erya Gold's signature heritage collection."}
          </Text>

          <View style={styles.specGrid}>
             <View style={styles.specItem}>
                <Text style={styles.specLabel}>Category</Text>
                <Text style={styles.specValue}>{design.category}</Text>
             </View>
             <View style={styles.specItem}>
                <Text style={styles.specLabel}>Material</Text>
                <Text style={styles.specValue}>{design.material || '22K Gold'}</Text>
             </View>
          </View>

          <View style={styles.actionArea}>
            <LuxuryButton
              title="INQUIRE VIA WHATSAPP"
              onPress={() => router.push({
                pathname: "/(tabs)/whatsapp",
                params: { designId: design.id, subject: `Inquiry: ${design.name}` }
              })}
              variant="primary"
              fullWidth
            />
            <Text style={styles.conciergeBenefit}>
              Authenticity Guaranteed • Free Secure Shipping • Custom Adjustments
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.white,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: palette.white,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.md,
  },
  errorTitle: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  errorLink: {
    color: palette.gold,
    fontWeight: "600",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(212, 175, 55, 0.1)",
  },
  headerIcon: {
    padding: spacing.xs,
  },
  headerTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    fontWeight: "500",
  },
  imageWrapper: {
    width: width,
    height: 400, // Reduced from width * 1.2
    backgroundColor: palette.ivory,
    position: "relative",
    justifyContent: "center",
    alignItems: "center",
  },
  mainImage: {
    width: "90%",
    height: "90%",
  },
  floatingFavButton: {
    position: "absolute",
    bottom: spacing.lg,
    right: spacing.lg,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: palette.white,
    justifyContent: "center",
    alignItems: "center",
    ...shadow.elevated,
  },
  content: {
    padding: spacing.xl,
  },
  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: spacing.lg,
  },
  productCategory: {
    ...typography.caption,
    color: palette.gold,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  productName: {
    ...typography.hero,
    fontSize: 28,
    color: palette.textPrimary,
  },
  productPrice: {
    ...typography.price,
    fontSize: 20,
    color: palette.gold,
  },
  divider: {
    height: 1,
    backgroundColor: palette.divider,
    marginVertical: spacing.lg,
  },
  sectionTitle: {
    ...typography.h3,
    fontSize: 16,
    color: palette.textPrimary,
    marginBottom: spacing.sm,
    fontWeight: "600",
  },
  description: {
    ...typography.body,
    color: palette.textSecondary,
    lineHeight: 24,
    marginBottom: spacing.xl,
    fontWeight: "300",
  },
  specGrid: {
    flexDirection: "row",
    gap: spacing.xl,
    marginBottom: spacing.xl,
    padding: spacing.lg,
    backgroundColor: "#F9F8F3",
    borderRadius: radius.md,
  },
  specItem: {
    flex: 1,
  },
  specLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    marginBottom: 4,
  },
  specValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "500",
  },
  actionArea: {
    marginTop: spacing.md,
    gap: spacing.md,
  },
  conciergeBenefit: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "center",
    marginTop: spacing.xs,
    fontSize: 10,
    letterSpacing: 0.5,
  },
});
