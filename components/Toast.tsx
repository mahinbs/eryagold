import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming, 
  runOnJS 
} from 'react-native-reanimated';
import { Feather } from '@expo/vector-icons';
import { palette, radius, shadow, spacing, typography } from '../constants/theme';
import { useToast, ToastType } from '../utils/toast';

const { width } = Dimensions.get('window');

export function Toast() {
  const { toast, hideToast } = useToast();
  const translateY = useSharedValue(-100);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (toast && toast.visible) {
      // Entry animation
      translateY.value = withSpring(Platform.OS === 'ios' ? 60 : 40, { damping: 15 });
      opacity.value = withTiming(1, { duration: 300 });
      
      // Setup exit timer after entry finishes
      const timer = setTimeout(() => {
        translateY.value = withTiming(-100, { duration: 400 });
        opacity.value = withTiming(0, { duration: 300 }, (finished) => {
          if (finished) {
            runOnJS(hideToast)();
          }
        });
      }, 2700);

      return () => clearTimeout(timer);
    }
  }, [toast]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  if (!toast) return null;

  const getIcon = (type: ToastType) => {
    switch (type) {
      case 'success': return 'check-circle';
      case 'error': return 'alert-circle';
      default: return 'info';
    }
  };

  const getColor = (type: ToastType) => {
    switch (type) {
      case 'success': return '#2D6A4F'; // Success green
      case 'error': return '#D00000'; // Error red
      default: return palette.gold;
    }
  };

  const color = getColor(toast.type);

  return (
    <Animated.View 
      style={[styles.container, animatedStyle, { pointerEvents: 'none' } as any]} 
    >
      <View 
        style={[styles.toast, { borderLeftColor: color, pointerEvents: 'auto' } as any]} 
      >
        <View style={[styles.iconContainer, { backgroundColor: `${color}10` }]}>
          <Feather name={getIcon(toast.type)} size={18} color={color} />
        </View>
        <Text style={styles.message} numberOfLines={2}>
          {toast.message}
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 9999,
    paddingHorizontal: spacing.lg,
  },
  toast: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: palette.white,
    borderRadius: radius.md,
    padding: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderLeftWidth: 4,
    ...shadow.elevated,
    gap: spacing.md,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...typography.bodySmall,
    color: palette.textPrimary,
    flex: 1,
    fontWeight: '400',
  },
});
