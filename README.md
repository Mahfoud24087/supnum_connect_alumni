# SupNum Alumni Connect

A modern alumni networking platform for SupNum graduates and students.

## 🚀 Features

- **Authentication** - Secure login/registration for students, graduates, and admins
- **User Profiles** - Comprehensive profiles with social links and professional info
- **Event Management** - Create and manage campus events
- **Internship Board** - Post and browse internship opportunities  
- **Company Directory** - Partner companies database
- **Admin Dashboard** - Complete administrative control panel
- **Messaging** - Connect with fellow alumni (coming soon)
- **Responsive Design** - Works on all devices

## 🛠️ Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **Charts**: Recharts
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **State Management**: React Context API
- **Backend Ready**: API services layer prepared

## 📦 Installation

```bash
# Clone the repository
git clone <repository-url>

# Navigate to project directory
cd supnum-connect

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Update .env with your backend URL
# VITE_API_URL=http://localhost:3000/api

# Start development server
npm run dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
VITE_API_URL=http://localhost:3000/api
```

### Backend Integration

The frontend is **backend-ready** with a complete API service layer. See `BACKEND_INTEGRATION.md` for:

- Required API endpoints
- Data models
- Authentication flow
- Integration steps

## 📝 Default Test Accounts

For testing during development:

- **Admin**: `admin@supnum.mr` / `admin123`
- **Student**: `student@supnum.mr` / `password123`
- **Graduate**: `graduate@supnum.mr` / `password123`

⚠️ **Note**: These are for development only. Remove in production!

## 🏗️ Project Structure

```
src/
├── components/        # Reusable UI components
│   └── ui/           # Base UI components (Button, Card, Input, etc.)
├── pages/            # Page components
│   ├── admin/        # Admin panel pages
│   ├── student/      # Student/Graduate pages
│   └── ...           # Public pages
├── layouts/          # Layout components
├── context/          # React Context providers
├── services/         # API service layer (backend integration)
├── data/            # Mock data (temporary)
├── lib/             # Utility functions
└── App.jsx          # Main app component
```

## 🌐 API Services

All backend communication is handled through service modules:

```javascript
// Example usage
import { authService } from './services/authService';

const result = await authService.login(email, password);
```

Available services:
- `authService` - Authentication & user management
- `userService` - User CRUD operations
- `eventService` - Event management
- `companyService` - Company directory
- `internshipService` - Internship board

## 🧪 Testing with Mock Server

Want to test before your backend is ready? Use `json-server`:

```bash
# Install json-server globally
npm installg json-server

# See MOCK_SERVER.md for complete setup
```

## 🚀 Deployment

### Frontend

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

Deploy the `dist` folder to:
- Vercel
- Netlify
- AWS S3 + CloudFront
- Any static hosting service

### Backend

Your backend should implement the API endpoints documented in `BACKEND_INTEGRATION.md`.

Recommended stack:
- Node.js + Express
- Python + FastAPI
- Java + Spring Boot
- Any RESTful API framework

## 📚 Documentation

- **[Backend Integration Guide](BACKEND_INTEGRATION.md)** - Complete API specification
- **[Mock Server Setup](MOCK_SERVER.md)** - Testing with json-server

## 🎨 Design System

The project uses a custom design system with:
- Consistent color palette (SupNum Blue, Gold, etc.)
- Responsive typography
- Dark mode support
- Accessible components
- Smooth animations

## 🔐 Security

- JWT token authentication
- Secure password handling (backend)
- Role-based access control
- Protected routes
- XSS prevention
- CSRF protection (backend)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

[Your License Here]

## 👥 Team

SupNum Development Team

## 📞 Support

For questions or issues, please open an issue on GitHub.

---

**Note**: This is the frontend application. You need to set up a backend API for full functionality. See `BACKEND_INTEGRATION.md` for details.
