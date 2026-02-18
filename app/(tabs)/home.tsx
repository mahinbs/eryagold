import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import AnimatedComponent, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { AppHeader } from "../../components/AppHeader";
import { jewellerySpotlight } from "../../constants/catalog";
import { animations, palette, radius, shadow, spacing, typography } from "../../constants/theme";

const { width } = Dimensions.get("window");

// Hero Banner Slides with Content
const heroSlides = [
  {
    image: require("../../assets/jawellery-images/Gold-neckles.jpg"),
    title: "Bridal Polki Treasures",
    subtitle: "Uncut diamonds framed in 22K gold with emerald cascades.",
  },
  {
    image: require("../../assets/jawellery-images/gold-bangle.jpg"),
    title: "Statement Cocktail Rings",
    subtitle: "Sculpted gemstones imagined for bold evenings.",
  },
  {
    image: require("../../assets/jawellery-images/necklace-2.jpeg"),
    title: "Heirloom Necklaces",
    subtitle: "Layered pearls meeting mirror-polished gold filigree.",
  },
];

// Featured Collections
const featuredCollections = [
  {
    name: "Bridal Collection",
    image: require("../../assets/jawellery-images/jawelery-image-2.jpg"),
  },
  {
    name: "Daily Wear",
    image: require("../../assets/jawellery-images/jawellery-12.jpg"),
  },
  {
    name: "Statement Pieces",
    image: require("../../assets/jawellery-images/jawellery-13.jpg"),
  },
];

// Browse Category Items (from old sidebar)
const browseCategoryItems = [
  "Necklaces",
  "Rings",
  "Bangles",
  "Earrings",
  "Bridal Sets",
  "Men's Edit",
];

// Drawer Menu Items (old sidebar)
const drawerMenuItems = [
  "Shortlist",
  "Customer Order",
  "My Catalogue",
  "Call Us",
];

