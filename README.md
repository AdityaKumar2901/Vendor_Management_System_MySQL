# Local Vendor Management System

A comprehensive full-stack web application for managing vendors, contacts, products, and purchase orders with advanced analytics and visualization capabilities.

## 🛠️ Tech Stack

### Backend
- **Node.js (v24.4.1)** + **Express.js** - RESTful API server
- **MySQL** - Relational database management system
- **mysql2** - MySQL client for Node.js with Promise support
- **JWT (jsonwebtoken)** - Secure authentication with bearer tokens
- **bcryptjs** - Password hashing (pure JS implementation)
- **dotenv** - Environment variables management
- **nodemon** - Development hot-reload

### Frontend
- **React 18** - Modern UI framework with hooks
- **Vite** - Lightning-fast build tool and dev server
- **React Router v6** - Client-side routing
- **Recharts v3.6.0** - Beautiful, responsive charts for analytics
- **CSS Modules** - Component-scoped styling

## 🎯 Key Features

### Core Functionality
- ✅ **User Authentication** - Secure JWT-based login/logout with token refresh
- ✅ **User Registration** - Self-service vendor signup with email validation
- ✅ **Vendor Management** - Complete CRUD operations with validation
- ✅ **Contact Management** - Multiple contacts per vendor (one-to-many)
- ✅ **Product Catalog** - Vendor-specific products with pricing
- ✅ **Purchase Orders** - Multi-line PO creation with status tracking

### Analytics & Visualization
- 📊 **Spend by Vendor** - Bar chart showing total spending per vendor
- 📈 **Spend Trend Analysis** - Line chart tracking spending over time (monthly)
- 🥧 **PO Status Breakdown** - Pie chart for order status distribution
- 🎯 **Interactive Filters** - Filter by vendor and date range
- 📅 **Date Presets** - Quick filters (Last 7 days, 30 days, 3 months, 6 months, Year)

### UI/UX Features
- 🔍 **Search and Filter** - Real-time vendor search
- 📄 **Pagination** - Efficient data browsing
- ✔️ **Form Validation** - Client-side and server-side validation
- ⚠️ **Error Handling** - User-friendly error messages
- 📱 **Responsive Design** - Works on desktop, tablet, and mobile
- 🎨 **Modern UI** - Clean, professional interface


## 📁 Project Structure

