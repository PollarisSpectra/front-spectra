import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"

export function Dashboard() {
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState(JSON.parse(localStorage.getItem("usuario")));

    useEffect(() => {
        if (!localStorage.getItem("usuario")) {
            navigate("/login");
        }
    }, [])

    async function handleLogout() {
        const resposta = await fetch("http://127.0.0.1:5000/logout", {
            method: "POST",
        });

        if (resposta.ok) {
            localStorage.removeItem("usuario");
            navigate("/");
        }
    }

    return (
        <div className="container text-white py-5" style={{minHeight: '100vh '}}>
            <div className="d-flex align-items-center justify-content-start gap-2">
                <h2>Olá, {usuario["nome"]}</h2>
                <button className="bg-white fw-semibold px-2 rounded-2" onClick={handleLogout}>Sair</button>
            </div>
        </div>
    )
}