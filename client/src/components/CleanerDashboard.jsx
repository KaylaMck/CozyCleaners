// CleanerDashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav, NavItem, NavLink, TabContent, TabPane } from 'reactstrap';
import classnames from 'classnames';

export default function CleanerDashboard() {
  const [activeTab, setActiveTab] = useState('1');
  const [availableRequests, setAvailableRequests] = useState([]);
  const [assignedRequests, setAssignedRequests] = useState([]);
  const [completedRequests, setCompletedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const toggle = tab => {
    if (activeTab !== tab) setActiveTab(tab);
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availableRes, assignedRes, completedRes] = await Promise.all([
          fetch('/api/Cleaner/available'),
          fetch('/api/Cleaner/assigned'),
          fetch('/api/Cleaner/completed')
        ]);

        if (availableRes.ok && assignedRes.ok && completedRes.ok) {
          const [available, assigned, completed] = await Promise.all([
            availableRes.json(),
            assignedRes.json(),
            completedRes.json()
          ]);

          setAvailableRequests(available);
          setAssignedRequests(assigned);
          setCompletedRequests(completed);
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
        // Update the lists by moving the completed request from assigned to completed
        const completedRequest = assignedRequests.find(r => r.id === requestId);
        setAssignedRequests(assignedRequests.filter(r => r.id !== requestId));
        setCompletedRequests([...completedRequests, completedRequest]);
      } else {
        setError('Failed to complete request');
      }
    } catch (error) {
      console.error('Error completing request:', error);
      setError('An error occurred while completing the request');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      <h2 className="mb-4">Cleaner Dashboard</h2>
      
      {error && <div className="alert alert-danger">{error}</div>}
      
      <Nav tabs className="mb-4">
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '1' })}
            onClick={() => { toggle('1'); }}
          >
            Available Requests ({availableRequests.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '2' })}
            onClick={() => { toggle('2'); }}
          >
            My Assigned Cleanings ({assignedRequests.length})
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({ active: activeTab === '3' })}
            onClick={() => { toggle('3'); }}
          >
            Completed Cleanings ({completedRequests.length})
          </NavLink>
        </NavItem>
      </Nav>
      
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <h3>Available Cleaning Requests</h3>
          {availableRequests.length === 0 ? (
            <p>No available cleaning requests at this time.</p>
          ) : (
            <div className="row">
              {availableRequests.map(request => (
                <div key={request.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{new Date(request.date).toLocaleDateString()}</h5>
                      <p className="card-text"><strong>Time:</strong> {request.timeSlot}</p>
                      <p className="card-text"><strong>Address:</strong> {request.address}</p>
                      <p className="card-text"><strong>Services:</strong> {request.services.map(s => s.name).join(', ')}</p>
                      <p className="card-text"><strong>Price:</strong> ${request.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="card-footer">
                      <button 
                        className="btn btn-primary w-100" 
                        onClick={() => handleClaimRequest(request.id)}
                      >
                        Claim This Cleaning
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPane>
        
        <TabPane tabId="2">
          <h3>My Assigned Cleanings</h3>
          {assignedRequests.length === 0 ? (
            <p>You don't have any assigned cleanings.</p>
          ) : (
            <div className="row">
              {assignedRequests.map(request => (
                <div key={request.id} className="col-md-6 col-lg-4 mb-4">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">{new Date(request.date).toLocaleDateString()}</h5>
                      <p className="card-text"><strong>Time:</strong> {request.timeSlot}</p>
                      <p className="card-text"><strong>Address:</strong> {request.address}</p>
                      <p className="card-text"><strong>Client:</strong> {request.clientName}</p>
                      <p className="card-text"><strong>Services:</strong> {request.services.map(s => s.name).join(', ')}</p>
                      <p className="card-text"><strong>Price:</strong> ${request.totalPrice.toFixed(2)}</p>
                      <p className="card-text"><small className="text-muted">Claimed on: {new Date(request.claimedTime).toLocaleString()}</small></p>
                    </div>
                    <div className="card-footer">
                      <button 
                        className="btn btn-success w-100" 
                        onClick={() => handleCompleteRequest(request.id)}
                      >
                        Mark as Completed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabPane>
        
        <TabPane tabId="3">
          <h3>Completed Cleanings</h3>
          {completedRequests.length === 0 ? (
            <p>You don't have any completed cleanings yet.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Client</th>
                    <th>Address</th>
                    <th>Services</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  {completedRequests.map(request => (
                    <tr key={request.id}>
                      <td>{new Date(request.date).toLocaleDateString()}</td>
                      <td>{request.clientName}</td>
                      <td>{request.address}</td>
                      <td>{request.services.map(s => s.name).join(', ')}</td>
                      <td>${request.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="4" className="text-end"><strong>Total Earnings:</strong></td>
                    <td>
                      <strong>
                        ${completedRequests.reduce((sum, request) => sum + request.totalPrice, 0).toFixed(2)}
                      </strong>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          )}
        </TabPane>
      </TabContent>
    </div>
  );
}