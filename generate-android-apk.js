#!/usr/bin/env node

import { copyFileSync, existsSync, mkdirSync, readdirSync, statSync, writeFileSync } from 'fs'
import { join } from 'path'

console.log('Generating Android Project for Expense Tracker PWA...')
console.log('====================================================')

// Check if dist folder exists
const distPath = join(process.cwd(), 'dist')
if (!existsSync(distPath)) {
  console.error('Error: dist folder not found. Please run "npm run build" first.')
  process.exit(1)
}

console.log('✓ Dist folder found')

// Create Android project structure
const androidProjectPath = join(process.cwd(), 'expense-tracker-android')
if (!existsSync(androidProjectPath)) {
  mkdirSync(androidProjectPath, { recursive: true })
}

// Create directory structure
const directories = [
  'app/src/main/java/com/expensetracker/app',
  'app/src/main/res/layout',
  'app/src/main/res/values',
  'app/src/main/assets',
  'app/libs',
]

directories.forEach(dir => {
  const fullPath = join(androidProjectPath, dir)
  if (!existsSync(fullPath)) {
    mkdirSync(fullPath, { recursive: true })
  }
})

console.log('✓ Android project structure created')

// Copy PWA files to assets
function copyRecursiveSync(src, dest) {
  const exists = existsSync(src)
  const stats = exists && statSync(src)
  const isDirectory = exists && stats.isDirectory()

  if (isDirectory) {
    if (!existsSync(dest)) {
      mkdirSync(dest)
    }
    readdirSync(src).forEach(childItemName => {
      copyRecursiveSync(join(src, childItemName), join(dest, childItemName))
    })
  } else {
    copyFileSync(src, dest)
  }
}

copyRecursiveSync(distPath, join(androidProjectPath, 'app/src/main/assets'))
console.log('✓ PWA files copied to assets')

// Create build.gradle (Project level)
const projectBuildGradle = `buildscript {
    ext.kotlin_version = '1.8.0'
    repositories {
        google()
        mavenCentral()
    }
    dependencies {
        classpath 'com.android.tools.build:gradle:7.4.2'
        classpath "org.jetbrains.kotlin:kotlin-gradle-plugin:$kotlin_version"
    }
}

allprojects {
    repositories {
        google()
        mavenCentral()
    }
}

task clean(type: Delete) {
    delete rootProject.buildDir
}
`

writeFileSync(join(androidProjectPath, 'build.gradle'), projectBuildGradle)
console.log('✓ Project build.gradle created')

// Create build.gradle (App level)
const appBuildGradle = `plugins {
    id 'com.android.application'
    id 'org.jetbrains.kotlin.android'
}

android {
    namespace 'com.expensetracker.app'
    compileSdk 33

    defaultConfig {
        applicationId "com.expensetracker.app"
        minSdk 21
        targetSdk 33
        versionCode 1
        versionName "1.0"

        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
    }

    buildTypes {
        release {
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
    compileOptions {
        sourceCompatibility JavaVersion.VERSION_1_8
        targetCompatibility JavaVersion.VERSION_1_8
    }
    kotlinOptions {
        jvmTarget = '1.8'
    }
}

dependencies {
    implementation 'androidx.core:core-ktx:1.9.0'
    implementation 'androidx.appcompat:appcompat:1.6.1'
    implementation 'com.google.android.material:material:1.8.0'
    implementation 'androidx.constraintlayout:constraintlayout:2.1.4'
    testImplementation 'junit:junit:4.13.2'
    androidTestImplementation 'androidx.test.ext:junit:1.1.5'
    androidTestImplementation 'androidx.test.espresso:espresso-core:3.5.1'
}
`

writeFileSync(join(androidProjectPath, 'app/build.gradle'), appBuildGradle)
console.log('✓ App build.gradle created')

// Create settings.gradle
const settingsGradle = `pluginManagement {
    repositories {
        gradlePluginPortal()
        google()
        mavenCentral()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}
rootProject.name = "ExpenseTracker"
include ':app'
`

writeFileSync(join(androidProjectPath, 'settings.gradle'), settingsGradle)
console.log('✓ settings.gradle created')

// Create gradle.properties
const gradleProperties = `org.gradle.jvmargs=-Xmx2048m -Dfile.encoding=UTF-8
android.useAndroidX=true
android.enableJetifier=true
kotlin.code.style=official
`

writeFileSync(join(androidProjectPath, 'gradle.properties'), gradleProperties)
console.log('✓ gradle.properties created')

// Create gradlew files
const gradlew = `#!/bin/sh
echo "This is a placeholder for gradlew. Please use Android Studio to build the project."
`

