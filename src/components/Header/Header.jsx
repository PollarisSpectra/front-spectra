import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Vector from '../../assets/Vector.svg'
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className="container-fluid bg-black d-flex">
            <div className="container py-2 d-flex justify-content-between">
                <Link to={"/"}>
                    <img src={logo} width={100} alt="logo" />
                </Link>
                <div className={styles["header-actions"] + " d-flex align-items-center justify-content-between gap-1"}>
                    <Link to={"/cadastro"} className={styles.link + " text-white px-2 py-1 rounded-3 "}>
                        Cadastrar
                    </Link>
                    <Link to={"/login"} className={styles.login + " text-black fs-6 bg-white fw-semibold px-2 py-1 rounded-3 d-flex align-items-center gap-1"}>
                        <img src={Vector} alt="login" className={styles["Vector"]} />
                        Login
                    </Link>
                </div>
            </div>
        </header>
    )
}