// Category Type Options
const categoryTypeOptions: Record<string, string[]> = {
  Necklaces: ["All", "Long", "Short", "Pendant"],
  Rings: ["All", "Solitaire", "Cocktail", "Bands"],
  Bangles: ["All", "Kadas", "Stacks"],
  Earrings: ["All", "Studs", "Chandbalis", "Drops"],
  "Bridal Sets": ["All", "Necklace Set", "Full Bridal"],
  "Men's Edit": ["All", "Rings", "Accessories"],
};

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [categoryToConfigure, setCategoryToConfigure] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const router = useRouter();
  const heroScrollRef = useRef<ScrollView>(null);
  const drawerX = useRef(new Animated.Value(-width)).current;

  // Calculate card width for carousel
  const cardWidth = width - spacing.lg * 2;
  const cardWithMargin = cardWidth + spacing.lg;

  // Auto-scroll hero banner
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => {
        const next = (prev + 1) % heroSlides.length;
        heroScrollRef.current?.scrollTo({
          x: next * cardWithMargin,
          animated: true,
        });
        return next;
      });
    }, 4000);
    return () => clearInterval(interval);
  }, [cardWithMargin]);

  // Drawer animation
  useEffect(() => {
    Animated.spring(drawerX, {
      toValue: drawerOpen ? 0 : -width,
      useNativeDriver: true,
      tension: 50,
      friction: 7,
    }).start();
  }, [drawerOpen, drawerX]);

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  const handleProductPress = (product: typeof jewellerySpotlight[0]) => {
    router.push({
      pathname: "/product-details",
      params: { name: product.name },
    });
  };

  const handleCategoryPress = (category: string) => {
    // Check if category has type options
    if (categoryTypeOptions[category] && categoryTypeOptions[category].length > 1) {
      setCategoryToConfigure(category);
      setSelectedType("All");
      setCategoryModalVisible(true);
    } else {
      // Navigate directly if no type options
      router.push({
        pathname: "/category",
        params: { name: category },
      });
    }
  };

  const handleCategoryContinue = () => {
    if (categoryToConfigure) {
      router.push({
        pathname: "/category",
        params: {
          name: categoryToConfigure,
          type: selectedType ?? "All",
        },
      });
    }
    setCategoryModalVisible(false);
  };

  const handleCollectionPress = (collection: typeof featuredCollections[0]) => {
    router.push({
      pathname: "/category",
      params: { name: collection.name },
    });
  };

  const goToProfile = () => {
    setDrawerOpen(false);
    router.push("/(tabs)/profile");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader onMenuPress={toggleDrawer} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner - Card Shaped Carousel */}
        <View style={styles.heroCardContainer}>
          <ScrollView
            ref={heroScrollRef}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(event.nativeEvent.contentOffset.x / cardWithMargin);
              setActiveSlide(newIndex);
            }}
            scrollEventThrottle={16}
            contentContainerStyle={styles.heroScrollContent}
            decelerationRate="fast"
            snapToInterval={cardWithMargin}
            snapToAlignment="start"
          >
            {heroSlides.map((slide, index) => (
              <HeroSlideCard 
                key={index} 
                slide={slide} 
                index={index}
                cardWidth={cardWidth}
              />
            ))}
          </ScrollView>
          <View style={styles.indicatorRow}>
            {heroSlides.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicatorDot,
                  index === activeSlide && styles.indicatorDotActive,
                ]}
              />
            ))}
          </View>
        </View>

        {/* Browse Category Cards - Premium Design */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
          </View>
          <View style={styles.browseCategoryGrid}>
            {browseCategoryItems.map((category, index) => (
              <BrowseCategoryCard
                key={category}
                category={category}
                index={index}
                onPress={() => handleCategoryPress(category)}
              />
            ))}
          </View>
        </View>

        {/* Featured Collections - Horizontal Scroll */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Collections</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/categories")}>
              <Text style={styles.sectionAction}>See all</Text>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.collectionsScroll}
          >
            {featuredCollections.map((collection, index) => (
              <CollectionCard
                key={collection.name}
                collection={collection}
                index={index}
                onPress={() => handleCollectionPress(collection)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Best Sellers - 2 Column Grid */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Best Sellers</Text>
          </View>
          <View style={styles.productGrid}>
            {jewellerySpotlight.map((product, index) => (
              <ProductCard
                key={product.name}
                product={product}
                index={index}
                onPress={() => handleProductPress(product)}
              />
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Old Sidebar Drawer */}
      {drawerOpen && <Pressable style={styles.overlay} onPress={toggleDrawer} />}
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: drawerX }],
          },
        ]}
      >
        <View style={styles.drawerHeader}>
          <Text style={styles.welcomeText}>WELCOME</Text>
          <View style={styles.drawerHeaderContent}>
            <Text style={styles.drawerUserName}>Md Sahil</Text>
            <TouchableOpacity style={styles.editButton} onPress={goToProfile}>
              <Text style={styles.editButtonText}>Edit</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.drawerMenu}>
          {drawerMenuItems.map((item) => (
            <TouchableOpacity key={item} style={styles.drawerMenuItem}>
              <Text style={styles.drawerMenuItemLabel}>{item}</Text>
              <Feather name="chevron-right" size={18} color={palette.gold} />
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.drawerSection}>
          <Text style={styles.drawerSectionTitle}>Browse Category</Text>
          {browseCategoryItems.map((item) => (
            <TouchableOpacity
              key={item}
              style={styles.drawerMenuItem}
              onPress={() => {
                setDrawerOpen(false);
                router.push({
                  pathname: "/category",
                  params: { name: item },
                });
              }}
            >
              <Text style={styles.drawerMenuItemLabel}>{item}</Text>
              <Feather name="chevron-right" size={18} color={palette.gold} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Category Type Modal */}
      <Modal
        visible={categoryModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay} 
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>{categoryToConfigure}</Text>
            <ScrollView style={styles.modalList}>
              {categoryToConfigure &&
                (categoryTypeOptions[categoryToConfigure] ?? ["All"]).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.modalItem,
                      selectedType === type && styles.modalItemSelected,
                    ]}
                    onPress={() => setSelectedType(type)}
                  >
                    <Text
                      style={[
                        styles.modalItemLabel,
                        selectedType === type && styles.modalItemLabelSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setCategoryModalVisible(false)}
              >
                <Text style={styles.modalButtonSecondaryLabel}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonPrimary]}
                onPress={handleCategoryContinue}
              >
                <Text style={styles.modalButtonPrimaryLabel}>Continue</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

// Hero Slide Card Component (Card Shaped)
function HeroSlideCard({ 
  slide, 
  index, 
  cardWidth 
}: { 
  slide: typeof heroSlides[0]; 
  index: number;
  cardWidth: number;
}) {
  const scale = useSharedValue(1.05);
  const opacity = useSharedValue(0);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: animations.normal });
    scale.value = withSpring(1.0, { damping: 15, stiffness: 100 });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedComponent.View 
      style={[
        styles.heroSlideCard, 
        { width: cardWidth },
        animatedStyle
      ]}
    >
      <Image source={slide.image} style={styles.heroImage} resizeMode="cover" />
    </AnimatedComponent.View>
  );
}

