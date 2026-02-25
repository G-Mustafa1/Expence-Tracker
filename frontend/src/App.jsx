import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import { useEffect } from 'react';
import { checkAuth } from './features/authSlice';
import { fetchDashboardData } from './features/dashboardSlice';
import AuthLayout from './layout/AuthLayout'
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import ProtectedRoute from './components/ProtectedRoute'
import Dashboard from './layout/Dashboard';
import Home from './pages/Dashboard/Home';
import Income from './pages/Dashboard/Income';
import Expence from './pages/Dashboard/Expence';
import { Routes, Route } from 'react-router-dom';

function App() {
  const dispatch = useDispatch();
  const { user , isLogin } = useSelector((state) => state.auth);

  // ✅ Run ONLY once on app start
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // ✅ Fetch dashboard data after user is set
  useEffect(() => {
    if (user) {
      dispatch(fetchDashboardData());
    }
  }, [user, dispatch]);
  return (
    <Routes>
      {/* Auth routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
      </Route>

      {/* Protected routes */}
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





