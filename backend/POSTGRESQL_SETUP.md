# ✅ PostgreSQL Backend Setup Guide

## 🚀 Quick Start - PostgreSQL Version

Your backend is now configured to use **PostgreSQL** instead of MongoDB!

### Option 1: Install PostgreSQL Locally (Windows)

#### Step 1: Download PostgreSQL
1. Go to: https://www.postgresql.org/download/windows/
2. Click "Download the installer"
3. Download the latest version (16.x recommended)
4. Run the installer

#### Step 2: Install PostgreSQL
1. Run the downloaded .exe file
2. Click "Next" through setup
3. **IMPORTANT - Remember these:**
   - Port: `5432` (default)
   - Password: Choose a password (e.g., `postgres123`)
4. Install all components
5. Complete installation

#### Step 3: Verify Installation
```powershell
# Open PowerShell and run:
psql --version

# Should show: psql (PostgreSQL) 16.x
```

#### Step 4: Create Database
```powershell
# Open SQL Shell (psql) from Start menu
# Press Enter for default values, then enter your password

# Create database:
CREATE DATABASE supnum_connect;

# Verify:
\l

# Exit:
\q
```

#### Step 5: Update backend\.env
```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supnum_connect
DB_USER=postgres
DB_PASSWORD=postgres123
```

---

### Option 2: Use Cloud PostgreSQL (Supabase - FREE & Easy) ⭐ RECOMMENDED

#### Step 1: Create Supabase Account
1. Go to: https://supabase.com
2. Sign up with GitHub or email
3. Click "New Project"
4. Fill in:
   - Project name: `supnum-connect`
   - Database password: Choose strong password
   - Region: Closest to you
5. Click "Create new project" (wait 2 minutes)

#### Step 2: Get Database URL
1. In your project, go to **Settings** → **Database**
2. Scroll to "Connection string"
3. Select "URI" tab
4. Copy the connection string (looks like this):
   ```
   postgres://postgres.[project-id]:[password]@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
   ```
5. Replace `[password]` with your actual password

#### Step 3: Update backend\.env
```env
# Use the Supabase connection string
DATABASE_URL=postgres://postgres.xxxxx:[password]@aws-0-xx.pooler.supabase.com:6543/postgres

# OR use individual fields:
DB_HOST=aws-0-xx.pooler.supabase.com
DB_PORT=6543
DB_NAME=postgres
DB_USER=postgres.xxxxx
DB_PASSWORD=your_password
```

---

## 📦 Install Dependencies

```bash
cd backend
npm install
```

This installs:
- `sequelize` - ORM for PostgreSQL
- `pg` & `pg-hstore` - PostgreSQL drivers
- All other dependencies

---

## 🌱 Seed Database (Create Test Data)

```bash
# Make sure PostgreSQL is running first!
node seed.js
```

Expected output:
```
✅ PostgreSQL Connected successfully
✅ Database synced
🗑️  Cleared existing data
✅ Created users
✅ Created companies
✅ Created events
✅ Created internships

🎉 Database seeded successfully!

📝 Test Accounts:
   Admin:    admin@supnum.mr / admin123
   Student:  student@supnum.mr / password123
   Graduate: graduate@supnum.mr / password123
```

---

## 🚀 Start Server

```bash
npm run dev
```

Server runs at: **http://localhost:3000**

---

## ✅ Test the API

```bash
# Test login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@supnum.mr\",\"password\":\"admin123\"}"

# Should return JWT token
```

---

## 🔄 Database Schema

PostgreSQL will automatically create these tables:

```
Tables:
├── Users (id, name, email, password, supnumId, role, status, ...)
├── Events (id, title, date, type, description, createdById, ...)
├── Companies (id, name, industry, location, website, ...)
├── Internships (id, title, company, type, location, createdById, ...)
└── Messages (id, conversationId, senderId, recipientId, content, ...)
```

---

## 🐛 Troubleshooting

### Error: "Connection refused"
```powershell
# Check if PostgreSQL is running:
Get-Service postgresql*

# Start PostgreSQL:
Start-Service postgresql-x64-16

# Or restart:
Restart-Service postgresql-x64-16
```

### Error: "password authentication failed"
- Check password in .env matches PostgreSQL password
- For Supabase, verify connection string is correct

### Error: "database does not exist"
```bash
# Open psql and create database:
CREATE DATABASE supnum_connect;
```

### View Logs
```powershell
# PostgreSQL logs location (Windows):
C:\Program Files\PostgreSQL\16\data\log\
```

---

## 📊 View Database (GUI Tools)

### Option 1: pgAdmin (Comes with PostgreSQL)
1. Open pgAdmin from Start menu
2. Add server:
   - Host: localhost
   - Port: 5432
   - Username: postgres
   - Password: your_password
3. View tables under: Databases → supnum_connect → Schemas → public → Tables

### Option 2: Supabase Dashboard
1. Go to your Supabase project
2. Click "Table Editor"
3. View all tables and data

---

## 🔗 Connect Frontend

Update frontend `.env`:
```env
VITE_API_URL=http://localhost:3000/api
```

Start frontend:
```bash
cd ..
npm run dev
```

---

## 📝 Environment Variables Reference

```env
# Server
PORT=3000
NODE_ENV=development

# PostgreSQL (Local)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=supnum_connect
DB_USER=postgres
DB_PASSWORD=your_password

# OR PostgreSQL (Cloud - Supabase/Railway)
DATABASE_URL=postgres://user:pass@host:port/database

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRE=7d

# Frontend
FRONTEND_URL=http://localhost:5173
```

---

## ✅ Advantages of PostgreSQL

✅ **Relational Database** - Better for structured data
✅ **ACID Compliance** - Data integrity guaranteed
✅ **Advanced Querying** - Complex joins and aggregations
✅ **JSON Support** - Can still store JSON data
✅ **Widely Used** - Industry standard
✅ **Free Hosting** - Supabase, Railway, etc.
✅ **Better Performance** - For relational data

---

## 🎉 You're All Set!

Backend now uses PostgreSQL and is ready to go!

**Test it:**
1. Start backend: `npm run dev`
2. Start frontend: `cd .. && npm run dev`
3. Login with: admin@supnum.mr / admin123

Everything should work perfectly! 🚀
