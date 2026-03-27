import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { LanguageProvider } from './context/LanguageContext';
import { SocketProvider } from './context/SocketContext';
import { PublicLayout } from './layouts/PublicLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ToastProvider } from './components/Toast';

// Public Pages
import { LandingPage } from './pages/LandingPage';
import { PublicEvents } from './pages/PublicEvents';
import { About } from './pages/About';
import { SignIn } from './pages/SignIn';
import { SignUp } from './pages/SignUp';

// Student Pages
import { DashboardHome } from './pages/student/DashboardHome';
import { Profile } from './pages/student/Profile';
import { Search } from './pages/student/Search';
import { Friends } from './pages/student/Friends';
import { Messages } from './pages/student/Messages';
import { UserProfile } from './pages/UserProfile';
import { FindFriends } from './pages/student/FindFriends';
import { ApplyOpportunity } from './pages/student/ApplyOpportunity';
import { Feed } from './pages/student/Feed';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { ManageEvents } from './pages/admin/ManageEvents';
import { ManageUsers } from './pages/admin/ManageUsers';
import { ManageInternships } from './pages/admin/ManageInternships';
import { ManageCompanies } from './pages/admin/ManageCompanies';
import { ManageApplications } from './pages/admin/ManageApplications';
import { ManageSupportMessages } from './pages/admin/ManageSupportMessages';

// Company Pages
import CompanyOverview from './pages/company/CompanyOverview';
import ManageCompanyOffers from './pages/company/ManageCompanyOffers';
import ManageCompanyApplications from './pages/company/ManageCompanyApplications';
import CompanyProfile from './pages/company/CompanyProfile';
import AcceptedCandidates from './pages/company/AcceptedCandidates';
import { useAuth } from './context/AuthContext';

const DashboardIndex = () => {
  const { user } = useAuth();
  if (user?.role === 'company') return <CompanyOverview />;
  return <DashboardHome />;
};

const ProfileSelector = () => {
    const { user } = useAuth();
    if (user?.role === 'company') return <CompanyProfile />;
    return <Profile />;
};

function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <ToastProvider>
          <SocketProvider>
            <Router>
              <Routes>
                {/* Public Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/events" element={<PublicEvents />} />
                  <Route path="/about" element={<About />} />
                  <Route path="/signin" element={<SignIn />} />
                  <Route path="/signup" element={<SignUp />} />
                </Route>

                {/* Unified Dashboard Routes */}
                <Route path="/dashboard" element={
                  <ProtectedRoute allowedRoles={['student', 'graduate', 'other', 'company']}>
                    <DashboardLayout />
                  </ProtectedRoute>
                }>
                  <Route index element={<DashboardIndex />} />
                  <Route path="company/offers" element={
                    <ProtectedRoute allowedRoles={['company', 'graduate']}>
                      <ManageCompanyOffers />
                    </ProtectedRoute>
                  } />
                  <Route path="company/applications" element={
                    <ProtectedRoute allowedRoles={['company', 'graduate']}>
                      <ManageCompanyApplications />
                    </ProtectedRoute>
                  } />
                  <Route path="company/accepted" element={
                    <ProtectedRoute allowedRoles={['company']}>
                      <AcceptedCandidates />
                    </ProtectedRoute>
                  } />
                  <Route path="profile" element={<ProfileSelector />} />
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
                    <ProtectedRoute allowedRoles={['student', 'graduate', 'other', 'company']}>
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
                  <Route path="support" element={<ManageSupportMessages />} />
                  <Route path="messages" element={<Messages />} />
                  <Route path="profile/:id" element={<UserProfile />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </SocketProvider>
        </ToastProvider>
      </LanguageProvider>
    </AuthProvider>
  );
}

export default App;
