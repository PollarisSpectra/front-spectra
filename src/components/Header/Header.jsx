import { Link } from 'react-router-dom';
import logo from '../../assets/logo.svg';
import Vector from '../../assets/Vector.svg';
import styles from './Header.module.css';

export default function Header() {
    return (
        /* Adicionei a classe border-bottom-red personalizada para a linha vermelha */
        <header className={`${styles.headerContainer} container-fluid bg-black`}>
            <div className="container py-2 d-flex justify-content-between align-items-center">

                {/* Logo: Diminui um pouco no mobile para sobrar espaço */}
                <Link to={"/"} className="d-flex align-items-center">
                    <img src={logo} className={styles.logoImg} alt="logo" />
                </Link>

                <div className="d-flex align-items-center gap-2 gap-md-4">
                    <Link
                        to={"/cadastro"}
                        className={`${styles.link} text-white text-decoration-none fw-bold small`}
                    >
                        CADASTRAR
                    </Link>

                    <Link
                        to={"/login"}
                        className="btn btn-light btn-sm fw-bold d-flex align-items-center gap-2 px-3 py-1"
                    >
                        <img src={Vector} alt="login" className={styles.loginIcon} />
                        <span className="d-none d-sm-inline">LOGIN</span>
                    </Link>
                </div>

            </div>
        </header>
    );
}