import { useState, useEffect } from 'react';
import './styles/MaintenanceLog.css';

const MaintenanceLogForm = ({ selectedRequest, onLogSubmitted, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isFixed, setIsFixed] = useState(false);
  
  useEffect(() => {
    if (selectedRequest && (
      selectedRequest.Status === 'Fixed' || 
      selectedRequest.IsFixed === true ||
      selectedRequest.Status === 'Completed'
    )) {
      setIsFixed(true);
      setError('This maintenance request is already fixed.');
    } else {
      setIsFixed(false);
      setError(null);
    }
  }, [selectedRequest]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isFixed) {
      setError('This maintenance request is already fixed. No new logs can be added.');
      return;
    }
    
    const logDescription = e.target.logDescription.value;
    
    if (!logDescription.trim()) {
      setError('Please enter a log description');
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const response = await fetch('http://localhost:3000/admin/add-maintenance-log', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requestId: selectedRequest.RequestID, 
          FixDetails: logDescription
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        const sqlMessage = errorData?.err?.sqlMessage || 'Unknown server error';
        throw new Error(`${sqlMessage}`);
      }
      
      setSuccess('Maintenance log added successfully');
      e.target.reset();
      
      if (onLogSubmitted) {
        setTimeout(() => {
          onLogSubmitted();
        }, 1500); 
      }
    } catch (err) {
      setError('Error adding maintenance log: ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="maintenance-card">
      <div className="maintenance-header">
        <h3>Maintenance Record</h3>
        <button 
          type="button" 
          className="close-button" 
          onClick={onClose}
          aria-label="Close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      
      <div className="maintenance-body">
        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        
        <form className="maintenance-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <div className="input-group">
              <div className="input-label">Request ID</div>
              <input 
                type="text" 
                id="requestId" 
                value={selectedRequest.RequestID} 
                readOnly 
                className="input-field userid" 
              />
            </div>
          </div>
    
          {isFixed ? (
            <div className="fixed-notice">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM11 15H9V13H11V15ZM11 11H9V5H11V11Z" fill="currentColor"/>
              </svg>
              <span>This request has been resolved. No new entries can be added.</span>
            </div>
          ) : (
            <div className="form-group">
              <div className="input-group">
                <div className="input-label">Maintenance Details</div>
                <textarea 
                  id="logDescription" 
                  className="textarea-field" 
                  rows="4" 
                  placeholder="Enter details about the maintenance work performed..." 
                  required
                  disabled={isFixed}
                ></textarea>
              </div>
            </div>
          )}
          
          <div className="button-container">
            <button 
              type="submit" 
              className={`submit-button ${isFixed || isSubmitting ? 'disabled' : ''}`}
              disabled={isSubmitting || isFixed}
            >
              {isSubmitting ? 'Processing...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceLogForm;