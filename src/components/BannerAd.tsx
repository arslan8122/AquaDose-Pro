/**
 * BannerAd Component
 *
 * Displays banner ads at the bottom of screens
 * Controlled by feature flags - respects AdConfig settings
 */

import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import {BannerAd as GoogleBannerAd, BannerAdSize, TestIds} from 'react-native-google-mobile-ads';
import {AdConfig} from '../config/featureFlags';
import {getBannerAdUnitId, isPremiumActive} from '../services/adService';

interface BannerAdProps {
  style?: any;
}

const BannerAd: React.FC<BannerAdProps> = ({style}) => {
  const [showAd, setShowAd] = useState(false);

  useEffect(() => {
    checkIfShouldShowAd();

    // Re-check premium status every 5 seconds
    const interval = setInterval(checkIfShouldShowAd, 5000);

    return () => clearInterval(interval);
  }, []);

  const checkIfShouldShowAd = async () => {
    // Check feature flags
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_BANNER_ADS) {
      setShowAd(false);
      return;
    }

    // Check premium status
    const premium = await isPremiumActive();
    if (premium) {
      console.log('[BannerAd] Premium active, hiding ad');
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
      <GoogleBannerAd
        unitId={adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        requestOptions={{
          requestNonPersonalizedAdsOnly: false,
        }}
        onAdLoaded={() => {
          console.log('[BannerAd] Ad loaded successfully');
        }}
        onAdFailedToLoad={(error) => {
          console.log('[BannerAd] Failed to load ad:', error);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E1EBF0',
    paddingVertical: 8,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 8,
      },
    }),
  },
});

export default BannerAd;
