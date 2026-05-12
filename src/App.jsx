import { Form, Route, Routes } from 'react-router-dom'
import { useState } from "react";
import Home from './pages/Home'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer.jsx'
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./pages/NotFound/NotFound.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import { Dashboard } from './pages/Dashboard.jsx';
import EditarFilme from "./pages/Admin/Filme/EditarFilme/EditarFilme.jsx";
import EditarSala from "./pages/Admin/Sala/EditarSala/EditarSala.jsx";
import CadastroFilme from "./pages/Admin/Filme/CadastroFilme/CadastroFilme.jsx";
import CadastroSala from "./pages/Admin/Sala/CadastroSala/CadastroSala.jsx";
import EditarSessao from "./pages/Admin/Sessao/EditarSessao/EditarSessao.jsx";
import CadastroSessao from "./pages/Admin/Sessao/CadastroSessao/CadastroSessao.jsx";
import DashboardAdm from "./pages/DashboardAdm.jsx";
import ListarSessao from './pages/Admin/Sessao/ListarSessao/ListarSessao.jsx';
import ListarFilme from "./pages/Admin/Filme/ListarFilme/ListarFilme.jsx";
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout.jsx';
import ListarSala from './pages/Admin/Sala/ListarSala/ListarSala.jsx';
import SelecionarAssento from "./pages/Reserva/SelecionarAssento.jsx";
import ModalFilme from "./components/ModalFilme/ModalFilme.jsx";
import ResumoReserva from "./pages/Reserva/ResumoReserva.jsx";
import CadastroEmpresa from "./pages/Empresa/CadastroEmpresa.jsx";
import EditarEmpesa from "./pages/Empresa/EditarEmpresa.jsx";
import ListarEmpresa from "./pages/Empresa/ListarEmpresa.jsx";
import VariaveisCores from "./pages/VariaveisCores/VariaveisCores";

function App() {
  const [usuario, setUsuario] = useState(() => {
    const usuarioSalvo = localStorage.getItem("usuario");
    return usuarioSalvo ? JSON.parse(usuarioSalvo) : null;
  });

  return (
    <>
      <Header usuario={usuario} setUsuario={setUsuario} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/login" element={<Login usuario={usuario} setUsuario={setUsuario} />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="/dashboard" element={<Dashboard usuario={usuario} setUsuario={setUsuario} />} />
        <Route path="/SelecionarAssento" element={<SelecionarAssento />} />
        <Route path="/modalFilme" element={<ModalFilme />} />
        <Route path="/sessao/:id/assentos" element={<SelecionarAssento />} />
        <Route path="/resumoReserva" element={<ResumoReserva />} />
        <Route path="/CadastroEmpresa" element={<CadastroEmpresa />} />
        <Route path="/EditarEmpresa/:id" element={<CadastroEmpresa />} />
        <Route path="/ListarEmpresa" element={<ListarEmpresa />} />
        <Route path="/VariaveisCores" element={<VariaveisCores />} />

        {/* Rotas Administrativas - Protegidas por AdminLayout */}
        <Route path="/app" element={<AdminLayout />}>
          <Route index element={<DashboardAdm />} />

          {/* CRUD Sessões */}
          <Route path="sessoes">
            <Route index element={<ListarSessao />} />
            <Route path=":id/editar" element={<EditarSessao />} />
            <Route path="criar" element={<CadastroSessao />} />
          </Route>

          {/* CRUD Sala */}
          <Route path="salas">
            <Route index element={<ListarSala />} />
            <Route path=":id/editar" element={<EditarSala />} />
            <Route path="criar" element={<CadastroSala />} />
          </Route>

          {/* CRUD Filmes */}
          <Route path="filmes">
            <Route index element={<ListarFilme />} />
            <Route path=":id/editar" element={<EditarFilme />} />
            <Route path="criar" element={<CadastroFilme />} />
          </Route>

          {/* CRUD Sessões */}
          <Route path="empresa">
            <Route index element={<ListarEmpresa />} />
            <Route path=":id/editar" element={<EditarEmpesa />} />
            <Route path="criar" element={<CadastroEmpresa />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>

      <Footer />
    </>
  );
}

export default App;