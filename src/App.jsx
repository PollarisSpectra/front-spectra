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
import ListarSessao from './pages/ListarSessao.jsx';
import ListarFilmes from "./pages/ListarFilmes.jsx";
import AdminLayout from './pages/Admin/AdminLayout/AdminLayout.jsx';

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
        
        {/* Rotas Administrativas - Protegidas por AdminLayout */}
        <Route path="/cadastro-sala" element={
          <AdminLayout>
            <CadastroSala />
          </AdminLayout>
        } />
        <Route path="/editarfilme" element={
          <AdminLayout>
            <EditarFilme />
          </AdminLayout>
        } />
        <Route path="/sala/:id/editar" element={
          <AdminLayout>
            <EditarSala />
          </AdminLayout>
        } />
        <Route path="/cadastrofilme" element={
          <AdminLayout>
            <CadastroFilme />
          </AdminLayout>
        } />
        <Route path="/sessoes/:id/editar" element={
          <AdminLayout>
            <EditarSessao />
          </AdminLayout>
        } />
        <Route path="/sessoes/criar" element={
          <AdminLayout>
            <CadastroSessao />
          </AdminLayout>
        } />
        <Route path="/dashboardAdm" element={
          <AdminLayout>
            <DashboardAdm />
          </AdminLayout>
        } />
        <Route path="/sessoes" element={
          <AdminLayout>
            <ListarSessao />
          </AdminLayout>
        } />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;