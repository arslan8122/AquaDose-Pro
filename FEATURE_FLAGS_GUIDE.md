# Feature Flags Guide

This guide explains how to use the feature flags system in AquaDose Pro to control ads and features across development and production environments.

## Location

All feature flags are centralized in: `src/config/featureFlags.ts`

## Ad Configuration Flags

### Master Controls

```typescript
AdConfig.ENABLE_ADS = true // Master switch - set to false to disable ALL ads globally
AdConfig.USE_TEST_ADS = __DEV__ // Automatically uses test ads in development
```

### Individual Ad Type Controls

```typescript
AdConfig.ENABLE_BANNER_ADS = true       // Show banner ads at bottom of screens
AdConfig.ENABLE_INTERSTITIAL_ADS = true // Show full-screen ads after calculations
AdConfig.ENABLE_REWARDED_ADS = true     // Show rewarded ads for premium features
```

### Ad Frequency Settings

```typescript
AdConfig.INTERSTITIAL_FREQUENCY = 3  // Show interstitial after every X calculations
AdConfig.INTERSTITIAL_MIN_INTERVAL_MINUTES = 3  // Minimum minutes between interstitials
```

## Environment-Based Configuration

### Development Mode
- Test ads are automatically enabled via `USE_TEST_ADS = __DEV__`
- Uses Google's official test Ad Unit IDs
- No risk of policy violations
- Faster ad loading

### Production Mode
- Set `USE_TEST_ADS = false` (or relies on `NODE_ENV === 'production'`)
- Uses your real AdMob Ad Unit IDs
- Real revenue generation
- Must replace placeholder Ad Unit IDs with your actual IDs from AdMob console

## Setting Up Your Ad Unit IDs

### Step 1: Create AdMob Account
1. Go to https://admob.google.com
2. Create an account and add your app
3. Generate Ad Unit IDs for:
   - Banner Ad (iOS & Android)
   - Interstitial Ad (iOS & Android)
   - Rewarded Ad (iOS & Android)

### Step 2: Update Feature Flags

Open `src/config/featureFlags.ts` and replace the placeholder IDs:

```typescript
// Replace these with your actual AdMob Unit IDs
PROD_BANNER_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
PROD_BANNER_AD_ID_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
PROD_INTERSTITIAL_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
PROD_INTERSTITIAL_AD_ID_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
PROD_REWARDED_AD_ID_IOS: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
PROD_REWARDED_AD_ID_ANDROID: 'ca-app-pub-XXXXXXXXXXXXXXXX/YYYYYYYYYY',
```

### Step 3: Update Native Configuration

#### Android
Edit `android/app/src/main/AndroidManifest.xml`:

```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID"/>
```

#### iOS
Edit `ios/AquaDosePro/Info.plist`:

```xml
<key>GADApplicationIdentifier</key>
<string>ca-app-pub-YOUR_PUBLISHER_ID~YOUR_APP_ID</string>
```

## Quick Configuration Examples

### Disable All Ads
```typescript
AdConfig.ENABLE_ADS = false
```

### Show Only Banner Ads
```typescript
AdConfig.ENABLE_BANNER_ADS = true
AdConfig.ENABLE_INTERSTITIAL_ADS = false
AdConfig.ENABLE_REWARDED_ADS = false
```

### Reduce Ad Frequency (Less Aggressive)
```typescript
AdConfig.INTERSTITIAL_FREQUENCY = 5  // Every 5 calculations instead of 3
AdConfig.INTERSTITIAL_MIN_INTERVAL_MINUTES = 5  // Wait 5 minutes minimum
```

### Force Test Ads (for testing in production builds)
```typescript
AdConfig.USE_TEST_ADS = true  // Use test ads even in production
```

## Premium Features Configuration

Control which premium features are enabled:

