import { withDelay, withSpring, withTiming, Easing } from "react-native-reanimated";
import { animations } from "../constants/theme";

/**
 * Animation presets for consistent luxury motion
 */

export const fadeIn = (delay = 0) =>
  withDelay(delay, withTiming(1, { duration: animations.normal }));

export const fadeOut = () => withTiming(0, { duration: animations.fast });

export const slideUp = (delay = 0) =>
  withDelay(
    delay,
    withSpring(0, {
      ...animations.spring,
      damping: 20,
    })
  );

export const slideDown = (value: number) =>
  withSpring(value, animations.spring);

export const scaleIn = (delay = 0) =>
  withDelay(
    delay,
    withSpring(1, {
      ...animations.spring,
      damping: 15,
    })
  );

export const staggerChildren = (index: number, staggerDelay = 100) =>
  index * staggerDelay;

/**
 * Page transition animations
 */
export const pageTransition = {
  enter: {
    opacity: withTiming(1, { duration: animations.normal }),
    transform: [
      {
        translateY: withSpring(0, animations.spring),
      },
    ],
  },
  exit: {
    opacity: withTiming(0, { duration: animations.fast }),
    transform: [
      {
        translateY: withTiming(-20, { duration: animations.fast }),
      },
    ],
  },
};

/**
 * Card reveal animation
 */
export const cardReveal = (index: number) => ({
  opacity: fadeIn(staggerChildren(index, 80)),
  transform: [
    {
      translateY: slideUp(staggerChildren(index, 80)),
    },
    {
      scale: scaleIn(staggerChildren(index, 80)),
    },
  ],
});

/**
 * Shimmer animation for gold effects
 */
export const shimmerAnimation = {
  translateX: withTiming(200, {
    duration: 2000,
    repeat: Infinity,
    repeatDelay: 3000,
    easing: Easing.out(Easing.ease),
  }),
};

/**
 * Gold glow pulse animation
 */
export const goldGlow = {
  opacity: withTiming(0.6, {
    duration: 1500,
    repeat: Infinity,
    repeatDelay: 1000,
    easing: Easing.inOut(Easing.ease),
  }),
};

