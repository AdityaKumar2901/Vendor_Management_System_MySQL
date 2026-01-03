-- Local Vendor Management System - SQLite Schema

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Vendors table
CREATE TABLE IF NOT EXISTS vendors (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name VARCHAR(150) NOT NULL,
  status VARCHAR(20) CHECK(status IN ('active', 'inactive')) DEFAULT 'active',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_vendors_name ON vendors(name);
CREATE INDEX IF NOT EXISTS idx_vendors_status ON vendors(status);

-- Trigger to update updated_at
CREATE TRIGGER IF NOT EXISTS update_vendors_timestamp 
AFTER UPDATE ON vendors
BEGIN
  UPDATE vendors SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;

-- Vendor contacts table
CREATE TABLE IF NOT EXISTS vendor_contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  role VARCHAR(100),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vendor_contacts_vendor_id ON vendor_contacts(vendor_id);

-- Vendor products table
CREATE TABLE IF NOT EXISTS vendor_products (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  active INTEGER DEFAULT 1,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_vendor_products_vendor_id ON vendor_products(vendor_id);
CREATE INDEX IF NOT EXISTS idx_vendor_products_sku ON vendor_products(sku);
CREATE INDEX IF NOT EXISTS idx_vendor_products_active ON vendor_products(active);

-- Purchase orders table
CREATE TABLE IF NOT EXISTS purchase_orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  vendor_id INTEGER NOT NULL,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  status VARCHAR(20) CHECK(status IN ('draft', 'submitted', 'received')) DEFAULT 'draft',
  order_date DATE NOT NULL,
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

CREATE INDEX IF NOT EXISTS idx_purchase_orders_vendor_id ON purchase_orders(vendor_id);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_po_number ON purchase_orders(po_number);
CREATE INDEX IF NOT EXISTS idx_purchase_orders_status ON purchase_orders(status);

-- Purchase order items table
CREATE TABLE IF NOT EXISTS purchase_order_items (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  purchase_order_id INTEGER NOT NULL,
  product_id INTEGER NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES vendor_products(id)
);

CREATE INDEX IF NOT EXISTS idx_purchase_order_items_po_id ON purchase_order_items(purchase_order_id);
CREATE INDEX IF NOT EXISTS idx_purchase_order_items_product_id ON purchase_order_items(product_id);

-- Insert demo user (password: demo123)
INSERT OR IGNORE INTO users (id, name, email, password_hash) VALUES
(1, 'Demo User', 'demo@example.com', '$2a$10$YQGvH5HqN8K8k8k8k8k8k8OZK8k8k8k8k8k8k8k8k8k8k8k8k8k8k');

-- Insert sample vendors
INSERT OR IGNORE INTO vendors (id, name, status, address, city, state, zip, notes) VALUES
(1, 'Tech Supplies Inc', 'active', '123 Main St', 'New York', 'NY', '10001', 'Primary office supplies vendor'),
(2, 'Global Electronics', 'active', '456 Tech Blvd', 'San Francisco', 'CA', '94102', 'Computer hardware and electronics'),
(3, 'Office Furniture Co', 'active', '789 Industrial Way', 'Chicago', 'IL', '60601', 'Furniture and fixtures'),
(4, 'Print Solutions', 'inactive', '321 Print Ave', 'Boston', 'MA', '02101', 'Printing and marketing materials'),
(5, 'Green Supplies', 'active', '555 Eco Drive', 'Seattle', 'WA', '98101', 'Eco-friendly office supplies');

-- Insert vendor contacts
INSERT OR IGNORE INTO vendor_contacts (vendor_id, name, email, phone, role) VALUES
(1, 'John Smith', 'john@techsupplies.com', '555-0101', 'Sales Manager'),
(1, 'Sarah Johnson', 'sarah@techsupplies.com', '555-0102', 'Account Executive'),
(2, 'Mike Chen', 'mike@globalelectronics.com', '555-0201', 'Regional Director'),
(2, 'Lisa Wong', 'lisa@globalelectronics.com', '555-0202', 'Technical Support'),
(3, 'David Brown', 'david@officefurniture.com', '555-0301', 'Sales Representative'),
(4, 'Emily Davis', 'emily@printsolutions.com', '555-0401', 'Customer Service'),
(5, 'Robert Green', 'robert@greensupplies.com', '555-0501', 'Account Manager');

-- Insert vendor products
INSERT OR IGNORE INTO vendor_products (vendor_id, name, sku, unit_price, active) VALUES
(1, 'Ballpoint Pens (Box of 50)', 'PEN-001', 12.99, 1),
(1, 'Sticky Notes Pack', 'NOTE-001', 5.49, 1),
(1, 'Legal Pads (12-pack)', 'PAD-001', 18.99, 1),
(1, 'File Folders (100-pack)', 'FOLD-001', 24.99, 1),
(2, 'USB-C Cable 6ft', 'CABLE-USB-C-6', 15.99, 1),
(2, 'Wireless Mouse', 'MOUSE-WL-001', 29.99, 1),
(2, 'Mechanical Keyboard', 'KB-MECH-001', 89.99, 1),
(2, 'LED Monitor 24"', 'MON-LED-24', 199.99, 1),
(2, 'Laptop Stand', 'STAND-LP-001', 45.99, 1),
(3, 'Ergonomic Office Chair', 'CHAIR-ERG-001', 299.99, 1),
(3, 'Standing Desk 60"', 'DESK-STD-60', 499.99, 1),
(3, 'Filing Cabinet 4-Drawer', 'CAB-FILE-4D', 349.99, 1),
(4, 'Business Cards (1000)', 'BC-1000', 49.99, 0),
(4, 'Letterhead Printing', 'LH-500', 99.99, 0),
(5, 'Recycled Paper Ream', 'PAPER-REC-001', 8.99, 1),
(5, 'Bamboo Desk Organizer', 'ORG-BAMB-001', 22.99, 1),
(5, 'Biodegradable Pens', 'PEN-BIO-001', 14.99, 1);

-- Insert sample purchase orders
INSERT OR IGNORE INTO purchase_orders (vendor_id, po_number, status, order_date, notes) VALUES
(1, 'PO-2026-0001', 'received', '2026-01-01', 'Initial office supplies order'),
(2, 'PO-2026-0002', 'submitted', '2026-01-02', 'Computer accessories for new hires'),
(3, 'PO-2026-0003', 'draft', '2026-01-03', 'Office furniture expansion'),
(5, 'PO-2026-0004', 'submitted', '2026-01-03', 'Eco-friendly supplies quarterly order');

-- Insert purchase order items
INSERT OR IGNORE INTO purchase_order_items (purchase_order_id, product_id, qty, unit_price) VALUES
(1, 1, 10, 12.99), (1, 2, 20, 5.49), (1, 3, 5, 18.99),
(2, 5, 15, 15.99), (2, 6, 15, 29.99), (2, 7, 8, 89.99),
(3, 10, 12, 299.99), (3, 11, 6, 499.99), (3, 12, 4, 349.99),
(4, 15, 50, 8.99), (4, 16, 10, 22.99), (4, 17, 15, 14.99);
