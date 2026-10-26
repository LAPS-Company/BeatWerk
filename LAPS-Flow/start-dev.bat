@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul || (echo Node.js fehlt. Installiere es von https://nodejs.org/ & pause & exit /b 1)
if not exist node_modules\electron\dist\electron.exe (
  echo Abhaengigkeiten werden installiert ...
  call npm install || (pause & exit /b 1)
)
call npm start
pause
