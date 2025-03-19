import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function BookingForm() {
  const [date, setDate] = useState("");
  const [timeSlotId, setTimeSlotId] = useState("");
  const [addressId, setAddressId] = useState("");
  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  // Fetch initial data (services, time slots, addresses)
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get services
        const servicesResponse = await fetch("/api/Services");
        if (servicesResponse.ok) {
          const servicesData = await servicesResponse.json();
          setServices(servicesData);
        }

        // Get time slots
        const timeSlotsResponse = await fetch("/api/TimeSlots");
        if (timeSlotsResponse.ok) {
          const timeSlotsData = await timeSlotsResponse.json();
          setTimeSlots(timeSlotsData);
          if (timeSlotsData.length > 0) {
            setTimeSlotId(timeSlotsData[0].id);
          }
        }

        // Get user addresses
        const addressesResponse = await fetch("/api/UserAddresses");
        if (addressesResponse.ok) {
          const addressesData = await addressesResponse.json();
          setAddresses(addressesData);
          if (addressesData.length > 0) {
            setAddressId(addressesData[0].id);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        setError("Failed to load form data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle service selection
  const handleServiceToggle = (serviceId) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

 // Update the handleSubmit function in BookingForm.jsx
const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!date) {
      setError('Please select a date');
      return;
    }
    
    if (selectedServices.length === 0) {
      setError('Please select at least one service');
      return;
    }
  
    try {
      // Add console.log to see what we're sending
      const requestData = {
        date: date,
        timeSlotId: parseInt(timeSlotId),
        addressId: parseInt(addressId),
        services: selectedServices.map(id => ({
          id: parseInt(id)
        }))
      };
      
      console.log("Sending data:", requestData);
  
      const response = await fetch('/api/CleaningRequests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });
  
      if (response.ok) {
        // Redirect to dashboard or confirmation page
        navigate('/');
      } else {
        // Log more details about the error
        const errorText = await response.text();
        console.error('Server error response:', errorText);
        setError('Failed to create cleaning request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      setError('Failed to submit request');
    }
  };

  return (
    <div className="container">
      <h2 className="mb-4">Book a Cleaning</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="date" className="form-label">
            Date
          </label>
          <input
            type="date"
            className="form-control"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            min={new Date().toISOString().split("T")[0]}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="timeSlot" className="form-label">
            Time Slot
          </label>
          <select
            className="form-select"
            id="timeSlot"
            value={timeSlotId}
            onChange={(e) => setTimeSlotId(e.target.value)}
            required
          >
            {timeSlots.map((slot) => (
              <option key={slot.id} value={slot.id}>
                {slot.displayTime ||
                  `${slot.title} (${slot.startTime} - ${slot.endTime})`}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            Address
          </label>
          {addresses.length === 0 ? (
            <div className="alert alert-warning">
              You don't have any addresses.{" "}
              <Link to="/addresses/new">Add an address</Link> first.
            </div>
          ) : (
            <>
              <select
                className="form-select"
                id="address"
                value={addressId}
                onChange={(e) => setAddressId(e.target.value)}
                required
              >
                {addresses.map((address) => (
                  <option key={address.id} value={address.id}>
                    {address.street}, {address.city}, {address.state}{" "}
                    {address.zipCode}
                  </option>
                ))}
              </select>
              <div className="mt-2">
                <Link to="/addresses/new">Add new address</Link>
              </div>
            </>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Services</label>
          {services.map((service) => (
            <div key={service.id} className="form-check mb-2">
              <input
                type="checkbox"
                className="form-check-input"
                id={`service-${service.id}`}
                checked={selectedServices.includes(service.id)}
                onChange={() => handleServiceToggle(service.id)}
              />
              <label
                className="form-check-label"
                htmlFor={`service-${service.id}`}
              >
                <strong>{service.name}</strong> - ${service.price.toFixed(2)}
                <p className="text-muted mb-0">{service.description}</p>
              </label>
            </div>
          ))}
        </div>
        <button
          type="submit"
          className="btn btn-primary"
          disabled={
            addresses.length === 0 || !date || selectedServices.length === 0
          }
        >
          Submit Request
        </button>
      </form>
    </div>
  );
}
