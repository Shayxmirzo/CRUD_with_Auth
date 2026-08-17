import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Suspense, useState } from "react"
import Dashboard from "./pages/Dashboard"
import Layout from "./components/Outlet"
import Categories from "./pages/Categories"
import Product from "./pages/Product"
import Cookies from "js-cookie"
import Login from "./pages/Login"
import Register from "./pages/Register"
import ProtectekRoute from "./components/ProtectekRoute"
import { ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
function App() {
  const [auth, setAuth] = useState(Cookies.get("token") ? true : false)

  return (
    <>
    <BrowserRouter>
      <Suspense fallback={<div>loading...</div>}>
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/register" element={<Register />} />

          <Route
            element={
              <ProtectekRoute auth={auth}>
                <Layout setAuth={setAuth} />
              </ProtectekRoute>
            }
          >
            <Route path="/" element={<Dashboard />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/products" element={<Product />} />
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
    <ToastContainer/>
    </>
  )
}

export default App