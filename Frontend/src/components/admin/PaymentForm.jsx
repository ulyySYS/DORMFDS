import React, { useState, useEffect } from 'react';
import RegistrationTable from './RegistrationsList';
import './styles/PaymentForm.css';

const PaymentForm = ({  onPaymentSubmitted }) => {
  const [registrations, setRegistrations] = useState([]);
  const [selectedRegistration, setSelectedRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const [formData, setFormData] = useState({
    RegisID: '',
    Amount: '',
    Date: new Date().toISOString().split('T')[0]
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    fetchRegistrations();
  }, []);

  useEffect(() => {
    if (selectedRegistration) {
      setFormData(prev => ({
        ...prev,
        RegisID: selectedRegistration.RegistrationID
      }));
    }
  }, [selectedRegistration]);

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3000/admin/housing/all');
      
      if (!response.ok) {
        throw new Error('Failed to fetch registrations');
      }
      
      const data = await response.json();
      setRegistrations(data.allRegistrations || []);
    } catch (err) {
      setLoadError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRegistration = (registration) => {
    setSelectedRegistration(registration);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
 
    if (submitError) setSubmitError(null);
    if (submitSuccess) setSubmitSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch('http://localhost:3000/admin/billing/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          UserID: 1, // Hardcoded admin ID
          RegisID: parseInt(formData.RegisID),
          Amount: parseFloat(formData.Amount), // Fixed typo: was "Amountmount"
          Date: formData.Date
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create payment');
      }

      await response.json();
      
      setSubmitSuccess(true);
      setFormData(prev => ({
        ...prev,
        RegisID: '',
        Amount: '',
        Date: new Date().toISOString().split('T')[0]
      }));

      setSelectedRegistration(null);
      
      if (onPaymentSubmitted) onPaymentSubmitted();

      setTimeout(() => {
        setSubmitSuccess(false);
      }, 3000);

    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="dorm-payment-system">
      <div className="header-container">
        <h1>Dorm Payment Portal</h1>
        <p>Process resident payments efficiently</p>
      </div>
      
      <div className="content-container">
        {loading ? (
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading resident data...</p>
          </div>
        ) : loadError ? (
          <div className="error-state">
            <div className="error-icon">!</div>
            <p>{loadError}</p>
            <button onClick={fetchRegistrations} className="retry-button">Retry</button>
          </div>
        ) : (
          <div className="payment-layout">
            <div className="payment-section">
              <div className="card">
                <div className="card-header">
                  <h2>Process Payment</h2>
                </div>
                
                {selectedRegistration && (
                  <div className="selected-resident">
                    <div className="resident-badge">
                      <span className="resident-name">{selectedRegistration.UserName}</span>
                      <span className="resident-id">ID: {selectedRegistration.RegistrationID}</span>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="payment-form">
                  <div className="form-group">
                    <label htmlFor="RegisID">Registration ID</label>
                    <input
                      type="number"
                      id="RegisID"
                      name="RegisID"
                      value={formData.RegisID}
                      onChange={handleInputChange}
                      required
                      placeholder="Select a resident or enter ID"
                      className="form-input"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="Amount">Payment Amount</label>
                    <div className="amount-wrapper">
                      <span className="currency-symbol"></span>
                      <input
                        type="number"
                        id="Amount"
                        name="Amount"
                        value={formData.Amount}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                        placeholder="0.00"
                        className="form-input amount-input"
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="Date">Payment Date</label>
                    <input
                      type="date"
                      id="Date"
                      name="Date"
                      value={formData.Date}
                      onChange={handleInputChange}
                      required
                      className="form-input"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="UserID">Admin ID</label>
                    <input
                      type="number"
                      id="UserID"
                      name="UserID"
                      value="1"
                      readOnly
                      disabled
                      className="form-input readonly"
                    />
                    <small className="input-help">Auto-assigned from your account</small>
                  </div>

                  {submitError && (
                    <div className="notification error">
                      <span className="icon">⚠️</span>
                      <p>{submitError}</p>
                    </div>
                  )}

                  {submitSuccess && (
                    <div className="notification success">
                      <span className="icon">✓</span>
                      <p>Payment successfully processed!</p>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    className="submit-button"
                    disabled={!formData.RegisID || !formData.Amount }
                  >
                    {isSubmitting ? (
                      <>
                        <span className="button-spinner"></span>
                        Processing...
                      </>
                    ) : 'Submit Payment'}
                  </button>
                </form>
              </div>
            </div>
            
            <div className="residents-section">
              <RegistrationTable 
                registrations={registrations} 
                selectedId={selectedRegistration?.RegistrationID}
                onSelectRegistration={handleSelectRegistration}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;