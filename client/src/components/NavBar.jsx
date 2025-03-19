import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { logout } from '../managers/authManager';

function NavBar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  
  const isClient = loggedInUser?.roles?.includes("Client");
  const isCleaner = loggedInUser?.roles?.includes("Cleaner");
  
  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate('/login');
    });
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/">Cozy Cleaners</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedInUser ? (
              <>
                {isCleaner && (
                  <Nav.Link as={Link} to="/cleaner">Cleaner Dashboard</Nav.Link>
                )}
                
                {isClient && (
                  <>
                    <Nav.Link as={Link} to="/">Dashboard</Nav.Link>
                    <Nav.Link as={Link} to="/book">Book A Cleaning</Nav.Link>
                    <Nav.Link as={Link} to="/services">Services</Nav.Link>
                    <Nav.Link as={Link} to="/completed">Completed Cleanings</Nav.Link>
                  </>
                )}
                
                <Nav.Link as={Link} to="/profile">My Profile</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Login</Nav.Link>
                <Nav.Link as={Link} to="/register">Register</Nav.Link>
              </>
            )}
          </Nav>
          
          {loggedInUser && (
            <div className="d-flex align-items-center">
              <span className="me-3">
                Hello, {loggedInUser.firstName}
              </span>
              <Button variant="outline-danger" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;