```
Local Vendor Management System/
├── backend/
│   ├── database/
│   │   ├── schema.sqlite.sql         # SQLite database schema
│   │   └── vendor_management.db      # SQLite database file (auto-generated)
│   ├── src/
│   │   ├── db/
│   │   │   └── index.js              # SQLite connection & query helper
│   │   ├── middleware/
│   │   │   ├── auth.js               # JWT authentication middleware
│   │   │   └── errorHandler.js       # Centralized error handler
│   │   ├── routes/
│   │   │   ├── auth.routes.js        # Login/Register endpoints
│   │   │   ├── vendors.routes.js     # Vendor CRUD operations
│   │   │   ├── contacts.routes.js    # Contact management
│   │   │   ├── products.routes.js    # Product management
│   │   │   ├── purchaseOrders.routes.js  # Purchase order operations
│   │   │   └── analytics.routes.js   # Analytics & reporting endpoints
│   │   ├── app.js                    # Express app configuration
│   │   └── server.js                 # Server entry point (Port 5000)
│   ├── package.json
│   ├── .env                          # Environment variables
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── client.js             # Axios-based API client wrapper
│   │   ├── components/
│   │   │   ├── Navbar.jsx            # Top navigation bar
│   │   │   ├── Loading.jsx           # Loading spinner component
│   │   │   ├── SpendByVendorChart.jsx    # Bar chart component
│   │   │   ├── SpendTrendChart.jsx       # Line chart component
│   │   │   └── POStatusChart.jsx         # Pie chart component
│   │   ├── pages/
│   │   │   ├── Login.jsx             # Login page
│   │   │   ├── Register.jsx          # User registration page
│   │   │   ├── Dashboard.jsx         # Dashboard with stats & charts
│   │   │   ├── VendorList.jsx        # Vendors list with search
│   │   │   ├── VendorForm.jsx        # Create/Edit vendor form
│   │   │   ├── VendorDetail.jsx      # Vendor details with tabs
│   │   │   ├── ContactForm.jsx       # Add/Edit contact form
│   │   │   ├── ProductForm.jsx       # Add/Edit product form
│   │   │   ├── PurchaseOrderList.jsx # Purchase orders list
│   │   │   ├── PurchaseOrderForm.jsx # Create purchase order
│   │   │   └── PurchaseOrderDetail.jsx # PO details view
│   │   ├── styles/                   # Global CSS files
│   │   ├── App.jsx                   # Main app with routing
│   │   └── main.jsx                  # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── package.json
│   └── .env                          # Frontend environment variables
├── .gitignore
└── README.md                         # This file
```

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **MySQL** (v8.0 or higher) - [Download here](https://dev.mysql.com/downloads/mysql/) or use XAMPP
- **Git** (optional, for version control)

### Installation Steps

#### 1. Clone or Download the Project

```bash
# If using Git
git clone <repository-url>
cd "Local Vendor Management System"

# Or simply navigate to the project folder
cd "c:\Aditya\Projects\New folder"
```

#### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# The following packages will be installed:
# - express: Web framework
# - cors: Cross-origin resource sharing
# - dotenv: Environment variables
# - jsonwebtoken: JWT authentication
# - bcryptjs: Password hashing
# - mysql2: MySQL database driver
# - nodemon: Development auto-reload

# Create .env file (if not exists)
# Copy .env.example to .env and configure
```

**Backend .env Configuration:**
```env
PORT=5000
NODE_ENV=development

# MySQL Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=vendor_management

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=24h
```

#### 3. Database Setup

**Create Database in MySQL:**

```bash
# Method 1: Using MySQL Command Line
mysql -u root -p

# Then run these commands:
CREATE DATABASE vendor_management;
USE vendor_management;
exit;

# Method 2: Using XAMPP phpMyAdmin
# - Open http://localhost/phpmyadmin
# - Click "New" to create database
# - Name it "vendor_management"
```

**Import Schema:**

```bash
# Import database schema
mysql -u root -p vendor_management < database/schema.sql

# Import sample data (optional)
mysql -u root -p vendor_management < database/seed.sql
```

**Sample data includes:**
- Demo user: demo@example.com / demo123
- 5 sample vendors
- Multiple contacts, products, and purchase orders

#### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# The following packages will be installed:
# - react & react-dom: UI framework
# - react-router-dom: Routing
# - recharts: Chart library
# - vite: Build tool & dev server

# Frontend runs on port 3000 by default
```

### Running the Application

#### Start Backend Server

```bash
# From backend directory
cd backend
npm run dev

# Output:
# [nodemon] starting `node src/server.js`
# ✅ MySQL database connected successfully
# Server running on port 5000
```

Backend will be available at: **http://localhost:5000**

#### Start Frontend Development Server

```bash
# From frontend directory (in a new terminal)
cd frontend
npm run dev

# Output:
# VITE v5.x.x  ready in xxx ms
# ➜  Local:   http://localhost:3000/
# ➜  Network: use --host to expose
```

Frontend will be available at: **http://localhost:3000**

### First Login

Open your browser and navigate to **http://localhost:3000**

**Demo Credentials:**
- **Email:** demo@example.com
- **Password:** demo123

Or click "Sign up here" to create a new account.

## 🗄️ Database Schema

### Tables Overview

**users**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- name (VARCHAR(255) NOT NULL)
- email (VARCHAR(255) UNIQUE NOT NULL)
- password_hash (VARCHAR(255) NOT NULL)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

**vendors**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- name (VARCHAR(255) NOT NULL)
- email (VARCHAR(255))
- phone (VARCHAR(50))
- address (TEXT)
- city (VARCHAR(100))
- state (VARCHAR(100))
- zip_code (VARCHAR(20))
- country (VARCHAR(100))
- tax_id (VARCHAR(50))
- payment_terms (VARCHAR(50) DEFAULT 'Net 30')
- active (BOOLEAN DEFAULT TRUE)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

**contacts**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- vendor_id (INT, FOREIGN KEY)
- name (VARCHAR(255) NOT NULL)
- title (VARCHAR(100))
- email (VARCHAR(255))
- phone (VARCHAR(50))
- is_primary (BOOLEAN DEFAULT FALSE)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

**products**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- vendor_id (INT, FOREIGN KEY)
- name (VARCHAR(255) NOT NULL)
- sku (VARCHAR(100))
- description (TEXT)
- unit_price (DECIMAL(10,2))
- currency (VARCHAR(10) DEFAULT 'USD')
- active (BOOLEAN DEFAULT TRUE)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

**purchase_orders**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- vendor_id (INT, FOREIGN KEY)
- po_number (VARCHAR(50) UNIQUE NOT NULL)
- order_date (DATE NOT NULL)
- expected_delivery (DATE)
- status (VARCHAR(50) DEFAULT 'draft')  -- draft, submitted, approved, received, cancelled
- notes (TEXT)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
- updated_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP)
```

**purchase_order_items**
```sql
- id (INT PRIMARY KEY AUTO_INCREMENT)
- purchase_order_id (INT, FOREIGN KEY)
- product_id (INT, FOREIGN KEY)
- quantity (INT NOT NULL)
- unit_price (DECIMAL(10,2) NOT NULL)
- created_at (TIMESTAMP DEFAULT CURRENT_TIMESTAMP)
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | User login | No |
| GET | `/api/auth/me` | Get current user | Yes |

