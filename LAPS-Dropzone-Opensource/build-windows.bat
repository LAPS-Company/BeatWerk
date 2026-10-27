@echo off
setlocal
cd /d "%~dp0"
echo.
echo =======================================
echo   LAPS Dropzone - Windows Build 1.0.1
echo =======================================
echo.
where npm >nul 2>nul
if errorlevel 1 (
  echo ERROR: Node.js/npm could not be found. Install Node.js LTS first.
  pause
  exit /b 1
)
if not exist node_modules (
  echo Installing dependencies...
  call npm install
  if errorlevel 1 goto :fail
)
echo Checking JavaScript syntax...
call npm run check
if errorlevel 1 goto :fail
echo Running automated tests...
call npm test
if errorlevel 1 goto :fail
echo Building Windows installer...
call npm run dist
if errorlevel 1 goto :fail
echo.
echo SUCCESS: Check the dist folder for LAPS-Dropzone-Setup-1.0.1.exe
pause
exit /b 0
:fail
echo.
echo BUILD FAILED. Read the error above, fix the issue, and run again.
pause
exit /b 1
