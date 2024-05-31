import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import config from '../../util/config'

function Products() {

  const navigate = useNavigate();
  const [products, setProduct] = useState([])

  useEffect(() => {
      axios.get(`${config.API}/products`)
      .then(res => setProduct(res.data))
      .catch(err => console.log(err.response.data.message, err));
  })

  const handleDelete = async (id) => {  
    const isConfirmed = window.confirm("Confirm delete of Product ID: "+id+". Press OK to continue.");
    
    if(isConfirmed) {
      try {
        await axios.delete(`${config.API}/delete/`+id)
        navigate("/user/products");
      } catch(err) {
        console.log(err.response.data.message, err);
        alert('An error occurred. Please try again.');
      } 
    }
  }

  return (
    <div className="h-full pt-14">
      <div className="w-9/12 mx-auto">
        <Link to="/user/products/add" className="bg-custom-skyblue text-white px-6 py-[11px] rounded-md hover:bg-[#0EC2E7]">+ Add Product</Link>
        <div className="w-full overflow-x-auto">
          <table className="w-full bg-white my-6">
            <thead>
              <tr>
                <th className="w-[5%]">#</th>
                <th>Name</th>
                <th className="w-[15%]">Stock Available</th>
                <th className="w-1/5">Price</th>
                <th className="w-[23%]">Actions</th>
              </tr>
            </thead>
            <tbody>
            {
              products.length === 0 ? (
                <tr><td colSpan="5" className="text-center italic py-10">No products listed yet.</td></tr>
              ) : (
                products.map((data, i) => (
                  <tr key={i}>
                    <td className="text-center">{data.id}</td>
                    <td>{data.product_name}</td>
                    <td className="text-center">{data.stock}</td>
                    <td className="text-center">{data.price}</td>
                    <td className="text-center">
                      <Link to={`update/${data.id}`} state={{ product: data }}  className="bg-custom-green text-white px-5 py-[10px] me-3 rounded-md">Update</Link>
                      <button className="bg-custom-red text-white px-5 py-[7.6px] rounded-md" onClick={ e => handleDelete(data.id)}>Delete</button>
                    </td>
                  </tr>
                ))
              )
            }
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Products