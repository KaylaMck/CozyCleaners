import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { logout } from '../managers/authManager';
import { 
  FaHome, 
  FaClipboardList, 
  FaUser, 
  FaSignInAlt,
  FaUserPlus,
  FaSignOutAlt,
  FaClipboardCheck
} from 'react-icons/fa';

function NavBar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  
  const isClient = loggedInUser?.roles?.includes("Client");
  const isCleaner = loggedInUser?.roles?.includes("Cleaner");
  
  const isLoginPage = location.pathname === "/login";
  const isRegisterPage = location.pathname === "/register";
  
  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate('/login');
    });
  };

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm py-3 mb-4">
      <Container>
        <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
          <span style={{ fontWeight: '700', fontSize: '1.4rem', color: '#1976d2' }}>Cozy Cleaners</span>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {loggedInUser ? (
              <>
                {isCleaner && (
                  <Nav.Link as={Link} to="/cleaner" className="mx-1">
                    <FaClipboardCheck className="me-2" /> Cleaner Dashboard
                  </Nav.Link>
                )}
                
                {isClient && (
                  <>
                    <Nav.Link as={Link} to="/" className="mx-1">
                      <FaHome className="me-2" /> Dashboard
                    </Nav.Link>
                    <Nav.Link as={Link} to="/services" className="mx-1">
                      <FaClipboardList className="me-2" /> Services
                    </Nav.Link>
                  </>
                )}
                
                <Nav.Link as={Link} to="/profile" className="mx-1">
                  <FaUser className="me-2" /> My Profile
                </Nav.Link>
              </>
            ) : (
              <>
                {!isLoginPage && (
                  <Nav.Link as={Link} to="/login" className="mx-1">
                    <FaSignInAlt className="me-2" /> Login
                  </Nav.Link>
                )}
                {!isRegisterPage && (
                  <Nav.Link as={Link} to="/register" className="mx-1">
                    <FaUserPlus className="me-2" /> Register
                  </Nav.Link>
                )}
              </>
            )}
          </Nav>
          
          {loggedInUser && (
            <div className="d-flex align-items-center">
              <div className="me-3 d-flex align-items-center">
                <div className="avatar me-2" style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: '#e3f2fd',
                  color: '#1976d2',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold'
                }}>
                  {loggedInUser.firstName.charAt(0)}
                  {loggedInUser.lastName.charAt(0)}
                </div>
                <div>
                  <div className="fw-bold" style={{ fontSize: '0.95rem' }}>
                    {loggedInUser.firstName} {loggedInUser.lastName}
                  </div>
                  <span 
                    className="badge bg-primary"
                    style={{ 
                      fontSize: '0.7rem',
                      textTransform: 'uppercase',
                      fontWeight: '500'
                    }}
                  >
                    {isClient ? "Client" : isCleaner ? "Cleaner" : "User"}
                  </span>
                </div>
              </div>
              <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                <FaSignOutAlt className="me-2" /> Logout
              </Button>
            </div>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavBar;