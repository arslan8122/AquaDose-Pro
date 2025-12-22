# 4-Week Aquarium Dosing Calculator App Development Plan

## App Overview: "AquaDose Pro"

A React Native app for aquarium hobbyists to calculate precise chemical dosing (fertilizers, medications, water conditioners, etc.)

---

## WEEK 1: Core Features & UI

### Days 1-2: Project Setup & Basic Structure

```
TASKS:
- Initialize React Native project with Expo
- Set up navigation (React Navigation)
- Create basic app structure with 3 main screens:
  * Home/Calculator screen
  * Saved calculations history
  * Settings/About screen
- Design color scheme (aquatic theme: blues, greens)
- Set up state management (Context API or Redux)
```

### Days 3-5: Calculator Logic

```
CORE CALCULATORS TO BUILD:
1. Fertilizer Dosing
   - Inputs: tank volume (gallons/liters), desired PPM, product concentration
   - Output: ml/grams to dose

2. Medication Dosing
   - Inputs: tank volume, fish type, medication strength
   - Output: precise dosage with timing

3. Water Conditioner
   - Inputs: tank volume, water change percentage
   - Output: conditioner amount needed

4. Salinity/Specific Gravity (for saltwater)
   - Inputs: current reading, target reading, volume
   - Output: salt to add/remove

FEATURES:
- Unit conversion (gallons/liters, ml/tsp/cups)
- Input validation
- Results display with clear instructions
- "Save calculation" button
```

### Days 6-7: UI Polish & Input Forms

```
- Create reusable input components
- Add dropdown for common products (Seachem Prime, API products, etc.)
- Calculator result cards with copy-to-clipboard
- Add aquarium size presets (10g, 20g, 55g, 75g, etc.)
```

---

## WEEK 2: Ad Integration & Monetization

### Days 8-9: Google AdMob Setup

```
IMPLEMENTATION PLAN:
1. Create Google AdMob account
2. Register app and get Ad Unit IDs
3. Install react-native-google-mobile-ads package
4. Configure iOS and Android ad settings

Generate these Ad Unit IDs:
- Banner Ad ID (for bottom of calculator screen)
- Interstitial Ad ID (between calculations)
- Rewarded Ad ID (for premium features)
```

### Days 10-12: Ad Placement Strategy

```
BANNER ADS:
- Location: Bottom of calculator screen (always visible)
- Size: Smart banner (adapts to screen)
- Implementation: Show on all main screens except during calculation input

INTERSTITIAL ADS:
- Trigger: After every 3 completed calculations
- Timing: Show after user sees result, before returning to input
- Frequency cap: Max 1 per 3 minutes (avoid annoying users)
- Implementation: Track calculation count in AsyncStorage

REWARDED ADS:
- Purpose: Unlock premium features
- Rewards offered:
  * Remove banner ads for 24 hours
  * Unlock "Pro Calculator" (advanced multi-tank dosing)
  * Export calculation history to PDF
  * Access to dosing schedules/reminders
- Button placement: Settings screen + locked feature screens
- Implementation: Track reward status with expiration timer
```

### Days 13-14: Ad Testing & Optimization

```
- Test all ad types on Android and iOS
- Implement ad loading states and error handling
- Add "no ads available" fallback
- Set up test device IDs for development
- Ensure ads don't cover critical UI elements
- Add privacy policy for AdMob compliance
```

---

## WEEK 3: User Experience & Data Persistence

### Days 15-17: Save & History Feature

```
IMPLEMENTATION:
- Use AsyncStorage for local data persistence
- Save calculation history with:
  * Date/time stamp
  * Calculator type used
  * Input values
  * Result
  * Optional user notes

HISTORY SCREEN:
- List of past calculations (scrollable)
- Search/filter by calculator type
- Delete individual calculations
- "Repeat calculation" button (pre-fills inputs)
- Clear all history option (with confirmation)
```

### Days 18-19: Premium Features (Rewarded Ad Unlocks)

```
BUILD THESE PREMIUM FEATURES:

1. Advanced Multi-Tank Calculator
   - Calculate dosing for multiple tanks at once
   - Batch preparation calculator

2. Dosing Schedule Planner
   - Set up weekly/monthly dosing routines
   - Push notifications for dosing reminders

3. Product Database
   - Searchable database of common aquarium products
   - Pre-filled concentration values
   - User can add custom products

4. Export Feature
   - Export history to text file
   - Share via email or messaging apps

LOCK MECHANISM:
- Show locked feature with "Watch Ad to Unlock" button
- After rewarded ad: unlock for 24 hours
- Visual indicator showing time remaining
```

