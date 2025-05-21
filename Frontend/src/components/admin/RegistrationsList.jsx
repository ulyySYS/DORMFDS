import React from 'react';
import './styles/RegistrationTable.css';

const RegistrationTable = ({ registrations, selectedId, onSelectRegistration }) => {
  return (
    <div className="registrations-container">
      <div className="table-header">
        <h2>Resident Directory</h2>
        <p>Select a resident to process payment</p>
      </div>
      
      <div className="table-wrapper">
        <table className="residents-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Resident Name</th>
              <th>Email</th>
            </tr>
          </thead>
          <tbody>
            {registrations && registrations.length > 0 ? (
              registrations.map((registration) => (
                <tr
                  key={registration.RegistrationID}
                  onClick={() => onSelectRegistration(registration)}
                  className={selectedId === registration.RegistrationID ? 'selected' : ''}
                >
                  <td>{registration.RegistrationID}</td>
                  <td>{registration.UserName}</td>
                  <td>{registration.Email}</td>
                </tr>
              ))
            ) : (
              <tr className="empty-row">
                <td colSpan="3">
                  <div className="empty-state">
                    <div className="empty-icon">📋</div>
                    <p>No residents found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-info">
        Click on a resident row to select for payment
      </div>
    </div>
  );
};

export default RegistrationTable;