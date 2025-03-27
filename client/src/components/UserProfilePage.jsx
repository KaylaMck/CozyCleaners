import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  ListGroup,
  ListGroupItem,
  Modal,
  Form,
} from "react-bootstrap";
import {
  FaUser,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPencilAlt,
  FaTrashAlt,
  FaPlusCircle,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaTimes
} from "react-icons/fa";

export default function UserProfilePage({ loggedInUser, setLoggedInUser }) {
  const [userAddresses, setUserAddresses] = useState([]);
  const [completedCleanings, setCompletedCleanings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editedProfile, setEditedProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
  });

  const navigate = useNavigate();

  const isCleaner = loggedInUser?.roles?.includes("Cleaner");
  const isClient = loggedInUser?.roles?.includes("Client");

  const toggleEditModal = () => {
    setEditModalOpen(!editModalOpen);
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Are you sure you want to delete this address?')) {
      return;
    }

    try {
      const response = await fetch(`/api/UserAddresses/${addressId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setUserAddresses(userAddresses.filter(addr => addr.id !== addressId));
      } else {
        setError('Failed to delete address');
      }
    } catch (error) {
      console.error('Error deleting address:', error);
      setError('An error occurred while deleting the address');
    }
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({
      ...editedProfile,
      [name]: value
    });
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/UserProfiles/${loggedInUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(editedProfile)
      });
      
      if (response.ok) {
        // Update the logged in user info
        const updatedUser = {
          ...loggedInUser,
          firstName: editedProfile.firstName,
          lastName: editedProfile.lastName,
          email: editedProfile.email
        };
        setLoggedInUser(updatedUser);
        toggleEditModal();
      } else {
        setError('Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('An error occurred while updating your profile');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchPromises = [];

        // Add addresses fetch promise for clients
        if (isClient) {
          fetchPromises.push(
            fetch("/api/UserAddresses")
              .then((res) => (res.ok ? res.json() : []))
              .then((data) => setUserAddresses(data))
          );

          // Add client completed cleanings fetch
          fetchPromises.push(
            fetch("/api/CleaningRequests/completed")
              .then((res) => (res.ok ? res.json() : []))
              .then((data) => setCompletedCleanings(data))
          );
        }

        // Add completed cleanings fetch promise for cleaners
        if (isCleaner) {
          fetchPromises.push(
            fetch("/api/Cleaner/completed")
              .then((res) => (res.ok ? res.json() : []))
              .then((data) => setCompletedCleanings(data))
          );
        }

        // Wait for all fetches to complete
        await Promise.all(fetchPromises);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError("An error occurred while loading profile data");
      } finally {
        setLoading(false);
      }
    };

    if (loggedInUser) {
      setEditedProfile({
        firstName: loggedInUser.firstName,
        lastName: loggedInUser.lastName,
        email: loggedInUser.email,
      });
      fetchData();
    }
  }, [loggedInUser, isCleaner, isClient]);

  // Format date in a more readable way
  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "200px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading profile information...</span>
        </div>
      </div>
    );
  }

  // Calculate total earnings for cleaners
  const totalEarnings = isCleaner
    ? completedCleanings.reduce((sum, cleaning) => sum + cleaning.totalPrice, 0)
    : 0;

  return (
    <div className="container">
      <h2 className="mb-4">
        <FaUser className="me-2 text-primary" />
        Your Profile
      </h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <Card className="shadow-sm">
            <Card.Header className="d-flex justify-content-between align-items-center bg-white">
              <h3 className="mb-0 h5">Personal Information</h3>
              <Button color="primary" size="sm" className="btn-sm btn-primary" onClick={toggleEditModal}>
                <FaPencilAlt className="me-2" /> Edit Profile
              </Button>
            </Card.Header>
            <Card.Body>
              <p>
                <strong><FaUser className="me-2 text-muted" /> Name:</strong> {loggedInUser.firstName}{" "}
                {loggedInUser.lastName}
              </p>
              <p>
                <strong><FaEnvelope className="me-2 text-muted" /> Email:</strong> {loggedInUser.email}
              </p>
              {loggedInUser.roles && (
                <p>
                  <strong><FaUser className="me-2 text-muted" /> Role:</strong>{" "}
                  <span className="badge bg-primary">{loggedInUser.roles.join(", ")}</span>
                </p>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Client-specific section: Addresses */}
      {isClient && (
        <div className="row mb-4">
          <div className="col-12">
            <Card className="shadow-sm">
              <Card.Header className="d-flex justify-content-between align-items-center bg-white">
                <h3 className="mb-0 h5">
                  <FaMapMarkerAlt className="me-2 text-primary" /> Your Addresses
                </h3>
                <Link to="/addresses/new" className="btn btn-primary btn-sm">
                  <FaPlusCircle className="me-2" /> Add New Address
                </Link>
              </Card.Header>
              <Card.Body>
                {userAddresses.length === 0 ? (
                  <p className="text-muted">You don't have any saved addresses yet.</p>
                ) : (
                  <ListGroup>
                    {userAddresses.map((address) => (
                      <ListGroupItem
                        key={address.id}
                        className="d-flex justify-content-between align-items-center border-0 border-bottom py-3"
                      >
                        <div>
                          <p className="mb-0">
                            <FaMapMarkerAlt className="me-2 text-muted" />
                            {address.street}, {address.city}, {address.state}{" "}
                            {address.zipCode}
                          </p>
                        </div>
                        <div>
                          <Link
                            to={`/addresses/edit/${address.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            <FaPencilAlt className="me-1" /> Edit
                          </Link>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            <FaTrashAlt className="me-1" /> Delete
                          </Button>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
      )}

      {/* Completed Cleanings section (for both clients and cleaners) */}
      <div className="row mb-4">
        <div className="col-12">
          <Card className="shadow-sm">
            <Card.Header className="bg-white">
              <h3 className="mb-0 h5">
                <FaCheckCircle className="me-2 text-primary" /> Completed Cleanings
              </h3>
            </Card.Header>
            <Card.Body>
              {completedCleanings.length === 0 ? (
                <p className="text-muted">You don't have any completed cleanings yet.</p>
              ) : (
                <div className="table-responsive">
                  <table className="table">
                    <thead className="table-light">
                      <tr>
                        <th><FaCalendarAlt className="me-2" /> Date</th>
                        {isCleaner && <th><FaUser className="me-2" /> Client</th>}
                        <th><FaMapMarkerAlt className="me-2" /> Address</th>
                        <th>Services</th>
                        <th>Price</th>
                        {isClient && <th>Actions</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {completedCleanings.map((request) => (
                        <tr key={request.id}>
                          <td>{formatDate(request.date)}</td>
                          {isCleaner && <td>{request.clientName}</td>}
                          <td>{request.address}</td>
                          <td>
                            {request.services.map((s) => s.name).join(", ")}
                          </td>
                          <td>${request.totalPrice.toFixed(2)}</td>
                          {isClient && (
                            <td>
                              <Link
                                to={`/requests/${request.id}`}
                                className="btn btn-sm btn-primary"
                              >
                                <FaEye className="me-1" /> View
                              </Link>
                            </td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                    {isCleaner && (
                      <tfoot>
                        <tr>
                          <td colSpan="4" className="text-end">
                            <strong>Total Earnings:</strong>
                          </td>
                          <td>
                            <strong>${totalEarnings.toFixed(2)}</strong>
                          </td>
                        </tr>
                      </tfoot>
                    )}
                  </table>
                </div>
              )}
            </Card.Body>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal show={editModalOpen} onHide={toggleEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleProfileSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2 text-muted" /> First Name
              </Form.Label>
              <Form.Control
                type="text"
                name="firstName"
                value={editedProfile.firstName}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaUser className="me-2 text-muted" /> Last Name
              </Form.Label>
              <Form.Control
                type="text"
                name="lastName"
                value={editedProfile.lastName}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>
                <FaEnvelope className="me-2 text-muted" /> Email
              </Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editedProfile.email}
                onChange={handleProfileChange}
                required
              />
            </Form.Group>
            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={toggleEditModal}>
                <FaTimes className="me-2" /> Cancel
              </Button>
              <Button variant="primary" type="submit">
                <FaCheckCircle className="me-2" /> Save Changes
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}