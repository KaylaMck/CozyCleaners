// Enhanced Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Badge, Button } from 'react-bootstrap';

// You can replace these icon imports with SVG components if react-icons installation fails
// SVG versions included as comments below each import
import { 
  FaCalendarAlt, 
  FaClock, 
  FaMapMarkerAlt, 
  FaEye, 
  FaHourglass,
  FaBroom,
  FaClipboardCheck,
  FaPlus,
  FaCheckCircle
} from 'react-icons/fa';

// SVG replacement if needed:
// const CalendarIcon = () => (
//   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="1em" height="1em" fill="currentColor">
//     <path d="M96 32V64H48C21.5 64 0 85.5 0 112v48H448V112c0-26.5-21.5-48-48-48H352V32c0-17.7-14.3-32-32-32s-32 14.3-32 32V64H160V32c0-17.7-14.3-32-32-32S96 14.3 96 32zM448 192H0V464c0 26.5 21.5 48 48 48H400c26.5 0 48-21.5 48-48V192z"/>
//   </svg>
// );

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
    return (
      <div className="alert alert-danger">
        <strong>Error:</strong> {error}
      </div>
    );
  }

  // Filter requests by status
  const activeRequests = cleaningRequests.filter(r => r.status === "Scheduled");
  const inProgressRequests = cleaningRequests.filter(r => r.status === "In Progress");
  const completedRequests = cleaningRequests.filter(r => r.status === "Completed");

  // Helper function to get badge class based on status
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Scheduled': return 'badge-scheduled';
      case 'In Progress': return 'badge-in-progress';
      case 'Completed': return 'badge-completed';
      case 'Canceled': return 'badge-canceled';
      default: return 'badge-scheduled';
    }
  };

  // Helper function to get icon based on status
  const getStatusIcon = (status) => {
    switch (status) {
      case 'Scheduled': return <FaCalendarAlt className="me-1" />;
      case 'In Progress': return <FaHourglass className="me-1" />;
      case 'Completed': return <FaCheckCircle className="me-1" />;
      default: return <FaCalendarAlt className="me-1" />;
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="section-heading">
          <FaClipboardCheck className="me-2 text-primary" />
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
          <h3 className="section-heading">
            <FaCalendarAlt className="me-2 text-primary" />
            Upcoming Cleanings
          </h3>
          <Row>
            {activeRequests.map(request => (
              <Col key={request.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 dashboard-card">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        {formatDate(request.date)}
                      </h5>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {getStatusIcon(request.status)} {request.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 p-2 bg-light rounded">
                      <div className="mb-2">
                        <FaClock className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.timeSlot}</span>
                      </div>
                      <div>
                        <FaMapMarkerAlt className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.address}</span>
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
            ))}
          </Row>
        </section>
      )}

      {inProgressRequests.length > 0 && (
        <section className="mb-5">
          <h3 className="section-heading">
            <FaHourglass className="me-2 text-warning" />
            In Progress
          </h3>
          <Row>
            {inProgressRequests.map(request => (
              <Col key={request.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 dashboard-card in-progress">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        {formatDate(request.date)}
                      </h5>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {getStatusIcon(request.status)} {request.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 p-2 bg-light rounded">
                      <div className="mb-2">
                        <FaClock className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.timeSlot}</span>
                      </div>
                      <div>
                        <FaMapMarkerAlt className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.address}</span>
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
            ))}
          </Row>
        </section>
      )}

      {completedRequests.length > 0 && (
        <section>
          <h3 className="section-heading">
            <FaCheckCircle className="me-2 text-success" />
            Recently Completed
          </h3>
          <Row>
            {completedRequests.slice(0, 3).map(request => (
              <Col key={request.id} md={6} lg={4} className="mb-4">
                <Card className="h-100 dashboard-card completed">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-3">
                      <h5 className="card-title mb-0">
                        {formatDate(request.date)}
                      </h5>
                      <Badge className={getStatusBadgeClass(request.status)}>
                        {getStatusIcon(request.status)} {request.status}
                      </Badge>
                    </div>
                    
                    <div className="mb-3 p-2 bg-light rounded">
                      <div className="mb-2">
                        <FaClock className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.timeSlot}</span>
                      </div>
                      <div>
                        <FaMapMarkerAlt className="me-2 text-muted" /> 
                        <span className="fw-medium">{request.address}</span>
                      </div>
                    </div>
                    
                    <div className="d-grid">
                      <Link to={`/requests/${request.id}`} className="btn btn-outline-primary">
                        <FaEye className="me-2" /> View Details
                      </Link>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
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