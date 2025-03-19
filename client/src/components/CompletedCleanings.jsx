import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function CompletedCleanings() {
  const [completedCleanings, setCompletedCleanings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchCompletedCleanings = async () => {
      try {
        const response = await fetch('/api/CleaningRequests/completed');
        if (response.ok) {
          const data = await response.json();
          setCompletedCleanings(data);
        } else {
          setError('Failed to load completed cleanings');
        }
      } catch (error) {
        console.error('Error fetching completed cleanings:', error);
        setError('An error occurred while loading your completed cleanings');
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedCleanings();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Completed Cleanings</h2>

      {completedCleanings.length === 0 ? (
        <p>You don't have any completed cleanings yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Date</th>
                <th>Address</th>
                <th>Services</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {completedCleanings.map(cleaning => (
                <tr key={cleaning.id}>
                  <td>{new Date(cleaning.date).toLocaleDateString()}</td>
                  <td>{cleaning.address}</td>
                  <td>
                    {cleaning.services.map(s => s.name).join(', ')}
                  </td>
                  <td>${cleaning.totalPrice.toFixed(2)}</td>
                  <td>
                    <Link to={`/requests/${cleaning.id}`} className="btn btn-sm btn-primary">
                      View Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}