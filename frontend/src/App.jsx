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

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showRegister, setShowRegister] = useState(false);
  const [memberPackages, setMemberPackages] = useState(null);

  useEffect(() => {
    const stored = getCurrentUser();
    if (stored) {
      setUser(stored);
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
    setUser(loggedInUser);
    // Load member packages if login as member
    if (loggedInUser.role === 'member' && loggedInUser.memberId) {
      loadMemberPackages(loggedInUser.memberId);
    }
  };

  const handleLogout = () => {
    logout();
    setUser(null);
    setMemberPackages(null);
  };

  if (loading) {
    return <div style={{ color: '#fff', background: '#0a0e27', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
  }

  if (!user) {
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
  if (user.role === 'member' && memberPackages !== null && memberPackages.length === 0) {
    return (
      <>
        <FontLoader />
        <SelectPackagePage user={user} onComplete={() => {
          // Reload member packages
          if (user.memberId) {
            loadMemberPackages(user.memberId);
          }
        }} />
      </>
    );
  }

  return (
    <>
      <FontLoader />
      <BrowserRouter>
        <MainLayout user={user} onLogout={handleLogout}>
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/select-package" element={<SelectPackagePage user={user} onComplete={() => {
              const updated = getCurrentUser();
              if (updated) {
                setUser(updated);
              }
            }} />} />
            <Route path="/dashboard" element={<Dashboard user={user} />} />
            <Route path="/members" element={<MembersPage user={user} />} />
            <Route path="/trainers" element={<TrainersPage user={user} />} />
            <Route path="/schedules" element={<SchedulesPage user={user} />} />
            <Route path="/approval" element={user.role === 'admin' ? <ApprovalPage user={user} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/payment-approval" element={(user.role === 'admin' || user.role === 'manager') ? <PaymentApprovalPage user={user} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/accounts" element={(user.role === 'admin' || user.role === 'manager') ? <AccountsPage user={user} /> : <Navigate to="/dashboard" replace />} />
            <Route path="/payments" element={<PaymentsPage user={user} />} />
            <Route path="/member-payments" element={<MemberPaymentPage user={user} />} />
            <Route path="/attendance" element={<AttendancePage user={user} />} />
            <Route path="/change-password" element={<ChangePasswordPage user={user} />} />
          </Routes>
        </MainLayout>
      </BrowserRouter>
    </>
  );
}

export default App;