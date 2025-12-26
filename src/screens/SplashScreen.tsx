/**
 * Splash Screen
 *
 * Displays app logo with loading animation on app startup
 * Shows App Open Ad after loading completes
 */

import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Animated,
  Easing,
  ActivityIndicator,
} from 'react-native';
import {colors} from '../constants/theme';
import {useAppOpenAd} from '../hooks/useAppOpenAd';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({onComplete}) => {
  const [isLoading, setIsLoading] = useState(true);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  const {showAd, isAdLoaded} = useAppOpenAd();

  // Fade in and scale animation
  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation for loading indicator
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  // Handle loading completion
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, []);

  // Show ad when loading completes
  useEffect(() => {
    if (!isLoading) {
      // Wait a moment before showing ad
      const adTimer = setTimeout(async () => {
        if (isAdLoaded) {
          // Show the ad and wait for it to complete
          await showAd();
        }
        // Navigate to main app after ad (or immediately if no ad)
        onComplete();
      }, 300);

      return () => clearTimeout(adTimer);
    }
  }, [isLoading, isAdLoaded, showAd, onComplete]);

  return (
    <View style={styles.container}>
      {/* Gradient background effect */}
      <View style={styles.gradientTop} />
      <View style={styles.gradientBottom} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            opacity: fadeAnim,
            transform: [{scale: scaleAnim}],
          },
        ]}>
        <Image
          source={require('../../logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Title */}
      <Animated.Text
        style={[
          styles.title,
          {
            opacity: fadeAnim,
          },
        ]}>
        Aquarium Dose Calculator
      </Animated.Text>

      <Animated.Text
        style={[
          styles.subtitle,
          {
            opacity: fadeAnim,
          },
        ]}>
        Precise Dosing for Your Aquarium
      </Animated.Text>

      {/* Loading Indicator */}
      {isLoading && (
        <Animated.View
          style={[
            styles.loadingContainer,
            {
              opacity: fadeAnim,
              transform: [{scale: pulseAnim}],
            },
          ]}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Animated.Text style={styles.loadingText}>Loading...</Animated.Text>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: colors.primaryLight,
    opacity: 0.1,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
  },
  gradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: colors.secondary,
    opacity: 0.08,
    borderTopLeftRadius: 200,
    borderTopRightRadius: 200,
  },
  logoContainer: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 12,
  },
  logo: {
    width: 160,
    height: 160,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.primary,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
    color: colors.textSecondary,
    marginBottom: 48,
  },
  loadingContainer: {
    alignItems: 'center',
    marginTop: 24,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
    fontWeight: '500',
  },
});

export default SplashScreen;
