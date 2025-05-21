import React from 'react';
import './styles/MaintenanceRequestList.css';

const MaintenanceRequestList = ({ requests, onSelectRequest, selectedRequest }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    }).format(date);
  };

  return (
    <div className="request-list-container">
      <div className="request-list-header">
        <h3>Maintenance Dashboard</h3>
        <div className="request-list-counter">{requests.length} Requests</div>
      </div>
      
      {requests.length === 0 ? (
        <div className="request-list-empty">
          <div className="request-list-empty-icon">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 7L12 13L21 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <p>No maintenance requests found</p>
          <span>New requests will appear here</span>
        </div>
      ) : (
        <div className="request-list-grid">
          {requests.map((request) => (
            <div 
              key={`${request.RoomID}-${request.UserID}-${request.Date}`}
              className={`request-list-item ${selectedRequest && selectedRequest.RoomID === request.RoomID ? 'request-list-selected' : ''}`}
              onClick={() => onSelectRequest(request)}
            >
              <div className="request-list-item-header">
                <div className="request-list-room-badge">Room {request.RoomName}</div>
                <div className={`request-list-status ${request.Status === 'fixed' ? 'request-list-fixed' : 'request-list-pending'}`}>
                  {request.Status === 'fixed' ? 'Resolved' : 'Pending'}
                </div>
              </div>
              
              <div className="request-list-item-body">
                <h4 className="request-list-issue-title">Maintenance Issue</h4>
                <p className="request-list-issue-description">{request.RequestDetails}</p>
              </div>
              
              <div className="request-list-item-footer">
                <div className="request-list-meta">
                  <div className="request-list-meta-item request-list-reporter">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{request.Username}</span>
                  </div>
                  <div className="request-list-meta-item request-list-date">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    <span>{formatDate(request.Date)}</span>
                  </div>
                </div>
                
                <button className="request-list-view-btn">
                  View Details
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MaintenanceRequestList;