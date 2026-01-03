import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import VendorList from './pages/VendorList';
import VendorForm from './pages/VendorForm';
import VendorDetail from './pages/VendorDetail';
import ContactForm from './pages/ContactForm';
import ProductForm from './pages/ProductForm';
import PurchaseOrderList from './pages/PurchaseOrderList';
import PurchaseOrderForm from './pages/PurchaseOrderForm';
import PurchaseOrderDetail from './pages/PurchaseOrderDetail';
import apiClient from './api/client';
import './App.css';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const token = apiClient.getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors" element={
          <ProtectedRoute>
            <VendorList />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors/new" element={
          <ProtectedRoute>
            <VendorForm />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors/:id" element={
          <ProtectedRoute>
            <VendorDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors/:vendorId/contacts/new" element={
          <ProtectedRoute>
            <ContactForm />
          </ProtectedRoute>
        } />
        
        <Route path="/vendors/:vendorId/products/new" element={
          <ProtectedRoute>
            <ProductForm />
          </ProtectedRoute>
        } />
        
        <Route path="/purchase-orders" element={
          <ProtectedRoute>
            <PurchaseOrderList />
          </ProtectedRoute>
        } />
        
        <Route path="/purchase-orders/new" element={
          <ProtectedRoute>
            <PurchaseOrderForm />
          </ProtectedRoute>
        } />
        
        <Route path="/purchase-orders/:id" element={
          <ProtectedRoute>
            <PurchaseOrderDetail />
          </ProtectedRoute>
        } />
        
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
