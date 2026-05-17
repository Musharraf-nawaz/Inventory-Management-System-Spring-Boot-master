# Inventory Management API - Windows startup helper
$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot
Set-Location $ProjectRoot

Write-Host "=== Inventory Management API ===" -ForegroundColor Cyan

# --- Option 1: Docker (recommended if Java is not installed) ---
$dockerOk = $false
try {
    docker info 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { $dockerOk = $true }
} catch { }

if ($dockerOk) {
    Write-Host "Starting with Docker Compose (MySQL + API)..." -ForegroundColor Green
    docker compose up --build -d
    if ($LASTEXITCODE -ne 0) { throw "docker compose failed" }
    Write-Host ""
    Write-Host "Waiting for API (up to 90s)..." -ForegroundColor Yellow
    $ready = $false
    for ($i = 0; $i -lt 30; $i++) {
        Start-Sleep -Seconds 3
        try {
            $r = Invoke-WebRequest -Uri "http://localhost:8080/api/v1/actuator/health" -UseBasicParsing -TimeoutSec 5
            if ($r.StatusCode -eq 200) { $ready = $true; break }
        } catch { }
    }
    Write-Host ""
    if ($ready) {
        Write-Host "API is running!" -ForegroundColor Green
    } else {
        Write-Host "Containers started but API not ready yet. Check logs:" -ForegroundColor Yellow
        Write-Host "  docker compose logs -f api" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "  Swagger UI:  http://localhost:8080/api/v1/swagger-ui/index.html"
    Write-Host "  Login:       POST http://localhost:8080/api/v1/auth/login"
    Write-Host "               { `"username`": `"admin`", `"password`": `"admin123`" }"
    Write-Host ""
    Write-Host "  Stop:        docker compose down"
    exit 0
}

# --- Option 2: Local Java + Maven ---
Write-Host "Docker daemon is not running." -ForegroundColor Yellow
Write-Host "Using standalone mode (embedded H2 database, no MySQL needed)." -ForegroundColor Green
Write-Host ""

$jdk = Get-ChildItem "C:\Program Files\Microsoft\jdk-*" -ErrorAction SilentlyContinue | Sort-Object Name -Descending | Select-Object -First 1
if ($jdk) {
    $env:JAVA_HOME = $jdk.FullName
    $env:Path = "$env:JAVA_HOME\bin;" + $env:Path
}

$javaCmd = Get-Command java -ErrorAction SilentlyContinue
if (-not $javaCmd) {
    Write-Host "Java is not installed. Choose one:" -ForegroundColor Red
    Write-Host ""
    Write-Host "  A) Start Docker Desktop, then run this script again:" -ForegroundColor White
    Write-Host "       .\start.ps1"
    Write-Host ""
    Write-Host "  B) Install JDK 17, then run:" -ForegroundColor White
    Write-Host "       winget install Microsoft.OpenJDK.17"
    Write-Host "       Close and reopen PowerShell, then: .\start.ps1"
    Write-Host ""
    Write-Host "  C) Install MySQL 8 locally + JDK 17, set DB_PASSWORD in .env, then:"
    Write-Host "       .\mvnw.cmd spring-boot:run"
    exit 1
}

Write-Host "Starting with Maven (standalone / H2 — no MySQL required)..." -ForegroundColor Green
$env:SPRING_PROFILES_ACTIVE = "standalone"
if (-not (Test-Path ".env")) { Copy-Item ".env.example" ".env" }
& "$ProjectRoot\mvnw.cmd" spring-boot:run
