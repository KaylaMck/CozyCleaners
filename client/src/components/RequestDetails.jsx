// RequestDetails.jsx (updated with service editing)
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export default function RequestDetails() {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editDate, setEditDate] = useState('');
  const [editTimeSlotId, setEditTimeSlotId] = useState('');
  const [editAddressId, setEditAddressId] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [addresses, setAddresses] = useState([]);
  
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchRequestDetails = async () => {
      try {
        // Fetch the current request
        const response = await fetch(`/api/CleaningRequests/${id}`);
        if (!response.ok) {
          setError('Failed to load request details');
          return;
        }
        
        const data = await response.json();
        setRequest(data);
        
        // Initialize edit form values
        setEditDate(new Date(data.date).toISOString().split('T')[0]);
        
        // Set initially selected services
        setSelectedServices(data.services.map(service => service.id));
        
        // Fetch additional data needed for editing
        const [timeSlotsResponse, addressesResponse, servicesResponse] = await Promise.all([
          fetch('/api/TimeSlots'),
          fetch('/api/UserAddresses'),
          fetch('/api/Services')
        ]);
        
        if (!timeSlotsResponse.ok || !addressesResponse.ok || !servicesResponse.ok) {
          setError('Failed to load form data');
          return;
        }
        
        const timeSlotsData = await timeSlotsResponse.json();
        const addressesData = await addressesResponse.json();
        const servicesData = await servicesResponse.json();
        
        setTimeSlots(timeSlotsData);
        setAddresses(addressesData);
        setAllServices(servicesData);
        
        // Find the current timeSlot and address IDs
        const currentTimeSlot = timeSlotsData.find(ts => ts.displayTime.includes(data.timeSlot));
        const currentAddressComponents = data.address.split(', ');
        const currentAddress = addressesData.find(addr => 
          addr.street === currentAddressComponents[0] && 
          addr.city === currentAddressComponents[1].split(', ')[0]
        );
        
        if (currentTimeSlot) setEditTimeSlotId(currentTimeSlot.id);
        if (currentAddress) setEditAddressId(currentAddress.id);
        
      } catch (error) {
        console.error('Error fetching request details:', error);
        setError('An error occurred while loading the request details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRequestDetails();
  }, [id]);
  
  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this cleaning request?')) {
      try {
        const response = await fetch(`/api/CleaningRequests/${id}/cancel`, {
          method: 'PUT'
        });
        
        if (response.ok) {
          navigate('/');
        } else {
          setError('Failed to cancel request');
        }
      } catch (error) {
        console.error('Error cancelling request:', error);
        setError('An error occurred while cancelling the request');
      }
    }
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };
  
  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };
  
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }
    
    try {
      const updateData = {
        date: editDate,
        timeSlotId: parseInt(editTimeSlotId),
        addressId: parseInt(editAddressId),
        serviceIds: selectedServices.map(id => parseInt(id))
      };
      
      const response = await fetch(`/api/CleaningRequests/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      });
      
      if (response.ok) {
        // Use a fresh GET request to get the updated data with recalculated price
        const updatedResponse = await fetch(`/api/CleaningRequests/${id}`);
        if (updatedResponse.ok) {
          const updatedData = await updatedResponse.json();
          setRequest(updatedData);
          setIsEditing(false);
          
          // Make sure to update the total price in the UI
          console.log('Updated request with new price:', updatedData.totalPrice);
        } else {
          setError('Failed to refresh request data');
        }
      } else {
        const errorText = await response.text();
        console.error('Server error:', errorText);
        setError('Failed to update request');
      }
    } catch (error) {
      console.error('Error updating request:', error);
      setError('An error occurred while updating the request');
    }
  };
  
  const cancelEdit = () => {
    setIsEditing(false);
    // Reset form values
    if (request) {
      setEditDate(new Date(request.date).toISOString().split('T')[0]);
      setSelectedServices(request.services.map(service => service.id));
      
      const currentTimeSlot = timeSlots.find(ts => ts.displayTime.includes(request.timeSlot));
      if (currentTimeSlot) setEditTimeSlotId(currentTimeSlot.id);
      
      const currentAddressComponents = request.address.split(', ');
      const currentAddress = addresses.find(addr => 
        addr.street === currentAddressComponents[0] && 
        addr.city === currentAddressComponents[1].split(', ')[0]
      );
      if (currentAddress) setEditAddressId(currentAddress.id);
    }
  };
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  if (!request) {
    return <div>Request not found</div>;
  }
  
  return (
    <div className="container">
      <h2 className="mb-4">Request Details</h2>
      
      {isEditing ? (
        // Edit Form
        <div className="card mb-4">
          <div className="card-body">
            <form onSubmit={handleSaveEdit}>
              <div className="mb-3">
                <label htmlFor="editDate" className="form-label">Date</label>
                <input
                  type="date"
                  className="form-control"
                  id="editDate"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="mb-3">
                <label htmlFor="editTimeSlot" className="form-label">Time Slot</label>
                <select
                  className="form-select"
                  id="editTimeSlot"
                  value={editTimeSlotId}
                  onChange={(e) => setEditTimeSlotId(e.target.value)}
                  required
                >
                  {timeSlots.map(slot => (
                    <option key={slot.id} value={slot.id}>
                      {slot.displayTime}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label htmlFor="editAddress" className="form-label">Address</label>
                <select
                  className="form-select"
                  id="editAddress"
                  value={editAddressId}
                  onChange={(e) => setEditAddressId(e.target.value)}
                  required
                >
                  {addresses.map(address => (
                    <option key={address.id} value={address.id}>
                      {address.street}, {address.city}, {address.state} {address.zipCode}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="mb-3">
                <label className="form-label">Services</label>
                {allServices.map(service => (
                  <div key={service.id} className="form-check mb-2">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id={`service-${service.id}`}
                      checked={selectedServices.includes(service.id)}
                      onChange={() => handleServiceToggle(service.id)}
                    />
                    <label className="form-check-label" htmlFor={`service-${service.id}`}>
                      <strong>{service.name}</strong> - ${service.price.toFixed(2)}
                      <p className="text-muted mb-0">{service.description}</p>
                    </label>
                  </div>
                ))}
                {selectedServices.length === 0 && (
                  <div className="text-danger">Please select at least one service</div>
                )}
              </div>
              
              <div className="d-flex justify-content-between">
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  disabled={selectedServices.length === 0}
                >
                  Save Changes
                </button>
                <button type="button" className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // Display Request Details
        <div className="card mb-4">
          <div className="card-body">
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Date:</div>
              <div className="col-md-9">{new Date(request.date).toLocaleDateString()}</div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Time Slot:</div>
              <div className="col-md-9">{request.timeSlot}</div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Address:</div>
              <div className="col-md-9">{request.address}</div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Status:</div>
              <div className="col-md-9">{request.status}</div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Services:</div>
              <div className="col-md-9">
                <ul className="list-group">
                  {request.services.map(service => (
                    <li key={service.id} className="list-group-item">
                      <div className="fw-bold">{service.name}</div>
                      <div className="text-muted">{service.description}</div>
                      <div className="text-end">${service.price.toFixed(2)}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            <div className="row mb-3">
              <div className="col-md-3 fw-bold">Total Price:</div>
              <div className="col-md-9">${request.totalPrice.toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}
      
      {request.status === "Scheduled" && !isEditing && (
        <div className="d-flex justify-content-between">
          <div>
            <button className="btn btn-primary me-2" onClick={handleEdit}>
              Edit Request
            </button>
            <button className="btn btn-danger" onClick={handleCancel}>
              Cancel Request
            </button>
          </div>
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      )}
      
      {(request.status !== "Scheduled" || isEditing) && (
        <div className="text-center">
          <Link to="/" className="btn btn-secondary">
            Back to Dashboard
          </Link>
        </div>
      )}
    </div>
  );
}