// Browse Category Card - Premium Design
function BrowseCategoryCard({
  category,
  index,
  onPress,
}: {
  category: string;
  index: number;
  onPress: () => void;
}) {
  const translateY = useSharedValue(30);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const delay = index * 80;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: 500 });
      translateY.value = withSpring(0, { damping: 12, stiffness: 100 });
      scale.value = withSpring(1, { damping: 12, stiffness: 100 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedComponent.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.browseCategoryCard}
        onPress={onPress}
        activeOpacity={0.85}
      >
        <View style={styles.browseCategoryIconContainer}>
          <Feather name="zap" size={24} color={palette.gold} />
        </View>
        <Text style={styles.browseCategoryName}>{category}</Text>
        <View style={styles.browseCategoryArrow}>
          <Feather name="arrow-right" size={16} color={palette.gold} />
        </View>
      </TouchableOpacity>
    </AnimatedComponent.View>
  );
}

// Collection Card Component
function CollectionCard({
  collection,
  index,
  onPress,
}: {
  collection: typeof featuredCollections[0];
  index: number;
  onPress: () => void;
}) {
  const translateY = useSharedValue(animations.pageLoad.slide);
  const opacity = useSharedValue(0);

  useEffect(() => {
    const delay = index * animations.cardStagger;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: animations.normal });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedComponent.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.collectionCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={collection.image} style={styles.collectionImage} resizeMode="cover" />
        <View style={styles.collectionOverlay} />
        <Text style={styles.collectionName}>{collection.name}</Text>
      </TouchableOpacity>
    </AnimatedComponent.View>
  );
}

