import { Routes, Route, Navigate } from 'react-router-dom'
// import Dashboard from './pages/dashboard/Dashboard'
// import Login from './pages/Login/Login'
// import Register from './pages/Register/Register'
import { Login, Register, Dashboard } from './pages'
import './App.css'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  )
}

export default App
