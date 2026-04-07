import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppHeader } from "../components/AppHeader";
import { palette, shadow, spacing, typography } from "../constants/theme";

const faqs = [
  {
    question: "Do you offer international shipping?",
    answer: "Yes, we ship our jewellery internationally. Shipping costs and delivery times vary by country. Please contact our concierge for specific details."
  },
  {
    question: "How do I care for my jewellery?",
    answer: "Keep your jewellery in a dry place, ideally in a separate pouch to prevent scratches. Use a soft cloth for cleaning and avoid contact with perfumes or harsh chemicals."
  },
  {
    question: "Are your stones ethically sourced?",
    answer: "Authenticity and ethics are paramount to us. We source our gemstones and gold from certified partners who adhere to the highest ethical and sustainable standards."
  },
  {
    question: "Do you provide certificates of authenticity?",
    answer: "Every piece of Erya Gold jewellery comes with an official certificate of authenticity, ensuring the purity and quality of the materials used."
  }
];

export default function HelpScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <AppHeader icon="back" onMenuPress={() => router.back()} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Help Center</Text>
          <Text style={styles.subtitle}>Frequently Asked Questions & Support</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>General FAQ</Text>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqCard}>
              <Text style={styles.question}>{faq.question}</Text>
              <Text style={styles.answer}>{faq.answer}</Text>
            </View>
          ))}
        </View>

        <View style={styles.supportSection}>
          <Text style={styles.supportTitle}>Still need assistance?</Text>
          <Text style={styles.supportText}>Our concierge team is available 24/7 to help with any inquiries.</Text>
          
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => router.push("/contact")}
          >
            <View style={styles.buttonContent}>
              <Feather name="mail" size={18} color={palette.white} />
              <Text style={styles.buttonText}>Contact Concierge</Text>
            </View>
          </TouchableOpacity>
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
  faqCard: {
    backgroundColor: palette.white,
    padding: spacing.lg,
    borderRadius: 12,
    marginBottom: spacing.md,
    ...shadow.card,
  },
  question: {
    ...typography.h3,
    color: palette.textPrimary,
    marginBottom: spacing.xs,
  },
  answer: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    lineHeight: 20,
    fontWeight: "300",
  },
  supportSection: {
    marginTop: spacing.xxl,
    marginHorizontal: spacing.lg,
    padding: spacing.xl,
    backgroundColor: palette.white,
    borderRadius: 20,
    alignItems: "center",
    gap: spacing.md,
  },
  supportTitle: {
    ...typography.h2,
    color: palette.textPrimary,
  },
  supportText: {
    ...typography.bodySmall,
    color: palette.textSecondary,
    textAlign: "center",
    lineHeight: 22,
    fontWeight: "300",
  },
  contactButton: {
    backgroundColor: palette.gold,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: 30,
    marginTop: spacing.md,
  },
  buttonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.sm,
  },
  buttonText: {
    ...typography.buttonLarge,
    color: palette.white,
  },
});
