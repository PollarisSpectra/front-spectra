import css from "./HeaderLogado.module.css";
import { Link } from "react-router-dom";
import logo from '../../assets/logo.svg';

export default function Header() {
    return (
        <header className={css.header}>
            <div className={css.logoArea}>
                <img
                    src={logo}
                    alt="Logo Spectra"
                    className={css.logo}
                />
            </div>

            <nav className={css.nav}>
                <Link to="/dashboard" className={css.link}>
                    DASHBOARD
                </Link>

                <button className={css.botaoLogout}>
                    logout <span className={css.icone}>↪</span>
                </button>
            </nav>
        </header>
    );
}