import { useState, useEffect } from 'react';
import './styles/PersonalInformation.css';

const StudentPersonalInfo = ({ userData }) => {
  const [emergencyContact, setEmergencyContact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [personalInfo, setpersonalInfo] = useState(null);

  useEffect(() => {
    if (userData?.UserID) {
      fetchEmergencyContact(userData.UserID);
      fetchPersonalInfo(userData.UserID);
    }
  }, [userData]);

  const fetchEmergencyContact = async (userId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/user/emergency-contact/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency contact');
      }
      
      const data = await response.json();
      setEmergencyContact(data.contacts[0] || null);
    } catch (err) {
      setError('Error loading emergency contact: ' + err.message);
      console.error('Error fetching emergency contact:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPersonalInfo = async (userId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/user/registration/${userId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch emergency contact');
      }
      
      const data = await response.json();
      setpersonalInfo(data.data[0] || null);
    } catch (err) {
      setError('Error loading emergency contact: ' + err.message);
      console.error('Error fetching emergency contact:', err);
    } finally {
      setIsLoading(false);
    }
  };


  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="personal-info-container">
      <div className="personal-info-card">
        <div className="personal-info-header">
          <h3>Personal Information</h3>
        </div>
        <div className="personal-info-content">
          <div className="personal-info-grid">
            <div className="personal-info-section">
              <div className="info-item">
                <label>Student ID:</label>
                <span>{userData?.UserID || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Full Name:</label>
                <span>{userData?.UserName || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Email Address:</label>
                <span>{userData?.Email || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Contact Number:</label>
                <span>{userData?.ContactNumber || 'Not available'}</span>
              </div>
            </div>
            
            <div className="personal-info-section">
              <div className="info-item">
                <label>Registration ID:</label>
                <span>{personalInfo?.RegistrationID || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Room ID:</label>
                <span>{personalInfo?.RoomID || 'Not available'}</span>
              </div>
              <div className="info-item">
                <label>Start Date:</label>
                <span>{formatDate(personalInfo?.StartDate)}</span>
              </div>
              <div className="info-item">
                <label>End Date:</label>
                <span>{formatDate(personalInfo?.EndDate)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="personal-info-card">
        <div className="personal-info-header">
          <h3>Emergency Contact</h3>
        </div>
        <div className="personal-info-content">
          {isLoading ? (
            <div className="loading-text">Loading emergency contact...</div>
          ) : error ? (
            <div className="error-text">{error}</div>
          ) : emergencyContact ? (
            <div className="personal-info-grid">
              <div className="personal-info-section">
                <div className="info-item">
                  <label>Contact Name:</label>
                  <span>{emergencyContact.Name}</span>
                </div>
                <div className="info-item">
                  <label>Relationship:</label>
                  <span>{emergencyContact.Relationship}</span>
                </div>
              </div>
              
              <div className="personal-info-section">
                <div className="info-item">
                  <label>Phone Number:</label>
                  <span>{emergencyContact.ContactNumber}</span>
                </div>
                <div className="info-item">
                  <label>Email Address:</label>
                  <span>{emergencyContact.Email}</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-data-text">No emergency contact information available</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentPersonalInfo;