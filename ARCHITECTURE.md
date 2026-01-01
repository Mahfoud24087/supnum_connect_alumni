# SupNum Connect - Architecture Overview

## 📊 System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         FRONTEND (React)                         │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                         Pages                               │ │
│  │  • Landing Page    • Dashboard    • Profile                │ │
│  │  • Sign In/Up      • Admin Panel  • Events                 │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                       Context API                           │ │
│  │              • AuthContext (JWT Management)                 │ │
│  │              • LanguageContext                              │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Service Layer                            │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌───────────────────┐  │ │
│  │  │ authService  │ │ userService  │ │  eventService     │  │ │
│  │  └──────────────┘ └──────────────┘ └───────────────────┘  │ │
│  │  ┌──────────────┐ ┌──────────────┐                        │ │
│  │  │companyService│ │internshipSvc │                        │ │
│  │  └──────────────┘ └──────────────┘                        │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Client                               │ │
│  │         • Request/Response handling                         │ │
│  │         • Token injection                                   │ │
│  │         • Error handling                                    │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      BACKEND API (Your Task)                     │
│                                                                  │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    API Endpoints                            │ │
│  │  POST /api/auth/login       GET  /api/users                │ │
│  │  POST /api/auth/register    GET  /api/events               │ │
│  │  GET  /api/auth/me          POST /api/companies            │ │
│  │  PUT  /api/auth/profile     POST /api/internships          │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Middleware                             │ │
│  │  • Authentication (JWT verify)                              │ │
│  │  • Authorization (Role-based)                               │ │
│  │  • Validation                                               │ │
│  │  • Error handling                                           │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                    Business Logic                           │ │
│  │  • User management                                          │ │
│  │  • Event management                                         │ │
│  │  • Authentication logic                                     │ │
│  └────────────────────────────────────────────────────────────┘ │
│                              │                                   │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │                      Database                               │ │
│  │  • Users collection/table                                   │ │
│  │  • Events collection/table                                  │ │
│  │  • Companies collection/table                               │ │
│  │  • Internships collection/table                             │ │
│  └────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 Authentication Flow

```
User Action                Frontend                    Backend
────────────────────────────────────────────────────────────────
    │
    │ 1. Enter credentials
    ├──────────────►
    │                  2. authService.login()
    │                          │
    │                          │ POST /api/auth/login
    │                          ├──────────────────────►
    │                          │                        3. Verify
    │                          │                        credentials
    │                          │                            │
    │                          │    4. Return JWT token    │
    │                          ◄──────────────────────────┘
    │                          │
    │                  5. Store token in
    │                     localStorage
    │                          │
    │                  6. Update AuthContext
    │                          │
    │   7. Redirect to         │
    ◄─────dashboard            │
    │
```

## 🗂️ Data Flow Example (Creating an Event)

```
Admin Interface → ManageEvents component
       │
       │ 1. User fills form
       │
       ▼
  handleSubmit()
       │
       │ 2. Call service
       │
       ▼
  eventService.createEvent(data)
       │
       │ 3. API request with token
       │
       ▼
  POST /api/events
  Headers: { Authorization: Bearer <token> }
  Body: { title, date, type, ... }
       │
       │ 4. Backend validates token
       │ 5. Backend validates data
       │ 6. Backend saves to database
       │ 7. Backend returns created event
       │
       ▼
  Response: { success: true, event: {...} }
       │
       │ 8. Update local state
       │
       ▼
  Display success message
```

## 📁 Service Layer Pattern

Each service follows the same pattern:

```javascript
// Example: userService.js
import { apiClient } from './api';

export const userService = {
    // Get all users
    async getAllUsers(filters = {}) {
        try {
            const response = await apiClient.get('/users', filters);
            return response.users;
        } catch (error) {
            console.error('Failed:', error);
            return [];
        }
    },

    // Other methods...
};
```

## 🔐 Token Management

```
Login Success
     │
     ▼
Store token in localStorage
     │
     ▼
API Client automatically adds token to all requests:
     │
     ├─► Headers: { Authorization: Bearer <token> }
     │
     ▼
Backend verifies token on protected routes
     │
     ├─► Valid   ─► Process request
     │
     └─► Invalid ─► Return 401 ─► Frontend redirects to login
```

## 🎯 Why This Architecture?

1. **Separation of Concerns**
   - Pages handle UI
   - Services handle data
   - Context manages state
   - API client handles communication

2. **Easy Backend Swap**
   - Change API_URL in `.env`
   - Services abstract the API calls
   - No need to modify components

3. **Testability**
   - Services can be mocked
   - Components can be tested independently
   - Clear boundaries

4. **Scalability**
   - Easy to add new services
   - Easy to add new endpoints
   - Clear structure for team collaboration

5. **Security**
   - Token management centralized
   - Authentication in one place
   - Role-based access controlled

## 📝 Adding a New Feature

To add a new feature (e.g., "Messages"):

1. **Create Service** (`src/services/messageService.js`)
   ```javascript
   export const messageService = {
       async getMessages() { ... },
       async sendMessage(data) { ... }
   };
   ```

2. **Create Component** (`src/pages/Messages.jsx`)
   ```javascript
   import { messageService } from '../services/messageService';
   // Use the service in your component
   ```

3. **Add Route** (in `App.jsx`)
   ```javascript
   <Route path="/messages" element={<Messages />} />
   ```

4. **Backend** (Implement endpoints)
   ```
   GET  /api/messages
   POST /api/messages
   ```

That's it! The architecture handles the rest.

## 🚀 Benefits

✅ **For Development:**
- Clear structure
- Easy to understand
- Fast development

✅ **For Maintenance:**
- Easy to debug
- Easy to update
- Clear responsibilities

✅ **For Scaling:**
- Easy to add features
- Easy to add developers
- Easy to split into microservices

✅ **For Deployment:**
- Frontend and backend separate
- Independent scaling
- Independent updates

---

This architecture is **production-ready** and follows industry best practices! 🎉
