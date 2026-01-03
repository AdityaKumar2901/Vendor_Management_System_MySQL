import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/client';
import Loading from '../components/Loading';
import './PurchaseOrderForm.css';

function PurchaseOrderForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedVendorId = searchParams.get('vendorId');

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    vendor_id: preselectedVendorId || '',
    po_number: '',
    status: 'draft',
    order_date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const [items, setItems] = useState([
    { product_id: '', qty: 1, unit_price: '' }
  ]);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    if (formData.vendor_id) {
      loadProducts(formData.vendor_id);
    }
  }, [formData.vendor_id]);

  const loadVendors = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVendors({ limit: 100, status: 'active' });
      setVendors(response.data.vendors);
    } catch (err) {
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  };

  const loadProducts = async (vendorId) => {
    try {
      const response = await apiClient.getVendorProducts(vendorId);
      setProducts(response.data.filter(p => p.active));
    } catch (err) {
      console.error('Failed to load products:', err);
      setProducts([]);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    // Auto-fill unit price when product is selected
    if (field === 'product_id' && value) {
      const product = products.find(p => p.id === parseInt(value));
      if (product) {
        newItems[index].unit_price = product.unit_price;
      }
    }
    
    setItems(newItems);
  };

  const addItem = () => {
    setItems([...items, { product_id: '', qty: 1, unit_price: '' }]);
  };

  const removeItem = (index) => {
    if (items.length === 1) {
      alert('At least one item is required');
      return;
    }
    setItems(items.filter((_, i) => i !== index));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const qty = parseInt(item.qty) || 0;
      const price = parseFloat(item.unit_price) || 0;
      return total + (qty * price);
    }, 0);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.vendor_id) {
      setError('Please select a vendor');
      return;
    }
    if (!formData.po_number.trim()) {
      setError('PO number is required');
      return;
    }
    if (!formData.order_date) {
      setError('Order date is required');
      return;
    }

    // Validate items
    for (let i = 0; i < items.length; i++) {
      if (!items[i].product_id) {
        setError(`Item ${i + 1}: Please select a product`);
        return;
      }
      if (!items[i].qty || items[i].qty < 1) {
        setError(`Item ${i + 1}: Quantity must be at least 1`);
        return;
      }
      if (!items[i].unit_price || items[i].unit_price < 0) {
        setError(`Item ${i + 1}: Unit price is required`);
        return;
      }
    }

    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        vendor_id: parseInt(formData.vendor_id),
        items: items.map(item => ({
          product_id: parseInt(item.product_id),
          qty: parseInt(item.qty),
          unit_price: parseFloat(item.unit_price)
        }))
      };

      const response = await apiClient.createPurchaseOrder(payload);
      navigate(`/purchase-orders/${response.data.id}`);
    } catch (err) {
      setError(err.message || 'Failed to create purchase order');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (confirm('Discard changes and go back?')) {
      navigate('/purchase-orders');
    }
  };

  if (loading && vendors.length === 0) {
    return <Loading />;
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>New Purchase Order</h1>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="vendor_id">Vendor *</label>
              <select
                id="vendor_id"
                name="vendor_id"
                value={formData.vendor_id}
                onChange={handleChange}
                disabled={loading || !!preselectedVendorId}
                required
              >
                <option value="">Select a vendor</option>
                {vendors.map((vendor) => (
                  <option key={vendor.id} value={vendor.id}>
                    {vendor.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="po_number">PO Number *</label>
              <input
                type="text"
                id="po_number"
                name="po_number"
                value={formData.po_number}
                onChange={handleChange}
                placeholder="PO-2026-XXXX"
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                disabled={loading}
              >
                <option value="draft">Draft</option>
                <option value="submitted">Submitted</option>
                <option value="received">Received</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="order_date">Order Date *</label>
              <input
                type="date"
                id="order_date"
                name="order_date"
                value={formData.order_date}
                onChange={handleChange}
                disabled={loading}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Additional notes"
              rows="3"
              disabled={loading}
            />
          </div>

          <div className="items-section">
            <div className="section-header">
              <h2>Line Items</h2>
              <button
                type="button"
                onClick={addItem}
                className="btn btn-secondary"
                disabled={!formData.vendor_id || loading}
              >
                + Add Item
              </button>
            </div>

            {!formData.vendor_id ? (
              <p className="info-message">Please select a vendor first to add items.</p>
            ) : products.length === 0 ? (
              <p className="info-message">This vendor has no active products. Please add products first.</p>
            ) : (
              <div className="items-list">
                {items.map((item, index) => (
                  <div key={index} className="item-row">
                    <div className="item-number">{index + 1}</div>
                    
                    <div className="item-fields">
                      <div className="form-group">
                        <label>Product *</label>
                        <select
                          value={item.product_id}
                          onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                          disabled={loading}
                          required
                        >
                          <option value="">Select product</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.name} - ${parseFloat(product.unit_price).toFixed(2)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Quantity *</label>
                        <input
                          type="number"
                          value={item.qty}
                          onChange={(e) => handleItemChange(index, 'qty', e.target.value)}
                          min="1"
                          disabled={loading}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Unit Price *</label>
                        <input
                          type="number"
                          step="0.01"
                          value={item.unit_price}
                          onChange={(e) => handleItemChange(index, 'unit_price', e.target.value)}
                          min="0"
                          disabled={loading}
                          required
                        />
                      </div>

                      <div className="form-group">
                        <label>Line Total</label>
                        <div className="line-total">
                          ${((parseInt(item.qty) || 0) * (parseFloat(item.unit_price) || 0)).toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="btn-remove"
                      disabled={loading}
                      title="Remove item"
                    >
                      ✕
                    </button>
                  </div>
                ))}

                <div className="total-section">
                  <strong>Total: ${calculateTotal().toFixed(2)}</strong>
                </div>
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={loading}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Purchase Order'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PurchaseOrderForm;
