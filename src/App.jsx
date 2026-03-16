import { useState } from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'

function App() {
  return (
    <>
      <Header />
      <Routes>
          <Route path="/" element={<Home />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