// Product Card Component
function ProductCard({
  product,
  index,
  onPress,
}: {
  product: typeof jewellerySpotlight[0];
  index: number;
  onPress: () => void;
}) {
  const translateY = useSharedValue(animations.pageLoad.slide);
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.95);

  useEffect(() => {
    const delay = index * animations.cardStagger;
    setTimeout(() => {
      opacity.value = withTiming(1, { duration: animations.normal });
      translateY.value = withSpring(0, { damping: 15, stiffness: 100 });
      scale.value = withSpring(1, { damping: 15, stiffness: 100 });
    }, delay);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }, { scale: scale.value }],
    opacity: opacity.value,
  }));

  return (
    <AnimatedComponent.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={product.image} style={styles.productImage} resizeMode="cover" />
        <View style={styles.productInfo}>
          <Text style={styles.productName} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.productPrice} numberOfLines={1}>
            {product.detail}
          </Text>
        </View>
      </TouchableOpacity>
    </AnimatedComponent.View>
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
  // Hero Banner - Card Shaped
  heroCardContainer: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    marginBottom: spacing.xl,
    height: 280,
  },
  heroScrollContent: {
    paddingRight: spacing.lg,
  },
  heroSlideCard: {
    height: 280,
    borderRadius: radius.lg,
    overflow: "hidden",
    backgroundColor: palette.white,
    marginRight: spacing.lg,
    ...shadow.elevated,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  indicatorRow: {
    position: "absolute",
    bottom: spacing.md,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
  },
  indicatorDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(198, 162, 77, 0.3)",
  },
  indicatorDotActive: {
    width: 24,
    backgroundColor: palette.gold,
  },
  // Sections
  section: {
    marginBottom: spacing.xl,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.textPrimary,
  },
  sectionAction: {
    ...typography.bodySmall,
    color: palette.gold,
  },
  // Browse Category Cards - Premium
  browseCategoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  browseCategoryCard: {
    width: (width - spacing.lg * 2 - spacing.md) / 2,
    backgroundColor: palette.white,
    borderRadius: radius.md,
    padding: spacing.lg,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 140,
    borderWidth: 1,
    borderColor: palette.divider,
    ...shadow.card,
  },
  browseCategoryIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: palette.ivory,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: spacing.md,
  },
  browseCategoryName: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "400",
    textAlign: "center",
    marginBottom: spacing.xs,
  },
  browseCategoryArrow: {
    marginTop: spacing.xs,
  },
  // Featured Collections
  collectionsScroll: {
    paddingHorizontal: spacing.lg,
    gap: spacing.md,
  },
  collectionCard: {
    width: 280,
    height: 200,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: palette.white,
    ...shadow.card,
  },
  collectionImage: {
    width: "100%",
    height: "100%",
  },
  collectionOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  collectionName: {
    position: "absolute",
    bottom: spacing.md,
    left: spacing.md,
    right: spacing.md,
    ...typography.h3,
    color: palette.gold,
  },
  // Best Sellers Grid
  productGrid: {
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
  productPrice: {
    ...typography.bodySmall,
    color: palette.gold,
    fontWeight: "400",
  },
  // Drawer - Old Sidebar
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.75,
    backgroundColor: palette.ivory,
    paddingTop: spacing.xl + 20,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    ...shadow.elevated,
  },
  drawerHeader: {
    marginBottom: spacing.xl,
  },
  welcomeText: {
    fontSize: 16,
    fontWeight: "500",
    color: palette.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    fontFamily: "serif",
  },
  drawerHeaderContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  drawerUserName: {
    fontSize: 18,
    fontWeight: "500",
    color: palette.textPrimary,
    fontFamily: "serif",
  },
  editButton: {
    backgroundColor: palette.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  editButtonText: {
    color: palette.white,
    fontSize: 14,
    fontWeight: "600",
  },
  drawerMenu: {
    gap: 0,
    marginBottom: spacing.lg,
  },
  drawerMenuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  drawerMenuItemLabel: {
    fontSize: 15,
    fontWeight: "300",
    color: palette.textPrimary,
  },
  drawerSection: {
    marginTop: spacing.md,
  },
  drawerSectionTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: palette.textPrimary,
    marginBottom: spacing.sm,
    letterSpacing: 0.5,
    fontFamily: "serif",
  },
  // Category Type Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    paddingHorizontal: spacing.md,
  },
  modalContainer: {
    backgroundColor: palette.white,
    borderRadius: radius.xl,
    padding: spacing.xl,
    maxHeight: "80%",
    ...shadow.elevated,
  },
  modalTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: spacing.md,
  },
  modalList: {
    maxHeight: 260,
  },
  modalItem: {
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  modalItemSelected: {
    backgroundColor: palette.ivory,
  },
  modalItemLabel: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "300",
  },
  modalItemLabelSelected: {
    fontWeight: "400",
    color: palette.gold,
  },
  modalActions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: spacing.sm,
    marginTop: spacing.lg,
  },
  modalButton: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
  },
  modalButtonSecondary: {
    backgroundColor: palette.ivory,
  },
  modalButtonPrimary: {
    backgroundColor: palette.gold,
  },
  modalButtonSecondaryLabel: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "400",
  },
  modalButtonPrimaryLabel: {
    ...typography.body,
    color: palette.white,
    fontWeight: "400",
  },
});
