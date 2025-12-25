@echo off
echo Next.js + Supabase Migration Starter
echo ====================================
echo.

echo This script will help you start the migration to Next.js + Supabase
echo.

echo Before running this script, make sure you have:
echo 1. Node.js installed (version 16 or higher)
echo 2. A Supabase account (free at supabase.com)
echo 3. Backup of your current project
echo.

echo The migration will create a new Next.js project in a separate folder
echo to avoid affecting your current working application.
echo.

echo Press any key to continue...
pause >nul

echo.
echo Creating new Next.js project...
echo ==============================
echo.

cd "E:\ASIK Work station\App - Projects"
npx create-next-app@latest expense-tracker-next --typescript --tailwind --app --src-dir

echo.
echo Next.js project created successfully!
echo.

echo Next steps:
echo 1. Open the new project in your code editor
echo 2. Review the migration plan in:
echo    E:\ASIK Work station\App - Projects\Expance Treaker\nextjs-supabase-migration-plan.txt
echo 3. Start with Phase 1 of the migration
echo.

echo IMPORTANT: This is a starter script only.
echo You'll need to manually migrate your components, 
echo data, and functionality according to the plan.
echo.

pause