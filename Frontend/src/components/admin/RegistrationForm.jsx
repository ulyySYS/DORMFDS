
import { useState, useEffect } from 'react';

const RegistrationForm = ({ currentUser }) => {
  console.log('RegistrationForm mounted with currentUser:', currentUser);
  const [rooms, setRooms] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlError, setSqlError] = useState(null);
  const [success, setSuccess] = useState(null);

  let loginData = null;

  // Form fields
  const [formData, setFormData] = useState({
    username: '',
    role: 'Student', // Default role
    contactNumber: '',
    email: '',
    password: '',
    roomId: '',
    startDate: '',
    endDate: ''
  });

  // Fetch rooms when component mounts
  useEffect(() => {
    fetchRooms();
  }, []);

  // Function to fetch rooms
  const fetchRooms = async () => {
    setIsLoading(true);
    setError(null);
    setSqlError(null);

    try {
      const response = await fetch('http://localhost:3000/admin/rooms/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch rooms');
      }
      
      const data = await response.json();
      setRooms(data.rooms || []);
    } catch (err) {
      setError('Error fetching rooms: ' + err.message);
      console.error('Error fetching rooms:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSqlError(null);
    setSuccess(null);

    try {
      // First API call - Create user
      console.log('Form user', formData);
      
      // Debugging: print the exact payload being sent
      const userPayload = {
        username: formData.username,
        role: formData.role,
        ContactNumber: formData.contactNumber,
        Email: formData.email,
        Password: formData.password
      };
      console.log('Sending user payload:', userPayload);
      
      const createUserResponse = await fetch('http://localhost:3000/admin/account/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userPayload)
      });
      
      // Log the raw response for debugging
      console.log('Raw response status:', createUserResponse.status);
      
      // Parse the response data
      const responseData = await createUserResponse.json();
      console.log('Response data:', responseData);
      
      // Expanded SQL error detection
      if (
        responseData.sqlMessage || 
        responseData.code === 'ER_DUP_ENTRY' ||
        responseData.error?.includes('SQL') ||
        responseData.message?.includes('duplicate')
      ) {
        const errorMessage = responseData.sqlMessage || 
                            responseData.message || 
                            responseData.error || 
                            'Database error occurred';
        
        console.log('SQL Error detected:', errorMessage);
        setSqlError(errorMessage);
        setIsLoading(false);
        return; 
      }
      

      if (!createUserResponse.ok) {
        throw new Error('Failed to create user: ' + (responseData.message || 'Unknown error'));
      }
      
      // Check if we have the expected data structure
      if (!responseData.userInfo || !responseData.userInfo.UserID) {
        console.error('Missing user info in response:', responseData);
        throw new Error('Invalid response from server: missing user information');
      }
      
      loginData = responseData;
      console.log('User created successfully:', loginData);

      // Third API call - Add registration
      const registrationPayload = {
        UserID: loginData.userInfo.UserID,
        RoomID: formData.roomId,
        StartDate: formData.startDate,
        EndDate: formData.endDate,
      };
      
      console.log('Sending registration payload:', registrationPayload);
      
      const addRegistrationResponse = await fetch('http://localhost:3000/admin/housing/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationPayload)
      });
      
      const registrationResponseData = await addRegistrationResponse.json();
      console.log('Registration response:', registrationResponseData);
      
      if (!addRegistrationResponse.ok) {
        throw new Error('Failed to add registration: ' + (registrationResponseData.message || 'Unknown error'));
      }
      
      // Reset form and show success message
      setFormData({
        username: '',
        role: 'Student',
        contactNumber: '',
        email: '',
        password: '',
        roomId: '',
        startDate: '',
        endDate: ''
      });
      
      setSuccess('User registration completed successfully!');
      
    } catch (err) {
      console.error('Error during registration:', err);
      setError('Error during registration: ' + err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Add debug logs for state changes
  useEffect(() => {
    console.log('Current state:', { 
      sqlError, 
      error, 
      success, 
      isLoading,
      formData
    });
  }, [sqlError, error, success, isLoading, formData]);

  return (
    <div className="registration-container">
      <div className="registration-rooms-container">
        <h4 className="registration-section-title">Available Rooms</h4>
        {isLoading && !rooms.length ? (
          <p className="registration-loading">Loading rooms...</p>
        ) : error ? (
          <p className="registration-error">{error}</p>
        ) : (
          <div className="registration-rooms-list">
            <table className="registration-rooms-table">
              <thead>
                <tr>
                  <th>Dorm Building ID</th>
                  <th>Room ID</th>
                  <th>Occupied</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rooms.map((room) => (
                  <tr
                    key={room.RoomID}
                    className={formData.roomId === room.RoomID.toString() ? 'registration-selected-room' : ''}
                    onClick={() => setFormData({...formData, roomId: room.RoomID.toString()})}
                  >
                    <td>{room.DormBuildingID}</td>
                    <td>{room.RoomID}</td>
                    <td>{!room.Occupied ? 'Not Occupied' : 'Occupied'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="registration-form-container">
        <h4 className="registration-section-title">User Registration Form</h4>
        {success && <p className="registration-success">{success}</p>}
        {error && <p className="register-error-message">{error}</p>}
        
        {/* SQL Error display */}
        {sqlError && (
          <div 
            className="register-error-container" 
            style={{
              border: '2px solid #ff0000',
              backgroundColor: '#ffdddd',
              padding: '15px',
              borderRadius: '4px',
              marginBottom: '20px',
              display: 'block',
              color: '#ff0000',
              fontSize: '14px',
              boxShadow: '0 0 5px rgba(255,0,0,0.3)'
            }}
          >
            <p 
              className="register-error-title" 
              style={{ 
                fontWeight: 'bold', 
                color: '#ff0000', 
                margin: '0 0 5px 0',
                fontSize: '16px'
              }}
            >
              Database Error:
            </p>
            <p 
              className="register-error-sql" 
              style={{ 
                margin: '0', 
                color: '#ff0000',
                wordBreak: 'break-word'
              }}
            >
              {sqlError || "Unknown database error occurred"}
            </p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="registration-form">
          <div className="registration-form-group">
            <label className="registration-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="registration-input"
              required
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="registration-select"
              required
            >
              <option value="Student">Student</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Contact Number</label>
            <input
              type="text"
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              className="registration-input"
              required
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`registration-input ${sqlError ? 'register-error-field' : ''}`}
              required
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="registration-input"
              required
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Selected Room ID</label>
            <input
              type="text"
              name="roomId"
              value={formData.roomId}
              onChange={handleChange}
              className="registration-input"
              required
              readOnly
              placeholder="Click on a room from the list"
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="registration-input"
              required
            />
          </div>
          
          <div className="registration-form-group">
            <label className="registration-label">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="registration-input"
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="registration-submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Processing...' : 'Register User'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;