**Register/Login Request:**
```json
{
  "name": "John Doe",        // Required for register only
  "email": "user@example.com",
  "password": "password123"
}
```

**Login Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1...",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com"
  }
}
```

### Vendors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/vendors` | Get all vendors (with pagination & search) | Yes |
| GET | `/api/vendors/:id` | Get vendor by ID | Yes |
| POST | `/api/vendors` | Create new vendor | Yes |
| PUT | `/api/vendors/:id` | Update vendor | Yes |
| DELETE | `/api/vendors/:id` | Delete vendor | Yes |

**Query Parameters for GET /api/vendors:**
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search by name, email, or phone

### Contacts

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/contacts/vendor/:vendorId` | Get all contacts for a vendor | Yes |
| POST | `/api/contacts` | Create new contact | Yes |
| PUT | `/api/contacts/:id` | Update contact | Yes |
| DELETE | `/api/contacts/:id` | Delete contact | Yes |

### Products

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/products/vendor/:vendorId` | Get all products for a vendor | Yes |
| POST | `/api/products` | Create new product | Yes |
| PUT | `/api/products/:id` | Update product | Yes |
| DELETE | `/api/products/:id` | Delete product | Yes |

### Purchase Orders

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/purchase-orders` | Get all purchase orders | Yes |
| GET | `/api/purchase-orders/:id` | Get purchase order by ID (with items) | Yes |
| POST | `/api/purchase-orders` | Create new purchase order | Yes |
| PUT | `/api/purchase-orders/:id` | Update purchase order | Yes |
| DELETE | `/api/purchase-orders/:id` | Delete purchase order | Yes |

**Create Purchase Order Request:**
```json
{
  "vendor_id": 1,
  "po_number": "PO-2024-001",
  "order_date": "2024-01-15",
  "expected_delivery": "2024-01-30",
  "status": "draft",
  "notes": "Urgent order",
  "items": [
    {
      "product_id": 1,
      "quantity": 10,
      "unit_price": 99.99
    }
  ]
}
```

### Analytics

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/analytics/spend-by-vendor` | Total spending by vendor | Yes |
| GET | `/api/analytics/spend-trend` | Spending trend over time | Yes |
| GET | `/api/analytics/po-status` | Purchase order status distribution | Yes |

**Query Parameters for Analytics:**
- `startDate` - Start date (YYYY-MM-DD)
- `endDate` - End date (YYYY-MM-DD)
- `vendorId` - Filter by specific vendor (optional, for spend-trend)
- `interval` - Time interval: 'day', 'week', 'month' (default: 'month')

**Spend by Vendor Response:**
```json
[
  {
    "vendorId": 1,
    "vendorName": "TechSupply Co.",
    "totalSpend": 15750.50
  }
]
```

**Spend Trend Response:**
```json
[
  {
    "period": "2024-01",
    "totalSpend": 5250.00
  },
  {
    "period": "2024-02",
    "totalSpend": 8750.25
  }
]
```

**PO Status Response:**
```json
[
  {
    "status": "draft",
    "count": 5
  },
  {
    "status": "submitted",
    "count": 12
  },
  {
    "status": "received",
    "count": 38
  }
]
```

### Dashboard Stats

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics | Yes |

**Response:**
```json
{
  "vendorCount": 25,
  "productCount": 156,
  "purchaseOrderCount": 78,
  "activeOrders": 12
}
```

## 📊 Analytics Features

