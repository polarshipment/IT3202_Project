import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

/* General Pages */
// import Login from "./pages/login/login";
// register page if mada

/* User Pages */
import Products from './pages/products/Products';



function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* General Page Routes*/}
        {/* <Route path="/" element={<Login />} /> */}

        {/* User Page Routes */}
        <Route path="/" element={<Products />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
