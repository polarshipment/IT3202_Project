import React from 'react'

function Login() {
  return (
    <div className="h-screen w-screen bg-custom-grey1 flex justify-center items-center">
      <div className="h-[90%] w-4/5 bg-white flex justify-center items-center">
        <div className="h-4/5 w-2/3 border border-black flex flex-col items-center justify-center">
          <h1 className="font-['Open_Sans'] font-bold text-5xl">ONLINE SARI-SARI</h1>

          <button className="bg-custom-skyblue text-white text-2xl px-16 py-[10px] rounded-xl mt-8">SUBMIT</button>
        </div>
      </div>
    </div>
  )
}

export default Login