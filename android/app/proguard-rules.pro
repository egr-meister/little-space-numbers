# Proguard / R8 rules for Little Space Numbers (release minify stage).
#
# Staged strategy:
#   1. First ship a NON-minified release build (Expo default) and verify launch.
#   2. Only then enable minifyEnabled + shrinkResources for the release build
#      and re-test the launch locally (see README).
#
# These rules keep the React Native / Expo / Hermes runtime safe under R8 so
# enabling minification does not break the app. Do NOT add risky third-party
# obfuscation tools.

# --- React Native core ---
-keep,allowobfuscation @interface com.facebook.proguard.annotations.DoNotStrip
-keep,allowobfuscation @interface com.facebook.proguard.annotations.KeepGettersAndSetters
-keep @com.facebook.proguard.annotations.DoNotStrip class *
-keepclassmembers class * { @com.facebook.proguard.annotations.DoNotStrip *; }
-keepclassmembers class * { @com.facebook.proguard.annotations.KeepGettersAndSetters *; }

-keep class com.facebook.react.** { *; }
-keep class com.facebook.jni.** { *; }
-dontwarn com.facebook.react.**

# --- Hermes ---
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }

# --- TurboModules / New Architecture (JNI bound) ---
-keep class com.facebook.react.turbomodule.** { *; }
-keep class com.facebook.react.bridge.** { *; }
-keepclassmembers class * { native <methods>; }

# --- Expo modules ---
-keep class expo.modules.** { *; }
-dontwarn expo.modules.**

# --- AsyncStorage ---
-keep class com.reactnativecommunity.asyncstorage.** { *; }

# --- Keep JS-referenced annotations and enums ---
-keepattributes *Annotation*,Signature,InnerClasses,EnclosingMethod
-keepclassmembers enum * { *; }

# --- Keep view managers / native modules referenced by name ---
-keepclassmembers class * extends com.facebook.react.bridge.BaseJavaModule { *; }
-keepclassmembers class * extends com.facebook.react.uimanager.ViewManager { *; }
