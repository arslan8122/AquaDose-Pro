/**
 * useInterstitialAd Hook
 *
 * Custom hook for loading and showing interstitial ads
 * Respects feature flags and frequency caps
 */

import {useEffect, useState, useCallback} from 'react';
import {InterstitialAd, AdEventType} from 'react-native-google-mobile-ads';
import {AdConfig} from '../config/featureFlags';
import {
  getInterstitialAdUnitId,
  incrementCalculationCount,
  isPremiumActive,
} from '../services/adService';

export const useInterstitialAd = () => {
  const [interstitial, setInterstitial] = useState<InterstitialAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize and load the interstitial ad
  useEffect(() => {
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_INTERSTITIAL_ADS) {
      return;
    }

    const adUnitId = getInterstitialAdUnitId();
    const ad = InterstitialAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Event listeners
    const loadedListener = ad.addAdEventListener(AdEventType.LOADED, () => {
      console.log('[InterstitialAd] Ad loaded');
      setIsLoaded(true);
      setIsLoading(false);
    });

    const errorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[InterstitialAd] Error loading ad:', error);
      setIsLoaded(false);
      setIsLoading(false);
    });

    const closedListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[InterstitialAd] Ad closed');
      setIsLoaded(false);
      // Reload the ad for next time
      loadAd();
    });

    setInterstitial(ad);

    // Load the ad
    const loadAd = () => {
      if (!isLoading && !isLoaded) {
        setIsLoading(true);
        ad.load();
      }
    };

    loadAd();

    // Cleanup
    return () => {
      loadedListener();
      errorListener();
      closedListener();
    };
  }, []);

  /**
   * Show interstitial ad after a calculation
   * Automatically checks frequency and premium status
   */
  const showAfterCalculation = useCallback(async () => {
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_INTERSTITIAL_ADS) {
      return;
    }

    // Check if premium is active
    const premium = await isPremiumActive();
    if (premium) {
      console.log('[InterstitialAd] Premium active, skipping ad');
      return;
    }

    // Increment count and check if we should show
    const shouldShow = await incrementCalculationCount();

    if (shouldShow && interstitial && isLoaded) {
      try {
        console.log('[InterstitialAd] Showing ad');
        await interstitial.show();
      } catch (error) {
        console.log('[InterstitialAd] Error showing ad:', error);
      }
    }
  }, [interstitial, isLoaded]);

  /**
   * Manually show interstitial (for testing or specific triggers)
   */
  const show = useCallback(async () => {
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_INTERSTITIAL_ADS) {
      return;
    }

    if (interstitial && isLoaded) {
      try {
        console.log('[InterstitialAd] Manually showing ad');
        await interstitial.show();
      } catch (error) {
        console.log('[InterstitialAd] Error showing ad:', error);
      }
    } else {
      console.log('[InterstitialAd] Ad not ready to show');
    }
  }, [interstitial, isLoaded]);

  return {
    isLoaded,
    isLoading,
    showAfterCalculation,
    show,
  };
};
