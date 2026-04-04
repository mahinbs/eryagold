// MYSA-STYLE LUXURY COLOR PALETTE (Erya Gold)
// Base Inspiration: MYSA – Beyond the Luxury
// Minimal, Editorial luxury, High white space, Gold-accented elegance

export const palette = {
  // PRIMARY BRAND GOLD (CORE) - #C6A24D
  gold: "#C6A24D", // Soft Matte Gold - Active icons, prices, CTAs, highlights
  goldChampagne: "#E6D6A8", // Soft Champagne Gold - Subtle accents
  
  // PRIMARY BACKGROUND (MOST USED) - #FAF9F6
  ivory: "#FAF9F6", // Warm Off-White / Ivory - App background, product pages, lists
  
  // PURE WHITE (Cards & Sheets) - #FFFFFF
  white: "#FFFFFF", // Clean White - Product cards, bottom sheets, modals, image containers
  
  // PRIMARY TEXT - #1E1E1E
  textPrimary: "#1E1E1E", // Deep Charcoal (NOT pure black) - Product titles, section headings, prices (when not gold)
  charcoal: "#1E1E1E", // Alias for textPrimary
  
  // SECONDARY TEXT - #6B6B6B
  textSecondary: "#6B6B6B", // Warm Gray - Descriptions, metadata (weight, purity), inactive states
  gray: "#6B6B6B", // Alias for textSecondary
  
  // DIVIDERS / BORDERS - #EDEDED
  divider: "#EDEDED", // Ultra-Light Gray - Card outlines, section separators, input borders
  
  // Legacy compatibility mappings (using new colors)
  goldLight: "#E6D6A8",
  goldDark: "#C6A24D",
  goldPale: "#E6D6A8",
  goldCream: "#FAF9F6",
  green: "#1E1E1E", // Using charcoal for headings
  greenMedium: "#1E1E1E",
  greenLight: "#FAF9F6",
  greenPale: "#FAF9F6",
  textGold: "#C6A24D",
  textDark: "#1E1E1E",
  metallicGold: "#C6A24D",
  champagneGold: "#E6D6A8",
  deepGold: "#C6A24D",
  ivoryBackground: "#FAF9F6",
  champagne: "#E6D6A8",
  offWhite: "#FAF9F6",
  beige: "#FAF9F6",
  beigeDark: "#EDEDED",
  deepGreen: "#1E1E1E",
  emerald: "#1E1E1E",
  darkTeal: "#1E1E1E",
  darkTealLight: "#1E1E1E",
  darkTealLighter: "#FAF9F6",
  dusk: "#1E1E1E",
  eryaGold: "#C6A24D",
  paleGold: "#E6D6A8",
  cream: "#FAF9F6",
  slate: "#6B6B6B",
  lightGray: "#EDEDED",
  mediumGray: "#6B6B6B",
  textMuted: "#6B6B6B",
  textLight: "#FFFFFF",
  background: "#FAF9F6",
  backgroundCard: "#FFFFFF",
  backgroundElevated: "#FFFFFF",
};

export const spacing = {
  xs: 8,
  sm: 12,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

export const radius = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  full: 999,
};

// MYSA-STYLE SHADOWS - Extremely soft, minimal
// No shadows unless extremely soft
export const shadow = {
  card: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  elevated: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
  // No glow shadows - removed per MYSA style
};

// MYSA-STYLE TYPOGRAPHY SYSTEM
// Headings: Playfair Display OR Cormorant Garamond (Luxury Serif)
// Body: Inter OR SF Pro / Poppins (light weights only: 300/400/500)
// NO bold abuse - restraint is luxury

export const typography = {
  display: {
    fontSize: 48,
    fontWeight: "400" as const, // Medium weight for serif elegance
    letterSpacing: 0.5,
    lineHeight: 56,
    fontFamily: "serif", // Playfair Display / Cormorant Garamond
  },
  hero: {
    fontSize: 36,
    fontWeight: "400" as const,
    letterSpacing: 0.3,
    lineHeight: 44,
    fontFamily: "serif",
  },
  h1: {
    fontSize: 28,
    fontWeight: "400" as const,
    letterSpacing: 0.2,
    lineHeight: 36,
    fontFamily: "serif",
  },
  h2: {
    fontSize: 24,
    fontWeight: "400" as const,
    letterSpacing: 0.15,
    lineHeight: 32,
    fontFamily: "serif",
  },
  h3: {
    fontSize: 20,
    fontWeight: "400" as const,
    letterSpacing: 0.1,
    lineHeight: 28,
    fontFamily: "serif",
  },
  body: {
    fontSize: 16,
    fontWeight: "300" as const, // Light weight for body (300/400/500 only)
    letterSpacing: 0,
    lineHeight: 24,
    fontFamily: "sans-serif", // Inter / SF Pro / Poppins
  },
  bodySmall: {
    fontSize: 14,
    fontWeight: "300" as const,
    letterSpacing: 0,
    lineHeight: 20,
    fontFamily: "sans-serif",
  },
  caption: {
    fontSize: 12,
    fontWeight: "300" as const,
    letterSpacing: 0.1,
    lineHeight: 16,
    fontFamily: "sans-serif",
  },
  price: {
    fontSize: 20,
    fontWeight: "400" as const,
    letterSpacing: 0.2,
    lineHeight: 26,
    fontFamily: "serif", // Serif for prices
  },
  button: {
    fontSize: 16,
    fontWeight: "500" as const,
    letterSpacing: 1,
    lineHeight: 24,
    fontFamily: "sans-serif",
    textTransform: "uppercase" as const,
  },
  buttonLarge: {
    fontSize: 18,
    fontWeight: "500" as const,
    letterSpacing: 1.5,
    lineHeight: 26,
    fontFamily: "sans-serif",
    textTransform: "uppercase" as const,
  },
};

// MYSA-STYLE ANIMATIONS
// Slow, smooth, confident animations (never playful)
// Duration: 300-450ms
// Easing: ease-in-out
// Never use bounce
export const animations = {
  fast: 300,
  normal: 400, // 300-450ms range
  slow: 450,
  verySlow: 600,
  spring: {
    damping: 25, // Higher damping = no bounce
    stiffness: 100, // Lower stiffness = smoother
    mass: 1,
  },
  // Page transition: Fade + slight slide
  pageLoad: {
    fade: 400,
    slide: 6, // pixels (2-6px translateY)
  },
  // Cards: staggered appearance
  cardStagger: 80, // delay between cards
  // Button tap: Scale 0.98
  buttonPress: 0.98,
  // Images: scale from 1.05 → 1.0
  imageZoom: {
    initial: 1.05,
    final: 1.0,
  },
  // Wishlist: Heart fills with gold ripple
  wishlistRipple: 300,
  // Image load: Blur → Sharp
  imageLoad: 400,
};

