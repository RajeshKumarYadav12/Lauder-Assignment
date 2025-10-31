# Quick Start Script for Louder Events
# This script helps you set up and run the project quickly

Write-Host "🎉 Louder Events - Quick Start Script" -ForegroundColor Cyan
Write-Host "=====================================" -ForegroundColor Cyan
Write-Host ""

# Function to check if a command exists
function Test-Command($command) {
    try {
        if (Get-Command $command -ErrorAction Stop) {
            return $true
        }
    } catch {
        return $false
    }
}

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
Write-Host ""

$hasNode = Test-Command "node"
$hasNpm = Test-Command "npm"

if (-not $hasNode) {
    Write-Host "❌ Node.js is not installed!" -ForegroundColor Red
    Write-Host "Please install Node.js from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

if (-not $hasNpm) {
    Write-Host "❌ npm is not installed!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Node.js version: $(node --version)" -ForegroundColor Green
Write-Host "✅ npm version: $(npm --version)" -ForegroundColor Green
Write-Host ""

# Ask user what to do
Write-Host "What would you like to do?" -ForegroundColor Cyan
Write-Host "1. Install all dependencies (backend + frontend)" -ForegroundColor White
Write-Host "2. Run backend only" -ForegroundColor White
Write-Host "3. Run frontend only" -ForegroundColor White
Write-Host "4. Run both (backend + frontend)" -ForegroundColor White
Write-Host "5. Exit" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Enter your choice (1-5)"

switch ($choice) {
    "1" {
        Write-Host ""
        Write-Host "📦 Installing backend dependencies..." -ForegroundColor Yellow
        Set-Location backend
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Backend dependencies installed!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install backend dependencies" -ForegroundColor Red
            exit 1
        }
        Set-Location ..

        Write-Host ""
        Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
        Set-Location frontend
        npm install
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green
        } else {
            Write-Host "❌ Failed to install frontend dependencies" -ForegroundColor Red
            exit 1
        }
        Set-Location ..

        Write-Host ""
        Write-Host "🎉 All dependencies installed successfully!" -ForegroundColor Green
        Write-Host ""
        Write-Host "⚠️  IMPORTANT: Configure your environment variables:" -ForegroundColor Yellow
        Write-Host "1. Copy backend\.env.example to backend\.env" -ForegroundColor White
        Write-Host "2. Add your MongoDB connection string" -ForegroundColor White
        Write-Host "3. Copy frontend\.env.example to frontend\.env (optional)" -ForegroundColor White
        Write-Host ""
        Write-Host "Then run this script again and choose option 4 to start the app!" -ForegroundColor Cyan
    }
    "2" {
        Write-Host ""
        Write-Host "🚀 Starting backend server..." -ForegroundColor Yellow
        Set-Location backend
        
        if (-not (Test-Path ".env")) {
            Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
            Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
            Write-Host "❗ Please update backend\.env with your MongoDB URI" -ForegroundColor Red
            Write-Host "Press any key to continue or Ctrl+C to exit..."
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
        
        npm run dev
    }
    "3" {
        Write-Host ""
        Write-Host "🚀 Starting frontend server..." -ForegroundColor Yellow
        Set-Location frontend
        
        if (-not (Test-Path ".env")) {
            Write-Host "⚠️  Warning: .env file not found!" -ForegroundColor Yellow
            Write-Host "Creating .env from .env.example..." -ForegroundColor Yellow
            Copy-Item ".env.example" ".env"
        }
        
        npm run dev
    }
    "4" {
        Write-Host ""
        Write-Host "🚀 Starting both backend and frontend..." -ForegroundColor Yellow
        Write-Host "Backend will run on: http://localhost:5000" -ForegroundColor Cyan
        Write-Host "Frontend will run on: http://localhost:5173" -ForegroundColor Cyan
        Write-Host ""
        Write-Host "⚠️  Make sure your .env files are configured!" -ForegroundColor Yellow
        Write-Host "Press Ctrl+C to stop both servers" -ForegroundColor Yellow
        Write-Host ""
        
        # Start backend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\backend'; npm run dev"
        
        # Wait a bit for backend to start
        Start-Sleep -Seconds 3
        
        # Start frontend in new window
        Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD\frontend'; npm run dev"
        
        Write-Host "✅ Both servers started in separate windows!" -ForegroundColor Green
        Write-Host "Check the new PowerShell windows for server output" -ForegroundColor Cyan
    }
    "5" {
        Write-Host "👋 Goodbye!" -ForegroundColor Cyan
        exit 0
    }
    default {
        Write-Host "❌ Invalid choice!" -ForegroundColor Red
        exit 1
    }
}