### 1. Spend by Vendor Bar Chart
- Visualizes total spending per vendor
- Color-coded bars for easy comparison
- Currency formatting with $ symbol
- Responsive tooltip showing exact amounts

### 2. Spend Trend Line Chart
- Tracks spending over time (monthly aggregation)
- Filter by specific vendor or view all vendors
- Smooth gradient line with data points
- Date range selection with quick presets

### 3. Purchase Order Status Pie Chart
- Visual breakdown of PO statuses
- Custom colors: Draft (gray), Submitted (orange), Received (green)
- Percentage display with custom legend
- Click-through for detailed status info

### Filter Controls
- **Vendor Selector**: Filter data by specific vendor
- **Date Presets**: 
  - Last 7 days
  - Last 30 days
  - Last 3 months
  - Last 6 months
  - Last year
  - All time
- **Custom Date Range**: Select start and end dates

## 🎨 Application Screenshots

### Login & Registration
- Clean, centered login form with validation
- Registration page with password confirmation
- Error messages for invalid credentials
- Remember me functionality

### Dashboard
- **Stats Grid**: 4 key metrics (Vendors, Products, POs, Active Orders)
- **Interactive Charts**: 3 chart types with real-time data
- **Quick Actions**: Navigate to Vendors, Products, or Create PO
- **Date Filters**: Dynamic filtering with preset options

### Vendor Management
- **Vendor List**: Search, filter, and paginate vendors
- **Vendor Details**: Tabbed interface (Overview, Contacts, Products, Purchase Orders)
- **Add/Edit Forms**: Comprehensive vendor information capture
- **Status Indicators**: Visual active/inactive status

### Purchase Orders
- **PO List**: Filterable by status and vendor
- **PO Creation**: Multi-step form with line items
- **PO Details**: Complete order information with item breakdown
- **Status Workflow**: Draft → Submitted → Received/Cancelled

## 🔒 Authentication Flow

1. **Registration**: User signs up with name, email, and password
2. **Password Hashing**: bcryptjs hashes password with 10 salt rounds
3. **Login**: User provides credentials
4. **JWT Token**: Backend generates JWT token (24-hour expiry)
5. **Token Storage**: Frontend stores token in localStorage
6. **Protected Routes**: Token included in Authorization header for all API calls
7. **Logout**: Token removed from localStorage

## 🛡️ Security Features

- ✅ Password hashing with bcryptjs (10 rounds)
- ✅ JWT token-based authentication
- ✅ Protected API routes with middleware
- ✅ CORS configuration for frontend-backend communication
- ✅ SQL injection prevention (parameterized queries)
- ✅ Input validation on frontend and backend
- ✅ Error messages without sensitive information

## 🧪 Testing

### Manual Testing Checklist

**Authentication**
- [ ] Register new user successfully
- [ ] Login with valid credentials
- [ ] Login fails with invalid credentials
- [ ] Token expires after 24 hours
- [ ] Protected routes redirect to login

**Vendor Management**
- [ ] Create new vendor
- [ ] Update vendor information
- [ ] Search vendors by name/email/phone
- [ ] Pagination works correctly
- [ ] Delete vendor (with confirmation)

**Analytics**
- [ ] Charts load with data
- [ ] Vendor filter updates charts
- [ ] Date range filter works
- [ ] Quick date presets function correctly
- [ ] Charts are responsive on mobile

## 🐛 Troubleshooting

### Backend Won't Start

**Issue:** Port 5000 already in use
```bash
# Find and kill the process using port 5000
netstat -ano | findstr :5000
taskkill /PID <process_id> /F
```

**Issue:** Database file locked
```bash
# Delete and recreate database
cd backend/database
del vendor_management.db
# Restart backend - database will auto-recreate
```

### Frontend Won't Start

**Issue:** Port 3000 already in use
```bash
# Change port in vite.config.js or kill process
netstat -ano | findstr :3000
taskkill /PID <process_id> /F
```

### API Calls Failing

**Issue:** CORS errors
- Check backend CORS configuration in `app.js`
- Ensure frontend URL matches CORS origin

**Issue:** 401 Unauthorized
- Token expired (login again)
- Token missing (check localStorage)
- Invalid token format

### Charts Not Displaying

**Issue:** Recharts not installed
```bash
cd frontend
npm install recharts
```

**Issue:** No data in charts
- Check if purchase orders exist in database
- Verify analytics API endpoints are working
- Check browser console for errors

