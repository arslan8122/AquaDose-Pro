# AquaDose Pro - Keystore Information

## Release Keystore Details

**Location:** `android/app/release.keystore`

**Keystore Password:** `arslan2281`

**Key Alias:** `aquadosepro-release`

**Key Password:** `arslan2281`

## Important Notes

- This keystore is used to sign the production release builds of AquaDose Pro
- Keep this keystore file safe and secure - if lost, you cannot update the app on Google Play Store
- The keystore is intentionally NOT in .gitignore for this project
- Validity: 10,000 days from generation date

## Building Release APK/AAB

To build a release version:

```bash
cd android
./gradlew bundleRelease    # For AAB (App Bundle)
# or
./gradlew assembleRelease  # For APK
```

The output files will be located at:
- AAB: `android/app/build/outputs/bundle/release/app-release.aab`
- APK: `android/app/build/outputs/apk/release/app-release.apk`
