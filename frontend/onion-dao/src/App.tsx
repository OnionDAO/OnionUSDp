import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './components/auth/LoginPage'
import CorporationDashboard from './components/dashboards/CorporationDashboard'
import EmployeeDashboard from './components/dashboards/EmployeeDashboard'
import LandingPage from './components/LandingPage'
import './App.css'

// Landing page component (the original content)
const LandingPageComponent: React.FC = () => (
  <LandingPage />
);

// Dashboard router component
const DashboardRouter: React.FC = () => {
  const { currentUser, userProfile, loading } = useAuth();
  
  // Still loading auth state
  if (loading) {
    return <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#000', color: '#fff'}}>
      Loading...
    </div>;
  }
  
  // Not authenticated
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  
  // Authenticated but no profile (incomplete signup)
  if (!userProfile) {
    console.log('User authenticated but no profile found, redirecting to login');
    return <Navigate to="/login" replace />;
  }
  
  // Fully authenticated with profile
  return userProfile.userType === 'corporation' ? 
    <CorporationDashboard /> : 
    <EmployeeDashboard />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPageComponent />} />
            <Route path="/login" element={<LoginPage />} />
            
            {/* Protected routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardRouter />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/corporation/*" 
              element={
                <ProtectedRoute requiredUserType="corporation">
                  <CorporationDashboard />
                </ProtectedRoute>
              } 
            />
            
            <Route 
              path="/employee/*" 
              element={
                <ProtectedRoute requiredUserType="employee">
                  <EmployeeDashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Redirect unknown routes to landing page */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  )
}

export default App
