import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AddProduct() {
    const [product_name, setProductName] = useState('')
    const [stock, setStock] = useState('')
    const [price, setPrice] = useState('')
    const navigate = useNavigate()

    function handleSubmit(event) {
      event.preventDefault();
      axios.post('http://localhost:7000/add', {product_name, stock, price}) 
      .then(res => {
        console.log(res);
        navigate('/');
      }).catch(err => console.log(err));
    }

    function handleCancel() {
      navigate('/');
    }

    return (
      <div className="h-full w-full flex justify-center items-center">
        <div className="bg-white min-w-[35%] py-10 px-20 rounded-md shadow-md"> 
          <h1 className="text-4xl font-['Open_Sans'] font-bold text-center mb-10">Add New Product</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label>Product Name:</label>
              <input type="text" className="mt-1 p-2 w-full border-2 border-gray-300" 
              onChange={ e => setProductName(e.target.value)}
              required
              />
            </div>
            <div className="mb-5">
              <label className="">Stock Available:</label>
              <input type="number" className="mt-1 p-2 w-full border-2 border-gray-300" 
              onChange={e => setStock(Math.max(0, e.target.value))}
              min="0"
              required
              />
            </div>
            <div className="mb-5">
              <label className="">Price:</label>
              <input type="number" step="0.01" className="mt-1 p-2 w-full border-2 border-gray-300" 
                onChange={e => setPrice(Math.max(0, parseFloat(e.target.value)))} 
                min="0" 
                required
                />
            </div>
            <div style={{ textAlign: 'center' }}>
            <button className="bg-custom-red text-white px-10 py-2 rounded-md mr-2" onClick={handleCancel} >CANCEL</button>
            <button className="bg-custom-skyblue text-white px-10 py-2 rounded-md">CREATE</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

export default AddProduct
