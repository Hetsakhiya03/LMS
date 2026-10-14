import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import MainLayout from './layouts/MainLayout';

// Public Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import CourseBrowsePage from './pages/CourseBrowsePage';
import CourseDetailsPage from './pages/CourseDetailsPage';
import VerifyCertificatePage from './pages/VerifyCertificatePage';
import NotFoundPage from './pages/NotFoundPage';

// Protected Student Pages
import StudentDashboard from './pages/StudentDashboard';
import CourseLearningPage from './pages/CourseLearningPage';
import QuizPage from './pages/QuizPage';
import WishlistPage from './pages/WishlistPage';
import CertificateViewPage from './pages/CertificateViewPage';
import CheckoutPage from './pages/CheckoutPage';

// Protected Instructor Pages
import InstructorDashboard from './pages/InstructorDashboard';
import CourseBuilderPage from './pages/CourseBuilderPage';

// Protected Admin Pages
import AdminDashboard from './pages/AdminDashboard';

// Protected Guard
import ProtectedRoute from './components/common/ProtectedRoute';

// Smart Dashboard Redirect Component
const DashboardRedirect = () => {
  const { user, isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1a8754', fontWeight: 600 }}>
        Loading dashboard...
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'instructor') return <Navigate to="/instructor/dashboard" replace />;
  return <Navigate to="/student/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>

          {/* Public Routes */}
          <Route index element={<HomePage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="courses" element={<CourseBrowsePage />} />
          <Route path="courses/:id" element={<CourseDetailsPage />} />
          <Route path="verify-certificate/:certificateId" element={<VerifyCertificatePage />} />

          {/* Universal Dashboard Redirect Routes */}
          <Route path="dashboard" element={<DashboardRedirect />} />
          <Route path="daashboard" element={<DashboardRedirect />} />
          <Route path="student" element={<Navigate to="/student/dashboard" replace />} />
          <Route path="instructor" element={<Navigate to="/instructor/dashboard" replace />} />
          <Route path="admin" element={<Navigate to="/admin/dashboard" replace />} />

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student', 'instructor', 'admin']} />}>
            <Route path="student/dashboard" element={<StudentDashboard />} />
            <Route path="wishlist" element={<WishlistPage />} />
            <Route path="learning/:courseId" element={<CourseLearningPage />} />
            <Route path="quiz/:quizId" element={<QuizPage />} />
            <Route path="certificate/:courseId" element={<CertificateViewPage />} />
            <Route path="checkout/:courseId" element={<CheckoutPage />} />
          </Route>

          {/* Instructor Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['instructor', 'admin']} />}>
            <Route path="instructor/dashboard" element={<InstructorDashboard />} />
            <Route path="instructor/course-builder" element={<CourseBuilderPage />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="admin/dashboard" element={<AdminDashboard />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFoundPage />} />

        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;
