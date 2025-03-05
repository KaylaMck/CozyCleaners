import { useEffect, useState } from "react";

export default function ServicesList() {
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const getServices = async () => {
        try {
          const response = await fetch('/api/Services');
          const data = await response.json();
          setServices(data);
        } catch (error) {
          console.error('Error fetching services:', error);
        } finally {
          setLoading(false);
        }
      };
      
      getServices();
    }, []);
    
    if (loading) {
      return <div>Loading services...</div>;
    }
    
    return (
      <div>
        <h2 className="mb-4">Our Cleaning Services</h2>
        <table className="table table-hover">
          <thead>
            <tr>
              <th style={{width: "25%"}}>Service Name</th>
              <th style={{width: "50%"}}>Description</th>
              <th style={{width: "25%"}}>Price</th>
            </tr>
          </thead>
          <tbody>
            {services.map(service => (
              <tr key={service.id}>
                <td>{service.name}</td>
                <td>{service.description}</td>
                <td>${service.price.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }