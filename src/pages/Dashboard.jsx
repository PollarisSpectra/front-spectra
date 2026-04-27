import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"
import DashboardAdm from "./DashboardAdm";

export function Dashboard({ usuario, setUsuario }) {
    const navigate = useNavigate();

    useEffect(() => {
        const usuarioSessao = localStorage.getItem("usuario")

        if (!usuarioSessao) {
            navigate("/login");
        }

        setUsuario(JSON.parse(usuarioSessao));
    }, [])

    async function handleLogout() {
        const resposta = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
        });

        if (resposta.ok) {
            localStorage.removeItem("usuario");
            setUsuario(null);
            navigate("/");
        }
    }

    return usuario?.tipo !== 0 ? (
        <div className="container text-white py-5" style={{minHeight: '100vh '}}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <h2>Olá, {usuario?.nome}</h2>
                <button className="bg-white fw-semibold px-2 rounded-2" onClick={handleLogout}>Sair</button>
            </div>
        </div>
    ) : <DashboardAdm />
}