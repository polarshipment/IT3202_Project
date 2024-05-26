import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../navbar/navbar';

function Layout() {
  return (
    <div className="h-screen flex flex-col bg-custom-grey1">
      <Navbar />
      <div className="w-full h-full">
        <Outlet />
      </div>
    </div>
  )
}

export default Layout