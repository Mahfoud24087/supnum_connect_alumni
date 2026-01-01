# SupNum Connect - Backend Integration Guide

## 🚀 Quick Start

### 1. Environment Setup

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:3000/api
```

For production, update to your actual backend URL:
```bash
VITE_API_URL=https://api.supnumconnect.com/api
```

### 2. Backend API Requirements

Your backend should implement the following REST API endpoints:

#### Authentication (`/api/auth`)
- `POST /auth/login` - User login
  - Body: `{ "email": "string", "password": "string" }`
  - Response: `{ "token": "string", "user": {...} }`

- `POST /auth/register` - User registration
  - Body: `{ "name": "string", "email": "string", "password": "string", "supnumId": "string", "role": "student|graduate" }`
  - Response: `{ "user": {...} }`

- `GET /auth/me` - Get current user
  - Headers: `Authorization: Bearer <token>`
  - Response: `{ "user": {...} }`

- `POST /auth/logout` - User logout
  - Headers: `Authorization: Bearer <token>`

- `PUT /auth/profile` - Update user profile
  - Headers: `Authorization: Bearer <token>`
  - Body: `{ ...profileData }`
  - Response: `{ "user": {...} }`

#### Users (`/api/users`)
- `GET /users` - Get all users (admin only)
  - Query params: `status`, `search`
  - Response: `{ "users": [...] }`

- `GET /users/:id` - Get user by ID
  - Response: `{ "user": {...} }`

- `PATCH /users/:id/status` - Update user status (admin)
  - Body: `{ "status": "Verified|Pending|Suspended" }`

- `DELETE /users/:id` - Delete user (admin)

- `POST /users/graduates` - Add new graduate (admin)
  - Body: `{ ...userData }`

- `GET /users/export/csv` - Export users to CSV (admin)

#### Events (`/api/events`)
- `GET /events` - Get all events
  - Response: `{ "events": [...] }`

- `GET /events/:id` - Get event by ID

- `POST /events` - Create event (admin)
  - Body: `{ "title", "date", "type", "description", "image", "duration", "stage" }`

- `PUT /events/:id` - Update event (admin)

- `DELETE /events/:id` - Delete event (admin)

#### Companies (`/api/companies`)
- `GET /companies` - Get all companies
  - Query params: `search`

- `POST /companies` - Create company (admin)
  - Body: `{ "name", "industry", "location", "website" }`

- `PUT /companies/:id` - Update company (admin)

- `DELETE /companies/:id` - Delete company (admin)

#### Internships (`/api/internships`)
- `GET /internships` - Get all internships
  - Query params: `type`, `search`

- `POST /internships` - Create internship (admin)
  - Body: `{ "title", "company", "type", "location", "active" }`

- `PUT /internships/:id` - Update internship (admin)

- `DELETE /internships/:id` - Delete internship (admin)

- `PATCH /internships/:id/toggle` - Toggle active status (admin)

### 3. Expected Data Models

#### User Model
```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "supnumId": "string",
  "role": "student|graduate|admin",
  "avatar": "string (URL or base64)",
  "bio": "string",
  "location": "string",
  "phone": "string",
  "birthday": "date",
  "workStatus": "employed|seeking|studying|freelance",
  "jobTitle": "string",
  "company": "string",
  "social": {
    "linkedin": "string",
    "github": "string",
    "facebook": "string"
  },
  "status": "Verified|Pending|Suspended",
  "createdAt": "date",
  "updatedAt": "date"
}
```

#### Event Model
```json
{
  "id": "string",
  "title": "string",
  "date": "date",
  "type": "Event|Challenge|Contest",
  "description": "string",
  "image": "string (URL)",
  "duration": "number (days)",
  "stage": "string",
  "color": "string (CSS class)",
  "createdAt": "date"
}
```

#### Company Model
```json
{
  "id": "string",
  "name": "string",
  "industry": "string",
  "location": "string",
  "website": "string",
  "logo": "string (URL)",
  "createdAt": "date"
}
```

#### Internship Model
```json
{
  "id": "string",
  "title": "string",
  "company": "string",
  "type": "Internship|Full-time|Part-time|Contract",
  "location": "string",
  "description": "string (optional)",
  "active": "boolean",
  "createdAt": "date"
}
```

### 4. Authentication Flow

1. User logs in → Backend returns JWT token
2. Token stored in `localStorage` as `auth_token`
3. All subsequent requests include `Authorization: Bearer <token>` header
4. If token expires → User redirected to login

### 5. Error Handling

All API errors should return:
```json
{
  "message": "Error description",
  "statusCode": 400
}
```

### 6. CORS Configuration

Your backend must allow requests from the frontend origin:
```javascript
// Example for Express.js
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
```

### 7. File Upload (for images)

For avatar and event images, you can either:
- Accept base64 strings (current implementation)
- Or implement multipart/form-data upload and return image URLs

### 8. Testing

Test with mock backend first:
1. Use json-server or similar
2. Or use backend stubs for development

### 9. Migration from localStorage

The frontend is already prepared for backend integration. When you connect the backend:
- Remove localStorage usage
- All data will come from API
- Token-based authentication is ready

### 10. Next Steps

1. ✅ Set up your backend with the required endpoints
2. ✅ Update `.env` with your backend URL
3. ✅ Test authentication flow
4. ✅ Test CRUD operations for each resource
5. ✅ Deploy both frontend and backend

## 📝 Notes

- All services are in `src/services/`
- API client is in `src/services/api.js`
- Token management is automatic
- Error handling is built-in

For questions or issues, check the service files for implementation details.
