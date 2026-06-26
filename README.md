# Little Space Numbers

A calm, child-friendly educational app where children learn numbers through a soft space theme. Children count stars, planets, and rockets, compare numbers, and solve very simple addition and subtraction tasks. The app is offline-only, has no ads, no purchases, no accounts, and collects no personal data.

Built with React Native and Expo.

## Features

- Learn numbers from 1 to 20 with friendly space objects (stars, planets, rockets).
- Four calm game modes: Count the Stars, Choose Bigger Number, Add with Stars, Subtract with Rockets.
- Three difficulty levels: Easy, Medium, Hard.
- Local learning statistics and progress.
- Astronaut stickers earned for learning milestones (local markers only, no money value).
- A parent settings screen for sound, default difficulty, and clearing local data.
- Fully offline. No internet, no permissions.

## Child Safety Notes

Little Space Numbers is a calm offline number learning app for children. It does not use ads, purchases, accounts, internet access, social sharing, or personal data collection. There are no timers, countdowns, penalties, competitive rankings, leaderboards, coins, bonuses, jackpots, or real money rewards. The app is designed to be pressure-free.

## Number Learning Rules

- Numbers range from 1 to 20.
- Counting objects: stars, planets, rockets.
- Easy uses numbers 1–5 with 2 answer choices.
- Medium uses numbers 1–10 with 3 answer choices.
- Hard uses numbers 1–20 (counting/comparison) with 4 answer choices.

## Simple Math Rules

- Addition results are always 10 or less.
- Subtraction starts from a number 10 or less and never produces a negative result.
- Bigger-number questions never use equal numbers.
- Answer choices always include the correct answer and never contain duplicates.

## No Timer / No Pressure

There are no timers and no countdowns anywhere in the app. Children answer at their own pace. Feedback is always gentle: correct answers say "Great counting!" and incorrect answers say "Good try. The answer was: X." There are no penalties.

## No Internet / No Permissions

The app does not request internet access or any runtime permissions. It does not use the camera, microphone, location, contacts, calendar, notifications, photo gallery, storage access, file picker, image picker, Bluetooth, nearby devices, or sensors. The Android `permissions` array is empty and `INTERNET` is not requested.

## Airplane Mode Support

The app works fully in airplane mode. All number tasks are generated locally, and all data stays on the device.

## Fullscreen Sticky Immersive Mode

On Android the app uses fullscreen sticky immersive behavior via `SystemBars` from `react-native-edge-to-edge`. The status bar and navigation bar are hidden during app usage and may reappear only briefly after an edge swipe, then auto-hide.

## Portrait Only

Orientation is locked to portrait in `app.json` (`"orientation": "portrait"`).

## Safe Area

The app uses `react-native-safe-area-context` so content does not overlap camera cutouts, notches, or rounded corners. The `ScreenContainer` component applies safe-area insets on every screen.

## Keep Awake Only on the Game Screen

`expo-keep-awake` is activated only on `SpaceGameScreen` (the active game screen) and is always released when leaving it. Keep awake is not used globally or on settings, stickers, progress, or static screens.

## No Ads / No Purchases / No Accounts / No Data Collection

There are no ads, in-app purchases, account registration, analytics, Firebase, external APIs, or any data collection. The app starts immediately without login.

## No Coins / No Bonus / No Jackpot / No Real Money Rewards

The app contains no coins, bonuses, jackpots, cash, payouts, bets, spins, slots, or any gambling-style or real-money mechanics. Astronaut stickers are purely local learning markers and have no monetary value.

## Astronaut Stickers and Progress

Astronaut stickers are simple local progress markers. Milestones:

1. First Star Sticker — answer 1 question correctly.
2. Rocket Counter Sticker — answer 5 Count the Stars questions correctly.
3. Big Number Sticker — answer 5 Bigger Number questions correctly.
4. Star Addition Sticker — answer 5 Add with Stars questions correctly.
5. Rocket Subtraction Sticker — answer 5 Subtract with Rockets questions correctly.
6. Little Astronaut Sticker — answer 25 questions correctly.

There are no rankings, leaderboards, or social sharing.

## Privacy Note

Little Space Numbers does not collect, store, or share personal information. The app works offline without internet access. Learning progress, statistics, stickers, and settings are stored only on the device using AsyncStorage. No names, age, location, device identifiers, or behavioral tracking data are stored.

## App Icon and Splash Screen

The app uses custom assets, not the default Expo icon or splash:

- `assets/icon.png` — friendly rocket with a small planet and stars on a soft pastel space background.
- `assets/adaptive-icon.png` — Android adaptive icon foreground (centered rocket and stars).
- `assets/splash.png` — soft space splash with a rocket, a number star, and the app name.

These are configured in `app.json` with background `#F4F6FF`.

---

# Build and Run

> The project is configured for the latest stable Expo SDK (SDK 53 / React Native 0.79 / React 19). Do not hand-edit dependency versions; let Expo reconcile them with `npx expo install --fix`.

## How to Scaffold with the Official Expo Template

This repository already contains the full source. To recreate the scaffold from scratch:

```bash
npx create-expo-app little-space-numbers --template blank
```

Then copy the `App.js`, `app.json`, `assets/`, and `src/` files from this repository into the new project.

## How to Install Dependencies Using `npx expo install`

Install every package through Expo so versions match the SDK:

