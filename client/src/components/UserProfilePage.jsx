import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  ListGroup,
  ListGroupItem,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
} from "reactstrap";

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

  // Define toggle function here before any conditionals
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

  if (loading) {
    return <div>Loading profile information...</div>;
  }

  // Calculate total earnings for cleaners
  const totalEarnings = isCleaner
    ? completedCleanings.reduce((sum, cleaning) => sum + cleaning.totalPrice, 0)
    : 0;

  return (
    <div className="container">
      <h2 className="mb-4">Your Profile</h2>

      <div className="row mb-4">
        <div className="col-md-6">
          <Card>
            <CardHeader className="d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Personal Information</h3>
              <Button color="primary" size="sm" onClick={toggleEditModal}>
                Edit Profile
              </Button>
            </CardHeader>
            <CardBody>
              <p>
                <strong>Name:</strong> {loggedInUser.firstName}{" "}
                {loggedInUser.lastName}
              </p>
              <p>
                <strong>Email:</strong> {loggedInUser.email}
              </p>
              {loggedInUser.roles && (
                <p>
                  <strong>Role:</strong> {loggedInUser.roles.join(", ")}
                </p>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Client-specific section: Addresses */}
      {isClient && (
        <div className="row mb-4">
          <div className="col-12">
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h3 className="mb-0">Your Addresses</h3>
                <Link to="/addresses/new" className="btn btn-primary btn-sm">
                  Add New Address
                </Link>
              </CardHeader>
              <CardBody>
                {userAddresses.length === 0 ? (
                  <p>You don't have any saved addresses yet.</p>
                ) : (
                  <ListGroup>
                    {userAddresses.map((address) => (
                      <ListGroupItem
                        key={address.id}
                        className="d-flex justify-content-between align-items-center"
                      >
                        <div>
                          <p className="mb-0">
                            {address.street}, {address.city}, {address.state}{" "}
                            {address.zipCode}
                          </p>
                        </div>
                        <div>
                          <Link
                            to={`/addresses/edit/${address.id}`}
                            className="btn btn-sm btn-outline-primary me-2"
                          >
                            Edit
                          </Link>
                          <Button
                            color="outline-danger"
                            size="sm"
                            onClick={() => handleDeleteAddress(address.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </ListGroupItem>
                    ))}
                  </ListGroup>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}

      {/* Completed Cleanings section (for both clients and cleaners) */}
      <div className="row mb-4">
        <div className="col-12">
          <Card>
            <CardHeader>
              <h3 className="mb-0">Completed Cleanings</h3>
            </CardHeader>
            <CardBody>
              {completedCleanings.length === 0 ? (
                <p>You don't have any completed cleanings yet.</p>
              ) : (
                <>
                  <div className="table-responsive">
                    <table className="table table-striped">
                      <thead>
                        <tr>
                          <th>Date</th>
                          {isCleaner && <th>Client</th>}
                          <th>Address</th>
                          <th>Services</th>
                          <th>Price</th>
                          {isClient && <th>Actions</th>}
                        </tr>
                      </thead>
                      <tbody>
                        {completedCleanings.map((request) => (
                          <tr key={request.id}>
                            <td>
                              {new Date(request.date).toLocaleDateString()}
                            </td>
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
                                  View Details
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
                </>
              )}
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <Modal isOpen={editModalOpen} toggle={toggleEditModal}>
        <ModalHeader toggle={toggleEditModal}>Edit Profile</ModalHeader>
        <ModalBody>
          <Form onSubmit={handleProfileSubmit}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input
                type="text"
                name="firstName"
                id="firstName"
                value={editedProfile.firstName}
                onChange={handleProfileChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input
                type="text"
                name="lastName"
                id="lastName"
                value={editedProfile.lastName}
                onChange={handleProfileChange}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input
                type="email"
                name="email"
                id="email"
                value={editedProfile.email}
                onChange={handleProfileChange}
                required
              />
            </FormGroup>
            <div className="d-flex justify-content-end">
              <Button color="secondary" className="me-2" onClick={toggleEditModal}>
                Cancel
              </Button>
              <Button color="primary" type="submit">
                Save Changes
              </Button>
            </div>
          </Form>
        </ModalBody>
      </Modal>
    </div>
  );
}