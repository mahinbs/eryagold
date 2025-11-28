import { Tabs } from "expo-router";
import { Feather } from "@expo/vector-icons";
import { palette } from "../../constants/theme";

const iconFor = (name: keyof typeof icons) => icons[name];

const icons = {
  home: "home",
  whatsapp: "message-circle",
  karat: "star",
} as const;

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: palette.gold,
        tabBarInactiveTintColor: "rgba(255,255,255,0.5)",
        tabBarStyle: {
          backgroundColor: palette.deepGreen,
          borderTopColor: "rgba(255,255,255,0.08)",
          height: 70,
          paddingBottom: 10,
        },
        tabBarLabelStyle: {
          fontSize: 13,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => (
            <Feather name={iconFor("home")} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="whatsapp"
        options={{
          title: "WhatsApp",
          tabBarIcon: ({ color, size }) => (
            <Feather name={iconFor("whatsapp")} size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="karat"
        options={{
          title: "Karat",
          tabBarIcon: ({ color, size }) => (
            <Feather name={iconFor("karat")} size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}

