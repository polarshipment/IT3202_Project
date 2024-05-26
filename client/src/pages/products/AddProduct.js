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

    return (
      <div className="bg-custom-grey1 h-screen w-screen flex justify-center items-center">
        <div className="bg-white p-4 h-2/4 rounded-md shadow-md w-2/5 flex justify-center items-center flex-col px-10"> 
          <h1 className="text-3xl font-['Open_Sans'] font-bold">Add New Product</h1>
          <form onSubmit={handleSubmit} className="w-full">
            <div className="mb-5">
              <label>Product Name:</label>
              <input type="text" className="mt-1 p-2 w-full border border-gray-300" 
              onChange={ e => setProductName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="">Stock Available:</label>
              <input type="number" className="mt-1 p-2 w-full border border-gray-300" 
              onChange={ e => setStock(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="">Price:</label>
              <input type="number" className="mt-1 p-2 w-full border border-gray-300" 
            onChange={ e => setPrice(e.target.value)}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
            <button className="bg-custom-skyblue text-white px-2 py-2 w-32 rounded-md">Create</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

export default AddProduct
