import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { Toaster } from './components/ui/sonner';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import SellerDashboard from './pages/Dashboard/SellerDashboard';
import BuyerDashboard from './pages/Dashboard/BuyerDashboard';
import AdminDashboard from './pages/Admin/AdminDashboard';
import Checkout from './pages/Checkout';
import ChatInterface from './pages/Chat/ChatInterface';
import SellerRequestForm from './pages/SellerOnboarding/RequestForm';
import StoreSetup from './pages/SellerOnboarding/StoreSetup';
import AdminSellerRequests from './pages/Admin/SellerRequests';
import { useAuth } from './context/AuthContext';

const ProtectedRoute = ({ 
  children, 
  role,
  requiredRole 
}: { 
  children: React.ReactNode, 
  role?: string,
  requiredRole?: string | string[]
}) => {
  const { user, profile, loading } = useAuth();
  
  if (loading) return (
    <div className="h-screen w-screen flex items-center justify-center flex-col gap-4">
      <div className="h-12 w-12 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-orange-600 font-bold uppercase tracking-widest text-xs">Marketly</p>
    </div>
  );
  
  if (!user) return <Navigate to="/login" />;
  
  const userRole = profile?.role;
  
  // If specific role required
  if (requiredRole) {
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    // Admins can access everything usually, but here we enforce strictness or allow them
    if (!roles.includes(userRole || '') && userRole !== 'super_admin' && userRole !== 'admin') {
      return <Navigate to="/" />;
    }
  }

  // Legacy prop support
  if (role && userRole !== role && userRole !== 'super_admin' && userRole !== 'admin') {
    return <Navigate to="/" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/product/:id" element={<ProductDetails />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                
                <Route 
                  path="/checkout" 
                  element={
                    <ProtectedRoute>
                      <Checkout />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/messages" 
                  element={
                    <ProtectedRoute>
                      <ChatInterface />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/become-seller" 
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <SellerRequestForm />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/dashboard/buyer" 
                  element={
                    <ProtectedRoute requiredRole="buyer">
                      <BuyerDashboard />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/dashboard/seller" 
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <Navigate to="/seller" />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/dashboard/admin" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Navigate to="/admin" />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/dashboard/super-admin" 
                  element={
                    <ProtectedRoute requiredRole="super_admin">
                      <Navigate to="/admin" />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/seller/setup" 
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <StoreSetup />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/seller/*" 
                  element={
                    <ProtectedRoute requiredRole="seller">
                      <SellerDashboard />
                    </ProtectedRoute>
                  } 
                />
                
                <Route 
                  path="/admin/requests" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminSellerRequests />
                    </ProtectedRoute>
                  } 
                />

                <Route 
                  path="/admin/*" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />

                <Route path="*" element={<Navigate to="/" />} />
              </Routes>
            </main>
            <Footer />
          </div>
          <Toaster position="top-center" richColors />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;