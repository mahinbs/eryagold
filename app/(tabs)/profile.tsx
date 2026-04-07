import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { palette, spacing, typography } from "../../constants/theme";

// MYSA-STYLE PROFILE
// Typography-led layout
// No clutter, no cards overload
// Sections: Orders, Saved Addresses, Wishlist, Support, About Erya Gold

const profileSections = [
  {
    title: "Orders",
    items: [
      { label: "All Orders", icon: "package", route: "/orders" },
      { label: "Pending Orders", icon: "clock", route: "/orders?status=pending" },
      { label: "Completed Orders", icon: "check-circle", route: "/orders?status=completed" },
    ],
  },
  {
    title: "Saved Addresses",
    items: [
      { label: "Manage Addresses", icon: "map-pin", route: "/addresses" },
    ],
  },
  {
    title: "Wishlist",
    items: [
      { label: "View Wishlist", icon: "heart", route: "/(tabs)/wishlist" },
    ],
  },
  {
    title: "Support",
    items: [
      { label: "Help Center", icon: "help-circle", route: "/help" },
      { label: "Contact Us", icon: "mail", route: "/contact" },
    ],
  },
  {
    title: "About Erya Gold",
    items: [
      { label: "Our Story", icon: "book-open", route: "/about" },
      { label: "Terms & Conditions", icon: "file-text", route: "/legal?type=terms" },
      { label: "Privacy Policy", icon: "shield", route: "/legal?type=privacy" },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();

  const handleItemPress = (route: string) => {
    if (route.startsWith("/(tabs)/")) {
      router.push(route as any);
    } else {
      router.push(route as any);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader showSearch={false} showWishlist={false} />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.welcomeText}>Welcome</Text>
          <Text style={styles.userName}>Md Sahil</Text>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Erya Gold</Text>
          </View>
        </View>

        {/* Sections */}
        {profileSections.map((section, sectionIndex) => (
          <View key={section.title} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.label}
                style={[
                  styles.listItem,
                  itemIndex === section.items.length - 1 && styles.listItemLast,
                ]}
                onPress={() => handleItemPress(item.route)}
                activeOpacity={0.7}
              >
                <View style={styles.listItemContent}>
                  <Feather name={item.icon as any} size={20} color={palette.textSecondary} />
                  <Text style={styles.listItemLabel}>{item.label}</Text>
                </View>
                <Feather name="chevron-right" size={18} color={palette.textSecondary} />
              </TouchableOpacity>
            ))}
          </View>
        ))}

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Version 2025.10</Text>
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
  },
  header: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xl,
  },
  welcomeText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
    marginBottom: spacing.xs,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  userName: {
    ...typography.h1,
    color: palette.textPrimary,
    marginBottom: spacing.md,
  },
  brandContainer: {
    alignSelf: "flex-start",
  },
  brandText: {
    ...typography.bodySmall,
    color: palette.gold,
    fontWeight: "400",
  },
  section: {
    marginTop: spacing.xl,
    paddingHorizontal: spacing.lg,
  },
  sectionTitle: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
    marginBottom: spacing.md,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  listItemContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: spacing.md,
  },
  listItemLabel: {
    ...typography.body,
    color: palette.textPrimary,
    fontWeight: "300",
    flex: 1,
  },
  footer: {
    alignItems: "center",
    paddingVertical: spacing.xl,
    marginTop: spacing.xl,
  },
  footerText: {
    ...typography.caption,
    color: palette.textSecondary,
    fontWeight: "300",
  },
});