## 📦 Production Deployment

### Environment Variables

**Backend (.env):**
```env
PORT=5000
JWT_SECRET=<strong-random-secret-key>
JWT_EXPIRES_IN=24h
NODE_ENV=production
```

**Frontend:**
Update API base URL in `src/api/client.js`:
```javascript
const API_URL = process.env.VITE_API_URL || 'https://your-backend-domain.com/api';
```

### Build for Production

**Frontend:**
```bash
cd frontend
npm run build
# Output in dist/ folder
```

**Backend:**
```bash
cd backend
# Use PM2 or similar for production
npm install -g pm2
pm2 start src/server.js --name vendor-management
```

### Deployment Options

- **Frontend**: Vercel, Netlify, GitHub Pages
- **Backend**: Heroku, AWS EC2, DigitalOcean, Railway
- **Database**: Database file can be persisted with volume mounts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Aditya**
- GitHub: [@yourusername](https://github.com/yourusername)
- Email: your.email@example.com

## 🙏 Acknowledgments

- React team for the amazing framework
- Recharts for beautiful charts
- Express.js community
- sql.js for embedded SQLite
- All open-source contributors

## 📞 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Email: your.email@example.com

## 🎯 Future Enhancements

- [ ] Email notifications for new purchase orders
- [ ] PDF export for purchase orders
- [ ] Multi-currency support
- [ ] Advanced reporting with custom date ranges
- [ ] Vendor performance metrics
- [ ] File attachments for POs (invoices, receipts)
- [ ] User roles and permissions (Admin, Manager, Viewer)
- [ ] Audit log for all changes
- [ ] Export data to Excel/CSV
- [ ] Mobile app (React Native)
- [ ] Real-time updates with WebSockets
- [ ] Integration with accounting software (QuickBooks, Xero)

---

**Built with ❤️ using React, Node.js, and SQLite**

# Production mode
npm start
```

The backend will run on **http://localhost:5000**

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file from example (optional)
cp .env.example .env
```

The default API URL is `http://localhost:5000/api`. You can override this in `.env`:

```env
VITE_API_URL=http://localhost:5000/api
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will run on **http://localhost:3000** and automatically open in your browser.

## 🔐 Demo Credentials

Once the database is seeded, you can login with:

- **Email:** `demo@example.com`
- **Password:** `demo123`

## 📚 API Documentation

### Authentication

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "demo@example.com",
  "password": "demo123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "token": "jwt_token_here",
    "user": { "id": 1, "name": "Demo User", "email": "demo@example.com" }
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Vendors

#### Get All Vendors
```http
GET /api/vendors?search=tech&status=active&page=1&limit=10
Authorization: Bearer {token}
```

#### Get Single Vendor
```http
GET /api/vendors/:id
Authorization: Bearer {token}
```

#### Create Vendor
```http
POST /api/vendors
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Tech Supplies Inc",
  "status": "active",
  "address": "123 Main St",
  "city": "New York",
  "state": "NY",
  "zip": "10001",
  "notes": "Primary supplier"
}
```

#### Update Vendor
```http
PUT /api/vendors/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name",
  "status": "inactive"
}
```

#### Delete Vendor
```http
DELETE /api/vendors/:id
Authorization: Bearer {token}
```

### Contacts

#### Get Vendor Contacts
```http
GET /api/vendors/:vendorId/contacts
Authorization: Bearer {token}
```

#### Create Contact
```http
POST /api/vendors/:vendorId/contacts
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john@vendor.com",
  "phone": "555-0101",
  "role": "Sales Manager"
}
```

#### Update Contact
```http
PUT /api/contacts/:contactId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "John Smith",
  "email": "john.smith@vendor.com"
}
```

#### Delete Contact
```http
DELETE /api/contacts/:contactId
Authorization: Bearer {token}
```

### Products

#### Get Vendor Products
```http
GET /api/vendors/:vendorId/products
Authorization: Bearer {token}
```

#### Create Product
```http
POST /api/vendors/:vendorId/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Wireless Mouse",
  "sku": "MOUSE-001",
  "unit_price": 29.99,
  "active": true
}
```

#### Update Product
```http
PUT /api/products/:productId
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Wireless Mouse v2",
  "unit_price": 34.99
}
```

#### Delete Product
```http
DELETE /api/products/:productId
Authorization: Bearer {token}
```

### Purchase Orders

#### Get All Purchase Orders
```http
GET /api/purchase-orders?vendorId=1&status=draft&page=1&limit=10
Authorization: Bearer {token}
```

#### Get Single Purchase Order
```http
GET /api/purchase-orders/:id
Authorization: Bearer {token}
```

#### Create Purchase Order
```http
POST /api/purchase-orders
Authorization: Bearer {token}
Content-Type: application/json

