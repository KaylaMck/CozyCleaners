import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaEye, 
  FaSpinner,
  FaBroom,
  FaCheckCircle,
  FaPlus 
} from 'react-icons/fa';

export default function Dashboard() {
  const [cleaningRequests, setCleaningRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch('/api/CleaningRequests');
        if (response.ok) {
          const data = await response.json();
          setCleaningRequests(data);
        } else {
          setError('Failed to load cleaning requests');
        }
      } catch (error) {
        console.error('Error fetching requests:', error);
        setError('An error occurred while loading your requests');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Get appropriate icon and badge class based on status
  const getStatusDetails = (status) => {
    switch (status) {
      case 'Scheduled':
        return { 
          icon: <FaCalendarAlt className="me-1" />, 
          badgeClass: 'bg-primary',
          color: '#1976d2'
        };
      case 'In Progress':
        return { 
          icon: <FaSpinner className="me-1" />, 
          badgeClass: 'bg-info',
          color: '#0288d1'
        };
      case 'Completed':
        return { 
          icon: <FaCheckCircle className="me-1" />, 
          badgeClass: 'bg-success',
          color: '#43a047'
        };
      default:
        return { 
          icon: <FaCalendarAlt className="me-1" />, 
          badgeClass: 'bg-secondary',
          color: '#757575'
        };
    }
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

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Filter requests by status
  const activeRequests = cleaningRequests.filter(r => r.status === "Scheduled");
  const inProgressRequests = cleaningRequests.filter(r => r.status === "In Progress");
  const completedRequests = cleaningRequests.filter(r => r.status === "Completed").slice(0, 3); // Show only the most recent

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">
          <FaBroom className="me-2 text-primary" />
          My Dashboard
        </h2>
        <Link to="/book" className="btn btn-primary">
          <FaPlus className="me-2" /> Book New Cleaning
        </Link>
      </div>

      {activeRequests.length === 0 && inProgressRequests.length === 0 && (
        <Card className="text-center mb-5 py-4">
          <Card.Body>
            <FaBroom className="mb-3" style={{ fontSize: '2.5rem', color: '#b0bec5' }} />
            <h4>No Active Cleaning Requests</h4>
            <p className="text-muted">Book your first cleaning service to get started!</p>
            <Link to="/book" className="btn btn-primary">
              <FaPlus className="me-2" /> Book a Cleaning
            </Link>
          </Card.Body>
        </Card>
      )}

      {activeRequests.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-3">
            <FaCalendarAlt className="me-2 text-primary" />
            Upcoming Cleanings
          </h3>
          <Row>
            {activeRequests.map(request => {
              const { icon, badgeClass } = getStatusDetails(request.status);
              return (
                <Col key={request.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">
                          {formatDate(request.date)}
                        </h5>
                        <Badge className={badgeClass}>
                          {icon} {request.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3 p-2 bg-light rounded">
                        <div className="mb-2">
                          <FaClock className="me-2 text-muted" /> 
                          <span>{request.timeSlot}</span>
                        </div>
                        <div>
                          <FaMapMarkerAlt className="me-2 text-muted" /> 
                          <span>{request.address}</span>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <Link to={`/requests/${request.id}`} className="btn btn-primary">
                          <FaEye className="me-2" /> View Details
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      )}

      {inProgressRequests.length > 0 && (
        <section className="mb-5">
          <h3 className="mb-3">
            <FaSpinner className="me-2 text-info" />
            In Progress
          </h3>
          <Row>
            {inProgressRequests.map(request => {
              const { icon, badgeClass } = getStatusDetails(request.status);
              return (
                <Col key={request.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm border-info border-top">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">
                          {formatDate(request.date)}
                        </h5>
                        <Badge className={badgeClass}>
                          {icon} {request.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3 p-2 bg-light rounded">
                        <div className="mb-2">
                          <FaClock className="me-2 text-muted" /> 
                          <span>{request.timeSlot}</span>
                        </div>
                        <div>
                          <FaMapMarkerAlt className="me-2 text-muted" /> 
                          <span>{request.address}</span>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <Link to={`/requests/${request.id}`} className="btn btn-info text-white">
                          <FaEye className="me-2" /> View Details
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        </section>
      )}

      {completedRequests.length > 0 && (
        <section>
          <h3 className="mb-3">
            <FaCheckCircle className="me-2 text-success" />
            Recently Completed
          </h3>
          <Row>
            {completedRequests.map(request => {
              const { icon, badgeClass } = getStatusDetails(request.status);
              return (
                <Col key={request.id} md={6} lg={4} className="mb-4">
                  <Card className="h-100 shadow-sm border-success border-top">
                    <Card.Body>
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="card-title mb-0">
                          {formatDate(request.date)}
                        </h5>
                        <Badge className={badgeClass}>
                          {icon} {request.status}
                        </Badge>
                      </div>
                      
                      <div className="mb-3 p-2 bg-light rounded">
                        <div className="mb-2">
                          <FaClock className="me-2 text-muted" /> 
                          <span>{request.timeSlot}</span>
                        </div>
                        <div>
                          <FaMapMarkerAlt className="me-2 text-muted" /> 
                          <span>{request.address}</span>
                        </div>
                      </div>
                      
                      <div className="d-grid">
                        <Link to={`/requests/${request.id}`} className="btn btn-outline-success">
                          <FaEye className="me-2" /> View Details
                        </Link>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
          {completedRequests.length > 3 && (
            <div className="text-center mt-3">
              <Link to="/profile" className="btn btn-outline-primary">
                View All Completed Cleanings
              </Link>
            </div>
          )}
        </section>
      )}
    </div>
  );
}