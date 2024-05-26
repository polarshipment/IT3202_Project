import React from 'react'

function Navbar() {
  return (
    <nav className="w-screen flex flex-row justify-between items-center bg-white px-5 py-4 border-b-[5px] border-custom-grey2">
      <h1 className="font-['Open_Sans'] font-bold text-2xl">ONLINE SARI-SARI</h1>
      <div className="flex items-center font-['Barlow_Semi_Condensed'] text-xl">
        <div className="cursor-pointer ms-8">DASHBOARD</div>
        <div className="cursor-pointer ms-8">PRODUCTS</div>
        <div className="cursor-pointer border border-black px-4 py-1 ms-8">LOGOUT</div>
      </div>
    </nav>
  )
}

export default Navbar