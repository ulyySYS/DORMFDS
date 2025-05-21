import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import './styles/StudentPayments.css';

const StudentPayments = () => {
  const { currentUser } = useAuth();
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Form state for new payment
  const [regisID, setRegisID] = useState('');
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentDate, setPaymentDate] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  // Fetch payment history when component mounts
  useEffect(() => {
    if (currentUser?.UserID) {
      fetchPaymentHistory(currentUser.UserID);
    }
  }, [currentUser]);

  const fetchPaymentHistory = async (userID) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`http://localhost:3000/user/billing/all-account-billings/${userID}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch payment history');
      }
      
      const data = await response.json();
      setPaymentHistory(data.payments || []);
    } catch (err) {
      setError('Error loading payment history: ' + err.message);
      console.error('Error fetching payment history:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitPayment = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);
    setSubmitError(null);
    
    if (!regisID || !paymentAmount || !paymentDate) {
      setSubmitError('Please fill all required fields');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:3000/user/billing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: currentUser.UserID,
          RegisID: regisID,
          Amount: paymentAmount,
          Date: paymentDate
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit payment');
      }
      
      setSubmitSuccess(true);
      setRegisID('');
      setPaymentAmount('');
      setPaymentDate('');
      
      // Refresh payment history
      if (currentUser?.UserID) {
        fetchPaymentHistory(currentUser.UserID);
      }
    } catch (err) {
      setSubmitError('Failed to submit payment: ' + err.message);
      console.error('Error submitting payment:', err);
    }
  };

  // Format date to a more readable format
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dorm-panel">
      <div className="dorm-panel-header">
        <h2>Dormitory Payments</h2>
        <p>Manage your billing and payments</p>
      </div>
      
      <div className="dorm-card-grid">
        <div className="dorm-card">
          <div className="dorm-card-header">
            <h3>Make Payment</h3>
          </div>
          <div className="dorm-card-content">
            <form onSubmit={handleSubmitPayment}>
              <div className="dorm-form-group">
                <label htmlFor="regisID">Registration ID*</label>
                <input
                  type="text"
                  id="regisID"
                  className="dorm-input"
                  placeholder="Enter Registration ID"
                  value={regisID}
                  onChange={(e) => setRegisID(e.target.value)}
                  required
                />
              </div>
              
              <div className="dorm-form-group">
                <label htmlFor="paymentAmount">Amount*</label>
                <input
                  type="number"
                  id="paymentAmount"
                  className="dorm-input"
                  placeholder="Enter amount"
                  value={paymentAmount}
                  onChange={(e) => setPaymentAmount(e.target.value)}
                  required
                />
              </div>
              
              <div className="dorm-form-group">
                <label htmlFor="paymentDate">Payment Date*</label>
                <input
                  type="date"
                  id="paymentDate"
                  className="dorm-input"
                  value={paymentDate}
                  onChange={(e) => setPaymentDate(e.target.value)}
                  required
                />
              </div>
              
              {submitSuccess && (
                <div className="dorm-success">
                  Payment submitted successfully!
                </div>
              )}
              
              {submitError && (
                <div className="dorm-error">
                  {submitError}
                </div>
              )}
              
              <button type="submit" className="dorm-submit-btn">
                Process Payment
              </button>
            </form>
          </div>
        </div>
        
        <div className="dorm-card dorm-full-width">
          <div className="dorm-card-header">
            <h3>Payment History</h3>
          </div>
          <div className="dorm-card-content">
            {isLoading ? (
              <div className="dorm-loading">Loading payment history...</div>
            ) : error ? (
              <div className="dorm-error">{error}</div>
            ) : paymentHistory.length === 0 ? (
              <div className="dorm-empty">No payment history found</div>
            ) : (
              <div className="dorm-requests-table">
                {paymentHistory.map((payment) => (
                  <div key={payment.PaymentID} className="dorm-payment-item">
                    <div className="dorm-payment-date">{formatDate(payment.PaymentDate)}</div>
                    <div className="dorm-payment-details">Payment ID: {payment.PaymentID}</div>
                    <div className="dorm-payment-amount">${payment.Amount}</div>
                    <div className="dorm-payment-meta">
                      <span>Registration ID: {payment.RegistrationID}</span>
                      <span>Admin: {payment.AdminName}</span>
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

export default StudentPayments;