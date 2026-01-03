import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './PurchaseOrderDetail.css';

function PurchaseOrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [purchaseOrder, setPurchaseOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadPurchaseOrder();
  }, [id]);

  const loadPurchaseOrder = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getPurchaseOrder(id);
      setPurchaseOrder(response.data);
      setFormData({
        status: response.data.status,
        order_date: response.data.order_date,
        notes: response.data.notes || ''
      });
    } catch (err) {
      setError(err.message || 'Failed to load purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({
      status: purchaseOrder.status,
      order_date: purchaseOrder.order_date,
      notes: purchaseOrder.notes || ''
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await apiClient.updatePurchaseOrder(id, formData);
      await loadPurchaseOrder();
      setEditMode(false);
    } catch (err) {
      alert(err.message || 'Failed to update purchase order');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete purchase order "${purchaseOrder.po_number}"?`)) return;
    
    try {
      await apiClient.deletePurchaseOrder(id);
      navigate('/purchase-orders');
    } catch (err) {
      alert(err.message || 'Failed to delete purchase order');
    }
  };

  const calculateTotal = () => {
    if (!purchaseOrder || !purchaseOrder.items) return 0;
    return purchaseOrder.items.reduce((total, item) => {
      return total + (item.qty * parseFloat(item.unit_price));
    }, 0);
  };

  if (loading) return <Loading />;
  if (error) return <div className="page-container"><div className="error-message">{error}</div></div>;
  if (!purchaseOrder) return <div className="page-container"><p>Purchase order not found</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1>Purchase Order {purchaseOrder.po_number}</h1>
          <span className={`status-badge status-${purchaseOrder.status}`}>
            {purchaseOrder.status}
          </span>
        </div>
        <div className="header-actions">
          {!editMode ? (
            <>
              <button onClick={handleEdit} className="btn btn-primary">
                Edit
              </button>
              <button onClick={handleDelete} className="btn btn-danger">
                Delete
              </button>
            </>
          ) : (
            <>
              <button onClick={handleCancel} className="btn btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn btn-primary">
                Save Changes
              </button>
            </>
          )}
        </div>
      </div>

      <div className="po-content">
        <div className="po-header-section">
          {editMode ? (
            <div className="form-container">
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select name="status" value={formData.status} onChange={handleChange}>
                    <option value="draft">Draft</option>
                    <option value="submitted">Submitted</option>
                    <option value="received">Received</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Order Date</label>
                  <input
                    type="date"
                    name="order_date"
                    value={formData.order_date}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
            </div>
          ) : (
            <div className="info-grid">
              <div className="info-item">
                <label>Vendor:</label>
                <Link to={`/vendors/${purchaseOrder.vendor_id}`}>
                  {purchaseOrder.vendor_name}
                </Link>
              </div>
              <div className="info-item">
                <label>Order Date:</label>
                <span>{new Date(purchaseOrder.order_date).toLocaleDateString()}</span>
              </div>
              <div className="info-item">
                <label>Created:</label>
                <span>{new Date(purchaseOrder.created_at).toLocaleString()}</span>
              </div>
              {purchaseOrder.notes && (
                <div className="info-item full-width">
                  <label>Notes:</label>
                  <p>{purchaseOrder.notes}</p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="po-items-section">
          <h2>Line Items</h2>
          {purchaseOrder.items && purchaseOrder.items.length > 0 ? (
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Line Total</th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseOrder.items.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td>{item.product_name}</td>
                      <td>{item.sku || '-'}</td>
                      <td>{item.qty}</td>
                      <td>${parseFloat(item.unit_price).toFixed(2)}</td>
                      <td>${(item.qty * parseFloat(item.unit_price)).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'right', fontWeight: 'bold' }}>
                      Total:
                    </td>
                    <td style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
                      ${calculateTotal().toFixed(2)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          ) : (
            <p className="empty-message">No items in this purchase order.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default PurchaseOrderDetail;
