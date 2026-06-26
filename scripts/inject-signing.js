/**
 * inject-signing.js
 *
 * Run AFTER `expo prebuild` (which generates the native android/ project).
 * It adds a `release` signing config that reads credentials from
 * gradle.properties (LSN_UPLOAD_*), and points the release build type at it.
 *
 * It does NOT enable minification here. Per the staged release strategy, the
 * first release build is non-minified (the Expo default). Enable minify only
 * after verifying a non-minified release launches — see README.
 *
 * Usage: node scripts/inject-signing.js android/app/build.gradle
 */
const fs = require("fs");

const gradlePath = process.argv[2] || "android/app/build.gradle";

if (!fs.existsSync(gradlePath)) {
  console.error(`[inject-signing] File not found: ${gradlePath}`);
  process.exit(1);
}

let gradle = fs.readFileSync(gradlePath, "utf8");

if (gradle.includes("LSN_UPLOAD_STORE_FILE")) {
  console.log("[inject-signing] Signing config already present. Skipping.");
  process.exit(0);
}

const releaseSigningBlock = `
        release {
            if (project.hasProperty('LSN_UPLOAD_STORE_FILE')) {
                storeFile file(LSN_UPLOAD_STORE_FILE)
                storePassword LSN_UPLOAD_STORE_PASSWORD
                keyAlias LSN_UPLOAD_KEY_ALIAS
                keyPassword LSN_UPLOAD_KEY_PASSWORD
            }
        }`;

// Insert the release signing config at the start of the signingConfigs block.
if (/signingConfigs\s*\{/.test(gradle)) {
  gradle = gradle.replace(/signingConfigs\s*\{/, (match) => `${match}${releaseSigningBlock}`);
} else {
  console.error("[inject-signing] Could not find signingConfigs block.");
  process.exit(1);
}

// Point the release build type at signingConfigs.release.
// The Expo template ships `release { signingConfig signingConfigs.debug ... }`.
gradle = gradle.replace(
  /(release\s*\{[^}]*?)signingConfig\s+signingConfigs\.debug/m,
  "$1signingConfig signingConfigs.release"
);

fs.writeFileSync(gradlePath, gradle, "utf8");
console.log("[inject-signing] Release signing config injected successfully.");
