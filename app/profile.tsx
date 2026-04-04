import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { 
  ActivityIndicator, 
  Modal, 
  SafeAreaView, 
  ScrollView, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from "react-native";
import { AppHeader } from "../components/AppHeader";
import { getCurrentUser, getProfile, signOutUser, updateProfile } from "../supabase/api";
import { useToast } from "../utils/toast";
import { palette, spacing, typography } from "../constants/theme";
import { useEffect, useState } from "react";

// MYSA-STYLE PROFILE
// Typography-led layout
// No clutter, no cards overload
// Sections: Orders, Saved Addresses, Wishlist, Support, About Erya Gold

const profileSections = [
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
  {
    title: "Account",
    items: [
      { label: "Sign Out", icon: "log-out", route: "sign-out" },
    ],
  },
];

export default function ProfileScreen() {
  const router = useRouter();
  const { showToast } = useToast();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const user = await getCurrentUser();
      if (!user) {
        router.replace("/login");
        return;
      }
      const data = await getProfile(user.id);
      setProfile(data);
      setEditName(data?.full_name || "");
      setEditPhone(data?.phone || "");
    } catch (error) {
      console.error("Error fetching profile:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      showToast("Name cannot be empty", "error");
      return;
    }

    setIsSaving(true);
    try {
      const user = await getCurrentUser();
      if (!user) return;

      await updateProfile(user.id, {
        full_name: editName,
        phone: editPhone,
      });

      showToast("Profile updated successfully", "success");
      setIsEditModalVisible(false);
      fetchProfile(); // Refresh
    } catch (error: any) {
      showToast(error.message, "error");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOutUser();
      showToast("Signed out successfully", "success");
      router.replace("/login");
    } catch (error: any) {
      showToast(error.message, "error");
    }
  };

  const handleItemPress = (route: string) => {
    if (route === "sign-out") {
      handleSignOut();
      return;
    }
    router.push(route as any);
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
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={styles.userName}>
                {loading ? "..." : profile?.full_name || "Valued Customer"}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.editIconButton}
              onPress={() => setIsEditModalVisible(true)}
              activeOpacity={0.7}
            >
              <Feather name="edit-3" size={20} color={palette.gold} />
            </TouchableOpacity>
          </View>
          <View style={styles.brandContainer}>
            <Text style={styles.brandText}>Erya Gold Member</Text>
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

      {/* Edit Profile Modal */}
      <Modal
        visible={isEditModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsEditModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setIsEditModalVisible(false)}>
                <Feather name="x" size={24} color={palette.textPrimary} />
              </TouchableOpacity>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Full Name</Text>
                <TextInput
                  style={styles.input}
                  value={editName}
                  onChangeText={setEditName}
                  placeholder="Enter your full name"
                  placeholderTextColor={palette.textSecondary}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Phone Number</Text>
                <TextInput
                  style={styles.input}
                  value={editPhone}
                  onChangeText={setEditPhone}
                  placeholder="Enter your phone number"
                  placeholderTextColor={palette.textSecondary}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.modalFooter}>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.cancelButton]}
                  onPress={() => setIsEditModalVisible(false)}
                  disabled={isSaving}
                >
                  <Text style={styles.cancelButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.modalButton, styles.saveButton]}
                  onPress={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <ActivityIndicator size="small" color={palette.white} />
                  ) : (
                    <Text style={styles.saveButtonText}>Save Changes</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  editIconButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(198, 162, 77, 0.1)",
    alignItems: "center",
    justifyContent: "center",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: palette.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.xxxl,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  modalTitle: {
    ...typography.h2,
    color: palette.textPrimary,
  },
  formContainer: {
    gap: spacing.xl,
  },
  inputGroup: {
    gap: spacing.xs,
  },
  inputLabel: {
    ...typography.caption,
    color: palette.textSecondary,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  input: {
    ...typography.body,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: palette.divider,
    color: palette.textPrimary,
  },
  modalFooter: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.xl,
  },
  modalButton: {
    flex: 1,
    height: 50,
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: palette.divider,
  },
  saveButton: {
    backgroundColor: palette.gold,
  },
  cancelButtonText: {
    ...typography.buttonLarge,
    color: palette.textPrimary,
  },
  saveButtonText: {
    ...typography.buttonLarge,
    color: palette.white,
  },
});
