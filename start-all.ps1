# Start backend + frontend (run in two windows, or use this script)
$ProjectRoot = $PSScriptRoot
$jdk = Get-ChildItem "C:\Program Files\Microsoft\jdk-*" -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
if ($jdk) {
    $env:JAVA_HOME = $jdk.FullName
    $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
}

Write-Host "Starting Inventory Management System..." -ForegroundColor Cyan
Write-Host ""
Write-Host "1) Backend API  -> http://localhost:8080/api/v1" -ForegroundColor Green
Write-Host "2) Frontend UI -> http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Login: admin / admin123" -ForegroundColor Yellow
Write-Host ""

$backend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot'; `$env:SPRING_PROFILES_ACTIVE='standalone'; .\mvnw.cmd spring-boot:run" -PassThru
Start-Sleep -Seconds 3
$frontend = Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$ProjectRoot\frontend'; npm run dev" -PassThru

Write-Host "Backend PID: $($backend.Id)  |  Frontend PID: $($frontend.Id)" -ForegroundColor Gray
Write-Host "Close those windows to stop the servers." -ForegroundColor Gray
