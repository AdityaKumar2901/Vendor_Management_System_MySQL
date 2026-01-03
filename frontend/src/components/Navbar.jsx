import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';
import './Navbar.css';

function Navbar() {
  const navigate = useNavigate();
  const user = apiClient.getUser();

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      apiClient.logout();
      navigate('/login');
    }
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/dashboard" className="navbar-brand">
          Vendor Management
        </Link>
        
        <div className="navbar-menu">
          <Link to="/dashboard" className="navbar-link">Dashboard</Link>
          <Link to="/vendors" className="navbar-link">Vendors</Link>
          <Link to="/purchase-orders" className="navbar-link">Purchase Orders</Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user.name}</span>
          <button onClick={handleLogout} className="btn-logout">
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
