import { useState } from 'react';
import { loginUser } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser(email, password);
      
      if (response.message === "Login Successful") {
        login(response.userInfo[0]);
      } else {
        setError('Wrong credentials');
      }
    } catch (error) {
      setError('An error occurred. Please try again.', error);
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Dormitory Access</h1>
          <p>Enter your credentials to continue</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Email Address"
            />
          </div>
          
          <div className="input-group">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'PROCESSING...' : 'LOGIN'}
          </button>
        </form>
        
        <div className="login-footer">
          <span className="footer-text">Dormitory Management System</span>
        </div>
      </div>
    </div>
  );
};

export default Login;