import axios from 'axios';
import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

function UpdateProduct() {
    const [product_name, setProductName] = useState('')
    const [stock, setStock] = useState('')
    const [price, setPrice] = useState('')
    const {id} = useParams();
    const navigate = useNavigate()

    function handleSubmit(event) {
      event.preventDefault();
      axios.put('http://localhost:7000/update/'+ id, {product_name, stock, price}) 
      .then(res => {
        console.log(res);
        navigate('/');
      }).catch(err => console.log(err));
    }

    function handleCancel() {
      navigate('/');
    }

    return (
      <div className="bg-custom-grey1 h-full w-full flex justify-center items-center">
        <div className="bg-white min-w-[35%] py-10 px-20 rounded-md shadow-md"> 
          <h1 className="text-4xl font-['Open_Sans'] font-bold text-center mb-10">Update Product</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label>Product Name:</label>
              <input type="text" className="mt-1 p-2 w-full border-2 border-gray-300" 
              onChange={ e => setProductName(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="">Stock Available:</label>
              <input type="number" className="mt-1 p-2 w-full border-2 border-gray-300" 
              onChange={ e => setStock(e.target.value)}
              />
            </div>
            <div className="mb-5">
              <label className="">Price:</label>
              <input type="text" className="mt-1 p-2 w-full border-2 border-gray-300" 
            onChange={ e => setPrice(e.target.value)}
              />
            </div>
            <div style={{ textAlign: 'center' }}>
            <button className="bg-custom-red text-white px-10 py-2 rounded-md mr-2" onClick={handleCancel} >CANCEL</button>
            <button className="bg-custom-skyblue text-white px-10 py-2 rounded-md">UPDATE</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

export default UpdateProduct
