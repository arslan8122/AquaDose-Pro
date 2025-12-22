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
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    width: '100%',
  },
});

export default BannerAd;
