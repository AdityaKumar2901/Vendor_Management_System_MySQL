import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './VendorList.css';

function VendorList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    loadVendors();
  }, [searchParams]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (searchTerm) params.search = searchTerm;
      if (statusFilter) params.status = statusFilter;

      const response = await apiClient.getVendors(params);
      setVendors(response.data.vendors);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilters();
  };

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const updateFilters = () => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    params.page = 1;
    setCurrentPage(1);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = {};
    if (searchTerm) params.search = searchTerm;
    if (statusFilter) params.status = statusFilter;
    params.page = page;
    setCurrentPage(page);
    setSearchParams(params);
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Are you sure you want to delete vendor "${name}"? This will also delete all associated contacts, products, and purchase orders.`)) {
      return;
    }

    try {
      await apiClient.deleteVendor(id);
      loadVendors();
    } catch (err) {
      alert(err.message || 'Failed to delete vendor');
    }
  };

  if (loading && vendors.length === 0) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Vendors</h1>
        <Link to="/vendors/new" className="btn btn-primary">
          + New Vendor
        </Link>
      </div>

      <div className="filters-section">
        <form onSubmit={handleSearch} className="search-form">
          <input
            type="text"
            placeholder="Search vendors by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="btn btn-primary">
            Search
          </button>
        </form>

        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={handleStatusChange} className="filter-select">
            <option value="">All</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button onClick={updateFilters} className="btn btn-secondary">
            Apply Filter
          </button>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading />
      ) : vendors.length === 0 ? (
        <div className="empty-state">
          <p>No vendors found.</p>
          <Link to="/vendors/new" className="btn btn-primary">
            Create Your First Vendor
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th>City</th>
                  <th>State</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendors.map((vendor) => (
                  <tr key={vendor.id}>
                    <td>
                      <Link to={`/vendors/${vendor.id}`} className="vendor-link">
                        {vendor.name}
                      </Link>
                    </td>
                    <td>
                      <span className={`status-badge status-${vendor.status}`}>
                        {vendor.status}
                      </span>
                    </td>
                    <td>{vendor.city || '-'}</td>
                    <td>{vendor.state || '-'}</td>
                    <td>{new Date(vendor.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/vendors/${vendor.id}`} className="btn-icon" title="View">
                          👁️
                        </Link>
                        <button
                          onClick={() => handleDelete(vendor.id, vendor.name)}
                          className="btn-icon btn-delete"
                          title="Delete"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="btn btn-secondary"
              >
                Previous
              </button>
              
              <span className="pagination-info">
                Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
              </span>
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === pagination.totalPages}
                className="btn btn-secondary"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default VendorList;