### Days 20-21: Notifications & Reminders

```
- Set up react-native-push-notification
- Allow users to set dosing reminders
- Notifications for maintenance schedules
- Only available after watching rewarded ad
```

---

## WEEK 4: Testing, Polish & Launch Prep

### Days 22-24: Testing & Bug Fixes

```
TESTING CHECKLIST:
□ All calculators produce accurate results
□ All ads load and display correctly
□ Banner ads don't overlap content
□ Interstitial frequency cap works
□ Rewarded ads unlock features properly
□ App doesn't crash when ads fail to load
□ History saves and loads correctly
□ App works offline (calculators only, ads need internet)
□ Works on different screen sizes
□ iOS and Android both functional
□ No memory leaks from ad loading

USER TESTING:
- Get 3-5 aquarium hobbyists to test
- Fix critical bugs
- Improve UX based on feedback
```

### Days 25-26: App Store Preparation

```
REQUIREMENTS:

App Icon:
- 1024x1024 icon (aquarium/chemical drop theme)
- Use Canva or hire on Fiverr ($5-15)

Screenshots:
- 5-6 screenshots showing:
  * Main calculator interface
  * Result screen with dosing instructions
  * History screen
  * Premium features

App Store Listing:
- Title: "AquaDose Pro - Aquarium Calculator"
- Subtitle: "Precise Dosing for Healthy Fish"
- Description highlighting:
  * Accurate dosing calculations
  * Multiple calculator types
  * Save calculation history
  * Common product database

Keywords: aquarium, dosing, calculator, fish tank, fertilizer, medication, water conditioner

Privacy Policy:
- Create privacy policy (required for AdMob)
- Use app-privacy-policy-generator.firebaseapp.com
- Host on GitHub Pages or Google Sites (free)
```

### Days 27-28: Launch & Marketing

```
APP SUBMISSION:
- Submit to Google Play Store ($25 one-time fee)
- Submit to Apple App Store ($99/year - skip if broke, do Android first)
- Wait 1-3 days for approval

INITIAL MARKETING (FREE):
- Post in r/Aquariums (Reddit)
- Post in r/PlantedTank
- Join aquarium Facebook groups
- Post in aquarium Discord servers
- Create product listing on ProductHunt
- Short demo video for Instagram/TikTok
- Ask users to leave reviews

MARKETING MESSAGE:
"Free aquarium dosing calculator - never overdose your tank again!
Supports fertilizers, medications, and water conditioners.
Available on Android!"
```

---

## TECHNICAL STACK SUMMARY

```javascript
DEPENDENCIES YOU'LL NEED:
{
  "react-native": "latest",
  "expo": "~49.0.0",
  "@react-navigation/native": "^6.x",
  "@react-navigation/bottom-tabs": "^6.x",
  "react-native-google-mobile-ads": "^12.x",
  "@react-native-async-storage/async-storage": "^1.x",
  "react-native-push-notification": "^8.x",
  "expo-clipboard": "latest"
}
```

---

## MONETIZATION EXPECTATIONS

**Month 1-2:** $50-150

- Low downloads initially
- Banner ads: $0.50-2 per 1000 impressions
- Interstitial ads: $3-8 per 1000 impressions
- Rewarded ads: $10-20 per 1000 completions

**Month 3-6:** $200-500

- As you gain reviews and ranking
- Need 10k-30k monthly active users for $500/month

**Growth Strategy:**

- Post helpful dosing guides in aquarium communities
- Link to app in your signature
- Respond to dosing questions with "I built an app for this"
- Update with new calculators based on user requests

---

## CRITICAL SUCCESS FACTORS

1. **Accuracy is EVERYTHING** - One wrong calculation kills a fish = bad review = app dies
2. **Simple UX** - Hobbyists want quick answers, not complex forms
3. **Ads must not be intrusive** - Aquarium hobbyists are passionate but ad-sensitive
4. **Solve real problems** - Focus on most common dosing scenarios first
5. **Build trust** - Add disclaimer: "Always verify dosing with product instructions"

---

## GIVE THIS PLAN TO CLAUDE CODE:

Copy this entire plan and say:
_"Build me an aquarium dosing calculator app using React Native/Expo following this 4-week plan. Start with Week 1, Days 1-2. Use TypeScript, implement the calculator logic accurately, and prepare ad placements (I'll add actual Ad IDs later). Focus on clean, maintainable code."_

Good luck! This is actually a solid app idea with real monetization potential. 🐠💰
