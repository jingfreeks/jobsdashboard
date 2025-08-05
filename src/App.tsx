import { Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register, AdminDashboard, JobApplicantDashboard, Onboarding } from './pages'
import ProtectedRoute from './components/ProtectedRoute'
import RoleBasedRoute from './components/RoleBasedRoute'
import OnboardingGuard from './components/OnboardingGuard'
import { AuthMonitor } from './components/AuthMonitor'
import './App.css'

function App() {
  return (
    <>
      <AuthMonitor />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/onboarding" element={<Onboarding />} />
        
        {/* Protected routes that require onboarding */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <OnboardingGuard>
                <RoleBasedRoute allowedRoles={['Admin']}>
                  <AdminDashboard />
                </RoleBasedRoute>
              </OnboardingGuard>
            </ProtectedRoute>
          }
        />
        <Route
          path="/job-applicant/dashboard"
          element={
            <ProtectedRoute>
              <OnboardingGuard>
                <RoleBasedRoute allowedRoles={['Applicant', 'User']}>
                  <JobApplicantDashboard />
                </RoleBasedRoute>
              </OnboardingGuard>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
