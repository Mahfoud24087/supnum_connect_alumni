# SupNum Connect - Quick Start Script
# Run this to set up everything automatically

Write-Host "🚀 SupNum Connect - Automated Setup" -ForegroundColor Cyan
Write-Host "====================================`n" -ForegroundColor Cyan

# Check if Node.js is installed
Write-Host "✓ Checking Node.js..." -ForegroundColor Yellow
if (!(Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "✗ Node.js not found! Please install from https://nodejs.org" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Node.js found: $(node --version)`n" -ForegroundColor Green

# Backend Setup
Write-Host "📦 Setting up backend..." -ForegroundColor Yellow
Set-Location backend

if (!(Test-Path ".env")) {
    Write-Host "Creating .env file..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "✓ .env created. Please update MongoDB URI and JWT secret!" -ForegroundColor Green
} else {
    Write-Host "✓ .env already exists" -ForegroundColor Green
}

Write-Host "`n📥 Installing backend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Backend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Backend dependencies installed`n" -ForegroundColor Green

# Frontend Setup
Write-Host "📦 Setting up frontend..." -ForegroundColor Yellow
Set-Location ..

Write-Host "📥 Installing frontend dependencies..." -ForegroundColor Yellow
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "✗ Frontend installation failed!" -ForegroundColor Red
    exit 1
}
Write-Host "✓ Frontend dependencies installed`n" -ForegroundColor Green

# Display next steps
Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "✅ Installation Complete!`n" -ForegroundColor Green

Write-Host "📝 NEXT STEPS:`n" -ForegroundColor Yellow

Write-Host "1. Set up MongoDB:" -ForegroundColor White
Write-Host "   Option A: Download from https://www.mongodb.com/try/download/community" -ForegroundColor Gray
Write-Host "   Option B: Use MongoDB Atlas (free cloud): https://www.mongodb.com/cloud/atlas`n" -ForegroundColor Gray

Write-Host "2. Update backend\.env file:" -ForegroundColor White
Write-Host "   • Set MONGODB_URI to your MongoDB connection string" -ForegroundColor Gray
Write-Host "   • Set JWT_SECRET to a random secret key`n" -ForegroundColor Gray

Write-Host "3. Seed the database (from backend folder):" -ForegroundColor White
Write-Host "   cd backend" -ForegroundColor Cyan
Write-Host "   node seed.js`n" -ForegroundColor Cyan

Write-Host "4. Start the backend server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "   (Keep this terminal open)`n" -ForegroundColor Gray

Write-Host "5. Start the frontend (in a NEW terminal):" -ForegroundColor White
Write-Host "   npm run dev`n" -ForegroundColor Cyan

Write-Host "6. Open your browser:" -ForegroundColor White
Write-Host "   http://localhost:5173`n" -ForegroundColor Cyan

Write-Host "7. Login with:" -ForegroundColor White
Write-Host "   Email: admin@supnum.mr" -ForegroundColor Cyan
Write-Host "   Password: admin123`n" -ForegroundColor Cyan

Write-Host "====================================`n" -ForegroundColor Cyan
Write-Host "📚 Documentation:" -ForegroundColor Yellow
Write-Host "   • FULL_STACK_GUIDE.md - Complete guide" -ForegroundColor Gray
Write-Host "   • backend/SETUP.md - Backend setup details" -ForegroundColor Gray
Write-Host "   • backend/README.md - API documentation`n" -ForegroundColor Gray

Write-Host "Happy Coding! 🎉" -ForegroundColor Green
