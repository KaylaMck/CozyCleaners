// NavBar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout } from '../managers/authManager';

function NavBar({ loggedInUser, setLoggedInUser }) {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout().then(() => {
      setLoggedInUser(null);
      navigate('/login');
    });
  };

  return (
    // Remove the container class to make it full width
    <nav className="navbar navbar-expand-lg navbar-light bg-light mb-4">
      <div className="container-fluid"> {/* Change container to container-fluid */}
        <Link className="navbar-brand" to="/">Cozy Cleaners</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          {loggedInUser ? (
            <>
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <Link className="nav-link" to="/">Home</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/book">Book A Cleaning</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/services">Services</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/completed">Completed Cleanings</Link>
                </li>
              </ul>
              <span className="navbar-text me-3">
                Hello, {loggedInUser.firstName}
              </span>
              <button onClick={handleLogout} className="btn btn-outline-danger">Logout</button>
            </>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}

export default NavBar;