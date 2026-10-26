@echo off
setlocal
cd /d "%~dp0"
echo.
echo ======================================
echo   LAPS Flow v1.0.0 - Windows Setup Builder
echo ======================================
echo.
where node >nul 2>nul
if errorlevel 1 (
  echo FEHLER: Node.js wurde nicht gefunden.
  echo Installiere die LTS-Version von https://nodejs.org/ und starte diese Datei erneut.
  pause
  exit /b 1
)
where npm >nul 2>nul
if errorlevel 1 (
  echo FEHLER: npm wurde nicht gefunden. Installiere Node.js erneut.
  pause
  exit /b 1
)
echo [1/3] Installiere Projekt-Abhaengigkeiten ...
call npm install
if errorlevel 1 (
  echo.
  echo FEHLER: npm install ist fehlgeschlagen. Pruefe die Internetverbindung und die npm-Fehlermeldung.
  pause
  exit /b 1
)
echo.
echo [2/3] Pruefe Syntax und automatisierte Tests ...
call npm run verify
if errorlevel 1 (
  echo.
  echo FEHLER: Die Quellcode-Pruefungen oder Tests sind fehlgeschlagen.
  pause
  exit /b 1
)
echo.
echo [3/3] Erzeuge den Windows-Installer ...
call npm run dist
if errorlevel 1 (
  echo.
  echo FEHLER: Der Windows-Build ist fehlgeschlagen.
  pause
  exit /b 1
)
echo.
echo ERFOLG! Das Setup sollte in diesem Ordner liegen:
echo %CD%\dist\LAPS-Flow-Setup-1.0.0.exe
explorer "%CD%\dist"
pause
