import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './VendorDetail.css';

function VendorDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [products, setProducts] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    loadVendor();
  }, [id]);

  useEffect(() => {
    if (activeTab === 'contacts') loadContacts();
    if (activeTab === 'products') loadProducts();
    if (activeTab === 'orders') loadPurchaseOrders();
  }, [activeTab]);

  const loadVendor = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiClient.getVendor(id);
      setVendor(response.data);
      setFormData(response.data);
    } catch (err) {
      setError(err.message || 'Failed to load vendor');
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async () => {
    try {
      const response = await apiClient.getVendorContacts(id);
      setContacts(response.data);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const loadProducts = async () => {
    try {
      const response = await apiClient.getVendorProducts(id);
      setProducts(response.data);
    } catch (err) {
      console.error('Failed to load products:', err);
    }
  };

  const loadPurchaseOrders = async () => {
    try {
      const response = await apiClient.getPurchaseOrders({ vendorId: id });
      setPurchaseOrders(response.data.purchaseOrders);
    } catch (err) {
      console.error('Failed to load purchase orders:', err);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData(vendor);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      await apiClient.updateVendor(id, formData);
      setVendor(formData);
      setEditMode(false);
    } catch (err) {
      alert(err.message || 'Failed to update vendor');
    }
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete "${vendor.name}"?`)) return;
    
    try {
      await apiClient.deleteVendor(id);
      navigate('/vendors');
    } catch (err) {
      alert(err.message || 'Failed to delete vendor');
    }
  };

  const handleDeleteContact = async (contactId) => {
    if (!confirm('Delete this contact?')) return;
    
    try {
      await apiClient.deleteContact(contactId);
      loadContacts();
    } catch (err) {
      alert(err.message || 'Failed to delete contact');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm('Delete this product?')) return;
    
    try {
      await apiClient.deleteProduct(productId);
      loadProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete product');
    }
  };

  if (loading) return <Loading />;
  if (error) return <div className="page-container"><div className="error-message">{error}</div></div>;
  if (!vendor) return <div className="page-container"><p>Vendor not found</p></div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>{vendor.name}</h1>
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

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`tab ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts ({contacts.length})
        </button>
        <button
          className={`tab ${activeTab === 'products' ? 'active' : ''}`}
          onClick={() => setActiveTab('products')}
        >
          Products ({products.length})
        </button>
        <button
          className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          Purchase Orders ({purchaseOrders.length})
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'overview' && (
          <div className="vendor-overview">
            {editMode ? (
              <div className="form-container">
                <div className="form-row">
                  <div className="form-group">
                    <label>Vendor Name *</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address || ''}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>State</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state || ''}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="form-group">
                    <label>ZIP</label>
                    <input
                      type="text"
                      name="zip"
                      value={formData.zip || ''}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group">
                  <label>Notes</label>
                  <textarea
                    name="notes"
                    value={formData.notes || ''}
                    onChange={handleChange}
                    rows="4"
                  />
                </div>
              </div>
            ) : (
              <div className="info-grid">
                <div className="info-item">
                  <label>Status:</label>
                  <span className={`status-badge status-${vendor.status}`}>
                    {vendor.status}
                  </span>
                </div>
                <div className="info-item">
                  <label>Address:</label>
                  <span>{vendor.address || '-'}</span>
                </div>
                <div className="info-item">
                  <label>City:</label>
                  <span>{vendor.city || '-'}</span>
                </div>
                <div className="info-item">
                  <label>State:</label>
                  <span>{vendor.state || '-'}</span>
                </div>
                <div className="info-item">
                  <label>ZIP:</label>
                  <span>{vendor.zip || '-'}</span>
                </div>
                <div className="info-item">
                  <label>Created:</label>
                  <span>{new Date(vendor.created_at).toLocaleString()}</span>
                </div>
                {vendor.notes && (
                  <div className="info-item full-width">
                    <label>Notes:</label>
                    <p>{vendor.notes}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {activeTab === 'contacts' && (
          <div>
            <div className="section-header">
              <h2>Contacts</h2>
              <Link to={`/vendors/${id}/contacts/new`} className="btn btn-primary">
                + Add Contact
              </Link>
            </div>
            {contacts.length === 0 ? (
              <p className="empty-message">No contacts yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Role</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {contacts.map((contact) => (
                      <tr key={contact.id}>
                        <td>{contact.name}</td>
                        <td>{contact.email || '-'}</td>
                        <td>{contact.phone || '-'}</td>
                        <td>{contact.role || '-'}</td>
                        <td>
                          <button
                            onClick={() => handleDeleteContact(contact.id)}
                            className="btn-icon btn-delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'products' && (
          <div>
            <div className="section-header">
              <h2>Products</h2>
              <Link to={`/vendors/${id}/products/new`} className="btn btn-primary">
                + Add Product
              </Link>
            </div>
            {products.length === 0 ? (
              <p className="empty-message">No products yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>SKU</th>
                      <th>Unit Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => (
                      <tr key={product.id}>
                        <td>{product.name}</td>
                        <td>{product.sku || '-'}</td>
                        <td>${parseFloat(product.unit_price).toFixed(2)}</td>
                        <td>
                          <span className={`status-badge ${product.active ? 'status-active' : 'status-inactive'}`}>
                            {product.active ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDeleteProduct(product.id)}
                            className="btn-icon btn-delete"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {activeTab === 'orders' && (
          <div>
            <div className="section-header">
              <h2>Purchase Orders</h2>
              <Link to={`/purchase-orders/new?vendorId=${id}`} className="btn btn-primary">
                + New Purchase Order
              </Link>
            </div>
            {purchaseOrders.length === 0 ? (
              <p className="empty-message">No purchase orders yet.</p>
            ) : (
              <div className="table-container">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>PO Number</th>
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
                          <Link to={`/purchase-orders/${po.id}`}>
                            {po.po_number}
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
                          <Link to={`/purchase-orders/${po.id}`} className="btn-icon">
                            👁️
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDetail;
