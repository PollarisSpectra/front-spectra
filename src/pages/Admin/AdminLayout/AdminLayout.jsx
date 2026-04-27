import { Navigate } from "react-router-dom";
import NotFound from "../../../components/Erro/NotFound";

export default function AdminLayout({ children }) {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) return <Navigate to={"/login"} replace />;

    const usuarioParseado = JSON.parse(usuario);

    if (usuarioParseado?.tipo !== 0) {
        return <NotFound />
    }

    return children;
}