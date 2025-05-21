import { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/RoomChange.css';

const RoomChange = () => {
  const [registrationID, setRegistrationID] = useState('');
  const [newRoomID, setNewRoomID] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
    console.log("1222222222222222222222222222222222")
  useEffect(() => {
    fetchRegistrations();
    console.log("hellowwwwwwwwwwwwwwwwwwwwwwwwwwwwwww")
  }, []);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:3000/admin/housing/all');
      setRegistrations(response.data.allRegistrations);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch registrations');
      setLoading(false);
      console.error('Error fetching registrations:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!registrationID || !newRoomID) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.put('http://localhost:3000/admin/room-change', {
        RegisID: registrationID,
        newRoomID: newRoomID
      });
      
      setSuccess('Room changed successfully!', response);
      setError('');
      setRegistrationID('');
      setNewRoomID('');
      fetchRegistrations(); // Refresh the list
      setLoading(false);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to change room');
      setLoading(false);
      console.error('Error changing room:', err);
    }
  };

  return (
    <div className="room-change-container">
      <div className="room-change-form-section">
        <div className="room-change-card">
          <h2>Room Change Request</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit} className="room-change-form">
            <div className="form-group">
              <label htmlFor="registrationID">Registration ID</label>
              <input
                type="number"
                id="registrationID"
                value={registrationID}
                onChange={(e) => setRegistrationID(e.target.value)}
                placeholder="Enter Registration ID"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newRoomID">New Room ID</label>
              <input
                type="number"
                id="newRoomID"
                value={newRoomID}
                onChange={(e) => setNewRoomID(e.target.value)}
                placeholder="Enter New Room ID"
              />
            </div>
            
            <button 
              type="submit" 
              className="submit-btn"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Submit Room Change'}
            </button>
          </form>
        </div>
      </div>
      
      <div className="room-change-list-section">
        <div className="room-change-card registration-list">
          <h2>Current Registrations</h2>
          {loading && <p className="loading-text">Loading...</p>}
          
          {registrations.length > 0 ? (
            <div className="registrations-table-container">
              <table className="registrations-table">
                <thead>
                  <tr>
                    <th>Registration ID</th>
                    <th>User ID</th>
                    <th>Room ID</th>
                    <th>Username</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((reg) => (
                    <tr key={reg.RegistrationID} onClick={() => setRegistrationID(reg.RegistrationID)}>
                      <td>{reg.RegistrationID}</td>
                      <td>{reg.UserID}</td>
                      <td>{reg.RoomID}</td>
                      <td>{reg.UserName}</td>
                      <td>{reg.Email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="no-registrations">No registrations found</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomChange;