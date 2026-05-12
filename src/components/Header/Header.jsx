import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Vector from '../../assets/Vector.svg'
import styles from './Header.module.css';

export default function Header({ usuario, setUsuario }) {
    const navigate = useNavigate();

    async function handleLogout() {
        const resposta = await fetch("http://localhost:5000/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (resposta.ok) {
            localStorage.removeItem("usuario");
            setUsuario(null);
            navigate("/");
        }
    }

    return (
        <header className="container-fluid bg-black d-flex">
            <div className="container py-2 d-flex justify-content-between">
                <Link to={"/"}>
                    <img src={logo} width={100} alt="logo" />
                </Link>
                <div className={styles["header-actions"] + " d-flex align-items-center justify-content-between gap-1"}>
                    <Link to={usuario ? "/app" : "/cadastro"} className={styles.link + " text-white px-2 py-1 rounded-3 "}>
                        {usuario ? "Dashboard" : "Cadastre-se"}
                    </Link>
                    <Link to={!usuario && "/login"} onClick={usuario && handleLogout} className={styles.login + " text-black fs-6 bg-white fw-semibold px-2 py-1 rounded-3 d-flex align-items-center gap-1"}>
                        <img src={Vector} alt="login" className={styles["Vector"]} />
                        {usuario ? "Logout" : "Login"}
                    </Link>
                </div>
            </div>
        </header>
    )
}