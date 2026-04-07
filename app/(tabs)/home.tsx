import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, Dimensions, Image as RNImage, Modal, Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
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

// Featured Collections (Initial empty, will be fetched)
// const featuredCollections = [ ... ];

// Category tags are now fetched dynamic from Supabase Categories table

// Drawer Menu Items (old sidebar)
const drawerMenuItems = [
  "Shortlist",
  "Customer Order",
  "My Catalogue",
  "Call Us",
];

// Category tags are now fetched from Supabase
// const categoryTypeOptions = { ... };

import { getDesigns, getFeaturedCollections, getCategories, getDistinctMaterials } from "../../supabase/api";
import { useWishlist } from "../context/WishlistContext";

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [materialModalVisible, setMaterialModalVisible] = useState(false);
  const [categoryToConfigure, setCategoryToConfigure] = useState<string | null>(null);
  const [materials, setMaterials] = useState<string[]>([]);
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [designs, setDesigns] = useState<any[]>([]);
  const [featuredCollections, setFeaturedCollections] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const router = useRouter();
  const heroScrollRef = useRef<ScrollView>(null);
  const drawerX = useRef(new Animated.Value(-width)).current;

  // Calculate card width for carousel
  const cardWidth = width - spacing.lg * 2;
  const cardWithMargin = cardWidth + spacing.lg;

  // Fetch data from Supabase
  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [designsData, collectionsData, categoriesData] = await Promise.all([
          getDesigns(),
          getFeaturedCollections(),
          getCategories()
        ]);
        setDesigns(designsData || []);
        setFeaturedCollections(collectionsData || []);
        setCategories(categoriesData || []);
      } catch (error) {
        console.error("Error fetching home data:", error);
      }
    };
    fetchHomeData();
  }, []);

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

  const handleProductPress = (product: any) => {
    router.push({
      pathname: "/product-details",
      params: { designId: product.id },
    });
  };

  const handleCategoryPress = async (categoryName: string) => {
    setCategoryToConfigure(categoryName);
    try {
      const distinctMaterials = await getDistinctMaterials(categoryName);
      if (distinctMaterials.length > 0) {
        setMaterials(distinctMaterials as string[]);
        setMaterialModalVisible(true);
      } else {
        // No materials? Check for tags or go straight
        const selectedCategory = categories.find(c => c.name === categoryName);
        const availableTags = selectedCategory?.tags || [];
        if (availableTags.length > 0) {
          setSelectedMaterial(null);
          setCategoryModalVisible(true);
        } else {
          router.push({
            pathname: "/category",
            params: { name: categoryName },
          });
        }
      }
    } catch (error) {
       console.error("Error fetching materials:", error);
       router.push({
         pathname: "/category",
         params: { name: categoryName },
       });
    }
  };

  const handleMaterialSelect = (material: string) => {
    setSelectedMaterial(material);
    setMaterialModalVisible(false);
    
    // Check if category has tags
    const selectedCategory = categories.find(c => c.name === categoryToConfigure);
    const availableTags = selectedCategory?.tags || [];

    if (availableTags.length > 0) {
      setSelectedType("All");
      setCategoryModalVisible(true);
    } else {
      router.push({
        pathname: "/category",
        params: { 
          name: categoryToConfigure!,
          material: material
        },
      });
    }
  };

  const handleCategoryContinue = () => {
    if (categoryToConfigure) {
      router.push({
        pathname: "/category",
        params: {
          name: categoryToConfigure,
          tag: selectedType ?? "All",
          material: selectedMaterial ?? "",
        },
      });
    }
    setCategoryModalVisible(false);
  };

  const handleCollectionPress = (collection: any) => {
    router.push({
      pathname: "/category",
      params: { 
        name: collection.name,
        collectionId: collection.id
      },
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
            {categories.map((category, index) => (
              <BrowseCategoryCard
                key={category.id}
                category={category.name}
                index={index}
                onPress={() => handleCategoryPress(category.name)}
              />
            ))}
            {categories.length === 0 && (
              <View style={{ padding: 20, alignItems: 'center', width: '100%' }}>
                <Text style={{ color: palette.textSecondary }}>No categories defined.</Text>
              </View>
            )}
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
            {designs.map((product, index) => (
              <ProductCard
                key={product.id}
                product={product}
                index={index}
                onPress={() => handleProductPress(product)}
              />
            ))}
            {designs.length === 0 && (
              <View style={{ padding: 20, alignItems: 'center', width: '100%' }}>
                <Text style={{ color: palette.textSecondary }}>No designs found.</Text>
              </View>
            )}
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
          {categories.map((category: any) => (
            <TouchableOpacity
              key={category.id}
              style={styles.drawerMenuItem}
              onPress={() => {
                setDrawerOpen(false);
                router.push({
                  pathname: "/category",
                  params: { name: category.name },
                });
              }}
            >
              <Text style={styles.drawerMenuItemLabel}>{category.name}</Text>
              <Feather name="chevron-right" size={18} color={palette.gold} />
            </TouchableOpacity>
          ))}
        </View>
      </Animated.View>

      {/* Material Selection Modal */}
      <Modal
        visible={materialModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setMaterialModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Select Material</Text>
            <ScrollView style={styles.modalList}>
              {materials.map((m) => (
                <TouchableOpacity
                  key={m}
                  style={styles.modalItem}
                  onPress={() => handleMaterialSelect(m)}
                >
                  <Text style={styles.modalItemLabel}>{m}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButton, styles.modalButtonSecondary]}
                onPress={() => setMaterialModalVisible(false)}
              >
                <Text style={styles.modalButtonSecondaryLabel}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Category Type Selection Modal */}
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
              <TouchableOpacity
                style={[
                  styles.modalItem,
                  selectedType === "All" && styles.modalItemSelected,
                ]}
                onPress={() => setSelectedType("All")}
              >
                <Text
                  style={[
                    styles.modalItemLabel,
                    selectedType === "All" && styles.modalItemLabelSelected,
                  ]}
                >
                  Show All
                </Text>
              </TouchableOpacity>
              
              {categoryToConfigure &&
                (categories.find(c => c.name === categoryToConfigure)?.tags || []).map((type: string) => (
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
      <Image source={slide.image} style={styles.heroImage} contentFit="cover" transition={300} />
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
  collection: any;
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
        {collection.image_url ? (
          <Image source={{ uri: collection.image_url }} style={styles.collectionImage} contentFit="cover" transition={300} />
        ) : (
          <View style={[styles.collectionImage, { backgroundColor: palette.divider, alignItems: 'center', justifyContent: 'center' }]}>
            <Feather name="image" size={40} color={palette.gold} />
          </View>
        )}
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
  product: any;
  index: number;
  onPress: () => void;
}) {
  const { wishlistIds, toggleItem } = useWishlist();
  const isWishlisted = wishlistIds.includes(product.id);
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

  const imageSource = product.image_url 
    ? { uri: product.image_url } 
    : require("../../assets/jawellery-images/jawelery-image-2.jpg");

  return (
    <AnimatedComponent.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.productCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <View style={{ position: 'relative' }}>
          <Image 
            source={imageSource} 
            style={styles.productImage} 
            contentFit="contain"
            transition={300}
          />
          <TouchableOpacity 
            style={styles.favButton}
            onPress={() => toggleItem(product.id)}
          >
            <Feather 
              name={isWishlisted ? "heart" : "heart"} 
              size={18} 
              color={palette.gold} 
              fill={isWishlisted ? palette.gold : "transparent"}
            />
          </TouchableOpacity>
        </View>
        <View style={styles.productInfo}>
          <View>
            <Text style={styles.productCategory} numberOfLines={1}>
              {product.material || (product.category === 'Necklaces' ? '22K Polki' : 'Fine Jewellery')}
            </Text>
            <Text style={styles.productName} numberOfLines={1}>
              {product.name}
            </Text>
          </View>
          <Text style={styles.productPrice}>{product.price || 'P.O.E.'}</Text>
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
  productInfo: {
    padding: spacing.md,
    flex: 1,
    justifyContent: "space-between",
    minHeight: 100, // Ensure enough space for content
  },
  productCategory: {
    ...typography.caption,
    fontSize: 10,
    color: palette.gold,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 2,
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
