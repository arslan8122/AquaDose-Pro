/**
 * useRewardedAd Hook
 *
 * Custom hook for loading and showing rewarded ads
 * Used to unlock premium features temporarily
 */

import {useEffect, useState, useCallback} from 'react';
import {
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import {AdConfig} from '../config/featureFlags';
import {getRewardedAdUnitId, unlockPremium} from '../services/adService';

export const useRewardedAd = () => {
  const [rewarded, setRewarded] = useState<RewardedAd | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize and load the rewarded ad
  useEffect(() => {
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_REWARDED_ADS) {
      return;
    }

    const adUnitId = getRewardedAdUnitId();
    const ad = RewardedAd.createForAdRequest(adUnitId, {
      requestNonPersonalizedAdsOnly: false,
    });

    // Event listeners
    const loadedListener = ad.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        console.log('[RewardedAd] Ad loaded');
        setIsLoaded(true);
        setIsLoading(false);
      }
    );

    const errorListener = ad.addAdEventListener(AdEventType.ERROR, (error) => {
      console.log('[RewardedAd] Error loading ad:', error);
      setIsLoaded(false);
      setIsLoading(false);
    });

    const earnedListener = ad.addAdEventListener(
      RewardedAdEventType.EARNED_REWARD,
      async (reward) => {
        console.log('[RewardedAd] User earned reward:', reward);
        // Unlock premium features
        await unlockPremium();
      }
    );

    const closedListener = ad.addAdEventListener(AdEventType.CLOSED, () => {
      console.log('[RewardedAd] Ad closed');
      setIsLoaded(false);
      // Reload the ad for next time
      loadAd();
    });

    setRewarded(ad);

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
      earnedListener();
      closedListener();
    };
  }, []);

  /**
   * Show rewarded ad
   * Returns true if user completed watching and earned reward
   */
  const show = useCallback(async (): Promise<boolean> => {
    if (!AdConfig.ENABLE_ADS || !AdConfig.ENABLE_REWARDED_ADS) {
      console.log('[RewardedAd] Rewarded ads disabled');
      return false;
    }

    if (rewarded && isLoaded) {
      try {
        console.log('[RewardedAd] Showing ad');
        await rewarded.show();
        return true; // User will earn reward via event listener
      } catch (error) {
        console.log('[RewardedAd] Error showing ad:', error);
        return false;
      }
    } else {
      console.log('[RewardedAd] Ad not ready to show');
      return false;
    }
  }, [rewarded, isLoaded]);

  return {
    isLoaded,
    isLoading,
    show,
  };
};
