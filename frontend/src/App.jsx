import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expence from './pages/Dashboard/Expence';
import AuthLayout from './layout/AuthLayout';
import Dashboard from './layout/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { checkAuth } from './features/authSlice';
import { fetchDashboardData } from './features/dashboardSlice';

function App() {
  
  // const dispatch = useDispatch();
  // const user = useSelector((state) => state.auth?.user);

  // useEffect(() => {
  //   dispatch(checkAuth());
  // }, []);

  // useEffect(() => {
  //   if (user?._id) {
  //     dispatch(fetchDashboardData());
  //   }
  // }, [user]);

  return (
    <Routes>
      {/* Auth routes (Login / Signup) */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected Routes (Dashboard + nested pages) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Home />} />
          <Route path="income" element={<Income />} />
          <Route path="expenses" element={<Expence />} />
          <Route path="profile" element={<Home />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;