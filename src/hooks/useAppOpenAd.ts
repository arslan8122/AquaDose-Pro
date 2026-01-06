/**
 * App Open Ad Hook
 *
 * Hook for managing App Open Ads that show when the app starts
 * Only shows once per app launch
 */

import {useEffect, useState, useRef} from 'react';
import {AppState, AppStateStatus, Platform} from 'react-native';
import {
  AppOpenAd,
  AdEventType,
  TestIds,
} from 'react-native-google-mobile-ads';
import {AdConfig} from '../config/featureFlags';

const getAdUnitId = (): string => {
  if (AdConfig.USE_TEST_ADS) {
    return TestIds.APP_OPEN;
  }
  return Platform.OS === 'ios'
    ? AdConfig.PROD_APP_OPEN_AD_ID_IOS
    : AdConfig.PROD_APP_OPEN_AD_ID_ANDROID;
};

export const useAppOpenAd = () => {
  const [isAdLoaded, setIsAdLoaded] = useState(false);
  const [isAdShowing, setIsAdShowing] = useState(false);
  const [isAdLoading, setIsAdLoading] = useState(true); // Track if ad is currently loading
  const adRef = useRef<AppOpenAd | null>(null);
  const hasShownAd = useRef(false); // Track if ad has been shown in this session

  // Load the ad
  useEffect(() => {
    if (!AdConfig.ENABLE_APP_OPEN_ADS || hasShownAd.current) {
      setIsAdLoading(false); // No ad to load
      return;
    }

    setIsAdLoading(true);
    const adUnitId = getAdUnitId();
    const appOpenAd = AppOpenAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Set up event listeners
    const loadedListener = appOpenAd.addAdEventListener(
      AdEventType.LOADED,
      () => {
        console.log('[AppOpenAd] Ad loaded successfully');
        setIsAdLoaded(true);
        setIsAdLoading(false);
      }
    );

    const errorListener = appOpenAd.addAdEventListener(
      AdEventType.ERROR,
      error => {
        console.error('[AppOpenAd] Failed to load ad:', error);
        setIsAdLoaded(false);
        setIsAdLoading(false); // Stop loading on error
      }
    );

    const closedListener = appOpenAd.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        console.log('[AppOpenAd] Ad closed');
        setIsAdShowing(false);
        hasShownAd.current = true;
      }
    );

    adRef.current = appOpenAd;

    // Load the ad
    appOpenAd.load();

    // Cleanup
    return () => {
      loadedListener();
      errorListener();
      closedListener();
    };
  }, []);

  // Show the ad
  const showAd = async (): Promise<boolean> => {
    if (!isAdLoaded || !adRef.current || hasShownAd.current) {
      console.log('[AppOpenAd] Cannot show ad - not loaded or already shown');
      return false;
    }

    try {
      setIsAdShowing(true);
      await adRef.current.show();
      return true;
    } catch (error) {
      console.error('[AppOpenAd] Error showing ad:', error);
      setIsAdShowing(false);
      return false;
    }
  };

  return {
    isAdLoaded,
    isAdShowing,
    isAdLoading,
    showAd,
  };
};
