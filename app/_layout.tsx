import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ToastProvider, useToast } from "../utils/toast";
import { Toast } from "../components/Toast";
import { WishlistProvider } from "./context/WishlistContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    // Add luxury fonts here if needed
  });
  const router = useRouter();
  const segments = useSegments();
  const appState = useRef(AppState.currentState);
  const isNavigating = useRef(false);

  useEffect(() => {
    async function hideSplash() {
      try {
        if (loaded || error) {
          await SplashScreen.hideAsync();
        }
      } catch (err) {
        console.warn("Failed to hide splash screen:", err);
      }
    }
    hideSplash();
  }, [loaded, error]);

  // Navigation logic and AppState monitoring
  useEffect(() => {
    appState.current = AppState.currentState;
    
    // We removed the automatic redirect to "/" on AppState changes 
    // to prevent the splash screen from re-triggering on tab switches 
    // or when the app comes back from the background.
  }, []);

  return (
    <SafeAreaProvider>
      <ToastProvider>
        <WishlistProvider>
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
              animationDuration: 300,
              contentStyle: {
                backgroundColor: "#FFFFFF", // White background
              },
            }}
          />
          <Toast />
        </WishlistProvider>
      </ToastProvider>
    </SafeAreaProvider>
  );
}
