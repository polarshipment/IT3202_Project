import axios from 'axios';
import React, { useState, useEffect } from 'react';
import config from '../../util/config';

function Dashboard() {
  const userDetails = localStorage.getItem("user");
  const user = userDetails ? JSON.parse(userDetails) : null;

  const [products, setProducts] = useState([]); 
  const [selectedProductId, setSelectedProductId] = useState(null); 
  const [quantity, setQuantity] = useState(0); 
 
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${config.API}`);
        console.log('Fetched products:', response.data);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const handleChange = (event) => {
    const selectedProductIdInt = parseInt(event.target.value, 10);
    setSelectedProductId(selectedProductIdInt);
    if (selectedProductIdInt) {
      console.log('Selected product ID:', selectedProductIdInt);
    }
  };

  const handleQuantityChange = (event) => {
    const newQuantity = parseInt(event.target.value, 10);
    if (isNaN(newQuantity) || newQuantity < 0) {
      setQuantity(0); 
      console.error('Invalid quantity entered.');
    } else {
      console.log('Quantity is ', quantity)
      setQuantity(newQuantity);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!products.length) {
      console.error('Product list not loaded yet.');
      return;
    }

    if (!selectedProductId || quantity <= 0) {
      alert('Please select a product and enter a valid quantity.');
      return;
    }

    const product = products.find((p) =>p.id === parseInt(selectedProductId, 10));
    if (!product) {
      console.error('Selected product not found in product list.');
      return;
    }

    const updatedQuantity = product.stock - quantity;
    if (updatedQuantity < 0) {
      alert('Insufficient stock for this product.');
      return;
    }

    try {
      const updateResponse = await axios.put(`${config.API}`, {
        id: selectedProductId,
        stock: updatedQuantity,
      });
      console.log('Product stock updated:', updateResponse.data);
      alert('Product stock updated!');

      setProducts(products.map((p) => (p.id === selectedProductId ? { ...p, stock: updatedQuantity } : p)));

    } catch (error) {
      console.error('Error updating product stock:', error);
    }
  };


  return (
    <div className='h-full w-full py-10 flex justify-center'>
      <div className="w-8/12 h-full bg-white p-5 flex flex-col">
        <div className="border-b-[1px] border-custom-grey2 py-1 pb-5">
        Welcome {user ? user.name : "Guest"}!
        </div>
        <div className="h-full w-full flex justify-center items-center">
          <form onSubmit={handleSubmit}>
            <div className="mb-5">
              <label className="">Select a Product</label>
              <select value={selectedProductId === null ? '' : selectedProductId} onChange={handleChange} className="mt-1 p-2 w-full border-2 border-gray-300">
                <option value="" disabled>Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.product_name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-5">
              <label className="">Quantity of Order</label>
              <input
                type="number"
                min="0"
                className="mt-1 p-2 w-full border-2 border-gray-300"
                value={quantity}
                onChange={handleQuantityChange}
              />
            </div>

            <div style={{ textAlign: 'center' }}>
            <button className="bg-custom-skyblue text-white px-10 py-2 rounded-md">SUBMIT</button>
            </div>
          </form> 
        </div>
      </div>
    </div>
  )
}

export default Dashboard