import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';

// Loading Component
const PageLoading = () => (
  <div className="flex items-center justify-center min-h-[60vh] w-full">
    <div className="relative">
      <div className="h-12 w-12 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin" />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="h-2 w-2 bg-blue-600 rounded-full animate-pulse" />
      </div>
    </div>
  </div>
);

// Lazy Loaded Public Pages
const LandingPage = lazy(() => import('./pages/LandingPage').then(module => ({ default: module.LandingPage })));
const PublicEvents = lazy(() => import('./pages/PublicEvents').then(module => ({ default: module.PublicEvents })));
const About = lazy(() => import('./pages/About').then(module => ({ default: module.About })));
const SignIn = lazy(() => import('./pages/SignIn').then(module => ({ default: module.SignIn })));
const SignUp = lazy(() => import('./pages/SignUp').then(module => ({ default: module.SignUp })));

// Lazy Loaded Student Pages
const DashboardHome = lazy(() => import('./pages/student/DashboardHome').then(module => ({ default: module.DashboardHome })));
const Profile = lazy(() => import('./pages/student/Profile').then(module => ({ default: module.Profile })));
const Search = lazy(() => import('./pages/student/Search').then(module => ({ default: module.Search })));
const Friends = lazy(() => import('./pages/student/Friends').then(module => ({ default: module.Friends })));
const Messages = lazy(() => import('./pages/student/Messages').then(module => ({ default: module.Messages })));
const UserProfile = lazy(() => import('./pages/UserProfile').then(module => ({ default: module.UserProfile })));
const FindFriends = lazy(() => import('./pages/student/FindFriends').then(module => ({ default: module.FindFriends })));
const ApplyOpportunity = lazy(() => import('./pages/student/ApplyOpportunity').then(module => ({ default: module.ApplyOpportunity })));
const Feed = lazy(() => import('./pages/student/Feed').then(module => ({ default: module.Feed })));

// Lazy Loaded Admin Pages
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview').then(module => ({ default: module.AdminOverview })));
const ManageEvents = lazy(() => import('./pages/admin/ManageEvents').then(module => ({ default: module.ManageEvents })));
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers').then(module => ({ default: module.ManageUsers })));
const ManageInternships = lazy(() => import('./pages/admin/ManageInternships').then(module => ({ default: module.ManageInternships })));
const ManageCompanies = lazy(() => import('./pages/admin/ManageCompanies').then(module => ({ default: module.ManageCompanies })));
const ManageApplications = lazy(() => import('./pages/admin/ManageApplications').then(module => ({ default: module.ManageApplications })));

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <SocketProvider>
            <Router>
              <Suspense fallback={<PageLoading />}>
                <Routes>
                  {/* Public Routes */}
                  <Route element={<PublicLayout />}>
                    <Route path="/" element={<LandingPage />} />
                    <Route path="/events" element={<PublicEvents />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/signin" element={<SignIn />} />
                    <Route path="/signup" element={<SignUp />} />
                  </Route>

                  {/* Student/Graduate/Other Routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute allowedRoles={['student', 'graduate', 'other']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="profile/:id" element={<UserProfile />} />
                    <Route path="search" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate', 'other']}>
                        <Search />
                      </ProtectedRoute>
                    } />
                    <Route path="friends" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate']}>
                        <Friends />
                      </ProtectedRoute>
                    } />
                    <Route path="find-friends" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate', 'other']}>
                        <FindFriends />
                      </ProtectedRoute>
                    } />
                    <Route path="messages" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate', 'other']}>
                        <Messages />
                      </ProtectedRoute>
                    } />
                    <Route path="feed" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate']}>
                        <Feed />
                      </ProtectedRoute>
                    } />
                    <Route path="apply/:id" element={
                      <ProtectedRoute allowedRoles={['student', 'graduate']}>
                        <ApplyOpportunity />
                      </ProtectedRoute>
                    } />
                  </Route>

                  {/* Admin Routes */}
                  <Route path="/admin" element={
                    <ProtectedRoute allowedRoles={['admin']}>
                      <DashboardLayout />
                    </ProtectedRoute>
                  }>
                    <Route index element={<AdminOverview />} />
                    <Route path="events" element={<ManageEvents />} />
                    <Route path="users" element={<ManageUsers />} />
                    <Route path="internships" element={<ManageInternships />} />
                    <Route path="companies" element={<ManageCompanies />} />
                    <Route path="applications" element={<ManageApplications />} />
                    <Route path="messages" element={<Messages />} />
                    <Route path="profile/:id" element={<UserProfile />} />
                  </Route>

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </Suspense>
            </Router>
          </SocketProvider>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
