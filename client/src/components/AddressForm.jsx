// Modify your existing AddressForm.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';

export default function AddressForm() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { id } = useParams(); // Get ID from URL if editing
  const navigate = useNavigate();
  const isEditing = !!id;  // Check if we're editing an existing address
  
  useEffect(() => {
    // If we're editing, fetch the address data
    if (isEditing) {
      setLoading(true);
      const fetchAddress = async () => {
        try {
          const response = await fetch(`/api/UserAddresses/${id}`);
          if (response.ok) {
            const data = await response.json();
            setStreet(data.street);
            setCity(data.city);
            setState(data.state);
            setZipCode(data.zipCode);
          } else {
            setError('Failed to load address');
          }
        } catch (error) {
          console.error('Error fetching address:', error);
          setError('An error occurred while loading the address');
        } finally {
          setLoading(false);
        }
      };
      
      fetchAddress();
    }
  }, [id, isEditing]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const addressData = {
        street,
        city,
        state,
        zipCode
      };
      
      // Add ID if editing
      if (isEditing) {
        addressData.id = parseInt(id);
      }
      
      const url = isEditing ? `/api/UserAddresses/${id}` : '/api/UserAddresses';
      const method = isEditing ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(addressData)
      });
      
      if (response.ok) {
        navigate('/profile');
      } else {
        setError(`Failed to ${isEditing ? 'update' : 'add'} address`);
      }
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} address:`, error);
      setError(`An error occurred while ${isEditing ? 'updating' : 'adding'} your address`);
    }
  };
  
  if (loading) {
    return <div>Loading address information...</div>;
  }
  
  return (
    <div className="container">
      <h2 className="mb-4">{isEditing ? 'Edit' : 'Add New'} Address</h2>
      
      {error && <Alert color="danger">{error}</Alert>}
      
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="street">Street Address</Label>
          <Input
            type="text"
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label for="city">City</Label>
          <Input
            type="text"
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label for="state">State</Label>
          <Input
            type="text"
            id="state"
            value={state}
            onChange={(e) => setState(e.target.value)}
            required
          />
        </FormGroup>
        
        <FormGroup>
          <Label for="zipCode">Zip Code</Label>
          <Input
            type="text"
            id="zipCode"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            required
          />
        </FormGroup>
        
        <div className="d-flex">
          <Button type="submit" color="primary" className="me-2">
            {isEditing ? 'Save Changes' : 'Add Address'}
          </Button>
          <Link to="/profile" className="btn btn-secondary">
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  );
}