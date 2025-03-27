import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card } from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaUser, 
  FaEye, 
  FaCheckCircle,
  FaDollarSign,
  FaClipboardCheck,
  FaHandsHelping
} from 'react-icons/fa';

export default function CleanerDashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availableRes, assignedRes] = await Promise.all([
          fetch('/api/Cleaner/available'),
          fetch('/api/Cleaner/assigned')
        ]);

        if (availableRes.ok && assignedRes.ok) {
          const [available, assigned] = await Promise.all([
            availableRes.json(),
            assignedRes.json()
          ]);

          setAvailableRequests(available);
          setAssignedRequests(assigned);
        } else {
          setError('Failed to load data');
        }
      } catch (error) {
        console.error('Error fetching cleaner data:', error);
        setError('An error occurred while loading data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleClaimRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to claim this cleaning request?')) {
      return;
    }

    try {
      const response = await fetch(`/api/Cleaner/claim/${requestId}`, {
        method: 'POST'
      });

      if (response.ok) {
        // Update the lists by moving the claimed request from available to assigned
        const claimedRequest = availableRequests.find(r => r.id === requestId);
        setAvailableRequests(availableRequests.filter(r => r.id !== requestId));
        setAssignedRequests([...assignedRequests, {...claimedRequest, claimedTime: new Date()}]);
      } else {
        setError('Failed to claim request');
      }
    } catch (error) {
      console.error('Error claiming request:', error);
      setError('An error occurred while claiming the request');
    }
  };

  const handleCompleteRequest = async (requestId) => {
    if (!window.confirm('Are you sure you want to mark this cleaning as completed?')) {
      return;
    }

    try {
      const response = await fetch(`/api/Cleaner/complete/${requestId}`, {
        method: 'POST'
      });

      if (response.ok) {
        // Remove the completed request from assigned list
        setAssignedRequests(assignedRequests.filter(r => r.id !== requestId));
      } else {
        setError('Failed to complete request');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      setError('An error occurred while completing the request');
    }
  };

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '200px' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h2 className="mb-4">
        <FaClipboardCheck className="me-2 text-primary" />
        Cleaner Dashboard
      </h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <div className="mb-4">
        <div className="d-flex border-bottom">
          <button 
            className={`btn py-2 px-3 ${activeTab === '1' ? 'fw-bold text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('1')}
            style={{ 
              textDecoration: 'none', 
              boxShadow: 'none', 
              outline: 'none',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === '1' ? '3px solid #1976d2' : 'none'
            }}
          >
            <FaCalendarAlt className="me-2" />
            Available Requests ({availableRequests.length})
          </button>
          <button 
            className={`btn py-2 px-3 ${activeTab === '2' ? 'fw-bold text-primary' : 'text-muted'}`}
            onClick={() => setActiveTab('2')}
            style={{ 
              textDecoration: 'none', 
              boxShadow: 'none', 
              outline: 'none',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === '2' ? '3px solid #1976d2' : 'none'
            }}
          >
            <FaHandsHelping className="me-2" />
            My Assigned Cleanings ({assignedRequests.length})
          </button>
        </div>
      </div>
      
      {activeTab === '1' && (
        <div>
          <h3 className="mb-3">Available Cleaning Requests</h3>
          {availableRequests.length === 0 ? (
            <div className="text-center p-5 bg-light rounded">
              <FaCalendarAlt className="mb-3" style={{ fontSize: '2.5rem', color: '#b0bec5' }} />
              <h4>No available cleaning requests</h4>
              <p className="text-muted">Check back soon for new opportunities!</p>
            </div>
          ) : (
            <Row>
              {availableRequests.map(request => (
                <Col key={request.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <h5 className="card-title mb-3">
                        <FaCalendarAlt className="me-2 text-primary" />
                        {formatDate(request.date)}
                      </h5>
                      
                      <div className="mb-3 p-2 bg-light rounded">
                        <div className="mb-2">
                          <FaClock className="me-2 text-muted" /> 
                          <span>{request.timeSlot}</span>
                        </div>
                        <div className="mb-2">
                          <FaMapMarkerAlt className="me-2 text-muted" /> 
                          <span>{request.address}</span>
                        </div>
                        <div>
                          <FaDollarSign className="me-2 text-success" />
                          <span className="fw-bold">${request.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <p className="card-text mb-3">
                        <strong>Services:</strong> {request.services.map(s => s.name).join(', ')}
                      </p>
                      
                      <div className="d-grid">
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleClaimRequest(request.id)}
                        >
                          <FaHandsHelping className="me-2" />
                          Claim This Cleaning
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
      
      {activeTab === '2' && (
        <div>
          <h3 className="mb-3">My Assigned Cleanings</h3>
          {assignedRequests.length === 0 ? (
            <div className="text-center p-5 bg-light rounded">
              <FaHandsHelping className="mb-3" style={{ fontSize: '2.5rem', color: '#b0bec5' }} />
              <h4>You don't have any assigned cleanings</h4>
              <p className="text-muted">Claim a cleaning request to get started!</p>
            </div>
          ) : (
            <Row>
              {assignedRequests.map(request => (
                <Col key={request.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm border-primary border-top">
                    <Card.Body>
                      <h5 className="card-title mb-3">
                        <FaCalendarAlt className="me-2 text-primary" />
                        {formatDate(request.date)}
                      </h5>
                      
                      <div className="mb-3 p-2 bg-light rounded">
                        <div className="mb-2">
                          <FaClock className="me-2 text-muted" /> 
                          <span>{request.timeSlot}</span>
                        </div>
                        <div className="mb-2">
                          <FaMapMarkerAlt className="me-2 text-muted" /> 
                          <span>{request.address}</span>
                        </div>
                        <div className="mb-2">
                          <FaUser className="me-2 text-muted" /> 
                          <span>{request.clientName}</span>
                        </div>
                        <div>
                          <FaDollarSign className="me-2 text-success" />
                          <span className="fw-bold">${request.totalPrice.toFixed(2)}</span>
                        </div>
                      </div>
                      
                      <p className="card-text mb-3">
                        <strong>Services:</strong> {request.services.map(s => s.name).join(', ')}
                      </p>
                      
                      <p className="card-text text-muted">
                        <small>Claimed on: {new Date(request.claimedTime).toLocaleString()}</small>
                      </p>
                      
                      <div className="d-grid">
                        <button 
                          className="btn btn-primary" 
                          onClick={() => handleCompleteRequest(request.id)}
                        >
                          <FaCheckCircle className="me-2" />
                          Mark as Completed
                        </button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </div>
      )}
    </div>
  );
}