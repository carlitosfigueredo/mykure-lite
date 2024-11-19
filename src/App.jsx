// App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ProtectedRoute from './ProtectedRoute.jsx';
import Events from './components/Events';
import { AuthProvider } from './AuthContext.jsx';
import ProtectedLayout from './components/ProtectedLayout';
import EventAttendance from './components/EventAttendance';
import Draw from './components/Draw';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <ProtectedLayout />
              </ProtectedRoute>
            }
          >
            <Route path="events" element={<Events />} />
            <Route path="/attendance/:eventId" element={<EventAttendance  />} />
            <Route path="/draw/:eventId" element={<Draw  />} />
          </Route>
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;