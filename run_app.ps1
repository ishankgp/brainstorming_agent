# Agentic Data Library - Start Script

# 0. Kill ALL Python processes to ensure clean start
Write-Host "Cleaning up all Python processes..." -ForegroundColor Yellow
Get-Process python -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# 1. Clear Port 8000 (Backend)
$backendPort = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "Cleaning up existing Backend process (Port 8000)..." -ForegroundColor Yellow
    foreach ($conn in $backendPort) {
        try { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}

# 2. Clear Port 3000 (Next.js Frontend)
$frontendPort = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "Cleaning up existing Frontend process (Port 3000)..." -ForegroundColor Yellow
    foreach ($conn in $frontendPort) {
        try { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}

# 3. Start Backend in a new window
Write-Host "🚀 Launching Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Challenge Generator Backend ---' -ForegroundColor Cyan; cd backend; ./venv/Scripts/python -m uvicorn data_library.api:app --host 0.0.0.0 --port 8000"

# 4. Start Frontend in a new window
Write-Host "🎨 Launching Frontend (Next.js)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Challenge Generator Frontend ---' -ForegroundColor Green; cd frontend; npm run dev"

Write-Host "`nAll systems launching. Check the new windows for logs." -ForegroundColor White
Write-Host "Backend: http://localhost:8000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:3000" -ForegroundColor Green
