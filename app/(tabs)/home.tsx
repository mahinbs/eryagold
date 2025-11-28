import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { AppHeader } from "../../components/AppHeader";
import {
  brandData,
  categoryData,
  footerContent,
  jewellerySpotlight,
  reasonsToTrust,
} from "../../constants/catalog";
import { palette, radius, spacing } from "../../constants/theme";

const heroSlides = [
  {
    title: "Bridal Polki Treasures",
    subtitle: "Uncut diamonds framed in 22K gold with emerald cascades.",
    image:
      "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Statement Cocktail Rings",
    subtitle: "Sculpted gemstones imagined for bold evenings.",
    image:
      "https://images.unsplash.com/photo-1524230572899-a752b3835840?auto=format&fit=crop&w=1200&q=80",
  },
  {
    title: "Heirloom Necklaces",
    subtitle: "Layered pearls meeting mirror-polished gold filigree.",
    image:
      "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=1200&q=80",
  },
];

const drawerSections = [
  {
    title: "Orders",
    items: ["Active Orders", "Order History", "Special Commissions"],
  },
  {
    title: "Browse Category",
    items: ["Necklaces", "Bridal Gallery", "Limited Editions"],
  },
  {
    title: "My Category",
    items: ["Saved Looks", "Wishlist Boards", "Compare Metals"],
  },
];

const legalLinks = [
  { label: "Privacy Policy", type: "privacy" },
  { label: "Terms & Conditions", type: "terms" },
] as const;

const { width } = Dimensions.get("window");

