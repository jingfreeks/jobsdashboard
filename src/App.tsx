import { Routes, Route, Navigate } from 'react-router-dom'
import { Login, Register, Dashboard } from './pages'
import ProtectedRoute from './components/ProtectedRoute'
import { AuthMonitor } from './components/AuthMonitor'
import './App.css'

function App() {
  return (
    <>
      <AuthMonitor />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  )
}

export default App
