# Expense Tracker Android APK

This Android project wraps the Expense Tracker PWA as a WebView application.

## How to Build the APK

1. Open this project in Android Studio
2. Wait for Gradle to sync
3. Connect an Android device or start an emulator
4. Click the "Run" button (green play icon) to build and install the app

## Project Structure

- All PWA files are in `app/src/main/assets/`
- The main activity loads `file:///android_asset/index.html`
- Internet permission is enabled for online features

## Customization

- App name: Expense Tracker
- Package ID: com.expensetracker.app
- Version: 1.0

The app works offline since all files are bundled in the APK.
