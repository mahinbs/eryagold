import { memo } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";
import { Feather } from "@expo/vector-icons";
import { palette, radius, spacing } from "../constants/theme";

type AppHeaderProps = {
  onMenuPress?: () => void;
  icon?: "menu" | "back";
};

function AppHeaderComponent({ onMenuPress, icon = "menu" }: AppHeaderProps) {
  const iconName = icon === "back" ? "chevron-left" : "menu";
  const iconButton =
    onMenuPress != null ? (
      <TouchableOpacity style={styles.iconButton} onPress={onMenuPress}>
        <Feather name={iconName} size={24} color={palette.cream} />
      </TouchableOpacity>
    ) : (
      <View style={[styles.iconButton, { opacity: 0.4 }]}>
        <Feather name={iconName} size={24} color={palette.cream} />
      </View>
    );

  return (
    <View style={styles.container}>
      {iconButton}
      <View style={styles.searchBar}>
        <Feather name="search" size={18} color="rgba(255,255,255,0.6)" />
        <TextInput
          placeholder="Search collections, SKU or metal"
          placeholderTextColor="rgba(255,255,255,0.6)"
          style={styles.searchInput}
        />
      </View>
      <View style={styles.headerActions}>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="bell" size={20} color={palette.cream} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Feather name="shopping-bag" size={20} color={palette.cream} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  container: {
    flexDirection: "row" as const,
    alignItems: "center",
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: radius.md,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    backgroundColor: palette.emerald,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: palette.emerald,
    borderRadius: radius.full,
    paddingHorizontal: spacing.md,
    height: 42,
    gap: spacing.sm,
  },
  searchInput: {
    flex: 1,
    color: palette.cream,
    fontSize: 14,
  },
  headerActions: {
    flexDirection: "row" as const,
    gap: spacing.xs,
  },
};

export const AppHeader = memo(AppHeaderComponent);

