@echo off
echo Building Expense Tracker APK...
echo ==============================
echo.
echo This will attempt to build the APK using Gradle.
echo Make sure you have Android SDK installed and ANDROID_HOME environment variable set.
echo.
echo Press any key to continue...
pause >nul

cd /d "E:\ASIK Work station\App - Projects\Expance Treaker\expense-tracker-android"

echo.
echo Building APK...
echo.

:: Try to build using Gradle wrapper
if exist gradlew.bat (
    echo Using Gradle wrapper...
    call gradlew.bat assembleDebug
) else (
    echo Gradle wrapper not found. Trying direct Gradle command...
    gradle assembleDebug
)

if %errorlevel% == 0 (
    echo.
    echo =================================================
    echo ✅ APK BUILD SUCCESSFUL!
    echo.
    echo APK location:
    echo E:\ASIK Work station\App - Projects\Expance Treaker\expense-tracker-android\app\build\outputs\apk\debug\app-debug.apk
    echo =================================================
) else (
    echo.
    echo =================================================
    echo ❌ APK BUILD FAILED
    echo.
    echo Please open the project in Android Studio and build it manually:
    echo 1. Open Android Studio
    echo 2. Open project from:
    echo    E:\ASIK Work station\App - Projects\Expance Treaker\expense-tracker-android
    echo 3. Build → Build Bundle(s) / APK(s) → Build APK
    echo =================================================
)

echo.
echo Press any key to exit...
pause >nul