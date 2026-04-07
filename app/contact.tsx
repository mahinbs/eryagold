import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import { palette, shadow, spacing, typography } from "../constants/theme";

export default function ContactScreen() {
  const router = useRouter();

  const handleWhatsApp = () => {
    Linking.openURL("https://wa.me/919999999999");
  };

  const handleEmail = () => {
    Linking.openURL("mailto:support@eryagold.com");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Contact Us</Text>
          <Text style={styles.subtitle}>Get in touch with our concierge team</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Inquiries & Support</Text>
          <TouchableOpacity style={styles.contactCard} onPress={handleWhatsApp}>
            <View style={styles.iconBox}>
              <Feather name="message-circle" size={24} color={palette.gold} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>WhatsApp Support</Text>
              <Text style={styles.cardSubtitle}>Available 24/7 for styling & pricing</Text>
            </View>
            <Feather name="chevron-right" size={20} color={palette.textSecondary} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactCard} onPress={handleEmail}>
            <View style={styles.iconBox}>
              <Feather name="mail" size={24} color={palette.gold} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Email Us</Text>
              <Text style={styles.cardSubtitle}>support@eryagold.com</Text>
            </View>
            <Feather name="chevron-right" size={20} color={palette.textSecondary} />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Visit Our Boutique</Text>
          <View style={styles.addressCard}>
            <View style={styles.iconBox}>
              <Feather name="map-pin" size={24} color={palette.gold} />
            </View>
            <View style={styles.cardInfo}>
              <Text style={styles.cardTitle}>Main Showroom</Text>
              <Text style={styles.addressText}>
                123 Luxury Lane, Jewellery District{"\n"}
                Mumbai, Maharashtra, 400001
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Social Media</Text>
          <View style={styles.socialRow}>
            {["instagram", "facebook", "twitter"].map((platform) => (
              <TouchableOpacity key={platform} style={styles.socialButton}>
                <Feather name={platform as any} size={20} color={palette.gold} />
              </TouchableOpacity>
            ))}
          </View>
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
  header: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
    backgroundColor: palette.white,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: palette.divider,
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
  section: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  sectionTitle: {
    ...typography.h3,
    color: palette.gold,
    marginBottom: spacing.lg,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  contactCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: 16,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  addressCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: 16,
    ...shadow.card,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "rgba(198, 162, 77, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: 2,
  },
  cardSubtitle: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    fontWeight: "300",
  },
  addressText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    lineHeight: 20,
    fontWeight: "300",
  },
  socialRow: {
    flexDirection: "row",
    gap: spacing.lg,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: palette.white,
    alignItems: "center",
    justifyContent: "center",
    ...shadow.card,
  },
});
