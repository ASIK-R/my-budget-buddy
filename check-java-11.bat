@echo off
echo Checking for Java 11 Installation
echo ===============================
echo.

echo Checking common Java 11 installation paths:
echo.

if exist "C:\Program Files\Java\jdk-11.0.21" (
    echo ✓ Found: C:\Program Files\Java\jdk-11.0.21
    echo Java version:
    "C:\Program Files\Java\jdk-11.0.21\bin\java.exe" -version
    echo.
) else (
    echo ✗ Not found: C:\Program Files\Java\jdk-11.0.21
    echo.
)

if exist "C:\Program Files\Java\jdk-11" (
    echo ✓ Found: C:\Program Files\Java\jdk-11
    echo Java version:
    "C:\Program Files\Java\jdk-11\bin\java.exe" -version
    echo.
) else (
    echo ✗ Not found: C:\Program Files\Java\jdk-11
    echo.
)

if exist "C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot" (
    echo ✓ Found: C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot
    echo Java version:
    "C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot\bin\java.exe" -version
    echo.
) else (
    echo ✗ Not found: C:\Program Files\Eclipse Adoptium\jdk-11.0.21.9-hotspot
    echo.
)

echo.
echo If none of the above show Java 11, you need to:
echo 1. Download and install Java JDK 11 from:
echo    https://adoptium.net/temurin/releases/?version=11
echo 2. Install it to one of the default locations
echo.
echo OR
echo.
echo Use Android Studio to build the APK (recommended)
echo as it handles all Java dependencies automatically.
echo.

pause