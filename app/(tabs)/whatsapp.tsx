import { Feather } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../../components/AppHeader";
import { palette, radius, spacing, typography } from "../../constants/theme";
import { submitInquiry } from "../../supabase/api";

const quickTemplates = [
  "Share bridal catalogue",
  "Schedule video consult",
  "Request sizing guide",
  "Track my custom order",
];

const stylists = [
  { name: "Sanjana", status: "Responds in 5 mins", speciality: "Bespoke bridal & polki" },
  { name: "Meera", status: "Online", speciality: "Cocktail jewels & diamonds" },
  { name: "Raghav", status: "Away · replies under 30 mins", speciality: "Men's edit & gifting" },
];

export default function WhatsAppScreen() {
  const { designId, subject } = useLocalSearchParams<{ designId?: string; subject?: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleInquirySubmit = async () => {
    if (!message.trim()) {
      Alert.alert("Error", "Please enter a message.");
      return;
    }

    setLoading(true);
    try {
      // For now, we use a placeholder profileId or get it from auth if implemented
      // In a real app, we'd get the current user's ID
      // For this demo, let's assume we have a guest or fixed ID if not logged in
      const profileId = "00000000-0000-0000-0000-000000000000"; // Placeholder
      
      await submitInquiry(profileId, designId || null, subject || "General Inquiry", message);
      Alert.alert("Success", "Your inquiry has been sent to our stylists. We will get back to you shortly.");
      setMessage("");
    } catch (error) {
      console.error("Error submitting inquiry:", error);
      Alert.alert("Error", "Failed to send inquiry. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <AppHeader />
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: spacing.lg, paddingBottom: 100, gap: spacing.lg }}
      >
        <View style={styles.hero}>
          <View style={{ flex: 1, gap: spacing.xs }}>
            <Text style={styles.heroLabel}>Concierge access</Text>
            <Text style={styles.heroTitle}>WhatsApp our stylists</Text>
            {subject && (
              <View style={styles.inquiryBadge}>
                <Text style={styles.inquiryBadgeText}>Inquiring about: {subject}</Text>
              </View>
            )}
            <Text style={styles.heroCopy}>
              Instant replies for sizing, pricing, delivery slots and bespoke commissions.
            </Text>
            
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.messageInput}
                placeholder="Type your message here..."
                placeholderTextColor={palette.textSecondary}
                multiline
                value={message}
                onChangeText={setMessage}
              />
              <TouchableOpacity 
                style={[styles.submitButton, loading && { opacity: 0.7 }]} 
                onPress={handleInquirySubmit}
                disabled={loading}
              >
                <Text style={styles.submitButtonText}>{loading ? "Sending..." : "Submit Inquiry"}</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.heroButton}>
              <Feather name="message-circle" size={18} color={palette.white} />
              <Text style={styles.heroButtonLabel}>Open WhatsApp</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Popular prompts</Text>
          <View style={styles.chipRow}>
            {quickTemplates.map((template) => (
              <TouchableOpacity key={template} style={styles.chip}>
                <Text style={styles.chipLabel}>{template}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Stylist roster</Text>
          <View style={{ gap: spacing.md }}>
            {stylists.map((stylist) => (
              <View key={stylist.name} style={styles.stylistRow}>
                <View style={styles.stylistBadge}>
                  <Text style={styles.stylistInitials}>
                    {stylist.name
                      .split(" ")
                      .map((letter) => letter[0])
                      .join("")
                      .toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.stylistName}>{stylist.name}</Text>
                  <Text style={styles.stylistStatus}>{stylist.status}</Text>
                  <Text style={styles.stylistSpec}>{stylist.speciality}</Text>
                </View>
                <TouchableOpacity style={styles.outlineButton}>
                  <Text style={styles.outlineLabel}>Message</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Upcoming live drops</Text>
          <View style={{ gap: spacing.sm }}>
            {[
              { title: "Heritage Polki", date: "Friday · 8 PM", desc: "Limited-edition kundan sets" },
              { title: "Emerald Tides", date: "Sunday · 6 PM", desc: "Colombian emerald showcase" },
            ].map((item) => (
              <View key={item.title} style={styles.dropRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.dropTitle}>{item.title}</Text>
                  <Text style={styles.dropDate}>{item.date}</Text>
                  <Text style={styles.dropDesc}>{item.desc}</Text>
                </View>
                <TouchableOpacity style={styles.rsvpButton}>
                  <Text style={styles.rsvpLabel}>RSVP</Text>
                </TouchableOpacity>
              </View>
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
    backgroundColor: palette.white, // White
  },
  hero: {
    backgroundColor: palette.gold, // Gold for CTA
    borderRadius: radius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },

  heroLabel: {
    color: palette.white, // White text on gold
    fontSize: 14,
    textTransform: "uppercase",
    letterSpacing: 2,
    fontWeight: "500",
  },
  heroTitle: {
    color: palette.white, // White text on gold
    fontSize: 28,
    fontWeight: "500",
    fontFamily: "serif",
  },
  heroCopy: {
    color: palette.white,
    opacity: 0.95,
  },
  heroButton: {
    marginTop: spacing.md,
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    backgroundColor: palette.green, // Deep green
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  heroButtonLabel: {
    color: palette.white,
    fontWeight: "600",
  },
  inquiryBadge: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: spacing.sm,
    paddingVertical: 4,
    borderRadius: radius.sm,
    alignSelf: "flex-start",
    marginBottom: spacing.xs,
  },
  inquiryBadgeText: {
    color: palette.white,
    fontSize: 12,
    fontWeight: "600",
  },
  inputContainer: {
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  messageInput: {
    backgroundColor: palette.white,
    borderRadius: radius.md,
    padding: spacing.md,
    minHeight: 100,
    textAlignVertical: "top",
    color: palette.textPrimary,
    borderWidth: 1,
    borderColor: palette.divider,
  },
  submitButton: {
    backgroundColor: palette.green,
    borderRadius: radius.full,
    paddingVertical: spacing.sm,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    color: palette.white,
    fontWeight: "700",
    fontSize: 14,
  },
  card: {
    backgroundColor: palette.goldCream, // Cream gold for cards
    borderRadius: radius.lg,
    padding: spacing.lg,
    gap: spacing.md,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.2)",
  },
  cardTitle: {
    color: palette.green, // Deep green for headings
    fontSize: 18,
    fontWeight: "500",
    fontFamily: "serif",
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: spacing.md,
  },
  chip: {
    borderRadius: radius.full,
    borderWidth: 1,
    borderColor: "rgba(212, 175, 55, 0.3)",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: palette.white, // White
  },
  chipLabel: {
    color: palette.textPrimary, // Deep green
    fontSize: 13,
  },
  stylistRow: {
    flexDirection: "row",
    gap: spacing.md,
    alignItems: "center",
  },
  stylistBadge: {
    width: 54,
    height: 54,
    borderRadius: radius.full,
    backgroundColor: palette.gold, // Gold
    alignItems: "center",
    justifyContent: "center",
  },
  stylistInitials: {
    color: palette.white, // White text on gold
    fontWeight: "600",
    fontSize: 18,
  },
  stylistName: {
    color: palette.green, // Deep green for headings
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "serif",
  },
  stylistStatus: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  stylistSpec: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  outlineButton: {
    borderColor: palette.metallicGold,
    borderWidth: 1.5,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    backgroundColor: palette.white, // White
  },
  outlineLabel: {
    color: palette.gold,
    fontWeight: "600",
  },
  dropRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },
  dropTitle: {
    color: palette.green, // Deep green for headings
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "serif",
  },
  dropDate: {
    color: palette.textSecondary,
    fontSize: 13,
  },
  dropDesc: {
    color: palette.textSecondary,
    fontSize: 13,
    marginTop: spacing.xs / 2,
  },
  rsvpButton: {
    backgroundColor: palette.gold, // Gold
    borderRadius: radius.full,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
  },
  rsvpLabel: {
    color: palette.white, // White text on gold
    fontWeight: "600",
  },
});

