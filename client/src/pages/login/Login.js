import React from 'react'
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="h-screen w-screen bg-custom-grey1 flex justify-center items-center">
      <div className="h-[90%] w-4/5 bg-white flex justify-center items-center">
        <div className="h-4/5 w-2/3 border border-black flex flex-col items-center justify-center">
          <h1 className="font-['Open_Sans'] font-bold text-5xl mb-10">ONLINE SARI-SARI</h1>
          <div className="mb-6 w-2/4">
            <label>Email</label>
            <input type="text" 
              className="mt-1 p-2 w-full border-2 border-gray-300" 
              // onChange={ e => setPrice(e.target.value)}
            />
          </div>
          <div className="mb-10 w-2/4">
            <label>Password</label>
            <input type="password" 
              className="mt-1 p-2 w-full border-2 border-gray-300" 
              // onChange={ e => setPrice(e.target.value)}
            />
          </div>
          <Link to='/user' className="bg-custom-skyblue text-white text-2xl px-16 py-[10px] rounded-xl">SUBMIT</Link>
        </div>
      </div>
    </div>
  )
}

export default Login