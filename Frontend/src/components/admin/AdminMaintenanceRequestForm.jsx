import { useState } from 'react';
import './styles/MaintenanceRequestForm.css';

const MaintenanceRequestForm = ({ currentUser, onRequestSubmitted }) => {
  const [RequestDetails, setRequestDetails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!RequestDetails.trim()) {
      setError('Please describe the issue');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:3000/users/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          RequestDetails,
          UserID: currentUser.UserID, 
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit maintenance request');
      }
      
      const data = await response.json();
      setSuccess(data.message || 'Request Sent and logged');
      setRequestDetails('');
      
      if (onRequestSubmitted) {
        onRequestSubmitted();
      }
    } catch (err) {
      setError('Error submitting request: ' + err.message);
      console.error('Error submitting maintenance request:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="maintenance-card">
      <div className="card-header">
        <h3>Maintenance Request</h3>
      </div>
      
      <div className="card-body">
        {error && <div className="alert-error">{error}</div>}
        {success && <div className="alert-success">{success}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="input-container">
            <span className="input-label">User ID</span>
            <div className="input-field user">
              <input 
                type="text" 
                value={currentUser?.UserID || ''} 
                readOnly 
              />
            </div>
          </div>
          
          <div className="input-container">
            <span className="input-label">Issue Details</span>
            <div className="input-field textarea-field">
              <textarea 
                value={RequestDetails}
                onChange={(e) => setRequestDetails(e.target.value)}
                placeholder="Describe your maintenance issue..."
                required
              ></textarea>
            </div>
          </div>
          
          <div className="submit-container">
            <button 
              type="submit" 
              className={isSubmitting ? "submit-button loading" : "submit-button"}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceRequestForm;