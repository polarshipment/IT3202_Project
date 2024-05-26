import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Products() {

  const [products, setProduct] = useState([])

  useEffect(() => {
      axios.get('http://localhost:7000/')
      .then(res => setProduct(res.data))
      .catch(err => console.log(err));
  })

  const handleDelete = async (id) => {  
    try {
      await axios.delete('http://localhost:7000/products/'+id)
      window.location.reload()  
    } catch(err) {
      console.log(err);
    } 
  }

  return (
    <div className="w-9/12 bg-white">
      <Link to="/add" className="bg-custom-skyblue text-white px-4 py-[6px] mb-10 ms-10">+ Add Product</Link>
      <table className="w-full">
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
            products.map((data, i) => (
              <tr key={i}>
                <td className="text-center">{data.id}</td>
                <td>{data.product_name}</td>
                <td className="text-center">{data.stock}</td>
                <td className="text-center">{data.price}</td>
                <td className="text-center">
                  <Link to={`update/${data.id}`} className="bg-custom-green text-white px-5 py-[10px] me-3">Update</Link>
                  <button className="bg-custom-red text-white px-5 py-[10px]" onClick={ e => handleDelete(data.id)}>Delete</button>
                </td>
              </tr>
            ))
          }
        </tbody>
      </table>
    </div>
  )
}

export default Products