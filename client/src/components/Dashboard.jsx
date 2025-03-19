// Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

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
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  // Filter requests by status
  const activeRequests = cleaningRequests.filter(r => r.status === "Scheduled");
  const inProgressRequests = cleaningRequests.filter(r => r.status === "In Progress");

  return (
    <div className="container">
      <h2 className="mb-4">My Dashboard</h2>

      <section className="mb-5">
        <h3>Active Requests</h3>
        {activeRequests.length === 0 ? (
          <p>You don't have any active cleaning requests.</p>
        ) : (
          <div className="row">
            {activeRequests.map(request => (
              <div key={request.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {new Date(request.date).toLocaleDateString()}
                    </h5>
                    <p className="card-text">Time: {request.timeSlot}</p>
                    <p className="card-text">Address: {request.address}</p>
                    <Link to={`/requests/${request.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <section>
        <h3>In Progress</h3>
        {inProgressRequests.length === 0 ? (
          <p>You don't have any cleanings in progress.</p>
        ) : (
          <div className="row">
            {inProgressRequests.map(request => (
              <div key={request.id} className="col-md-4 mb-3">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">
                      {new Date(request.date).toLocaleDateString()}
                    </h5>
                    <p className="card-text">Time: {request.timeSlot}</p>
                    <p className="card-text">Address: {request.address}</p>
                    <Link to={`/requests/${request.id}`} className="btn btn-primary">
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}