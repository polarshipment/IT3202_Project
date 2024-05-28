import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './LoginValidation';

function Login() {
  const[formData, setFormData] = useState({
    email: '',
    pass: ''
  })

  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: [e.target.value] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors(Validation(formData));
    if(errors.email === "" && errors.pass === "") {
      axios.post('http://localhost:7000/login', formData)
      .then(res => {
        if(res.data.status === 200){
          navigate('/user');
        } else {
          alert(res.data.message);
        }
      })
      .catch(err => console.log(err));
    }
  }

  return (
    <div className="h-screen w-screen bg-custom-grey1 flex justify-center items-center">
      <div className="h-[90%] w-4/5 bg-white flex justify-center items-center">
        <div className="w-3/5 border border-black flex flex-col items-center justify-center">

          <h1 className="font-['Open_Sans'] font-bold text-5xl mb-10 mt-12">CMS SARI-SARI</h1>

          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="mb-6 w-2/4">
              <label htmlFor="email">Email</label>
              <input 
                type="email" name="email" 
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                placeholder="Enter Email" required
                onChange={handleChange}
              />
              {errors.email && <span className="text-red-700 italic text-sm">{errors.email}</span>}
            </div>
            <div className="mb-10 w-2/4">
              <label htmlFor="pass">Password</label>
              <input 
                type="password" name="pass"
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                placeholder="Enter Password" required
                onChange={handleChange}
              />
              {errors.pass && <span className="text-red-700 italic text-sm">{errors.pass}</span>}
            </div>
            <button type="submit" className="bg-custom-skyblue text-white text-2xl px-16 py-[10px] rounded-xl">SUBMIT</button>
          </form>

          <p className="mt-2 mb-12">Don't have an account? <Link to='/register' className="text-custom-skyblue">Register here</Link></p>
        
        </div>
      </div>
    </div>
  )
}

export default Login