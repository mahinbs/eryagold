import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import { palette, spacing, typography } from "../constants/theme";

export default function AboutScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.title}>Our Story</Text>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>SINCE 1995</Text>
          </View>
        </View>

        <View style={styles.imageContainer}>
          <Image 
            source={require("../assets/jawellery-images/jawelery-image-2.jpg")} 
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>The Legacy of Erya Gold</Text>
          <Text style={styles.paragraph}>
            Erya Gold was born from a passion for timeless elegance and uncompromising craftsmanship. 
            For over two decades, we have been curators of the finest jewellery, blending traditional 
            heritage with contemporary design.
          </Text>
          <Text style={styles.paragraph}>
            Every piece in our collection is a testament to the skill of our master artisans, who 
            meticulously craft each detail to perfection. We believe that jewellery is more than an 
            accessory—it is a story, a memory, and a legacy to be passed down through generations.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.heading}>Our Promise</Text>
          <View style={styles.promiseItem}>
            <Text style={styles.promiseTitle}>Unmatched Quality</Text>
            <Text style={styles.promiseText}>
              We source only the most exquisite materials and stones, ensuring that every Erya Gold 
              piece meets our rigorous standards of quality and brilliance.
            </Text>
          </View>
          <View style={styles.promiseItem}>
            <Text style={styles.promiseTitle}>Ethical Craftsmanship</Text>
            <Text style={styles.promiseText}>
              Sustainability and fair practices are at the heart of our operations. We work closely 
              with our partners to ensure responsible sourcing.
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you for being part of our journey.</Text>
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
  content: {
    paddingBottom: spacing.xxl,
  },
  hero: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    alignItems: "center",
    backgroundColor: palette.white,
  },
  title: {
    ...typography.hero,
    color: palette.textPrimary,
    marginBottom: spacing.sm,
  },
  badge: {
    borderWidth: 1,
    borderColor: palette.gold,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    ...typography.caption,
    color: palette.gold,
    letterSpacing: 2,
    fontWeight: "600",
  },
  imageContainer: {
    width: "100%",
    height: 300,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  section: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  heading: {
    ...typography.h2,
    color: palette.gold,
    marginBottom: spacing.lg,
    textAlign: "center",
  },
  paragraph: {
    ...typography.body,
    color: palette.textPrimary,
    lineHeight: 26,
    marginBottom: spacing.md,
    textAlign: "justify",
    fontWeight: "300",
  },
  promiseItem: {
    marginBottom: spacing.xl,
  },
  promiseTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  promiseText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    lineHeight: 22,
    fontWeight: "300",
  },
  footer: {
    paddingVertical: spacing.xxl,
    alignItems: "center",
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: palette.divider,
    marginHorizontal: spacing.lg,
  },
  footerText: {
    ...typography.caption,
    color: palette.textSecondary,
    fontStyle: "italic",
  },
});
