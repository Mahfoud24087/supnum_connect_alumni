# Backend API Mock Server (Optional for Testing)

## Using JSON Server for Quick Testing

If you want to test the frontend before the real backend is ready, you can use `json-server`:

### 1. Install json-server

```bash
npm install -g json-server
```

### 2. Create mock database

Create `db.json` in the project root:

```json
{
  "users": [
    {
      "id": "1",
      "name": "Admin User",
      "email": "admin@supnum.mr",
      "password": "admin123",
      "supnumId": "ADMIN001",
      "role": "admin",
      "status": "Verified",
      "avatar": null,
      "bio": "System Administrator",
      "social": {
        "linkedin": "",
        "github": "",
        "facebook": ""
      }
    },
    {
      "id": "2",
      "name": "John Doe",
      "email": "john@supnum.mr",
      "password": "password123",
      "supnumId": "2Y001",
      "role": "graduate",
      "status": "Verified",
      "avatar": null,
      "bio": "Software Engineer",
      "phone": "+222 12345678",
      "birthday": "1995-05-15",
      "workStatus": "employed",
      "jobTitle": "Senior Developer",
      "company": "Tech Corp",
      "social": {
        "linkedin": "https://linkedin.com/in/johndoe",
        "github": "https://github.com/johndoe",
        "facebook": ""
      }
    }
  ],
  "events": [
    {
      "id": "1",
      "title": "Tech Meetup 2024",
      "date": "2024-12-31",
      "type": "Event",
      "description": "Annual technology meetup for SupNum graduates",
      "image": "",
      "duration": "7",
      "stage": "All",
      "color": "bg-blue-600",
      "createdAt": "2024-12-01T00:00:00Z"
    }
  ],
  "companies": [
    {
      "id": "1",
      "name": "Tech Solutions Ltd",
      "industry": "Technology",
      "location": "Nouakchott",
      "website": "techsolutions.mr",
      "logo": null,
      "createdAt": "2024-12-01T00:00:00Z"
    }
  ],
  "internships": [
    {
      "id": "1",
      "title": "Software Engineer Intern",
      "company": "Tech Corp",
      "type": "Internship",
      "location": "Nouakchott",
      "description": "6-month internship opportunity",
      "active": true,
      "createdAt": "2024-12-01T00:00:00Z"
    }
  ]
}
```

### 3. Run the mock server

```bash
json-server --watch db.json --port 3000 --routes routes.json
```

### 4. Create routes.json for custom routes

```json
{
  "/api/*": "/$1",
  "/api/auth/login": "/users?email=:email",
  "/api/auth/register": "/users",
  "/api/auth/me": "/users/:id",
  "/api/auth/profile": "/users/:id"
}
```

### 5. Update .env

```bash
VITE_API_URL=http://localhost:3000/api
```

Now you can test all CRUD operations with a mock backend!

## Note

This is just for testing. In production, you'll need a proper backend with:
- Authentication with JWT
- Password hashing
- Data validation
- Authorization checks
- Database integration
- File upload handling
- Error handling
- Rate limiting
- Security measures
