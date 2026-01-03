import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

function ProductForm() {
  const { vendorId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    unit_price: '',
    active: true
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Product name is required');
      return;
    }
    if (!formData.unit_price || parseFloat(formData.unit_price) < 0) {
      setError('Valid unit price is required');
      return;
    }

    setLoading(true);
    try {
      await apiClient.createVendorProduct(vendorId, formData);
      navigate(`/vendors/${vendorId}`);
    } catch (err) {
      setError(err.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>New Product</h1>
      </div>

      <div className="form-container">
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Product Name *</label>
            <input type="text" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>SKU</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Unit Price *</label>
            <input
              type="number"
              step="0.01"
              name="unit_price"
              value={formData.unit_price}
              onChange={handleChange}
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
              />
              {' '}Active
            </label>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate(`/vendors/${vendorId}`)} className="btn btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;
