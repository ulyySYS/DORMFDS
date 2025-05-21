import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const MaintenanceRequestForm = () => {
  const { currentUser } = useAuth();
  const [issue, setIssue] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState({ text: '', isError: false });
  const [userRequests, setUserRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user's maintenance requests
  const fetchUserRequests = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/users/all-user-requests/${currentUser.UserID}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch maintenance requests');
      }
      
      const data = await response.json();
      setUserRequests(data.requests || []);
    } catch (err) {
      setError('Unable to load maintenance requests. Please try again later.', err);

    } finally {
      setIsLoading(false);
    }
  };

  // Initial fetch of user requests
  useEffect(() => {
    if (currentUser?.UserID) {
      fetchUserRequests();
    }
  }, [currentUser?.UserID]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!issue.trim()) {
      setSubmitMessage({ text: 'Please describe the issue', isError: true });
      return;
    }
    
    setIsSubmitting(true);
    setSubmitMessage({ text: '', isError: false });
    console.log(currentUser)
    try {
      const response = await fetch('http://localhost:3000/users/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestDetails: issue,
          UserID: currentUser.UserID
        }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setSubmitMessage({ text: data.message || 'Request sent successfully!', isError: false });
        setIssue(''); // Clear the form
        
        // Refresh the requests list after successful submission
        fetchUserRequests();
      } else {
        throw new Error(data.message || 'Something went wrong');
      }
    } catch (error) {
      setSubmitMessage({ text: error.message || 'Failed to send request', isError: true });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status badge class based on status
  const getStatusBadgeClass = (status) => {
    switch(status) {
      case 'fixed':
        return 'status-badge-fixed';
      case 'in_progress':
        return 'status-badge-progress';
      case 'not_fixed':
      default:
        return 'status-badge-pending';
    }
  };

  // Get human-readable status text
  const getStatusText = (status) => {
    switch(status) {
      case 'fixed':
        return 'Fixed';
      case 'in_progress':
        return 'In Progress';
      case 'not_fixed':
      default:
        return 'Pending';
    }
  };

  return (
    <div className="maintenance-section">
      <div className="maintenance-form-container">
        <h3 className="form-title">Submit a Maintenance Request</h3>
        
        <form className="maintenance-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="issue">Describe the Issue:</label>
            <textarea
              id="issue"
              className="issue-textarea"
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="Please describe your maintenance issue in detail..."
              rows={6}
              required
            />
          </div>
          
          {submitMessage.text && (
            <div className={`submit-message ${submitMessage.isError ? 'error' : 'success'}`}>
              {submitMessage.text}
            </div>
          )}
          
          <button 
            type="submit" 
            className="submit-btn"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Request'}
          </button>
        </form>
      </div>
      
      <div className="maintenance-history-container">
        <h3 className="history-title">Your Maintenance Request History</h3>
        
        {isLoading ? (
          <div className="loading-indicator">Loading your maintenance requests...</div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : userRequests.length === 0 ? (
          <div className="no-requests">You haven't submitted any maintenance requests yet.</div>
        ) : (
          <div className="requests-list">
            {userRequests.map((request, index) => (
              <div key={index} className="request-item">
                <div className="request-header">
                  <span className={`status-badge ${getStatusBadgeClass(request.Status)}`}>
                    {getStatusText(request.Status)}
                  </span>
                  <span className="request-date">{formatDate(request.Date)}</span>
                </div>
                <div className="request-issue">{request.RequestDetails}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequestForm;