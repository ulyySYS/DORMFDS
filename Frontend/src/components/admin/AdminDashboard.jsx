import { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import { useAuth } from '../../context/AuthContext';
import AdminMaintenanceRequestForm from './AdminMaintenanceRequestForm';
import MaintenanceRequestList from './MaintenanceRequestList';
import MaintenanceLogForm from './AdminMaintenanceLogForm';
import RegistrationForm from './RegistrationForm';
import RegistrationsList from './RegistrationsList';
import PaymentForm from './PaymentForm';
import RoomChange from './RoomChangeComponent';
import './styles/AdminDashboard.css';

const AdminDashboard = () => {
  const { currentUser } = useAuth();
  const [activeView, setActiveView] = useState('dashboard');
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showLogForm, setShowLogForm] = useState(false);
  
  const [ setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [ setIsLoadingRegistrations] = useState(false);
  const [ setRegistrationsError] = useState(null);

  const [userRegistrations, setUserRegistrations] = useState([]);
  const [isLoadingUserRegistrations, setIsLoadingUserRegistrations] = useState(false);
  const [userRegistrationsError, setUserRegistrationsError] = useState(null);

  const [allPayments, setAllPayments] = useState([]);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [paymentsError, setPaymentsError] = useState(null);

  const [maintenanceLogs, setMaintenanceLogs] = useState([]);
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [logsError, setLogsError] = useState(null);

  const [buildings, setBuildings] = useState([]);
  const [isLoadingBuildings, setIsLoadingBuildings] = useState(false);
  const [buildingsError, setBuildingsError] = useState(null);

  useEffect(() => {
    switch (activeView) {
      case 'maintenance':
      case 'maintenanceRequests':
        fetchMaintenanceRequests();
        break;
      case 'payments':
        fetchRegistrations();
        break;
      case 'userRegistration':
        fetchUserRegistrations();
        break;
      case 'allPayments':
        fetchAllPayments();
        break;
      case 'maintenanceLogs':
        fetchMaintenanceLogs();
        break;
      case 'buildings':
      case 'roomChange':
        fetchBuildings();
        break;
      default:
        break;
    }
  }, [activeView]);

  const fetchUserRegistrations = async () => {
    setIsLoadingUserRegistrations(true);
    setUserRegistrationsError(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/housing/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch user registrations');
      }
      
      const data = await response.json();
      setUserRegistrations(data.allRegistrations || []);
    } catch (err) {
      setUserRegistrationsError('Error fetching user registrations: ' + err.message);
      console.error('Error fetching user registrations:', err);
    } finally {
      setIsLoadingUserRegistrations(false);
    }
  };

  const fetchAllPayments = async () => {
    setIsLoadingPayments(true);
    setPaymentsError(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/billing/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch payments');
      }
      
      const data = await response.json();
      setAllPayments(data.allPayments || []);
      console.log('Payments:', data.allPayments);
    } catch (err) {
      setPaymentsError('Error fetching payments: ' + err.message);
      console.error('Error fetching payments:', err);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchMaintenanceLogs = async () => {
    setIsLoadingLogs(true);
    setLogsError(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/view-maintenance-logs');
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance logs');
      }
      
      const data = await response.json();
      setMaintenanceLogs(data.logs || []);
    } catch (err) {
      setLogsError('Error fetching maintenance logs: ' + err.message);
      console.error('Error fetching maintenance logs:', err);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const fetchBuildings = async () => {
    setIsLoadingBuildings(true);
    setBuildingsError(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/all-buildings');
      
      if (!response.ok) {
        throw new Error('Failed to fetch buildings');
      }
      
      const data = await response.json();
      setBuildings(data.buildings || []);
      console.log('Buildings:', data.buildings);
    } catch (err) {
      setBuildingsError('Error fetching buildings: ' + err.message);
      console.error('Error fetching buildings:', err);
    } finally {
      setIsLoadingBuildings(false);
    }
  };

  const fetchMaintenanceRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/view-maintenance-requests');
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }
      
      const data = await response.json();
      setMaintenanceRequests(data.requests || []);
    } catch (err) {
      setError('Error fetching maintenance requests: ' + err.message);
      console.error('Error fetching maintenance requests:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchRegistrations = async () => {
    setIsLoadingRegistrations(true);
    setRegistrationsError(null);
    try {
      const response = await fetch('http://localhost:3000/admin/housing/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      
      const data = await response.json();
      setRegistrations(data.allRegistrations || []);
    } catch (err) {
      setRegistrationsError('Error fetching registrations: ' + err.message);
      console.error('Error fetching registrations:', err);
    } finally {
      setIsLoadingRegistrations(false);
    }
  };

  const handleRequestSelect = (request) => {
    setSelectedRequest(request);
    setShowLogForm(true);
  };


  const handleRequestSubmitted = () => {
    fetchMaintenanceRequests();
  };

  const handleLogSubmitted = () => {
    fetchMaintenanceRequests();
    setSelectedRequest(null);
    setShowLogForm(false);
  };

  const handlePaymentSubmitted = () => {
    setSelectedRegistration(null);
    fetchRegistrations();
  };

  const handleCloseLogForm = () => {
    setShowLogForm(false);
    setSelectedRequest(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderDashboardContent = () => {
    return (
      <div className="dashboard-overview">
        <div className="welcome-banner">
          <div className="welcome-content">
            <h2>Welcome back, {currentUser?.UserName}</h2>
            <p>Manage your dormitory administration efficiently</p>
          </div>
        </div>

        <div className="stats-container">
          <div className="stat-card">
            <span className="stat-value">{userRegistrations.length}</span>
            <span className="stat-label">Total Registrations</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{allPayments.length}</span>
            <span className="stat-label">Payments Recorded</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{maintenanceLogs.length}</span>
            <span className="stat-label">Maintenance Logs</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">{buildings.length}</span>
            <span className="stat-label">Buildings</span>
          </div>
        </div>
        
        <div className="admin-profile-card">
          <div className="profile-header">
            <div className="profile-avatar">{currentUser?.UserName?.charAt(0)}</div>
            <div className="profile-title">
              <h3>{currentUser?.UserName}</h3>
              <span className="admin-badge">{currentUser?.Role}</span>
            </div>
          </div>
          <div className="profile-details">
            <div className="profile-item">
              <span className="item-label">Email:</span>
              <span className="item-value">{currentUser?.Email}</span>
            </div>
            <div className="profile-item">
              <span className="item-label">Contact:</span>
              <span className="item-value">{currentUser?.ContactNumber}</span>
            </div>
          </div>
        </div>
        
        <div className="quick-access-panel">
          <h3>Quick Access</h3>
          <div className="quick-links">
            <div className="quick-link-item" onClick={() => setActiveView('userRegistration')}>
              <div className="link-icon registration-icon"></div>
              <span>User Registration</span>
            </div>
            <div className="quick-link-item" onClick={() => setActiveView('allPayments')}>
              <div className="link-icon payment-icon"></div>
              <span>Payments</span>
            </div>
            <div className="quick-link-item" onClick={() => setActiveView('maintenanceLogs')}>
              <div className="link-icon maintenance-icon"></div>
              <span>Maintenance</span>
            </div>
            <div className="quick-link-item" onClick={() => setActiveView('buildings')}>
              <div className="link-icon building-icon"></div>
              <span>Buildings</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderMaintenanceView = () => {
    return (
      <div className="maintenance-module">
        <div className="module-container">
          <div className="module-sidebar">
            {isLoading ? (
              <div className="loading-animation">
                <div className="loading-spinner"></div>
                <p>Loading requests...</p>
              </div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <MaintenanceRequestList 
                requests={maintenanceRequests} 
                onSelectRequest={handleRequestSelect}
                selectedRequest={selectedRequest}
              />
            )}
          </div>
          
          <div className="module-main">
            {showLogForm && selectedRequest ? (
              <MaintenanceLogForm 
                selectedRequest={selectedRequest}
                onLogSubmitted={handleLogSubmitted}
                onClose={handleCloseLogForm}
              />
            ) : (
              <AdminMaintenanceRequestForm 
                currentUser={currentUser}
                onRequestSubmitted={handleRequestSubmitted}
              />
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderRegistrationView = () => {
    return (
      <div className="registration-module">
        <RegistrationForm currentUser={currentUser} />
      </div>
    );
  };

  const renderPaymentsView = () => {
    return (
      <div className="payments-module">
        <div className="module-container payment-container">
          <PaymentForm 
              currentUser={currentUser}
              selectedRegistration={selectedRegistration}
              onPaymentSubmitted={handlePaymentSubmitted}
            />
        </div>
      </div>
    );
  };

  const renderRoomChangeView = () => {
    return (
      <div className="roomchange-module">
        <div className="back-nav">
          <button className="back-button" onClick={() => setActiveView('dashboard')}>
            <span className="back-icon">←</span> Back to Dashboard
          </button>
        </div>
        <RoomChange buildings={buildings} />
      </div>
    );
  };

  const renderDataTableView = () => {
    let tableContent;

    if (activeView === 'userRegistration') {
      tableContent = (
        <>
          <h3 className="data-title">Student Housing Registrations</h3>
          {isLoadingUserRegistrations ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <p>Loading registration data...</p>
            </div>
          ) : userRegistrationsError ? (
            <div className="error-message">{userRegistrationsError}</div>
          ) : (
            <div className="table-scroll">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th>#ID</th>
                    <th>Student</th>
                    <th>Room</th>
                    <th>Contact</th>
                    <th>Email</th>
                    <th>Period</th>
                  </tr>
                </thead>
                <tbody>
                  {userRegistrations.map((reg) => (
                    <tr key={reg.RegistrationID}>
                      <td>{reg.RegistrationID}</td>
                      <td>
                        <div className="student-cell">
                          <span className="student-avatar">{reg.UserName.charAt(0)}</span>
                          <span className="student-name">{reg.UserName}</span>
                          <span className="uid">ID: {reg.UserID}</span>
                        </div>
                      </td>
                      <td>Room {reg.RoomID}</td>
                      <td>{reg.ContactNumber}</td>
                      <td>{reg.Email}</td>
                      <td>
                        <div className="date-range">
                          <span>{formatDate(reg.StartDate)}</span>
                          <span className="date-separator">→</span>
                          <span>{formatDate(reg.EndDate)}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }
    
    else if (activeView === 'allPayments') {
      tableContent = (
        <>
          <h3 className="data-title">Payment Transactions</h3>
          {isLoadingPayments ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <p>Loading payment data...</p>
            </div>
          ) : paymentsError ? (
            <div className="error-message">{paymentsError}</div>
          ) : (
            <div className="table-scroll">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th>Registration</th>
                    <th>Student</th>
                    <th>Contact</th>
                    <th>Payment Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {allPayments.map((payment, index) => (
                    <tr key={index}>
                      <td><span className="reg-tag">#{payment.RegistrationID}</span></td>
                      <td>
                        <div className="student-cell">
                          <span className="student-avatar">{payment.UserName.charAt(0)}</span>
                          <span className="student-name">{payment.UserName}</span>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div>{payment.ContactNumber}</div>
                          <div className="email-small">{payment.Email}</div>
                        </div>
                      </td>
                      <td>{formatDate(payment.PaymentDate)}</td>
                      <td><span className="amount-badge">₱{parseFloat(payment.Amount).toFixed(2)}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }
    
    else if (activeView === 'maintenanceLogs') {
      tableContent = (
        <>
          <h3 className="data-title">Maintenance History</h3>
          {isLoadingLogs ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <p>Loading maintenance logs...</p>
            </div>
          ) : logsError ? (
            <div className="error-message">{logsError}</div>
          ) : (
            <div className="table-scroll">
              <table className="data-grid">
                <thead>
                  <tr>
                    <th>Log #</th>
                    <th>Request #</th>
                    <th>Date</th>
                    <th>Repair Description</th>
                  </tr>
                </thead>
                <tbody>
                  {maintenanceLogs.map((log) => (
                    <tr key={log.MaintenanceLogs}>
                      <td><span className="log-tag">ML-{log.MaintenanceLogs}</span></td>
                      <td><span className="req-tag">REQ-{log.RequestID}</span></td>
                      <td>{formatDate(log.LogDate)}</td>
                      <td>
                        <div className="repair-description">
                          {log.RepairDescription}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      );
    }
    
    else if (activeView === 'buildings') {
      tableContent = (
        <>
          <h3 className="data-title">Building Management</h3>
          {isLoadingBuildings ? (
            <div className="loading-animation">
              <div className="loading-spinner"></div>
              <p>Loading buildings data...</p>
            </div>
          ) : buildingsError ? (
            <div className="error-message">{buildingsError}</div>
          ) : (
            <>
              <div className="buildings-summary">
                <div className="summary-stat">
                  <span className="stat-number">{buildings.length}</span>
                  <span>Total Buildings</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">
                    300
                  </span>
                  <span>Total Rooms</span>
                </div>
                <div className="summary-stat">
                  <span className="stat-number">
                    68
                  </span>
                  <span>Available</span>
                </div>
              </div>
              <div className="buildings-grid">
                {buildings.map((building) => (
                  <div className="building-card" key={building.DormBuildingID}>
                    <div className="building-header">
                      <h4>{building.BuildingName}</h4>
                      <span className="building-id">#{building.DormBuildingID}</span>
                    </div>
                    <div className="building-address">{building.Address}</div>
                    <div className="room-stats">
                      <div className="room-stat">
                        <span className="stat-label">Total:</span>
                        <span className="stat-value">{building.TotalRooms} rooms</span>
                      </div>
                      <div className="room-stat">
                        <span className="stat-label">Available:</span>
                        <span className="stat-value"> rooms</span>
                      </div>
                      <div className="occupancy-bar">
                        <div 
                          className="occupancy-fill" 
                          style={{
                            width: `${((building.TotalRooms - building.AvailableRooms) / building.TotalRooms) * 100}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      );
    }

    return (
      <div className="data-view-module">
        <div className="back-nav">
          <button className="back-button" onClick={() => setActiveView('dashboard')}>
            <span className="back-icon">←</span> Back to Dashboard
          </button>
        </div>
        <div className="data-container">
          {tableContent}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeView) {
      case 'dashboard':
        return renderDashboardContent();
      case 'maintenance':
        return renderMaintenanceView();
      case 'registration':
        return renderRegistrationView();
      case 'payments':
        return renderPaymentsView();
      case 'roomChange':
        return renderRoomChangeView();
      case 'userRegistration':
      case 'allPayments':
      case 'maintenanceLogs':
      case 'buildings':
        return renderDataTableView();
      default:
        return null;
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar 
        onDashboardClick={() => setActiveView('dashboard')}
        onMaintenanceRequestClick={() => setActiveView('maintenance')}
        onRegistrationClick={() => setActiveView('registration')}
        onPaymentsClick={() => setActiveView('payments')}
        onRoomChangeClick={() => setActiveView('roomChange')}
      />
      
      <div className="admin-content">
        <header className="admin-header">
          <h1 className="page-title">
            {activeView === 'dashboard' && 'Admin Console'}
            {activeView === 'maintenance' && 'Maintenance Request Center'}
            {activeView === 'registration' && 'Student Registration'}
            {activeView === 'payments' && 'Payment Processing'}
            {activeView === 'userRegistration' && 'Registration Records'}
            {activeView === 'allPayments' && 'Payment History'}
            {activeView === 'maintenanceLogs' && 'Maintenance Records'}
            {activeView === 'buildings' && 'Dormitory Buildings'}
            {activeView === 'roomChange' && 'Room Reassignment'}
          </h1>
        </header>
        
        <main className="admin-main">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;