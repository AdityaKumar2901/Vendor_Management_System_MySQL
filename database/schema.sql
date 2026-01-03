-- Local Vendor Management System - Database Schema (MySQL)
-- Drop database if exists and create fresh
DROP DATABASE IF EXISTS vendor_management;
CREATE DATABASE vendor_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE vendor_management;

-- Users table
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email (email)
) ENGINE=InnoDB;

-- Vendors table
CREATE TABLE vendors (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  status ENUM('active', 'inactive') DEFAULT 'active',
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  zip VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_name (name),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Vendor contacts table
CREATE TABLE vendor_contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150),
  phone VARCHAR(50),
  role VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  INDEX idx_vendor_id (vendor_id)
) ENGINE=InnoDB;

-- Vendor products table
CREATE TABLE vendor_products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  name VARCHAR(150) NOT NULL,
  sku VARCHAR(100),
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id) ON DELETE CASCADE,
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_sku (sku),
  INDEX idx_active (active)
) ENGINE=InnoDB;

-- Purchase orders table
CREATE TABLE purchase_orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  vendor_id INT NOT NULL,
  po_number VARCHAR(50) UNIQUE NOT NULL,
  status ENUM('draft', 'submitted', 'received') DEFAULT 'draft',
  order_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (vendor_id) REFERENCES vendors(id),
  INDEX idx_vendor_id (vendor_id),
  INDEX idx_po_number (po_number),
  INDEX idx_status (status)
) ENGINE=InnoDB;

-- Purchase order items table
CREATE TABLE purchase_order_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  purchase_order_id INT NOT NULL,
  product_id INT NOT NULL,
  qty INT NOT NULL DEFAULT 1,
  unit_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  FOREIGN KEY (purchase_order_id) REFERENCES purchase_orders(id) ON DELETE CASCADE,
  FOREIGN KEY (product_id) REFERENCES vendor_products(id),
  INDEX idx_purchase_order_id (purchase_order_id),
  INDEX idx_product_id (product_id)
) ENGINE=InnoDB;
