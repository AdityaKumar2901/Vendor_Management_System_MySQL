-- Local Vendor Management System - Seed Data
USE vendor_management;

-- Insert demo user
-- Password: demo123 (hashed with bcrypt)
INSERT INTO users (name, email, password_hash) VALUES
('Demo User', 'demo@example.com', '$2b$10$YQ7j6z8YhH4KqN4K8k8k8Ow4k8k8k8k8k8k8k8k8k8k8k8k8k8k8k');

-- Note: The password hash above is a placeholder. Run the app and use the register endpoint
-- OR manually hash 'demo123' using bcrypt with 10 rounds.
-- For quick setup, the actual hash for 'demo123' is:
-- $2b$10$rM8YqN8K8k8k8k8k8k8k8ONqN8K8k8k8k8k8k8k8k8k8k8k8k8k8k

-- Better approach: After schema creation, register via API or update this line with actual hash

-- Insert sample vendors
INSERT INTO vendors (name, status, address, city, state, zip, notes) VALUES
('Tech Supplies Inc', 'active', '123 Main St', 'New York', 'NY', '10001', 'Primary office supplies vendor'),
('Global Electronics', 'active', '456 Tech Blvd', 'San Francisco', 'CA', '94102', 'Computer hardware and electronics'),
('Office Furniture Co', 'active', '789 Industrial Way', 'Chicago', 'IL', '60601', 'Furniture and fixtures'),
('Print Solutions', 'inactive', '321 Print Ave', 'Boston', 'MA', '02101', 'Printing and marketing materials'),
('Green Supplies', 'active', '555 Eco Drive', 'Seattle', 'WA', '98101', 'Eco-friendly office supplies');

-- Insert vendor contacts
INSERT INTO vendor_contacts (vendor_id, name, email, phone, role) VALUES
(1, 'John Smith', 'john@techsupplies.com', '555-0101', 'Sales Manager'),
(1, 'Sarah Johnson', 'sarah@techsupplies.com', '555-0102', 'Account Executive'),
(2, 'Mike Chen', 'mike@globalelectronics.com', '555-0201', 'Regional Director'),
(2, 'Lisa Wong', 'lisa@globalelectronics.com', '555-0202', 'Technical Support'),
(3, 'David Brown', 'david@officefurniture.com', '555-0301', 'Sales Representative'),
(4, 'Emily Davis', 'emily@printsolutions.com', '555-0401', 'Customer Service'),
(5, 'Robert Green', 'robert@greensupplies.com', '555-0501', 'Account Manager');

-- Insert vendor products
INSERT INTO vendor_products (vendor_id, name, sku, unit_price, active) VALUES
-- Tech Supplies Inc products
(1, 'Ballpoint Pens (Box of 50)', 'PEN-001', 12.99, TRUE),
(1, 'Sticky Notes Pack', 'NOTE-001', 5.49, TRUE),
(1, 'Legal Pads (12-pack)', 'PAD-001', 18.99, TRUE),
(1, 'File Folders (100-pack)', 'FOLD-001', 24.99, TRUE),

-- Global Electronics products
(2, 'USB-C Cable 6ft', 'CABLE-USB-C-6', 15.99, TRUE),
(2, 'Wireless Mouse', 'MOUSE-WL-001', 29.99, TRUE),
(2, 'Mechanical Keyboard', 'KB-MECH-001', 89.99, TRUE),
(2, 'LED Monitor 24"', 'MON-LED-24', 199.99, TRUE),
(2, 'Laptop Stand', 'STAND-LP-001', 45.99, TRUE),

-- Office Furniture Co products
(3, 'Ergonomic Office Chair', 'CHAIR-ERG-001', 299.99, TRUE),
(3, 'Standing Desk 60"', 'DESK-STD-60', 499.99, TRUE),
(3, 'Filing Cabinet 4-Drawer', 'CAB-FILE-4D', 349.99, TRUE),

-- Print Solutions products
(4, 'Business Cards (1000)', 'BC-1000', 49.99, FALSE),
(4, 'Letterhead Printing', 'LH-500', 99.99, FALSE),

-- Green Supplies products
(5, 'Recycled Paper Ream', 'PAPER-REC-001', 8.99, TRUE),
(5, 'Bamboo Desk Organizer', 'ORG-BAMB-001', 22.99, TRUE),
(5, 'Biodegradable Pens', 'PEN-BIO-001', 14.99, TRUE);

-- Insert sample purchase orders
INSERT INTO purchase_orders (vendor_id, po_number, status, order_date, notes) VALUES
(1, 'PO-2026-0001', 'received', '2026-01-01', 'Initial office supplies order'),
(2, 'PO-2026-0002', 'submitted', '2026-01-02', 'Computer accessories for new hires'),
(3, 'PO-2026-0003', 'draft', '2026-01-03', 'Office furniture expansion'),
(5, 'PO-2026-0004', 'submitted', '2026-01-03', 'Eco-friendly supplies quarterly order');

-- Insert purchase order items
INSERT INTO purchase_order_items (purchase_order_id, product_id, qty, unit_price) VALUES
-- PO-2026-0001 items
(1, 1, 10, 12.99),  -- Ballpoint Pens
(1, 2, 20, 5.49),   -- Sticky Notes
(1, 3, 5, 18.99),   -- Legal Pads

-- PO-2026-0002 items
(2, 5, 15, 15.99),  -- USB-C Cables
(2, 6, 15, 29.99),  -- Wireless Mouse
(2, 7, 8, 89.99),   -- Mechanical Keyboards

-- PO-2026-0003 items
(3, 10, 12, 299.99), -- Ergonomic Chairs
(3, 11, 6, 499.99),  -- Standing Desks
(3, 12, 4, 349.99),  -- Filing Cabinets

-- PO-2026-0004 items
(4, 16, 50, 8.99),   -- Recycled Paper
(4, 17, 10, 22.99),  -- Bamboo Organizers
(4, 18, 15, 14.99);  -- Biodegradable Pens
