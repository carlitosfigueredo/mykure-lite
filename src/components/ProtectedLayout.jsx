import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

function ProtectedLayout() {
  return (
    <>
      <Navbar />
      <div style={{ padding: '20px' }}>
        <Outlet />
      </div>
    </>
  );
}

export default ProtectedLayout;