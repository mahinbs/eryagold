import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

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
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  // Reset to splash screen when app comes to foreground after being killed
  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextAppState: AppStateStatus) => {
      // Only reset if app was in background and is now active
      // This ensures splash shows when app is reopened
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active" &&
        !isNavigating.current
      ) {
        // Use setTimeout to ensure router is ready
        setTimeout(() => {
          const currentRoute = segments[0];
          // Reset to splash screen if not already there
          if (currentRoute && currentRoute !== "(tabs)") {
            isNavigating.current = true;
            router.replace("/");
            // Reset flag after navigation
            setTimeout(() => {
              isNavigating.current = false;
            }, 500);
          }
        }, 100);
      }
      appState.current = nextAppState;
    });

    return () => {
      subscription.remove();
    };
  }, [segments, router]);

  return (
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
  );
}