```typescript
PremiumFeatures.ENABLE_MULTI_TANK_CALCULATOR = false  // Week 3 feature
PremiumFeatures.ENABLE_DOSING_SCHEDULE = false        // Week 3 feature
PremiumFeatures.ENABLE_PRODUCT_DATABASE = false       // Week 3 feature
PremiumFeatures.ENABLE_EXPORT_FEATURE = false         // Week 3 feature
PremiumFeatures.ENABLE_NOTIFICATIONS = false          // Week 3 feature
PremiumFeatures.PREMIUM_UNLOCK_DURATION_HOURS = 24    // How long premium lasts after watching rewarded ad
```

## App Feature Flags

Control core app functionality:

```typescript
AppFeatures.ENABLE_HISTORY = true
AppFeatures.ENABLE_SAVE_CALCULATION = true
AppFeatures.ENABLE_COPY_TO_CLIPBOARD = true
AppFeatures.ENABLE_HAPTIC_FEEDBACK = true
AppFeatures.ENABLE_ANIMATIONS = true
AppFeatures.SHOW_DEBUG_INFO = __DEV__  // Only in development
```

## How Ads Work in the App

### Banner Ads
- Location: Bottom of CalculatorScreen
- Always visible when on calculator screens
- Hidden for premium users
- Component: `src/components/BannerAd.tsx`

### Interstitial Ads
- Triggered: After completing calculations
- Frequency: Every 3 calculations (configurable)
- Time cap: Minimum 3 minutes between showings
- Logic: `src/hooks/useInterstitialAd.ts`
- Storage: Tracks count in AsyncStorage

### Rewarded Ads
- Purpose: Unlock premium features temporarily
- Reward: 24 hours of premium access
- Benefits: Removes banner ads, unlocks premium features
- Logic: `src/hooks/useRewardedAd.ts`

## Testing Your Ads

### Before Publishing

1. **Enable Test Ads**
   ```typescript
   AdConfig.USE_TEST_ADS = true
   ```

2. **Test Each Ad Type**
   - Banner: Navigate to any calculator screen
   - Interstitial: Complete 3 calculations
   - Rewarded: Go to Settings > Watch for Premium (coming in Week 3)

3. **Verify Frequency Caps**
   - Try completing multiple calculations quickly
   - Verify interstitials don't show too frequently
   - Check console logs for ad events

### After Publishing

1. **Switch to Production Ads**
   ```typescript
   AdConfig.USE_TEST_ADS = false
   ```

2. **Update Ad Unit IDs** (as described above)

3. **Monitor AdMob Console**
   - Check impression counts
   - Monitor revenue
   - Review ad fill rates

## Troubleshooting

### Ads Not Showing

1. Check if ads are enabled:
   ```typescript
   AdConfig.ENABLE_ADS = true
   AdConfig.ENABLE_BANNER_ADS = true  // or whichever ad type
   ```

2. Check console logs for errors

3. Verify internet connection

4. Ensure Ad Unit IDs are correct

5. Check if premium is active (disables ads)

### Test Ads Not Loading

1. Verify `USE_TEST_ADS = true`
2. Check that test Ad Unit IDs are correct (provided by Google)
3. Ensure AdMob SDK initialized correctly

### Production Ads Not Loading

1. Verify you've replaced all placeholder Ad Unit IDs
2. Check AdMob console for app approval status
3. Ensure ads.txt file is configured (for websites)
4. Wait 24-48 hours after first app publish for ad delivery to stabilize

## Best Practices

### Development
- Always use test ads during development
- Never click your own production ads (policy violation)
- Test ad frequency to ensure good UX

### Production
- Monitor user feedback about ad placement
- Adjust frequency if users complain
- Ensure ads don't cover important UI elements
- Respect premium users (no ads after watching rewarded ad)

### Privacy
- Include AdMob in your privacy policy
- Comply with GDPR/CCPA if applicable
- Set appropriate content ratings in AdMob console

## Support

For more information:
- AdMob Documentation: https://developers.google.com/admob
- React Native Google Mobile Ads: https://docs.page/invertase/react-native-google-mobile-ads
