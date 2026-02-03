
# Agentic Data Library - Start Script

# 1. Clear Port 8000 (Backend)
$backendPort = Get-NetTCPConnection -LocalPort 8000 -ErrorAction SilentlyContinue
if ($backendPort) {
    Write-Host "Cleaning up existing Backend process (Port 8000)..." -ForegroundColor Yellow
    foreach ($conn in $backendPort) {
        try { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}

# 2. Clear Port 5173 (Frontend)
$frontendPort = Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
if ($frontendPort) {
    Write-Host "Cleaning up existing Frontend process (Port 5173)..." -ForegroundColor Yellow
    foreach ($conn in $frontendPort) {
        try { Stop-Process -Id $conn.OwningProcess -Force -ErrorAction SilentlyContinue } catch {}
    }
}

# 3. Start Backend in a new window
Write-Host "🚀 Launching Backend API..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Agentic Data Library Backend ---' -ForegroundColor Cyan; ./venv/Scripts/python -m uvicorn data_library.api:app --host 0.0.0.0 --port 8000 --reload"

# 4. Start Frontend in a new window
Write-Host "🎨 Launching Frontend (Agent Studio)..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Write-Host '--- Agentic Data Library Frontend ---' -ForegroundColor Green; cd frontend; npm run dev"

Write-Host "`nAll systems launching. check the new windows for logs." -ForegroundColor White
Write-Host "Backend: http://localhost:8000"
Write-Host "Frontend: http://localhost:5173"
