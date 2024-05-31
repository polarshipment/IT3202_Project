import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import config from '../../util/config';


function UpdateProduct() {
    const {id} = useParams();
    const navigate = useNavigate()
    const location = useLocation();
    const { product } = location.state || {};

    const [product_name, setProductName] = useState('')
    const [stock, setStock] = useState('')
    const [price, setPrice] = useState('')

    useEffect(() => {
      if (product) {
        setProductName(product.product_name);
        setStock(product.stock);
        setPrice(product.price);
      }
    }, [product]);

    function handleSubmit(event) {
      event.preventDefault();
      axios.put(`${config.API}/update/`+ id, {product_name, stock, price}) 
      .then(res => {
        alert(res.data.message);
        navigate('/user/products');
      }).catch(err =>{
        console.log(err.response.data.message, err);
        alert('An error occurred. Please try again.');
      }); 
    }

    function handleCancel() {
      navigate('/user/products');
    }

    return (
      <div className="bg-custom-grey1 h-full w-full flex justify-center items-center">
        <div className="bg-white min-w-[35%] py-10 px-20 rounded-md shadow-md"> 
          <h1 className="text-4xl font-['Open_Sans'] font-bold text-center mb-10">Update Product</h1>
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label>Product Name:</label>
              <input 
                type="text" value={product_name}
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                onChange={ e => setProductName(e.target.value)}
                required
              />
            </div>
            <div className="mb-5">
              <label className="">Stock Available:</label>
              <input 
                type="number" value={stock}
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                onChange={e => setStock(Math.max(0, e.target.value))}
                min="0"
                required
              />
            </div>
            <div className="mb-5">
              <label className="">Price:</label>
              <input 
                type="number" value={price} step="0.01" 
                className="mt-1 p-2 w-full border-2 border-gray-300" 
                onChange={e => setPrice(Math.max(0, parseFloat(e.target.value)))} 
                min="0" 
                required
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
