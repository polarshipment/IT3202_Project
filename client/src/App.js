import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* General Pages */
// import Login from "./pages/login/login";
// register page if mada

/* User Pages */
import Products from './pages/products/Products';
import AddProduct from './pages/products/AddProduct';
import UpdateProduct from './pages/products/UpdateProduct';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General Page Routes*/}
        {/* <Route path="/" element={<Login />} /> */}

        {/* User Page Routes */}
        <Route path="/" element={<Products />} />
        <Route path="/add" element={<AddProduct/>} />
        <Route path="/update/:id" element={<UpdateProduct/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
