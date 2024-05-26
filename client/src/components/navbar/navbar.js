import React from 'react'

function Navbar() {
  return (
    <nav className="w-screen flex flex-row justify-between items-center bg-white px-5 py-4 border-b-[5px] border-custom-grey2">
      <a href='/user' className="font-['Open_Sans'] font-bold text-2xl">ONLINE SARI-SARI</a>
      <div className="flex items-center font-['Barlow_Semi_Condensed'] text-xl">
        <a href='/user' className="cursor-pointer ms-8 hover:text-gray-500">DASHBOARD</a>
        <a href='/user/products' className="cursor-pointer ms-8 hover:text-gray-500">PRODUCTS</a>
        <a href='#' className="cursor-pointer border border-black px-4 py-1 ms-8 hover:text-gray-500 hover:border-gray-500">LOGOUT</a>
      </div>
    </nav>
  )
}

export default Navbar