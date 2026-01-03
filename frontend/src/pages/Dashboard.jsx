import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './Dashboard.css';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getDashboard();
      setStats(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stats-grid">
        <Link to="/vendors" className="stat-card">
          <div className="stat-icon">📦</div>
          <div className="stat-content">
            <h3>Total Vendors</h3>
            <p className="stat-number">{stats?.vendors || 0}</p>
          </div>
        </Link>

        <div className="stat-card">
          <div className="stat-icon">🏷️</div>
          <div className="stat-content">
            <h3>Total Products</h3>
            <p className="stat-number">{stats?.products || 0}</p>
          </div>
        </div>

        <Link to="/purchase-orders?status=draft,submitted" className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-content">
            <h3>Open Purchase Orders</h3>
            <p className="stat-number">{stats?.openPurchaseOrders || 0}</p>
          </div>
        </Link>

        <Link to="/purchase-orders" className="stat-card">
          <div className="stat-icon">📊</div>
          <div className="stat-content">
            <h3>Total Purchase Orders</h3>
            <p className="stat-number">{stats?.totalPurchaseOrders || 0}</p>
          </div>
        </Link>
      </div>

      <div className="quick-actions">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <Link to="/vendors/new" className="btn btn-primary">
            + New Vendor
          </Link>
          <Link to="/purchase-orders/new" className="btn btn-secondary">
            + New Purchase Order
          </Link>
          <Link to="/vendors" className="btn btn-secondary">
            View All Vendors
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
