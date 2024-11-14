import React from 'react';
import { BrowserRouter, Routes, Route,Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './ProtectedRoute.jsx';
import Dashboard from './components/Dashboard'; // Página protegida
import { AuthProvider } from './AuthContext.jsx';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
