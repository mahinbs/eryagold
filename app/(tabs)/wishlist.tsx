import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
} from "react-native";
import Animated, {
    useAnimatedStyle,
    useSharedValue,
    withSequence,
    withTiming,
} from "react-native-reanimated";
import { AppHeader } from "../../components/AppHeader";
import { jewellerySpotlight } from "../../constants/catalog";
import { animations, palette, radius, shadow, spacing, typography } from "../../constants/theme";

const { width } = Dimensions.get("window");

// Mock wishlist data - in real app, this would come from state/API
const wishlistItems = jewellerySpotlight.slice(0, 3);

export default function WishlistScreen() {
  const router = useRouter();
  const [items, setItems] = useState(wishlistItems);

  const handleRemove = (itemName: string) => {
    setItems(items.filter((item) => item.name !== itemName));
  };

  const handleProductPress = (product: typeof jewellerySpotlight[0]) => {
    router.push({
      pathname: "/product-details",
      params: { name: product.name },
    });
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AppHeader icon="back" showSearch={false} showWishlist={false} />
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={64} color={palette.divider} />
          <Text style={styles.emptyTitle}>Save pieces you love</Text>
          <Text style={styles.emptySubtitle}>
            Tap the heart icon to add items to your wishlist
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader icon="back" showSearch={false} showWishlist={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Wishlist</Text>
          <Text style={styles.subtitle}>{items.length} items</Text>
        </View>

        <View style={styles.productsGrid}>
          {items.map((product, index) => (
            <WishlistProductCard
              key={product.name}
              product={product}
              index={index}
              onPress={() => handleProductPress(product)}
              onRemove={() => handleRemove(product.name)}
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function WishlistProductCard({
  product,
  index,
  onPress,
  onRemove,
}: {
  product: typeof jewellerySpotlight[0];
  index: number;
  onPress: () => void;
  onRemove: () => void;
}) {
  const translateY = useSharedValue(animations.pageLoad.slide);
  const opacity = useSharedValue(0);
  const heartScale = useSharedValue(1);

  useEffect(() => {
    const delay = index * animations.cardStagger;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: animations.normal });
      translateY.value = withTiming(0, { duration: animations.normal });
    }, delay);
  }, []);

  const handleHeartPress = () => {
    heartScale.value = withSequence(
      withTiming(1.2, { duration: animations.wishlistRipple }),
      withTiming(1, { duration: animations.wishlistRipple })
    );
    setTimeout(onRemove, animations.wishlistRipple);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  const heartAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: heartScale.value }],
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={product.image} style={styles.productImage} resizeMode="cover" />
        <Animated.View style={[styles.heartButton, heartAnimatedStyle]}>
          <TouchableOpacity onPress={handleHeartPress} activeOpacity={0.7}>
            <Feather name="heart" size={20} color={palette.gold} fill={palette.gold} />
          </TouchableOpacity>
        </Animated.View>
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productDetail} numberOfLines={1}>
            {product.detail}
          </Text>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.ivory,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: spacing.xl,
  },
  title: {
    ...typography.h1,
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    ...typography.body,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  productsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  productCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    height: 300, // Fixed height for all cards
    backgroundColor: palette.white,
    borderRadius: radius.md,
    overflow: "hidden",
    ...shadow.card,
  },
  productImage: {
    width: "100%",
    height: 180, // Reduced image height to show content
    backgroundColor: palette.divider,
  },
  heartButton: {
    position: "absolute",
    top: spacing.md,
    right: spacing.md,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    alignItems: "center",
    justifyContent: "center",
  },
  productInfo: {
    padding: spacing.md,
    flex: 1,
    justifyContent: "space-between",
    minHeight: 100, // Ensure enough space for content
  },
  productName: {
    ...typography.body,
    color: palette.textPrimary,
    marginBottom: spacing.xs,
    fontWeight: "400",
  },
  productDetail: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: spacing.xl,
  },
  emptyTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    marginTop: spacing.lg,
    marginBottom: spacing.xs,
  },
  emptySubtitle: {
    ...typography.body,
    color: palette.textSecondary,
    textAlign: "center",
    fontWeight: "300",
  },
});