```bash
npm install
npx expo install \
  @react-navigation/native @react-navigation/native-stack \
  react-native-screens react-native-safe-area-context \
  @react-native-async-storage/async-storage \
  react-native-edge-to-edge expo-keep-awake \
  expo-asset expo-constants expo-font expo-modules-core \
  expo-build-properties expo-status-bar
npx expo install --fix
```

## How to Run Locally

```bash
npm install
npx expo install --fix
npx expo-doctor
npx expo install --check
npx expo start
```

To run the native Android build during development:

```bash
npx expo run:android
```

## How to Build Android

Generate the native project and build release artifacts:

```bash
npx expo prebuild --platform android --no-install
node scripts/inject-signing.js android/app/build.gradle   # adds release signing config
cd android
./gradlew assembleRelease    # builds the release APK
./gradlew bundleRelease       # builds the release AAB
```

Artifacts:

- APK: `android/app/build/outputs/apk/release/`
- AAB: `android/app/build/outputs/bundle/release/`

### Google Play Compatibility

- Target Android API 35 (set via `expo-build-properties`: `compileSdkVersion 35`, `targetSdkVersion 35`, `buildToolsVersion 35.0.0`).
- `minSdkVersion 24` (satisfies React Native 0.79).
- Expo SDK 53 / React Native 0.79 with the New Architecture supports Android 15+ 16 KB memory page sizes, so the release AAB is suitable for Google Play without the "must target at least API level 35" or "does not support 16 KB memory page sizes" errors.
- No Firebase, ads SDKs, analytics SDKs, payment SDKs, or external native SDKs are included.

### Release Optimization (Staged)

1. First build and verify a **non-minified** release build (the Expo default: `minifyEnabled false`, `shrinkResources false`). Confirm it launches.
2. Only after that succeeds, enable minification and resource shrinking for the release build in `android/app/build.gradle`:

   ```gradle
   android {
       buildTypes {
           release {
               minifyEnabled true
               shrinkResources true
               proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
           }
       }
   }
   ```

   Use the rules in `android/app/proguard-rules.pro` (already provided). Re-test the app launch locally after enabling minify and shrinking.

## How to Generate a PKCS12 Keystore

Use the same password for the keystore and the key (different passwords can break PKCS12 signing):

```bash
keytool -genkeypair -v -storetype PKCS12 \
  -keystore little-space-numbers-release-key.p12 \
  -alias little_space_numbers_key \
  -keyalg RSA -keysize 2048 -validity 10000
```

Convert it to base64 for GitHub Secrets:

```bash
# macOS / Linux
base64 -i little-space-numbers-release-key.p12 -o keystore-base64.txt   # macOS
base64 -w 0 little-space-numbers-release-key.p12 > keystore-base64.txt  # Linux
```

## How to Add GitHub Secrets

In your GitHub repository: **Settings → Secrets and variables → Actions → New repository secret**. Add:

- `ANDROID_KEYSTORE_BASE64` — contents of `keystore-base64.txt`.
- `ANDROID_KEYSTORE_PASSWORD` — the keystore password.
- `ANDROID_KEY_ALIAS` — `little_space_numbers_key`.
- `ANDROID_KEY_PASSWORD` — the key password (same as the keystore password for PKCS12).

Never commit the keystore or passwords to the repository.

## GitHub Actions Build Explanation

`.github/workflows/android-build.yml` runs on push to `main`. It:

1. Installs Node.js 20 and Java 17.
2. Runs `npm install`, then `npx expo install --fix`, `npx expo-doctor`, and `npx expo install --check`.
3. Installs Android SDK Platform 35 and Build Tools 35.0.0 with `sdkmanager "platforms;android-35" "build-tools;35.0.0"`.
4. Runs `expo prebuild` to generate the native Android project.
5. Decodes the release keystore from secrets and injects the release signing config.
6. Builds the signed release APK (`assembleRelease`) and AAB (`bundleRelease`).
7. Uploads `little-space-numbers-release.apk` and `little-space-numbers-release.aab` as artifacts.

CI handles fast, stable build tasks only. An Android emulator launch smoke-test is **not** part of CI; launch verification is a local pre-release step (below).

## Local Launch Verification Checklist

A successful CI build is not proof the app launches. Before release:

1. Build the release APK.
2. Install it on a physical Android device or local emulator:
   ```bash
   adb install -r android/app/build/outputs/apk/release/app-release.apk
   ```
3. Launch the app.
4. Capture logs:
   ```bash
   adb logcat *:E ReactNative:V ReactNativeJS:V
   ```
5. Confirm there are no errors such as:
   - "Cannot find native module"
   - "Module has not been registered"
   - "Invariant Violation"
   - "theme.fonts.regular is undefined"
6. Confirm the app opens, runs in portrait, hides the system bars, and works in airplane mode.
7. Re-run this checklist after enabling release minification and resource shrinking.

## Verification Rules Covered

- No duplicated native modules; core Expo runtime modules (`expo-asset`, `expo-constants`, `expo-font`, `expo-modules-core`, `expo-keep-awake`) are direct dependencies.
- Every imported package is listed in `package.json` as a direct dependency.
- No camera, microphone, location, contacts, gallery, notifications, storage, internet, or sharing permissions.
- Works in airplane mode.
- No forbidden words or gambling-like mechanics.
- Fullscreen sticky immersive mode on Android; portrait lock; safe-area handling.
- Keep awake only on the game screen.
- Math invariants enforced (no duplicate choices, addition ≤ 10, subtraction ≥ 0, bigger-number choices never equal).
- Completing a 5-question session saves progress locally.
