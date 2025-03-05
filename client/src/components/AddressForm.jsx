// AddressForm.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AddressForm() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const addressData = {
        street,
        city,
        state,
        zipCode
      };
      
      const response = await fetch('/api/UserAddresses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
      
      if (response.ok) {
        // Redirect to booking page or wherever you want
        navigate('/book');
      } else {
        setError('Failed to add address');
      }
    } catch (error) {
      console.error('Error adding address:', error);
      setError('An error occurred while adding your address');
    }
  };
  
  return (
    <div className="container">
      <h2 className="mb-4">Add New Address</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="street" className="form-label">Street Address</label>
          <input
            type="text"
            className="form-control"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="city" className="form-label">City</label>
          <input
            type="text"
            className="form-control"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="state" className="form-label">State</label>
          <input
            type="text"
            className="form-control"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </div>
        
        <div className="mb-3">
          <label htmlFor="zipCode" className="form-label">Zip Code</label>
          <input
            type="text"
            className="form-control"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn-primary">Add Address</button>
      </form>
    </div>
  );
}