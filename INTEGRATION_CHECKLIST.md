# Backend Integration Checklist

## ✅ Frontend Setup (Complete)

- [x] API client created (`src/services/api.js`)
- [x] Auth service with login, register, logout, profile update
- [x] User service for user management
- [x] Event service for event CRUD
- [x] Company service for company management
- [x] Internship service for opportunity management
- [x] AuthContext updated to use API services
- [x] Environment variables configured
- [x] Token management implemented
- [x] Error handling in place
- [x] Loading states ready

## 🔲 Backend Requirements (To Do)

### 1. Authentication Endpoints

- [ ] `POST /api/auth/login` - Login endpoint
  - Accept: `{ email, password }`
  - Return: `{ token, user }`
  - Set JWT token

- [ ] `POST /api/auth/register` - Registration endpoint
  - Accept: `{ name, email, password, supnumId, role }`
  - Return: `{ user }`
  - Validate unique email and supnumId

- [ ] `GET /api/auth/me` - Get current user
  - Require: Bearer token
  - Return: `{ user }`

- [ ] `POST /api/auth/logout` - Logout endpoint
  - Invalidate token (optional)

- [ ] `PUT /api/auth/profile` - Update profile
  - Accept: All user profile fields
  - Return: Updated user

### 2. User Management Endpoints

- [ ] `GET /api/users` - List all users (admin)
  - Support filters: status, search
  - Pagination recommended

- [ ] `GET /api/users/:id` - Get single user

- [ ] `PATCH /api/users/:id/status` - Update user status (admin)
  - Accept: `{ status: "Verified|Pending|Suspended" }`

- [ ] `DELETE /api/users/:id` - Delete user (admin)

- [ ] `POST /api/users/graduates` - Add graduate (admin)

- [ ] `GET /api/users/export/csv` - Export to CSV (admin)

### 3. Event Endpoints

- [ ] `GET /api/events` - List all events
  - Support filters

- [ ] `GET /api/events/:id` - Get single event

- [ ] `POST /api/events` - Create event (admin)

- [ ] `PUT /api/events/:id` - Update event (admin)

- [ ] `DELETE /api/events/:id` - Delete event (admin)

### 4. Company Endpoints

- [ ] `GET /api/companies` - List companies
  - Support search

- [ ] `POST /api/companies` - Create company (admin)

- [ ] `PUT /api/companies/:id` - Update company (admin)

- [ ] `DELETE /api/companies/:id` - Delete company (admin)

### 5. Internship Endpoints

- [ ] `GET /api/internships` - List internships
  - Support filters

- [ ] `POST /api/internships` - Create internship (admin)

- [ ] `PUT /api/internships/:id` - Update internship (admin)

- [ ] `DELETE /api/internships/:id` - Delete internship (admin)

- [ ] `PATCH /api/internships/:id/toggle` - Toggle active status

### 6. Database Setup

- [ ] Design database schema
- [ ] Create tables/collections:
  - users
  - events
  - companies
  - internships
  - (optional) messages, notifications

- [ ] Set up relationships/references
- [ ] Create indexes for performance
- [ ] Implement migrations

### 7. Security

- [ ] Password hashing (bcrypt recommended)
- [ ] JWT token generation and validation
- [ ] Rate limiting
- [ ] Input validation and sanitization
- [ ] CORS configuration
- [ ] Environment variables for secrets
- [ ] HTTPS in production

### 8. Middleware

- [ ] Authentication middleware
- [ ] Authorization middleware (role-based)
- [ ] Error handling middleware
- [ ] Logging middleware
- [ ] Request validation

### 9. File Upload (Optional)

- [ ] Avatar upload endpoint
- [ ] Event image upload endpoint
- [ ] File storage configuration (S3, Cloudinary, etc.)

### 10. Testing

- [ ] Unit tests for services
- [ ] Integration tests for APIs
- [ ] Auth flow testing
- [ ] CRUD operation testing

### 11. Deployment

- [ ] Set up server (AWS, Heroku, DigitalOcean, etc.)
- [ ] Configure environment variables
- [ ] Set up database
- [ ] Configure domain and SSL
- [ ] Set up CI/CD pipeline (optional)

### 12. Documentation

- [ ] API documentation (Swagger/OpenAPI)
- [ ] Deployment guide
- [ ] Environment setup guide

## 📝 Quick Start Commands

```bash
# Frontend
cd supnum-connect
npm install
cp .env.example .env
# Update VITE_API_URL in .env
npm run dev

# Backend (your choice of framework)
# Example with Express.js
mkdir backend
cd backend
npm init -y
npm install express cors jsonwebtoken bcrypt dotenv
# Create your server...
```

## 🎯 Priority Order

1. ✅ **High**: Authentication (login, register)
2. ✅ **High**: Users management
3. **Medium**: Events CRUD
4. **Medium**: Companies & Internships
5. **Low**: Advanced features (messaging, notifications)

## 📞 Need Help?

Refer to:
- `BACKEND_INTEGRATION.md` for detailed API specs
- `MOCK_SERVER.md` for testing with json-server
- `README.md` for general setup

Good luck with your backend development! 🚀
