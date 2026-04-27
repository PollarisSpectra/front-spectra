import { Form, Route, Routes } from 'react-router-dom'
import { useState } from "react";
import Home from './pages/Home'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer.jsx'
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./components/Erro/NotFound.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import { Dashboard } from './pages/Dashboard.jsx';
import EditarFilme from "./components/EditarFilme/EditarFilme.jsx";
import EditarSala from "./components/EditarSala/EditarSala.jsx";
import CadastroFilme from "./components/CadastroFilme/CadastroFilme.jsx";
import CadastroSala from "./pages/CadastroSala.jsx";
import EditarSessao from "./components/EditarSessao/EditarSessao.jsx";
import CadastroSessao from "./components/CadastroSessao/CadastroSessao.jsx";
import DashboardAdm from "./pages/DashboardAdm.jsx";

function App() {
  const [usuario, setUsuario] = useState(null);

  return (
    <>
      <Header usuario={usuario} setUsuario={setUsuario} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login usuario={usuario} setUsuario={setUsuario} />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/dashboard" element={<Dashboard usuario={usuario} setUsuario={setUsuario} />} />
        {/* <Route path="/cadastro-filme" element={<CadastroFilme />} /> */}
        <Route path="/cadastro-sala" element={<CadastroSala />} />
        <Route path="/editarfilme" element={<EditarFilme />} />
        <Route path="/editarsala" element={<EditarSala />} />
        <Route path="/cadastrofilme" element={<CadastroFilme />} />
        {/* <Route path="/cadastrosala" element={<CadastroSala />} /> */}
        <Route path="/Editarsessao" element={<EditarSessao />} />
        <Route path="/Cadastrossessao" element={<CadastroSessao />} />
        <Route path="/dashboardAdm" element={<DashboardAdm />} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;