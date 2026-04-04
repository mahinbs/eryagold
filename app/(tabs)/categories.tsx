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
import { getCategories, getDesigns } from "../../supabase/api";
import { animations, palette, radius, shadow, spacing, typography } from "../../constants/theme";

const { width } = Dimensions.get("window");

export default function CategoriesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: string) => {
    router.push({
      pathname: "/category",
      params: { name: category },
    });
  };

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
          <Text style={styles.title}>Categories</Text>
          <Text style={styles.subtitle}>Explore our collections</Text>
        </View>

        <View style={styles.categoriesGrid}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading collections...</Text>
            </View>
          ) : (
            categories.map((category, index) => (
              <CategoryCard
                key={category.id}
                category={category}
                index={index}
                onPress={() => handleCategoryPress(category.name)}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CategoryCard({
  category,
  index,
  onPress,
}: {
  category: any;
  index: number;
  onPress: () => void;
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

  const previewImage = category.image_url 
    ? { uri: category.image_url } 
    : require("../../assets/jawellery-images/jawelery-image-2.jpg");

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={styles.categoryCard}
        onPress={onPress}
        activeOpacity={0.9}
      >
        {previewImage && (
          <>
            <Image source={previewImage} style={styles.categoryImage} resizeMode="cover" />
            <View style={styles.categoryOverlay} />
          </>
        )}
        <View style={styles.categoryContent}>
          <Text style={styles.categoryName}>{category.name}</Text>
          <Text style={styles.categoryCount}>Explore Collection</Text>
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
  categoriesGrid: {
    paddingHorizontal: spacing.lg,
    gap: spacing.lg,
  },
  categoryCard: {
    width: "100%",
    height: 200,
    borderRadius: radius.md,
    overflow: "hidden",
    backgroundColor: palette.white,
    ...shadow.card,
  },
  categoryImage: {
    width: "100%",
    height: "100%",
  },
  categoryOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.12)",
  },
  categoryContent: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: spacing.lg,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
  },
  categoryName: {
    ...typography.h3,
    color: palette.gold,
    marginBottom: spacing.xs / 2,
  },
  categoryCount: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  loadingContainer: {
    padding: spacing.xl,
    alignItems: "center",
  },
  loadingText: {
    ...typography.body,
    color: palette.textSecondary,
  },
});

