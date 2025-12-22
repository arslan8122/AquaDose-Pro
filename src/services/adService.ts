/**
 * Ad Service
 *
 * Central service for managing all ad-related functionality
 * Handles initialization, loading, and displaying ads based on feature flags
 */

import {Platform} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import mobileAds, {
  MaxAdContentRating,
  AdsConsent,
  AdsConsentStatus,
} from 'react-native-google-mobile-ads';
import {AdConfig, isAnyAdEnabled, getAdUnitId} from '../config/featureFlags';

// Storage keys
const CALCULATION_COUNT_KEY = '@calculation_count';
const LAST_INTERSTITIAL_TIME_KEY = '@last_interstitial_time';
const PREMIUM_UNLOCK_TIME_KEY = '@premium_unlock_time';

/**
 * Initialize AdMob
 * Must be called once at app startup
 */
export const initializeAds = async (): Promise<boolean> => {
  if (!isAnyAdEnabled()) {
    console.log('[AdService] Ads disabled via feature flags');
    return false;
  }

  try {
    // Initialize the Google Mobile Ads SDK
    await mobileAds().initialize();

    // Configure ad settings
    await mobileAds().setRequestConfiguration({
      maxAdContentRating: MaxAdContentRating.PG,
      tagForChildDirectedTreatment: false,
      tagForUnderAgeOfConsent: false,
      testDeviceIdentifiers: AdConfig.USE_TEST_ADS ? ['EMULATOR'] : [],
    });

    console.log('[AdService] Ads initialized successfully');
    return true;
  } catch (error) {
    console.error('[AdService] Failed to initialize ads:', error);
    return false;
  }
};

/**
 * Check GDPR consent status
 */
export const checkConsentStatus = async (): Promise<AdsConsentStatus> => {
  try {
    const consentInfo = await AdsConsent.requestInfoUpdate();
    return consentInfo.status;
  } catch (error) {
    console.error('[AdService] Error checking consent:', error);
    return AdsConsentStatus.UNKNOWN;
  }
};

/**
 * Get Banner Ad Unit ID for current platform
 */
export const getBannerAdUnitId = (): string => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  return getAdUnitId('banner', platform);
};

/**
 * Get Interstitial Ad Unit ID for current platform
 */
export const getInterstitialAdUnitId = (): string => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  return getAdUnitId('interstitial', platform);
};

/**
 * Get Rewarded Ad Unit ID for current platform
 */
export const getRewardedAdUnitId = (): string => {
  const platform = Platform.OS === 'ios' ? 'ios' : 'android';
  return getAdUnitId('rewarded', platform);
};

/**
 * Interstitial Ad Management
 */

// Increment calculation count and check if we should show interstitial
export const incrementCalculationCount = async (): Promise<boolean> => {
  if (!AdConfig.ENABLE_INTERSTITIAL_ADS) {
    return false;
  }

  try {
    // Check if premium is active
    const isPremium = await isPremiumActive();
    if (isPremium) {
      return false; // Don't show ads for premium users
    }

    // Get current count
    const countStr = await AsyncStorage.getItem(CALCULATION_COUNT_KEY);
    const count = countStr ? parseInt(countStr, 10) : 0;
    const newCount = count + 1;

    // Save new count
    await AsyncStorage.setItem(CALCULATION_COUNT_KEY, newCount.toString());

    // Check if we should show interstitial
    if (newCount % AdConfig.INTERSTITIAL_FREQUENCY === 0) {
      // Check time-based frequency cap
      const canShow = await canShowInterstitial();
      if (canShow) {
        // Update last shown time
        await AsyncStorage.setItem(
          LAST_INTERSTITIAL_TIME_KEY,
          Date.now().toString()
        );
        return true;
      }
    }

    return false;
  } catch (error) {
    console.error('[AdService] Error incrementing calculation count:', error);
    return false;
  }
};

// Check if enough time has passed since last interstitial
const canShowInterstitial = async (): Promise<boolean> => {
  try {
    const lastTimeStr = await AsyncStorage.getItem(LAST_INTERSTITIAL_TIME_KEY);
    if (!lastTimeStr) {
      return true; // Never shown before
    }

    const lastTime = parseInt(lastTimeStr, 10);
    const now = Date.now();
    const minutesPassed = (now - lastTime) / (1000 * 60);

    return minutesPassed >= AdConfig.INTERSTITIAL_MIN_INTERVAL_MINUTES;
  } catch (error) {
    console.error('[AdService] Error checking interstitial timing:', error);
    return true; // Default to allowing
  }
};

/**
 * Premium / Rewarded Ad Management
 */

// Unlock premium features after watching rewarded ad
export const unlockPremium = async (): Promise<void> => {
  try {
    const unlockTime = Date.now();
    await AsyncStorage.setItem(PREMIUM_UNLOCK_TIME_KEY, unlockTime.toString());
    console.log('[AdService] Premium unlocked');
  } catch (error) {
    console.error('[AdService] Error unlocking premium:', error);
  }
};

// Check if premium is currently active
export const isPremiumActive = async (): Promise<boolean> => {
  try {
    const unlockTimeStr = await AsyncStorage.getItem(PREMIUM_UNLOCK_TIME_KEY);
    if (!unlockTimeStr) {
      return false;
    }

    const unlockTime = parseInt(unlockTimeStr, 10);
    const now = Date.now();
    const hoursPassed = (now - unlockTime) / (1000 * 60 * 60);

    // Check if within unlock duration (default 24 hours)
    return hoursPassed < 24;
  } catch (error) {
    console.error('[AdService] Error checking premium status:', error);
    return false;
  }
};

// Get remaining premium time in milliseconds
export const getRemainingPremiumTime = async (): Promise<number> => {
  try {
    const unlockTimeStr = await AsyncStorage.getItem(PREMIUM_UNLOCK_TIME_KEY);
    if (!unlockTimeStr) {
      return 0;
    }

    const unlockTime = parseInt(unlockTimeStr, 10);
    const now = Date.now();
    const expiryTime = unlockTime + 24 * 60 * 60 * 1000; // 24 hours

    return Math.max(0, expiryTime - now);
  } catch (error) {
    console.error('[AdService] Error getting remaining premium time:', error);
    return 0;
  }
};

// Reset calculation count (for testing)
export const resetCalculationCount = async (): Promise<void> => {
  try {
    await AsyncStorage.setItem(CALCULATION_COUNT_KEY, '0');
  } catch (error) {
    console.error('[AdService] Error resetting calculation count:', error);
  }
};

export default {
  initializeAds,
  checkConsentStatus,
  getBannerAdUnitId,
  getInterstitialAdUnitId,
  getRewardedAdUnitId,
  incrementCalculationCount,
  unlockPremium,
  isPremiumActive,
  getRemainingPremiumTime,
  resetCalculationCount,
};
