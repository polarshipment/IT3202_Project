import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* General Pages */
import Login from './pages/login/Login';
import Register from './pages/register/Register';

/* User Pages */
import Layout from './components/layout/layout';
import Products from './pages/products/Products';
import AddProduct from './pages/products/AddProduct';
import UpdateProduct from './pages/products/UpdateProduct';
import Dashboard from './pages/dashboard/Dashboard'


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General Page Routes*/}
        <Route path="/" element={<Login />} />
        <Route path="register" element={<Register />} />

        {/* User Page Routes */}
        <Route path="user" element={<Layout />}>
          <Route index element={<Dashboard />} />                           {/* localhost/user */}
          <Route path="products" element={<Products />} />                  {/* localhost/user/products */}
          <Route path="products/add" element={<AddProduct />} />            {/* localhost/user/products/add*/}
          <Route path="products/update/:id" element={<UpdateProduct />} />  {/* localhost/user/products/update/1*/}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
