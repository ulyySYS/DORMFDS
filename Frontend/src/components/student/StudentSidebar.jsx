import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const StudentSidebar = ({ setShowMaintenanceForm, setShowPayments, onToggle }) => {
  const { logout, currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    if (onToggle) {
      onToggle(newCollapsedState);
    }
  };

  const handleDashboardClick = () => {
    setShowMaintenanceForm(false);
    if (setShowPayments) setShowPayments(false);
  };

  const handleMaintenanceClick = () => {
    setShowMaintenanceForm(true);
    if (setShowPayments) setShowPayments(false);
  };

  const handlePaymentsClick = () => {
    if (setShowPayments) {
      setShowPayments(true);
      setShowMaintenanceForm(false);
    }
  };

  return (
    <div className={`student-sidebar ${collapsed ? 'student-sidebar-collapsed' : ''}`}>
      <div className="student-sidebar-header">
        <button className="student-sidebar-toggle-btn" onClick={toggleSidebar}>
          {collapsed ? '→' : '←'}
        </button>
        {!collapsed && <h2 className="student-sidebar-title">Student Dashboard</h2>}
      </div>
      
      <div className="student-sidebar-buttons">
        <button onClick={handleDashboardClick} className="student-sidebar-btn">
          <span className="student-sidebar-btn-icon">📊</span>
          {!collapsed && <span className="student-sidebar-btn-text">Dashboard</span>}
        </button>
        <button onClick={handleMaintenanceClick} className="student-sidebar-btn">
          <span className="student-sidebar-btn-icon">🔧</span>
          {!collapsed && <span className="student-sidebar-btn-text">Maintenance Request</span>}
        </button>
        <button onClick={handlePaymentsClick} className="student-sidebar-btn">
          <span className="student-sidebar-btn-icon">💰</span>
          {!collapsed && <span className="student-sidebar-btn-text">Payments</span>}
        </button>
      </div>
      
      <div className="student-sidebar-footer">
        {!collapsed && (
          <span className="student-sidebar-welcome">Welcome, {currentUser?.UserName}</span>
        )}
        <button onClick={logout} className="student-sidebar-logout-btn">
          {collapsed ? '🚪' : 'Logout'}
        </button>
      </div>
    </div>
  );
};




export default StudentSidebar;