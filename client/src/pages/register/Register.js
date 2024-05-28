import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Validation from './RegisterValidation';

function Register() {

  const[formData, setFormData] = useState({
    name: '',
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
    if(errors.name === "" && errors.email === "" && errors.pass === "") {
      axios.post('http://localhost:7000/register', formData)
      .then(res => {
        alert(res.data.message);
        if(res.data.status === 200){
          navigate('/');
        }
      })
      .catch(err => {
          alert(err);
          console.log(err);
      });
    }
  }

  return (
    <div className="h-screen w-screen bg-custom-grey1 flex justify-center items-center">
      <div className="h-[92%] w-4/5 bg-white flex justify-center items-center">
        <div className="w-3/5 border border-black flex flex-col items-center justify-center">
          
          <h1 className="font-['Open_Sans'] font-bold text-5xl mb-10 mt-9">Sign Up</h1>
          
          <form onSubmit={handleSubmit} className="w-full flex flex-col items-center">
            <div className="mb-2 w-2/4">
              <label htmlFor="name">Name</label>
              <input 
                type="text" name="name"
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                placeholder="Enter Name" required
                onChange={handleChange}
              />
              {errors.name && <span className="text-red-700 italic text-sm">{errors.name}</span>}
            </div>
            <div className="mb-2 w-2/4">
              <label htmlFor="email">Email</label>
              <input 
                type="email" name="email" 
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                placeholder="Enter Email" required
                onChange={handleChange}
              />
              {errors.email && <span className="text-red-700 italic text-sm">{errors.email}</span>}
            </div>
            <div className="mb-9 w-2/4">
              <label htmlFor="pass">Password</label>
              <input 
                type="password" name="pass"
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                placeholder="Enter Password" required
                onChange={handleChange}
              />
              {errors.pass && <span className="text-red-700 italic text-sm">{errors.pass}</span>}
            </div>
            <button type="submit" className="bg-custom-skyblue text-white text-2xl px-16 py-[10px] rounded-xl">REGISTER</button>
          </form>

          <p className="mt-2 mb-9">Already have an account? <Link to='/' className="text-custom-skyblue">Sign in</Link></p>

        </div>
      </div>
    </div>
  )
}

export default Register