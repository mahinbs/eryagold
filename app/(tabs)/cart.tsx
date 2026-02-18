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
  withTiming,
} from "react-native-reanimated";
import { AppHeader } from "../../components/AppHeader";
import { jewellerySpotlight } from "../../constants/catalog";
import { animations, palette, radius, shadow, spacing, typography } from "../../constants/theme";

const { width } = Dimensions.get("window");

// Mock cart data
const cartItems = [
  { ...jewellerySpotlight[0], quantity: 1, price: "₹4.8L" },
  { ...jewellerySpotlight[1], quantity: 1, price: "₹3.2L" },
];

export default function CartScreen() {
  const router = useRouter();
  const [items, setItems] = useState(cartItems);

  const total = items.reduce((sum, item) => {
    const price = parseFloat(item.price.replace("₹", "").replace("L", ""));
    return sum + price * item.quantity;
  }, 0);

  const handleQuantityChange = (itemName: string, delta: number) => {
    setItems(
      items.map((item) => {
        if (item.name === itemName) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const handleRemove = (itemName: string) => {
    setItems(items.filter((item) => item.name !== itemName));
  };

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="dark" />
        <AppHeader icon="back" showSearch={false} showWishlist={false} />
        <View style={styles.emptyContainer}>
          <Feather name="shopping-bag" size={64} color={palette.divider} />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add beautiful pieces to your cart
          </Text>
          <TouchableOpacity
            style={styles.emptyButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.emptyButtonText}>Browse Collections</Text>
          </TouchableOpacity>
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
          <Text style={styles.title}>Cart</Text>
          <Text style={styles.subtitle}>{items.length} items</Text>
        </View>

        <View style={styles.itemsList}>
          {items.map((item, index) => (
            <CartItemCard
              key={item.name}
              item={item}
              index={index}
              onQuantityChange={(delta) => handleQuantityChange(item.name, delta)}
              onRemove={() => handleRemove(item.name)}
            />
          ))}
        </View>

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>₹{total.toFixed(1)}L</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Shipping</Text>
            <Text style={styles.summaryValue}>Free</Text>
          </View>
          <View style={[styles.summaryRow, styles.totalRow]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>₹{total.toFixed(1)}L</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkoutButton} activeOpacity={0.9}>
          <Text style={styles.checkoutButtonText}>Checkout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function CartItemCard({
  item,
  index,
  onQuantityChange,
  onRemove,
}: {
  item: typeof cartItems[0];
  index: number;
  onQuantityChange: (delta: number) => void;
  onRemove: () => void;
}) {
  const translateY = useSharedValue(animations.pageLoad.slide);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * animations.cardStagger;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: animations.normal });
      translateY.value = withTiming(0, { duration: animations.normal });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <View style={styles.cartItem}>
        <Image source={item.image} style={styles.cartItemImage} resizeMode="cover" />
        <View style={styles.cartItemInfo}>
          <Text style={styles.cartItemName} numberOfLines={2}>
            {item.name}
          </Text>
          <Text style={styles.cartItemDetail} numberOfLines={1}>
            {item.detail}
          </Text>
          <Text style={styles.cartItemPrice}>{item.price}</Text>
          <View style={styles.quantityRow}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onQuantityChange(-1)}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={16} color={palette.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.quantityValue}>{item.quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => onQuantityChange(1)}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={16} color={palette.textPrimary} />
            </TouchableOpacity>
          </View>
        </View>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={onRemove}
          activeOpacity={0.7}
        >
          <Feather name="x" size={20} color={palette.textSecondary} />
        </TouchableOpacity>
      </View>
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
  itemsList: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
    marginBottom: spacing.xl,
  },
  cartItem: {
    flexDirection: "row",
    backgroundColor: palette.white,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.md,
    ...shadow.card,
  },
  cartItemImage: {
    width: 100,
    height: 100,
    borderRadius: radius.sm,
    backgroundColor: palette.divider,
  },
  cartItemInfo: {
    flex: 1,
    gap: spacing.xs,
  },
  cartItemName: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "400",
  },
  cartItemDetail: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  cartItemPrice: {
    ...typography.body,
    color: palette.gold,
    fontWeight: "400",
    marginTop: spacing.xs,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: palette.divider,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityValue: {
    ...typography.body,
    color: palette.textPrimary,
    minWidth: 24,
    textAlign: "center",
  },
  removeButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  summary: {
    backgroundColor: palette.white,
    marginHorizontal: spacing.lg,
    padding: spacing.lg,
    borderRadius: radius.md,
    gap: spacing.md,
    marginBottom: spacing.lg,
    ...shadow.card,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  summaryLabel: {
    ...typography.body,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  summaryValue: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "400",
  },
  totalRow: {
    paddingTop: spacing.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
    marginTop: spacing.xs,
  },
  totalLabel: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  totalValue: {
    ...typography.h3,
    color: palette.gold,
  },
  checkoutButton: {
    backgroundColor: palette.gold,
    marginHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutButtonText: {
    ...typography.body,
    color: palette.white,
    fontWeight: "400",
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
    marginBottom: spacing.xl,
  },
  emptyButton: {
    backgroundColor: palette.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
  },
  emptyButtonText: {
    ...typography.body,
    color: palette.white,
    fontWeight: "400",
  },
});

