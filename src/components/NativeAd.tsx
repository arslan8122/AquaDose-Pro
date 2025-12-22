/**
 * NativeAd Component
 *
 * Displays banner-style ads between content
 * Uses regular banner ad for simplicity and reliability
 */

import React, {useState, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import {BannerAd, BannerAdSize} from 'react-native-google-mobile-ads';
import {AdConfig} from '../config/featureFlags';
import {isPremiumActive} from '../services/adService';
import {getBannerAdUnitId} from '../services/adService';
import {colors, spacing, borderRadius, shadows} from '../constants/theme';

interface NativeAdProps {
  style?: any;
}

const NativeAd: React.FC<NativeAdProps> = ({style}) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    checkIfShouldShowAd();

    // Re-check premium status every 5 seconds
    const interval = setInterval(checkIfShouldShowAd, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkIfShouldShowAd = async () => {
    // Check feature flags
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_NATIVE_ADS) {
      setShowAd(false);
      return;
    }

    // Check premium status
    const premium = await isPremiumActive();
    if (premium) {
      console.log('[NativeAd] Premium active, hiding ad');
      setShowAd(false);
      return;
    }

    setShowAd(true);
  };

  // Don't render anything if ads are disabled
  if (!showAd) {
    return null;
  }

  const adUnitId = getBannerAdUnitId();

  return (
    <View style={[styles.container, style]}>
      <View style={styles.adCard}>
        <BannerAd
          unitId={adUnitId}
          size={BannerAdSize.MEDIUM_RECTANGLE}
          requestOptions={{
            requestNonPersonalizedAdsOnly: false,
          }}
          onAdLoaded={() => {
            console.log('[NativeAd] Ad loaded successfully');
          }}
          onAdFailedToLoad={(error) => {
            console.log('[NativeAd] Failed to load ad:', error);
            setShowAd(false);
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  adCard: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.medium,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.sm,
  },
});

export default NativeAd;
