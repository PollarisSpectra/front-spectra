import { Navigate, Outlet } from "react-router-dom";
import NotFound from "../../NotFound/NotFound";

export default function AdminLayout() {
    const usuario = localStorage.getItem('usuario');

    if (!usuario) return <Navigate to={"/login"} replace />;

    const usuarioParseado = JSON.parse(usuario);

    if (usuarioParseado?.tipo !== 0) {
        return <NotFound />
    }

    return <Outlet />;
}