import React, { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LoginModal } from './components/auth/LoginModal';
import { RegisterModal } from './components/auth/RegisterModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { UpazilaPage } from './pages/UpazilaPage';
import { CommitteePage } from './pages/CommitteePage';
import { MemberDirectoryPage } from './pages/MemberDirectoryPage';
import { GalleryPage } from './pages/GalleryPage';
import { EventsPage } from './pages/EventsPage';
import { NoticesPage } from './pages/NoticesPage';
import { ContactPage } from './pages/ContactPage';
import { FeedPage } from './pages/FeedPage';
import { ProfilePage } from './pages/ProfilePage';

// Dashboards
import { AdminDashboard } from './pages/dashboard/AdminDashboard';
import { TeacherDashboard } from './pages/dashboard/TeacherDashboard';
import { UpazilaAdminDashboard } from './pages/dashboard/UpazilaAdminDashboard';
import { StudentDashboard } from './pages/dashboard/StudentDashboard';
import { AlumniDashboard } from './pages/dashboard/AlumniDashboard';

export const App: React.FC = () => {
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  return (
    <ToastProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
            
            {/* Header / Navbar */}
            <Navbar
              onOpenLogin={() => setLoginModalOpen(true)}
              onOpenRegister={() => setRegisterModalOpen(true)}
            />

            {/* Main Content View */}
            <main className="flex-1">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/district" element={<HomePage />} />
                <Route path="/committee" element={<CommitteePage />} />
                <Route path="/upazila" element={<UpazilaPage />} />
                <Route path="/members" element={<MemberDirectoryPage />} />
                <Route path="/feed" element={<FeedPage />} />
                <Route path="/gallery" element={<GalleryPage />} />
                <Route path="/events" element={<EventsPage />} />
                <Route path="/notices" element={<NoticesPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/profile" element={<ProfilePage />} />

                {/* Dashboards */}
                <Route path="/dashboard/admin" element={<AdminDashboard />} />
                <Route path="/dashboard/teacher" element={<TeacherDashboard />} />
                <Route path="/dashboard/upazila" element={<UpazilaAdminDashboard />} />
                <Route path="/dashboard/student" element={<StudentDashboard />} />
                <Route path="/dashboard/alumni" element={<AlumniDashboard />} />
              </Routes>
            </main>

            {/* Footer */}
            <Footer />

            {/* Auth Modals */}
            <LoginModal
              isOpen={loginModalOpen}
              onClose={() => setLoginModalOpen(false)}
              onSwitchToRegister={() => {
                setLoginModalOpen(false);
                setRegisterModalOpen(true);
              }}
            />

            <RegisterModal
              isOpen={registerModalOpen}
              onClose={() => setRegisterModalOpen(false)}
              onSwitchToLogin={() => {
                setRegisterModalOpen(false);
                setLoginModalOpen(true);
              }}
            />

          </div>
        </BrowserRouter>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
