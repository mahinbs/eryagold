import { useRef, useState } from "react";
import { Dimensions, FlatList, ImageBackground, StatusBar, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { palette, radius, spacing } from "../constants/theme";

const slides = [
  {
    id: "1",
    title: "Crafted To Captivate",
    copy:
      "Browse signature collections handcrafted with heritage artistry and modern silhouettes.",
    image: require("../assets/jawellery-images/jawellery-8.jpg"),
  },
  {
    id: "2",
    title: "Personal Curations",
    copy:
      "Save favourites, compare metals and curate looks before your private showroom visit.",
    image: require("../assets/jawellery-images/jawellery-9.jpg"),
  },
  {
    id: "3",
    title: "Concierge Support",
    copy:
      "Chat instantly with our jewellery stylists for sizing, bespoke orders and delivery updates.",
    image: require("../assets/jawellery-images/jawellery-11.jpg"),
  },
];

const { width } = Dimensions.get("window");

export default function Onboarding() {
  const router = useRouter();
  const flatListRef = useRef<FlatList>(null);
  const [index, setIndex] = useState(0);

  const handleNext = () => {
    if (index === slides.length - 1) {
      router.replace("/login");
      return;
    }
    const nextIndex = index + 1;
    flatListRef.current?.scrollToIndex({ index: nextIndex });
    setIndex(nextIndex);
  };

  const handleSkip = () => {
    router.replace("/login");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: palette.deepGreen, position: "relative" }}
    >
      <StatusBar barStyle="light-content" />
      <FlatList
        ref={flatListRef}
        data={slides}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={(event) => {
          const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
          setIndex(newIndex);
        }}
        renderItem={({ item }) => (
          <ImageBackground
            source={item.image}
            style={{
              width,
              flex: 1,
              justifyContent: "flex-end",
              padding: spacing.lg,
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(15,45,35,0.78)",
                padding: spacing.lg,
                borderRadius: radius.lg,
              }}
            >
              <Text
                style={{
                  fontSize: 34,
                  fontWeight: "700",
                  color: palette.paleGold,
                  marginBottom: spacing.sm,
                }}
              >
                {item.title}
              </Text>
              <Text
                style={{
                  color: palette.cream,
                  fontSize: 16,
                  lineHeight: 24,
                  marginBottom: spacing.lg,
                }}
              >
                {item.copy}
              </Text>
              <View style={{ flexDirection: "row", gap: spacing.sm }}>
                <TouchableOpacity
                  onPress={handleSkip}
                  style={{
                    flex: 1,
                    borderColor: palette.paleGold,
                    borderWidth: 1,
                    borderRadius: radius.full,
                    paddingVertical: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: palette.paleGold,
                      fontWeight: "600",
                    }}
                  >
                    Skip
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleNext}
                  style={{
                    flex: 1,
                    backgroundColor: palette.gold,
                    borderRadius: radius.full,
                    paddingVertical: spacing.sm,
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      color: palette.deepGreen,
                      fontWeight: "700",
                    }}
                  >
                    {index === slides.length - 1 ? "Get Started" : "Next"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ImageBackground>
        )}
      />
      <View
        style={{
          position: "absolute",
          bottom: spacing.md,
          alignSelf: "center",
          flexDirection: "row",
          gap: spacing.xs,
        }}
      >
        {slides.map((_, dotIndex) => (
          <View
            key={dotIndex}
            style={{
              width: dotIndex === index ? 28 : 10,
              height: 10,
              borderRadius: radius.full,
              backgroundColor:
                dotIndex === index ? palette.gold : "rgba(255,255,255,0.4)",
            }}
          />
        ))}
      </View>
    </SafeAreaView>
  );
}

