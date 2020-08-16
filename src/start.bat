@echo off
title PRESET SELECTER
:main
echo.
echo ---------------------------
echo.
echo PRESET SELECTER
echo.
echo ---------------------------
echo Enter The Preset Id To Continue..
echo.
echo 1) Default
echo.
echo 2) CustomPreset1
echo.
echo 3) CustomPreset2
echo.
echo 4) CustomPreset3
echo.
set /p do=id.
if %do%== 1 goto 1
if %do%== 2 goto 2
if %do%== 3 goto 3
if %do%== 4 goto 4
echo
cls
pause
goto main
:1
cd scripts
npm run default
exit
:2
cd scripts
npm run custom1
exit
:3
cd scripts
npm run custom2
exit
:4
cd scripts
npm run custom3
exit