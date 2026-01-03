import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './PurchaseOrderList.css';

function PurchaseOrderList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState(null);
  
  const [statusFilter, setStatusFilter] = useState(searchParams.get('status') || '');
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get('page')) || 1);

  useEffect(() => {
    loadPurchaseOrders();
  }, [searchParams]);

  const loadPurchaseOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      const params = {
        page: currentPage,
        limit: 10
      };
      
      if (statusFilter) params.status = statusFilter;

      const response = await apiClient.getPurchaseOrders(params);
      setPurchaseOrders(response.data.purchaseOrders);
      setPagination(response.data.pagination);
    } catch (err) {
      setError(err.message || 'Failed to load purchase orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;
    setStatusFilter(value);
    const params = {};
    if (value) params.status = value;
    params.page = 1;
    setCurrentPage(1);
    setSearchParams(params);
  };

  const handlePageChange = (page) => {
    const params = {};
    if (statusFilter) params.status = statusFilter;
    params.page = page;
    setCurrentPage(page);
    setSearchParams(params);
  };

  const handleDelete = async (id, poNumber) => {
    if (!confirm(`Are you sure you want to delete purchase order "${poNumber}"?`)) {
      return;
    }

    try {
      await apiClient.deletePurchaseOrder(id);
      loadPurchaseOrders();
    } catch (err) {
      alert(err.message || 'Failed to delete purchase order');
    }
  };

  if (loading && purchaseOrders.length === 0) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Purchase Orders</h1>
        <Link to="/purchase-orders/new" className="btn btn-primary">
          + New Purchase Order
        </Link>
      </div>

      <div className="filters-section">
        <div className="filter-group">
          <label>Status:</label>
          <select value={statusFilter} onChange={handleStatusChange} className="filter-select">
            <option value="">All</option>
            <option value="draft">Draft</option>
            <option value="submitted">Submitted</option>
            <option value="received">Received</option>
          </select>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <Loading />
      ) : purchaseOrders.length === 0 ? (
        <div className="empty-state">
          <p>No purchase orders found.</p>
          <Link to="/purchase-orders/new" className="btn btn-primary">
            Create Your First Purchase Order
          </Link>
        </div>
      ) : (
        <>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>PO Number</th>
                  <th>Vendor</th>
                  <th>Status</th>
                  <th>Order Date</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {purchaseOrders.map((po) => (
                  <tr key={po.id}>
                    <td>
                      <Link to={`/purchase-orders/${po.id}`} className="po-link">
                        {po.po_number}
                      </Link>
                    </td>
                    <td>
                      <Link to={`/vendors/${po.vendor_id}`}>
                        {po.vendor_name}
                      </Link>
                    </td>
                    <td>
                      <span className={`status-badge status-${po.status}`}>
                        {po.status}
                      </span>
                    </td>
                    <td>{new Date(po.order_date).toLocaleDateString()}</td>
                    <td>{new Date(po.created_at).toLocaleDateString()}</td>
                    <td>
                      <div className="action-buttons">
                        <Link to={`/purchase-orders/${po.id}`} className="btn-icon" title="View">
                          👁️
                        </Link>
                        <button
                          onClick={() => handleDelete(po.id, po.po_number)}
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

export default PurchaseOrderList;
