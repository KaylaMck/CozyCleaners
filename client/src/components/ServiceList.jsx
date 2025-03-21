// Updated ServiceList.jsx
import { useEffect, useState } from "react";
import { Row, Col, Card } from "react-bootstrap";

// SVG icon components
const CleaningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-stars" viewBox="0 0 16 16">
    <path d="M7.657 6.247c.11-.33.576-.33.686 0l.645 1.937a2.89 2.89 0 0 0 1.829 1.828l1.936.645c.33.11.33.576 0 .686l-1.937.645a2.89 2.89 0 0 0-1.828 1.829l-.645 1.936a.361.361 0 0 1-.686 0l-.645-1.937a2.89 2.89 0 0 0-1.828-1.828l-1.937-.645a.361.361 0 0 1 0-.686l1.937-.645a2.89 2.89 0 0 0 1.828-1.828l.645-1.937zM3.794 1.148a.217.217 0 0 1 .412 0l.387 1.162c.173.518.579.924 1.097 1.097l1.162.387a.217.217 0 0 1 0 .412l-1.162.387A1.734 1.734 0 0 0 4.593 5.69l-.387 1.162a.217.217 0 0 1-.412 0L3.407 5.69A1.734 1.734 0 0 0 2.31 4.593l-1.162-.387a.217.217 0 0 1 0-.412l1.162-.387A1.734 1.734 0 0 0 3.407 2.31l.387-1.162zM10.863.099a.145.145 0 0 1 .274 0l.258.774c.115.346.386.617.732.732l.774.258a.145.145 0 0 1 0 .274l-.774.258a1.156 1.156 0 0 0-.732.732l-.258.774a.145.145 0 0 1-.274 0l-.258-.774a1.156 1.156 0 0 0-.732-.732L9.1 2.137a.145.145 0 0 1 0-.274l.774-.258c.346-.115.617-.386.732-.732L10.863.1z"/>
  </svg>
);

const DeepCleaningIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-check-all" viewBox="0 0 16 16">
    <path d="M8.97 4.97a.75.75 0 0 1 1.07 1.05l-3.99 4.99a.75.75 0 0 1-1.08.02L2.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093L8.95 4.992a.252.252 0 0 1 .02-.022zm-.92 5.14.92.92a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 1 0-1.091-1.028L9.477 9.417l-.485-.486-.943 1.179z"/>
  </svg>
);

const MoveOutIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-truck" viewBox="0 0 16 16">
    <path d="M0 3.5A1.5 1.5 0 0 1 1.5 2h9A1.5 1.5 0 0 1 12 3.5V5h1.02a1.5 1.5 0 0 1 1.17.563l1.481 1.85a1.5 1.5 0 0 1 .329.938V10.5a1.5 1.5 0 0 1-1.5 1.5H14a2 2 0 1 1-4 0H5a2 2 0 1 1-3.998-.085A1.5 1.5 0 0 1 0 10.5v-7zm1.294 7.456A1.999 1.999 0 0 1 4.732 11h5.536a2.01 2.01 0 0 1 .732-.732V3.5a.5.5 0 0 0-.5-.5h-9a.5.5 0 0 0-.5.5v7a.5.5 0 0 0 .294.456zM12 10a2 2 0 0 1 1.732 1h.768a.5.5 0 0 0 .5-.5V8.35a.5.5 0 0 0-.11-.312l-1.48-1.85A.5.5 0 0 0 13.02 6H12v4zm-9 1a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm9 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"/>
  </svg>
);

// Map icons to service IDs
const getServiceIcon = (serviceId) => {
  switch (serviceId) {
    case 1: return <CleaningIcon />;
    case 2: return <DeepCleaningIcon />;
    case 3: return <MoveOutIcon />;
    default: return <CleaningIcon />;
  }
};

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  useEffect(() => {
    const getServices = async () => {
      try {
        const response = await fetch('/api/Services');
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          setError("Failed to load services");
        }
      } catch (error) {
        console.error('Error fetching services:', error);
        setError("An error occurred while loading services");
      } finally {
        setLoading(false);
      }
    };
    
    getServices();
  }, []);
  
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading services...</span>
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
  
  return (
    <div className="container">
      <div className="text-center mb-5">
        <h2 className="display-5 fw-bold mb-3">Our Cleaning Services</h2>
        <p className="lead text-muted mb-4">
          Choose from our range of professional cleaning services, all performed by our expert cleaners.
        </p>
      </div>
      
      <Row>
        {services.map(service => (
          <Col key={service.id} md={4} className="mb-4">
            <Card className="h-100 service-card">
              <Card.Body>
                <div className="service-icon mb-3" style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  backgroundColor: "#e8eaf6",
                  color: "#5c6bc0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "1rem"
                }}>
                  {getServiceIcon(service.id)}
                </div>
                <Card.Title className="mb-3">{service.name}</Card.Title>
                <Card.Text className="text-muted mb-4">{service.description}</Card.Text>
                <div className="price-tag" style={{
                  fontWeight: "bold",
                  fontSize: "1.25rem",
                  color: "#5c6bc0"
                }}>
                  ${service.price.toFixed(2)}
                </div>
              </Card.Body>
              <Card.Footer className="bg-white border-0">
                <a href="/book" className="btn btn-outline-primary w-100">Book This Service</a>
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>
      
      <div className="mt-5 p-4 bg-light rounded">
        <h3 className="mb-3">Service Information</h3>
        <ul className="list-unstyled">
          <li className="mb-2">
            <strong>Availability:</strong> 7 days a week, 8:00 AM to 8:00 PM
          </li>
          <li className="mb-2">
            <strong>Service Areas:</strong> Nashville metropolitan area
          </li>
          <li className="mb-2">
            <strong>Cleaning Supplies:</strong> All professional cleaning equipment and supplies included
          </li>
          <li className="mb-2">
            <strong>Booking:</strong> Please book at least 24 hours in advance
          </li>
        </ul>
      </div>
    </div>
  );
}