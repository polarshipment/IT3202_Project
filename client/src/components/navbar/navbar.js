import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "../../util/axiosInstance";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/logout");
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-screen flex flex-row justify-between items-center bg-white px-5 py-4 border-b-[5px] border-custom-grey2">
      <Link to='/user' className="font-['Open_Sans'] font-bold text-2xl">ONLINE SARI-SARI</Link>
      <div className="flex items-center font-['Barlow_Semi_Condensed'] text-xl">
        <Link to='/user' className="cursor-pointer ms-8 hover:text-gray-500">DASHBOARD</Link>
        <Link to='/user/products' className="cursor-pointer ms-8 hover:text-gray-500">PRODUCTS</Link>
        <div 
          className="cursor-pointer border border-black px-4 py-1 ms-8 hover:bg-custom-grey1"
          onClick={handleLogout}
        >
          LOGOUT
        </div>      
      </div>
    </nav>
  )
}

export default Navbar