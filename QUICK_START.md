# Local Vendor Management System - Quick Start Guide

## 🚀 Current Status

✅ **Backend**: Running on http://localhost:5000/api  
⏳ **Frontend**: Ready to start

## 📋 Prerequisites

- Node.js (v14 or higher) ✅ Installed
- npm (comes with Node.js) ✅ Installed

## 🎯 Getting Started

### Backend is Already Running! ✅

The backend server is currently running with:
- SQLite database (embedded, no MySQL server needed)
- Sample data already loaded
- JWT authentication enabled
- All API endpoints ready

### Start the Frontend

Open a **new terminal** and run:

```bash
cd "c:\Aditya\Projects\New folder\frontend"
npm install
npm run dev
```

The frontend will start on http://localhost:5173 (or similar port)

## 🔐 Demo Login Credentials

```
Email: demo@example.com
Password: demo123
```

## 📊 What's Included

### Sample Data
- **1 Demo User** - For testing authentication
- **5 Vendors** - Tech Supplies Inc, Global Electronics, Office Furniture Co, Print Solutions, Green Supplies
- **7 Vendor Contacts** - Sales managers, account executives, etc.
- **17 Products** - Office supplies, electronics, furniture
- **4 Purchase Orders** - With line items and different statuses

### Features
- ✅ User Authentication (Register/Login)
- ✅ Vendor Management (CRUD operations)
- ✅ Vendor Contacts Management
- ✅ Vendor Products Catalog
- ✅ Purchase Order Management
- ✅ Search and Filtering
- ✅ Responsive UI

## 🛠 API Testing (Optional)

### Test the API with curl:

1. **Health Check**:
```bash
curl http://localhost:5000/api/health
```

2. **Login and Get Token**:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"demo@example.com\", \"password\": \"demo123\"}"
```

3. **Get Vendors** (replace YOUR_TOKEN):
```bash
curl http://localhost:5000/api/vendors \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 📁 Project Structure

```
Local Vendor Management System/
├── backend/
│   ├── database/
│   │   ├── schema.sqlite.sql      # SQLite schema
│   │   └── vendor_management.db   # SQLite database file
│   ├── src/
│   │   ├── routes/                # API endpoints
│   │   ├── middleware/            # Auth middleware
│   │   ├── db/                    # Database connection
│   │   └── server.js              # Entry point
│   ├── .env                       # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/            # React components
│   │   ├── pages/                 # Page components
│   │   ├── services/              # API service
│   │   └── App.jsx                # Main app
│   ├── public/                    # Static assets
│   └── package.json
└── DATABASE_MIGRATION_SUMMARY.md  # Detailed documentation
```

## 🔄 Database Details

- **Type**: SQLite (embedded database, like H2 for Java)
- **File**: `backend/database/vendor_management.db`
- **Auto-created**: Yes, on first run with sample data
- **Persistent**: Yes, all data saved to disk
- **Reset**: Delete the `.db` file and restart to reset with sample data

## 🌐 Available URLs

- **Backend API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Frontend** (after starting): http://localhost:5173

## 🎨 Frontend Features

Once the frontend is running, you can:

1. **Login** with demo credentials
2. **Dashboard** - View statistics and recent activity
3. **Vendors Page**:
   - View all vendors in a table
   - Search vendors by name
   - Filter by status (active/inactive)
   - Add new vendors
   - Edit existing vendors
   - Delete vendors
4. **Vendor Details**:
   - View vendor information
   - Manage contacts
   - Manage products
   - Create purchase orders
5. **Purchase Orders**:
   - View all purchase orders
   - Filter by status (draft/submitted/received)
   - Create new purchase orders
   - View order details
   - Update order status

## ⚠️ Troubleshooting

### Backend Issues

1. **Port 5000 already in use**:
   - Edit `backend/.env` and change PORT to another number (e.g., 5001)
   - Restart the backend

2. **Database errors**:
   - Stop the backend
   - Delete `backend/database/vendor_management.db`
   - Restart the backend (database will recreate with sample data)

### Frontend Issues

1. **API connection errors**:
   - Make sure backend is running on port 5000
   - Check `frontend/src/services/api.js` for correct API URL

2. **Port 5173 already in use**:
   - Vite will automatically use the next available port
   - Check the terminal output for the actual port number

## 📝 Environment Variables

Backend `.env` file:
```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-12345
JWT_EXPIRES_IN=24h
NODE_ENV=development
```

## 🚦 Next Steps

1. ✅ Backend running successfully
2. **Start the frontend** (see instructions above)
3. **Login** with demo credentials
4. **Explore the application** and test all features
5. **Start building** your own features!

## 📚 API Documentation

See `DATABASE_MIGRATION_SUMMARY.md` for complete API endpoint documentation.

## 🎉 Success!

Your Local Vendor Management System is ready to use with:
- ✅ Embedded SQLite database (no external database server needed)
- ✅ Sample data preloaded
- ✅ Full REST API with authentication
- ✅ Modern React frontend
- ✅ All features working

---

**Questions?** Check `DATABASE_MIGRATION_SUMMARY.md` for more details.
