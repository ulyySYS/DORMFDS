import { useAuth } from '../../context/AuthContext';
import { useState, useEffect } from 'react';
import './styles/AdminSidebar.css';

const DormSidebar = ({ 
  onDashboardClick, 
  onMaintenanceRequestClick, 
  onRegistrationClick, 
  onPaymentsClick,
  onRoomChangeClick,
}) => {
  const { logout, currentUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  useEffect(() => {
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
      if (collapsed) {
        mainContent.classList.add('sidebar-collapsed');
      } else {
        mainContent.classList.remove('sidebar-collapsed');
      }
    }
  }, [collapsed]);

  return (
    <div className={`dorm-sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        <button className="toggle-btn" onClick={toggleSidebar}>
          {collapsed ? '⟩' : '⟨'}
        </button>
      </div>
      
      <div className="sidebar-nav">
        <button onClick={onDashboardClick} className="nav-item">
          <span className="icon">✦</span>
          {!collapsed && <span className="label">Overview</span>}
        </button>
        <button onClick={onMaintenanceRequestClick} className="nav-item">
          <span className="icon">⚙</span>
          {!collapsed && <span className="label">Service Tickets</span>}
        </button>
        <button onClick={onRegistrationClick} className="nav-item">
          <span className="icon">⊕</span>
          {!collapsed && <span className="label">Sign Up</span>}
        </button>
        <button onClick={onPaymentsClick} className="nav-item">
          <span className="icon">$</span>
          {!collapsed && <span className="label">Billing</span>}
        </button>
        <button onClick={onRoomChangeClick} className="nav-item">
          <span className="icon">↻</span>
          {!collapsed && <span className="label">Move Rooms</span>}
        </button>
      </div>
      
      <div className="sidebar-footer">
        {!collapsed && (
          <span className="user-greeting">Hello, {currentUser?.UserName}</span>
        )}
        <button onClick={logout} className="exit-btn">
          {collapsed ? '✕' : 'Sign Out'}
        </button>
      </div>
    </div>
  );
};

export default DormSidebar;