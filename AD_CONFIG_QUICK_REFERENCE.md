# Ad Configuration Quick Reference Card

## 🎯 Single File to Control Everything
**File:** `src/config/featureFlags.ts`

---

## 🚀 Common Configurations

### Development Mode (Default)
```typescript
// Already configured - no changes needed!
AdConfig.ENABLE_ADS = true
AdConfig.USE_TEST_ADS = __DEV__  // Auto-enabled in development
```
✅ Safe to test
✅ Uses Google test ads
✅ No policy violations

---

### Disable All Ads Completely
```typescript
AdConfig.ENABLE_ADS = false
```
Use when: Testing calculator logic without distractions

---

### Show Only Banner Ads
```typescript
AdConfig.ENABLE_BANNER_ADS = true
AdConfig.ENABLE_INTERSTITIAL_ADS = false
AdConfig.ENABLE_REWARDED_ADS = false
```
Use when: Less aggressive monetization

---

### Less Frequent Interstitials
```typescript
AdConfig.INTERSTITIAL_FREQUENCY = 5        // Every 5 calculations (default: 3)
AdConfig.INTERSTITIAL_MIN_INTERVAL_MINUTES = 5  // Wait 5 min (default: 3)
```
Use when: Better user experience

---

### Production Mode (Before App Store)
```typescript
// 1. Update these in featureFlags.ts:
AdConfig.PROD_BANNER_AD_ID_IOS = 'ca-app-pub-XXXXX/YYYYY'
AdConfig.PROD_BANNER_AD_ID_ANDROID = 'ca-app-pub-XXXXX/YYYYY'
AdConfig.PROD_INTERSTITIAL_AD_ID_IOS = 'ca-app-pub-XXXXX/YYYYY'
AdConfig.PROD_INTERSTITIAL_AD_ID_ANDROID = 'ca-app-pub-XXXXX/YYYYY'
AdConfig.PROD_REWARDED_AD_ID_IOS = 'ca-app-pub-XXXXX/YYYYY'
AdConfig.PROD_REWARDED_AD_ID_ANDROID = 'ca-app-pub-XXXXX/YYYYY'

// 2. Build in release mode (USE_TEST_ADS will auto-detect)
```

---

## 📱 Where Ads Appear

| Ad Type | Location | Trigger |
|---------|----------|---------|
| **Banner** | Bottom of calculator screens | Always visible |
| **Interstitial** | Full screen | After every 3 calculations |
| **Rewarded** | Settings screen (Week 3) | User taps "Watch for Premium" |

---

## 🔧 Troubleshooting

### Ads not showing?
1. Check `ENABLE_ADS = true`
2. Check specific ad type enabled
3. Check internet connection
4. View console logs

### Want to test production ads?
```typescript
AdConfig.USE_TEST_ADS = false
```
⚠️ Use a different device, don't click your own ads!

---

## 📋 Before Publishing Checklist

- [ ] Create AdMob account
- [ ] Register app in AdMob console
- [ ] Get App ID and Ad Unit IDs (6 total: 3 for iOS, 3 for Android)
- [ ] Update `featureFlags.ts` with production IDs
- [ ] Update `AndroidManifest.xml` with App ID
- [ ] Update `Info.plist` with App ID
- [ ] Create and publish Privacy Policy
- [ ] Test on physical device with production ads
- [ ] Set `USE_TEST_ADS = false` (or build in release mode)

---

## 🎮 Testing Commands

```bash
# Development (test ads enabled automatically)
npm run android
npm run ios

# Production build with real ads
cd android && ./gradlew assembleRelease
# or
cd ios && xcodebuild -scheme AquaDosePro -configuration Release
```

---

## 💡 Pro Tips

1. **Always use test ads during development** - Clicking your own production ads = account ban
2. **Monitor user feedback** - Adjust frequency if users complain
3. **Premium users see no ads** - After watching rewarded ad
4. **Console logs show ad events** - Look for `[BannerAd]`, `[InterstitialAd]`, `[RewardedAd]`

---

## 📚 Full Documentation
See `FEATURE_FLAGS_GUIDE.md` for complete details

---

## 🆘 Support Resources

- AdMob Help: https://support.google.com/admob
- React Native Ads Docs: https://docs.page/invertase/react-native-google-mobile-ads
- Feature Flags Guide: `./FEATURE_FLAGS_GUIDE.md`
