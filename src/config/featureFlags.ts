/**
 * Feature Flags Configuration
 *
 * Central configuration for enabling/disabling features across the app.
 * Use these flags to control feature availability in test vs production environments.
 */

// Environment detection
export const __DEV__ = process.env.NODE_ENV === 'development';

/**
 * AD CONFIGURATION FLAGS
 */
export const AdConfig = {
  // Master switch for all ads
  ENABLE_ADS: true, // Set to false to disable ALL ads globally

  // Individual ad type controls
  ENABLE_BANNER_ADS: true,
  ENABLE_INTERSTITIAL_ADS: true,
  ENABLE_REWARDED_ADS: true,
  ENABLE_NATIVE_ADS: true,
  ENABLE_APP_OPEN_ADS: true,
  // Environment-specific settings
  USE_TEST_ADS: __DEV__, // Automatically use test ads in development

  // Ad frequency controls
  INTERSTITIAL_FREQUENCY: 2, // Show after every X navigation actions (back button clicks)
  INTERSTITIAL_MIN_INTERVAL_MINUTES: 1, // Minimum time between interstitials (in minutes)

  // Ad Unit IDs (Production)
  // TODO: Replace these with your actual AdMob Unit IDs from Google AdMob console
  PROD_BANNER_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  PROD_BANNER_AD_ID_ANDROID: 'ca-app-pub-9052358374609916/7718943922',
  PROD_INTERSTITIAL_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  PROD_INTERSTITIAL_AD_ID_ANDROID: 'ca-app-pub-9052358374609916/1097695256',
  PROD_REWARDED_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  PROD_REWARDED_AD_ID_ANDROID: 'ca-app-pub-9052358374609916/5448822046',
  PROD_NATIVE_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  PROD_NATIVE_AD_ID_ANDROID: 'ca-app-pub-9052358374609916/5092780587',
  PROD_APP_OPEN_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
  PROD_APP_OPEN_AD_ID_ANDROID: 'ca-app-pub-9052358374609916/3779698916',

  // Test Ad Unit IDs (Google's official test IDs)
  TEST_BANNER_AD_ID_IOS: 'ca-app-pub-3940256099942544/2934735716',
  TEST_BANNER_AD_ID_ANDROID: 'ca-app-pub-3940256099942544/6300978111',
  TEST_INTERSTITIAL_AD_ID_IOS: 'ca-app-pub-3940256099942544/4411468910',
  TEST_INTERSTITIAL_AD_ID_ANDROID: 'ca-app-pub-3940256099942544/1033173712',
  TEST_REWARDED_AD_ID_IOS: 'ca-app-pub-3940256099942544/1712485313',
  TEST_REWARDED_AD_ID_ANDROID: 'ca-app-pub-3940256099942544/5224354917',
  TEST_NATIVE_AD_ID_IOS: 'ca-app-pub-3940256099942544/3986624511',
  TEST_NATIVE_AD_ID_ANDROID: 'ca-app-pub-3940256099942544/2247696110',
};

/**
 * PREMIUM FEATURES FLAGS
 */
export const PremiumFeatures = {
  ENABLE_MULTI_TANK_CALCULATOR: false, // Week 3 feature
  ENABLE_DOSING_SCHEDULE: false, // Week 3 feature
  ENABLE_PRODUCT_DATABASE: false, // Week 3 feature
  ENABLE_EXPORT_FEATURE: false, // Week 3 feature
  ENABLE_NOTIFICATIONS: false, // Week 3 feature

  // Premium unlock duration (hours)
  PREMIUM_UNLOCK_DURATION_HOURS: 24,
};

/**
 * APP FEATURE FLAGS
 */
export const AppFeatures = {
  // Core features
  ENABLE_HISTORY: true,
  ENABLE_SAVE_CALCULATION: true,
  ENABLE_COPY_TO_CLIPBOARD: true,

  // Calculator features
  ENABLE_FERTILIZER_CALCULATOR: true,
  ENABLE_MEDICATION_CALCULATOR: true,
  ENABLE_CONDITIONER_CALCULATOR: true,
  ENABLE_SALINITY_CALCULATOR: false, // TODO: Implement in future

  // UI features
  ENABLE_HAPTIC_FEEDBACK: true,
  ENABLE_ANIMATIONS: true,
  SHOW_DEBUG_INFO: __DEV__, // Show debug info only in development
};

/**
 * DATA & STORAGE FLAGS
 */
export const DataConfig = {
  ENABLE_ASYNC_STORAGE: true,
  MAX_HISTORY_ITEMS: 100,
  AUTO_SAVE: true,
};

/**
 * Helper function to check if any ads are enabled
 */
export const isAnyAdEnabled = (): boolean => {
  return (
    AdConfig.ENABLE_ADS &&
    (AdConfig.ENABLE_BANNER_ADS ||
      AdConfig.ENABLE_INTERSTITIAL_ADS ||
      AdConfig.ENABLE_REWARDED_ADS)
  );
};

/**
 * Get the appropriate Ad Unit ID based on platform and environment
 */
export const getAdUnitId = (
  adType: 'banner' | 'interstitial' | 'rewarded',
  platform: 'ios' | 'android',
): string => {
  const isTest = AdConfig.USE_TEST_ADS;

  if (adType === 'banner') {
    if (isTest) {
      return platform === 'ios'
        ? AdConfig.TEST_BANNER_AD_ID_IOS
        : AdConfig.TEST_BANNER_AD_ID_ANDROID;
    }
    return platform === 'ios'
      ? AdConfig.PROD_BANNER_AD_ID_IOS
      : AdConfig.PROD_BANNER_AD_ID_ANDROID;
  }

  if (adType === 'interstitial') {
    if (isTest) {
      return platform === 'ios'
        ? AdConfig.TEST_INTERSTITIAL_AD_ID_IOS
        : AdConfig.TEST_INTERSTITIAL_AD_ID_ANDROID;
    }
    return platform === 'ios'
      ? AdConfig.PROD_INTERSTITIAL_AD_ID_IOS
      : AdConfig.PROD_INTERSTITIAL_AD_ID_ANDROID;
  }

  // rewarded
  if (isTest) {
    return platform === 'ios'
      ? AdConfig.TEST_REWARDED_AD_ID_IOS
      : AdConfig.TEST_REWARDED_AD_ID_ANDROID;
  }
  return platform === 'ios'
    ? AdConfig.PROD_REWARDED_AD_ID_IOS
    : AdConfig.PROD_REWARDED_AD_ID_ANDROID;
};

export default {
  AdConfig,
  PremiumFeatures,
  AppFeatures,
  DataConfig,
  isAnyAdEnabled,
  getAdUnitId,
};
