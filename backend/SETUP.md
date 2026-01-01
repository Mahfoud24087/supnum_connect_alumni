# ✅ SupNum Connect Backend - Setup Complete!

## 📦 Backend Structure Created

```
backend/
├── config/
│   └── database.js              # MongoDB connection
├── models/
│   ├── User.js                  # User model with auth
│   ├── Event.js                 # Events model
│   ├── Company.js               # Companies model
│   ├── Internship.js            # Internships model
│   └── Message.js               # Messaging model
├── middleware/
│   ├── auth.js                  # JWT authentication
│   └── error Handler.js          # Error handling
├── routes/
│   ├── auth.js                  # Login, register, profile
│   ├── users.js                 # User management (admin)
│   ├── events.js                # Event CRUD
│   ├── companies.js             # Company CRUD
│   ├── internships.js           # Internship CRUD
│   └── messages.js              # Messaging system
├── .env.example                 # Environment template
├── .gitignore
├── package.json
├── seed.js                      # Database seeder
├── server.js                    # Main server
└── README.md                    # Documentation
```

## 🚀 SETUP COMMANDS (Run these in order)

### Step 1: Navigate to backend folder
```bash
cd backend
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set up environment variables
```bash
# Copy the example file
copy .env.example .env

# Edit .env and update these values:
# - MongoDB URL (local or Atlas)
# - JWT secret
# - Frontend URL
```

### Step 4: Install & Start MongoDB

#### Option A: Local MongoDB (Windows)

**Download & Install:**
1. Go to https://www.mongodb.com/try/download/community
2. Download MongoDB Community Server
3. Install with default settings
4. MongoDB will run as a Windows service automatically

**Or use command:**
```bash
# MongoDB should start automatically as a service
# To check status:
sc query MongoDB

# To start manually if needed:
net start MongoDB
```

#### Option B: MongoDB Atlas (Cloud - Recommended)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up / Log in
3. Create a FREE cluster
4. Click "Connect" → "Connect your application"
5. Copy the connection string
6. Update `.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/supnum-connect
   ```

### Step 5: Seed the database (create test data)
```bash
node seed.js
```

This will create:
- ✅ Admin account: `admin@supnum.mr` / `admin123`
- ✅ Student account: `student@supnum.mr` / `password123`
- ✅ Graduate account: `graduate@supnum.mr` / `password123`
- ✅ Sample companies
- ✅ Sample events
- ✅ Sample internships

### Step 6: Start the server
```bash
# Development mode (auto-reload)
npm run dev

# OR Production mode
npm start
```

Server will start at: **http://localhost:3000**

## ✅ Verify Installation

Test the API:
```bash
# Check health
curl http://localhost:3000/api/health

# Should return:
# {"status":"OK","message":"SupNum Connect API is running"}
```

Test login:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@supnum.mr\",\"password\":\"admin123\"}"

# Should return a JWT token
```

## 🔗 Connect Frontend

Now update your frontend `.env`:

bash
cd ..
# Edit .env in root directory
```

Update this line:
```env
VITE_API_URL=http://localhost:3000/api
```

Then start frontend:
```bash
npm run dev
```

## 📝 Quick Reference

### Environment Variables (.env)
```env
PORT=3000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/supnum-connect
JWT_SECRET=change-this-secret-key
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### Test Accounts
```
Admin:    admin@supnum.mr / admin123
Student:  student@supnum.mr / password123
Graduate: graduate@supnum.mr / password123
```

### npm Scripts
```bash
npm start       # Start production server
npm run dev     # Start with auto-reload (development)
node seed.js    # Populate database with test data
```

### API Endpoints
```
Auth:         POST /api/auth/register
              POST /api/auth/login
              GET  /api/auth/me
              PUT  /api/auth/profile

Users:        GET  /api/users (admin)
              PATCH /api/users/:id/status (admin)
              DELETE /api/users/:id (admin)

Events:       GET  /api/events
              POST /api/events (admin)
              PUT  /api/events/:id (admin)
              DELETE /api/events/:id (admin)

Companies:    GET  /api/companies
              POST /api/companies (admin)
              PUT  /api/companies/:id (admin)
              DELETE /api/companies/:id (admin)

Internships:  GET  /api/internships
              POST /api/internships (admin)
              PUT  /api/internships/:id (admin)
              DELETE /api/internships/:id (admin)
              PATCH /api/internships/:id/toggle (admin)

Messages:     GET  /api/messages/conversations
              GET  /api/messages/:conversationId
              POST /api/messages
              DELETE /api/messages/:id
```

## 🐛 Troubleshooting

**MongoDB connection error:**
- Verify MongoDB is running: `sc query MongoDB`
- Check MONGODB_URI in .env
- For Atlas: verify network access settings

**Port already in use:**
```bash
# Change port in .env
PORT=3001
```

**Dependencies error:**
```bash
# Delete node_modules and reinstall
rmdir /s node_modules
npm install
```

## 🎉 You're All Set!

Backend is now running and connected to your frontend!

Try logging in to the frontend with:
- **Email:** admin@supnum.mr
- **Password:** admin123

Everything should work seamlessly now! 🚀