{
  "vendor_id": 1,
  "po_number": "PO-2026-0001",
  "status": "draft",
  "order_date": "2026-01-03",
  "notes": "Quarterly order",
  "items": [
    {
      "product_id": 5,
      "qty": 10,
      "unit_price": 15.99
    },
    {
      "product_id": 6,
      "qty": 5,
      "unit_price": 29.99
    }
  ]
}
```

#### Update Purchase Order (Header Only)
```http
PUT /api/purchase-orders/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "submitted",
  "order_date": "2026-01-04",
  "notes": "Updated notes"
}
```

#### Update Purchase Order Items
```http
PUT /api/purchase-orders/:id/items
Authorization: Bearer {token}
Content-Type: application/json

{
  "items": [
    {
      "product_id": 5,
      "qty": 15,
      "unit_price": 15.99
    }
  ]
}
```

#### Delete Purchase Order
```http
DELETE /api/purchase-orders/:id
Authorization: Bearer {token}
```

### Dashboard

#### Get Dashboard Stats
```http
GET /api/dashboard
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "data": {
    "vendors": 5,
    "products": 18,
    "openPurchaseOrders": 2,
    "totalPurchaseOrders": 4
  }
}
```

## 🧪 Testing the Application

1. **Start both servers** (backend on :5000, frontend on :3000)
2. **Open browser** to http://localhost:3000
3. **Login** with demo credentials
4. **Explore features:**
   - View dashboard statistics
   - Browse vendors list
   - Create a new vendor
   - Add contacts and products to a vendor
   - Create a purchase order
   - Search and filter vendors

## 🔧 Development

### Backend Scripts

```bash
npm run dev     # Start with nodemon (auto-reload)
npm start       # Start in production mode
```

### Frontend Scripts

```bash
npm run dev     # Start dev server with hot reload
npm run build   # Build for production
npm run preview # Preview production build
```

## 🐛 Troubleshooting

### Database Connection Issues

**Error:** `ER_ACCESS_DENIED_ERROR`
- Check `DB_USER` and `DB_PASSWORD` in `.env`
- Verify MySQL user has proper permissions

**Error:** `ER_BAD_DB_ERROR`
- Run `database/schema.sql` to create the database
- Verify `DB_NAME` matches the database name

### JWT Token Issues

**Error:** `Invalid token`
- Clear browser localStorage
- Generate a new `JWT_SECRET` in `.env`
- Login again to get a fresh token

### CORS Issues

- Backend already has CORS enabled
- If issues persist, check that `VITE_API_URL` in frontend matches backend URL

### Port Already in Use

```bash
# Find and kill process using port 5000 (backend)
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Find and kill process using port 3000 (frontend)
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

## 📝 Notes

### Security Considerations

- **JWT_SECRET** should be a long, random string in production
- **Password requirements** can be enhanced (currently minimum 6 characters)
- **HTTPS** should be used in production
- **Rate limiting** should be added for production
- **Input sanitization** is basic - enhance for production use

### Database

- Uses MySQL **transactions** for purchase order operations
- **Cascading deletes** configured for related records
- **Indexes** added for frequently queried columns
- **ENUM types** used for status fields

### API Design

- RESTful conventions followed
- Consistent JSON response format
- Pagination using `page` and `limit` query parameters
- All protected routes require JWT in `Authorization: Bearer <token>` header

## 🚀 Production Deployment

### Backend

1. Set `NODE_ENV=production` in `.env`
2. Use a strong `JWT_SECRET`
3. Configure production MySQL database
4. Consider using PM2 for process management
5. Set up reverse proxy (nginx/Apache)
6. Enable HTTPS

### Frontend

```bash
npm run build
```

- Serve the `dist/` folder using a static file server
- Configure environment variables for production API URL

## 📄 License

MIT

## 👨‍💻 Author

Created as a demonstration of full-stack development with Node.js, Express, React, and MySQL.

---

**Happy Coding! 🎉**
