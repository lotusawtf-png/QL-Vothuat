// App.jsx
import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import FontLoader from './components/FontLoader';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './pages/Dashboard';
import MembersPage from './pages/MembersPage';
import TrainersPage from './pages/TrainersPage';
import SchedulesPage from './pages/SchedulesPage';
import PaymentsPage from './pages/PaymentsPage';
import PaymentApprovalPage from './pages/PaymentApprovalPage';
import MemberPaymentPage from './pages/MemberPaymentPage';
import AttendancePage from './pages/AttendancePage';
import ApprovalPage from './pages/ApprovalPage';
import ChangePasswordPage from './pages/ChangePasswordPage';
import AccountsPage from './pages/AccountsPage';
import SelectPackagePage from './pages/SelectPackagePage';
import MainLayout from './components/MainLayout';
import { getCurrentUser, logout, getMember } from './services/api';
import { useAuth } from './context/AuthContext';

function App() {
  const { user: authUser, login, logout: authLogout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [memberPackages, setMemberPackages] = useState(null);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      login(stored);
      // If member, load their package data
      if (stored.role === 'member' && stored.memberId) {
        loadMemberPackages(stored.memberId);
      }
    }
    setLoading(false);
  }, []);

  const loadMemberPackages = async (memberId) => {
    try {
      const member = await getMember(memberId);
      setMemberPackages(member?.magoi || []);
    } catch (err) {
      console.error('Lỗi tải gói member:', err);
    }
  };

  const handleLogin = (loggedInUser) => {
    console.log('App: handleLogin called with', loggedInUser);
    login(loggedInUser);
    // Load member packages if login as member
    if (loggedInUser.role === 'member' && loggedInUser.memberId) {
      loadMemberPackages(loggedInUser.memberId);
    }
  };

  const handleLogout = () => {
    authLogout();
    setMemberPackages(null);
  };

  if (loading) {
    return <div style={{ color: '#fff', background: '#0a0e27', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!authUser) {
    return (
      <>
        <FontLoader />
        {showRegister ? (
          <Register onBack={() => setShowRegister(false)} />
        ) : (
          <Login onLogin={handleLogin} onRegister={() => setShowRegister(true)} />
        )}
      </>
    );
  }

  // If member just logged in with no packages selected, redirect to select package
  if (authUser.role === 'member' && memberPackages !== null && memberPackages.length === 0) {
    return (
      <>
        <FontLoader />
        <SelectPackagePage user={authUser} onComplete={() => {
          // Reload member packages
          if (authUser.memberId) {
            loadMemberPackages(authUser.memberId);
          }
        }} />
      </>
    );
  }

  return (
    <>
      <FontLoader />
      <BrowserRouter>
        <MainLayout user={authUser} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/select-package" element={<SelectPackagePage user={authUser} onComplete={() => {
              const updated = getCurrentUser();
              if (updated) {
                login(updated);
              }
            }} />} />
            <Route path="/dashboard" element={<Dashboard user={authUser} />} />
            <Route path="/members" element={<MembersPage user={authUser} />} />
            <Route path="/trainers" element={<TrainersPage user={authUser} />} />
            <Route path="/schedules" element={<SchedulesPage user={authUser} />} />
            <Route path="/approval" element={authUser.role === 'admin' ? <ApprovalPage user={authUser} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/payment-approval" element={(authUser.role === 'admin' || authUser.role === 'manager') ? <PaymentApprovalPage user={authUser} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/accounts" element={(authUser.role === 'admin' || authUser.role === 'manager') ? <AccountsPage user={authUser} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/payments" element={<PaymentsPage user={authUser} />} />
            <Route path="/member-payments" element={<MemberPaymentPage user={authUser} />} />
            <Route path="/attendance" element={<AttendancePage user={authUser} />} />
            <Route path="/change-password" element={<ChangePasswordPage user={authUser} />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </>
  );
}

export default App;