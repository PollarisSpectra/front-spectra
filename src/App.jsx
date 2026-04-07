import {Form, Route, Routes} from 'react-router-dom'
import Home from './pages/Home'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer.jsx'
import Cadastro from "./pages/Cadastro.jsx";
import Login from "./pages/Login.jsx";
import NotFound from "./components/Erro/NotFound.jsx";
import RecuperarSenha from "./pages/RecuperarSenha.jsx";
import { Dashboard } from './pages/Dashboard.jsx';
import HeaderLogado from "./components/HeaderLogado/HeaderLogado.jsx";
import {useState} from "react";

function App() {
    const [usuario, setUsuario] = useState(null);

    return (
        <>
            <Header usuario={usuario} setUsuario={setUsuario} />
            {/* <HeaderLogado /> */}
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/cadastro" element={<Cadastro />} />
                <Route path="/login" element={<Login usuario={usuario} setUsuario={setUsuario} />} />
                <Route path="/recuperar-senha" element={<RecuperarSenha />} />
                <Route path="/dashboard" element={<Dashboard usuario={usuario} setUsuario={setUsuario} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
            <Footer />
        </>
    )
}
export default App