writeFileSync(join(androidProjectPath, 'gradlew'), gradlew)
writeFileSync(join(androidProjectPath, 'gradlew.bat'), gradlew)
console.log('✓ Gradle wrapper files created')

// Create AndroidManifest.xml
const androidManifest = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:allowBackup="true"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.ExpenseTracker"
        android:usesCleartextTraffic="true"
        tools:targetApi="31">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:label="@string/app_name"
            android:theme="@style/Theme.ExpenseTracker">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>

</manifest>
`

writeFileSync(join(androidProjectPath, 'app/src/main/AndroidManifest.xml'), androidManifest)
console.log('✓ AndroidManifest.xml created')

// Create MainActivity.java
const mainActivity = `package com.expensetracker.app;

import android.os.Bundle;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        webView = findViewById(R.id.webview);
        
        // Enable JavaScript
        WebSettings webSettings = webView.getSettings();
        webSettings.setJavaScriptEnabled(true);
        webSettings.setDomStorageEnabled(true);
        
        // Enable zoom
        webSettings.setBuiltInZoomControls(true);
        webSettings.setDisplayZoomControls(false);
        
        // Enable database
        webSettings.setDatabaseEnabled(true);
        
        // Set WebViewClient to handle navigation within the app
        webView.setWebViewClient(new WebViewClient());
        
        // Load the local PWA
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`

writeFileSync(
  join(androidProjectPath, 'app/src/main/java/com/expensetracker/app/MainActivity.java'),
  mainActivity
)
console.log('✓ MainActivity.java created')

// Create activity_main.xml
const activityMain = `<?xml version="1.0" encoding="utf-8"?>
<androidx.constraintlayout.widget.ConstraintLayout 
    xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:app="http://schemas.android.com/apk/res-auto"
    xmlns:tools="http://schemas.android.com/tools"
    android:layout_width="match_parent"
    android:layout_height="match_parent"
    tools:context=".MainActivity">

    <WebView
        android:id="@+id/webview"
        android:layout_width="match_parent"
        android:layout_height="match_parent" />

</androidx.constraintlayout.widget.ConstraintLayout>
`

writeFileSync(join(androidProjectPath, 'app/src/main/res/layout/activity_main.xml'), activityMain)
console.log('✓ activity_main.xml created')

// Create strings.xml
const stringsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">Expense Tracker</string>
</resources>
`

writeFileSync(join(androidProjectPath, 'app/src/main/res/values/strings.xml'), stringsXml)
console.log('✓ strings.xml created')

// Create styles.xml
const stylesXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <style name="Theme.ExpenseTracker" parent="Theme.MaterialComponents.DayNight.NoActionBar">
        <item name="colorPrimary">@color/purple_500</item>
        <item name="colorPrimaryVariant">@color/purple_700</item>
        <item name="colorOnPrimary">@color/white</item>
        <item name="colorSecondary">@color/teal_200</item>
        <item name="colorSecondaryVariant">@color/teal_700</item>
        <item name="colorOnSecondary">@color/black</item>
        <item name="android:statusBarColor">?attr/colorPrimaryVariant</item>
    </style>
</resources>
`

writeFileSync(join(androidProjectPath, 'app/src/main/res/values/styles.xml'), stylesXml)
console.log('✓ styles.xml created')

// Create colors.xml
const colorsXml = `<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="purple_200">#FFBB86FC</color>
    <color name="purple_500">#FF6200EE</color>
    <color name="purple_700">#FF3700B3</color>
    <color name="teal_200">#FF03DAC5</color>
    <color name="teal_700">#FF018786</color>
    <color name="black">#FF000000</color>
    <color name="white">#FFFFFFFF</color>
</resources>
`

writeFileSync(join(androidProjectPath, 'app/src/main/res/values/colors.xml'), colorsXml)
console.log('✓ colors.xml created')

console.log('\n✅ Android project generated successfully!')
console.log(`\n📁 Project location: ${androidProjectPath}`)
console.log('\n📋 To build the APK:')
console.log('1. Open Android Studio')
console.log('2. Select "Open an existing project"')
console.log(`3. Navigate to: ${androidProjectPath}`)
console.log('4. Click "OK"')
console.log('5. Wait for Gradle to sync (this may take a few minutes)')
console.log('6. Click "Build" → "Build Bundle(s) / APK(s)" → "Build APK"')
console.log('\n📁 The APK will be generated at: app/build/outputs/apk/debug/app-debug.apk')

console.log('\n📱 APK Features:')
console.log('• Works completely offline (all files bundled in APK)')
console.log('• Full Expense Tracker functionality')
console.log('• Native Android back button support')
console.log('• Responsive design for all screen sizes')
