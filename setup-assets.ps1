# Setup script to link centralized assets folder to backend and mobile on Windows PowerShell
Write-Host "[SRB Motor] Menyiapkan tautan direktori assets..." -ForegroundColor Cyan

$root = $PSScriptRoot
$assetsPath = Join-Path $root "assets"
$backendAssets = Join-Path $root "backend\public\assets"
$mobileAssets = Join-Path $root "mobile\assets"

if (-not (Test-Path $assetsPath)) {
    Write-Error "Direktori assets tidak ditemukan di $assetsPath!"
    exit 1
}

if (-not (Test-Path $backendAssets)) {
    Write-Host "Membuat tautan junction backend\public\assets..." -ForegroundColor Yellow
    cmd /c "mklink /J `"$backendAssets`" `"$assetsPath`""
} else {
    Write-Host "[OK] backend\public\assets sudah tertaut." -ForegroundColor Green
}

if (-not (Test-Path $mobileAssets)) {
    Write-Host "Membuat tautan junction mobile\assets..." -ForegroundColor Yellow
    cmd /c "mklink /J `"$mobileAssets`" `"$assetsPath`""
} else {
    Write-Host "[OK] mobile\assets sudah tertaut." -ForegroundColor Green
}

Write-Host "[SELESAI] Setup assets selesai dan siap digunakan!" -ForegroundColor Green

