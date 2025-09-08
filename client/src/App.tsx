import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import RegistrationForm from './pages/RegistrationForm';
import LoginForm from './pages/LoginForm';
import VegetablesPage from './pages/VegetablesPage';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';

import { Toaster } from 'sonner';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <Routes>
          <Route path="/" element={<Navigate to="/vegetables" />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/login" element={<LoginForm />} />

          {/* Protected Routes */}
          <Route
            path="/vegetables"
            element={
              <ProtectedRoute>
                <VegetablesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Toaster position="top-right" />
      </div>
    </Router>
  );
}

export default App;
