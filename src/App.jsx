import { useState } from 'react'
import {Form, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
