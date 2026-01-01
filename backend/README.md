# SupNum Connect Backend

Complete REST API for SupNum Connect Alumni Platform

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Setup Environment

Create `.env` file (copy from `.env.example`):

```bash
cp .env.example .env
```

Update the variables:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/supnum-connect
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
FRONTEND_URL=http://localhost:5173
```

### 3. Install & Start MongoDB

**Windows:**
```bash
# Download from https://www.mongodb.com/try/download/community
# Or use MongoDB Atlas (cloud)
```

**Start MongoDB locally:**
```bash
mongod
```

**Or use MongoDB Atlas:**
- Create account at mongodb.com/atlas
- Create cluster
- Get connection string
- Update MONGODB_URI in .env

### 4. Run the Server

```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

Server will start on `http://localhost:3000`

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@supnum.mr",
  "password": "password123",
  "supnumId": "2Y001",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@supnum.mr",
  "password": "password123"
}

Response:
{
  "token": "jwt-token-here",
  "user": { ... }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

#### Update Profile
```http
PUT /api/auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Software Engineer",
  "phone": "+222 12345678",
  "workStatus": "employed"
}
```

### User Management (Admin Only)

#### Get All Users
```http
GET /api/users?status=Verified&search=john
Authorization: Bearer <admin-token>
```

#### Update User Status
```http
PATCH /api/users/:id/status
Authorization: Bearer <admin-token>

{
  "status": "Verified"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer <admin-token>
```

### Events

#### Get All Events
```http
GET /api/events
```

#### Create Event (Admin)
```http
POST /api/events
Authorization: Bearer <admin-token>

{
  "title": "Tech Meetup 2024",
  "date": "2024-12-31",
  "type": "Event",
  "description": "Annual tech meetup"
}
```

### Companies

#### Get All Companies
```http
GET /api/companies?search=tech
```

#### Create Company (Admin)
```http
POST /api/companies
Authorization: Bearer <admin-token>

{
  "name": "Tech Corp",
  "industry": "Technology",
  "location": "Nouakchott",
  "website": "techcorp.mr"
}
```

### Internships

#### Get All Internships
```http
GET /api/internships?type=Internship&active=true
```

#### Create Internship (Admin)
```http
POST /api/internships
Authorization: Bearer <admin-token>

{
  "title": "Software Engineer Intern",
  "company": "Tech Corp",
  "type": "Internship",
  "location": "Nouakchott",
  "active": true
}
```

### Messages

#### Get Conversations
```http
GET /api/messages/conversations
Authorization: Bearer <token>
```

#### Get Messages
```http
GET /api/messages/:conversationId
Authorization: Bearer <token>
```

#### Send Message
```http
POST /api/messages
Authorization: Bearer <token>

{
  "recipientId": "user-id-here",
  "content": "Hello!"
}
```

## 🗄️ Database Models

### User
- name, email, password (hashed)
- supnumId (unique)
- role (student, graduate, admin)
- status (Pending, Verified, Suspended)
- Profile fields (avatar, bio, phone, etc.)
- Social links

### Event
- title, date, type, description
- image, duration, stage
- createdBy (reference to User)

### Company
- name, industry, location
- website, logo, description

### Internship
- title, company, type, location
- description, active status
- createdBy (reference to User)

### Message
- conversationId, sender, recipient
- content, read status, timestamps

## 🔐 Security Features

✅ Password hashing with bcrypt
✅ JWT authentication
✅ Role-based access control
✅ Rate limiting
✅ Helmet security headers
✅ CORS configuration
✅ Input validation
✅ Error handling

## 📁 Project Structure

```
backend/
├── config/
│   └── database.js       # MongoDB connection
├── models/
│   ├── User.js
│   ├── Event.js
│   ├── Company.js
│   ├── Internship.js
│   └── Message.js
├── routes/
│   ├── auth.js
│   ├── users.js
│   ├── events.js
│   ├── companies.js
│   ├── internships.js
│   └── messages.js
├── middleware/
│   ├── auth.js           # JWT authentication
│   └── errorHandler.js   # Error handling
├── .env.example
├── .gitignore
├── package.json
└── server.js             # Main application
```

## 🧪 Testing

### Using cURL

```bash
# Register
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@supnum.mr","password":"password123","supnumId":"TEST001","role":"student"}'

# Login
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@supnum.mr","password":"password123"}'
```

### Using Postman/Insomnia

1. Import the collection
2. Set base URL: `http://localhost:3000/api`
3. Add Bearer token to protected routes

## 🔄 Create Admin User

After starting the server, create an admin user:

```bash
# Using MongoDB shell
mongosh supnum-connect

db.users.insertOne({
  name: "Admin User",
  email: "admin@supnum.mr",
  password: "$2a$10$...", // Hash of "admin123"
  supnumId: "ADMIN001",
  role: "admin",
  status: "Verified",
  createdAt: new Date(),
  updatedAt: new Date()
})
```

Or register via API and manually update role in database.

## 🚀 Deployment

### Deploy to Heroku

```bash
# Install Heroku CLI
heroku login
heroku create supnum-connect-api

# Set environment variables
heroku config:set MONGODB_URI="your-mongo-uri"
heroku config:set JWT_SECRET="your-secret"
heroku config:set FRONTEND_URL="your-frontend-url"

# Deploy
git push heroku main
```

### Deploy to DigitalOcean/AWS

1. Set up Node.js server
2. Install MongoDB or use Atlas
3. Configure environment variables
4. Set up PM2 for process management
5. Configure nginx as reverse proxy
6. Set up SSL with Let's Encrypt

## 📊 MongoDB Atlas Setup (Cloud Database)

1. Go to mongodb.com/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string
6. Update MONGODB_URI in .env

##Scripts

```bash
npm start      # Start production server
npm run dev    # Start with nodemon (auto-reload)
```

## 🆘 Troubleshooting

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- For Atlas, verify network access

**Port Already in Use:**
```bash
# Change PORT in .env
PORT=3001
```

**CORS Error:**
- Update FRONTEND_URL in .env
- Verify frontend URL matches

## 📞 Support

For issues, check the logs:
```bash
# Server logs show errors
npm run dev
```

---

**Backend is ready! Now connect your frontend by updating `.env` in frontend:**

```env
VITE_API_URL=http://localhost:3000/api
```
