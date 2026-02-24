import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './layout/layout'
import Login from './pages/auth/Login'
import SignUp from './pages/auth/SignUp'
import Home from './pages/Dashboard/Home'
import Income from './pages/Dashboard/Income'
import Expence from './pages/Dashboard/Expence'
import AuthLayout from './layout/AuthLayout'
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './layout/Dashboard'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <Routes>
        {/* Auth */}
        <Route element={<AuthLayout />}>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>

        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />}>
            <Route index element={<Home />} />
            <Route path="income" element={<Income />} />
            <Route path="expenses" element={<Expence />} />
            <Route path="profile" element={<Home />} />
          </Route>
        </Route>
      </Routes>
    </>
  )
}


export default App

const Root = () => {
  const isAuthenticated = !!localStorage.getItem('token')

  return isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />

}