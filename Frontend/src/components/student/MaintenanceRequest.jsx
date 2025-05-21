import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/MaintenanceRequest.css';

const MaintenanceRequest = () => {
  const { currentUser } = useAuth();
  const [requestDetails, setRequestDetails] = useState('');
  const [roomName, setRoomName] = useState('');
  const [maintenanceRequests, setMaintenanceRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (currentUser?.UserID) {
      fetchMaintenanceRequests(currentUser.UserID);
    }
  }, [currentUser]);

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
      console.log("maintenanceRequests", maintenanceRequests);
    } catch (err) {
      setError('Error loading requests: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);
    
    if (!requestDetails) {
      setSubmitError('Please fill all required fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/user/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: currentUser?.UserID,
          RequestDetails: requestDetails,
          RoomName: roomName
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit request');
      }
      
      setSubmitSuccess(true);
      setRequestDetails('');
      setRoomName('');
      
      if (currentUser?.UserID) {
        fetchMaintenanceRequests(currentUser.UserID);
      }
      
    } catch (err) {
      setSubmitError('Failed to submit request: ' + err.message);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="maintenance-container">      
      <div className="maintenance-content">
        <div className="maintenance-form-card">
          <div className="card-header">
            <h2>New Request</h2>
          </div>
          
          <form onSubmit={handleSubmitRequest}>
            
            <div className="input-field">
              <label htmlFor="requestDetails">Issue Description</label>
              <textarea
                id="requestDetails"
                value={requestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                rows={4}
                placeholder="Describe the maintenance issue in detail"
                required
              />
            </div>
            
            {submitSuccess && (
              <div className="success-alert">
                Your maintenance request has been submitted!
              </div>
            )}
            
            {submitError && (
              <div className="error-alert">
                {submitError}
              </div>
            )}
            
            <button type="submit" className="submit-button">
              Submit Request
            </button>
          </form>
        </div>
        
        <div className="maintenance-history-card">
          <div className="card-header">
            <h2>Request History</h2>
          </div>
          
          <div className="history-content">
            {isLoading ? (
              <div className="loading-state">
                <div className="loader"></div>
                <p>Loading maintenance requests...</p>
              </div>
            ) : error ? (
              <div className="error-state">
                <p>{error}</p>
              </div>
            ) : maintenanceRequests.length === 0 ? (
              <div className="empty-state">
                <p>No maintenance requests found</p>
              </div>
            ) : (
              <div className="request-list">
                {maintenanceRequests.map((request, index) => (
                  <div key={index} className="request-item">
                    <div className="request-room">
                      Your Room
                    </div>
                    <div className="request-description">
                      {request.RequestDetails}
                    </div>
                    <div className="request-footer">
                      <div className={`status-badge status-${request.Status?.toLowerCase()}`}>
                        {request.Status || "Pending"}
                      </div>
                      <div className="request-date">
                        {formatDate(request.Date)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceRequest;