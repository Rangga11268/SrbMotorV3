@echo off
REM Setup script to link centralized assets folder to backend and mobile on Windows
echo [SRB Motor] Menyiapkan tautan direktori assets...

if not exist "%~dp0assets" (
    echo [ERROR] Direktori assets tidak ditemukan di %~dp0assets!
    exit /b 1
)

if not exist "%~dp0backend\public\assets" (
    echo Membuat tautan junction backend\public\assets...
    mklink /J "%~dp0backend\public\assets" "%~dp0assets"
) else (
    echo [OK] backend\public\assets sudah tertaut.
)

if not exist "%~dp0mobile\assets" (
    echo Membuat tautan junction mobile\assets...
    mklink /J "%~dp0mobile\assets" "%~dp0assets"
) else (
    echo [OK] mobile\assets sudah tertaut.
)

echo [SELESAI] Setup assets selesai dan siap digunakan!

