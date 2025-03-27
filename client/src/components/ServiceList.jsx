import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import { FaSprayCan, FaBroom, FaTruckMoving } from "react-icons/fa";

export default function ServicesList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Get icon based on service id
  const getServiceIcon = (id) => {
    switch (id) {
      case 1: return <FaSprayCan size={30} />;
      case 2: return <FaBroom size={30} />;
      case 3: return <FaTruckMoving size={30} />;
      default: return <FaSprayCan size={30} />;
    }
  };
  
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
    return <div className="text-center p-5">Loading services...</div>;
  }
  
  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }
  
  return (
    <div className="container">
      <h2 className="my-4 text-center">Our Cleaning Services</h2>
      <Row>
        {services.map(service => (
          <Col key={service.id} md={4} className="mb-4">
            <Card className="h-100">
              <Card.Body className="text-center">
                <div style={{ 
                  width: "70px", 
                  height: "70px", 
                  backgroundColor: "#e3f2fd", 
                  borderRadius: "50%", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  margin: "0 auto 1rem auto",
                  color: "#1976d2"
                }}>
                  {getServiceIcon(service.id)}
                </div>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text className="text-muted">{service.description}</Card.Text>
                <div className="mt-3">
                  <h4 className="text-primary">${service.price.toFixed(2)}</h4>
                  <a href="/book" className="btn btn-primary mt-2">Book This Service</a>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
}