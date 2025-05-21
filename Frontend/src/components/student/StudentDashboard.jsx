import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/StudentDashboard.css';
import PaymentsComponent from './StudentPayments';
import StudentPersonalInfo from './StudentPersonalInfo';
import MaintenanceRequest from './MaintenanceRequest';

const RedesignedStudentDashboard = () => {
  const { currentUser, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [navExpanded, setNavExpanded] = useState(false);

  // Fetch maintenance requests when component mounts
  useEffect(() => {
    if (currentUser?.UserID && activeTab === 'dashboard') {
      fetchMaintenanceRequests(currentUser.UserID);
    }
  }, [currentUser, activeTab]);

  const fetchMaintenanceRequests = async (userID) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/user/all-account-requests/${userID}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }
      
      const data = await response.json();
      setMaintenanceRequests(data.requests || []);
    } catch (err) {
      setError('Error loading requests: ' + err.message);
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleLogout = () => {
    logout();
    // The redirect to login page should be handled by the AuthContext's logout function
  };

  return (
    <div className="dorm-layout">
      {/* Navigation Sidebar */}
      <div className={`dorm-nav ${navExpanded ? 'expanded' : ''}`}>
        <div className="dorm-nav-header">
          <h3>Dormitory Portal</h3>
          <button 
            className="dorm-nav-toggle"
            onClick={() => setNavExpanded(!navExpanded)}
          >
            {navExpanded ? '×' : '≡'}
          </button>
        </div>
        
        <div className="dorm-nav-links">
          <button 
            className={`dorm-nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <i className="dorm-icon">🏠</i>
            <span>Dashboard</span>
          </button>
          
          <button 
            className={`dorm-nav-link ${activeTab === 'maintenance' ? 'active' : ''}`}
            onClick={() => setActiveTab('maintenance')}
          >
            <i className="dorm-icon">🔧</i>
            <span>Maintenance</span>
          </button>
          
          <button 
            className={`dorm-nav-link ${activeTab === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveTab('payments')}
          >
            <i className="dorm-icon">💳</i>
            <span>Payments</span>
          </button>
          
          <button 
            className={`dorm-nav-link ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            <i className="dorm-icon">👤</i>
            <span>Profile</span>
          </button>
          
          {/* Logout Button */}
          <button 
            className="dorm-nav-link"
            onClick={handleLogout}
          >
            <i className="dorm-icon">🚪</i>
            <span>Logout</span>
          </button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="dorm-content">
        {/* Dashboard View */}
        {activeTab === 'dashboard' && (
          <div className="dorm-panel">
            <div className="dorm-panel-header">
              <h2>Resident Dashboard</h2>
              <p>Welcome back, {currentUser?.UserName}</p>
            </div>
            
            <div className="dorm-card-grid">
              <div className="dorm-card">
                
                <div className="dorm-card-content">
                  <div className="dorm-info-item">
                    <label>Full Name:</label>
                    <span>{currentUser?.UserName}</span>
                  </div>
                  <div className="dorm-info-item">
                    <label>Email:</label>
                    <span>{currentUser?.Email}</span>
                  </div>
                  <div className="dorm-info-item">
                    <label>Contact:</label>
                    <span>{currentUser?.ContactNumber}</span>
                  </div>
                </div>
              </div>
              
              <div className="dorm-card">
                <div className="dorm-card-header">
                  <h3>Quick Actions</h3>
                </div>
                <div className="dorm-card-content">
                  <div className="dorm-button-grid">
                    <button onClick={() => setActiveTab('maintenance')} className="dorm-action-btn">
                      New Request
                    </button>
                    <button onClick={() => setActiveTab('payments')} className="dorm-action-btn">
                      Make Payment
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="dorm-card dorm-full-width">
                <div className="dorm-card-header">
                  <h3>Maintenance Requests</h3>
                </div>
                <div className="dorm-card-content">
                  {isLoading ? (
                    <div className="dorm-loading">Loading requests...</div>
                  ) : error ? (
                    <div className="dorm-error">{error}</div>
                  ) : maintenanceRequests.length === 0 ? (
                    <div className="dorm-empty">No maintenance requests found</div>
                  ) : (
                    <div className="dorm-requests-table">
                      {maintenanceRequests.map((request) => (
                        <div key={request.RequestID} className="dorm-request-item">
                          <div className="dorm-request-room">{request.RoomName}</div>
                          <div className="dorm-request-details">{request.RequestDetails}</div>
                          <div className="dorm-request-meta">
                            <span className={`dorm-status dorm-status-${request.Status.toLowerCase()}`}>
                              {request.Status}
                            </span>
                            <span className="dorm-request-date">{formatDate(request.Date)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        
        {/* Maintenance Request View - Using the new component */}
        {activeTab === 'maintenance' && (
          <MaintenanceRequest />
        )}
        
        {/* Payments View */}
        {activeTab === 'payments' && (
          <PaymentsComponent />
        )}
        
        {/* Profile View */}
        {activeTab === 'profile' && (
          <StudentPersonalInfo userData={currentUser} />
        )}
      </div>
    </div>
  );
};

export default RedesignedStudentDashboard;