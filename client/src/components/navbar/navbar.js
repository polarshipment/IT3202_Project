import React from 'react';
import { useNavigate } from "react-router-dom";
import axios from "../../util/axiosInstance";

function Navbar() {
  const navigate = useNavigate();

  const handleNavigation = (path) => () => {
    navigate(path);
  };

  const handleLogout = async () => {
    try {
      // Make API call to backend to invalidate the session using the custom Axios instance
      await axios.post("/logout");
      // Clear local storage of the accessToken
      localStorage.removeItem("accessToken");
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="w-screen flex flex-row justify-between items-center bg-white px-5 py-4 border-b-[5px] border-custom-grey2">
      <div 
        className="font-['Open_Sans'] font-bold text-2xl"
        onClick={handleNavigation("/user")}
      >
        CMS SARI-SARI
      </div>

      <div className="flex items-center font-['Barlow_Semi_Condensed'] text-xl">
        <div 
          className="cursor-pointer ms-8 hover:text-gray-500"
          onClick={handleNavigation("/user")}
        >
          DASHBOARD
        </div>

        <div 
          className="cursor-pointer ms-8 hover:text-gray-500"
          onClick={handleNavigation("/user/products")}
        >
          PRODUCTS
        </div>

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