export default function Home() {
  const [activeSlide, setActiveSlide] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const drawerX = useRef(new Animated.Value(-width)).current;
  const router = useRouter();

  const toggleDrawer = () => setDrawerOpen((prev) => !prev);
  const goToProfile = () => {
    setDrawerOpen(false);
    router.push("/profile");
  };
  const openLegal = (type: (typeof legalLinks)[number]["type"]) => {
    setDrawerOpen(false);
    router.push({
      pathname: "/legal",
      params: { type },
    });
  };

  useEffect(() => {
    Animated.spring(drawerX, {
      toValue: drawerOpen ? 0 : -width,
      useNativeDriver: true,
    }).start();
  }, [drawerOpen, drawerX]);

  const carouselIndicators = useMemo(
    () =>
      heroSlides.map((_, index) => (
        <View
          key={`${index}`}
          style={[
            styles.indicatorDot,
            {
              backgroundColor:
                index === activeSlide ? palette.gold : "rgba(255,255,255,0.4)",
              width: index === activeSlide ? 28 : 10,
            },
          ]}
        />
      )),
    [activeSlide],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <AppHeader onMenuPress={toggleDrawer} />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: spacing.xl }}
        showsVerticalScrollIndicator={false}
      >
        <ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
            setActiveSlide(newIndex);
          }}
        >
          {heroSlides.map((slide, index) => (
            <View key={slide.title} style={styles.heroCard}>
              <Image source={{ uri: slide.image }} style={styles.heroImage} />
              <View style={styles.heroOverlay}>
                <Text style={styles.heroTitle}>{slide.title}</Text>
                <Text style={styles.heroSubtitle}>{slide.subtitle}</Text>
                <TouchableOpacity style={styles.heroButton}>
                  <Text style={styles.heroButtonText}>
                    {index === 0 ? "View Bridal Curation" : "Discover"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.indicatorRow}>{carouselIndicators}</View>

        <SectionHeader title="Jewellery Categories" action="View all" />
        <View style={styles.categoryGrid}>
          {categoryData.map((category) => (
            <TouchableOpacity
              key={category.label}
              style={styles.categoryCard}
              onPress={() =>
                router.push({
                  pathname: "/category",
                  params: { name: category.label },
                })
              }
            >
              <Text style={styles.categoryLabel}>{category.label}</Text>
              <Text style={styles.categoryPieces}>{category.pieces} designs</Text>
              <Feather name="arrow-right" size={16} color={palette.gold} />
            </TouchableOpacity>
          ))}
        </View>

        <SectionHeader title="Product Brands" action="Discover designers" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingBottom: spacing.sm }}>
          {brandData.map((brand) => (
            <View key={brand.name} style={styles.brandCard}>
              <Text style={styles.brandName}>{brand.name}</Text>
              <Text style={styles.brandTagline}>{brand.tagline}</Text>
            </View>
          ))}
        </ScrollView>

        <View style={styles.productGrid}>
          {jewellerySpotlight.map((piece) => (
            <View key={piece.name} style={styles.productCard}>
              <Image source={{ uri: piece.image }} style={styles.productImage} />
              <View style={styles.productOverlay}>
                <Text style={styles.productName}>{piece.name}</Text>
                <Text style={styles.productDetail}>{piece.detail}</Text>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="Why buy from us" />
        <View style={{ gap: spacing.md }}>
          {reasonsToTrust.map((reason) => (
            <View key={reason.title} style={styles.reasonCard}>
              <View style={styles.reasonBadge}>
                <Feather name="shield" size={18} color={palette.deepGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.reasonTitle}>{reason.title}</Text>
                <Text style={styles.reasonCopy}>{reason.copy}</Text>
              </View>
            </View>
          ))}
        </View>

        <SectionHeader title="Need quick assistance?" />
        <Pressable style={styles.whatsappBanner}>
          <View>
            <Text style={styles.bannerTitle}>WhatsApp Concierge</Text>
            <Text style={styles.bannerCopy}>
              Designers respond within 10 minutes for bespoke queries.
            </Text>
          </View>
          <Feather name="message-circle" size={32} color={palette.deepGreen} />
        </Pressable>

        <View style={styles.footer}>
          <View style={styles.footerRow}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerHeading}>Aurum Maison</Text>
              {footerContent.maison.map((line) => (
                <Text key={line} style={styles.footerCopy}>
                  {line}
                </Text>
              ))}
            </View>
            <View style={styles.footerColumn}>
              <Text style={styles.footerHeading}>Contact us</Text>
              {footerContent.contact.map((item) => (
                <Text key={item.label} style={styles.footerCopy}>
                  {item.label}: <Text style={styles.footerHighlight}>{item.value}</Text>
                </Text>
              ))}
            </View>
          </View>
          <View style={styles.footerRow}>
            <View style={styles.footerColumn}>
              <Text style={styles.footerHeading}>Client care</Text>
              {footerContent.support.map((line) => (
                <Text key={line} style={styles.footerCopy}>
                  {line}
                </Text>
              ))}
            </View>
            <View style={styles.footerColumn}>
              <Text style={styles.footerHeading}>Hours & socials</Text>
              {footerContent.hours.map((line) => (
                <Text key={line} style={styles.footerCopy}>
                  {line}
                </Text>
              ))}
              <View style={styles.socialRow}>
                {footerContent.socials.map((social) => (
                  <View key={social.label} style={styles.socialChip}>
                    <Feather name={social.icon as any} size={14} color={palette.gold} />
                    <Text style={styles.socialLabel}>{social.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
          <Text style={styles.footerFineprint}>
            © 2025 Aurum Maison · Crafted with 22K brilliance · enquiries@aurumatelier.com
          </Text>
        </View>
      </ScrollView>

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
          <View style={styles.profileBadge}>
            <Text style={styles.profileInitials}>AK</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.profileName}>Aria Kapoor</Text>
            <Text style={styles.profileMeta}>Heritage Club · Since 2018</Text>
          </View>
          <TouchableOpacity style={styles.profileAction} onPress={goToProfile}>
            <Text style={styles.profileActionLabel}>Edit</Text>
          </TouchableOpacity>
        </View>
        {drawerSections.map((section) => (
          <View key={section.title} style={styles.drawerSection}>
            <Text style={styles.drawerSectionTitle}>{section.title}</Text>
            {section.items.map((item) => (
              <TouchableOpacity key={item} style={styles.drawerItem}>
                <Text style={styles.drawerItemLabel}>{item}</Text>
                <Feather name="chevron-right" size={16} color={palette.paleGold} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        <View style={styles.legalSection}>
          {legalLinks.map((link) => (
            <TouchableOpacity
              key={link.type}
              style={styles.legalLink}
              onPress={() => openLegal(link.type)}
            >
              <Text style={styles.drawerItemLabel}>{link.label}</Text>
              <Feather name="external-link" size={14} color={palette.paleGold} />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton}>
          <Feather name="log-out" size={18} color={palette.deepGreen} />
          <Text style={styles.logoutLabel}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

const SectionHeader = ({
  title,
  action,
}: {
  title: string;
  action?: string;
}) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeading}>{title}</Text>
    {action && (
      <Text style={styles.sectionAction}>
        {action} <Feather name="arrow-up-right" size={14} color={palette.cream} />
      </Text>
    )}
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.deepGreen,
  },
  heroCard: {
    width,
    padding: spacing.md,
  },
  heroImage: {
    width: "100%",
    height: 280,
    borderRadius: radius.lg,
  },
  heroOverlay: {
    position: "absolute",
    left: spacing.md * 2,
    right: spacing.md * 2,
    bottom: spacing.lg,
    backgroundColor: "rgba(10,20,15,0.7)",
    padding: spacing.md,
    borderRadius: radius.lg,
  },
  heroTitle: {
    color: palette.paleGold,
    fontSize: 24,
    fontWeight: "700",
  },
  heroSubtitle: {
    color: palette.cream,
    marginVertical: spacing.xs,
    lineHeight: 22,
  },
  heroButton: {
    alignSelf: "flex-start",
    backgroundColor: palette.gold,
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  heroButtonText: {
    color: palette.deepGreen,
    fontWeight: "700",
  },
  indicatorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  indicatorDot: {
    height: 10,
    borderRadius: radius.full,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
  },
  sectionHeading: {
    color: palette.cream,
    fontSize: 20,
    fontWeight: "700",
  },
  sectionAction: {
    color: palette.paleGold,
    fontSize: 13,
  },
  categoryGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
  },
  categoryCard: {
    width: (width - spacing.md * 3) / 2,
    backgroundColor: palette.emerald,
    borderRadius: radius.md,
    padding: spacing.md,
    gap: spacing.xs,
  },
  categoryLabel: {
    color: palette.cream,
    fontSize: 16,
    fontWeight: "600",
  },
  categoryPieces: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  brandCard: {
    width: 220,
    marginLeft: spacing.md,
    marginRight: spacing.sm,
    padding: spacing.md,
    borderRadius: radius.md,
    backgroundColor: "#1d3b32",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.lg,
  },
  productCard: {
    width: (width - spacing.md * 3) / 2,
    borderRadius: radius.lg,
    overflow: "hidden",
  },
  productImage: {
    width: "100%",
    height: 200,
  },
  productOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: spacing.md,
    backgroundColor: "rgba(0,0,0,0.55)",
  },
  productName: {
    color: palette.cream,
    fontSize: 16,
    fontWeight: "700",
  },
  productDetail: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 13,
    marginTop: spacing.xs / 2,
  },
  brandName: {
    color: palette.gold,
    fontSize: 18,
    fontWeight: "700",
  },
  brandTagline: {
    color: palette.cream,
    marginTop: spacing.xs,
  },
  reasonCard: {
    flexDirection: "row",
    gap: spacing.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  reasonBadge: {
    width: 48,
    height: 48,
    borderRadius: radius.full,
    backgroundColor: palette.paleGold,
    alignItems: "center",
    justifyContent: "center",
  },
  reasonTitle: {
    color: palette.cream,
    fontSize: 16,
    fontWeight: "700",
  },
  reasonCopy: {
    color: "rgba(255,255,255,0.7)",
    marginTop: spacing.xs / 2,
    lineHeight: 20,
  },
  whatsappBanner: {
    margin: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: palette.gold,
    padding: spacing.lg,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  bannerTitle: {
    color: palette.deepGreen,
    fontSize: 18,
    fontWeight: "700",
  },
  bannerCopy: {
    color: palette.deepGreen,
    marginTop: spacing.xs,
    width: 220,
  },
  footer: {
    marginTop: spacing.lg,
    paddingHorizontal: spacing.md,
    paddingBottom: spacing.xl,
    gap: spacing.lg,
  },
  footerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.lg,
  },
  footerColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  footerHeading: {
    color: palette.paleGold,
    fontSize: 18,
    fontWeight: "700",
  },
  footerCopy: {
    color: "rgba(255,255,255,0.75)",
    fontSize: 14,
    lineHeight: 20,
  },
  footerHighlight: {
    color: palette.gold,
  },
  socialRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
  socialChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  socialLabel: {
    color: palette.cream,
    fontSize: 12,
  },
  footerFineprint: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 12,
    textAlign: "center",
    marginTop: spacing.sm,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  drawer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    width: width * 0.8,
    backgroundColor: palette.dusk,
    paddingTop: spacing.xl,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
    marginBottom: spacing.lg,
  },
  profileBadge: {
    width: 58,
    height: 58,
    borderRadius: radius.full,
    backgroundColor: palette.gold,
    alignItems: "center",
    justifyContent: "center",
  },
  profileInitials: {
    color: palette.deepGreen,
    fontSize: 20,
    fontWeight: "700",
  },
  profileName: {
    color: palette.cream,
    fontSize: 18,
    fontWeight: "700",
  },
  profileMeta: {
    color: "rgba(255,255,255,0.6)",
    fontSize: 13,
  },
  profileAction: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: palette.paleGold,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  profileActionLabel: {
    color: palette.paleGold,
    fontSize: 12,
    fontWeight: "600",
  },
  drawerSection: {
    marginBottom: spacing.lg,
  },
  drawerSectionTitle: {
    color: palette.paleGold,
    fontSize: 16,
    fontWeight: "600",
    marginBottom: spacing.sm,
  },
  drawerItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: spacing.sm,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.1)",
  },
  drawerItemLabel: {
    color: palette.cream,
    fontSize: 14,
  },
  legalSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    borderColor: "rgba(255,255,255,0.15)",
    paddingTop: spacing.md,
    gap: spacing.sm,
  },
  legalLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.xs,
  },
  logoutButton: {
    marginTop: "auto",
    backgroundColor: palette.gold,
    borderRadius: radius.full,
    paddingVertical: spacing.md,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: spacing.sm,
  },
  logoutLabel: {
    color: palette.deepGreen,
    fontWeight: "700",
  },
});

